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
const twitter_service_1 = require("./services/twitter.service");
require("dotenv/config");
function testTwitter() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const twitterService = new twitter_service_1.TwitterService();
            console.log('Testing Twitter API connection...');
            const tweets = yield twitterService.searchTweets('#techfest2025');
            console.log('Successfully fetched tweets:', tweets);
        }
        catch (error) {
            console.error('Error testing Twitter API:', error);
        }
    });
}
testTwitter();
