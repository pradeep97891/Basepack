import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import ScoreList from './ScoreList';

it('renders ScoreList', () => {
  render(
    <CommonTestWrapper>
      <ScoreList />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('scoreList')).toBeInTheDocument();
});

test('shows skeleton loader when data is loading', () => {
  render(
    <CommonTestWrapper>
      <ScoreList />
    </CommonTestWrapper>
  );

  const loader = screen.getByTestId('SkeletonLoader');
  expect(loader).toBeInTheDocument();
});
