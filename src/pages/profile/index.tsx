import React from 'react';
import { Avatar, Button, TextField, Typography } from '@mui/material';
import styled from 'styled-components';

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

export default function Profile() {
  // Replace these with actual user data
  const user = {
    email: 'example@example.com',
    id: '123456',
  };

  return (
    <PageWrapper>
      <ProfileWrapper>
        <Avatar />
        <Typography variant="h5">{user.email}</Typography>
        <ProfileInfo>
          <TextField
            label="ID"
            variant="outlined"
            value={user.id}
            disabled
            sx={{ width: '100%' }}
          />
        </ProfileInfo>
        <Button variant="contained" sx={{ width: '100%' }}>
          Logout
        </Button>
      </ProfileWrapper>
    </PageWrapper>
  );
}
