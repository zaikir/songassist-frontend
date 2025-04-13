import { useAtomValue } from 'jotai';
import ReactMarkdown from 'react-markdown';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

import {
  Box,
  Paper,
  Button,
  Container,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { api } from 'src/api';

import { Iconify } from 'src/components/iconify';
import { AnimateLogoZoom } from 'src/components/animate';

import { chatsAtom } from '../bootstrap';

type Props = {
  id: string;
};

export function ChatPage({ id }: Props) {
  const chats = useAtomValue(chatsAtom);
  const chat = chats.find((x) => x.id === id);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [systemInfo, setSystemInfo] = useState<{
    searchUserPrompt: string;
    searchResponse: string;
    postSystemPrompt: string;
    postUserPrompt: string;
    response: string;
  } | null>(null);
  const navigate = useNavigate();
  const waitingTextRef = useRef(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);

  useEffect(() => {
    (async () => {
      const response = await api.waitForChatResponse(id);
      setMarkdown(response?.response ?? 'Generation error');
      setSystemInfo(response.systemInfo ? JSON.parse(response.systemInfo) : null);
    })();
  }, [id]);

  useEffect(() => {
    if (!chat) {
      navigate({ to: '/chats' });
    }
  }, [chats, chat, navigate]);

  if (!chat) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mb: 8 }}>
      <Button
        sx={{ mb: 2, mt: 2 }}
        startIcon={<Iconify icon="mingcute:arrow-left-line" />}
        onClick={() => navigate({ to: '/chats' })}
      >
        Go Back
      </Button>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {chat.request}
          </Typography>
          {markdown && (
            <Button
              size="small"
              color="secondary"
              sx={{ ml: 'auto' }}
              startIcon={<Iconify icon="eva:refresh-fill" />}
              onClick={async () => {
                setMarkdown(null);
                setSystemInfo(null);

                await api.regeneratePrompt(id);

                const response = await api.waitForChatResponse(id);
                setMarkdown(response?.response ?? 'Generation error');
                setSystemInfo(response.systemInfo ? JSON.parse(response.systemInfo) : null);
              }}
            >
              Regenerate
            </Button>
          )}
        </Box>

        {!markdown ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 10,
              mb: 10,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* <CircularProgress size={60} /> */}
            <Box sx={{ transform: 'scale(0.75)' }}>
              <AnimateLogoZoom />
            </Box>
            <Typography sx={{ mt: 3, fontSize: '1.1rem' }}>{waitingTextRef.current}</Typography>
          </Box>
        ) : (
          <>
            {/* Markdown Bullet List Response */}
            <Box
              sx={{
                mb: 3,
                ul: {
                  pt: 2,
                  pl: 2,
                  listStyleType: 'disc',
                  li: {
                    mb: 2,
                  },
                },
              }}
            >
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </Box>

            <Box>
              {systemInfo?.searchUserPrompt && (
                <Accordion>
                  <AccordionSummary>
                    <Typography component="span">User Prompt for Search</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ whiteSpace: 'pre-line' }}>
                    {systemInfo.searchUserPrompt}
                  </AccordionDetails>
                </Accordion>
              )}
              {systemInfo?.searchResponse && (
                <Accordion>
                  <AccordionSummary>
                    <Typography component="span">Search Result</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      sx={{
                        mb: 3,
                        ul: {
                          pt: 2,
                          pl: 2,
                          listStyleType: 'disc',
                          li: {
                            mb: 2,
                          },
                        },
                      }}
                    >
                      <ReactMarkdown>{systemInfo?.searchResponse}</ReactMarkdown>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}
              {systemInfo?.postSystemPrompt && (
                <Accordion>
                  <AccordionSummary>
                    <Typography component="span">Post-processing System Prompt</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ whiteSpace: 'pre-line' }}>
                    {systemInfo.postSystemPrompt}
                  </AccordionDetails>
                </Accordion>
              )}
              {systemInfo?.postUserPrompt && (
                <Accordion>
                  <AccordionSummary>
                    <Typography component="span">Post-processing User Prompt</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ whiteSpace: 'pre-line' }}>
                    {systemInfo.postUserPrompt}
                  </AccordionDetails>
                </Accordion>
              )}
              {systemInfo?.response && (
                <Accordion>
                  <AccordionSummary>
                    <Typography component="span">Final Result</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      sx={{
                        mb: 3,
                        ul: {
                          pt: 2,
                          pl: 2,
                          listStyleType: 'disc',
                          li: {
                            mb: 2,
                          },
                        },
                      }}
                    >
                      <ReactMarkdown>{systemInfo?.response}</ReactMarkdown>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}

const loadingTexts = [
  'Hang tight — pulling together all the juicy bits for you.',
  "One sec! We're lining up all the need-to-know info on that track.",
  'Just a moment — digging up the good stuff on your song.',
  'Give us a beat… we’re gathering the facts!',
  'Spinning up the story behind the song — be right back!',
  'Please hold on — we’re compiling your song insights now.',
  'Retrieving detailed information. This won’t take long!',
  'Alright, give us a sec — we’re digging up all the cool stuff for you.',
  'Hold tight, we’re putting together something awesome on that track.',
  'Just a moment — pulling together the scoop on your song.',
  'Hang on, we’re flipping through the musical archives!',
  'Sit back — we’re about to hit you with the story behind the sound.',
  'Working on it! All the interesting bits are on their way.',
  'Hold that thought — we’re brewing up a sweet info mix.',
  'Almost there! We’re unboxing everything worth knowing.',
  'Give us a beat, and we’ll give you the backstory.',
  'Ok, we’re on it! Just tying the bow on your song package.',
];
