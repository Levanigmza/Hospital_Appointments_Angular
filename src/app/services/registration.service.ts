import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', 
})
export class RegistrationService {
  constructor(private http: HttpClient) {}

  registerUser(data: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/Registration/register', data, { withCredentials: true });
  }

  updateUserPhoto(formData: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    const userId = formData.get('userId');
    const photo = formData.get('photo');
  
    return this.http.put<any>('http://localhost:5000/api/Registration/update/photo', formData, { headers });
  }
}
