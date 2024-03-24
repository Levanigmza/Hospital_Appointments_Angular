import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserAuthService } from '../../../services/user-auth.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AppointmentService } from '../../../services/AppointmentService ';
import { UserDetailsEditComponent } from '../../user/user-detailsEdit/user-details-edit.component';
import { HttpClientModule } from '@angular/common/http';
import { UpdateUserDataService } from '../../../services/UpdateUserDataService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GetDoctorsService } from '../../../services/GetDoctorsService';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { RegistrationService } from '../../../services/registration.service';
import { OtpService } from '../../../services/OtpService';

interface IAppointment {
  appointmentId: number;
  userId: string;
  doctorId: string;
  date: string;
  time: string;
  comment: string;
}
@Component({
  selector: 'app-user-manage',
  standalone: true,
  viewProviders: [UserAuthService, AppointmentService, UpdateUserDataService, GetDoctorsService, AppointmentService, OtpService],
  imports: [MatIconModule, CommonModule, FormsModule, MatDialogModule, HttpClientModule, UserDetailsEditComponent],
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.css'
})
export class UserManageComponent {

  @Input() userData: any;
  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();


  newpassword_second: any;
  newpassword: any;
  email: any;
  change_pass: boolean = false;
  Error: boolean = false;
  success: boolean = false;
  errorMessage: any;
  successMessage: any;
  change_passInputs: boolean = true;

  userdata: any = {
    id: '',
    name: '',
    surname: '',
    email: '',
    photo: null,
    PersonalID: '',
  };

  dialogRef: MatDialogRef<UserDetailsEditComponent> | null = null;
  appointment_count = 15;
  userToken: any

  appointments: IAppointment[] = [];

  georgianMonthNames: string[] = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];
  georgianWeekDays: string[] = ['კვი', 'ორშ', 'სამშ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ'];
  selectedYear: number;
  selectedMonthIndex: number;
  selectedMonthName: string;
  dates: { date: string; weekDay: string }[] = [];
  hours: string[] = ["10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"];
  startDate: Date = new Date();
  showLoader = false;
  isBlurred = false;
  correctionMode = false;
  correctionModeDelete = false
  showPopup: boolean = false;
  editUserData: boolean = false;

  userDetails: any = {
    Photo: '',

  };



  appointmentDoctor: any;
  userId: any;
  imageUrl: any;

  constructor(
    private UserAuthService: UserAuthService, private appointmentService: AppointmentService,
    private sanitizer: DomSanitizer,
    private userupdateservice: UpdateUserDataService,
    private registrationservice: RegistrationService,
    private otpservice: OtpService,
  ) {
    this.selectedYear = this.startDate.getFullYear();
    this.selectedMonthIndex = this.startDate.getMonth();
    this.selectedMonthName = this.georgianMonthNames[this.selectedMonthIndex];
  }

  ngOnInit() {
    if (this.userData) {
      this.userdata = {
        id: this.userData.id || '',
        name: this.userData.name || '',
        surname: this.userData.surname || '',
        email: this.userData.email || '',
        personalId: this.userData.personalId || '',
        photo: this.userData.photo || null,
      };
      console.log("ttt");
      console.log(this.userData);
      console.log("ttt");
      console.log(this.userdata);

      
      

    } 

    this.getUserAppointments();
    this.renderCalendar();
    this. loadUserPhoto();

  }
  

  loadUserPhoto() {
    if (this.userdata.photo) {
      this.imageUrl = this.getSafeImageUrl(this.userdata.photo);
    }
  }

  getSafeImageUrl(photo: string): string {
    return 'data:image/jpeg;base64,' + photo;
  }

  async getUserAppointments(): Promise<void> {
    try {
      let appointmentsResponse: IAppointment[] | undefined = await this.appointmentService.getUserAppointments_admin(this.userdata.id , this.UserAuthService.getAuthToken() ?? '').toPromise();
      if (appointmentsResponse === undefined) {
        return;
      }
      this.appointments = appointmentsResponse.map(appointment => {
        return {
          appointmentId: appointment.appointmentId,
          doctorId: appointment.doctorId,
          userId: appointment.userId,
          date: this.formatDate(appointment.date),
          time: this.formatTime(appointment.time),
          comment: appointment.comment

        };
      });
      this.appointment_count = this.appointments.length;
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
    }
  }




  // async getUserData() {
  //   try {
  //     this.UserAuthService.getUserData().subscribe(
  //       (data) => {
  //         this.user = data;
  //       },
  //       (error) => {
  //         console.error('Error fetching user data:', error);
  //       }
  //     );
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //   }
  // }

  getUserInfo(appointment: IAppointment) {
    const authToken = this.UserAuthService.getAuthToken() ?? '';

    try {

      this.UserAuthService.getUserInfo(parseInt(appointment.doctorId), authToken).subscribe(
        (data) => {
          this.appointmentDoctor = data;

        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }



  parseDoctorId(id: string): number {
    return parseInt(id, 10);
  }

  CorrectData() {
    this.correctionModeDelete = true;
  }

  Delete_Record() {
    this.correctionMode = true;
  }




  formatDate(date: string): string {
    const [month, day, year] = date.split('/');
    return `${day}.${month}.${year}`;
  }

  formatTime(time: string): string {
    return `${time}:00 - ${parseInt(time) + 1}:00`;
  }


  hasAppointment(date: string, hour: string): boolean {
    return this.appointments.some(appointment => appointment.date === date && appointment.time === hour);
  }

  getFormattedDate(date: string): string {
    const parts = date.split('/');
    const month = parts[0];
    const day = parts[1];
    const year = parts[2];

    return `${month}.${year}`;
  }


  extractHourFromTime(time: string): string {
    const parts = time.split(':');
    return parts[0];
  }


  generateDates(startDate: Date): { date: string; weekDay: string }[] {
    const week = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
      const dateString = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
      const weekDay = this.georgianWeekDays[date.getDay()];
      week.push({ date: dateString, weekDay });
    }

    return week;
  }

  prevWeek(): void {
    this.startDate.setDate(this.startDate.getDate() - 7);
    this.renderCalendar();
    this.updateSelectedYearAndMonth();

  }
  nextWeek(): void {
    this.startDate.setDate(this.startDate.getDate() + 7);
    this.renderCalendar();
    this.updateSelectedYearAndMonth();
  }
  private updateSelectedYearAndMonth(): void {
    this.selectedYear = this.startDate.getFullYear();
    this.selectedMonthIndex = this.startDate.getMonth();
    this.selectedMonthName = this.georgianMonthNames[this.selectedMonthIndex];
  }

  renderCalendar(): void {
    this.dates = this.generateDates(this.startDate);
    if (this.appointments.length > 0) {
      setTimeout(() => {
        this.dates = this.generateDates(this.startDate);
      }, 0);
    }
  }

  getAppointmentsForDateTime(date: string, hour: string): IAppointment[] {
    const filteredAppointments: IAppointment[] = this.appointments.filter(appointment => appointment.date === date && appointment.time === hour);
    return filteredAppointments;
  }



  currentUserReservation(appointment: IAppointment): boolean {
    if (!appointment) return false;
    return appointment.userId === this.userData.id.toString() && appointment.comment === "ჩემი ჯავშანი";
  }

  deleteAppointment(appointment: IAppointment) {
    this.showLoader = true;
    this.isBlurred = true;
    if (appointment) {


      if (!confirm("Are you sure you want to delete this appointment?")) {
        return;
      }

      const authToken = this.UserAuthService.getAuthToken() ?? '';


      this.appointmentService.deleteAppointment_Admin(appointment.appointmentId, authToken).subscribe(
        () => {

          this.appointments = this.appointments.filter(event => event.appointmentId !== appointment.appointmentId);
          setTimeout(() => {
            this.correctionModeDelete = false;
            this.correctionMode = false;
            this.showLoader = false;
            this.isBlurred = false;
          }, 500);

        },
        (error) => {
          console.error('Error deleting appointment:', error);
        }
      );
    }
  }

  editData() {
    this.editUserData = true;

  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;

        const blob = file;

        const formData: FormData = new FormData();
        formData.append('userId', this.userdata.id);
        formData.append('photo', blob, file.name);

        const authToken = this.UserAuthService.getAuthToken() ?? '';
        if (this.userId) {
          this.registrationservice.updateUserPhoto(formData, authToken).subscribe(
            (response) => {
              console.log('User data updated successfully:', response);
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
      };
      reader.readAsDataURL(file);
    }
  }

  Pass_Change() {
    this.change_pass = true;
  }


  updatePassword() {
    this.Error = false;
    this.success = false;

    if ((this.newpassword === this.newpassword_second) && (this.newpassword)) {

      this.otpservice.changePassword(this.email, this.newpassword).subscribe(
        response => {

          if (response && response.message === "Password updated successfully.") {
            this.change_passInputs = false
            this.successMessage = "პაროლი განახლდა"
            this.success = true;
            setTimeout(() => {
              this.change_pass = false
              this.success = false;
            }, 1500);
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
    else {
      this.errorMessage = "პაროლები არ ემთხვევა"
      this.Error = true;
    }
  }

  onClosePopup() {
    this.change_pass = false;

  }
  onCloseeditmode() {
    this.closePopup.emit();

  }

}
