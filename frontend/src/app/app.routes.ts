import { Routes } from '@angular/router';

import { PeopleList } from './features/people/pages/people-list/people-list';

export const routes: Routes = [
  {
    path: '',
    component: PeopleList
  },
  {
    path: '**',
    redirectTo: ''
  }
];