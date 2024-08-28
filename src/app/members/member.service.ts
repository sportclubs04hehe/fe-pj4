import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Member } from '../shared/models/user/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  api = environment.appUrl;
   // Signal to hold the members
   members = signal<Member[]>([]);
  private http = inject(HttpClient);
  
   // Method to load members if not already loaded
   loadMembers() {
    if (this.members().length === 0) {
      this.http.get<Member[]>(`${this.api}/users`).subscribe({
        next: (response) => {
          this.members.set(response);
        },
        error: () => {
          console.error('Failed to load members');
        }
      });
    }
  }

  getMember(username: string) {
    return this.http.get<Member>(`${this.api}/users/get-by-username/${username}`);
  }

  updateMember(member: Member) {
    return this.http.put(`${this.api}/users`, member);
  }

}
