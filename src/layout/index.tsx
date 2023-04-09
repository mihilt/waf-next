import Menu from './menu';

interface Props {
  children: JSX.Element | JSX.Element[];
}

export default function Layout({ children }: Props): JSX.Element {
  return (
    <>
      <Menu />
      {children}
    </>
  );
}
