import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function NotFound(): JSX.Element {
  const router = useRouter();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count => count - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: '1.2rem',
          fontWeight: 500,
          textAlign: 'center',
          mb: 1,
        }}
      >
        요청하신 페이지는 존재하지 않습니다.
      </Typography>
      <Typography
        variant="h2"
        sx={{
          fontSize: '0.8rem',
          fontWeight: 400,
          textAlign: 'center',
        }}
      >
        {count}초 후 메인 페이지로 이동합니다.
      </Typography>
    </Box>
  );
}
