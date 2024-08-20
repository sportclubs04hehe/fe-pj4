import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  api = environment.appUrl;
  
  private http = inject(HttpClient);
  
  constructor() { }
}
