import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';

export function Searchbar(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/dashboard/semantic_search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <OutlinedInput
      value={searchQuery}
      onChange={(e) => { setSearchQuery(e.target.value); }}
      fullWidth
      placeholder="Busca semântica"
      sx={{ maxWidth: '900px' }}
      endAdornment={
        <InputAdornment position="end">
          <IconButton onClick={handleSearch}>
            <MagnifyingGlassIcon />
          </IconButton>
        </InputAdornment>
      }
    />
  );
}
