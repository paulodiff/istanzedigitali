// ======= ./app/cats/cat.routes.ts =====
// Imports
// Deprecated import
// import { RouterConfig } from '@angular/router';
import { Routes } from '@angular/router';

import { ConsegnaListComponent } from './consegna-list.component';
import { ConsegnaNewComponent } from './consegna-new.component';
import { ConsegnaComponent } from './consegna.component';


// Route Configuration
export const consegnaRoutes: Routes = [
  { path: 'consegna', component: ConsegnaListComponent },
  { path: 'consegna/inserimento', component: ConsegnaComponent },
  { path: 'consegna/visualizzazione/:id', component: ConsegnaNewComponent },
  { path: 'consegna/ricerca', component: ConsegnaListComponent }
];
