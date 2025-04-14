import React from 'react';
import * as zod from 'zod';
import { useSetAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Dialog,
  Button,
  Backdrop,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useMountEffect } from 'src/hooks/use-mount-effect';

import { api } from 'src/api';
import { useUser } from 'src/features/auth';
import { userAtom } from 'src/features/bootstrap';
import { getDefaultLanguage } from 'src/shared/utils/get-default-language';
import { getUserLocationInfo } from 'src/shared/utils/get-user-location-info';

import { Form } from 'src/components/hook-form';
import { LoadingButton } from 'src/components/loading-button';

import { NewProjectFormFields } from './new-project-form-fields';

export const NewProjectSchema = zod.object({
  name: zod.string().min(1, { message: 'Project Name is required!' }),
  language: zod.string().min(1, { message: 'Language is required!' }),
  country: zod.string().min(1, { message: 'Country is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
});

export type NewProjectSchemaType = zod.infer<typeof NewProjectSchema>;

interface ProjectCreationDialogProps {
  open: boolean;
  onClose: () => void;
  initial?: boolean;
}

export function NewProjectDialog({ initial, open, onClose }: ProjectCreationDialogProps) {
  const user = useUser();
  const setUser = useSetAtom(userAtom);
  const navigate = useNavigate();

  const defaultValues: NewProjectSchemaType = {
    name: user.name,
    language: getDefaultLanguage(),
    country: '',
    city: '',
  };

  const methods = useForm<NewProjectSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewProjectSchema),
    defaultValues,
    values: defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onCancel = async () => {
    if (initial) {
      await api.signOut();
      window.location.reload();
      return;
    }

    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await api.updateMe({
        ...data,
      });

      setUser((prev) => ({ ...prev!, ...data }));
      navigate({ to: '/' });

      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  useMountEffect(() => {
    const locationInfo = getUserLocationInfo();

    locationInfo.then((data) => {
      if (data) {
        methods.setValue('country', data.country);
        methods.setValue('city', data.city);
      }
    });
  });

  return (
    <Dialog
      open={open}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
        },
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Welcome to SongAssist</DialogTitle>
      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              pt: 1,
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
            }}
          >
            <NewProjectFormFields />
          </Box>
        </Form>
      </DialogContent>
      <DialogActions>
        <LoadingButton onClick={onCancel} variant="outlined" color="inherit">
          Sign out
        </LoadingButton>
        <Button onClick={onSubmit} variant="contained" disabled={isSubmitting}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
