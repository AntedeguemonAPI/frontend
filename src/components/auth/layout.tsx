import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Centraliza verticalmente
        alignItems: 'center', // Centraliza horizontalmente
        minHeight: '100vh', // Garante que ocupe a altura total da tela
        textAlign: 'center', // Centraliza textos dentro
      }}
    >
      {/* Logo */}
      <Box>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
          <DynamicLogo colorDark="light" colorLight="dark" height={100} width={200} />
        </Box>
      </Box>

      {/* Conteúdo centralizado */}
      <Box sx={{ maxWidth: '450px', width: '100%', p: 3 }}>{children}</Box>
    </Box>
  );
}
