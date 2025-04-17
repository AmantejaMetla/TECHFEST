"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterService = void 0;
const axios_1 = __importDefault(require("axios"));
const database_1 = require("../config/database");
class TwitterService {
    constructor() {
        this.baseUrl = 'https://api.twitter.com/2';
        this.lastRequestTime = 0;
        this.requestInterval = 2000; // 2 seconds between requests
        this.bearerToken = process.env.TWITTER_BEARER_TOKEN || '';
        this.hashtag = process.env.TWITTER_HASHTAG || '#techfest2025';
        if (!this.bearerToken) {
            throw new Error('Twitter Bearer Token is not configured');
        }
    }
    waitForRateLimit() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const timeSinceLastRequest = now - this.lastRequestTime;
            if (timeSinceLastRequest < this.requestInterval) {
                yield new Promise(resolve => setTimeout(resolve, this.requestInterval - timeSinceLastRequest));
            }
            this.lastRequestTime = Date.now();
        });
    }
    searchTweets(hashtag) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                yield this.waitForRateLimit();
                const searchHashtag = hashtag || this.hashtag;
                const response = yield axios_1.default.get(`${this.baseUrl}/tweets/search/recent`, {
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
                    }
                });
                // Check if we have data
                if (!((_a = response.data) === null || _a === void 0 ? void 0 : _a.data) || !((_c = (_b = response.data) === null || _b === void 0 ? void 0 : _b.includes) === null || _c === void 0 ? void 0 : _c.users)) {
                    console.log('No tweets found or invalid response structure:', response.data);
                    return [];
                }
                // Process and store tweets in database
                const tweets = response.data.data;
                const users = response.data.includes.users;
                for (const tweet of tweets) {
                    const user = users.find((u) => u.id === tweet.author_id);
                    if (user) {
                        yield this.storeTweet(tweet, user);
                    }
                }
                return yield this.getStoredTweets();
            }
            catch (error) {
                console.error('Error fetching tweets:', error);
                if (axios_1.default.isAxiosError(error)) {
                    if (((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === 429) {
                        console.error('Rate limit exceeded. Please wait before making more requests.');
                        const resetTime = error.response.headers['x-rate-limit-reset'];
                        if (resetTime) {
                            const waitTime = (parseInt(resetTime) * 1000) - Date.now();
                            console.log(`Waiting ${Math.ceil(waitTime / 1000)} seconds before retrying...`);
                            yield new Promise(resolve => setTimeout(resolve, waitTime));
                            return this.searchTweets(hashtag);
                        }
                    }
                    console.error('Twitter API Error:', {
                        status: (_e = error.response) === null || _e === void 0 ? void 0 : _e.status,
                        data: (_f = error.response) === null || _f === void 0 ? void 0 : _f.data
                    });
                }
                throw error;
            }
        });
    }
    storeTweet(tweet, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryText = `
      INSERT INTO tweets (tweet_id, content, author_name, author_handle, author_image_url, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (tweet_id) DO NOTHING
    `;
            yield (0, database_1.query)(queryText, [
                tweet.id,
                tweet.text,
                user.name,
                `@${user.username}`,
                user.profile_image_url,
                new Date(tweet.created_at)
            ]);
        });
    }
    getStoredTweets() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryText = `
      SELECT * FROM tweets 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
            const result = yield (0, database_1.query)(queryText);
            return result.rows;
        });
    }
}
exports.TwitterService = TwitterService;
