import { useState, useEffect } from 'react';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // 컴포넌트가 마운트될 때와 리사이즈될 때마다 실행
    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 크기 설정

    // 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener('resize', handleResize);
  }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때만 실행

  return windowSize;
}

export default useWindowSize;