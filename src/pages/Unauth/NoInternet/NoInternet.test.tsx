import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import NoInternet from './NoInternet';

describe('<NoInternet />', () => {
  test('it should mount', () => {
    render(
      <CommonTestWrapper>
        <NoInternet />
      </CommonTestWrapper>
    );

    const NoInternetId = screen.getByTestId('NoInternet');

    expect(NoInternetId).toBeInTheDocument();
  });
});
