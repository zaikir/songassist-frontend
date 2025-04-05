import { createFileRoute } from '@tanstack/react-router'

import { SocialVerifyPage } from 'src/features/auth/social-verify-page'

export const Route = createFileRoute('/auth/google-verify')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SocialVerifyPage type="google" />
}
