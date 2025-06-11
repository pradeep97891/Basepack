import React, { ReactNode } from "react";
import { Button, Form } from "antd";
import "./DynamicForm.scss";
import { PlusOutlined } from "@ant-design/icons";

interface DynamicFormProps {
  name: any;
  initialValues: any[];
  children: (
    field: any,
    add: (name: number) => void,
    remove: (name: number) => void,
    index: number,
    fields: any[]
  ) => ReactNode;
  includeAddBtn?: { text: string; class: string };
}

/**
 * DynamicForm component simplifies the creation of dynamic forms using Ant Design's Form.List.
 * It allows dynamic addition and removal of form fields, with support for passing initial values.
 *
 * @param {string | number | (string | number)[]} name - The name of the dynamic list in the form (used as the key for Form.List).
 * @param {any[]} initialValues - An array of initial values to populate the dynamic form fields.
 * @param {(field: any, add: (name: number) => void, remove: (name: number) => void, index: number, fields: any[]) => ReactNode} children - A render prop to provide dynamic form fields.
 * The children function provides access to:
 *   - `field`: The field data for each dynamic item.
 *   - `add(name: number)`: Function to add a new form field.
 *   - `remove(name: number)`: Function to remove a form field.
 *   - `index`: The index of the current form field in the list.
 *   - `fields`: An array of all the fields in the current dynamic list.
 *
 * @returns A dynamic form that can add and remove fields, passing the field data through the children prop for customization.
 */
const DynamicForm: React.FC<DynamicFormProps> = ({
  name,
  children,
  initialValues,
  includeAddBtn,
}) => {
  return (
    <div className="cls-dynamic-form">
      <Form.List name={name} initialValue={initialValues}>
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map((field, index) =>
                children(field, add, remove, index, fields)
              )}
              {includeAddBtn && (
                <Button
                  key="add-btn"
                  className={includeAddBtn?.class}
                  onClick={add}
                  size="small"
                  type="link"
                  icon={<PlusOutlined />}
                >
                  {includeAddBtn?.text}
                </Button>
              )}
            </>
          );
        }}
      </Form.List>
    </div>
  );
};

export default DynamicForm;
