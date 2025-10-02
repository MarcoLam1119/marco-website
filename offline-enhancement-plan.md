# 離線功能增強計劃

## 項目現狀分析

### 已具備離線潛力的功能
✅ **筆記工具 (NotesTool)** - 已使用 localStorage
✅ **主題切換** - 已使用 localStorage
✅ **單位轉換器 (UnitConverter)** - 純計算功能
✅ **密碼生成器 (PasswordGenerator)** - 純計算功能
✅ **計時器工具 (TimerTool)** - 本地計時功能

### 需要改進的功能
⚠️ **貨幣轉換器 (CurrencyConverter)** - 依賴外部 API
⚠️ **日曆功能 (Calendar)** - 可能需要數據同步
⚠️ **照片庫 (PhotoLibrary)** - 需要本地緩存
⚠️ **支付計算器 (PaymentCalculator)** - 純計算功能

## 離線功能實現方案

### 1. 貨幣轉換器離線化
```javascript
// 實現離線匯率緩存和備用匯率
const OFFLINE_EXCHANGE_RATES = {
  'HKD': { 'CNY': 0.92, 'USD': 0.13, 'EUR': 0.12, 'JPY': 19.5 },
  'USD': { 'HKD': 7.83, 'CNY': 7.20, 'EUR': 0.92, 'JPY': 150 },
  // 更多匯率數據...
};
```

### 2. 日曆事件本地存儲
```javascript
// 擴展 storage.js 支持日曆事件
export const KEYS = {
  // ... 現有鍵
  CALENDAR_EVENTS: "calendar_events",
  CALENDAR_LAST_SYNC: "calendar_last_sync"
};
```

### 3. 照片庫離線緩存
```javascript
// 使用 IndexedDB 或 Cache API 緩存圖片
const cachePhotos = async (photos) => {
  if ('caches' in window) {
    const cache = await caches.open('photos-cache');
    // 緩存邏輯...
  }
};
```

### 4. 網絡狀態檢測
```javascript
// 添加網絡狀態監聽
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};
```

## 具體實現步驟

### 第一步：更新貨幣轉換器支持離線
```javascript
// 在 CurrencyConverter.jsx 中添加離線支持
const useExchangeRates = () => {
  const [rates, setRates] = useState(() => {
    // 從 localStorage 加載緩存的匯率
    return store.get('EXCHANGE_RATES', OFFLINE_EXCHANGE_RATES);
  });
  
  // 在線時更新匯率，離線時使用緩存
  // ...
};
```

### 第二步：增強日曆功能離線支持
```javascript
// 在 CalendarContext.jsx 中添加離線同步
const syncCalendarEvents = async (events) => {
  // 保存到本地
  store.set(KEYS.CALENDAR_EVENTS, events);
  store.set(KEYS.CALENDAR_LAST_SYNC, new Date().toISOString());
  
  // 如果在線，同步到服務器
  if (navigator.onLine) {
    // 服務器同步邏輯
  }
};
```

### 第三步：實現照片離線緩存
```javascript
// 在 PhotoLibrary.jsx 中添加緩存邏輯
const cachePhoto = async (photoUrl) => {
  try {
    const cache = await caches.open('photos-v1');
    await cache.add(photoUrl);
  } catch (error) {
    console.warn('Photo caching failed:', error);
  }
};
```

### 第四步：添加離線狀態指示器
```javascript
// 在 Header.jsx 中添加離線指示器
const NetworkStatus = () => {
  const isOnline = useNetworkStatus();
  
  return (
    <div className={`network-status ${isOnline ? 'online' : 'offline'}`}>
      {isOnline ? '🟢 在線' : '🔴 離線'}
    </div>
  );
};
```

## 依賴更新

需要在 `package.json` 中添加：
```json
{
  "dependencies": {
    "idb": "^8.0.0"  // 用於 IndexedDB 操作
  }
}
```

## 測試計劃

1. **離線功能測試**
   - 斷開網絡連接測試各功能
   - 驗證數據持久化
   - 測試重新連接後的同步

2. **性能測試**
   - 本地存儲讀寫性能
   - 緩存命中率
   - 內存使用情況

3. **兼容性測試**
   - 不同瀏覽器支持
   - 移動設備測試
   - 存儲限制測試

## 預期效果

完成後，您的網站將具備：
- ✅ 完全離線使用的工具功能
- ✅ 智能的數據同步機制
- ✅ 優雅的離線用戶體驗
- ✅ 可靠的數據持久化
- ✅ 跨設備兼容性

這將使您的網站成為真正的 Progressive Web App (PWA)，提供原生應用般的體驗。
