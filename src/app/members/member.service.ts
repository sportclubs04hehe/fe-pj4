import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member } from '../shared/models/user/member.model';
import { of, tap } from 'rxjs';
import { Photo } from '../shared/models/user/photo.model';
import { PaginatedResult } from '../shared/models/user/pagination.model';
import { UserParams } from '../shared/models/account/user-params.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  api = environment.appUrl;
  private http = inject(HttpClient);
    // signal giữ chân các thành viên
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  // Phương pháp tải thành viên nếu chưa tải
  loadMembers(userParams: UserParams) {
    if (!this.paginatedResult()) {
      let params = this.setPaginationHeaders(userParams.pageNumber, userParams.pageSize);

      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);

      this.http.get<Member[]>(`${this.api}/users`, {observe: 'response', params}).subscribe({
        next: (response) => {
          this.paginatedResult.set({
            items: response.body as Member[],
            pagination: JSON.parse(response.headers.get('Pagination')!),
          })
        },
        error: () => {
          console.error('Failed to load members');
        }
      });
    }
  }

  getMember(username: string) {
    // const member = this.members().find(x => x.userName === username);

    // if (member !== undefined) return of(member); // nếu đã có member trong members

    return this.http.get<Member>(`${this.api}/users/get-by-username/${username}`);
  }

  updateMember(member: Member) {
    return this.http.put(`${this.api}/users`, member).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m =>
      //     m.userName === member.userName ? member : m));
      // }),
    );
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(`${this.api}/users/set-main-photo/${photo.id}`, {}).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     if (m.photos.includes(photo)) {
      //       m.photoUrl = photo.url;
      //     }
      //     return m;
      //   }))
      // })
    );
  }

  deletePhoto(photo: Photo) {
    return this.http.delete(`${this.api}/users/delete-photo/${photo.id}`).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     if(m.photos.includes(photo)) {
      //       m.photos = m.photos.filter(x => x.id !== photo.id);
      //     }

      //     return m;
      //   }));
      // }),
    );
  }

  private setPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    if (pageNumber && pageSize) {
        params = params.append('pageNumber', pageNumber);
        params = params.append('pageSize', pageSize);
    }

    return params;
  }

}
