import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import * as Yup from 'yup';

import { useLoginMutation } from '@/generated/graphql';
import { AuthStorageService } from '@/services/auth-storage.service';
import { log } from '@/services/log';

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
      <ImageWrapper />
      <RightPanelWrapper>
        <Typography variant="h5">Login</Typography>
        <TextFieldWrapper
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

        <TextFieldWrapper
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

        <ButtonWrapper
          variant="contained"
          sx={{ width: '20em' }}
          disableElevation
          onClick={handleSubmit(handleFormSubmit)}
        >
          Login
        </ButtonWrapper>
        <LinkBottomWrapper>
          <Link href="#">Forgot password?</Link>
          <Link href="/auth/register">Register</Link>
        </LinkBottomWrapper>
      </RightPanelWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const ImageWrapper = styled.div`
  flex: 1;
  background-image: url(/assets/auth/login-bg.svg);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const RightPanelWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 40em;
  @media screen and (max-width: 768px) {
    max-width: 100em;
  }
  padding: 0 10%;
  gap: 1rem;
`;

const LinkBottomWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const TextFieldWrapper = styled(TextField)`
  width: 100%;
`;

const ButtonWrapper = styled(Button)`
  width: 100%;
`;
