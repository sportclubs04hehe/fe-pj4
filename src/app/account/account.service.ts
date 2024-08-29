import { computed, inject, Injectable, signal } from '@angular/core';
import { Register } from '../shared/models/account/register.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Login } from '../shared/models/account/login.model';
import { User } from '../shared/models/account/user.model';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmEmail } from '../shared/models/account/confirm-email.model';
import { ResetPassword } from '../shared/models/account/reset-password.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private api = environment.appUrl;

  // Signal for storing the current user
  private userSignal = signal<User | null>(null);

  // Exposed signal for accessing user data reactively
  user$ = computed(() => this.userSignal());

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredUser();
  }

  private loadStoredUser() {
    const storedUser = localStorage.getItem(environment.userKey);
    if (storedUser) {
      this.userSignal.set(JSON.parse(storedUser));
    }
  }

  getCurrentUser(): User | null {
    return this.userSignal();
  }

  refreshUser(jwt: string | null) {
    if (!jwt) {
      this.clearUser();
      return of(null);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwt}`);

    return this.http.get<User>(`${this.api}/account/refresh-user-token`, { headers }).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      }),
      catchError(() => {
        this.clearUser();
        return of(null);
      })
    );
  }

  login(model: Login) {
    return this.http.post<User>(`${this.api}/account/login`, model).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      })
    );
  }

  logout() {
    this.clearUser();
    this.router.navigateByUrl('/');
  }

  register(model: Register) {
    return this.http.post(`${this.api}/account/register`, model);
  }

  confirmEmail(model: ConfirmEmail) {
    return this.http.put(`${this.api}/account/confirm-email`, model);
  }

  resendEmailConfirmLink(email: string) {
    return this.http.post(`${this.api}/account/resend-email-confirmation-link/${email}`, {});
  }

  forgotUsernameOrPassword(email: string) {
    return this.http.post(`${this.api}/account/forgot-username-or-password/${email}`, {});
  }

  resetPassword(model: ResetPassword) {
    return this.http.put(`${this.api}/account/reset-password`, model);
  }

  private setUser(user: User) {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userSignal.set(user);
  }

  private clearUser() {
    localStorage.removeItem(environment.userKey);
    this.userSignal.set(null);
  }

  getJWT(): string | null {
    const currentUser = this.getCurrentUser();
    return currentUser?.jwt || null;
  }
}
