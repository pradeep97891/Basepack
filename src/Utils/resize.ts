import { useState, useEffect } from 'react';

// the following method is used to to mobile screen rezing
const useResize = (width = 767, minWidth = 768, maxWidth = 991, largeMinWidth = 992, largeMaxWidth = 1199) => {

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  // the following method is used window rezing and update state based on screen width
  useEffect(() => {

    const handleResize = () => {
      setIsSmallScreen(window.outerWidth <= width);
      setIsMediumScreen(window.outerWidth >= minWidth && window.outerWidth <= maxWidth);
      setIsLargeScreen(window.outerWidth >= largeMinWidth && window.outerWidth <= largeMaxWidth);
    };
    
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, minWidth, maxWidth]);

  return { isSmallScreen, isMediumScreen,isLargeScreen };
};
export { useResize };