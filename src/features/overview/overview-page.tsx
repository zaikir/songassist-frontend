import { getDefaultStore } from 'jotai';
import { useRef, useState } from 'react';
import { useRouter } from '@tanstack/react-router';

import CircularProgress from '@mui/material/CircularProgress';
import { Box, Paper, Stack, Button, Container, Typography } from '@mui/material';

import { api } from 'src/api';
import { DashboardContent } from 'src/shared/layouts/dashboard';

import { chatsAtom } from '../bootstrap';
import { SongSelectField } from './song-autocomplete';

export function OverviewPage() {
  const router = useRouter();
  const [songTitle, setSongTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const randomTitleRef = useRef(titles[Math.floor(Math.random() * titles.length)]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const { chatId } = await api.processPrompt({
        song: songTitle,
      });

      const store = getDefaultStore();
      store.set(chatsAtom, [
        {
          id: chatId,
          request: songTitle,
          createdAt: new Date().toISOString(),
        },
        ...store.get(chatsAtom),
      ]);

      router.navigate({ to: '/chats/$chat', params: { chat: chatId } });
    } catch (error) {
      console.error('Error processing prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardContent maxWidth={false}>
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h4" gutterBottom>
            {randomTitleRef.current}
          </Typography>

          <Box
            sx={{
              width: '100%',
              // maxWidth: 600,
              mt: 4,
              boxShadow: 3,
              borderRadius: 3,
              border: '1px solid #f3f3f3',
              p: 1,
            }}
          >
            <Stack spacing={3}>
              <SongSelectField
                onChange={(x) => {
                  setSongTitle(x as any);
                }}
                label=""
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={(songTitle || '').length < 2 || isLoading}
                >
                  Submit
                </Button>
              </Box>
            </Stack>
          </Box>

          {isLoading && (
            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: 2,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <CircularProgress sx={{ mt: 2 }} size={16} />
            </Paper>
          )}
        </Box>
      </Container>
    </DashboardContent>
  );
}

const titles = [
  "Give us a title and we'll give you the all the trivia.",
  "Give us a title and we'll give you the whole story.",
  "Give us a title and we'll give you everything but the melody.",
  "Give us a title and we'll give you the beats behind it.",
  "Give us a title and we'll give you the secrets behind the song.",
  "Give us a title and we'll give you the facts, the feels, the fire.",
  "Give us a title and we'll give you the story behind the sound.",
  "Give us a title and we'll give you the vibe behind the voice.",
  "Give us a title and we'll give you the music intel you need.",
  "Give us a title and we'll give you the why behind the hit.",
  "Give us a title and we'll give you the trivia that turns heads.",
  "Give us a title and we'll give you the intel you need.",
  'Give us a title and we’ll give you the riff and the reason.',
  'Give us a title and we’ll give you trivia worth tuning in for.',
  'Give us a title and we’ll give you the truth behind the tune.',
  'Give us a title and we’ll give you the magic behind the music.',
  'Give us a title and we’ll give you the whole backbeat.',
  'Give us a title and we’ll give you what the charts don’t show.',
];
