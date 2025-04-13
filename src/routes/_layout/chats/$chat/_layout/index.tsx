import { useParams, createFileRoute } from '@tanstack/react-router';

import { ChatPage } from 'src/features/chats/chat-page';

export const Route = createFileRoute('/_layout/chats/$chat/_layout/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { chat } = useParams({ from: '/_layout/chats/$chat' });

  return <ChatPage id={chat} />;
}
