import { Injectable ,Output, EventEmitter} from '@angular/core';
import {HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { of ,Subject} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserAuthService } from './user-auth.service';
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:5000/api/Authorization/usersAll';

  private AdminUrl = 'http://localhost:5000/api/Authorization';




  constructor(private http: HttpClient  , private authservice:UserAuthService) {}

  searchUsers(searchTerm: string) {
    return this.http.get(`${this.apiUrl}/search/users?query=${searchTerm}`);
  }

  searchDoctors(searchTerm: string) {
    return this.http.get(`${this.apiUrl}/search/doctors?query=${searchTerm}`);
  }

  registerDoctor(doctorDetails: any) {
    return this.http.post(`${this.apiUrl}/register/doctor`, doctorDetails);
  }


  
  getAlluser(): Observable<any[]> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.authservice.authToken}` });
    return this.http.get<any[]>(this.apiUrl, { headers: headers });
}



DeleteUserData(userid: number, token: string): Observable<void> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.delete<void>(`${this.AdminUrl}/DeleteUser/${userid}`, { headers, responseType: 'text' as 'json' })
    .pipe(
      catchError(error => {
        console.error('Error deleting appointment:', error);
        return throwError(error);
      })
    );
}


}
