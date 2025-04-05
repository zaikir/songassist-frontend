import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { Divider, Typography } from '@mui/material';

import { api } from 'src/api';
import { PromiseUtils } from 'src/shared/utils/promise';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { Form, Field } from 'src/components/hook-form';
import { LoadingButton } from 'src/components/loading-button';

import { getErrorMessage } from './utils';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
});

// ----------------------------------------------------------------------

export function SignInPage() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignInSchemaType = {
    email: '',
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await api.sendPasswordlessAuthEmail(data.email);
      setIsEmailSent(true);
    } catch (error) {
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const handleSignInWithGoogle = async () => {
    const authUrl = await api.getGoogleSignInUrl();
    window.location.href = authUrl;

    await PromiseUtils.wait(4000);
  };

  const handleSignInWithGithub = async () => {
    const authUrl = await api.getGithubSignInUrl();
    window.location.href = authUrl;

    await PromiseUtils.wait(4000);
  };

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
        <SvgColor src="/assets/icons/logo.svg" sx={{ width: '100%', height: 200 }} />

        <LoadingButton fullWidth size="large" variant="outlined" onClick={handleSignInWithGoogle}>
          <Iconify icon="devicon:google" width={24} sx={{ mr: 2 }} />
          Log in with Google
        </LoadingButton>
        <LoadingButton fullWidth size="large" variant="outlined" onClick={handleSignInWithGithub}>
          <Iconify icon="devicon:github" width={24} sx={{ mr: 2 }} />
          Log in with Github
        </LoadingButton>
        <Divider>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            OR
          </Typography>
        </Divider>
        {isEmailSent ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            We’ve sent a login link to your email address. Please check your inbox and follow the
            instructions to log in. If you don’t see the email, check your spam folder or try again.
          </Alert>
        ) : (
          <Field.Text
            name="email"
            label="Email"
            type="email"
            placeholder="your-email@example.com"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        )}
      </Box>

      <LoadingButton
        fullWidth
        disabled={isEmailSent}
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Sign with Email
      </LoadingButton>
    </Box>
  );

  return (
    <>
      {/* <FormHead
        title="Sign in to your account"
        description={<>{`Or sign up if you don't have an account.`}</>}
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      /> */}

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}
