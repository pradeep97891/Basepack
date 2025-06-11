import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormSubmitButton from './FormSubmitButton';
import CommonTestWrapper from '../CommonTestWrapper/CommonTestWrapper';

describe('Form Submit Button mount check', () => {
  test('it should mount', () => {
    render(
      <CommonTestWrapper>
        <FormSubmitButton form={undefined}  />
      </CommonTestWrapper>
    );
    
    const FormSubmitBtn = screen.getByTestId('FormSubmitButton');
    expect(FormSubmitBtn).toBeInTheDocument();
  });
});
