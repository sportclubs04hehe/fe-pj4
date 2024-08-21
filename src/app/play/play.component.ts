import { Component, OnInit } from '@angular/core';
import { PlayService } from './play.service';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent implements OnInit {
  message = '';

  constructor(private playService: PlayService,
    private accountService: AccountService
  ) {

  }

  ngOnInit(): void {
    this.playService.getPlayers().subscribe({
      next: (response: any) => this.message = response.value.message,
      error: (err) => console.error(err),
    });
  }

}
