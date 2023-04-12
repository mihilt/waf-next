import Head from 'next/head';

interface Props {
  children: JSX.Element | JSX.Element[];
}

export default function Page({ children }: Props): JSX.Element {
  return (
    <>
      <Head>
        <title>WAF</title>
        <meta name="description" content="We Are Friends" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  );
}
