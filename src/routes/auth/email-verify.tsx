import { createFileRoute } from '@tanstack/react-router'

import { EmailVerifyPage } from 'src/features/auth/email-verify-page'

export const Route = createFileRoute('/auth/email-verify')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    preAuthSessionId: search.preAuthSessionId as string,
    tenantId: search.tenantId as string,
  }),
})

function RouteComponent() {
  return <EmailVerifyPage />
}
