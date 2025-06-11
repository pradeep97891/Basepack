import { FieldData } from 'rc-field-form/lib/interface';

const formErrorObjectFromResponse = (object?: Object): FieldData[] => {
  let formErrorObject: FieldData[] = [];
  if (object) {
    Object.entries(object).forEach(([key, value]) => {
      if (key && value instanceof Array) {
        formErrorObject.push({ name: key, errors: value });
      }
    });
  }
  return formErrorObject;
};

//Text transformer to uppercase while entering
const formToUpperCase = (event: React.FormEvent<HTMLInputElement>) => {
  return (event.target as HTMLInputElement).value = (
    event.target as HTMLInputElement
  ).value.trim().toUpperCase();
};

// Custom validation function
const validateLastNameOrEmail = (message: string) => (rule: any, value: string) => {
  // Define your validation logic here
  // You can use regular expressions or other methods to validate the input
  const lastNamePattern = /^[A-Za-z]+$/;
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

  if (!value || lastNamePattern.test(value) || emailPattern.test(value)) {
    // If the value is empty, or it's a valid last name or email, consider it valid
    return Promise.resolve();
  } else {
    // If it's neither a valid last name nor a valid email, provide an error message
    return Promise.reject(message);
  }
};

//When submitting forms, the first error should be focused.
const formFinishFailedFocus = (errorInfo: any, form: any) => {
  const namePath = errorInfo.errorFields[0].name;
  form.getFieldInstance(namePath)?.focus();
};

const validateOTP = (message: string) => (rule: any, value: string) => {
  const otpPattern = /^\d{6}$/; // Assuming OTP is a 6-digit number

  if (!value || otpPattern.test(value)) {
    // If the value is empty or it matches the OTP pattern, consider it valid
    return Promise.resolve();
  } else {
    // If it doesn't match the OTP pattern, provide an error message
    return Promise.reject(message);
  }
};

export { formErrorObjectFromResponse, formToUpperCase, validateLastNameOrEmail,validateOTP, formFinishFailedFocus };
