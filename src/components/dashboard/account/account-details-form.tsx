'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';
import type { User } from '@/types/user';

export function AccountDetailsForm(): React.JSX.Element {
  const { user, refreshUser } = useUser();

  const [nome, setNome] = React.useState(user?.firstName ?? '');
  const [senha, setSenha] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const [messageType, setMessageType] = React.useState<'success' | 'error' | 'info'>('success');

  const prevUserRef = React.useRef<User | null>(null);

  // Loga quando o user no contexto for atualizado
  React.useEffect(() => {
    if (user && user !== prevUserRef.current) {
      console.log('[User atualizado]', user);
      prevUserRef.current = user;
    }
  }, [user]);

  const handleSave = async () => {
    const body: Record<string, string> = {};

    if (nome !== user?.firstName) {
      body.novoNome = nome;
    }

    if (senha.trim() !== '') {
      body.novaSenha = senha;
    }

    if (Object.keys(body).length === 0) {
      setMessage('Nenhuma alteração detectada.');
      setMessageType('info');
      return;
    }

    const { error } = await authClient.updateUser(body);

    if (error) {
      setMessage(`Erro ao atualizar: ${error}`);
      setMessageType('error');
    } else {
      await refreshUser?.();
      setMessage('Dados atualizados com sucesso!');
      setMessageType('success');
    }
  };

  return (
    <form
    onSubmit={(e) => {
      e.preventDefault();
      handleSave();
    }}
  >
    <Stack spacing={2}>
      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
  
      <Card>
        <CardHeader
          title="Perfil"
          subheader={
            <Typography variant="body2" color="text.secondary">
              Você pode editar seu nome e senha. O e-mail não pode ser alterado.
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Nome</InputLabel>
                <OutlinedInput
                  label="Nome"
                  name="firstName"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormControl>
            </Grid>
  
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Permissão</InputLabel>
                <OutlinedInput
                  value={user?.isAdmin ? 'Administrador' : 'Usuário comum'}
                  label="Permissão"
                  disabled
                />
              </FormControl>
            </Grid>
  
            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel>Email</InputLabel>
                <OutlinedInput
                  value={user?.email ?? ''}
                  label="Email"
                  disabled
                  sx={{ color: 'text.disabled' }}
                />
              </FormControl>
            </Grid>
  
            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel>Nova senha</InputLabel>
                <OutlinedInput
                  type="password"
                  label="Nova senha"
                  name="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            Salvar alterações
          </Button>
        </CardActions>
      </Card>
    </Stack>
  </form>
  
  );
}
