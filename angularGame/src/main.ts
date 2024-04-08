import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
if (!environment.production) {
  // Load environment variables from .env file in non-production environments
  require('dotenv').config();
}
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
