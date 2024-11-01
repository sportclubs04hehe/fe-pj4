import { Component, OnInit, ChangeDetectorRef, NgZone, HostListener } from '@angular/core';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AccountService } from '../account/account.service';
import { MemberService } from '../members/member.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit {
  private stompClient: any;
  public privateChats$ = new BehaviorSubject<Map<string, any[]>>(new Map());
  public users$ = new BehaviorSubject<any[]>([]);
  public message: string = '';  
  public recipient: string = '';  
  public newMessagesMap$ = new BehaviorSubject<Map<string, boolean>>(new Map());

  public isEditing: boolean = false;
  public editingMessageId: string | null = null;
  public editingMessageContent: string = '';

  showOptionsMenu: string | null = null;

  constructor(
    public userService: AccountService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private messageService: MemberService
  ) {}

  ngOnInit(): void {
    const userData = this.userService.getUserData();
    if (userData.username) {
      this.connect();
      this.fetchPreviousMessages(userData.username);

      const recipientName = this.messageService.getRecipientName();
      if (recipientName) {
        this.handleReceiverName(recipientName);
      }
    }
  }

  fetchPreviousMessages(username: string) {
    this.privateChats$.next(new Map());

    this.http.get<any[]>(`http://localhost:8080/messages/user/${username}`).subscribe((messages) => {
      // Sắp xếp tin nhắn theo id
      messages.sort((a, b) => a.id - b.id);

      messages.forEach((message) => {
        if (message.receiverName && message.senderName) {
          const chatPartner = message.senderName === username ? message.receiverName : message.senderName;
          this.addMessageToPrivateChats(chatPartner, message);
        }
      });
      this.cdr.detectChanges();
    });
  }


  fetchLatestMessages(username: string) {
    this.http.get<any>(`http://localhost:8080/messages/user/last/${username}`).subscribe((latestMessage) => {
      if (latestMessage.receiverName && latestMessage.senderName) {
        const chatPartner = latestMessage.senderName === username ? latestMessage.receiverName : latestMessage.senderName;
        const currentChats = this.privateChats$.value;

        if (currentChats.has(chatPartner)) {
          const messages = currentChats.get(chatPartner)!;
          const isMessageExist = messages.some(msg => msg.id === latestMessage.id);
  
          if (!isMessageExist) {
            messages.push(latestMessage); 
            this.privateChats$.next(new Map(currentChats));
          }
        } else {
          this.addMessageToPrivateChats(chatPartner, latestMessage);
        }

        this.cdr.markForCheck();
      }
    });
  }
  
  sendPrivateValue() {
    const userData = this.userService.getUserData();
    if (this.message.trim() !== '' && this.recipient !== '') {
      const chatMessage = {
        senderName: userData.username,
        receiverName: this.recipient,
        message: this.message,
        status: 'MESSAGE',
      };

      setTimeout(() => {
        this.stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
        this.message = '';
        this.fetchLatestMessages(userData.username);
        this.scrollToBottom();
      });
    }
  }


  addMessageToPrivateChats(senderOrReceiver: string, message: any) {
    this.ngZone.run(() => {
      const currentChats = this.privateChats$.value;
      if (!currentChats.has(senderOrReceiver)) {
        currentChats.set(senderOrReceiver, []);
      }
      currentChats.get(senderOrReceiver)!.push(message);
      this.privateChats$.next(new Map(currentChats));
    });
  }

  connect() {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = over(socket);
    this.stompClient.connect({}, this.onConnected.bind(this), this.onError);
  }

  onConnected() {
    const userData = this.userService.getUserData();
    this.userService.setUserData({ ...userData, connected: true });
    this.stompClient.subscribe('/user/' + userData.username + '/private', this.onPrivateMessage.bind(this));
    this.userJoin();
  }

  userJoin() {
    const userData = this.userService.getUserData();
    if (this.stompClient) {
      const chatMessage = {
        senderName: userData.username,
        status: 'JOIN',
      };
      this.stompClient.send('/app/join', {}, JSON.stringify(chatMessage));
    }
  }

  onPrivateMessage(payload: any) {
    this.ngZone.run(() => {
      const payloadData = JSON.parse(payload.body);
      const userData = this.userService.getUserData();
      const chatPartner = payloadData.senderName === userData.username ? payloadData.receiverName : payloadData.senderName;

      if (this.recipient === chatPartner) {
        const currentNewMessagesMap = this.newMessagesMap$.value;
        currentNewMessagesMap.set(chatPartner, false);
        this.newMessagesMap$.next(new Map(currentNewMessagesMap));
      } else {
        const currentNewMessagesMap = this.newMessagesMap$.value;
        currentNewMessagesMap.set(chatPartner, true);
        this.newMessagesMap$.next(new Map(currentNewMessagesMap));
      }

      if (payloadData.edited) {
        this.updatePrivateMessage(payloadData, payloadData.message, userData);
      } else if (payloadData.id) {
        this.addMessageToPrivateChats(chatPartner, payloadData);
        this.scrollToBottom();
      } else {
        this.removeMessageFromView(payloadData);
      }
    });
  }


  onError(err: any) {
    console.log(err);
  }

  handleMessage(event: any) {
    this.message = event.target.value;
  }

  startEditMessage(messageId: string, content: string) {
    this.isEditing = true;
    this.editingMessageId = messageId;
    this.editingMessageContent = content;
    this.showOptionsMenu = null;
  }

  saveEditedMessage() {
    if (this.editingMessageId && this.editingMessageContent.trim() !== '') {
      const chatMessage = {
        id: this.editingMessageId,
        message: this.editingMessageContent,
        status: 'MESSAGE',
        receiverName: this.recipient
      };

      if (this.stompClient) {
        this.stompClient.send('/app/edit-message', {}, JSON.stringify(chatMessage));
        this.resetEditingState();
      }
    }
  }

  private updatePrivateMessage(response: any, updatedMessage: string, userData: any) {
    const chatPartner = response.senderName === userData.username ? response.receiverName : response.senderName;
    const privateChats = new Map(this.privateChats$.value);
    const updatedChat = privateChats.get(chatPartner)?.map(msg => {
      if (msg.id === response.id) {
        return { ...msg, message: updatedMessage, edited: true };
      }
      return msg;
    });

    if (updatedChat) {
      privateChats.set(chatPartner, updatedChat);
      this.privateChats$.next(new Map(privateChats));
    }
  }

  cancelEditMessage() {
    this.resetEditingState();
  }

  private resetEditingState() {
    this.isEditing = false;
    this.editingMessageId = null;
    this.editingMessageContent = '';
  }

  deleteMessage(messageId: string) {
    if (this.stompClient) {
      this.stompClient.send('/app/delete-message', {}, JSON.stringify(messageId));
      this.removeMessageFromView(messageId);
    }
  }

  removeMessageFromView(messageId: string) {
    const updatedPrivateChats = new Map(this.privateChats$.value);
    updatedPrivateChats.forEach((messages, user) => {
      const filteredMessages = messages.filter(msg => msg.id !== messageId);
      updatedPrivateChats.set(user, filteredMessages);
    });
    this.privateChats$.next(updatedPrivateChats);
  }

  handleReceiverName(username: string) {
    this.recipient = username;
    this.messageService.setRecipientName(username);

    const currentNewMessagesMap = this.newMessagesMap$.value;
    currentNewMessagesMap.set(username, false);
    this.newMessagesMap$.next(new Map(currentNewMessagesMap));
  }

  // Add new methods for message options
  toggleOptionsMenu(messageId: string, event: Event) {
    event.stopPropagation();
    this.showOptionsMenu = this.showOptionsMenu === messageId ? null : messageId;
  }

  closeAllOptionsMenus() {
    this.showOptionsMenu = null;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeAllOptionsMenus();
  }

  extractNewMessage(message: string): string {
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage && parsedMessage.newMessage) {
        return parsedMessage.newMessage;
      }
    } catch (error) {
      // Nếu không phải JSON, trả về tin nhắn gốc
      return message;
    }
    return message;
  }

  // Add this new method
  private scrollToBottom() {
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
  }
  
}

