import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../shared/models/account/user.model';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubApi = environment.hubsUrl;
  private hubConnection?: HubConnection;
  private toastr = inject(ToastrService);

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(`${this.hubApi}/presence`, {
      accessTokenFactory() {
        return user.jwt
      },
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection.start().catch((err) => console.error(err));

    this.hubConnection.on('UserIsOnline', username => {
      // this.toastr.info('Connected');
    })

    this.hubConnection.on('UserIsOffline', username => {
      // this.toastr.warning('Disconnected');
    })
  }

  stopHubConnection() {
    if(this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((err) => console.error(err));
    }
  }
}
