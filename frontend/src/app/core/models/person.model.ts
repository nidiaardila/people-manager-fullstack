export type PersonStatus = 'active' | 'inactive';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  profession: string;
  status: PersonStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PersonRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  profession: string;
  status: PersonStatus;
}