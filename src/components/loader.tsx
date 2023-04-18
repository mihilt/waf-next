import { Box } from '@mui/material';
import { PuffLoader } from 'react-spinners';

interface Props {}

export default function Loader({}: Props): JSX.Element {
  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          position: 'absolute',
          top: '0',
          left: '0',
          backgroundColor: 'rgb(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '99',
        }}
      >
        <PuffLoader color="#000999" size={100} speedMultiplier={1.5} />
      </Box>
    </>
  );
}
