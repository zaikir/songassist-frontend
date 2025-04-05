import React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';

import App from 'src/app';

export const Route = createRootRoute({
  component: () => (
    <App>
      <Outlet />
    </App>
  ),
});
