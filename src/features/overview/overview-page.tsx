import { useAtomValue } from 'jotai';
import Markdown from 'react-markdown';
import debounce from 'lodash/debounce';
import { useMemo, useState, useEffect } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import {
  Box,
  Paper,
  Stack,
  Button,
  Portal,
  Select,
  MenuItem,
  Container,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';

import { api } from 'src/api';
import { DashboardContent, useDashboardLayout } from 'src/shared/layouts/dashboard';

import { SongSelectField } from './song-autocomplete';
import { ProjectSelector, useSelectedProject } from '../projects';

type SongSuggestion = {
  song: string;
};

export function OverviewPage() {
  const { headerContainerRefAtom } = useDashboardLayout();
  const selectedProject = useSelectedProject();

  const headerContainerRef = useAtomValue(headerContainerRefAtom);

  const [songTitle, setSongTitle] = useState<string>('');
  const [resultMarkdown, setResultMarkdown] = useState<string>('');
  const [rating, setRating] = useState<number | null>(null);
  const [options, setOptions] = useState<SongSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [model, setModel] = useState<string>('sonar-pro');
  const [temperature, setTemperature] = useState(0.3);

  const searchSong = (query: string) => api.searchSong(selectedProject!.id, query);

  // Create a debounced version of the API call
  const debouncedSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        setIsSearching(true);
        try {
          const results = await searchSong(value);
          setOptions(results as any[]);
        } catch (error) {
          console.error('Error fetching song suggestions:', error);
          setOptions([]);
        } finally {
          setIsSearching(false);
        }
      }, 150),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedProject]
  );

  // Clean up the debounced function on unmount
  useEffect(
    () => () => {
      debouncedSearch.cancel();
    },
    [debouncedSearch]
  );

  const handleInputChange = (_event: React.SyntheticEvent, value: string) => {
    setSongTitle(value);
    if (value.length >= 2) {
      debouncedSearch(value);
    } else {
      setOptions([]);
    }
  };

  const handleRatingChange = (_event: React.SyntheticEvent, newValue: number | null) => {
    setRating(newValue);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const { result } = await api.processPrompt(selectedProject!.id, {
        song: songTitle,
        temperature,
        model,
      });
      if (result) {
        setResultMarkdown(result);
      }
    } catch (error) {
      console.error('Error processing prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!headerContainerRef) {
    return null;
  }

  return (
    <DashboardContent maxWidth={false}>
      <LayoutHeader />

      <Container maxWidth="xl" sx={{ mt: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* Heading */}
          <Typography variant="h4" gutterBottom>
            Enter Song Title to Get Information
          </Typography>

          {/* Autocomplete input container */}
          <Box
            sx={{
              width: '100%',
              maxWidth: 600,
              mt: 2,
              boxShadow: 3,
              borderRadius: 3,
              border: '1px solid #f3f3f3',
              p: 1,
            }}
          >
            <Stack spacing={3}>
              <TextField
                variant="outlined"
                placeholder="Temperature"
                type="number"
                label="Temperature"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
              />
              <FormControl fullWidth>
                <InputLabel id="simple-select-label">AI Model</InputLabel>
                <Select
                  labelId="simple-select-label"
                  value={model}
                  label="AI Model"
                  onChange={(x) => setModel(x.target.value)}
                >
                  <MenuItem value="sonar">sonar</MenuItem>
                  <MenuItem value="sonar-pro">sonar-pro</MenuItem>
                  <MenuItem value="gpt-4o-mini-search-preview">gpt-4o-mini-search-preview</MenuItem>
                  <MenuItem value="gpt-4o-search-preview">
                    gpt-4o-search-preview (expensive)
                  </MenuItem>
                </Select>
              </FormControl>

              <SongSelectField
                // value={songTitle}
                onChange={(x) => {
                  setSongTitle(x as any);
                }}
                projectId={selectedProject!.id}
                label=""
              />
              {/* <Autocomplete
                freeSolo
                options={options}
                // loading={isSearching}
                value={songTitle}
                onInputChange={handleInputChange}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'string') {
                    setSongTitle(newValue);
                  } else if (newValue && typeof newValue === 'object') {
                    setSongTitle(newValue.song);
                  }
                }}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.song)}
                filterOptions={(x) => x}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Enter title of the song"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover fieldset': {
                          border: 'none',
                        },
                        '&.Mui-focused fieldset': {
                          border: 'none',
                        },
                      },
                      // Ensure the input height stays the same
                      input: { height: '50px' },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      sx: { height: '50px' },
                      endAdornment: (
                        <>
                          {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                filterSelectedOptions
              /> */}
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

          {!isLoading && resultMarkdown && (
            <Paper
              elevation={0}
              sx={{ mt: 4, p: 2, width: '100%', ul: { listStyleType: 'unset', 'li p': { my: 1 } } }}
            >
              <Markdown>{resultMarkdown}</Markdown>
              {/* <Typography variant="h6" sx={{ mt: 2 }}>
                Rate the response:
              </Typography>
              <Rating name="response-rating" value={rating} onChange={handleRatingChange} /> */}
            </Paper>
          )}
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
              <Typography variant="h6">Generating response... It may take a few minutes</Typography>
              <CircularProgress sx={{ mt: 2 }} />
            </Paper>
          )}
        </Box>
      </Container>
    </DashboardContent>
  );
}

function LayoutHeader() {
  const { headerContainerRefAtom } = useDashboardLayout();
  const headerContainerRef = useAtomValue(headerContainerRefAtom);

  if (!headerContainerRef) {
    return null;
  }

  return (
    <Portal container={headerContainerRef}>
      <ProjectSelector />
    </Portal>
  );
}
