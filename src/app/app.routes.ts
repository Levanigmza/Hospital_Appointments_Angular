import { Routes } from '@angular/router';
import { CarouselComponent } from './carousel/carousel.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserPageComponent } from './profile/user/user.component';
import { AdministratorComponent } from './profile/administrator/administrator.component';
import { DoctorComponent } from './profile/doctor/doctor.component';
import { adminGuardGuard } from './guard';
import { AuthGuard } from './services/AuthGuardService';
import { doctorGuardGuard } from './guard';

export const routes: Routes = [

    { path: '', component: CarouselComponent },
    { path: 'login', component: LoginComponent ,},
    { path: 'register', component: RegisterComponent },
    { path: 'userpage', component: UserPageComponent , canActivate: [AuthGuard] },
    { path: 'doctors', component: CarouselComponent  , },
    { path: 'administrator', component: AdministratorComponent , canActivate: [adminGuardGuard , AuthGuard]  },
    { path: 'doctorpage', component: DoctorComponent , canActivate: [doctorGuardGuard ,AuthGuard]  },
];
