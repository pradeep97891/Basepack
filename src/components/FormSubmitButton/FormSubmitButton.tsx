import type { FormInstance } from "antd";
import { Button, Form } from "antd";
import { useEffect, useState } from "react";

/**
 * Props interface for the SubmitButton component.
 */
interface SubmitButtonProps {
  form: FormInstance | undefined;
  customValidation ?: boolean | (() => boolean);
  htmlType ?: 'button' | 'submit';
  onClickHandler ?: () => void;
}

/**
 * SubmitButton component dynamically adjusts the submit button's disabled status based on form validation.
 * It watches for changes in form values and updates the disabled state accordingly.
 * @param form The form instance to watch for changes and perform validation.
 * @param customValidation Boolean flag (boolean or method that returns boolean) to enable custom validation logic.
 * @param htmlType Type of the HTML button element (default: 'submit').
 * @param onClickHandler Optional click handler for the button.
 * @returns A submit button component with dynamic disabled status based on form validation.
 */
const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({
  form,
  customValidation,
  htmlType = 'submit',
  children,
  onClickHandler,
}) => {
  const [submittable, setSubmittable] = useState<boolean>(false);

  /* Watch all values for change */
  const values = Form.useWatch([], form);

  /* Effect to update the submittable state based on form validation */
  useEffect(() => {    
    form
      ?.validateFields({ validateOnly: true })
      .then(() => {
        setSubmittable(customValidation ?? true);
      })
      .catch(() => setSubmittable(false));
  }, [form, values, customValidation]);

  return (
    <Button
      type="primary"
      htmlType={htmlType}
      data-testid = "FormSubmitButton"
      disabled={!submittable}
      className="cls-primary-btn fs-18 px-4"
      onClick={onClickHandler}
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
