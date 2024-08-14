import { Injectable } from '@angular/core';
import { Register } from '../shared/models/account/register.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Login } from '../shared/models/account/login.model';
import { User } from '../shared/models/account/user.model';
import { map, of, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmEmail } from '../shared/models/account/confirm-email.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private userSource = new ReplaySubject<User | null>(1);
  user$ = this.userSource.asObservable();
  api = environment.appUrl;

  constructor(private http: HttpClient, private router: Router) {

  }

  refreshUser(jwt: string | null) {
    if (jwt === null) {
      this.userSource.next(null);
      return of(undefined);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this.http.get<User>(`${this.api}/account/refresh-user-token`, { headers }).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      }),
    );

  }

  login(model: Login) {
    return this.http.post<User>(`${this.api}/account/login`, model).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      }),
    );
  }

  logout() {
    localStorage.removeItem(environment.userKey);
    this.userSource.next(null);
    this.router.navigateByUrl('/');
  }

  register(model: Register) {
    return this.http.post(`${this.api}/account/register`, model);
  }

  confirmEmail(model: ConfirmEmail) {
    return this.http.put(`${this.api}/account/confirm-email`, model);
  }

  resendEmailConfirmLink(email: string) {
    return this.http.post(`${this.api}/account/resend-email-confirmation-link/${email}`,
      {});
  }

  forgotUsernameOrPassword(email: string) {
    return this.http.put(`${this.api}/account/forgot-username-or-password/${email}`,
      {});
  }

  getJWT() {
    const key = localStorage.getItem(environment.userKey);

    if (key) {
      const user: User = JSON.parse(key);
      return user.jwt;
    }

    return null;
  }

  private setUser(user: User) {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userSource.next(user);
  }
}
