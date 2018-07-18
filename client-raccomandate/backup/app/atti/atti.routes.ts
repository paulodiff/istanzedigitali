// ======= ./app/cats/cat.routes.ts =====
// Imports
// Deprecated import
// import { RouterConfig } from '@angular/router';
import { Routes } from '@angular/router';

import { AttiListComponent } from './atti-list.component';
import { AttiNewComponent } from './atti-new.component';


// Route Configuration
export const attiRoutes: Routes = [
  { path: 'atti', component: AttiListComponent },
  { path: 'atti/inserimento', component: AttiNewComponent },
  { path: 'atti/ricerca', component: AttiListComponent }
];
