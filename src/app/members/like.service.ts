import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Member } from '../shared/models/user/member.model';
import { PaginatedResult } from '../shared/models/user/pagination.model';
import { setPaginateResponse, setPaginationHeaders } from '../shared/pagination-helpers';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  api = environment.appUrl;

  private http = inject(HttpClient);

  likeIds = signal<string[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  constructor() { }

  toggleLike(targetId: string) {
    return this.http.post(`${this.api}/likes/${targetId}`,{});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = setPaginationHeaders(pageNumber, pageSize);

    // params = params.append('predicate', predicate);

    return this.http.get<Member[]>(`${this.api}/likes?predicate=${predicate}`, 
      {observe: 'response', params}
    ).subscribe({
      next: response => {
        setPaginateResponse(response, this.paginatedResult);
      }
    });
  }

  getLikedIds() {
    return this.http.get<string[]>(`${this.api}/likes/list`).subscribe({
      next: (ids) => {
        this.likeIds.set(ids);
      },
    }); 
  }

}
