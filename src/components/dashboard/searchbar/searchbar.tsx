import * as React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

export function Searchbar(): React.JSX.Element {
  return (
    
    <OutlinedInput
    defaultValue=""
    fullWidth
    placeholder="Busca semântica"
    sx={{ maxWidth: '800px' }}
  />
  );
}