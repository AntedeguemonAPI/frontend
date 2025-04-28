'use client';

import * as React from 'react';
import {
  Button, Stack, Typography, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControlLabel, Checkbox, Snackbar, Alert,
  Avatar, IconButton, Chip, Paper, TableContainer, TablePagination,
  FormLabel,
  RadioGroup,
  Radio
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Plus as PlusIcon, PencilSimple, Trash } from '@phosphor-icons/react';

const baseUrl = process.env.NEXT_PUBLIC_AUTH_SERVER_URL;

export default function Page(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [isAdm, setIsAdm] = React.useState(false);
  const [isViewer, setIsViewer] = React.useState(false);
  const [usuarios, setUsuarios] = React.useState<any[]>([]);
  const [editUser, setEditUser] = React.useState<any | null>(null);
  const [deleteDialog, setDeleteDialog] = React.useState<{ open: boolean, id: number | null }>({ open: false, id: null });
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const fetchUsuarios = async () => {
    const token = localStorage.getItem('custom-auth-token');
    try {
      const res = await fetch(`${baseUrl}/usuarios/listar`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error('Erro ao carregar usuários', err);
    }
  };

  React.useEffect(() => {
    fetchUsuarios();
  }, []);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setSnackbar({ open: true, message: 'E-mail inválido. Por favor, insira um e-mail válido.', severity: 'error' });
      return;
    }

    const token = localStorage.getItem('custom-auth-token');
    try {
      const response = await fetch(`${baseUrl}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nome, email, senha, is_adm: isAdm, is_viewer: isViewer })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.mensagem || 'Erro ao criar usuário');

      setSnackbar({ open: true, message: 'Usuário criado com sucesso!', severity: 'success' });
      setOpen(false);
      setNome(''); setEmail(''); setSenha(''); setIsAdm(false); setIsViewer(false);
      fetchUsuarios();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Erro inesperado', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('custom-auth-token');
    try {
      const res = await fetch(`${baseUrl}/usuarios/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_usuario: deleteDialog.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensagem || 'Erro ao deletar');

      setSnackbar({ open: true, message: 'Usuário deletado com sucesso!', severity: 'success' });
      setDeleteDialog({ open: false, id: null });
      fetchUsuarios();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Erro ao deletar', severity: 'error' });
    }
  };

  const handleEdit = (user: any) => setEditUser(user);

  const handleUpdate = async () => {
    const token = localStorage.getItem('custom-auth-token');
    try {
      const res = await fetch(`${baseUrl}/usuarios/atualizarPeloADM`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_usuario: editUser.id_usuario,
          novoNome: editUser.nome,
          novaSenha: editUser.senha
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao atualizar');

      setSnackbar({ open: true, message: 'Usuário atualizado com sucesso!', severity: 'success' });
      setEditUser(null);
      fetchUsuarios();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Erro ao atualizar', severity: 'error' });
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = usuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getInitial = (nome: string) => nome?.charAt(0).toUpperCase();
  const renderStatus = (value: boolean) => (
    <Chip label={value ? 'Sim' : 'Não'} color={value ? 'success' : 'default'} size="small" variant="outlined" />
  );

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Usuários</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon />} variant="contained" onClick={() => setOpen(true)}>
            Criar novo
          </Button>
        </div>
      </Stack>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell><TableCell>Nome</TableCell><TableCell>Email</TableCell>
                <TableCell>Admin</TableCell><TableCell>Viewer</TableCell><TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map(user => (
                <TableRow key={user.id_usuario}>
                  <TableCell><Avatar>{getInitial(user.nome)}</Avatar></TableCell>
                  <TableCell>{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{renderStatus(user.is_adm)}</TableCell>
                  <TableCell>{renderStatus(user.is_viewer)}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton onClick={() => handleEdit(user)} color="primary"><PencilSimple size={20} /></IconButton>
                      <IconButton onClick={() => setDeleteDialog({ open: true, id: user.id_usuario })} color="error"><Trash size={20} /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={usuarios.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
        />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Criar novo usuário</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nome" fullWidth value={nome} onChange={e => setNome(e.target.value)} />
            <TextField label="Email" fullWidth value={email} onChange={e => setEmail(e.target.value)} />
            <TextField label="Senha" type="password" fullWidth value={senha} onChange={e => setSenha(e.target.value)} />
            <FormLabel component="legend">Tipo de Usuário</FormLabel>
            <RadioGroup
              value={isAdm ? 'admin' : 'viewer'}
              onChange={e => {
                const value = e.target.value;
                setIsAdm(value === 'admin');
                setIsViewer(value === 'viewer');
              }}
            >
              <FormControlLabel value="admin" control={<Radio />} label="Administrador" />
              <FormControlLabel value="viewer" control={<Radio />} label="Visualizador" />
            </RadioGroup>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editUser} onClose={() => setEditUser(null)} fullWidth maxWidth="sm">
        <DialogTitle>Editar usuário</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nome" fullWidth value={editUser?.nome || ''} onChange={e => setEditUser({ ...editUser, nome: e.target.value })} />
            <TextField label="Nova senha" type="password" fullWidth value={editUser?.senha || ''} onChange={e => setEditUser({ ...editUser, senha: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpdate}>Salvar alterações</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>Deseja realmente excluir este usuário?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">Excluir</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}