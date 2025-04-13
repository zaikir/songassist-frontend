import type { User } from 'src/types/entities';

import { z as zod } from 'zod';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { Card, Button, Container } from '@mui/material';

import { api } from 'src/api';
import { imageToBase64, getRandomAvatarSVG } from 'src/shared/utils/image';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { userAtom } from '../bootstrap';

// ----------------------------------------------------------------------

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' })
    .readonly(),
  avatarUrl: schemaHelper.file({ message: 'Avatar is required!' }),
});

// ----------------------------------------------------------------------

export function AccountPage() {
  const [user, setUser] = useAtom<User>(userAtom as any);

  const currentUser: UpdateUserSchemaType = {
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };

  const defaultValues: UpdateUserSchemaType = {
    name: '',
    email: '',
    avatarUrl: null,
  };

  const methods = useForm<UpdateUserSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema.omit({ email: true })),
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updatedUser = await api.updateMe({
        ...data,
        avatarUrl:
          data.avatarUrl instanceof File ? await imageToBase64(data.avatarUrl) : data.avatarUrl,
      });

      setUser({ ...user, ...updatedUser });
      toast.success('Update saved!');
      methods.reset(updatedUser);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Container maxWidth="md">
        <Card sx={{ p: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 4 }}
            alignItems={{ sm: 'flex-start' }}
          >
            <Field.UploadAvatar
              name="avatarUrl"
              maxSize={3145728}
              sx={{
                width: 120,
                height: 120,
              }}
              helperText={
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    size="small"
                    sx={{ alignSelf: 'center', fontWeight: 400, px: 1 }}
                    onClick={() => {
                      methods.setValue('avatarUrl', getRandomAvatarSVG(true), {
                        shouldDirty: true,
                      });
                    }}
                  >
                    <Iconify icon="eva:refresh-fill" sx={{ mr: 1 }} />
                    Random icon
                  </Button>
                </Box>
              }
            />

            <Box
              sx={{
                mt: 1,
                flex: 1,
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
              }}
            >
              <Field.Text name="email" label="Email address (read-only)" disabled />
              <Field.Text name="name" label="Name" />
            </Box>
          </Stack>
          <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={!isDirty}
            >
              Save changes
            </LoadingButton>
          </Stack>
        </Card>
      </Container>
    </Form>
  );
}
