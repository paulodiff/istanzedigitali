// Imports
// Deprecated import
// import { provideRouter, RouterConfig } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { CatListComponent } from './cats/cat-list.component';
// import { DogListComponent } from './dogs/dog-list.component';
import { LoginComponent } from './login/login.component';
import { SocketComponent } from './socket/socket.component';
import { ConsegnaComponent } from './consegna/consegna.component';
import { LogInfoComponent } from './loginfo/loginfo.component';
// import { dogRoutes } from './dogs/dog.routes';
import { attiRoutes } from './atti/atti.routes';
import { raccomandateRoutes } from './raccomandate/raccomandate.routes';
import { statsRoutes } from './stats/stats.routes';
import { consegnaRoutes } from './consegna/consegna.routes';
import { ErrorsComponent } from './errors/errors.component';

// Route Configuration
export const routes: Routes = [

  {
    path: '',
    redirectTo: '/atti/inserimento',
    pathMatch: 'full'
  },

  { path: 'login', component: LoginComponent },
  { path: 'socket', component: SocketComponent },
  { path: 'consegna', component: ConsegnaComponent },
  { path: 'loginfo/:tableName/:id', component: LogInfoComponent },
  // ...dogRoutes,
  ...attiRoutes,
  ...raccomandateRoutes,
  ...consegnaRoutes,
  ...statsRoutes,
  { path: 'error', component: ErrorsComponent },
  { path: '**', component: ErrorsComponent, data: { status: 404, message: 'Page not found', name: 'Page not found' } }
    // ,  { path: 'dogs', component: DogListComponent }
];

// Deprecated provide
// export const APP_ROUTER_PROVIDERS = [
//   provideRouter(routes)
// ];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);