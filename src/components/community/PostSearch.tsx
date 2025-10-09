"use client"

import { useState, ChangeEvent } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { TextField, InputAdornment, IconButton, Box, Button } from '@mui/material';
import { Icon } from '@iconify/react';


const CancleIconButton = styled(IconButton)(() => ({
  padding: 5
}));

export default function PostSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('keyword') || '');

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('keyword', searchValue);
    router.push(`${pathname}?${params.toString()}`)
  };

  const handleInputValueChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchValue(e.target.value);
  };


  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <TextField
        sx={{ width: { md: '50%', xs: '100%' } }}
        placeholder="검색어를 입력하세요."
        type="text"
        variant="outlined"
        fullWidth
        size="small"
      
        onChange={(e) => handleInputValueChange(e)}
        value={searchValue}
        InputProps={{
          style: { fontSize: '13px' },
          startAdornment: (
            <InputAdornment position="start">
              <Icon icon="eva:search-fill" width="24" height="24" />
            </InputAdornment>
          ),

          endAdornment: searchValue && (
            <CancleIconButton
              aria-label="toggle password visibility"
              onClick={() => setSearchValue('')}
            >
              <Icon icon="eva:close-circle-outline" width="24" height="24" />
            </CancleIconButton>
          )
        }}
      />
      <Button sx={{ ml: 1 }} variant="contained" onClick={handleSearch}>
        검색
      </Button>
    </Box>
  );
}
