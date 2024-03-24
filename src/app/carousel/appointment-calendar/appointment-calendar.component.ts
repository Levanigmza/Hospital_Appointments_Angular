import { Component, Renderer2, Input } from '@angular/core';
import { UserAuthService } from '../../services/user-auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/AppointmentService ';
import { GetDoctorsService } from '../../services/GetDoctorsService';

interface IAppointment {
  appointmentId: number;
  userId: string;
  doctorId: string;
  date: string;
  time: string;
  comment: string;
}

@Component({
  selector: 'app-appointment-calendar',
  standalone: true,
  viewProviders: [AppointmentService, GetDoctorsService,],
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-calendar.component.html',
  styleUrl: './appointment-calendar.component.css'
})
export class AppointmentCalendarComponent {

  @Input() selectedDoctorId: number | undefined;
    
  startDate: Date = new Date();
  dates: { date: string; weekDay: string }[] = [];
  hours: string[] = ["10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"];
  appointments: IAppointment[] = [];
  selectedYear: number;
  selectedMonthIndex: number;
  selectedMonthName: string;
  georgianWeekDays: string[] = ['კვი', 'ორშ', 'სამშ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ'];
  georgianMonthNames: string[] = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];

  user: any;
  showLoader = false;
  isBlurred = false;
  correctionMode = false;
  correctionModeDelete = false
  DoctorId:any

  constructor(
    private appointmentService: AppointmentService,
    private authService: UserAuthService,
  ) {
    this.selectedYear = this.startDate.getFullYear();
    this.selectedMonthIndex = this.startDate.getMonth();
    this.selectedMonthName = this.georgianMonthNames[this.selectedMonthIndex];
  }

  ngOnInit() {
    if (this.selectedDoctorId !== undefined && this.selectedDoctorId !== null) {
      let doctorId = this.selectedDoctorId.toString();
      // this.showLoader = true;
      // this.isBlurred = true;
      this.getUserData();
      this.getUserAppointments();
      this.getDoctorAppointments(this.selectedDoctorId.toString());

      this.renderCalendar();


    }

    //   setTimeout(() => {
    //     this.getDoctorAppointments(doctorId)
    //     this.getUserAppointments().then(() => {
    //       this.showLoader = false;
    //       this.isBlurred = false;
    //       this.getDoctorAppointments(doctorId)

    //     });
    //   }, 1000);
    // } else {
    //   console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");

    //   this.getUserAppointments().then(() => {
    //     this.renderCalendar();
    //     this.showLoader = false;
    //     this.isBlurred = false;
    //   });
    // }
  }




  async getUserData() {
    try {
      this.authService.getUserData().subscribe(
        (data) => {
          this.user = data;
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }


  async getDoctorAppointments(doctorId: string): Promise<void> {
    try {
      let appointmentsResponse: IAppointment[] | undefined = await this.appointmentService.getDoctorAppointments(doctorId, this.authService.getAuthToken() ?? '').toPromise();
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

      //this.renderCalendar();
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
    }
  }



  getAppointmentsForDateTime(date: string, hour: string): IAppointment[] {
    const filteredAppointments: IAppointment[] = this.appointments.filter(appointment => appointment.date === date && appointment.time === hour);
    return filteredAppointments;
  }


  async getUserAppointments() {
    try {
      const currentUserAppointments: IAppointment[] | undefined = await this.appointmentService.getUserAppointments(this.authService.getAuthToken() ?? '').toPromise();

      if (currentUserAppointments === undefined) {
        return;
      }
      this.appointments = currentUserAppointments.map(appointment => {
        return {
          appointmentId: appointment.appointmentId,
          doctorId: appointment.doctorId,
          userId: appointment.userId,
          date: this.formatDate(appointment.date),
          time: this.formatTime(appointment.time),
          comment: appointment.comment
        };
      });
      // this.renderCalendar();
    } catch (error) {
      console.error('Error fetching user appointments:', error);
    }
  }

  formatDate(date: string): string {
    const [month, day, year] = date.split('/');
    return `${day}.${month}.${year}`;
  }

  formatTime(time: string): string {
    return `${time}:00 - ${parseInt(time) + 1}:00`;
  }

  renderCalendar(): void {
    this.dates = this.generateDates(this.startDate);
    if (this.appointments.length > 0) {
      setTimeout(() => {
        this.dates = this.generateDates(this.startDate);
      }, 0);
    }
  }


  handleAppointmentClick(date: string, time: string): void {
    this.showLoader = true;
    this.isBlurred = true;
    if (!this.user) {
      console.error('User data not available');
      return;
    }

    if (!this.selectedDoctorId) {
      console.error('No doctor selected');
      return;
    }

    const appointmentDetails = {
      UserId: this.user.userId.toString(),
      DoctorId: this.selectedDoctorId.toString(),
      Date: this.getFormattedDate(date),
      Time: this.extractHourFromTime(time),
      Comment: "ჩემი ჯავშანი"
    };
    const authToken = this.authService.getAuthToken() ?? '';

    this.appointmentService.createAppointment(appointmentDetails, authToken).subscribe(
      (response) => {
        console.log(response);
        if (response.appointmentId !== undefined && response.appointmentId !== null) {
          console.log('Appointment created successfully.');
          setTimeout(() => {
            this.showLoader = false;
            this.isBlurred = false;

            this.getUserAppointments();          

          }, 2500);
          // this.renderCalendar();
          this.getDoctorAppointments(appointmentDetails.DoctorId.toString());
          this.renderCalendar();

        } else {
          console.error('Error creating appointment');
          this.showLoader = false; 
        }
      },
      (error) => {
        console.error('Error creating appointment:', error);
        this.isBlurred = false;
        this.showLoader = false;
      }
    );
  }




  getFormattedDate(date: string): string {
    const parts = date.split('.');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    return `${month}/${day}/${year}`;
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


  addEvent(appointmentId: number, doctorId: string, userId: string, date: string, time: string, comment: string): void {
    this.appointments.push({ appointmentId, doctorId, userId, date, time, comment });
  }


  deleteAppointment(appointmentId: number): void {
    this.showLoader = true;
    this.isBlurred = true;
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    const authToken = this.authService.getAuthToken() ?? '';

    this.appointmentService.deleteAppointment(appointmentId, authToken).subscribe(
      () => {

        console.log('Appointment with ID', appointmentId, 'deleted successfully.');
        this.appointments = this.appointments.filter(event => event.appointmentId !== appointmentId);
        setTimeout(() => {
          this.correctionModeDelete = false;
          this.correctionMode = false;
          this.showLoader = false;
          this.isBlurred = false;
        }, 500);
        this.getUserData();
        this.getUserAppointments();


        if (this.selectedDoctorId) {
          this.getDoctorAppointments(this.selectedDoctorId.toString()).then(() => {
            this.getUserAppointments();
          });
        }
        this.renderCalendar();

      },
      (error) => {
        console.error('Error deleting appointment:', error);
      }
    );
  }

  CorrectData() {
    this.correctionModeDelete = true;
  }

  Delete_Record() {
    this.correctionMode = true;
  }



  isAvailable(appointment: IAppointment | undefined, date: string, hour: string): boolean {
    if (!appointment) {
      return this.getAppointmentsForDateTime(date, hour).length === 0;
    }
    return !this.isReserved(appointment) || !this.currentUserReservation(appointment);
  }


  currentUserReservation(appointment: IAppointment): boolean {
    if (!appointment) return false;
    return appointment.doctorId === this.selectedDoctorId?.toString() && appointment.userId === this.user.userId.toString();
  }


  isReserved(appointment: IAppointment): boolean {
    if (!appointment) return false;

    const isAppointmentReserved = this.getAppointmentsForDateTime(appointment.date, appointment.time)
        .some(app => app.doctorId === this.selectedDoctorId?.toString() || app.userId === this.user.userId.toString());

    return isAppointmentReserved;
}















}