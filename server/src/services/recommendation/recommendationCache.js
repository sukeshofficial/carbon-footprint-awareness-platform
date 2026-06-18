class RecommendationCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 1000 * 60 * 60; // 1 hour
  }

  get(userId) {
    const cached = this.cache.get(userId.toString());
    if (cached && (Date.now() - cached.timestamp < this.ttl)) {
      return cached.data;
    }
    return null;
  }

  set(userId, data) {
    this.cache.set(userId.toString(), {
      data,
      timestamp: Date.now()
    });
  }

  invalidate(userId) {
    this.cache.delete(userId.toString());
  }

  invalidateAll() {
    this.cache.clear();
  }
}

export default new RecommendationCache();
