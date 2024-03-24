import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class OtpService {
  public apiurl = 'http://localhost:5000/api/Authorization';

  constructor(private http: HttpClient) { }


  generateOTP(email:string): Observable<{ UserID: string }> {
    const url = `${this.apiurl}/code`; 
    return this.http.post<{ UserID: string }>(url, {email});
  }

  validateOTP(otpCode: string, email: string): Observable<{ valid: boolean, message: string }> {
    const url = `${this.apiurl}/checkCode`; 
    return this.http.post<{ valid: boolean, message: string }>(url, { otpCode, email });
  }

  changePassword(email: string, newPassword: string): Observable<{message: string }> {
    const url = `${this.apiurl}/updatePassword`;
    const body = { email, newPassword };

    return this.http.put<{message: string }>(url, body);
  }
  
}

