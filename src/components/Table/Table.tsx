import { Table, TableProps as AntdTableProps } from "antd";
import { DefaultRecordType } from "rc-table/lib/interface";
import type { TableLocale } from "antd/lib/table/interface";
import "./Table.scss";
import { FdNoDataFound } from "../Icons/Icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Loader } from "../Loader/Loader";

type TablePagination<T extends object> = NonNullable<
  Exclude<AntdTableProps<T>["pagination"], boolean>
>;
type TablePaginationPosition = NonNullable<
  TablePagination<any>["position"]
>[number];
type selectionType = "checkbox" | "radio";
type SizeType = AntdTableProps<DefaultRecordType>["size"];
type TableLayoutType = undefined | "fixed";

/**
 * Props interface for the TableDisplay component.
 */
interface TablePropsType<RecordType = any> {
  data: any;
  columns: AntdTableProps<DefaultRecordType>["columns"];
  pagination?: {
    position?: TablePaginationPosition /* topLeft | topCenter | topRight | none | bottomLeft | bottomCenter | bottomRight */;
    pageSize?: number;
    totalCount?: number;
  };
  selection?: {
    type: selectionType;
    handler: (
      selectedRowKeys: any
    ) => void /* pass state method to get the selected rows in the parent component */;
  };
  size?: SizeType /* large | middle | small */;
  layout?: TableLayoutType;
  scroll?: AntdTableProps<DefaultRecordType>["scroll"] & {
    /* {y : 100} scroll y-axis */ scrollToFirstRowOnChange?: boolean;
  };
  loading?: Boolean;
  width?: number | string;
  footer?: any;
  border?: boolean;
  fetchNextPaginationData?: (pageNumber: string | number) => void; // Function to fetch data from the API
  isBackendPagination?: boolean; // Toggle backend or frontend pagination
}

/**
 * TableDisplay component renders an Ant Design Table with flexible configuration options.
 * It supports pagination, row selection, size customization, layout customization, and scrolling.
 * @param data The data to be displayed in the table.
 * @param columns The columns configuration of the table.
 * @param pagination Configuration for pagination.
 * @param selection Configuration for row selection.
 * @param size Size of the table.
 * @param layout Layout of the table.
 * @param scroll Configuration for table scrolling.
 * @param loading Loading state.
 * @param fetchNextPaginationData Function to fetch data from the API.
 * @param isBackendPagination Toggle backend or frontend pagination.
 * @returns An Ant Design Table component with flexible configuration options.
 */
const TableDisplay: React.FC<TablePropsType> = ({
  data,
  columns,
  pagination,
  selection,
  size,
  layout,
  scroll,
  loading,
  footer,
  border,
  fetchNextPaginationData,
  isBackendPagination = false, // Default to frontend pagination
  width,
}: TablePropsType) => {
  const { t } = useTranslation();

  const [currentData, setCurrentData] = useState<any[]>([]);
  const [paginationInfo, setPaginationInfo] = useState({
    next: null,
    previous: null,
    total: pagination?.totalCount,
    pageSize: pagination?.pageSize || 10,
    currentPage: 1,
  });

  /* Setup hook to set the update state when data changes */
  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  /* Handler function for row selection change */
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      selection && selection.handler(selectedRows);
    },
  };

  const customLocale: TableLocale = {
    emptyText: (
      <div style={{ textAlign: "center" }} className="my-6">
        <FdNoDataFound />
        <div className="mt-2 fs-16 f-med">{t("no_data_found")}</div>
      </div>
    ),
  };

  /* Update current page value to pagination on page change */
  const handleTableChange = (pagination: any) => {
    if (isBackendPagination && fetchNextPaginationData) {
      setPaginationInfo((prev) => ({
        ...prev,
        currentPage: pagination.current,
      }));

      fetchNextPaginationData(pagination.current);
    }
  };

  return (
    <Table
      dataSource={currentData}
      columns={columns}
      className="cls-table-display"
      pagination={{
        hideOnSinglePage: true,
        position: [pagination?.position ?? "none"],
        ...(isBackendPagination
          ? {
              current: paginationInfo.currentPage,
              total: pagination?.totalCount,
              pageSize: paginationInfo.pageSize,
            }
          : {
              pageSize: pagination?.pageSize ?? 10,
            }),
      }}
      onChange={handleTableChange}
      rowSelection={
        selection
          ? {
              type: selection.type,
              ...rowSelection,
            }
          : undefined
      }
      size={size ?? "middle"}
      tableLayout={layout ? layout : undefined}
      scroll={scroll || { x: 1000 }}
      locale={customLocale}
      loading={
        typeof loading == "boolean"
          ? { spinning: loading, indicator: <Loader fallback={true} /> }
          : false
      }
      style={{ width: width ? width : "auto" }}
      bordered={border ? border : false}
      footer={footer ? footer : undefined}
    />
  );
};

export default TableDisplay;
