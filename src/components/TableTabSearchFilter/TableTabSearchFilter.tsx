import { Input } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@/hooks/Debounce.hook";
import { resetAppliedFilter } from "@/stores/General.store";
import { useDispatch } from "react-redux";

/**
 * Props interface for the TableTabSearchFilter component.
 */
interface TableTabSearchFilterType {
  data: any[];
  tabDataKey: string;
  currentTab: string;
  searchFields: string[];
  tableDataPreparationHandler: any;
  setTableData: any;
  placeholder?: string;
}

/**
 * TableTabSearchFilter component filters and searches through data based on user input.
 * It dynamically updates the displayed table data based on tab selection and search input.
 * @param data Array of data to be filtered and searched
 * @param tabDataKey This key is used to validate on tab change from the data.(data[tabDataKey])
 * @param currentTab Currently selected tab
 * @param searchFields Array of fields to be searched within the data
 * @param tableDataPreparationHandler Function to prepare table data for rendering
 * @param setTableData Function to set the table data
 * @returns An Input component for searching data
 */
const TableTabSearchFilter: React.FC<TableTabSearchFilterType> = ({
  data,
  tabDataKey,
  currentTab,
  searchFields,
  tableDataPreparationHandler,
  setTableData,
  placeholder,
}) => {
  const { t } = useTranslation();
  const [searchData, setSearchData] = useState<string>("");
  const [filteredTabData, setFilteredTabData] = useState<any>([]);
  const [filteredSearchData, setFilteredSearchData] = useState<any>([]);
  const debounce = useDebounce();

  /* Update filteredTabData based on tab change */
  useEffect(() => {
    data?.length &&
      setFilteredTabData(
        data?.filter((datum: any) =>
          currentTab === "all" ? true : datum[tabDataKey] == currentTab
        )
      );
  }, [currentTab, data]);

  /* Update filteredSearchData based on searchData change */
  useEffect(() => {
    setFilteredSearchData(
      filteredTabData?.filter((tableData: any) =>
        searchFields.some((key) =>
          tableData[key]?.toLowerCase().includes(searchData.toLowerCase())
        )
      )
    );
    // eslint-disable-next-line
  }, [searchData, filteredTabData]);

  /* Set the table data whenever filteredTabData or filteredSearchData changes, respectively, by calling tableDataPreparationHandler on each item. */
  useEffect(() => {
    setTableData(filteredTabData?.map(tableDataPreparationHandler));
    // eslint-disable-next-line
  }, [filteredTabData]);

  useEffect(() => {
    setTableData(filteredSearchData?.map(tableDataPreparationHandler));
    // eslint-disable-next-line
  }, [filteredSearchData]);

  const dispatch = useDispatch()

  /* Search handler */
  const onSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(resetAppliedFilter({}))
    debounce(setSearchData(e.target.value));
  };

  return (
    <Input
      placeholder={placeholder ? placeholder : t("search")}
      allowClear
      onChange={onSearch}
    />
  );
};

export default TableTabSearchFilter;
