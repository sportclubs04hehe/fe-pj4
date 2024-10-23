import { computed, inject, Injectable, OnInit, signal } from '@angular/core';
import { Register } from '../shared/models/account/register.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Login } from '../shared/models/account/login.model';
import { User } from '../shared/models/account/user.model';
import { catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmEmail } from '../shared/models/account/confirm-email.model';
import { ResetPassword } from '../shared/models/account/reset-password.model';
import { LikeService } from '../members/like.service';
import { PresenceService } from '../message/presence.service';
import { Country } from '../shared/models/user/country.model';
import { State } from '../shared/models/user/state.model';
import { City } from '../shared/models/user/city.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService implements OnInit {
  private api = environment.appUrl;
  // private apiCountry = "https://api.countrystatecity.in/v1/countries";

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-type': 'application/json',
  //     'X-CSCAPI-KEY': 'MGZMRlZLbkZ0SmNiOGkxQzBlREFLYjBKdlZZU1BnRmlRbGI3N2lvVg=='
  //   })
  // };

  private presenceService = inject(PresenceService);

  private userSignal = signal<User | null>(null);

  user$ = computed(() => this.userSignal());

  role = computed(() => {
    const user = this.userSignal();

    if (user && user.jwt) {
      const base64Url = user.jwt.split('.')[1];
      const base64 = this.base64UrlToBase64(base64Url);
      const role = JSON.parse(atob(base64)).role;
      return Array.isArray(role) ? role : [role];
    }

    return [];
  });

  constructor(private http: HttpClient,
    private router: Router,
    private likeService: LikeService,) {
    this.loadStoredUser();
  }

  ngOnInit(): void {

  }

  getCountries() {
    return this.http.get<Country[]>(`${this.api}/auth/countries`);
  }

  getStateOfSelectedCountry(countryIso: string) {
    return this.http.get<State[]>(`${this.api}/auth/states/${countryIso}`);
  }

  getCitiesOfSelectedState(countryIso: string, stateIso: string) {
    return this.http.get<City[]>(`${this.api}/auth/cities/${countryIso}/${stateIso}`);
  }
  private loadStoredUser() {
    const storedUser = localStorage.getItem(environment.userKey);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userSignal.set(user);
    }
  }

  getCurrentUser(): User | null {
    return this.userSignal();
  }

  // refreshUser(jwt: string | null) {
  //   if (!jwt) { // Giữ nguyên
  //     this.clearUser();
  //     return of(null);
  //   }

  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${jwt}`);

  //   return this.http.post<AuthenticationResponse>(`${this.api}/auth/refresh-token`, {}, { headers }).pipe(
  //     map((response: AuthenticationResponse) => {
  //       if (response && response.jwt) { 
  //         const updatedUser: User = {
  //           ...this.getCurrentUser()!, 
  //           jwt: response.jwt 
  //         };
  //         this.setUser(updatedUser);
  //       }
  //     }),
  //     catchError(() => {
  //       this.clearUser();
  //       return of(null);
  //     }),
  //   );
  // }

  login(model: Login) {
    return this.http.post<User>(`${this.api}/auth/authenticate`, model).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      })
    );
  }

  logout() {
    this.clearUser();
    this.router.navigateByUrl('/account/login');
    this.presenceService.stopHubConnection();
  }

  register(model: Register) {
    return this.http.post(`${this.api}/auth/register`, model);
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

  setUser(user: User) {
    const currentUser = this.userSignal();

    if (currentUser && user.photoUrl === null) {
      user.photoUrl = currentUser.photoUrl;
    }
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userSignal.set(user);
    this.likeService.getLikedIds();
    this.presenceService.createHubConnection(user);
  }

  private clearUser() {
    localStorage.removeItem(environment.userKey);
    this.userSignal.set(null);
  }

  private base64UrlToBase64(base64Url: string): string {
    return base64Url.replace(/-/g, '+').replace(/_/g, '/')
      .padEnd(base64Url.length + (4 - base64Url.length % 4) % 4, '=');
  }

  getJWT(): string | null {
    const currentUser = this.getCurrentUser();
    return currentUser?.jwt || null;
  }
}
