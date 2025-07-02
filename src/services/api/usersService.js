import { users } from '@/services/mockData/users.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UsersService {
  constructor() {
    this.users = [...users];
  }

  async getAll() {
    await delay(300);
    return this.users.map(user => ({ ...user }));
  }

  async getById(id) {
    await delay(200);
    const user = this.users.find(u => u.Id === parseInt(id));
    if (!user) throw new Error('User not found');
    return { ...user };
  }

  async getByUsername(username) {
    await delay(200);
    const user = this.users.find(u => u.username === username);
    if (!user) throw new Error('User not found');
    return { ...user };
  }

  async create(userData) {
    await delay(400);
    const newUser = {
      Id: Math.max(...this.users.map(u => u.Id)) + 1,
      username: userData.username,
      displayName: userData.displayName,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
      bio: userData.bio || '',
      followersCount: 0,
      followingCount: 0,
      isOnline: true,
      isFollowing: false
    };
    
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, data) {
    await delay(300);
    const index = this.users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) throw new Error('User not found');
    
    this.users[index] = { ...this.users[index], ...data };
    return { ...this.users[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) throw new Error('User not found');
    
    this.users.splice(index, 1);
    return true;
  }

  async follow(id) {
    await delay(300);
    const user = this.users.find(u => u.Id === parseInt(id));
    if (!user) throw new Error('User not found');
    
    user.followersCount += 1;
    user.isFollowing = true;
    
    return { ...user };
  }

  async unfollow(id) {
    await delay(300);
    const user = this.users.find(u => u.Id === parseInt(id));
    if (!user) throw new Error('User not found');
    
    user.followersCount = Math.max(0, user.followersCount - 1);
    user.isFollowing = false;
    
    return { ...user };
  }

  async search(query) {
    await delay(400);
    const searchTerm = query.toLowerCase();
    return this.users
      .filter(user => 
        user.username.toLowerCase().includes(searchTerm) ||
        user.displayName.toLowerCase().includes(searchTerm) ||
        (user.bio && user.bio.toLowerCase().includes(searchTerm))
      )
      .map(user => ({ ...user }));
  }

  async getSuggested(limit = 5) {
    await delay(300);
    return this.users
      .filter(user => !user.isFollowing)
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
      .map(user => ({ ...user }));
  }
}

export const usersService = new UsersService();