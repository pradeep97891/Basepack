import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import PageNotFound from './PageNotFound';

describe('<PageNotFound />', () => {
  test('it should mount', () => {
    render(
      <CommonTestWrapper>
        <PageNotFound />
      </CommonTestWrapper>
    );

    const pageNotFound = screen.getByTestId('PageNotFound');

    expect(pageNotFound).toBeInTheDocument();
  });
});
