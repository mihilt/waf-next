import { Box, Skeleton } from '@mui/material';

interface Props {}

export default function ToastUiSkeleton({}: Props): JSX.Element {
  return (
    <>
      <Skeleton variant="rounded" animation="wave" width={'100%'} height={45} />
      <Box sx={{ mt: 0.5 }} />
      <Skeleton variant="rounded" animation="wave" width={'100%'} height={550} />
    </>
  );
}
