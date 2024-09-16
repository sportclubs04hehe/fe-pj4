import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from './message.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Router } from '@angular/router';
import { Message } from '../shared/models/message/message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit {
  messageService = inject(MessageService);
  container = 'Inbox';
  pageNumber = 1;
  pageSize = 5;
  isOutbox = this.container === 'Outbox';

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container);
  }

  deleteMessage(id: string) {
    this.messageService.deleteMessage(id).subscribe({
      next: _ => {
        this.messageService.paginatedResult.update(prev => {
          if(prev && prev.items) {
            prev.items.splice(prev.items.findIndex(m => m.id === id), 1);
            return prev;
          }

          return prev;
        });
      },
    });
  }

  getRouter(message: Message) {
    if (this.container === 'Outbox') return `/members/${message.recipientUsername}`;
    else return `/members/${message.senderUsername}`;
  }

  pageChange(event: PageChangedEvent) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }
  

}

