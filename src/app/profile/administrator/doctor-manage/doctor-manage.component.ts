import { Component, Input ,Output, EventEmitter} from '@angular/core';
import { AppointmentCalendarComponent } from '../../../carousel/appointment-calendar/appointment-calendar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDetailsEditComponent } from '../../user/user-detailsEdit/user-details-edit.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UserAuthService } from '../../../services/user-auth.service';
import { AppointmentService } from '../../../services/AppointmentService ';
import { OtpService } from '../../../services/OtpService';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { RegistrationService } from '../../../services/registration.service';





interface IAppointment {
  appointmentId: number;
  userId: string;
  doctorId: string;
  date: string;
  time: string;
  comment: string;
}






@Component({
  selector: 'app-doctor-manage',
  standalone: true,
  imports: [AppointmentCalendarComponent, CommonModule, FormsModule, UserDetailsEditComponent, MatDialogModule],
  viewProviders: [UserAuthService, AppointmentService, OtpService],
  templateUrl: './doctor-manage.component.html',
  styleUrl: './doctor-manage.component.css'
})
export class DoctorManageComponent {


  @Input() userDetails: any;
  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();




  newpassword_second: any;
  newpassword: any;
  
  change_pass: boolean = false;
  Error: boolean = false;
  success: boolean = false;
  errorMessage: any;
  successMessage: any;
  change_passInputs: boolean = true;


  user: any;
  appoinmtmentUser: any;
  appointment_count: any;
  showDoctorInfo: boolean = true;
  userToken: any
  userName: string | undefined;
  imageUrl: any;
  doctordata:any;

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
  email: any;


  doctorDetails: any = {
    id:'',
    name: '',
    surname: '',
    email: '',
    photo:null,
    PersonalID: '',
    position:'',
  };
  constructor(private UserAuthService: UserAuthService, private sanitizer: DomSanitizer, private appointmentService: AppointmentService, private otpservice: OtpService,
    private registrationservice: RegistrationService
  ) {
    this.selectedYear = this.startDate.getFullYear();
    this.selectedMonthIndex = this.startDate.getMonth();
    this.selectedMonthName = this.georgianMonthNames[this.selectedMonthIndex];


  }


  ngOnInit() {
    this.doctorDetails = {
      id: this.userDetails?.id || '',
      name: this.userDetails?.name || '',
      surname: this.userDetails?.surname || '',
      email: this.userDetails?.email || '',
      personalId:this.userDetails?.personalID || '',
      position: this.userDetails?.position || '',
      photo:this.userDetails?.photo || null,
    };
    this.getDoctorAppointments(this.doctorDetails.id)
    this.email = this.doctorDetails.email;

    this.loadUserPhoto();
    this.renderCalendar();


  }

  async getDoctorAppointments(doctorId: string): Promise<void> {
    try {
      let appointmentsResponse: IAppointment[] | undefined = await this.appointmentService.getDoctorAppointments(doctorId.toString(), this.UserAuthService.getAuthToken() ?? '').toPromise();
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

  getSafeImageUrl(photo: string): string {
    return 'data:image/jpeg;base64,' + photo;
  }
  async getUserData() {
    try {
      this.UserAuthService.getUserData().subscribe(
        (data) => {
          this.user = data;

          console.log(this.user);
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  getUserInfo(appointment: IAppointment) {
    const authToken = this.UserAuthService.getAuthToken() ?? '';

    try {

      this.UserAuthService.getUserInfo(parseInt(appointment.userId), authToken).subscribe(
        (data) => {
          this.appoinmtmentUser = data;

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
    return appointment.doctorId === this.doctorDetails.id.toString() && appointment.comment === "ჩემი ჯავშანი";
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

  loadUserPhoto() {
    if ( this.doctorDetails.photo) {
      this.imageUrl = this.getSafeImageUrl(this.doctorDetails.photo);
    }
  }






  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;

        const blob = file;

        const formData: FormData = new FormData();
        formData.append('userId', this.doctorDetails.id.toString());
        formData.append('photo', blob, file.name);

        const authToken = this.UserAuthService.getAuthToken() ?? '';
        if (this.userDetails.userId) {
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
                  `body was: ${JSON.stringify(error.error)}`); // log the error body as JSON string
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
      console.log(this.doctorDetails.email);

      this.otpservice.changePassword(this.doctorDetails.email, this.newpassword).subscribe(
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

  onCloseeditmode(){
    this.closePopup.emit();

  }

}
