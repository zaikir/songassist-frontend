import { createFileRoute } from '@tanstack/react-router';

import { SocialVerifyPage } from 'src/features/auth/social-verify-page';

export const Route = createFileRoute('/auth/github-verify')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SocialVerifyPage type="github" />;
}
