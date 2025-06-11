import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import SearchFlight from './SearchFlight';

it('renders SearchFlight', () => {
  render(
    <CommonTestWrapper>
      <SearchFlight />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('searchFlight')).toBeInTheDocument();
});
