import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DescriptionHeader from "./DescriptionHeader";
import Testwrapper from '@/components/CommonTestWrapper/CommonTestWrapper'

describe('Test description header element', () => {
  test('it should mount', () => {
    render(
      <Testwrapper>
        <DescriptionHeader data={undefined} />
      </Testwrapper>
    );

    const descriptionHeaderElement = screen.getByTestId('DescriptionHeader');
    expect(descriptionHeaderElement).toBeInTheDocument();
  });
});