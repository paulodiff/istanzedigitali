// ======= ./app/cats/cat.routes.ts =====
// Imports
// Deprecated import
// import { RouterConfig } from '@angular/router';
import { Routes } from '@angular/router';

import { CatListComponent } from './cat-list.component';
import { CatDetailsComponent } from './cat-details.component';

// Route Configuration
export const catRoutes: Routes = [
  { path: 'cats', component: CatListComponent },
  { path: 'cats/:id', component: CatDetailsComponent }
];
