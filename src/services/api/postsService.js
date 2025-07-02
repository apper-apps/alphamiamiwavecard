import { toast } from 'react-toastify';

class PostsService {
  constructor() {
    this.tableName = 'post';
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
          { field: { Name: "content" } },
          { field: { Name: "image_url" } },
          { field: { Name: "likes" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "hashtags" } },
          { field: { Name: "is_online" } },
          {
            field: { Name: "user_id" },
            referenceField: { field: { Name: "display_name" } }
          }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "DESC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data?.map(post => ({
        Id: post.Id,
        userId: post.username,
        username: post.username,
        displayName: post.display_name,
        content: post.content,
        imageUrl: post.image_url || '',
        likes: this.parseLikes(post.likes),
        comments: [],
        timestamp: post.timestamp,
        hashtags: this.parseHashtags(post.hashtags),
        isOnline: post.is_online || false
      })) || [];
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
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
          { field: { Name: "content" } },
          { field: { Name: "image_url" } },
          { field: { Name: "likes" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "hashtags" } },
          { field: { Name: "is_online" } },
          {
            field: { Name: "user_id" },
            referenceField: { field: { Name: "display_name" } }
          }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Post not found');
      }
      
      const post = response.data;
      return {
        Id: post.Id,
        userId: post.username,
        username: post.username,
        displayName: post.display_name,
        content: post.content,
        imageUrl: post.image_url || '',
        likes: this.parseLikes(post.likes),
        comments: [],
        timestamp: post.timestamp,
        hashtags: this.parseHashtags(post.hashtags),
        isOnline: post.is_online || false
      };
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      throw error;
    }
  }

  async getByUserId(userId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "display_name" } },
          { field: { Name: "content" } },
          { field: { Name: "image_url" } },
          { field: { Name: "likes" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "hashtags" } },
          { field: { Name: "is_online" } }
        ],
        where: [
          {
            FieldName: "username",
            Operator: "EqualTo",
            Values: [userId]
          }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "DESC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data?.map(post => ({
        Id: post.Id,
        userId: post.username,
        username: post.username,
        displayName: post.display_name,
        content: post.content,
        imageUrl: post.image_url || '',
        likes: this.parseLikes(post.likes),
        comments: [],
        timestamp: post.timestamp,
        hashtags: this.parseHashtags(post.hashtags),
        isOnline: post.is_online || false
      })) || [];
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      return [];
    }
  }

  async create(postData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const hashtags = this.extractHashtags(postData.content);
      
      const params = {
        records: [
          {
            Name: `Post by currentuser`,
            username: 'currentuser',
            display_name: 'Your Profile',
            content: postData.content,
            image_url: postData.imageUrl || '',
            likes: '',
            timestamp: new Date().toISOString(),
            hashtags: hashtags.join(','),
            is_online: true
          }
        ]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create post');
      }
      
      if (response.results) {
        const successfulCreations = response.results.filter(result => result.success);
        const failedCreations = response.results.filter(result => !result.success);
        
        if (failedCreations.length > 0) {
          console.error(`Failed to create ${failedCreations.length} posts:${JSON.stringify(failedCreations)}`);
          
          failedCreations.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulCreations.length > 0) {
          const post = successfulCreations[0].data;
          return {
            Id: post.Id,
            userId: post.username,
            username: post.username,
            displayName: post.display_name,
            content: post.content,
            imageUrl: post.image_url || '',
            likes: this.parseLikes(post.likes),
            comments: [],
            timestamp: post.timestamp,
            hashtags: this.parseHashtags(post.hashtags),
            isOnline: post.is_online || false
          };
        }
      }
      
      throw new Error('Failed to create post');
    } catch (error) {
      console.error("Error creating post:", error);
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
      if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
      if (data.likes !== undefined) updateData.likes = Array.isArray(data.likes) ? data.likes.join(',') : data.likes;
      if (data.hashtags !== undefined) updateData.hashtags = Array.isArray(data.hashtags) ? data.hashtags.join(',') : data.hashtags;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update post');
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} posts:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const post = successfulUpdates[0].data;
          return {
            Id: post.Id,
            userId: post.username,
            username: post.username,
            displayName: post.display_name,
            content: post.content,
            imageUrl: post.image_url || '',
            likes: this.parseLikes(post.likes),
            comments: [],
            timestamp: post.timestamp,
            hashtags: this.parseHashtags(post.hashtags),
            isOnline: post.is_online || false
          };
        }
      }
      
      throw new Error('Failed to update post');
    } catch (error) {
      console.error("Error updating post:", error);
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
          console.error(`Failed to delete ${failedDeletions.length} posts:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
    }
  }

  async likePost(id) {
    try {
      const post = await this.getById(id);
      if (!post) throw new Error('Post not found');

      const currentUserId = 'current-user';
      const likes = [...post.likes];
      const likeIndex = likes.indexOf(currentUserId);
      
      if (likeIndex > -1) {
        likes.splice(likeIndex, 1);
      } else {
        likes.push(currentUserId);
      }
      
      const updatedPost = await this.update(id, { likes });
      return updatedPost;
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  }

  async addComment(id, content) {
    try {
      // For now, return the post as comments are handled separately
      // This would integrate with the app_Comment table
      const post = await this.getById(id);
      if (!post) throw new Error('Post not found');
      
      // TODO: Integrate with app_Comment table
      const newComment = {
        Id: Date.now(),
        username: 'currentuser',
        content: content,
        timestamp: new Date().toISOString()
      };
      
      post.comments.push(newComment);
      return post;
    } catch (error) {
      console.error("Error adding comment:", error);
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
          { field: { Name: "content" } },
          { field: { Name: "image_url" } },
          { field: { Name: "likes" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "hashtags" } },
          { field: { Name: "is_online" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "content",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
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
                    fieldName: "hashtags",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              }
            ]
          }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "DESC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data?.map(post => ({
        Id: post.Id,
        userId: post.username,
        username: post.username,
        displayName: post.display_name,
        content: post.content,
        imageUrl: post.image_url || '',
        likes: this.parseLikes(post.likes),
        comments: [],
        timestamp: post.timestamp,
        hashtags: this.parseHashtags(post.hashtags),
        isOnline: post.is_online || false
      })) || [];
    } catch (error) {
      console.error("Error searching posts:", error);
      return [];
    }
  }

  extractHashtags(content) {
    const hashtagRegex = /#[\w]+/g;
    return content.match(hashtagRegex) || [];
  }

  parseLikes(likesString) {
    if (!likesString || typeof likesString !== 'string') return [];
    return likesString.split(',').filter(like => like.trim().length > 0);
  }

  parseHashtags(hashtagsString) {
    if (!hashtagsString || typeof hashtagsString !== 'string') return [];
    return hashtagsString.split(',').filter(tag => tag.trim().length > 0);
  }
}

export const postsService = new PostsService();