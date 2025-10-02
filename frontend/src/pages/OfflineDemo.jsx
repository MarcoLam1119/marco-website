import React, { useState, useEffect } from 'react';
import { networkStatus, store, KEYS } from '../utils/storage.js';

export default function OfflineDemo() {
  const [isOnline, setIsOnline] = useState(networkStatus.getCurrentStatus());
  const [offlineFeatures, setOfflineFeatures] = useState([]);

  useEffect(() => {
    const cleanup = networkStatus.listen((status) => {
      setIsOnline(status);
    });

    // 初始化離線功能列表
    const features = [
      {
        name: '筆記工具',
        description: '使用 localStorage 自動保存筆記內容',
        status: '✅ 已實現',
        offlineCapable: true
      },
      {
        name: '主題切換',
        description: '主題設置保存在本地',
        status: '✅ 已實現',
        offlineCapable: true
      },
      {
        name: '貨幣轉換器',
        description: '支持離線匯率緩存和備用數據',
        status: '✅ 已實現',
        offlineCapable: true
      },
      {
        name: '單位轉換器',
        description: '純計算功能，無需網絡',
        status: '✅ 已實現',
        offlineCapable: true
      },
      {
        name: '密碼生成器',
        description: '本地生成，無需網絡',
        status: '✅ 已實現',
        offlineCapable: true
      },
      {
        name: '計時器工具',
        description: '本地計時功能',
        status: '✅ 已實現',
        offlineCapable: true
      },
      {
        name: '網絡狀態檢測',
        description: '實時監控網絡連接狀態',
        status: '✅ 已實現',
        offlineCapable: true
      }
    ];

    setOfflineFeatures(features);

    return cleanup;
  }, []);

  const testLocalStorage = () => {
    try {
      const testData = { timestamp: new Date().toISOString(), message: '離線功能測試' };
      store.set('offline_test', testData);
      const retrieved = store.get('offline_test');
      alert(`本地存儲測試成功！\n保存時間: ${retrieved.timestamp}`);
    } catch (error) {
      alert('本地存儲測試失敗: ' + error.message);
    }
  };

  const clearTestData = () => {
    store.del('offline_test');
    alert('測試數據已清除');
  };

  return (
    <section id="offline-demo">
      <div className="container">
        <h2>離線功能演示</h2>
        
        <div className="panel" style={{ marginBottom: '20px' }}>
          <div className="row">
            <div>
              <h3>當前網絡狀態</h3>
              <div className={`network-status ${isOnline ? 'online' : 'offline'}`} style={{ fontSize: '16px', padding: '10px 16px' }}>
                {isOnline ? '🟢 在線連接' : '🔴 離線模式'}
              </div>
            </div>
            <div>
              <h3>本地存儲測試</h3>
              <div className="actions">
                <button onClick={testLocalStorage}>測試本地存儲</button>
                <button onClick={clearTestData}>清除測試數據</button>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>已實現的離線功能</h3>
          <div className="grid">
            {offlineFeatures.map((feature, index) => (
              <div key={index} className="tool">
                <div className="row">
                  <div>
                    <strong>{feature.name}</strong>
                    <p className="small muted">{feature.description}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`tag ${feature.offlineCapable ? 'online' : 'offline'}`}>
                      {feature.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>離線使用說明</h3>
          <div className="grid-2">
            <div>
              <h4>🔄 智能同步</h4>
              <p>應用會在網絡恢復時自動同步數據，無需手動操作。</p>
            </div>
            <div>
              <h4>💾 數據持久化</h4>
              <p>所有用戶數據都保存在本地，即使關閉瀏覽器也不會丟失。</p>
            </div>
            <div>
              <h4>⚡ 快速加載</h4>
              <p>離線時應用加載速度更快，無需等待網絡請求。</p>
            </div>
            <div>
              <h4>📱 PWA 支持</h4>
              <p>網站支持安裝為 PWA，提供原生應用般的體驗。</p>
            </div>
          </div>
        </div>

        {!isOnline && (
          <div className="panel" style={{ background: 'color-mix(in oklab, var(--warn) 10%, transparent)', borderColor: 'color-mix(in oklab, var(--warn) 30%, transparent)' }}>
            <h3>🔴 當前處於離線模式</h3>
            <p>您目前處於離線狀態。以下功能仍然可用：</p>
            <ul>
              <li>所有工具功能（筆記、轉換器、計時器等）</li>
              <li>主題設置和個人偏好</li>
              <li>緩存的數據和內容</li>
            </ul>
            <p>當網絡恢復時，應用會自動同步數據。</p>
          </div>
        )}
      </div>
    </section>
  );
}
