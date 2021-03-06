import { useEffect, useState } from 'react';

import { isMobileOrTabletDevice } from '../libs/detectDevice';

const useMobileDevice = (): [boolean] => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    setIsMobileOrTablet(isMobileOrTabletDevice());
  }, []);

  return [isMobileOrTablet];
};

export default useMobileDevice;
