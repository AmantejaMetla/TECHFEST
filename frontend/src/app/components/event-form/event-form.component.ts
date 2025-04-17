import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditing = false;
  currentEventId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image_url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  ngOnInit(): void {
    // Check if we're editing an existing event
    const eventId = localStorage.getItem('editingEventId');
    if (eventId) {
      this.isEditing = true;
      this.currentEventId = eventId;
      this.loadEvent(eventId);
    }
  }

  loadEvent(id: string): void {
    this.http.get(`http://localhost:5000/api/events/${id}`)
      .subscribe({
        next: (event: any) => {
          this.eventForm.patchValue({
            name: event.name,
            date: new Date(event.date).toISOString().slice(0, 16),
            location: event.location,
            description: event.description,
            image_url: event.image_url
          });
        },
        error: (error) => {
          console.error('Error loading event:', error);
          alert('Failed to load event details');
        }
      });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const eventData = {
        ...this.eventForm.value,
        date: new Date(this.eventForm.value.date).toISOString()
      };

      if (this.isEditing && this.currentEventId) {
        this.http.put(`http://localhost:5000/api/events/${this.currentEventId}`, eventData)
          .subscribe({
            next: () => {
              alert('Event updated successfully');
              this.resetForm();
            },
            error: (error) => {
              console.error('Error updating event:', error);
              alert('Failed to update event');
            }
          });
      } else {
        this.http.post('http://localhost:5000/api/events', eventData)
          .subscribe({
            next: () => {
              alert('Event created successfully');
              this.resetForm();
            },
            error: (error) => {
              console.error('Error creating event:', error);
              alert('Failed to create event');
            }
          });
      }
    }
  }

  resetForm(): void {
    this.eventForm.reset();
    this.isEditing = false;
    this.currentEventId = null;
    localStorage.removeItem('editingEventId');
  }
} 