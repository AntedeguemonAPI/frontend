'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';

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

  const searchUrl = process.env.NEXT_PUBLIC_SEMANTIC_SEARCH_URL;

  React.useEffect(() => {
    if (query && searchUrl) {
      setLoading(true);

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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {loading ? `Buscando resultados para: "${query}"` : `${results.length} resultados encontrados para: "${query}"`}
      </Typography>

      {loading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ mt: 5 }}>
          <CircularProgress />
        </Stack>
      ) : results.length > 0 ? (
        <Stack spacing={2}>
          {results.map((result, index) => (
            <Box key={index} sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
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
      ) : (
        <Typography variant="body1" color="textSecondary">
          Nenhum resultado encontrado.
        </Typography>
      )}
    </Box>
  );
}
