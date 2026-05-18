import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Person, PersonRequest, PersonStatus } from '../models/person.model';

export interface PeopleFilters {
  search?: string;
  status?: PersonStatus | 'all';
  city?: string;
  profession?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/people';

  getPeople(filters: PeopleFilters = {}): Observable<Person[]> {
    let params = new HttpParams();

    if (filters.search) {
      params = params.set('search', filters.search);
    }

    if (filters.status && filters.status !== 'all') {
      params = params.set('status', filters.status);
    }

    if (filters.city) {
      params = params.set('city', filters.city);
    }

    if (filters.profession) {
      params = params.set('profession', filters.profession);
    }

    return this.http.get<Person[]>(this.apiUrl, { params });
  }

  getPersonById(id: string): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  createPerson(person: PersonRequest): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, person);
  }

  updatePerson(id: string, person: PersonRequest): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${id}`, person);
  }

  deletePerson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}