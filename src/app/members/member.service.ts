import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService } from '../account/account.service';
import { Member } from '../shared/models/user/member.model';

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
    return this.http.get<Member[]>(`${this.api}/users`);
  }

  getMember(username: string) {
    return this.http.get<Member>(`${this.api}/users/get-by-username/${username}`);
  }

}
