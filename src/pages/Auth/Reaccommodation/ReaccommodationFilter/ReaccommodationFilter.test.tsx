import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ReaccommodationFilter from './ReaccommodationFilter';

describe('<ReaccommodationFilter />', () => {
  test('it should mount', () => {
    render(<ReaccommodationFilter tableData={[]} filters={[]} setTableData={undefined} />);
    const reaccommodationFilter = screen.getByTestId('ReaccommodationFilter');
    expect(reaccommodationFilter).toBeInTheDocument();
  });
});