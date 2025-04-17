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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterController = void 0;
const twitter_service_1 = require("../services/twitter.service");
const database_1 = require("../config/database");
class TwitterController {
    constructor() {
        this.getTweets = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const queryText = `
        SELECT * FROM tweets 
        ORDER BY created_at DESC 
        LIMIT 10
      `;
                const result = yield (0, database_1.query)(queryText);
                res.json(result.rows);
            }
            catch (error) {
                console.error('Error in getTweets:', error);
                res.status(500).json({
                    error: 'Failed to fetch tweets',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.refreshTweets = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tweets = yield this.twitterService.searchTweets('#techfest2025');
                res.json(tweets);
            }
            catch (error) {
                console.error('Error in refreshTweets:', error);
                res.status(500).json({
                    error: 'Failed to refresh tweets',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        this.twitterService = new twitter_service_1.TwitterService();
    }
}
exports.TwitterController = TwitterController;
