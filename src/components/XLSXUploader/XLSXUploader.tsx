import { Col, Row, Typography, Upload, UploadProps, message } from "antd";
import { RcFile } from "antd/lib/upload/interface";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import './XLSXUploader.scss'

const { Dragger } = Upload;
const { Text } = Typography;

/** Props interface for the XLSXUploader component */
interface XLSXUploaderProps {
  uploadProps: UploadProps<any>;
  setUploadedData: (data: any) => void;
  nullifyOnDeleteHandler: any;
}

/**
 * Component for uploading XLSX files.
 * @param uploadProps Upload properties.
 * @param setUploadedData Function to handle uploaded data.
 * @param nullifyOnDeleteHandler Function to nullify uploaded data on file delete.
 * @returns XLSXUploader component.
 */
const XLSXUploader: React.FC<XLSXUploaderProps> = ({
  uploadProps,
  setUploadedData,
  nullifyOnDeleteHandler,
}) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  const UPLOADING_FILE_TYPE = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']

  /**
   * Validates the uploaded file.
   * @param file The file to validate.
   * @returns Whether the file is valid or not.
   */
  const validateFile = (file: RcFile): boolean => {
    const isXLSX = UPLOADING_FILE_TYPE.includes(file.type)

    if (!isXLSX) {
      messageApi.error(t("invalid_file_type"));
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2; // Check if file is less than 2MB
    if (!isLt2M) {
      messageApi.error(t("file_too_large"));
      return false;
    }

    return true;
  };

  /**
   * Handles the upload of Excel file.
   * @param file The uploaded file.
   */
  const handleExcelUpload = (file: RcFile) => {

    // File type and size check 
    if (!validateFile(file)) {
      nullifyOnDeleteHandler([]);
      return;
    }

    // Use FileReader to read the file as binary string
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryString = event.target?.result;
      if (typeof binaryString === "string") {
        // Parse the binary string using XLSX library
        const workbook = XLSX.read(binaryString, { type: "binary" });

        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        // Convert worksheet to JSON object
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Use jsonData in your component
        setUploadedData(jsonData);
      }
    };

    reader.onerror = (event) => {
      console.error("Error reading file:", event.target?.error);
    };

    file instanceof Blob
      ? reader.readAsBinaryString(file)
      : nullifyOnDeleteHandler([]);
  };
  return (
    <Dragger
      {...uploadProps}
      beforeUpload={() => false}
      onChange={(info) => handleExcelUpload(info.file as RcFile)}
    >
      <Row className="py-4 px-2">
        <Col span={24}>
          <Text className="Infi-Fd_43_Upload cls-drag-icon"></Text>
        </Col>
        <Col span={24}>
          <Text className="cls-drag-file-text fs-16 f-med">
            {t("click_drag_file")}
          </Text>
        </Col>
        <Col span={24}>
          <Text className="cls-upload-hint text-center fs-12 f-med">
            {t("supported_file")}
          </Text>
        </Col>
      </Row>
      {/* Message API context */}
      {contextHolder}
    </Dragger>
  );
};

export default XLSXUploader;
