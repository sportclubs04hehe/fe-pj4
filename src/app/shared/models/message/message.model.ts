export interface Message {
    id: string
    senderId: string
    senderUsername: string
    senderKnowAs: string;
    senderPhotoUrl: string
    recipientId: string
    recipientUsername: string
    recipientKnowAs: string;
    recipientPhotoUrl: string
    content: string
    dateRead: Date
    messageSent: Date
  }