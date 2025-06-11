import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreateEmailTemplate from './CreateEmailTemplate';
import Testwrapper from '@/components/CommonTestWrapper/CommonTestWrapper'

describe('Test create email template element', () => {
  test('it should mount', () => {
    render(
      <Testwrapper>
        <CreateEmailTemplate />
      </Testwrapper>
    );

    const CreateEmailTemp = screen.getByTestId('CreateEmailTemplate');
    expect(CreateEmailTemp).toBeInTheDocument();
  });
});