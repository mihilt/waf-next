import { Box, Divider } from '@mui/material';
import Router from 'next/router';

interface Props {}

export default function Header({}: Props): JSX.Element {
  return (
    <>
      <Box sx={{ display: 'flex', background: 'white' }}>
        <Box
          sx={{ fontSize: '1.5rem', fontWeight: 700, cursor: 'pointer', p: 1 }}
          onClick={() => {
            Router.push('/');
          }}
        >
          WAF
        </Box>
      </Box>
      <Divider />
    </>
  );
}
