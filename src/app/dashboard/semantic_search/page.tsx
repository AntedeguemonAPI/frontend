'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';

export default function Page(): React.JSX.Element {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = React.useState<{ date: string; description: string }[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  // Simula o conteúdo de um arquivo CSV com conversas do helpdesk
  const mockConversations = [
    'Estou com problemas na conexão com a internet.',
    'Minha internet está muito lenta.',
    'Não consigo acessar a internet.',
    'A conexão cai frequentemente.',
    'A internet não está funcionando.',
    'Problemas de conexão com o Wi-Fi.',
    'Minha internet está instável.',
    'Não consigo conectar ao roteador.',
    'A velocidade da internet está muito baixa.',
    'A conexão com a internet foi interrompida.',
    'Estou enfrentando dificuldades para acessar sites.',
    'A internet está desconectando sozinha.',
    'Não consigo assistir vídeos por causa da internet.',
    'A conexão está muito ruim hoje.',
    'Minha internet parou de funcionar de repente.',
  ];

  React.useEffect(() => {
    if (query) {
      setLoading(true);

      // Simula a busca semântica
      setTimeout(() => {
        const filteredResults = mockConversations
          .filter((conversation) => {
            // Divide a query em palavras e verifica se pelo menos uma está presente na frase
            const queryWords = query.toLowerCase().split(' ');
            return queryWords.some((word) => conversation.toLowerCase().includes(word));
          })
          .slice(0, 10) // Limita a 10 resultados
          .map((description) => ({
            date: new Date().toLocaleDateString(),
            description,
          }));

        setResults(filteredResults);
        setLoading(false);
      }, 2000); // Simula um atraso de 1 segundo
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
              <Typography variant="body2" color="textSecondary">
                Data: {result.date}
              </Typography>
              <Typography variant="h6">{result.description}</Typography>
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
