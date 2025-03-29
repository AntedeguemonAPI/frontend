import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { CheckCircle as ClosedIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Clock as OpenIcon } from '@phosphor-icons/react/dist/ssr/Clock';

export interface TotalTicketsProps {
  open: number;
  closed: number;
  sx?: SxProps;
}

export function TotalTickets({ open, closed, sx }: TotalTicketsProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Typography color="text.secondary" variant="overline">
            Chamados em Aberto/Fechados
          </Typography>
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              <Avatar sx={{ backgroundColor: 'var(--mui-palette-warning-main)', height: '56px', width: '56px' }}>
                <OpenIcon fontSize="var(--icon-fontSize-lg)" />
              </Avatar>
              <Typography variant="h5">{open}</Typography>
              <Typography color="text.secondary" variant="caption">
                Em Aberto
              </Typography>
            </Stack>
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              <Avatar sx={{ backgroundColor: 'var(--mui-palette-success-main)', height: '56px', width: '56px' }}>
                <ClosedIcon fontSize="var(--icon-fontSize-lg)" />
              </Avatar>
              <Typography variant="h5">{closed}</Typography>
              <Typography color="text.secondary" variant="caption">
                Fechados
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}