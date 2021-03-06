import React from 'react';
import {ThemeProvider} from 'theme-ui';
import {render, screen} from '@testing-library/react';
import {Link} from '../src';

function renderWithContext(children) {
  const components = {
    a: (props) => <fake-link role="link" {...props} />
  };
  return render(
    <ThemeProvider components={components}>{children}</ThemeProvider>
  );
}

test('href is applied to the link', () => {
  const href = 'https://www.example.com';
  render(<Link href={href} />);
  const link = screen.getByRole('link');

  expect(link).toHaveAttribute('href', href);
  expect(link).not.toHaveAttribute('as');
});

test('children is applied to the link', () => {
  render(<Link href="https://www.example.com">Welcome</Link>);
  const link = screen.getByRole('link');

  expect(link).toHaveTextContent('Welcome');
  expect(link).not.toHaveAttribute('as');
});

test('isTargetBlank adds target and rel attributes to the link', () => {
  render(<Link isTargetBlank href="https://www.example.com" />);
  const link = screen.getByRole('link');

  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noreferrer noopener');
  expect(link).not.toHaveAttribute('as');
});

test('it uses the Link component from ThemeProvider to render internal links', () => {
  renderWithContext(<Link href="/example/page" />);
  const link = screen.getByRole('link');

  expect(link).toHaveAttribute('href', '/example/page');
  expect(link).not.toHaveAttribute('as');
});

test('href and as props are applied to internal links', () => {
  renderWithContext(<Link href="/example/[slug]" as="/example/id" />);
  const link = screen.getByRole('link');

  expect(link).toHaveAttribute('as', '/example/id');
  expect(link).toHaveAttribute('href', '/example/[slug]');
});

test('does not render api urls as internal links', () => {
  renderWithContext(<Link href="/api/user/1" />);
  const link = screen.getByRole('link');

  expect(link).toHaveAttribute('href', '/api/user/1');
  expect(link).not.toHaveAttribute('isInternal');
  expect(link).not.toHaveAttribute('as');
});
