import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdhocPnrList from './AdhocPNRList';

describe('<AdhocPNRList />', () => {
  test('it should mount', () => {
    render(<AdhocPnrList />);
    
    const adhocPnrList = screen.getByTestId('AdhocPNRList');

    expect(adhocPnrList).toBeInTheDocument();
  });
});