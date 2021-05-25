import { useEffect } from 'react';
import { useRouter } from 'next/router';

import * as gtag from '../lib/gtag';

export default function usePageView(): void {
  const router = useRouter();
  useEffect(() => {
    if (!gtag.existsGaId) {
      return;
    }

    const handleRouteChange = (path: string) => {
      gtag.pageview(path);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
}
