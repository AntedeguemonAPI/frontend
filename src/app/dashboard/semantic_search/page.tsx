'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Chip, CircularProgress, Grid, Paper, Stack, TablePagination, Typography } from '@mui/material';

interface SearchResult {
  score: number;
  id_chamado: string;
  data_abertura: string;
  data_fechamento?: string | null;
  descricao: string;
  resposta_sugerida?: string | null;
  tag_assunto: string;
  tempo_resposta_horas: string | number;
}

// Função auxiliar para determinar a cor do Chip do Score
const getScoreChipColor = (scoreValue: number): 'success' | 'warning' | 'default' => {
  if (scoreValue >= 0.35) return 'success';
  if (scoreValue >= 0.25) return 'warning';
  return 'default';
};

// Função auxiliar para formatar data ou retornar N/A
const formatDateSafely = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return 'N/A';
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'N/A';
  }
  return date.toLocaleDateString();
};

// Função para formatar o tempo de resposta (VERSÃO ATUALIZADA)
const formatResponseTime = (totalHours: number | string | null | undefined): string => {
  if (typeof totalHours === 'string') {
    const numericValue = parseFloat(totalHours);
    if (isNaN(numericValue)) {
      return totalHours;
    }
    totalHours = numericValue;
  }

  if (typeof totalHours !== 'number' || isNaN(totalHours) || totalHours < 0) {
    return 'N/A';
  }

  if (totalHours === 0) return '0h';
  if (totalHours > 0 && totalHours < 1) return '<1h';

  let h_calc = Math.floor(totalHours);

  const hoursInDay = 24;
  const daysInMonth = 30;

  const months = Math.floor(h_calc / (hoursInDay * daysInMonth));
  h_calc %= hoursInDay * daysInMonth;

  const days = Math.floor(h_calc / hoursInDay);
  h_calc %= hoursInDay;

  const hours = h_calc;

  const parts: string[] = [];

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);
  }
  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);
  }

  if ((hours > 0 && (months > 0 || days > 0)) || (months === 0 && days === 0)) {
    parts.push(`${hours}h`);
  }

  if (parts.length === 0) {
    return `${Math.floor(totalHours)}h`;
  }

  return parts.join(' ');
};

export default function Page(): React.JSX.Element {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  // Estados para paginação
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const searchUrl = process.env.NEXT_PUBLIC_SEMANTIC_SEARCH_URL;

  React.useEffect(() => {
    if (query && searchUrl) {
      setLoading(true);
      setPage(0);
      fetch(`${searchUrl}?query=${encodeURIComponent(query)}&top_k=100`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.resultados || []);
        })
        .catch((error) => {
          console.error('Erro ao buscar resultados:', error);
          setResults([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query, searchUrl]);

  const handleChangePage = (_event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedResults = results.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ py: 3, px: '20px' }}>
      <Typography variant="h4" gutterBottom>
        {loading ? `Buscando resultados para: "${query}"` : `${results.length} resultados encontrados para: "${query}"`}
      </Typography>

      {loading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ mt: 5 }}>
          <CircularProgress />
        </Stack>
      ) : results.length > 0 ? (
        <Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={0}>
          <Stack spacing={2.5}>
            {paginatedResults.map((result) => (
              <Box
                key={result.id_chamado}
                sx={{
                  p: 3,
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  width: '100%',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                  <Typography variant="overline" color="text.secondary" sx={{ lineHeight: '1.5' }}>
                    Chamado: {result.id_chamado}
                  </Typography>
                  <Chip
                    label={`Relevância: ${(result.score * 100).toFixed(0)}%`}
                    color={getScoreChipColor(result.score)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </Stack>

                <Typography variant="subtitle1" component="h3" sx={{ mb: 1.5, fontWeight: 500 }}>
                  {result.descricao}
                </Typography>

                {result.resposta_sugerida ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      mb: 2,
                      bgcolor: (theme) => theme.palette.action.hover,
                    }}
                  >
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>
                      Sugestão de Resposta:
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {result.resposta_sugerida}
                    </Typography>
                  </Paper>
                ) : null}

                <Grid container spacing={1.5} sx={{ color: 'text.secondary' }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2">Abertura: {formatDateSafely(result.data_abertura)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2">Fechamento: {formatDateSafely(result.data_fechamento)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" component="div">
                      Assunto: <Chip label={result.tag_assunto} size="small" variant="outlined" sx={{ ml: 0.5 }} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2">
                      Tempo de Resposta: {formatResponseTime(result.tempo_resposta_horas)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Stack>
          <TablePagination
            component="div"
            count={results.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />
        </Paper>
      ) : (
        <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', mt: 5 }}>
          Nenhum resultado encontrado.
        </Typography>
      )}
    </Box>
  );
}
