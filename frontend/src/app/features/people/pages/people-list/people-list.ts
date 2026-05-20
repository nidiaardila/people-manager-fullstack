import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { Person, PersonRequest } from '../../../../core/models/person.model';
import { PeopleService } from '../../../../core/services/people';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message';
import { Loading } from '../../../../shared/components/loading/loading';
import { PersonCard } from '../../components/person-card/person-card';
import { PersonForm } from '../../components/person-form/person-form';

@Component({
  selector: 'app-people-list',
  imports: [MatIconModule, PersonForm, PersonCard, Loading, ErrorMessage],
  templateUrl: './people-list.html',
  styleUrl: './people-list.scss'
})
export class PeopleList implements OnInit {
  private readonly peopleService = inject(PeopleService);

  @ViewChild(PersonForm) private personForm?: PersonForm;

  readonly people = signal<Person[]>([]);
  readonly selectedPerson = signal<Person | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
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

  savePerson(personRequest: PersonRequest): void {
    if (this.selectedPerson()) {
      this.updatePerson(personRequest);
      return;
    }

    this.createPerson(personRequest);
  }

  createPerson(personRequest: PersonRequest): void {
    this.saving.set(true);
    this.error.set('');

    this.peopleService.createPerson(personRequest).subscribe({
      next: (newPerson: Person) => {
        this.people.update((people) => [newPerson, ...people]);
        this.saving.set(false);
        this.personForm?.resetForm();
      },
      error: () => {
        this.error.set('No pudimos crear la persona.');
        this.saving.set(false);
      }
    });
  }

  updatePerson(personRequest: PersonRequest): void {
    const person = this.selectedPerson();

    if (!person) {
      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.peopleService.updatePerson(person.id, personRequest).subscribe({
      next: (updatedPerson: Person) => {
        this.people.update((people) =>
          people.map((item) =>
            item.id === updatedPerson.id ? updatedPerson : item
          )
        );

        this.selectedPerson.set(null);
        this.saving.set(false);
        this.personForm?.resetForm();
      },
      error: () => {
        this.error.set('No pudimos actualizar la persona.');
        this.saving.set(false);
      }
    });
  }

  editPerson(person: Person): void {
    this.selectedPerson.set(person);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  cancelEdit(): void {
    this.selectedPerson.set(null);
    this.personForm?.resetForm();
  }

  deletePerson(id: string): void {
    this.peopleService.deletePerson(id).subscribe({
      next: () => {
        this.people.update((people) =>
          people.filter((person) => person.id !== id)
        );

        if (this.selectedPerson()?.id === id) {
          this.cancelEdit();
        }
      },
      error: () => {
        this.error.set('No pudimos eliminar la persona.');
      }
    });
  }
}