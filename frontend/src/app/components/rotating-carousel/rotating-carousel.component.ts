import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

interface CarouselItem {
  title: string;
  description: string;
  image: string;
  type: 'event' | 'judge';
}

@Component({
  selector: 'app-rotating-carousel',
  templateUrl: './rotating-carousel.component.html',
  styleUrls: ['./rotating-carousel.component.css'],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class RotatingCarouselComponent implements OnInit {
  items: CarouselItem[] = [];
  currentIndex = 0;
  interval: any;

  constructor() {
    this.items = [
      {
        title: 'Hackathon 2024',
        description: 'Join our annual hackathon and showcase your innovative ideas!',
        image: 'assets/images/hackathon 1.jpg',
        type: 'event'
      },
      {
        title: 'Tech Workshop Series',
        description: 'Learn from industry experts in our hands-on workshops.',
        image: 'assets/images/workshop 1.jpg',
        type: 'event'
      },
      {
        title: 'Latest Winners',
        description: 'Celebrating the achievements of our talented participants.',
        image: 'assets/images/Latest Winners1.jpg',
        type: 'event'
      },
      {
        title: 'Dr. Sarah Johnson',
        description: 'AI Research Director at Tech Innovations Lab with 15+ years of experience in machine learning and artificial intelligence.',
        image: 'assets/images/professionals.jpg',
        type: 'judge'
      },
      {
        title: 'Prof. Michael Chen',
        description: 'Distinguished Professor of Computer Science, specializing in cybersecurity and blockchain technology.',
        image: 'assets/images/hackathon 2.jpg',
        type: 'judge'
      }
    ];
  }

  ngOnInit() {
    this.startCarousel();
  }

  startCarousel() {
    this.interval = setInterval(() => {
      this.next();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
  }
} 