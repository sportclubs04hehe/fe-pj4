import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  api = environment.appUrl;
  jwt = '';

  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  
  constructor() { 
  }

  getMembers() {
    return this.http.get(`${this.api}/users`, this.getHttpOptions());
  }

  getMember(username: string) {
    return this.http.get(`${this.api}/users/get-by-username/${username}`, this.getHttpOptions());
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({  
        Authorization: `Bearer ${this.accountService.getJWT()}`
      }),
    }
  }
}
