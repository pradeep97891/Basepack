import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ScoreSettings from './ScoreSettings';
import Testwrapper from '@/components/CommonTestWrapper/CommonTestWrapper';

describe('<ScoreSettings />', () => {
  test('it should mount', () => {
    render(
        <Testwrapper>
          <ScoreSettings />
        </Testwrapper>
      );
    
    const scoreSettings = screen.getByTestId('ScoreSettings');

    expect(scoreSettings).toBeInTheDocument();
  });
});