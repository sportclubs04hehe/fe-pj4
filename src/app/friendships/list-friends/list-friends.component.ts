import { Component, inject, OnInit } from '@angular/core';
import { Friendships, FriendshipStatus } from '../../shared/models/user/friendships.model';
import { FriendshipService } from '../friendship.service';

@Component({
  selector: 'app-list-friends',
  templateUrl: './list-friends.component.html',
  styleUrl: './list-friends.component.scss'
})
export class ListFriendsComponent implements OnInit{
  friends: Friendships[] = [];

  friendshipService = inject(FriendshipService);

  ngOnInit(): void {
    this.loadFriends();
  }

  loadFriends() {
    this.friendshipService.getFriendships(FriendshipStatus.ACCEPTED).subscribe({
      next: (res: Friendships[]) => {
        this.friends = res;
      }
    })
  }
  
}
