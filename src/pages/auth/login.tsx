import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import * as Yup from 'yup';

import { useLoginMutation } from '@/generated/graphql';
import localeDetectorService from '@/services/locale-detector.service';
import { log } from '@/services/log';
import { useAuthStore } from '@/store/auth.store';

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

export default function Login(): ReactElement {
  const { t } = useTranslation(['common', 'auth']);
  const locale = localeDetectorService.detect();
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const [login, { error, reset }] = useLoginMutation();
  const { setToken, setAccount } = useAuthStore();

  const handleFormSubmit = async (data: FormData): Promise<void> => {
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

    setToken(authResponse.data?.login?.token);
    setAccount(authResponse.data?.login?.account);

    await router.push('/profile', undefined, { locale });
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
              {t('common:error')}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={reset}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                // eslint-disable-next-line no-magic-numbers
                color: (theme): string => theme.palette.grey[500],
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
      <RightPanelWrapper
        onSubmit={handleSubmit(async (data) => {
          try {
            await handleFormSubmit(data);
          } catch (submitError) {
            log.error('Login error', submitError);
          }
        })}
      >
        <Typography variant="h5">{t('common:login')}</Typography>
        <TextFieldWrapper
          id="email"
          label={t('common:email')}
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
          label={t('common:password')}
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
          type="submit"
        >
          {t('common:login')}
        </ButtonWrapper>
        <LinkBottomWrapper>
          <Link href="#">{t('auth:login.forgot_password')}</Link>
          <Link href="/auth/register" locale={locale}>
            {t('common:register')}
          </Link>
        </LinkBottomWrapper>
      </RightPanelWrapper>
    </PageWrapper>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'auth'])),
    },
  };
};

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

const RightPanelWrapper = styled.form`
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
