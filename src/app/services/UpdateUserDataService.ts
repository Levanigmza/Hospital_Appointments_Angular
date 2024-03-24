import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserDataService {
  private apiUrl = 'http://localhost:5000/api/Authorization/user/update';
  private apiUr_Admin = 'http://localhost:5000/api/Authorization/admin/update';

  constructor(private http: HttpClient) {}

  UpdateUserData(data: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.put(this.apiUrl, data, { headers });
  }

  UpdateUserData_Admin(data: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.post(this.apiUr_Admin, data, { headers });
  }
}
