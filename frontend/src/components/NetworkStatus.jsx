import React, { useState, useEffect } from 'react';
import { networkStatus } from '../utils/storage.js';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(networkStatus.getCurrentStatus());

  useEffect(() => {
    const cleanup = networkStatus.listen((status) => {
      setIsOnline(status);
    });

    return cleanup;
  }, []);

  return (
    <div className={`network-status ${isOnline ? 'online' : 'offline'}`}>
      {isOnline ? (
        <span title="在線連接">🟢 在線</span>
      ) : (
        <span title="離線模式">🔴 離線</span>
      )}
    </div>
  );
}
