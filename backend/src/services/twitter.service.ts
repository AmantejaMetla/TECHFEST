import axios from 'axios';
import { pool } from '../db/pool';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
}

interface User {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}

export class TwitterService {
  private readonly bearerToken: string;
  private readonly baseUrl: string = 'https://api.twitter.com/2';
  private readonly hashtag: string;
  private lastRequestTime: number = 0;
  private readonly requestInterval: number = 15000; // Increased to 15 seconds
  private retryCount: number = 0;
  private readonly maxRetries: number = 3;
  private readonly baseDelay: number = 60000; // 1 minute base delay

  constructor() {
    this.bearerToken = process.env.TWITTER_BEARER_TOKEN || '';
    this.hashtag = process.env.TWITTER_HASHTAG || '#techfest2025';
    
    if (!this.bearerToken) {
      throw new Error('Twitter Bearer Token is not configured');
    }
  }

  private async wait(ms: number) {
    console.log(`Waiting for ${Math.ceil(ms / 1000)} seconds...`);
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateBackoffDelay() {
    // Exponential backoff: 1 min, 2 mins, 4 mins
    return this.baseDelay * Math.pow(2, this.retryCount);
  }

  private async handleRateLimit(error: any) {
    if (error.response?.status === 429) {
      const resetTime = error.response.headers['x-rate-limit-reset'];
      let waitTime: number;
      
      if (resetTime) {
        // Convert reset time to milliseconds and add 5 seconds buffer
        waitTime = (parseInt(resetTime) * 1000) - Date.now() + 5000;
      } else {
        // If no reset time provided, use exponential backoff
        waitTime = this.calculateBackoffDelay();
      }

      console.log(`Rate limited. Attempt ${this.retryCount + 1}/${this.maxRetries}`);
      console.log(`Waiting ${Math.ceil(waitTime / 1000)} seconds before retrying...`);
      
      await this.wait(waitTime);
      return true;
    }
    return false;
  }

  private async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.requestInterval) {
      await this.wait(this.requestInterval - timeSinceLastRequest);
    }
    this.lastRequestTime = Date.now();
  }

  async searchTweets(hashtag?: string): Promise<any[]> {
    try {
      await this.waitForRateLimit();
      
      const searchHashtag = hashtag || this.hashtag;
      console.log(`Searching for tweets with hashtag: ${searchHashtag}`);
      console.log('Making request to Twitter API...');
      
      const response = await axios.get(`${this.baseUrl}/tweets/search/recent`, {
        params: {
          query: searchHashtag,
          'tweet.fields': 'created_at,author_id',
          'user.fields': 'name,username,profile_image_url',
          expansions: 'author_id',
          max_results: 10
        },
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      this.retryCount = 0; // Reset retry count on success
      console.log('Successfully received response from Twitter API');

      if (!response.data?.data || !response.data?.includes?.users) {
        console.log('No tweets found matching the criteria');
        return [];
      }

      const tweets = response.data.data;
      const users = response.data.includes.users;

      // Clear old tweets before adding new ones
      await pool.query('DELETE FROM tweets');
      console.log('Cleared existing tweets from database');

      for (const tweet of tweets) {
        const user = users.find((u: any) => u.id === tweet.author_id);
        if (user) {
          await this.storeTweet(tweet, user);
        }
      }

      const storedTweets = await this.getStoredTweets();
      console.log(`Successfully stored and retrieved ${storedTweets.length} tweets`);
      return storedTweets;

    } catch (error: any) {
      console.error('Error details:', {
        status: error.response?.status,
        message: error.message,
        rateLimit: {
          limit: error.response?.headers?.['x-rate-limit-limit'],
          remaining: error.response?.headers?.['x-rate-limit-remaining'],
          reset: error.response?.headers?.['x-rate-limit-reset']
        }
      });

      if (await this.handleRateLimit(error)) {
        this.retryCount++;
        if (this.retryCount <= this.maxRetries) {
          console.log(`Initiating retry ${this.retryCount}/${this.maxRetries}`);
          return this.searchTweets(hashtag);
        } else {
          throw new Error(`Failed after ${this.maxRetries} retries. Please try again later.`);
        }
      }

      throw error;
    }
  }

  private async storeTweet(tweet: Tweet, user: User) {
    const queryText = `
      INSERT INTO tweets (tweet_id, content, author_name, author_handle, author_image_url, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (tweet_id) DO NOTHING
      RETURNING *
    `;
    
    try {
      const result = await pool.query(queryText, [
        tweet.id,
        tweet.text,
        user.name,
        `@${user.username}`,
        user.profile_image_url,
        new Date(tweet.created_at)
      ]);
      console.log(`Stored tweet from @${user.username}`);
      return result.rows[0];
    } catch (error) {
      console.error('Error storing tweet:', error);
      throw error;
    }
  }

  private async getStoredTweets(): Promise<any[]> {
    const queryText = `
      SELECT * FROM tweets 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    const result = await pool.query(queryText);
    return result.rows;
  }
} 