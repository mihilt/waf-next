import { Box, Divider } from '@mui/material';
import Router from 'next/router';

interface Props {
  category: string;
}

export default function CategoryHeader({ category }: Props): JSX.Element {
  return (
    <>
      <Box sx={{ display: 'flex', p: 1 }}>
        <Box
          sx={{ cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700, color: '#000999' }}
          onClick={async () => {
            Router.push(`/posts/${category}`);
          }}
        >
          {category}
        </Box>
      </Box>
      <Divider />
    </>
  );
}
