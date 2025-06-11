import { MenuOutlined } from "@ant-design/icons";
import { Checkbox, Dropdown, MenuProps, Tooltip } from "antd";
import React, { useEffect } from "react";
import { useMemo, useState } from "react";
import "./CustomTableColumn.scss";
import { useTranslation } from "react-i18next";

type CustomTableColumnCompType = {
  initialColumns: any[];
  setVisibleColumns: (visibleColumns: any) => void;
  selected?: string[];
  hideableColumns?: string[];
};

/**
 * CustomTableComponent Component
 *
 * This component renders a dynamic column visibility editor for a table. It allows users
 * to select which columns should be visible by checking/unchecking the corresponding
 * checkboxes. The selected columns will be passed back to the parent component through
 * the setVisibleColumns function.
 *
 * @component
 * @param {any[]} initialColumns - An array of column configurations for the table.
 *   Each column object should contain at least a 'key' (unique identifier) and 'title' (column name).
 * @param {Function} setVisibleColumns - A function passed down from the parent component
 *   to update the visible columns based on the selected checkboxes.
 *   - Takes an array of column objects as an argument, filtered from the `initialColumns`
 *     based on the user's selection.
 * @param {string[]} selected - Array of column keys that should only be selected initially.
 * @param {string[]} hideableColumns - Array of column keys that should always be visible.
 
 * @returns {JSX.Element} The rendered component.
 */
const CustomTableColumn: React.FC<CustomTableColumnCompType> = ({
  initialColumns,
  setVisibleColumns,
  hideableColumns = [],
  selected = [],
}) => {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation();

  /* handleOpenChange:
   * - Handles the opening and closing of the dropdown.
   * - Updates the `open` state when the dropdown is triggered.
   * - flag: A boolean representing whether the dropdown should be open or closed. */
  const handleOpenChange = (flag: boolean) => flag !== open && setOpen(flag);

  // Initialize the selected column keys. If `selected` is provided, use that. Otherwise, select all columns by default.
  const [selectedColumnKeys, setSelectedColumnKeys] = useState<string[]>(
    selected.length > 0
      ? selected
      : initialColumns
          .map((col: any) => col.key)
          .filter((key) => !hideableColumns.includes(key)) // Exclude always visible columns
  );

  /* Syncs the visible columns when selectedColumnKeys or hideableColumns change.
   * Avoid unnecessary updates by using JSON.stringify for deep comparison. */
  useEffect(() => {
    setVisibleColumns(
      initialColumns.filter(
        (col: any) =>
          selectedColumnKeys.includes(col.key) ||
          hideableColumns.includes(col.key) // Include always visible columns
      )
    );
  }, [selectedColumnKeys, setVisibleColumns]);

  /*  handleColumnChange:
   * - Manages changes to the selected columns when checkboxes are toggled.
   * - Updates the state with the selected columns.
   * - Triggers the `setVisibleColumns` function to filter and set the visible columns
   *   in the parent component.
   * - checkedValues: The list of currently selected column keys. */
  const handleColumnChange = (checkedValues: string[]) =>
    setSelectedColumnKeys(checkedValues);

  /* Creates a memoized list of dropdown items (checkboxes) for the column selector.
   * - Each item represents a column, where the checkbox is checked if the column
   *   is currently selected.
   * - The memoization ensures that the items are only recalculated if the `initialColumns`
   *   or `selectedColumnKeys` change, improving performance. */
  const items = useMemo<MenuProps["items"]>(() => {
    return initialColumns
      .filter((col: any) => !hideableColumns.includes(col.key)) // Exclude always visible columns from the dropdown
      .map((col: any) => ({
        label: (
          <Checkbox
            checked={selectedColumnKeys.includes(col.key)}
            onChange={(e: any) => {
              handleColumnChange(
                e.target.checked
                  ? [...selectedColumnKeys, col.key]
                  : selectedColumnKeys.filter((key) => key !== col.key)
              );
            }}
          >
            {col.title}
          </Checkbox>
        ),
        key: col.key,
      }));

    // return tempItems.filter((item: any) => !hideableColumns.includes(item.key));
  }, [initialColumns, selectedColumnKeys, hideableColumns]);

  return (
    /* - Tooltip: Displays a tooltip on hover, indicating the action to "Edit columns".
     * - Dropdown: Contains the list of checkboxes for selecting columns, which opens on click.
     * - Checkbox: Displays a checkbox for each column, checked if the column is currently visible. */
    <Tooltip title={t("edit_columns")}>
      <Dropdown
        className="cls-custom-table-column"
        menu={{ items }}
        trigger={["click"]}
        open={open}
        onOpenChange={handleOpenChange}
      >
        <MenuOutlined />
      </Dropdown>
    </Tooltip>
  );
};
export default CustomTableColumn;
