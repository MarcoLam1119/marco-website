export const store = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn("Storage error", e);
    }
  },
  del(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(error)
    }
  },
};

export const KEYS = {
  THEME: "site_theme",
  CREATER: "site_creater",
  ABOUT: "site_about_v2",
  PHOTOS: "site_photos",
  EVENTS: "site_events",
  NOTES: "site_notes",
  CALENDAR_EVENTS: "calendar_events",
  CALENDAR_LAST_SYNC: "calendar_last_sync",
  EXCHANGE_RATES: "exchange_rates",
  UNIT_CONVERTER_HISTORY: "unit_converter_history",
  PASSWORD_HISTORY: "password_history",
  TIMER_PRESETS: "timer_presets",
  PAYMENT_CALCULATIONS: "payment_calculations",
  NETWORK_STATUS: "network_status"
};

export function debounce(fn, ms = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

// 網絡狀態檢測工具
export const networkStatus = {
  // 獲取當前網絡狀態
  getCurrentStatus() {
    const saved = store.get(KEYS.NETWORK_STATUS, null);
    return saved !== null ? saved : navigator.onLine;
  },

  // 監聽網絡狀態變化
  listen(callback) {
    const handleOnline = () => {
      store.set(KEYS.NETWORK_STATUS, true);
      callback(true);
    };
    
    const handleOffline = () => {
      store.set(KEYS.NETWORK_STATUS, false);
      callback(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 返回清理函數
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
};

// 離線隊列系統
export class OfflineQueue {
  constructor(queueName) {
    this.queueName = queueName;
    this.queue = store.get(`${queueName}_queue`, []);
    this.isProcessing = false;
  }

  addToQueue(action) {
    this.queue.push({
      ...action,
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString()
    });
    this.saveQueue();
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    const action = this.queue[0]; // 只處理第一個，成功後移除
    
    try {
      const isConnected = navigator.onLine;
      if (isConnected && action.execute) {
        await action.execute();
        // 成功執行後移除
        this.queue.shift();
        this.saveQueue();
      }
    } catch (error) {
      console.error(`Queue processing failed for ${this.queueName}:`, error);
      // 失敗時保留在隊列中，稍後重試
    } finally {
      this.isProcessing = false;
      // 繼續處理下一個
      setTimeout(() => this.processQueue(), 1000);
    }
  }

  saveQueue() {
    store.set(`${this.queueName}_queue`, this.queue);
  }

  clearQueue() {
    this.queue = [];
    this.saveQueue();
  }

  getQueueLength() {
    return this.queue.length;
  }
}

// 數據同步工具
export const syncManager = {
  // 檢查是否需要同步
  needsSync(lastSyncKey, maxAgeMinutes = 60) {
    const lastSync = store.get(lastSyncKey);
    if (!lastSync) return true;
    
    const lastSyncTime = new Date(lastSync).getTime();
    const currentTime = new Date().getTime();
    const minutesDiff = (currentTime - lastSyncTime) / (1000 * 60);
    
    return minutesDiff > maxAgeMinutes;
  },

  // 標記同步完成
  markSynced(syncKey) {
    store.set(syncKey, new Date().toISOString());
  },

  // 批量同步數據
  async syncData(dataKey, syncFunction) {
    const localData = store.get(dataKey, []);
    const isOnline = navigator.onLine;
    
    if (isOnline && syncFunction) {
      try {
        await syncFunction(localData);
        this.markSynced(`${dataKey}_last_sync`);
      } catch (error) {
        console.error(`Sync failed for ${dataKey}:`, error);
        throw error;
      }
    }
    
    return localData;
  }
};
