import { Request, Response } from 'express';
import { TwitterService } from '../services/twitter.service';
import { pool } from '../db/pool';

export class TwitterController {
  private twitterService: TwitterService;
  private readonly TIMEOUT = 60000; // Increased to 60 seconds timeout
  private isRefreshing = false;

  constructor() {
    this.twitterService = new TwitterService();
  }

  getTweets = async (req: Request, res: Response) => {
    try {
      console.log('Fetching tweets from database...');
      const result = await pool.query(`
        SELECT * FROM tweets 
        ORDER BY created_at DESC 
        LIMIT 10
      `);
      console.log('Tweets fetched from database:', result.rows.length);
      return res.json(result.rows);
    } catch (error) {
      console.error('Error in getTweets controller:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch tweets',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  refreshTweets = async (req: Request, res: Response) => {
    // Prevent concurrent refresh requests
    if (this.isRefreshing) {
      return res.status(429).json({ 
        error: 'Refresh in progress',
        message: 'Please wait for the current refresh to complete'
      });
    }

    this.isRefreshing = true;
    
    // Set timeout for the request
    const timeoutId = setTimeout(() => {
      this.isRefreshing = false;
      return res.status(504).json({ 
        error: 'Request timeout',
        message: 'The request took too long to complete. Please try again.'
      });
    }, this.TIMEOUT);

    try {
      console.log('Starting tweet refresh...');
      const tweets = await this.twitterService.searchTweets();
      
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);
      this.isRefreshing = false;

      if (!tweets || tweets.length === 0) {
        console.log('No tweets found from Twitter API');
        return res.status(404).json({ 
          error: 'No tweets found',
          message: 'No tweets were found matching the search criteria'
        });
      }

      console.log(`Successfully refreshed ${tweets.length} tweets`);
      return res.json({
        success: true,
        message: `Successfully refreshed ${tweets.length} tweets`,
        data: tweets
      });
    } catch (error: any) {
      // Clear the timeout since we got an error
      clearTimeout(timeoutId);
      this.isRefreshing = false;

      console.error('Error in refreshTweets:', error);
      
      // Handle rate limit errors specifically
      if (error.response?.status === 429) {
        const resetTime = error.response.headers?.['x-rate-limit-reset'];
        const waitSeconds = resetTime ? 
          Math.ceil((parseInt(resetTime) * 1000 - Date.now()) / 1000) :
          60;

        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: `Twitter API rate limit exceeded. Please wait ${waitSeconds} seconds before trying again.`,
          resetTime: resetTime
        });
      }

      // Handle other errors
      return res.status(500).json({ 
        error: 'Failed to refresh tweets',
        message: error.message || 'An unexpected error occurred',
        details: error.response?.data || null
      });
    }
  }
} 