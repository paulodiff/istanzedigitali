import { Routes } from '@angular/router';

import { RaccomandateListComponent } from './raccomandate-list.component';
import { RaccomandateNewComponent } from './raccomandate-new.component';


// Route Configuration
export const raccomandateRoutes: Routes = [
  { path: 'raccomandate', component: RaccomandateListComponent },
  { path: 'raccomandate/inserimento', component: RaccomandateNewComponent },
  { path: 'raccomandate/ricerca', component: RaccomandateListComponent }
];
