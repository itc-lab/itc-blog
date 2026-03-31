import { useState } from 'react';

import { isMobileOrTabletDevice } from '../libs/detectDevice';

const useMobileDevice = (): [boolean] => {
  const [isMobileOrTablet] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return isMobileOrTabletDevice();
  });

  return [isMobileOrTablet];
};

export default useMobileDevice;
