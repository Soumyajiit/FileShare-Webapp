import { Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { SessionComponent } from './session/session.component';

export const routes: Routes = [
  { path: '', component: UploadComponent },
  { path: 'session/:sessionId', component: SessionComponent }
];
