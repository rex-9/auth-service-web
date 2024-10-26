class LocalStorageService {
  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item) as T;
      } catch (error) {
        console.error(`Error parsing localStorage item "${key}":`, error);
        return null;
      }
    }
    return null;
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage item "${key}":`, error);
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

export default new LocalStorageService();
