import type { LinkProps } from '@mui/material/Link';

import { forwardRef } from 'react';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export const Logo = forwardRef<HTMLAnchorElement, LogoProps>((props, ref) => (
  <img alt="Full logo" src="/assets/icons/logo-white.svg" height="44px" />
));
