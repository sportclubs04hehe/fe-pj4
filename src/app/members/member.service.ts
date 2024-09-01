import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Member } from '../shared/models/user/member.model';
import { of, tap } from 'rxjs';
import { Photo } from '../shared/models/user/photo.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  api = environment.appUrl;
  // signal giữ chân các thành viên
  members = signal<Member[]>([]);
  private http = inject(HttpClient);

  // Phương pháp tải thành viên nếu chưa tải
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
    const member = this.members().find(x => x.userName === username);

    if (member !== undefined) return of(member); // nếu đã có member trong members

    return this.http.get<Member>(`${this.api}/users/get-by-username/${username}`);
  }

  updateMember(member: Member) {
    return this.http.put(`${this.api}/users`, member).pipe(
      tap(() => {
        this.members.update(members => members.map(m =>
          m.userName === member.userName ? member : m));
      }),
    );
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(`${this.api}/users/set-main-photo/${photo.id}`, {}).pipe(
      tap(() => {
        this.members.update(members => members.map(m => {
          if (m.photos.includes(photo)) {
            m.photoUrl = photo.url;
          }
          return m;
        }))
      })
    );
  }

  deletePhoto(photo: Photo) {
    return this.http.delete(`${this.api}/users/delete-photo/${photo.id}`).pipe(
      tap(() => {
        this.members.update(members => members.map(m => {
          if(m.photos.includes(photo)) {
            m.photos = m.photos.filter(x => x.id !== photo.id);
          }

          return m;
        }));
      }),
    );
  }

}
