import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import { FilterSearch } from './FilterSearch';

it('renders FilterSearch', () => {
  render(
    <CommonTestWrapper>
      <FilterSearch />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('filterSearch')).toBeInTheDocument();
});
