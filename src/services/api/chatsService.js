import { toast } from 'react-toastify';
import { usersService } from './usersService';

class ChatsService {
  constructor() {
    this.tableName = 'chat';
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
          { field: { Name: "participant_ids" } },
          { field: { Name: "last_message_content" } },
          { field: { Name: "last_message_timestamp" } },
          { field: { Name: "last_message_sender_id" } },
          { field: { Name: "last_message_sender_username" } },
          { field: { Name: "avatar_url" } },
          { field: { Name: "created_at" } }
        ],
        orderBy: [
          { fieldName: "last_message_timestamp", sorttype: "DESC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      const chats = await Promise.all((response.data || []).map(async (chat) => {
        const participantIds = this.parseParticipantIds(chat.participant_ids);
        const participants = await this.getParticipantDetails(participantIds);
        
        return {
          Id: chat.Id,
          name: chat.Name,
          participantIds: participantIds,
          participants: participants,
          lastMessage: chat.last_message_content ? {
            content: chat.last_message_content,
            timestamp: chat.last_message_timestamp,
            senderId: chat.last_message_sender_id,
            senderUsername: chat.last_message_sender_username
          } : null,
          avatarUrl: chat.avatar_url || '',
          createdAt: chat.created_at
        };
      }));
      
      return chats.sort((a, b) => {
        const aTime = a.lastMessage ? new Date(a.lastMessage.timestamp) : new Date(a.createdAt);
        const bTime = b.lastMessage ? new Date(b.lastMessage.timestamp) : new Date(b.createdAt);
        return bTime - aTime;
      });
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to load chats");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "participant_ids" } },
          { field: { Name: "last_message_content" } },
          { field: { Name: "last_message_timestamp" } },
          { field: { Name: "last_message_sender_id" } },
          { field: { Name: "last_message_sender_username" } },
          { field: { Name: "avatar_url" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Chat not found');
      }
      
      const chat = response.data;
      const participantIds = this.parseParticipantIds(chat.participant_ids);
      const participants = await this.getParticipantDetails(participantIds);
      
      return {
        Id: chat.Id,
        name: chat.Name,
        participantIds: participantIds,
        participants: participants,
        lastMessage: chat.last_message_content ? {
          content: chat.last_message_content,
          timestamp: chat.last_message_timestamp,
          senderId: chat.last_message_sender_id,
          senderUsername: chat.last_message_sender_username
        } : null,
        avatarUrl: chat.avatar_url || '',
        createdAt: chat.created_at
      };
    } catch (error) {
      console.error(`Error fetching chat with ID ${id}:`, error);
      throw error;
    }
  }

  async create(chatData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [
          {
            Name: chatData.name,
            participant_ids: Array.isArray(chatData.participantIds) ? chatData.participantIds.join(',') : chatData.participantIds,
            last_message_content: '',
            last_message_timestamp: new Date().toISOString(),
            last_message_sender_id: '',
            last_message_sender_username: '',
            avatar_url: chatData.avatarUrl || '',
            created_at: new Date().toISOString()
          }
        ]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create chat');
      }
      
      if (response.results) {
        const successfulCreations = response.results.filter(result => result.success);
        const failedCreations = response.results.filter(result => !result.success);
        
        if (failedCreations.length > 0) {
          console.error(`Failed to create ${failedCreations.length} chats:${JSON.stringify(failedCreations)}`);
          
          failedCreations.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulCreations.length > 0) {
          const chat = successfulCreations[0].data;
          const participantIds = this.parseParticipantIds(chat.participant_ids);
          const participants = await this.getParticipantDetails(participantIds);
          
          return {
            Id: chat.Id,
            name: chat.Name,
            participantIds: participantIds,
            participants: participants,
            lastMessage: null,
            avatarUrl: chat.avatar_url || '',
            createdAt: chat.created_at
          };
        }
      }
      
      throw new Error('Failed to create chat');
    } catch (error) {
      console.error("Error creating chat:", error);
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
      if (data.name !== undefined) updateData.Name = data.name;
      if (data.participantIds !== undefined) updateData.participant_ids = Array.isArray(data.participantIds) ? data.participantIds.join(',') : data.participantIds;
      if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;
      if (data.lastMessageContent !== undefined) updateData.last_message_content = data.lastMessageContent;
      if (data.lastMessageTimestamp !== undefined) updateData.last_message_timestamp = data.lastMessageTimestamp;
      if (data.lastMessageSenderId !== undefined) updateData.last_message_sender_id = data.lastMessageSenderId;
      if (data.lastMessageSenderUsername !== undefined) updateData.last_message_sender_username = data.lastMessageSenderUsername;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update chat');
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} chats:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const chat = successfulUpdates[0].data;
          const participantIds = this.parseParticipantIds(chat.participant_ids);
          const participants = await this.getParticipantDetails(participantIds);
          
          return {
            Id: chat.Id,
            name: chat.Name,
            participantIds: participantIds,
            participants: participants,
            lastMessage: chat.last_message_content ? {
              content: chat.last_message_content,
              timestamp: chat.last_message_timestamp,
              senderId: chat.last_message_sender_id,
              senderUsername: chat.last_message_sender_username
            } : null,
            avatarUrl: chat.avatar_url || '',
            createdAt: chat.created_at
          };
        }
      }
      
      throw new Error('Failed to update chat');
    } catch (error) {
      console.error("Error updating chat:", error);
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
          console.error(`Failed to delete ${failedDeletions.length} chats:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting chat:", error);
      return false;
    }
  }

  async updateLastMessage(chatId, message) {
    try {
      await this.update(chatId, {
        lastMessageContent: message.content,
        lastMessageTimestamp: message.timestamp,
        lastMessageSenderId: message.senderId,
        lastMessageSenderUsername: message.senderUsername
      });
    } catch (error) {
      console.warn('Failed to update chat last message:', error);
    }
  }

  parseParticipantIds(participantIdsString) {
    if (!participantIdsString || typeof participantIdsString !== 'string') return [];
    return participantIdsString.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
  }

  async getParticipantDetails(participantIds) {
    try {
      const participantPromises = participantIds.map(async (id) => {
        try {
          return await usersService.getById(id);
        } catch (error) {
          console.warn(`Failed to get participant details for ID ${id}:`, error);
          return null;
        }
      });
      
      const participants = await Promise.all(participantPromises);
      return participants.filter(participant => participant !== null);
    } catch (error) {
      console.error("Error getting participant details:", error);
      return [];
    }
  }
}

export const chatsService = new ChatsService();