import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';
import { Stomp, Client } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  // private client!: Client;
  // private friendRequestSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  // constructor() {
  //   console.log('run service');
    
  //   this.connect();
  // }

  // private connect() {
  //   this.client = Stomp.over(new SockJS('http://localhost:8080/ws')); 
  //   this.client.activate();
  //   this.client.onConnect = (frame) => {
  //     console.log('Connected: ' + frame);
  //     this.subscribeToFriendRequests();
  //   };
  //   this.client.onWebSocketClose = (event) => {
  //     console.error('WebSocket connection closed: ', event);
  //   };
  // }

  // private subscribeToFriendRequests() {
  //   this.client.subscribe('/user/queue/friendRequest', (message) => {
  //     const updatedFriendship = JSON.parse(message.body);
  //     this.friendRequestSubject.next(updatedFriendship); 
  //   });
  // }

  // getFriendRequestUpdates() {
  //   return this.friendRequestSubject.asObservable(); // Trả về observable để subscribe
  // }

  // sendNotification(destination: string, payload: any) {
  //   if (this.client && this.client.active) {
  //     this.client.publish({
  //       destination: destination,
  //       body: JSON.stringify(payload)
  //     });
  //   } else {
  //     console.error('STOMP connection is not active. Unable to send notification.');
  //   }
  // }

  // disconnect() {
  //   if (this.client && this.client.active) {
  //     this.client.deactivate();
  //     console.log('Disconnected');
  //   }
  // }

  // isConnected(): boolean {
  //   return this.client && this.client.active;
  // }
  
}
