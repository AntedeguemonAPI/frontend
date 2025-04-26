'use client';

import * as React from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  Typography, Button, Modal, CircularProgress, Chip, Stack, TableSortLabel
} from '@mui/material';
import { useUser } from '@/hooks/use-user';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '80vh',
  overflowY: 'auto',
  borderRadius: 2,
};

type Order = 'asc' | 'desc';

export default function MyProcessesPage(): React.JSX.Element {
  const { user } = useUser();
  const [data, setData] = React.useState<any[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<any | null>(null);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Novos estados para ordenação
  const [orderBy, setOrderBy] = React.useState<keyof any>('id');
  const [order, setOrder] = React.useState<Order>('asc');

  const handleOpen = (item: any) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    console.log('[MEUS PROCESSAMENTOS] Contexto do usuário:', user);
  }, [user]);

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_PROCESSING_SERVER_URL}preprocessamento/`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error('Erro ao buscar dados:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: keyof any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (array: any[], comparator: (a: any, b: any) => number) => {
    return [...array].sort(comparator);
  };

  const getComparator = (order: Order, orderBy: keyof any) => {
    return order === 'desc'
      ? (a: any, b: any) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a: any, b: any) => (a[orderBy] < b[orderBy] ? -1 : 1);
  };

  const sortedData = sortData(data, getComparator(order, orderBy));
  const paginatedRows = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const renderStatus = (value: boolean) => (
    <Chip
      label={value ? 'Concluído' : 'Pré-processando'}
      color={value ? 'success' : 'warning'}
      variant="outlined"
      size="small"
    />
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Meus Processamentos</Typography>

      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sortDirection={orderBy === 'id' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'id'}
                      direction={orderBy === 'id' ? order : 'asc'}
                      onClick={() => handleRequestSort('id')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'preprocessamento_concluido' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'preprocessamento_concluido'}
                      direction={orderBy === 'preprocessamento_concluido' ? order : 'asc'}
                      onClick={() => handleRequestSort('preprocessamento_concluido')}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{renderStatus(!!item.preprocessamento_concluido)}</TableCell>
                    <TableCell align="center">
                      {item.preprocessamento_concluido === 1 && (
                        <Button variant="contained" size="small" onClick={() => handleOpen(item)}>
                          Ver Detalhes
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
          />
        </Paper>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Detalhes do Pré-processamento
          </Typography>
          <pre style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(selectedItem, null, 2)}
          </pre>
        </Box>
      </Modal>
    </Stack>
  );
}
