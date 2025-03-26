'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useUser } from '@/hooks/use-user';

export function AccountInfo(): React.JSX.Element {
  const { user } = useUser();

  const nomeCompleto = user?.firstName ?? 'Usuário';
  const inicial = nomeCompleto.charAt(0).toUpperCase();

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar sx={{ height: '80px', width: '80px', fontSize: 32 }}>{inicial}</Avatar>
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{nomeCompleto}</Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
    </Card>
  );
}
