import { useMemo } from 'react';
import { useLocation } from '@tanstack/react-router';

// ----------------------------------------------------------------------

export function usePathname() {
  const { pathname } = useLocation();

  return useMemo(() => pathname, [pathname]);
}
