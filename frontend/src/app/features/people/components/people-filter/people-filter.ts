import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { PersonStatus } from '../../../../core/models/person.model';

@Component({
  selector: 'app-people-filter',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './people-filter.html',
  styleUrl: './people-filter.scss'
})
export class PeopleFilter {
  @Input() searchTerm = '';
  @Input() selectedStatus: PersonStatus | 'all' = 'all';

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() selectedStatusChange = new EventEmitter<PersonStatus | 'all'>();
  @Output() applyFilters = new EventEmitter<void>();
  @Output() clearFilters = new EventEmitter<void>();
}