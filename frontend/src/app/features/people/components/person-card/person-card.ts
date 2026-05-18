import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Person } from '../../../../core/models/person.model';

@Component({
  selector: 'app-person-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './person-card.html',
  styleUrl: './person-card.scss'
})
export class PersonCard {
  @Input({ required: true }) person!: Person;

  @Output() deletePerson = new EventEmitter<string>();

  get fullName(): string {
    return `${this.person.firstName} ${this.person.lastName}`;
  }

  onDelete(): void {
    this.deletePerson.emit(this.person.id);
  }
}