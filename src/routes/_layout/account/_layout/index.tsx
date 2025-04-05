import { createFileRoute } from '@tanstack/react-router'

import { AccountPage } from 'src/features/account/account-page'

export const Route = createFileRoute('/_layout/account/_layout/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AccountPage />
}
