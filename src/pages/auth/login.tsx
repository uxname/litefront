import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import * as Yup from 'yup';

import { useLoginMutation } from '@/generated/graphql';
import { AuthStorageService } from '@/services/auth-storage.service';
import { log } from '@/services/log';

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SignUpWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  gap: 1rem;
`;

const LinkBottomWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const MIN_PASSWORD_LENGTH = 6;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password should be at least ${MIN_PASSWORD_LENGTH} characters`,
    )
    .required('Password is required'),
});

type FormData = {
  email: string;
  password: string;
};

export default function SignUp() {
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const [login] = useLoginMutation();

  const handleFormSubmit = async (data: FormData) => {
    if (Object.keys(formState.errors).length > 0) {
      log.debug('Error', formState.errors);
      return;
    }
    log.debug('Login user', data.email);
    const authResponse = await login({
      variables: {
        email: data.email,
        password: data.password,
      },
    });
    log.debug('Logged in user', authResponse);

    AuthStorageService.setToken(authResponse.data?.login?.token);
    AuthStorageService.setAccount(authResponse.data?.login?.account);

    window.location.href = '/profile';
  };

  return (
    <PageWrapper>
      <SignUpWrapper>
        <Avatar>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">Login</Typography>
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          type="email"
          autoComplete="email"
          required
          error={Boolean(formState.errors.email)}
          helperText={formState.errors.email?.message}
          sx={{ width: '20em' }}
          {...register('email')}
        />

        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          required
          error={Boolean(formState.errors.password)}
          helperText={formState.errors.password?.message}
          autoComplete="current-password"
          sx={{ width: '20em' }}
          {...register('password')}
        />

        <Button
          variant="contained"
          sx={{ width: '20em' }}
          onClick={handleSubmit(handleFormSubmit)}
        >
          Login
        </Button>
        <LinkBottomWrapper>
          <Link href="#">Forgot password?</Link>
          <Link href="/auth/register">Register</Link>
        </LinkBottomWrapper>
      </SignUpWrapper>
    </PageWrapper>
  );
}
