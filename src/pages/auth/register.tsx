import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal } from '@mui/material';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import * as Yup from 'yup';

import { useRegisterMutation } from '@/generated/graphql';
import { AuthStorageService } from '@/services/auth-storage.service';
import { log } from '@/services/log';

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

  const [register, { error, reset }] = useRegisterMutation();

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
      <ImageWrapper />
      <Modal
        open={Boolean(error)}
        onClose={reset}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <BoxWrapper>
          <div>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Error
            </Typography>
            <IconButton
              aria-label="close"
              onClick={reset}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                // eslint-disable-next-line no-magic-numbers
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {error?.message}
          </Typography>
        </BoxWrapper>
      </Modal>
      <RightPanelWrapper>
        <Typography variant="h5">Registration</Typography>
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
          {...registerField('email')}
        />

        <TextFieldWrapper
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

        <TextFieldWrapper
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

        <ButtonWrapper
          variant="contained"
          sx={{ width: '20em' }}
          disableElevation
          onClick={handleSubmit(async (data) => {
            try {
              await handleFormSubmit(data);
            } catch (error_) {
              log.error('Registration error:', error_);
            }
          })}
        >
          Register
        </ButtonWrapper>
        <LinkBottomWrapper>
          <Link href="#">Forgot password?</Link>
          <Link href={'/auth/login'}>Login</Link>
        </LinkBottomWrapper>
      </RightPanelWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  height: 90vh;
`;

const ImageWrapper = styled.div`
  flex: 1;
  background-image: url(/assets/auth/register-bg.svg);
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

const BoxWrapper = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  outline: none;
  width: 30em;
  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;
