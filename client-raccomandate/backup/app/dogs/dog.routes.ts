// ======= ./app/cats/cat.routes.ts =====
// Imports
// Deprecated import
// import { RouterConfig } from '@angular/router';
import { Routes } from '@angular/router';

import { DogListComponent } from './dog-list.component';
import { DogDetailsComponent } from './dog-details.component';

// Route Configuration
export const dogRoutes: Routes = [
  { path: 'dogs', component: DogListComponent },
  { path: 'dogs/:id', component: DogDetailsComponent }
];
