import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { jwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ListComponent } from './list/list.component';
import { MessageComponent } from './message/message.component';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { loadingInterceptor } from './shared/interceptors/loading.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FriendshipComponent } from './friendships/friendship/friendship.component';
import { ListFriendsComponent } from './friendships/list-friends/list-friends.component';
import { PostComponent } from './posts/post/post.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ListComponent,
    MessageComponent,
    FriendshipComponent,
    ListFriendsComponent,
    PostComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    BsDropdownModule,
    NgxSpinnerModule,
    SharedModule,
    ModalModule.forRoot(),
  ],
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor, loadingInterceptor])),
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
