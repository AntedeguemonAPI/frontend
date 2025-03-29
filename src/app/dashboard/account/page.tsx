import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import { Box } from '@mui/system';

export const metadata: Metadata = {
  title: `Account | Dashboard | ${config.site.name}`,
};

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Box textAlign="center">
        <Typography variant="h4">Minha Conta</Typography>
        <Typography color="text.secondary" variant="body1">
          Visualize e edite seus dados pessoais
        </Typography>
      </Box>

      <Box>
        <AccountInfo />
      </Box>

      <Box>
        <AccountDetailsForm />
      </Box>
    </Stack>
  );
}
