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

import { useRegisterMutation } from '@/generated/graphql';
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
  width: 100%;
  justify-content: space-between;
`;

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

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
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default function Register() {
  const {
    register: registerField,
    handleSubmit,
    formState,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const [register] = useRegisterMutation();

  const handleFormSubmit = async (data: FormData) => {
    // check if formState.errors contains any errors
    if (Object.keys(formState.errors).length > 0) {
      log.debug('Error', formState.errors);
      return;
    }
    log.debug('Registering user', data.email);
    const authResponse = await register({
      variables: {
        email: data.email,
        password: data.password,
      },
    });
    log.debug('Registered user', authResponse);

    AuthStorageService.setToken(authResponse.data?.register?.token);
    AuthStorageService.setAccount(authResponse.data?.register?.account);

    window.location.href = '/profile';
  };

  return (
    <PageWrapper>
      <SignUpWrapper>
        <Avatar>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">Sign up</Typography>
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
          {...registerField('email')}
        />

        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          required
          error={Boolean(formState.errors.password)}
          helperText={formState.errors.password?.message}
          autoComplete="new-password"
          sx={{ width: '20em' }}
          {...registerField('password')}
        />

        <TextField
          id="confirmPassword"
          label="Confirm password"
          variant="outlined"
          type="password"
          required
          error={Boolean(formState.errors.confirmPassword)}
          helperText={formState.errors.confirmPassword?.message}
          autoComplete="new-password"
          sx={{ width: '20em' }}
          {...registerField('confirmPassword')}
        />

        <Button
          variant="contained"
          sx={{ width: '20em' }}
          onClick={handleSubmit(handleFormSubmit)}
        >
          Sign Up
        </Button>
        <LinkBottomWrapper>
          <Link href="#">Forgot password?</Link>
          <Link href={'/auth/login'}>Login</Link>
        </LinkBottomWrapper>
      </SignUpWrapper>
    </PageWrapper>
  );
}
