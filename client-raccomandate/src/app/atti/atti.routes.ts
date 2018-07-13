// ======= ./app/cats/cat.routes.ts =====
// Imports
// Deprecated import
// import { RouterConfig } from '@angular/router';
import { Routes } from '@angular/router';

import { AttiListComponent } from './atti-list.component';


// Route Configuration
export const attiRoutes: Routes = [
  { path: 'atti', component: AttiListComponent },
  { path: 'atti/:action', component: AttiListComponent }
];
