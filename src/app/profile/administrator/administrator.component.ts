import { Component ,Output ,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { GetDoctorsService } from '../../services/GetDoctorsService';
import { UserAuthService } from '../../services/user-auth.service';
import { AdminService } from '../../services/AdminService';
import { DoctorRegistrationService } from '../../services/DoctorRegistrationService';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserManageComponent } from './user-manage/user-manage.component';

import { DoctorManageComponent } from './doctor-manage/doctor-manage.component';

@Component({
  selector: 'app-administrator',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule , DoctorManageComponent,UserManageComponent],
  viewProviders: [UserAuthService, DoctorRegistrationService, AdminService,GetDoctorsService],
  templateUrl: './administrator.component.html',
  styleUrl: './administrator.component.css'
})
export class AdministratorComponent {




  doctor: any;

  user: any ;
  Userr:any;

  usersall: any[] = [];
  doctors: any[] = [];
  users:any[] = [];

  showDoctorRegistration: boolean = false;
  showdoctors: boolean = false;
  showEmailRegisteredAlert: boolean = false;
  showDoctorRegisteredAlert: boolean = false;
  showRegistrationForm: boolean = false;
  showusers: boolean = false;

  editDoctordetails : boolean =false;
  editUserDetails: boolean =false;

  show_succes_Reg: boolean = false;
  authToken: string = '';
  doctorDetails: any = {
    name: '',
    surname: '',
    email: '',
    personalId: '',
    password: '',
    position: '',
    photo: null
  };
  isDoctorsActive: boolean = false;
  isUsersActice: boolean = false;
  isRegistrationActive: boolean = false;
  doctorsAreEmpty:boolean = false

  selectedPhoto: File | null = null;
  selectedPhotoData: string | null = null;
  shownameAlert: boolean = false;
  showEmailAlert: boolean = false;
  
  showpersonalNumberAlert: boolean = false;
  showsurnameAlert: boolean = false;
  showpositionAlert: boolean = false;
  showpasswordAlert: boolean = false;
  showPhotoAlert: boolean = false;


  usersAreEmpty:boolean =false;
  constructor(
    private userAuthService: UserAuthService,
    public doctorRegistrationService: DoctorRegistrationService,
    private getDoctorsService: GetDoctorsService,
    private sanitizer: DomSanitizer,
    private adminservice:AdminService,
  ) {

  }

  ngOnInit() {
    this.showdoctors = true;
    this.isDoctorsActive =true;
    this.showDoctorRegistration = false;
    this.showEmailRegisteredAlert = false;
    this.showDoctorRegisteredAlert = false;




    this.userAuthService.getUserData().subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Error loading user data:', error);
      }
    );
    this.authToken = this.userAuthService.getAuthToken() ?? '';

    this.getDoctorsService.getDoctors().subscribe(
      (data) => {
          this.doctors = data;
      },
      (error) => {
          console.error('Error fetching doctors:', error);
      }
  );
  }



  showDoctors() {
    this.showdoctors = true;
    this.showRegistrationForm = false;
    this.isDoctorsActive = true;
    this.isRegistrationActive = false;
    this.isUsersActice = false;
  }

  showUsers() {
    this.showdoctors = false;
    this.showusers = true;
    this.isDoctorsActive = false;
    this.isRegistrationActive = false;
    this.showRegistrationForm = false;
    this.isUsersActice = true;
    this.loadUsers();

  }

  showRegistration() {
    this.showRegistrationForm = true;
    this.isDoctorsActive = false;
    this.isRegistrationActive = true;
    this.isUsersActice = false;
  }


  hideNameAlert() {
    this.shownameAlert = false;
  }
  hideemailAlert() {
    this.showEmailAlert = false;
  }
  hidepersonalNumberAlert() {
    this.showpersonalNumberAlert = false;
  }
  hideusernameAlert() {
    this.showsurnameAlert = false;
  }
  hidepositionAlert() {
    this.showpositionAlert = false;
  }
  hidephotoAlert() {
    this.showPhotoAlert = false;
  }

  registerDoctor() {

    if (!this.doctorDetails.name) {
      this.shownameAlert = true;
      return;
    }
    if (!this.doctorDetails.email) {
      this.showEmailAlert = true;
      return;
    }
    if (!this.doctorDetails.personalNumber || this.doctorDetails.personalNumber.trim().length >= 9) {
      this.showpersonalNumberAlert = true;
      return;
    }
    if (!this.doctorDetails.surname) {
      this.showsurnameAlert = true;
      return;
    }
    if (!this.doctorDetails.position) {
      this.showpositionAlert = true;
      return;
    }
    if (!this.doctorDetails.photo) {
      this.showPhotoAlert = true;
      return;
    }
    if (!this.doctorDetails.photo) {
      console.error('Please select a photo.');
      this.showPhotoAlert = true;

      return;
    }
    this.doctorRegistrationService.registerDoctor(this.doctorDetails, this.authToken).subscribe(
      (response) => {
        console.log('Doctor registered successfully:', response);
        this.show_succes_Reg = true;
        this.doctorDetails = {
          name: '',
          surname: '',
          email: '',
          password: '',
          position: '',
          photo: null
        };
      },
      (error) => {
        console.error('Doctor registration failed:',);
        if (error instanceof HttpErrorResponse && error.status === 400) {
          console.log('Email is already registered:');
          this.showEmailRegisteredAlert = true;

        }
      }
    );
  }




  handleFileInput(event: any) {
    const file = event.target.files[0];
    this.doctorDetails.photo = file;
  }











////////////////////////////////////////////////////////////////////////////////////

getSafeImageUrl(photo: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + photo);
}

editDoctor(doctor: any): void {
  this.editDoctordetails = true;
  console.log(doctor);
}

edituser(user:any): void {
  this.editUserDetails = true;
  this.Userr = user;
  console.log(user);
}

editDoctorDetails(doctor: any): void {
  this.editDoctordetails = true;
  this.doctor = doctor; 
  console.log(doctor);

}
deleteuser(user: any): void {

  if (!confirm("ნამდვილად გსურთ მომხარებლის წაშლა?")) {
    return;
  }

  const authToken = this.userAuthService.getAuthToken() ?? '';
  if (user.id) {
    this.adminservice.DeleteUserData(user.id, authToken).subscribe(
      (response) => {
        console.log('user has been deleted', response);
        this.loadUsers();
    
        this.getDoctorsService.getDoctors().subscribe(
          (data) => {
              this.doctors = data;
          },
          (error) => {
              console.error('Error fetching doctors:', error);
          }
      );
        
      },
      (error) => {
        if (error instanceof HttpErrorResponse && error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${JSON.stringify(error.error)}`);
        }
      }
    );
  } else {
    console.error('User ID is undefined.');
  }

}








/////////////////////////////////////////////////////////////////////



loadUsers(): void {
  this.adminservice.getAlluser().subscribe(
    (data: any[]) => {
      this.usersall = data;
      this.usersAreEmpty = this.usersall.length === 0;
    },
    (error) => {
      console.error('Error fetching users:', error);
    }
  );
}






}