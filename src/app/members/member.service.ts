import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Member } from '../shared/models/user/member.model';
import { Photo } from '../shared/models/user/photo.model';
import { PaginatedResult } from '../shared/models/user/pagination.model';
import { UserParams } from '../shared/models/account/user-params.model';
import { catchError, find, of, tap, throwError } from 'rxjs';
import { AccountService } from '../account/account.service';
import { setPaginateResponse, setPaginationHeaders } from '../shared/pagination-helpers';
import { Friendships, FriendshipStatus } from '../shared/models/user/friendships.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  api = environment.appUrl;

  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private recipientName!: string;

  // signal giữ chân các thành viên
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  memberCache = new Map();
  user = this.accountService.user$();
  userParams = signal<UserParams>(new UserParams(this.user));

 // Phương thức lấy trạng thái kết bạn
 getFriendshipStatus(friendId: string) {
   return this.http.get<Friendships>(`${this.api}/friendships/status/${friendId}`).pipe(
     catchError((error) => {
       console.error('Failed to get friendship status', error);
       return throwError(() => new Error('Failed to get friendship status'));
     })
   );
 }

 // Phương thức gửi yêu cầu kết bạn hoặc hủy kết bạn
 toggleFriendRequest(friendId: string) {
   return this.http.post<Friendships>(`${this.api}/friendships/toggle/${friendId}`, {}).pipe(
     catchError((error) => {
       console.error('Failed to toggle friend request', error);
       return throwError(() => new Error('Failed to toggle friend request'));
     })
   );
 }

  resetUserParams() {
    this.userParams.set(new UserParams(this.user));
  }

  loadMembers() {
    const response = this.memberCache.get(Object.values(this.userParams()).join('-')); // lấy body, userParams mới chính là key cần tìm kiếm

    if (response) return setPaginateResponse(response, this.paginatedResult);

    let params = setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);
    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);


    this.http.get<Member[]>(`${this.api}/users/get-all`, { observe: 'response', params }).subscribe({
      next: (response) => {
        setPaginateResponse(response, this.paginatedResult);
        this.memberCache.set(Object.values(this.userParams()).join('-'), response); // key : value
        console.log(this.paginatedResult());

      },
      error: () => {
        console.error('Failed to load members');
      }
    });
  }

  getMember(username: string) {
    const member: Member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((m: Member) => m.email === username);

    if (member) return of(member);

    return this.http.get<Member>(`${this.api}/users/${username}`);
  }

  setRecipientName(name: string) {
    this.recipientName = name;
  }

  getRecipientName(): string {
    return this.recipientName;
  }

  updateMember(member: Member) {
    return this.http.put(`${this.api}/users/update-member`, member).pipe(
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
    return this.http.delete(`${this.api}/users/delete-image/${photo.id}`, { responseType: 'text' });
    // return this.http.delete(`${this.api}/users/delete-image/${photo.id}`).pipe(
    // tap(() => {
    //   this.members.update(members => members.map(m => {
    //     if(m.photos.includes(photo)) {
    //       m.photos = m.photos.filter(x => x.id !== photo.id);
    //     }

    //     return m;
    //   }));
    // }),
    // );
  }

}

