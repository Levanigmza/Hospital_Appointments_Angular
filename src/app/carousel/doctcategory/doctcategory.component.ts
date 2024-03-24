import { Component, EventEmitter, Output ,Input} from '@angular/core';
import { GetDoctorsService } from '../../services/GetDoctorsService';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';


@Component({
  standalone: true,
  viewProviders: [GetDoctorsService],
  imports: [NgClass,CommonModule],
  selector: 'app-doctcategory',
  templateUrl: './doctcategory.component.html',
  styleUrls: ['./doctcategory.component.css']
})
export class DoctcategoryComponent {
  alldoctors_count: number = 0;

  constructor(private getDoctorsService: GetDoctorsService) {
    this.getDoctorsCounts();
    this.getDoctorsCountsAll().subscribe((totalCount: number) => {
      this.alldoctors_count = totalCount;
    });
  }

  @Output() categorySelected = new EventEmitter<string>();

  No_doctor:boolean = false;
  doctors: any;
  doctorCounts: { [key: string]: number } = {};
  activeCategory: string = '';
  allDoctors: any[] = [];

  ngOnInit(): void {
    this.getDoctorsService.getDoctors().subscribe(
      (data) => {
        this.doctors = data;
        this.allDoctors = data;
        this.No_doctor =false; 
      },
      (error) => {
        this.No_doctor = true;

        console.error('Error fetching doctors:', error);
      }
    );
  }


  getDoctorsCounts() {
    this.getDoctorsService.getDoctors().subscribe(
      (data) => {
        const counts = data.reduce((acc, doctor) => {
          acc[doctor.position] = acc[doctor.position] ? acc[doctor.position] + 1 : 1;
          return acc;
        }, {});
        this.doctorCounts = counts;
      },
      (error) => {
        console.error('Error fetching doctors:', error);
        this.No_doctor = true;

      }
    );
  }

  getDoctorsCountsAll(): Observable<number> {
    return this.getDoctorsService.getDoctors().pipe(
      map((data) => data.length)
    );
  }
  showall(){
    this.No_doctor = false;

    this.doctors = this.allDoctors.filter(doctor => doctor.position === 'all');
    this.activeCategory = 'all'; 
    this.categorySelected.emit('all');

  }
  
  filter_doc(doc_type: string) {
    if (doc_type === 'all') {
      this.getDoctorsService.getDoctors().subscribe(
        (data) => {
          this.doctors = data;
          this.activeCategory = 'all';
        },
        (error) => {
          console.error('Error fetching doctors:', error);
          this.No_doctor = true;
        }
      );
    } else {
      this.doctors = this.allDoctors.filter(doctor => doctor.position === doc_type);
      this.activeCategory = doc_type; 
    }
    this.No_doctor = this.doctors.length === 0; 
    this.categorySelected.emit(doc_type);
  }
  
}
