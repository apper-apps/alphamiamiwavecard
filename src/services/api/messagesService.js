import { messages } from '@/services/mockData/messages.json';
import { chatsService } from './chatsService';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MessagesService {
  constructor() {
    this.messages = [...messages];
  }

  async getAll() {
    await delay(300);
    return this.messages
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(msg => ({ ...msg }));
  }

  async getById(id) {
    await delay(200);
    const message = this.messages.find(m => m.Id === parseInt(id));
    if (!message) throw new Error('Message not found');
    return { ...message };
  }

  async getByChatId(chatId) {
    await delay(300);
    return this.messages
      .filter(m => m.chatId === parseInt(chatId))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(msg => ({ ...msg }));
  }

  async create(messageData) {
    await delay(400);
    const newMessage = {
      Id: Math.max(...this.messages.map(m => m.Id)) + 1,
      chatId: parseInt(messageData.chatId),
      senderId: 'current-user',
      senderUsername: 'currentuser',
      content: messageData.content,
      timestamp: new Date().toISOString(),
      readBy: ['current-user'],
      type: messageData.type || 'text'
    };
    
    this.messages.push(newMessage);
    
    // Update last message in chat
    try {
      await chatsService.updateLastMessage(messageData.chatId, {
        content: newMessage.content,
        timestamp: newMessage.timestamp,
        senderId: newMessage.senderId,
        senderUsername: newMessage.senderUsername
      });
    } catch (error) {
      console.warn('Failed to update chat last message:', error);
    }
    
    return { ...newMessage };
  }

  async update(id, data) {
    await delay(300);
    const index = this.messages.findIndex(m => m.Id === parseInt(id));
    if (index === -1) throw new Error('Message not found');
    
    this.messages[index] = { ...this.messages[index], ...data };
    return { ...this.messages[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.messages.findIndex(m => m.Id === parseInt(id));
    if (index === -1) throw new Error('Message not found');
    
    this.messages.splice(index, 1);
    return true;
  }

  async markAsRead(messageId, userId = 'current-user') {
    await delay(200);
    const message = this.messages.find(m => m.Id === parseInt(messageId));
    if (!message) throw new Error('Message not found');
    
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
    }
    
    return { ...message };
  }

  async markChatAsRead(chatId, userId = 'current-user') {
    await delay(300);
    const chatMessages = this.messages.filter(m => m.chatId === parseInt(chatId));
    
    chatMessages.forEach(message => {
      if (!message.readBy.includes(userId)) {
        message.readBy.push(userId);
      }
    });
    
    return chatMessages.map(msg => ({ ...msg }));
  }
}

export const messagesService = new MessagesService();