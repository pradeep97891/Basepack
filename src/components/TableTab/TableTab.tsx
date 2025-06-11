import { Button, Dropdown, Menu, Radio, RadioChangeEvent } from "antd";
import "./TableTab.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEventListener } from "@/hooks/EventListener.hook";

/**
 * Props interface for the TableTab component.
 */
interface TableTabInterface {
  options: any[];
  changeHandler: (value: string) => void;
  currentTab: string;
}

/**
 * TableTab component renders a radio group for tab selection.
 * It allows users to switch between different tabs.
 * @param options An array of options for the radio group.
 * @param changeHandler Function to handle tab change.
 * @param currentTab The currently selected tab.
 * @returns A radio group component for tab selection.
 */
const TableTab: React.FC<TableTabInterface> = ({
  options,
  changeHandler,
  currentTab,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const radioGroupRef = useRef<HTMLDivElement>(null);
  const [hiddenOptions, setHiddenOptions] = useState<any[]>([]);

  /* Find invisible elements to focus on clicking the tab from the dropdown */
  const checkVisibility = useCallback(() => {
    if (!options?.length) return;
    const parentEl = radioGroupRef.current;
    const childEls = radioGroupRef.current?.querySelectorAll(
      ".ant-radio-button-wrapper"
    );

    if (parentEl && childEls) {
      const parentRect = parentEl.getBoundingClientRect();
      const newHiddenOptions: any[] = [];

      childEls.forEach((childEl, index) => {
        const childRect = childEl.getBoundingClientRect();
        if (
          childRect.right > parentRect.right ||
          childRect.left < parentRect.left
        ) {
          newHiddenOptions.push(options[index]);
        }
      });

      setHiddenOptions(newHiddenOptions);
    }
  }, [options]);

  // Listen for window resize events to add invisible options in the dropdown
  useEventListener("resize", checkVisibility);

  // Listen for radio container scroll events to update invisible options in the dropdown
  useEventListener(
    "scroll",
    checkVisibility,
    radioGroupRef.current as HTMLElement
  );

  /* Effect hook for initial visibility check */
  useEffect(() => {
    checkVisibility(); // eslint-disable-next-line
  }, [options]);

  /**
   * Handler function for tab change event.
   * It calls the changeHandler function with the selected tab value.
   * @param event The change event triggered by the radio group.
   */
  const onChange = ({ target: { value } }: RadioChangeEvent) =>
    changeHandler(value);

  /**
   * Scroll the selected element into view
   * @param value The value of the selected element
   */
  const scrollToElement = (index: number) => {
    const childEls = radioGroupRef.current?.querySelectorAll(
      ".ant-radio-button-wrapper"
    );

    childEls?.length &&
      childEls[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
  };

  /**
   * Render the dropdown menu items
   */
  const menu = (
    <Menu
      onClick={({ key }) => {
        changeHandler(key);
        scrollToElement(
          options.indexOf(options.find((option) => option.value === key))
        );
      }}
    >
      {hiddenOptions.map((option) => (
        <Menu.Item key={option.value}>{option.label}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div ref={containerRef} className="cls-table-tab-container">
      <Radio.Group
        ref={radioGroupRef}
        className={`ml-3 cls-radio-tab`}
        options={options}
        onChange={onChange}
        value={currentTab}
        defaultValue={currentTab}
        optionType="button"
      />
      {!!hiddenOptions.length && (
        <Dropdown overlay={menu} trigger={["hover"]} className="cls-dropdown">
          <Button type="link" className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            <span>...</span>
          </Button>
        </Dropdown>
      )}
    </div>
  );
};

export default TableTab;
