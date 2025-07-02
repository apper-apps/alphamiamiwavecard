import { toast } from 'react-toastify';

class ChannelsService {
  constructor() {
    this.tableName = 'channel';
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
          { field: { Name: "channel_name" } },
          { field: { Name: "description" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data?.map(channel => ({
        Id: channel.Id,
        channelName: channel.channel_name,
        description: channel.description,
        createdOn: channel.CreatedOn,
        memberCount: Math.floor(Math.random() * 1000) + 50, // Mock data
        messageCount: Math.floor(Math.random() * 5000) + 100, // Mock data
        isActive: Math.random() > 0.5, // Mock data
        isJoined: Math.random() > 0.7 // Mock data
      })) || [];
    } catch (error) {
      console.error("Error fetching channels:", error);
      toast.error("Failed to load channels");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "channel_name" } },
          { field: { Name: "description" } },
          { field: { Name: "CreatedOn" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      const channel = response.data;
      return {
        Id: channel.Id,
        channelName: channel.channel_name,
        description: channel.description,
        createdOn: channel.CreatedOn,
        memberCount: Math.floor(Math.random() * 1000) + 50,
        messageCount: Math.floor(Math.random() * 5000) + 100,
        isActive: true,
        isJoined: false
      };
    } catch (error) {
      console.error(`Error fetching channel with ID ${id}:`, error);
      toast.error("Failed to load channel");
      return null;
    }
  }

  async create(channelData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [
          {
            Name: channelData.channelName,
            channel_name: channelData.channelName,
            description: channelData.description || ''
          }
        ]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create channel');
      }
      
      if (response.results) {
        const successfulCreations = response.results.filter(result => result.success);
        const failedCreations = response.results.filter(result => !result.success);
        
        if (failedCreations.length > 0) {
          console.error(`Failed to create ${failedCreations.length} channels:${JSON.stringify(failedCreations)}`);
          
          failedCreations.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulCreations.length > 0) {
          const channel = successfulCreations[0].data;
          return {
            Id: channel.Id,
            channelName: channel.channel_name,
            description: channel.description,
            createdOn: channel.CreatedOn,
            memberCount: 1,
            messageCount: 0,
            isActive: true,
            isJoined: true
          };
        }
      }
      
      throw new Error('Failed to create channel');
    } catch (error) {
      console.error("Error creating channel:", error);
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
      if (data.channelName !== undefined) {
        updateData.Name = data.channelName;
        updateData.channel_name = data.channelName;
      }
      if (data.description !== undefined) updateData.description = data.description;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update channel');
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} channels:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const channel = successfulUpdates[0].data;
          return {
            Id: channel.Id,
            channelName: channel.channel_name,
            description: channel.description,
            createdOn: channel.CreatedOn
          };
        }
      }
      
      throw new Error('Failed to update channel');
    } catch (error) {
      console.error("Error updating channel:", error);
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
          console.error(`Failed to delete ${failedDeletions.length} channels:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting channel:", error);
      return false;
    }
  }

  async getTrending(limit = 5) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "channel_name" } },
          { field: { Name: "description" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: limit * 2,
          offset: 0
        }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      const channels = response.data?.map(channel => ({
        Id: channel.Id,
        channelName: channel.channel_name,
        description: channel.description,
        createdOn: channel.CreatedOn,
        memberCount: Math.floor(Math.random() * 2000) + 100,
        messageCount: Math.floor(Math.random() * 10000) + 500,
        isActive: true,
        isJoined: Math.random() > 0.5
      })) || [];
      
      // Sort by member count for trending and randomize
      return channels
        .sort((a, b) => b.memberCount - a.memberCount)
        .slice(0, limit);
    } catch (error) {
      console.error("Error getting trending channels:", error);
      return [];
    }
  }

  async search(query) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "channel_name" } },
          { field: { Name: "description" } },
          { field: { Name: "CreatedOn" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "channel_name",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "description",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              }
            ]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data?.map(channel => ({
        Id: channel.Id,
        channelName: channel.channel_name,
        description: channel.description,
        createdOn: channel.CreatedOn,
        memberCount: Math.floor(Math.random() * 1000) + 50,
        messageCount: Math.floor(Math.random() * 5000) + 100,
        isActive: Math.random() > 0.5,
        isJoined: Math.random() > 0.7
      })) || [];
    } catch (error) {
      console.error("Error searching channels:", error);
      return [];
    }
  }
}

export const channelsService = new ChannelsService();