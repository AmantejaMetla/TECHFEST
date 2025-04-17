import { TwitterService } from './services/twitter.service';
import 'dotenv/config';

async function testTwitter() {
  try {
    const twitterService = new TwitterService();
    console.log('Testing Twitter API connection...');
    const tweets = await twitterService.searchTweets('#techfest2025');
    console.log('Successfully fetched tweets:', tweets);
  } catch (error) {
    console.error('Error testing Twitter API:', error);
  }
}

testTwitter(); 