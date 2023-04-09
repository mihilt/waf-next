import Header from './header';

interface Props {
  children: JSX.Element | JSX.Element[];
}

export default function Layout({ children }: Props): JSX.Element {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
