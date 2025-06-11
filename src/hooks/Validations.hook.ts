/**
 * Title: UseInputValidation Hook
 * Description: This hook provides validation for various input types using regular expressions.
 **/

// Define the type for the keys of the patterns object
type ValidationType = 'number' | 'alphabetSpace' | 'alphabet' | 'alphaNumeric' | 'alphaNumericMust' | 'alphaNumericSpace' | 'decimal' | 'address' | 'email' | 'password' | 'mobileNumber';

interface UseInputValidationProps {
  type: ValidationType; // The type of validation to be applied
  value: string;        // The input value to be validated
}

// Define regular expressions for each validation type
// eslint-disable-next-line
const patterns: Record<ValidationType, RegExp> = { 
  // eslint-disable-next-line
  number: /[0-9\-\ ]/, // Allows digits, hyphens, and spaces
  alphabetSpace: /^[A-Za-z ]+$/, // Allows alphabets and spaces only
  alphabet: /^[a-zA-Z]*$/, // Allows alphabets only
  alphaNumeric: /^[A-Za-z0-9]*$/, // Allows alphabets and numbers
  alphaNumericMust: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]*$/, // Ensures both letter and number
  alphaNumericSpace: /^[A-Za-z0-9 ]*$/, // Allows alphabets, numbers, and spaces
  // eslint-disable-next-line
  decimal: /[0-9\-\ .]/, // Allows digits, hyphens, spaces, and decimal points
  address: /^[a-zA-Z0-9\s,'-]*$/, // Allows alphabets, numbers, spaces, commas, apostrophes, and hyphens
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Standard email format
  password: /^[\s\S]{8,}$/,
  // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, // Requires lowercase, uppercase, digit, special character, and minimum 8 characters
  mobileNumber: /^\d{10}$/
};

/**
 * Hook to validate input values based on the specified validation type.
 * @param {UseInputValidationProps} props - The validation type and the value to validate.
 * @returns {boolean} - Returns true if the value matches the validation pattern, otherwise false.
 */
const UseInputValidation = ({ type, value }: UseInputValidationProps): boolean => {
  const pattern = patterns[type]; // Retrieve the appropriate regex pattern based on the type
  return pattern ? pattern.test(value) : false; // Test the value against the pattern and return the result
  return true;
};

export default UseInputValidation;
