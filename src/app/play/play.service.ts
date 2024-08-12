import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PlayService {
  api = environment.appUrl;

  constructor(private http: HttpClient) { }

  getPlayers() {
    return this.http.get(`${this.api}/plays/get-all`);
  }
}
