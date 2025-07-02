import { toast } from 'react-toastify';

class UsersService {
  constructor() {
    this.tableName = 'app_User';
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
          { field: { Name: "username" } },
          { field: { Name: "display_name" } },
          { field: { Name: "avatar" } },
          { field: { Name: "bio" } },
          { field: { Name: "followers_count" } },
          { field: { Name: "following_count" } },
          { field: { Name: "is_online" } },
          { field: { Name: "is_following" } }
        ],
        orderBy: [
          { fieldName: "display_name", sorttype: "ASC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data?.map(user => ({
        Id: user.Id,
        username: user.username,
        displayName: user.display_name,
        avatar: user.avatar,
        bio: user.bio,
        followersCount: user.followers_count || 0,
        followingCount: user.following_count || 0,
        isOnline: user.is_online || false,
        isFollowing: user.is_following || false
      })) || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "display_name" } },
          { field: { Name: "avatar" } },
          { field: { Name: "bio" } },
          { field: { Name: "followers_count" } },
          { field: { Name: "following_count" } },
          { field: { Name: "is_online" } },
          { field: { Name: "is_following" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      const user = response.data;
      return {
        Id: user.Id,
        username: user.username,
        displayName: user.display_name,
        avatar: user.avatar,
        bio: user.bio,
        followersCount: user.followers_count || 0,
        followingCount: user.following_count || 0,
        isOnline: user.is_online || false,
        isFollowing: user.is_following || false
      };
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      toast.error("Failed to load user");
      return null;
    }
  }

  async getByUsername(username) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "display_name" } },
          { field: { Name: "avatar" } },
          { field: { Name: "bio" } },
          { field: { Name: "followers_count" } },
          { field: { Name: "following_count" } },
          { field: { Name: "is_online" } },
          { field: { Name: "is_following" } }
        ],
        where: [
          {
            FieldName: "username",
            Operator: "EqualTo",
            Values: [username]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('User not found');
      }
      
      if (!response.data || response.data.length === 0) {
        throw new Error('User not found');
      }
      
      const user = response.data[0];
      return {
        Id: user.Id,
        username: user.username,
        displayName: user.display_name,
        avatar: user.avatar,
        bio: user.bio,
        followersCount: user.followers_count || 0,
        followingCount: user.following_count || 0,
        isOnline: user.is_online || false,
        isFollowing: user.is_following || false
      };
    } catch (error) {
      console.error(`Error fetching user by username ${username}:`, error);
      throw error;
    }
  }

  async create(userData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [
          {
            Name: userData.displayName,
            username: userData.username,
            display_name: userData.displayName,
            avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
            bio: userData.bio || '',
            followers_count: 0,
            following_count: 0,
            is_online: true,
            is_following: false
          }
        ]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create user');
      }
      
      if (response.results) {
        const successfulCreations = response.results.filter(result => result.success);
        const failedCreations = response.results.filter(result => !result.success);
        
        if (failedCreations.length > 0) {
          console.error(`Failed to create ${failedCreations.length} users:${JSON.stringify(failedCreations)}`);
          
          failedCreations.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulCreations.length > 0) {
          const user = successfulCreations[0].data;
          return {
            Id: user.Id,
            username: user.username,
            displayName: user.display_name,
            avatar: user.avatar,
            bio: user.bio,
            followersCount: user.followers_count || 0,
            followingCount: user.following_count || 0,
            isOnline: user.is_online || false,
            isFollowing: user.is_following || false
          };
        }
      }
      
      throw new Error('Failed to create user');
    } catch (error) {
      console.error("Error creating user:", error);
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
      if (data.displayName !== undefined) updateData.display_name = data.displayName;
      if (data.username !== undefined) updateData.username = data.username;
      if (data.avatar !== undefined) updateData.avatar = data.avatar;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.followersCount !== undefined) updateData.followers_count = data.followersCount;
      if (data.followingCount !== undefined) updateData.following_count = data.followingCount;
      if (data.isOnline !== undefined) updateData.is_online = data.isOnline;
      if (data.isFollowing !== undefined) updateData.is_following = data.isFollowing;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update user');
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} users:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const user = successfulUpdates[0].data;
          return {
            Id: user.Id,
            username: user.username,
            displayName: user.display_name,
            avatar: user.avatar,
            bio: user.bio,
            followersCount: user.followers_count || 0,
            followingCount: user.following_count || 0,
            isOnline: user.is_online || false,
            isFollowing: user.is_following || false
          };
        }
      }
      
      throw new Error('Failed to update user');
    } catch (error) {
      console.error("Error updating user:", error);
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
          console.error(`Failed to delete ${failedDeletions.length} users:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  async follow(id) {
    try {
      const user = await this.getById(id);
      if (!user) throw new Error('User not found');
      
      const updatedUser = await this.update(id, {
        followersCount: user.followersCount + 1,
        isFollowing: true
      });
      
      return updatedUser;
    } catch (error) {
      console.error("Error following user:", error);
      throw error;
    }
  }

  async unfollow(id) {
    try {
      const user = await this.getById(id);
      if (!user) throw new Error('User not found');
      
      const updatedUser = await this.update(id, {
        followersCount: Math.max(0, user.followersCount - 1),
        isFollowing: false
      });
      
      return updatedUser;
    } catch (error) {
      console.error("Error unfollowing user:", error);
      throw error;
    }
  }

  async search(query) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "display_name" } },
          { field: { Name: "avatar" } },
          { field: { Name: "bio" } },
          { field: { Name: "followers_count" } },
          { field: { Name: "following_count" } },
          { field: { Name: "is_online" } },
          { field: { Name: "is_following" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "username",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "display_name",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "bio",
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
      
      return response.data?.map(user => ({
        Id: user.Id,
        username: user.username,
        displayName: user.display_name,
        avatar: user.avatar,
        bio: user.bio,
        followersCount: user.followers_count || 0,
        followingCount: user.following_count || 0,
        isOnline: user.is_online || false,
        isFollowing: user.is_following || false
      })) || [];
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  }

  async getSuggested(limit = 5) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "display_name" } },
          { field: { Name: "avatar" } },
          { field: { Name: "bio" } },
          { field: { Name: "followers_count" } },
          { field: { Name: "following_count" } },
          { field: { Name: "is_online" } },
          { field: { Name: "is_following" } }
        ],
        where: [
          {
            FieldName: "is_following",
            Operator: "EqualTo",
            Values: [false]
          }
        ],
        pagingInfo: {
          limit: limit * 2, // Get more to randomize
          offset: 0
        }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      const users = response.data?.map(user => ({
        Id: user.Id,
        username: user.username,
        displayName: user.display_name,
        avatar: user.avatar,
        bio: user.bio,
        followersCount: user.followers_count || 0,
        followingCount: user.following_count || 0,
        isOnline: user.is_online || false,
        isFollowing: user.is_following || false
      })) || [];
      
      // Randomize and limit
      return users
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);
    } catch (error) {
      console.error("Error getting suggested users:", error);
      return [];
    }
  }
}

export const usersService = new UsersService();