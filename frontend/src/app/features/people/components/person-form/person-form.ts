import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { Person, PersonRequest } from '../../../../core/models/person.model';

@Component({
  selector: 'app-person-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule
  ],
  templateUrl: './person-form.html',
  styleUrl: './person-form.scss'
})
export class PersonForm implements OnChanges {
  private readonly fb = inject(NonNullableFormBuilder);

  @Input() saving = false;
  @Input() personToEdit: Person | null = null;

  @Output() savePerson = new EventEmitter<PersonRequest>();
  @Output() cancelEdit = new EventEmitter<void>();

  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    city: [''],
    profession: [''],
    status: this.fb.control<'active' | 'inactive'>('active', {
      validators: [Validators.required]
    })
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['personToEdit']) {
      if (this.personToEdit) {
        this.form.patchValue({
          firstName: this.personToEdit.firstName,
          lastName: this.personToEdit.lastName,
          email: this.personToEdit.email,
          phone: this.personToEdit.phone,
          city: this.personToEdit.city,
          profession: this.personToEdit.profession,
          status: this.personToEdit.status
        });
      }
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.savePerson.emit(this.form.getRawValue());
  }

  resetForm(): void {
    this.form.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      profession: '',
      status: 'active'
    });
  }

  onCancelEdit(): void {
    this.cancelEdit.emit();
  }
}