import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { AuthGuard } from '../services/AuthGuardService';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { OtpService } from '../services/OtpService';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  viewProviders: [HttpClientModule , UserAuthService, HeaderComponent,  OtpService],
  imports: [FormsModule, CommonModule, CarouselComponent ]
})
export class LoginComponent {

  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();

  ShowLoginPopup: boolean = true;
  PasswordRecoveryPopup: boolean = false;
  System_Error: boolean = false;
  Incorrect: boolean = false;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  code: string = '';
  progress: number = 0;
  codeSent: boolean = false;
  isProgressComplete: boolean = false;
  Error: boolean = false;
  change_pass: boolean = false;
  emailverifed: boolean = false;
  redirect_To_Login: boolean = false;

  newpassword_second = '';
  newpassword = '';

  constructor(private router: Router, private authService: UserAuthService, private otpservice: OtpService
  ) { }

  onClosePopup(): void {

    this.email = '';
    this.password = '';
    this.errorMessage = '';
    this.code = '';
    this.closePopup.emit();
    this.router.navigate(['/']);
  }


  submitUserAuth() {
    this.Incorrect = false;
    this.System_Error = false;
    if (this.email && this.password) {
      this.authService.signIn(this.email, this.password).subscribe(
        (response) => {
          if (response && response.token) {
            const userRole = response.userRole;
            switch (userRole) {
              case 'Admin':
                this.router.navigate(['/administrator']).then(() => {
                  window.location.reload();
                });
                break;
              case 'User':
                this.router.navigate(['/userpage']).then(() => {
                  window.location.reload();
                });
                break;
              case 'Doctor':
                this.router.navigate(['/doctorpage']).then(() => {
                  window.location.reload();
                });
                break;
              default:
                this.errorMessage = 'Unknown user role';
            }
            console.log('Sign-in success:');
          } else {
            console.error('Sign-in error: Invalid email or password');
          }
        },
        (error) => {
          console.error('Sign-in error:', error);
          if (error.status === 400) {
            this.Incorrect = true;

          } else {
            this.System_Error = true;
            this.errorMessage = 'An error occurred. Please try again later.';
          }
        }
      );
    } else {
      this.errorMessage = 'Email and password are required.';
      console.error('Email and password are required.');
    }
  }





  PasswordRecover() {
    this.ShowLoginPopup = false;
    this.PasswordRecoveryPopup = true;
    this.emailverifed = true;
    this.email = '';
  }

  sendActivationCode() {
    this.Error = false

    if (this.email) {
      this.otpservice.generateOTP(this.email).subscribe(
        response => {
          this.codeSent = true;
          this.emailverifed = false;

          this.startProgress(20);
        },
        error => {

          if (error.status === 404) {
            this.errorMessage = 'მომხმარებელი არ მოიძებნა';
          } else {
            this.errorMessage = error.message || 'An unexpected error occurred.';
          }
          this.Error = true;
        }
      );
    }
    else {
      this.errorMessage = "გთხოვთ შეიყვანოთ ელ-ფოსტა"
      this.Error = true
    }

  }

  sendAgain(): void {
    this.Error = false

    this.progress = 0;
    this.isProgressComplete = false;
    this.otpservice.generateOTP(this.email).subscribe(
      response => {
        this.codeSent = true;
        this.startProgress(20);
      },
      error => {
        console.error('Error generating OTP:', error);
      }
    );
  }


  startProgress(totalSeconds: number): void {
    let timeLeft = totalSeconds;
    const intervalId = setInterval(() => {
      timeLeft--;
      this.progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
      if (timeLeft <= 0) {
        clearInterval(intervalId);
        this.isProgressComplete = true;
      }
    }, 1000);
  }


  confirmCode() {
    this.Error = false;

    if (this.code && this.email) {
      this.otpservice.validateOTP(this.code, this.email).subscribe(
        response => {
          if (response && response.valid) {
            this.Error = false;
            this.codeSent = false;
            this.change_pass = true;
          } else {
            this.errorMessage = "არასწორი დადასტურების კოდი";
            this.Error = true;
          }
        },
        error => {
          this.errorMessage = "სისტემური შეცდომა, გთხოვთ სცადოთ მოგივანებით";
          this.Error = true;
        }
      );
    } else {
      this.errorMessage = "გთხოვთ შეიყვანოთ დადასტურების კოდი";
      this.Error = true;
    }
  }

  updatePassword() {
    this.Error = false;
    this.password = '';

    if (this.newpassword !== this.newpassword_second) {
      this.errorMessage = "პაროლები არ ემთხვევა"
      this.Error = true;

      return;
    }

    this.otpservice.changePassword(this.email, this.newpassword).subscribe(
      response => {

        if (response && response.message === "Password updated successfully.") {
          this.errorMessage = "პაროლი განახლდა"
          this.Error = true;
          this.change_pass = false;
          this.redirect_To_Login = true
        } else {
          this.errorMessage = "სისტემური შეცდომა, გთხოვთ სცადოთ მოგვიანებით";
          this.Error = true;
        }

      },
      error => {
        console.error('Error updating password:', error);
      }
    );
  }

  redirect_toLogin() {
    this.PasswordRecoveryPopup = false;

    this.change_pass = false;
    this.redirect_To_Login = false;
   this.ShowLoginPopup = true;
  }
}



