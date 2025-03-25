import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export interface buttonProsp{
    children: string;
}

export function CustomButton( {children}:buttonProsp) {
  return (
    <Stack spacing={2} direction="row">
        <Button variant="contained">
            {children}
        </Button>
    </Stack>
  );
}