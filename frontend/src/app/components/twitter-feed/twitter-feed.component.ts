import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Tweet {
  id: string;
  text: string;
  author: string;
  profileImage: string;
  createdAt: string;
}

@Component({
  selector: 'app-twitter-feed',
  templateUrl: './twitter-feed.component.html',
  styleUrls: ['./twitter-feed.component.css']
})
export class TwitterFeedComponent implements OnInit {
  tweets: Tweet[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTweets();
  }

  fetchTweets() {
    this.http.get<Tweet[]>('/api/tweets')
      .subscribe({
        next: (data) => {
          this.tweets = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load tweets. Please try again later.';
          this.loading = false;
          console.error('Error fetching tweets:', err);
        }
      });
  }
} 