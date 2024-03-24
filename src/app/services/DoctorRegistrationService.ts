import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DoctorRegistrationService {
  private registerDoctorUrl = 'http://localhost:5000/api/Registration/register-doctor';

  constructor(private http: HttpClient) {}

  registerDoctor(doctorDetails: any, authToken: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
  
    const formData = new FormData();
    formData.append('Doctor.Name', doctorDetails.name);
    formData.append('Doctor.Surname', doctorDetails.surname);
    formData.append('Doctor.PersonalID', doctorDetails.personalNumber);
    formData.append('Doctor.Email', doctorDetails.email);
    formData.append('Doctor.Password', doctorDetails.password);
    formData.append('Position', doctorDetails.position);
    formData.append('Photo', doctorDetails.photo);
  
    return this.http.post(this.registerDoctorUrl, formData, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error === 'Email is already registered') {
          return throwError('Email is already registered');
        }
        return throwError('Registration failed');
      })
    );
  }
  
}
