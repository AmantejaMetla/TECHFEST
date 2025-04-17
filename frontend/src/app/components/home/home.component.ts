import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  events = [
    {
      title: 'Hackathon 2025',
      image: 'assets/images/emma.jpg',

      date: '2025-04-15',
      location: 'Main Campus',
      description: 'Join us for 24 hours of coding, innovation, and fun!'
    },
    {
      title: 'Robotics Workshop',
      image: 'assets/images/workshop 1.jpg',
      date: '2025-04-16',
      location: 'Tech Lab',
      description: 'Learn the basics of robotics and build your own robot!'
    },
    {
      title: 'AI Summit',
      image: 'assets/images/bootcamp.png',
      date: '2025-04-17',
      location: 'Conference Hall',
      description: 'Explore the latest in artificial intelligence and machine learning.'
    },
    {
      title: 'Cybersecurity Challenge',
      image: 'assets/images/cybersecurity.jpg',
      date: '2025-04-18',
      location: 'Security Lab',
      description: 'Test your skills in ethical hacking and network security.'
    },
    {
      title: 'Web Dev Bootcamp',
      image: 'assets/images/hackathon 2.jpg',
      date: '2025-04-19',
      location: 'Innovation Hub',
      description: 'Intensive workshop on modern web development technologies.'
    },
    {
      title: 'IoT Innovation Day',
      image: 'assets/images/iot.jpg',
      date: '2025-04-20',
      location: 'Smart Lab',
      description: 'Create innovative solutions using Internet of Things technology.'
    }
  ];

  judges = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'AI Research Lead',
      image: 'assets/images/professionals.jpg',
      company: 'Tech Innovations Inc.'
    },
    {
      name: 'Prof. Michael Chen',
      role: 'Robotics Expert',
      image: 'assets/images/stock images of professionals.jpg',
      company: 'University of Technology'
    },
    {
      name: 'Emma Williams',
      role: 'Software Architect',
      image: 'assets/images/emma.jpg',
      company: 'Future Systems'
    }
  ];

  recentWinners = [
    {
      name: 'Team Innovators',
      event: 'Hackathon 2024',
      image: 'assets/images/winner1.jpg',
      achievement: 'First Place'
    },
    {
      name: 'RoboTech Squad',
      event: 'Robotics Challenge',
      image: 'assets/images/winners2.jpg',
      achievement: 'Grand Prize'
    }
  ];

  testimonials = [
    {
      quote: "TECHFEST was an incredible experience! The workshops were enlightening and the networking opportunities were invaluable.",
      author: "John Smith",
      role: "Previous Participant"
    },
    {
      quote: "The level of innovation and creativity at TECHFEST was mind-blowing. Can't wait for next year!",
      author: "Lisa Chen",
      role: "Hackathon Winner 2023"
    },
    {
      quote: "As a first-time participant, I was amazed by the supportive community and cutting-edge technology showcased at TECHFEST.",
      author: "David Park",
      role: "Student Developer"
    },
    {
      quote: "TECHFEST provided an excellent platform to showcase our AI project. The feedback from industry experts was invaluable.",
      author: "Sarah Thompson",
      role: "AI Challenge Winner"
    },
    {
      quote: "The mentorship and guidance we received during the hackathon helped us transform our idea into a viable product.",
      author: "Michael Rodriguez",
      role: "Startup Founder"
    },
    {
      quote: "TECHFEST's workshops opened my eyes to new possibilities in quantum computing. A truly enriching experience!",
      author: "Emily Zhang",
      role: "Research Scholar"
    },
    {
      quote: "The diversity of projects and talents at TECHFEST was inspiring. Made great connections and learned so much!",
      author: "Alex Kumar",
      role: "Software Engineer"
    },
    {
      quote: "Winning the robotics challenge at TECHFEST gave our team the confidence to pursue our innovations further.",
      author: "Rachel Foster",
      role: "Robotics Champion"
    },
    {
      quote: "The collaborative atmosphere at TECHFEST fostered incredible innovations. Met amazing people and built lasting connections.",
      author: "James Wilson",
      role: "Tech Entrepreneur"
    },
    {
      quote: "TECHFEST's cybersecurity track provided hands-on experience with the latest security tools and techniques.",
      author: "Nina Patel",
      role: "Security Expert"
    }
  ];

  displayedTestimonials: any[] = [];
  private readonly testimonialsToShow = 3;

  constructor() {
    // Pre-load images for better performance
    this.preloadImages();
  }

  ngOnInit(): void {
    // Initialize testimonials immediately
    this.rotateTestimonials();
  }

  private rotateTestimonials(): void {
    // Use a more efficient shuffling algorithm (Fisher-Yates)
    const shuffled = this.shuffleArray([...this.testimonials]);
    this.displayedTestimonials = shuffled.slice(0, this.testimonialsToShow);
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private preloadImages(): void {
    // Preload all images to prevent loading delays
    const imagesToPreload = [
      ...this.events.map(event => event.image),
      ...this.recentWinners.map(winner => winner.image),
      ...this.judges.map(judge => judge.image)
    ];

    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
} 