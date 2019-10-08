import { useState, useEffect } from 'react';

export default () => {
  const [windowSize, setWindowSize] = useState(() => {
    return (
      typeof window !== 'undefined' && {
        width: window.innerWidth,
        height: window.innerHeight
      }
    );
  });

  useEffect(() => {
    const onResize = () =>
      typeof window !== 'undefined' &&
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', onResize);
    }
    return () =>
      typeof window !== 'undefined' &&
      window.removeEventListener('resize', onResize);
  });

  return windowSize;
};
