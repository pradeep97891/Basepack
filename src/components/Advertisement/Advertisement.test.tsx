import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Advertisement from './Advertisement';
import Testwrapper from '@/components/CommonTestWrapper/CommonTestWrapper'

describe('Test advertisement element', () => {
  test('it should mount', () => {
    render(
      <Testwrapper>
        <Advertisement />
      </Testwrapper>
    );

    const advertisementElement = screen.getByTestId('Advertisement');
    expect(advertisementElement).toBeInTheDocument();
  });
});