export abstract class MessageRepository {
  abstract getChatMessages();
  abstract createMessage();
  abstract markMessagesAsRead();
}
