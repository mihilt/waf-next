import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function NotFound(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return <></>;
}
