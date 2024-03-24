import { Component,OnInit ,Input, ChangeDetectorRef} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http'; 
import { UserAuthService } from './services/user-auth.service';
import { AppointmentService } from './services/AppointmentService ';
import { RegistrationService } from './services/registration.service';
import { LogoutService } from './services/LogoutService';
import { UpdateUserDataService } from './services/UpdateUserDataService';
import { AdminService } from './services/AdminService';
import { DoctorRegistrationService } from './services/DoctorRegistrationService';
import { UserPageComponent } from './profile/user/user.component';
import { CarouselComponent } from './carousel/carousel.component';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-root',
  standalone: true,
  viewProviders: [UserAuthService, AppointmentService, RegistrationService, LogoutService, UpdateUserDataService, AdminService, DoctorRegistrationService,HttpClient ],
  imports: [RouterOutlet , HeaderComponent, UserPageComponent,  CarouselComponent, FooterComponent, CommonModule, HttpClientModule, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {

  constructor() {
  }
  title = 'hospital';


}