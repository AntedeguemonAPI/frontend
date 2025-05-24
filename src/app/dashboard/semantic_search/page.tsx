'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Paper, Stack, TablePagination, Typography } from '@mui/material'; // Adicionado Paper e TablePagination

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
      // Resetar a página para 0 sempre que uma nova busca for feita
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

  // Funções para manipulação da paginação
  const handleChangePage = (_event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Aplicar paginação aos resultados
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
          <Stack spacing={2} sx={{ p: 2 }}>
            {paginatedResults.map((result, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  width: '100%',
                }}
              >
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  <strong>Score:</strong> {(result.score * 100).toFixed(2)}%
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>ID Chamado:</strong> {result.id_chamado}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Data Abertura:</strong> {result.data_abertura}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Data Fechamento:</strong> {result.data_fechamento || 'Não finalizado'}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ mt: 1, mb: 1 }}>
                  <strong>Descrição:</strong> {result.descricao}
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                  <strong>Resposta Sugerida:</strong> {result.resposta_sugerida || 'Nenhuma resposta disponível.'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Tag Assunto:</strong> {result.tag_assunto}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Tempo de Resposta (horas):</strong>{' '}
                  {typeof result.tempo_resposta_horas === 'number'
                    ? result.tempo_resposta_horas.toFixed(2)
                    : result.tempo_resposta_horas}
                </Typography>
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
