import { toast } from 'react-toastify';
import { chatsService } from './chatsService';

class MessagesService {
  constructor() {
    this.tableName = 'message';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sender_id" } },
          { field: { Name: "sender_username" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "read_by" } },
          { field: { Name: "type" } },
          {
            field: { Name: "chat_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "ASC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data?.map(message => ({
        Id: message.Id,
        chatId: message.chat_id?.Id || 0,
        senderId: message.sender_id,
        senderUsername: message.sender_username,
        content: message.content,
        timestamp: message.timestamp,
        readBy: this.parseReadBy(message.read_by),
        type: message.type || 'text'
      })) || [];
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sender_id" } },
          { field: { Name: "sender_username" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "read_by" } },
          { field: { Name: "type" } },
          {
            field: { Name: "chat_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Message not found');
      }
      
      const message = response.data;
      return {
        Id: message.Id,
        chatId: message.chat_id?.Id || 0,
        senderId: message.sender_id,
        senderUsername: message.sender_username,
        content: message.content,
        timestamp: message.timestamp,
        readBy: this.parseReadBy(message.read_by),
        type: message.type || 'text'
      };
    } catch (error) {
      console.error(`Error fetching message with ID ${id}:`, error);
      throw error;
    }
  }

  async getByChatId(chatId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sender_id" } },
          { field: { Name: "sender_username" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "read_by" } },
          { field: { Name: "type" } }
        ],
        where: [
          {
            FieldName: "chat_id",
            Operator: "EqualTo",
            Values: [parseInt(chatId)]
          }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "ASC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data?.map(message => ({
        Id: message.Id,
        chatId: parseInt(chatId),
        senderId: message.sender_id,
        senderUsername: message.sender_username,
        content: message.content,
        timestamp: message.timestamp,
        readBy: this.parseReadBy(message.read_by),
        type: message.type || 'text'
      })) || [];
    } catch (error) {
      console.error(`Error fetching messages for chat ${chatId}:`, error);
      return [];
    }
  }

  async create(messageData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [
          {
            Name: `Message from currentuser`,
            sender_id: 'current-user',
            sender_username: 'currentuser',
            content: messageData.content,
            timestamp: new Date().toISOString(),
            read_by: 'current-user',
            type: messageData.type || 'text'
          }
        ]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create message');
      }
      
      if (response.results) {
        const successfulCreations = response.results.filter(result => result.success);
        const failedCreations = response.results.filter(result => !result.success);
        
        if (failedCreations.length > 0) {
          console.error(`Failed to create ${failedCreations.length} messages:${JSON.stringify(failedCreations)}`);
          
          failedCreations.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulCreations.length > 0) {
          const message = successfulCreations[0].data;
          const newMessage = {
            Id: message.Id,
            chatId: parseInt(messageData.chatId),
            senderId: message.sender_id,
            senderUsername: message.sender_username,
            content: message.content,
            timestamp: message.timestamp,
            readBy: this.parseReadBy(message.read_by),
            type: message.type || 'text'
          };
          
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
          
          return newMessage;
        }
      }
      
      throw new Error('Failed to create message');
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (data.content !== undefined) updateData.content = data.content;
      if (data.readBy !== undefined) updateData.read_by = Array.isArray(data.readBy) ? data.readBy.join(',') : data.readBy;
      if (data.type !== undefined) updateData.type = data.type;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update message');
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} messages:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const message = successfulUpdates[0].data;
          return {
            Id: message.Id,
            chatId: message.chat_id?.Id || 0,
            senderId: message.sender_id,
            senderUsername: message.sender_username,
            content: message.content,
            timestamp: message.timestamp,
            readBy: this.parseReadBy(message.read_by),
            type: message.type || 'text'
          };
        }
      }
      
      throw new Error('Failed to update message');
    } catch (error) {
      console.error("Error updating message:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} messages:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting message:", error);
      return false;
    }
  }

  async markAsRead(messageId, userId = 'current-user') {
    try {
      const message = await this.getById(messageId);
      if (!message) throw new Error('Message not found');
      
      const readBy = [...message.readBy];
      if (!readBy.includes(userId)) {
        readBy.push(userId);
      }
      
      const updatedMessage = await this.update(messageId, { readBy });
      return updatedMessage;
    } catch (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
  }

  async markChatAsRead(chatId, userId = 'current-user') {
    try {
      const chatMessages = await this.getByChatId(chatId);
      
      const updatePromises = chatMessages
        .filter(message => !message.readBy.includes(userId))
        .map(message => {
          const readBy = [...message.readBy, userId];
          return this.update(message.Id, { readBy });
        });
      
      const updatedMessages = await Promise.all(updatePromises);
      return updatedMessages;
    } catch (error) {
      console.error("Error marking chat as read:", error);
      return [];
    }
  }

  parseReadBy(readByString) {
    if (!readByString || typeof readByString !== 'string') return [];
    return readByString.split(',').filter(user => user.trim().length > 0);
  }
}

export const messagesService = new MessagesService();