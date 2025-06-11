import React from 'react';
import { render, screen } from '@testing-library/react';
import ForgotPassword from './ForgotPassword';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';

describe('<ForgotPassword />', () => {
  test('it should mount', () => {
    render(
      <CommonTestWrapper>
        <ForgotPassword />
      </CommonTestWrapper>
    );
  });
});
