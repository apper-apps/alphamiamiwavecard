import { posts } from '@/services/mockData/posts.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PostsService {
  constructor() {
    this.posts = [...posts];
  }

  async getAll() {
    await delay(300);
    return [...this.posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getById(id) {
    await delay(200);
    const post = this.posts.find(p => p.Id === parseInt(id));
    if (!post) throw new Error('Post not found');
    return { ...post };
  }

  async getByUserId(userId) {
    await delay(300);
    return this.posts
      .filter(p => p.username === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(post => ({ ...post }));
  }

  async create(postData) {
    await delay(400);
    const newPost = {
      Id: Math.max(...this.posts.map(p => p.Id)) + 1,
      userId: 'current-user',
      username: 'currentuser',
      displayName: 'Your Profile',
      content: postData.content,
      imageUrl: postData.imageUrl || '',
      likes: [],
      comments: [],
      timestamp: new Date().toISOString(),
      hashtags: this.extractHashtags(postData.content),
      isOnline: true
    };
    
    this.posts.unshift(newPost);
    return { ...newPost };
  }

  async update(id, data) {
    await delay(300);
    const index = this.posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error('Post not found');
    
    this.posts[index] = { ...this.posts[index], ...data };
    return { ...this.posts[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error('Post not found');
    
    this.posts.splice(index, 1);
    return true;
  }

  async likePost(id) {
    await delay(200);
    const post = this.posts.find(p => p.Id === parseInt(id));
    if (!post) throw new Error('Post not found');

    const currentUserId = 'current-user';
    const likeIndex = post.likes.indexOf(currentUserId);
    
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(currentUserId);
    }
    
    return { ...post };
  }

  async addComment(id, content) {
    await delay(300);
    const post = this.posts.find(p => p.Id === parseInt(id));
    if (!post) throw new Error('Post not found');

    const newComment = {
      Id: Math.max(...post.comments.map(c => c.Id || 0)) + 1,
      username: 'currentuser',
      content: content,
      timestamp: new Date().toISOString()
    };
    
    post.comments.push(newComment);
    return { ...post };
  }

  async search(query) {
    await delay(400);
    const searchTerm = query.toLowerCase();
    return this.posts
      .filter(post => 
        post.content.toLowerCase().includes(searchTerm) ||
        post.username.toLowerCase().includes(searchTerm) ||
        post.displayName.toLowerCase().includes(searchTerm) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(post => ({ ...post }));
  }

  extractHashtags(content) {
    const hashtagRegex = /#[\w]+/g;
    return content.match(hashtagRegex) || [];
  }
}

export const postsService = new PostsService();