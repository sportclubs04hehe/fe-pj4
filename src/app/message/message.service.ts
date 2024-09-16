import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../shared/models/user/pagination.model';
import { Message } from '../shared/models/message/message.model';
import { setPaginateResponse, setPaginationHeaders } from '../shared/pagination-helpers';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  api = environment.appUrl;
  
  private http = inject(HttpClient);

  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);

  constructor() { }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = setPaginationHeaders(pageNumber, pageSize);

    params = params.append('container', container);

    return this.http.get<Message[]>(`${this.api}/messages`, {observe: 'response', params}).subscribe({
      next: (response) => {
        setPaginateResponse(response, this.paginatedResult);
      }
    })
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(`${this.api}/messages/thread/${username}`);
  }

  sendMessage(username: string, content: string) {
    return this.http.post<Message>(`${this.api}/messages`,{recipientUsername: username, content})
  }

  deleteMessage(id: string) {
    return this.http.delete(`${this.api}/messages/${id}`);
  }
  
}
