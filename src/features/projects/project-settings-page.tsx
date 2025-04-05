import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Card, Container } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';

import { useSelectedProject } from './hooks/use-selected-project';
import { NewProjectFormFields } from './components/new-project-form-fields';

import type { NewProjectSchemaType } from './components/new-project-dialog';

// ----------------------------------------------------------------------

export type UpdateProjectSchemaType = NewProjectSchemaType;

export const UpdateUserSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
});

// ----------------------------------------------------------------------

export function ProjectSettingsPage() {
  const project = useSelectedProject()!;
  const formData: UpdateProjectSchemaType = project;
  const defaultValues: UpdateProjectSchemaType = project;
  const methods = useForm<UpdateProjectSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
    values: formData,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
      // const updatedUser = await api.updateMe({
      //   ...data,
      //   avatarUrl:
      //     data.avatarUrl instanceof File ? await imageToBase64(data.avatarUrl) : data.avatarUrl,
      // });

      // setUser({ ...user, ...updatedUser });
      toast.success('Update saved!');
      // methods.reset(updatedUser);
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
              <NewProjectFormFields />
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
