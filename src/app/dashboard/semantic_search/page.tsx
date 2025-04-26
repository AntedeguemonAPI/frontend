'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography, CircularProgress, Stack } from '@mui/material';

export default function Page(): React.JSX.Element {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (query) {
      // Simula uma chamada à API para buscar os resultados
      setLoading(true);
      fetch(`/api/search?query=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
        });
    }
  }, [query]);

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
              <Typography variant="h6">{result.title}</Typography>
              <Typography variant="body2">{result.description}</Typography>
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