import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ReaccommodationModal from './ReaccommodationModal';

describe('<ReaccommodationModal />', () => {
  test('it should mount', () => {
    render(<ReaccommodationModal />);
    
    const reaccommodationModal = screen.getByTestId('ReaccommodationModal');

    expect(reaccommodationModal).toBeInTheDocument();
  });
});