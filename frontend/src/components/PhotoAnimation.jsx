import React, { useRef } from 'react';
import { gsap } from 'gsap'; // 從 gsap 核心庫引入 gsap [4, 11]
import { useGSAP } from '@gsap/react'; // 從 @gsap/react 引入 useGSAP Hook [1, 4, 11]

const PhotoAnimation = ({ imageUrl, altText }) => {
  // 1. 使用 useRef 創建一個對圖片元素的引用，GSAP 將使用它來定位動畫目標 [4, 7]
  const photoRef = useRef();

  // 2. 使用 useGSAP Hook 定義動畫邏輯
  // 它可以像 useEffect 一樣，接收一個回呼函數和一個依賴陣列 [9, 11]
  useGSAP(() => {
    // 3. 使用 gsap.from() 方法創建動畫
    // 這將使圖片從新狀態（下方 100px 且完全透明）動畫到其預設（目前）狀態 [4, 12]
    gsap.from(photoRef.current, {
      y: 100, // 從下方 100 像素處開始 [4]
      opacity: 0, // 從完全透明開始 [4]
      duration: 1.5, // 動畫持續 1.5 秒 [4, 11]
      ease: "power1.out", // 動畫的速度曲線 [12] (例如: power1.inOut, expo.out, elastic)
      delay: 0.5 // 在組件載入後延遲 0.5 秒才開始動畫
    });
  }, { scope: photoRef }); // 4. 使用 `scope` 選項將動畫範圍限定在 `photoRef` 元素內 [9, 13, 14]
    // 這樣可以確保動畫只作用於此元件內的特定元素，避免選取器衝突 [13, 14]

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      {/* 渲染圖片元素，並將 ref 附加到它上面 [4, 7] */}
      <img
        ref={photoRef} // 將 ref 附加到圖片元素，以便 GSAP 可以精確地鎖定它 [4, 7]
        src={imageUrl}
        alt={altText}
        style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
      />
    </div>
  );
};

export default PhotoAnimation;