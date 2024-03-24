import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgModel  } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationService } from '../services/registration.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({

  standalone:true,
  imports:[FormsModule,CommonModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  firstName: string = '';
  email: string = '';
  personalNumber: string = '';
  lastName: string = '';
  activationCode: string = '1111'; 
  password: string = '';
  registrationForm: FormGroup;
  showRegistrationForm: boolean = true;
  show_succes_Reg: boolean = false;
  emailAlreadyRegisteredError: boolean = false;

  constructor(
    private dialog: MatDialog,
    private registrationService: RegistrationService,
    private formBuilder: FormBuilder,
    private router: Router,


  ) {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],   
      password: ['', [Validators.required]],
      personalNumber: ['', [Validators.required]],

      lastName: ['', [Validators.required]],

      firstName: ['', [Validators.required]],

    });
  }

  register() {
    if (this.registrationForm) {
      const userData = {
        Name: this.firstName,
        Email: this.email,
        PersonalId: this.personalNumber,
        Surname: this.lastName,
        ActivationCode: this.activationCode,
        Password: this.password,
      };

      this.registrationService.registerUser(userData).subscribe(
        (response) => {
          console.log(response);
          this.showRegistrationForm = false;
          this.show_succes_Reg=true;
        },
        (error) => {
          console.error(error);

          if (error instanceof HttpErrorResponse && error.status === 400) {
            this.emailAlreadyRegisteredError = true;
          }
        }
      );
    } else {
      console.log('data is invalid');
    }
  }

 
  Navigate_tosignin() {
    this.router.navigate(['/login']); 

  }

  sendActivationCode(){

    console.log("activation code : 1111")

  }
}
