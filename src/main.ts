import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { AppModule } from './app.module'; // Create AppModule as suggested in the previous response

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
