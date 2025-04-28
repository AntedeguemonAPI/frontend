'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';

interface SearchResult {
  descricao: string;
  resposta_sugerida: string;
  tempo_resposta_horas: string | number;
  score: number;
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

      fetch(`${searchUrl}?query=${encodeURIComponent(query)}&top_k=10`)
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
        Resultados para: "{query}"
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
                Similaridade: {(result.score * 100).toFixed(2)}%
              </Typography>

              <Typography variant="h6" gutterBottom>
                {result.descricao}
              </Typography>

              <Typography variant="body2" gutterBottom>
                <strong>Resposta sugerida:</strong> {result.resposta_sugerida || "Nenhuma resposta disponível."}
              </Typography>

              <Typography variant="body2" color="textSecondary">
                <strong>Tempo de resposta:</strong> {typeof result.tempo_resposta_horas === 'number' 
                  ? `${result.tempo_resposta_horas.toFixed(2)} horas`
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
