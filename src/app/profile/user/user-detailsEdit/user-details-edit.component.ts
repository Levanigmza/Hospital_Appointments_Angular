import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UpdateUserDataService } from '../../../services/UpdateUserDataService';
import { UserAuthService } from '../../../services/user-auth.service';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  standalone: true,
  imports: [MatInputModule, CommonModule, FormsModule, ReactiveFormsModule],
  selector: 'app-user-details-edit',
  templateUrl: './user-details-edit.component.html',
  styleUrls: ['./user-details-edit.component.css'],
  viewProviders: [UpdateUserDataService, UserAuthService]

})
export class UserDetailsEditComponent {

  @Input() userDetails: any;
  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();

  data: any;
  showEmailRegisteredAlert: boolean = false;
  showDoctorRegisteredAlert: boolean = false;
  currentUser: any;
  activationCode: string = '1111';

  doctorDetails: any = {
    id :'',
    name: '',
    surname: '',
    email: '',
    personalId: '',
  };
  selectedPhoto: File | null = null;
  selectedPhotoData: string | null = null;
  shownameAlert: boolean = false;
  showEmailAlert: boolean = false;
  showpersonalNumberAlert: boolean = false;
  showsurnameAlert: boolean = false;
  showpositionAlert: boolean = false;

  succesUpdate: boolean = false;
  EditMode: boolean = true;


  constructor(
    private fb: FormBuilder,
    private updateUserDataService: UpdateUserDataService,
    private authService: UserAuthService
  ) {

  }

  ngOnInit(): void {
    this.doctorDetails = {
      id:this.userDetails?.id || '',
      name: this.userDetails?.name || '',
      surname: this.userDetails?.surname || '',
      email: this.userDetails?.email || '',
      personalId: this.userDetails?.personalId || '',
    };

    console.log(this.userDetails)
  }



  saveChanges() {
    if (this.authService.isAdmin()) {
      const authToken = this.authService.getAuthToken() ?? '';

      this.updateUserDataService.UpdateUserData_Admin(this.doctorDetails, authToken).subscribe(
        (response) => {
          console.log('User data updated successfully:', response);

          this.succesUpdate = true;
          this.EditMode = false;
          console.log(response);
          setTimeout(() => {
            this.onClosePopup();

          }, 1000);

        },
        (error) => {
          if (error instanceof HttpErrorResponse && error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
          } else {
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`);
          }
        }
      );

    } else {



      if (!this.doctorDetails.name) {
        this.shownameAlert = true;
        return;
      }
      if (!this.doctorDetails.email) {
        this.showEmailAlert = true;
        return;
      }
      if (!this.doctorDetails.personalId || this.doctorDetails.personalId.length > 10) {
        this.showpersonalNumberAlert = true;
        return;
      }

      if (!this.doctorDetails.surname) {
        this.showsurnameAlert = true;
        return;
      }


      const authToken = this.authService.getAuthToken() ?? '';
      this.updateUserDataService.UpdateUserData(this.doctorDetails, authToken).subscribe(
        (response) => {
          console.log('User data updated successfully:', response);

          this.succesUpdate = true;
          this.EditMode = false;
          console.log(response);
          setTimeout(() => {
            this.onClosePopup();

          }, 1000);

        },
        (error) => {
          if (error instanceof HttpErrorResponse && error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
          } else {
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`);
          }
        }
      );
    }

  }

  onClosePopup() {
    this.closePopup.emit();
    this.authService.getUserData();

  }

  sendActivationCode() {

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

  handleFileInput(event: any) {
    const file = event.target.files[0];
    this.doctorDetails.photo = file;
  }


}
