import { Component,Output ,EventEmitter,Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetDoctorsService } from '../services/GetDoctorsService';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DoctcategoryComponent } from './doctcategory/doctcategory.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { DoctorinfoComponent } from './doctorinfo/doctorinfo.component';
import { Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { HeaderComponent } from '../shared/header/header.component';
import { SearchService } from '../services/SearchService';




@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule,DoctcategoryComponent,DoctorinfoComponent,AppointmentCalendarComponent ,HeaderComponent],
  viewProviders:[GetDoctorsService,AppointmentCalendarComponent],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {

  @Output() selectedDoctorId: EventEmitter<number> = new EventEmitter<number>();

  constructor(private authService: UserAuthService, private getDoctorsService: GetDoctorsService, private sanitizer: DomSanitizer,private router: Router 
    ,    private searchService: SearchService
    ) { }

  doctors: any[] = [];
  public userRole: string | null = null;

  showAppComponent: boolean = true;
  currentImageIndex = 0;
  showRegistrationForm = false;
  showCarousel = true;
  showLoginPopup = false;
  searchTerm: string = '';
  No_doctor: boolean = false;


  showDoctorInfo:boolean = false;
  filterType: string = 'all';
  selectedDoctor: any; 

  ngOnInit(): void {
    this.filterDoctors(this.filterType);
    this.userRole = this.authService.getUserRole();
    // this.searchService.searchTerm$.subscribe(searchTerm => {
    //   this.searchTerm = searchTerm;
    //   this.filterDoctors_ByTerm();
    // });
  }


  getSafeImageUrl(photo: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + photo);
  }
  // filterDoctors_ByTerm(): void {
  //   this.getDoctorsService.getDoctors().subscribe(
  //     (data) => {
  //       if (this.searchTerm.trim() === '') {
  //         this.doctors = data; 
  //       } else {
  //         this.doctors = data.filter(doctor =>
  //           doctor.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //           doctor.surname.toLowerCase().includes(this.searchTerm.toLowerCase())
  //         );
  //       }
  //     // this.No_doctor = this.doctors.length === 0;

  //     },
  //     (error) => {
  //       console.error('Error fetching doctors:', error);
  //     }
  //   );
  // }


  filterDoctors(docType: string): void {
    this.No_doctor  =false;
    this.showDoctorInfo = false;
    if (this.searchTerm) {
      this.doctors = this.doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        doctor.surname.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    else if (docType === 'all') {
      this.getDoctorsService.getDoctors().subscribe(
        (data) => {
          this.doctors = data;
        },
        (error) => {
          console.error('Error fetching doctors:', error);
        }
      );
    }
    else{
    this.getDoctorsService.getDoctors().subscribe(
      (data) => {
        this.doctors = data.filter(doctor => doctor.position === docType);
      },
      (error) => {
        console.error('Error fetching doctors:', error);
      }
    );
  }
}


showDoctor(doctor: any) {
  if (!this.authService.isAuthenticated()) {
    this.router.navigate(['/login']);
    return;
  }
  else if(this.userRole === "User" ){

    this.selectedDoctor = doctor;

    console.log(this.selectedDoctor)
  
    this.showDoctorInfo = true;
    this.selectedDoctorId.emit(doctor.id);
  }
  else{
    console.log("for doctor's calendar view,  u  must be a user");
    
  }

}














}
