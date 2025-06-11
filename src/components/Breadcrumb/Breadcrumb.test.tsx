import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Breadcrumb from './Breadcrumb';

describe('<Breadcrumb />', () => {
  test('it should mount', () => {
    render(
      <Breadcrumb
        props={[
          { path: '/dashboard', title: 'Dashboard' , breadcrumbName: 'Dashboard', key: '' },
          { path: '/scoreSettings', title: 'Score Settings', breadcrumbName: 'Settings', key: 'Score' }
        ]}
      />
    );
    
    const breadcrumb = screen.getByTestId('Breadcrumb');
    expect(breadcrumb).toBeInTheDocument();
  });
});
