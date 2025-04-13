import type { SyntheticEvent } from 'react';
import type { TextFieldProps } from '@mui/material';

import debounce from 'lodash.debounce';
import React, { useMemo, useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Skeleton,
  TextField,
  Typography,
  Autocomplete,
  CircularProgress,
} from '@mui/material';

import { api } from 'src/api';

// import { AudioButton } from '../../../components/AudioButton';

// Define the shape of a song option.
interface SongOption {
  artistName: string;
  trackName: string;
  previewUrl: string;
  trackId: number;
  artworkUrl100: string;
}

// Extend the TextField props while overriding onChange and value types.
export interface SongSelectFieldProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  fullWidth?: boolean;
  value?: SongOption | null;
  required?: boolean;
  onChange: (event: { target: { value: SongOption | null } }) => void;
  label: string;
  noOptionsText?: string;
  loadingText?: string;
}

export function SongSelectField({
  fullWidth = true,
  value,
  required,
  onChange,
  label,
  noOptionsText = 'No options',
  loadingText = 'Loading...',
  ...props
}: SongSelectFieldProps): JSX.Element {
  // Local state with explicit types.
  const [inputValue, setInputValue] = useState<string>('');
  const [options, setOptions] = useState<SongOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [resetAudio, setResetAudio] = useState<boolean>(false);
  const [selectedSongUrl, setSelectedSongUrl] = useState<string | null>(null);

  // Debounced fetch function for API calls.
  const throttledFetch = useMemo(
    () =>
      debounce(async (request: string, callback: (results: SongOption[]) => void) => {
        if (!request) {
          callback([]);
          return;
        }

        setIsLoading(true);

        try {
          const results = await api.searchSong(request);
          callback(results as any);
        } catch (error) {
          callback([]);
        } finally {
          setIsLoading(false);
        }
      }, 400),
    []
  );

  // Trigger a new API search when the input value changes.
  useEffect(() => {
    let isMounted = true;

    throttledFetch(inputValue, (results: SongOption[]) => {
      if (isMounted) {
        setOptions(results);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [inputValue, throttledFetch]);

  return (
    <Autocomplete
      noOptionsText={noOptionsText}
      loadingText={loadingText}
      options={options}
      autoComplete
      value={value}
      // disableClearable
      loading={isLoading}
      fullWidth={fullWidth}
      includeInputInList={false}
      filterSelectedOptions
      freeSolo
      // When the user selects an option, update audio URL and propagate the change.
      // @ts-expect-error ada
      onChange={(event: SyntheticEvent, newValue: SongOption | null) => {
        setSelectedSongUrl(newValue ? newValue.previewUrl : null);
        // onChange({ target: { value: newValue } });
      }}
      onInputChange={(event, newInputValue: string) => {
        setInputValue(newInputValue);
        onChange(newInputValue as any);
      }}
      // Render the input field with additional adornments.
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth
          required={required}
          {...props}
          placeholder="Search for a song"
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
            ...props.InputProps,
            sx: { height: '50px' },
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      // Render each option as a custom layout.
      renderOption={(optionProps, option) => (
        <li {...optionProps} key={option.trackId}>
          <Grid container alignItems="center">
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
              <Skeleton sx={{ width: '64px', height: '64px', position: 'absolute' }} />
              <Box
                component="img"
                alt="Preview"
                src={option.artworkUrl100}
                sx={{
                  borderRadius: 2,
                  width: '64px',
                  height: '64px',
                  objectFit: 'cover',
                }}
              />
            </Grid>
            <Grid
              item
              xs
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                pl: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ m: 0, p: 0 }}>
                <b>{option.artistName}</b>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ m: 0, p: 0 }}>
                {option.trackName}
              </Typography>
            </Grid>
          </Grid>
        </li>
      )}
      // Customize the way each option is compared to the input.
      getOptionLabel={(option: any) => `${option.trackName} - ${option.artistName}`}
      filterOptions={(x) => x}
    />
  );
}
