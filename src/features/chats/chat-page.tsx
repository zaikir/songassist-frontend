import type { Chat } from 'src/types/entities';

import { useAtomValue } from 'jotai';
import ReactMarkdown from 'react-markdown';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { Box, Paper, Button, Tooltip, Container, Typography, IconButton } from '@mui/material';

import { api } from 'src/api';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { AnimateLogoZoom } from 'src/components/animate';

import { chatsAtom } from '../bootstrap';
import { ReviewDialog } from './chat-review-dialog';

type Props = {
  id: string;
};

type ChatInfo = Chat & {
  feedbacks: {
    text: string;
    feedback: number;
  }[];
};

export function ChatPage({ id }: Props) {
  const chats = useAtomValue(chatsAtom);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const chat = chats.find((x) => x.id === id);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const navigate = useNavigate();
  const waitingTextRef = useRef(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);

  useEffect(() => {
    (async () => {
      const response = await api.waitForChatResponse(id);
      setChatInfo(response);

      const reviewCounter = parseInt(window.localStorage.getItem('review_counter') ?? '0');
      console.log({ reviewCounter });
      if (reviewCounter < 5) {
        window.localStorage.setItem('review_counter', (reviewCounter + 1).toString());
      } else {
        window.localStorage.setItem('review_counter', (0).toString());

        setIsReviewDialogOpen(true);
      }
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
          {chatInfo?.request && (
            <>
              <Button
                size="small"
                color="secondary"
                sx={{ ml: 'auto' }}
                startIcon={<Iconify icon="eva:star-fill" />}
                onClick={() => {
                  setIsReviewDialogOpen(true);
                }}
              >
                Send a review
              </Button>
              <Button
                size="small"
                color="secondary"
                sx={{ ml: 2 }}
                startIcon={<Iconify icon="eva:refresh-fill" />}
                onClick={async () => {
                  setChatInfo(null);

                  await api.regeneratePrompt(id);

                  const response = await api.waitForChatResponse(id);
                  setChatInfo(response);
                }}
              >
                Regenerate
              </Button>
            </>
          )}
        </Box>

        {!chatInfo?.response ? (
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
          <Box
            sx={{
              mb: -3,
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
            <ReactMarkdown
              components={{
                li({ node, children }) {
                  const text = children?.toString() ?? '';
                  const feedback = chatInfo?.feedbacks.find((x) => x.text === text);

                  const isLiked = feedback && feedback.feedback == 1;
                  const isDisliked = feedback && feedback.feedback == -1;

                  return (
                    <li>
                      {children}
                      <Tooltip title="Like" enterDelay={500}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setChatInfo({
                              ...chatInfo,
                              feedbacks: [
                                ...(chatInfo?.feedbacks ?? []).filter((x) => x.text !== text),
                                ...(!isLiked
                                  ? [
                                      {
                                        text: children?.toString() ?? '',
                                        feedback: 1,
                                      },
                                    ]
                                  : []),
                              ],
                            });

                            api.sendFeedback(id, {
                              feedback: isLiked ? null : 1,
                              text,
                            });
                          }}
                          {...(isLiked && {
                            color: 'success',
                          })}
                          sx={{
                            ml: 1.5,
                            opacity: isLiked ? 1 : 0.5,
                            '&:hover': {
                              opacity: 1,
                            },
                          }}
                        >
                          <Iconify icon={`mdi:like${isLiked ? '' : '-outline'}`} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Dislike" enterDelay={500}>
                        <IconButton
                          size="small"
                          {...(isDisliked && {
                            color: 'error',
                          })}
                          onClick={() => {
                            setChatInfo({
                              ...chatInfo,
                              feedbacks: [
                                ...(chatInfo?.feedbacks ?? []).filter((x) => x.text !== text),
                                ...(!isDisliked
                                  ? [
                                      {
                                        text: children?.toString() ?? '',
                                        feedback: -1,
                                      },
                                    ]
                                  : []),
                              ],
                            });

                            api.sendFeedback(id, {
                              feedback: isDisliked ? null : -1,
                              text,
                            });
                          }}
                          sx={{
                            ml: 0.5,
                            opacity: isDisliked ? 1 : 0.5,
                            '&:hover': {
                              opacity: 1,
                            },
                          }}
                        >
                          <Iconify icon={`mdi:dislike${isDisliked ? '' : '-outline'}`} />
                        </IconButton>
                      </Tooltip>
                      {/* </span> */}
                    </li>
                  );
                },
              }}
            >
              {chatInfo?.response}
            </ReactMarkdown>
            <Box
              sx={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid #ccc', pt: 2 }}
            >
              <Typography variant="caption" sx={{ textAlign: 'center' }}>
                SongAssist can make errors. Please check important information.
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
      <ReviewDialog
        open={isReviewDialogOpen}
        onSubmit={(rating, comment) => {
          api.sendReview(id, {
            rating,
            comment,
          });

          toast.success('Thanks for your review!');
        }}
        onClose={() => {
          setIsReviewDialogOpen(false);
        }}
      />
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
