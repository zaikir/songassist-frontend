import { useRef, useEffect } from 'react';

export function useMountEffect(callback: () => void | Promise<void>) {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      return;
    }

    isMounted.current = true;
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
