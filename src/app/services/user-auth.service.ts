import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable(
  { providedIn: 'root' }
)

export class UserAuthService {
  private apiUrl = 'http://localhost:5000/api/Authorization/Auth';
  private userUrl = 'http://localhost:5000/api/Authorization/user';

  public authTokenKey = 'authToken';
  public authToken: string | null = null;
  public userRoleKey = 'userRole';
  public userRole: string | null = null;


  constructor(private http: HttpClient, private router: Router) {
    this.authToken = localStorage.getItem(this.authTokenKey);
    this.userRole = localStorage.getItem(this.userRoleKey)
  }



  signIn(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const body = {
      Email: email,
      Password: password,
    };

    return this.http.post(`${this.apiUrl}`, body, { headers }).pipe(
      map((response: any) => {
        if (response && response.token) {

          this.setAuthToken(response.token);
          this.setUserRole(response.userRole);
        }
        return response;
      })
    );
  }

  getUserRole() {
    return this.userRole;
  }

  isAdmin(): boolean {
    if (this.userRole === "Admin") {
      return true;
    } else {
      return false;
    }
  }

  isdoctor(): boolean {
    if (this.userRole === "Doctor") {
      return true;
    } else {
      return false;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token && !this.isTokenExpired(token);
  }


  getAuthToken() {
    return this.authToken;
  }


  hasValidToken(): boolean {
    return !!this.authToken && !this.isTokenExpired(this.authToken);

  }
  isTokenExpired(token: string): boolean {

    const tokenData = this.parseToken(token);
    const expirationDate = new Date(tokenData.exp * 1000);
    return expirationDate < new Date();
  }
  parseToken(token: string): any {

    const tokenParts = token.split('.');
    return JSON.parse(atob(tokenParts[1]));
  }

  setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem(this.authTokenKey, token);

  }

  setUserRole(role: string): void {
    this.userRole = role;
    localStorage.setItem(this.userRoleKey, role);

  }



  clearAuthToken(): void {
    this.authToken = null;
    localStorage.removeItem(this.authTokenKey);

  }

  getUserData(): Observable<UserData> {
    if (!this.authToken) {
      return of({} as UserData);
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.authToken}` });

    return this.http.get<UserData>(this.userUrl, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.clearAuthToken();
          this.router.navigate(['']);
        }

        return of({} as UserData);
      })
    );
  }

  getUserInfo(UserID: number, token: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<void>(`${this.userUrl}/${UserID}`, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError(error => {
          console.error('Error deleting appointment:', error);
          return throwError(error);
        })
      );
  }



}

interface UserData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  userId: string;
  personalID: string;
  address: string;
  birthdate: string;
}

