import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { CheckCircle as CheckIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { WarningCircle as WarningIcon } from '@phosphor-icons/react/dist/ssr/WarningCircle'; // ícone de alerta

export interface TotalSlaProps {
  slaMet: number;
  slaNotMet: number;
  sx?: SxProps;
}

export function TotalSla({ slaMet, slaNotMet, sx }: TotalSlaProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Typography color="text.secondary" variant="overline">
            SLA Cumprido/Não Cumprido
          </Typography>
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              <Avatar sx={{ backgroundColor: 'var(--mui-palette-success-main)', height: '56px', width: '56px' }}>
                <CheckIcon fontSize="var(--icon-fontSize-lg)" />
              </Avatar>
              <Typography variant="h5">{slaMet}</Typography>
              <Typography color="text.secondary" variant="caption">
                Cumprido
              </Typography>
            </Stack>
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              <Avatar sx={{ backgroundColor: 'var(--mui-palette-error-main)', height: '56px', width: '56px' }}>
                <WarningIcon fontSize="var(--icon-fontSize-lg)" />
              </Avatar>
              <Typography variant="h5">{slaNotMet}</Typography>
              <Typography color="text.secondary" variant="caption">
                Não Cumprido
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
