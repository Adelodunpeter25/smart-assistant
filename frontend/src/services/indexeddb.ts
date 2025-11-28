import { INDEXEDDB_NAME, INDEXEDDB_VERSION, STORES } from '@/utils/constants';

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(INDEXEDDB_NAME, INDEXEDDB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        Object.values(STORES).forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };
    });
  }

  async get<T>(storeName: string, id: string | number): Promise<T | null> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async set<T>(storeName: string, data: T): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, id: string | number): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getChatHistory(userId: number): Promise<any[]> {
    const allMessages = await this.getAll<any>(STORES.CHAT_HISTORY);
    return allMessages
      .filter(msg => msg.user_id === userId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async saveChatMessage(userId: number, message: any): Promise<void> {
    const messageWithUser = {
      ...message,
      user_id: userId,
      id: `${userId}-${Date.now()}-${Math.random()}`,
    };
    await this.set(STORES.CHAT_HISTORY, messageWithUser);
    await this.trimChatHistory(userId, 50);
  }

  private async trimChatHistory(userId: number, maxMessages: number): Promise<void> {
    const messages = await this.getChatHistory(userId);
    if (messages.length > maxMessages) {
      const toDelete = messages.slice(0, messages.length - maxMessages);
      for (const msg of toDelete) {
        await this.delete(STORES.CHAT_HISTORY, msg.id);
      }
    }
  }

  async clearChatHistory(userId: number): Promise<void> {
    const messages = await this.getChatHistory(userId);
    for (const msg of messages) {
      await this.delete(STORES.CHAT_HISTORY, msg.id);
    }
  }
}

export const idbService = new IndexedDBService();
