import { ReactElement, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ClientOnly from '@components/client-only.component';
import { Avatar, Button, TextField, Typography } from '@mui/material';
import styled from 'styled-components';

import { useWhoAmILazyQuery } from '@/generated/graphql';
import localeDetectorService from '@/services/locale-detector.service';
import { useAuthStore } from '@/store/auth.store';

export default function Profile(): ReactElement {
  const { t } = useTranslation(['common', 'profile']);
  const locale = localeDetectorService.detect();

  const { account, clear } = useAuthStore();
  const [load, { data, error }] = useWhoAmILazyQuery();

  useEffect(() => {
    (async (): Promise<void> => {
      if (account) {
        await load();
      }
    })();
  }, [account]);

  async function handleLogout(): Promise<void> {
    clear();
  }

  if (error) {
    return (
      <PageWrapper>
        <ProfileWrapper>
          <ProfileInfo>
            <h1>Errors</h1>
            {error.graphQLErrors.map((gqlError, index) => (
              <TextField
                key={index}
                variant="outlined"
                value={gqlError.message}
                disabled
                sx={{ width: '100%' }}
              />
            ))}
          </ProfileInfo>
          <Button
            variant="contained"
            sx={{ width: '100%' }}
            onClick={handleLogout}
          >
            {t('common:logout')}
          </Button>
        </ProfileWrapper>
      </PageWrapper>
    );
  }

  if (!data?.whoami.profile || !account) {
    return (
      <PageWrapper>
        <ProfileWrapper>
          <h1>{t('profile:page_title')}</h1>
          <Link href="/auth/register" locale={locale}>
            {t('register')}
          </Link>
          <br />
          <Link href="/auth/login" locale={locale}>
            {t('common:login')}
          </Link>
        </ProfileWrapper>
      </PageWrapper>
    );
  }

  return (
    <ClientOnly>
      <PageWrapper>
        <ProfileWrapper>
          <Avatar />
          <Typography variant="h5">{data?.whoami.email}</Typography>
          <ProfileInfo>
            <TextField
              label="ID"
              variant="outlined"
              value={data.whoami.profile.id}
              disabled
              sx={{ width: '100%' }}
            />
          </ProfileInfo>
          <Button
            variant="contained"
            sx={{ width: '100%' }}
            onClick={handleLogout}
          >
            {t('common:logout')}
          </Button>
        </ProfileWrapper>
      </PageWrapper>
    </ClientOnly>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'profile'])),
    },
  };
};

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 300px;
`;
