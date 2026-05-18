import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { Person } from '../../../../core/models/person.model';
import { PeopleService } from '../../../../core/services/people';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message';
import { Loading } from '../../../../shared/components/loading/loading';
import { PersonCard } from '../../components/person-card/person-card';

@Component({
  selector: 'app-people-list',
  imports: [MatIconModule, PersonCard, Loading, ErrorMessage],
  templateUrl: './people-list.html',
  styleUrl: './people-list.scss'
})
export class PeopleList implements OnInit {
  private readonly peopleService = inject(PeopleService);

  readonly people = signal<Person[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.loading.set(true);
    this.error.set('');

    this.peopleService.getPeople().subscribe({
      next: (people: Person[]) => {
        this.people.set(people);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No pudimos cargar las personas.');
        this.loading.set(false);
      }
    });
  }

  deletePerson(id: string): void {
    this.peopleService.deletePerson(id).subscribe({
      next: () => {
        this.people.update((people) =>
          people.filter((person) => person.id !== id)
        );
      },
      error: () => {
        this.error.set('No pudimos eliminar la persona.');
      }
    });
  }
}