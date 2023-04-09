import { Box } from '@mui/material';
import Header from './header';

interface Props {
  children: JSX.Element | JSX.Element[];
}

export default function Layout({ children }: Props): JSX.Element {
  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ backgroundColor: '#fff', width: '100%', maxWidth: '1024px' }}>{children}</Box>
      </Box>
    </>
  );
}
