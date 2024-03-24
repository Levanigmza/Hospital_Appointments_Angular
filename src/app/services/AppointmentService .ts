import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  public appointmentURL = 'http://localhost:5000/api/appointment';


  constructor(private http: HttpClient) {}

  createAppointment(appointmentDetails: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.appointmentURL}/schedule`, appointmentDetails, { headers });
  }

  getDoctorAppointments(doctorId: string, token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.appointmentURL}/doctor-appointments/${doctorId}`;
    return this.http.get<any[]>(url, { headers });
  }

  getUserAppointments( token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.appointmentURL}/user-appointments`;
    return this.http.get<any[]>(url, { headers });
  }

  getUserAppointments_admin(userId:number, token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.appointmentURL}/user-appointments_Admin/${userId}`;
    return this.http.get<any[]>(url, { headers });
  }
  
  deleteAppointment(appointmentId: number ,  token: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.delete<void>(`${this.appointmentURL}/delete/${appointmentId}`, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError(error => {
          console.error('Error deleting appointment:', error);
          return throwError(error);
        })
      );
  }

  deleteAppointment_Admin(appointmentId: number, token: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.delete<void>(`${this.appointmentURL}/admin_delete/${appointmentId}`, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError(error => {
          console.error('Error deleting appointment:', error);
          return throwError(error);
        })
      );
  }

  DeleteUserData(userid: number, token: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.delete<void>(`${this.appointmentURL}/DeleteUser/${userid}`, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError(error => {
          console.error('Error deleting appointment:', error);
          return throwError(error);
        })
      );
  }


}
