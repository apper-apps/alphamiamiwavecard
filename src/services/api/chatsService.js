import { chats } from '@/services/mockData/chats.json';
import { users } from '@/services/mockData/users.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ChatsService {
  constructor() {
    this.chats = [...chats];
    this.users = [...users];
  }

  async getAll() {
    await delay(300);
    return this.chats
      .map(chat => ({
        ...chat,
        participants: chat.participantIds.map(id => 
          this.users.find(u => u.Id === id)
        ).filter(Boolean)
      }))
      .sort((a, b) => {
        const aTime = a.lastMessage ? new Date(a.lastMessage.timestamp) : new Date(a.createdAt);
        const bTime = b.lastMessage ? new Date(b.lastMessage.timestamp) : new Date(b.createdAt);
        return bTime - aTime;
      });
  }

  async getById(id) {
    await delay(200);
    const chat = this.chats.find(c => c.Id === parseInt(id));
    if (!chat) throw new Error('Chat not found');
    
    return {
      ...chat,
      participants: chat.participantIds.map(id => 
        this.users.find(u => u.Id === id)
      ).filter(Boolean)
    };
  }

  async create(chatData) {
    await delay(400);
    const newChat = {
      Id: Math.max(...this.chats.map(c => c.Id)) + 1,
      name: chatData.name,
      participantIds: chatData.participantIds,
      lastMessage: null,
      avatarUrl: chatData.avatarUrl || '',
      createdAt: new Date().toISOString()
    };
    
    this.chats.unshift(newChat);
    return {
      ...newChat,
      participants: newChat.participantIds.map(id => 
        this.users.find(u => u.Id === id)
      ).filter(Boolean)
    };
  }

  async update(id, data) {
    await delay(300);
    const index = this.chats.findIndex(c => c.Id === parseInt(id));
    if (index === -1) throw new Error('Chat not found');
    
    this.chats[index] = { ...this.chats[index], ...data };
    return {
      ...this.chats[index],
      participants: this.chats[index].participantIds.map(id => 
        this.users.find(u => u.Id === id)
      ).filter(Boolean)
    };
  }

  async delete(id) {
    await delay(200);
    const index = this.chats.findIndex(c => c.Id === parseInt(id));
    if (index === -1) throw new Error('Chat not found');
    
    this.chats.splice(index, 1);
    return true;
  }

  async updateLastMessage(chatId, message) {
    const chat = this.chats.find(c => c.Id === parseInt(chatId));
    if (chat) {
      chat.lastMessage = message;
    }
  }
}

export const chatsService = new ChatsService();