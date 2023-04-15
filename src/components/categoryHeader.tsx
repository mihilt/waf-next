import { Box, Divider } from '@mui/material';
import Router from 'next/router';
import { Category } from '../types';

interface Props {
  category: Category;
}

export default function CategoryHeader({ category }: Props): JSX.Element {
  return (
    <>
      <Box sx={{ display: 'flex', p: 1 }}>
        <Box
          sx={{ cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, color: '#000999' }}
          onClick={async () => {
            Router.push(`/posts/${category.categoryId}`);
          }}
        >
          {category.name}
        </Box>
      </Box>
      <Divider />
    </>
  );
}
