import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Avatar, Button, TextField, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import styled from 'styled-components';

import { Account } from '@/generated/graphql';
import { AuthStorageService } from '@/services/auth-storage.service';

export default function Profile() {
  const { t } = useTranslation(['profile']);

  const [account, setAccount] = useState<Account | undefined>();

  useEffect(() => {
    setAccount(AuthStorageService.getAccount());
  }, []);

  function handleLogout() {
    AuthStorageService.clear();
    window.location.reload();
  }

  return account ? (
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
          {t('logout')}
        </Button>
      </ProfileWrapper>
    </PageWrapper>
  ) : (
    <PageWrapper>
      <ProfileWrapper>
        <h1>{t('profile:a')}</h1>
        <Link href="/auth/register">Register</Link>
        <br />
        <Link href="/auth/login">Login</Link>
      </ProfileWrapper>
    </PageWrapper>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['profile'])),
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
