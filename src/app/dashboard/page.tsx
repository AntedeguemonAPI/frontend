'use client';

import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

import { useUser } from '@/hooks/use-user';
import { Tickets } from '@/components/dashboard/overview/tickets';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers, TotalTickets } from '@/components/dashboard/overview/total-tickets';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { SentimentalChart } from '@/components/dashboard/overview/sentimental-chart';
import { WordChart } from '@/components/dashboard/overview/word-chart';

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

export default function Page(): React.JSX.Element {
  const { user } = useUser();
  const [data, setData] = React.useState<any[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<any | null>(null);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const handleOpen = (item: any) => {
    setSelectedItem(item);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    console.log('[DASHBOARD] Contexto do usuário:', user);
  }, [user]);

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_PROCESSING_SERVER_URL}preprocessamento/`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error('Erro ao buscar dados:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Tickets diff={8} trend="up" sx={{ height: '100%' }} value="320" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalTickets open={45} closed={275} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={75.5} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" />
      </Grid>
      <Grid lg={8} xs={12}>
        <WordChart
          chartSeries={[{ name: 'Frequência', data: [120, 95, 80, 75, 70, 65, 60, 55, 50, 45] }]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <SentimentalChart
          chartSeries={[50, 30, 20]}
          labels={['Positivo', 'Negativo', 'Neutro']}
          sx={{ height: '100%' }}
        />
      </Grid>

      {/* Cards adicionais com status de processamento */}
      {loading ? (
        <Grid xs={12} sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
        </Grid>
      ) : (
        data.map((item) => (
          <Grid key={item.id} xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                ID: {item.id}
              </Typography>
              <Typography>Status: {item.preprocessamento_concluido ? 'Concluído' : 'Pré-processando'}</Typography>
              {item.preprocessamento_concluido === 1 && (
                <Button sx={{ mt: 2 }} variant="contained" fullWidth onClick={() => handleOpen(item)}>
                  Ver Detalhes
                </Button>
              )}
            </Paper>
          </Grid>
        ))
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
    </Grid>
  );
}