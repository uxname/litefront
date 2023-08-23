import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ClientOnly from '@components/client-only.component';
import { Avatar, Button, TextField, Typography } from '@mui/material';
import styled from 'styled-components';

import localeDetectorService from '@/services/locale-detector.service';
import { useAuthStore } from '@/store/auth.store';

export default function Profile() {
  const { t } = useTranslation(['common', 'profile']);
  const locale = localeDetectorService.detect();

  const { account, clear } = useAuthStore();

  function handleLogout() {
    clear();
    window.location.reload();
  }

  return account ? (
    <ClientOnly>
      <PageWrapper>
        <ProfileWrapper>
          <Avatar />
          <Typography variant="h5">{account.email}</Typography>
          <ProfileInfo>
            <TextField
              label="ID"
              variant="outlined"
              value={account.id}
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
  ) : (
    <ClientOnly>
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
