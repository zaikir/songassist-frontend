import { redirect, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/chats/')({
  loader: () => redirect({ to: '/' }),
});
