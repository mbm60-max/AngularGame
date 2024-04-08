import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as fs from 'fs';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

const environmentContent = `
export const environment = {
  production: true,
  supabase: {
    url:'https://mqhxlnthjzrbcnuxpwnd.supabase.co',
    key:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xaHhsbnRoanpyYmNudXhwd25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE4MjQ4NzQsImV4cCI6MjAyNzQwMDg3NH0.62CyjWNjzSC6swNAcoXaQ7eWxWMITZNrWyv1_h4ZsMo',
  }
};`;
if (process.env['NODE_ENV'] === 'production') {
  // Write the environment content to a file
  fs.writeFileSync('./src/environments/environment.ts', environmentContent);
}

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
