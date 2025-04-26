'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {
  Bell as BellIcon,
  MagnifyingGlass as MagnifyingGlassIcon,
  X as XIcon,
} from '@phosphor-icons/react';

import { usePopover } from '@/hooks/use-popover';
import { useUser } from '@/hooks/use-user';
import { useNotification } from '@/contexts/NotificationContext';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';
import { Searchbar } from '../searchbar/searchbar';

export function MainNav(): React.JSX.Element {
  const router = useRouter();
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { user } = useUser();
  const {
    notifications,
    unseenCount,
    markAllAsSeen,
    newNotification,
    setNewNotification,
    removeNotification,
  } = useNotification();
  const userPopover = usePopover<HTMLDivElement>();

  const primeiraLetra = user?.firstName?.charAt(0)?.toUpperCase() ?? '?';

  const handleBellClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    markAllAsSeen();
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleCloseSnackbar = () => {
    setNewNotification(false);
  };

  const handleNotificationClick = (idProcess: number) => {
    handleClosePopover();
    router.push(`/dashboard/processes?id=${idProcess}`);
  };

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', justifyContent: 'center', width: '150%' }}
          >
            <Searchbar />
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="Notificações">
              <Badge badgeContent={unseenCount} color="success" variant={unseenCount > 0 ? 'dot' : undefined}>
                <IconButton onClick={handleBellClick}>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            <Tooltip title="Perfil">
              <Avatar
                onClick={userPopover.handleOpen}
                ref={userPopover.anchorRef}
                sx={{
                  cursor: 'pointer',
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                {primeiraLetra}
              </Avatar>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      {/* Dropdown das notificações */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, maxWidth: 320, minWidth: 250 }}>
          <Typography variant="h6" gutterBottom>
            Notificações
          </Typography>

          {notifications.length === 0 ? (
            <Typography color="text.secondary" variant="body2">
              Nenhuma notificação.
            </Typography>
          ) : (
            notifications.map((notif) => (
              <Box
                key={notif.id}
                sx={{
                  padding: '12px 16px',
                  pr: 5,
                  mb: 1,
                  borderRadius: 2,
                  position: 'relative',
                  backgroundColor: notif.seen ? 'background.default' : 'rgba(25, 118, 210, 0.08)',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.15)',
                  },
                }}
                onClick={() => handleNotificationClick(notif.idProcess)}
              >
                {/* Botão de fechar (X) */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notif.id);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    padding: 0.5,
                    zIndex: 1,
                    color: '#888',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#000',
                    },
                  }}
                >
                  <XIcon size={14} weight="bold" />
                </IconButton>

                <Typography variant="body2" fontWeight={notif.seen ? 400 : 600}>
                  {notif.message}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Popover>

      {/* Toast de notificação */}
      <Snackbar
        open={newNotification}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Novo processamento concluído!
        </Alert>
      </Snackbar>

      {/* Popover de usuário e menu mobile */}
      <UserPopover
        anchorEl={userPopover.anchorRef.current}
        onClose={userPopover.handleClose}
        open={userPopover.open}
      />
      <MobileNav open={openNav} onClose={() => setOpenNav(false)} />
    </React.Fragment>
  );
}
