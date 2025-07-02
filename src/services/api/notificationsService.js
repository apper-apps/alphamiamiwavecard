import { toast } from 'react-toastify';

class NotificationsService {
  constructor() {
    this.tableName = 'app_Notification';
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
          { field: { Name: "type" } },
          { field: { Name: "content" } },
          { field: { Name: "is_read" } },
          { field: { Name: "CreatedOn" } },
          { 
            field: { Name: "recipient" },
            referenceField: { field: { Name: "username" } }
          }
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
      
      return response.data?.map(notification => ({
        Id: notification.Id,
        type: notification.type,
        content: notification.content,
        isRead: notification.is_read || false,
        timestamp: notification.CreatedOn,
        username: notification.recipient?.username || 'unknown',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.recipient?.username || 'default'}`
      })) || [];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "content" } },
          { field: { Name: "is_read" } },
          { field: { Name: "CreatedOn" } },
          { 
            field: { Name: "recipient" },
            referenceField: { field: { Name: "username" } }
          }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      const notification = response.data;
      return {
        Id: notification.Id,
        type: notification.type,
        content: notification.content,
        isRead: notification.is_read || false,
        timestamp: notification.CreatedOn,
        username: notification.recipient?.username || 'unknown',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.recipient?.username || 'default'}`
      };
    } catch (error) {
      console.error(`Error fetching notification with ID ${id}:`, error);
      toast.error("Failed to load notification");
      return null;
    }
  }

  async create(notificationData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [
          {
            Name: notificationData.content || 'New notification',
            type: notificationData.type,
            content: notificationData.content,
            is_read: false,
            recipient: parseInt(notificationData.recipientId)
          }
        ]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create notification');
      }
      
      if (response.results) {
        const successfulCreations = response.results.filter(result => result.success);
        const failedCreations = response.results.filter(result => !result.success);
        
        if (failedCreations.length > 0) {
          console.error(`Failed to create ${failedCreations.length} notifications:${JSON.stringify(failedCreations)}`);
          
          failedCreations.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulCreations.length > 0) {
          const notification = successfulCreations[0].data;
          return {
            Id: notification.Id,
            type: notification.type,
            content: notification.content,
            isRead: notification.is_read || false,
            timestamp: notification.CreatedOn,
            username: 'current_user',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current_user'
          };
        }
      }
      
      throw new Error('Failed to create notification');
    } catch (error) {
      console.error("Error creating notification:", error);
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
      if (data.type !== undefined) updateData.type = data.type;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.isRead !== undefined) updateData.is_read = data.isRead;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update notification');
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} notifications:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const notification = successfulUpdates[0].data;
          return {
            Id: notification.Id,
            type: notification.type,
            content: notification.content,
            isRead: notification.is_read || false,
            timestamp: notification.CreatedOn
          };
        }
      }
      
      throw new Error('Failed to update notification');
    } catch (error) {
      console.error("Error updating notification:", error);
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
          console.error(`Failed to delete ${failedDeletions.length} notifications:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting notification:", error);
      return false;
    }
  }

  async markAsRead(id) {
    try {
      return await this.update(id, { isRead: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  async markAsUnread(id) {
    try {
      return await this.update(id, { isRead: false });
    } catch (error) {
      console.error("Error marking notification as unread:", error);
      throw error;
    }
  }

  async markAllAsRead() {
    try {
      // First get all unread notifications
      const unreadNotifications = await this.getUnread();
      
      if (unreadNotifications.length === 0) {
        return true;
      }
      
      // Update all unread notifications
      const updatePromises = unreadNotifications.map(notification =>
        this.update(notification.Id, { isRead: true })
      );
      
      await Promise.all(updatePromises);
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  async getUnread() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "content" } },
          { field: { Name: "is_read" } },
          { field: { Name: "CreatedOn" } },
          { 
            field: { Name: "recipient" },
            referenceField: { field: { Name: "username" } }
          }
        ],
        where: [
          {
            FieldName: "is_read",
            Operator: "EqualTo",
            Values: [false]
          }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(notification => ({
        Id: notification.Id,
        type: notification.type,
        content: notification.content,
        isRead: notification.is_read || false,
        timestamp: notification.CreatedOn,
        username: notification.recipient?.username || 'unknown',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.recipient?.username || 'default'}`
      })) || [];
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      return [];
    }
  }

  async getByType(type) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "content" } },
          { field: { Name: "is_read" } },
          { field: { Name: "CreatedOn" } },
          { 
            field: { Name: "recipient" },
            referenceField: { field: { Name: "username" } }
          }
        ],
        where: [
          {
            FieldName: "type",
            Operator: "EqualTo",
            Values: [type]
          }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(notification => ({
        Id: notification.Id,
        type: notification.type,
        content: notification.content,
        isRead: notification.is_read || false,
        timestamp: notification.CreatedOn,
        username: notification.recipient?.username || 'unknown',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.recipient?.username || 'default'}`
      })) || [];
    } catch (error) {
      console.error(`Error fetching notifications by type ${type}:`, error);
      return [];
    }
  }
}

export const notificationsService = new NotificationsService();