import { 
  render, 
  screen, 
  // fireEvent, 
  // waitFor 
} from "@testing-library/react";
import XLSXUploader from "./XLSXUploader";
// import { message } from "antd";
// import * as XLSX from "xlsx";
// import { RcFile } from "antd/lib/upload/interface";

// Mock necessary dependencies
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("xlsx", () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn(),
  },
}));

describe("XLSXUploader", () => {
  const mockSetUploadedData = jest.fn();
  const mockNullifyOnDeleteHandler = jest.fn();
  const mockUploadProps = {};

  const renderComponent = () => {
    return render(
      <XLSXUploader
        uploadProps={mockUploadProps}
        setUploadedData={mockSetUploadedData}
        nullifyOnDeleteHandler={mockNullifyOnDeleteHandler}
      />
    );
  };

  jest.mock("antd", () => {
    const actualAntd = jest.requireActual("antd");
    return {
      ...actualAntd,
      message: {
        ...actualAntd.message,
        useMessage: jest.fn().mockReturnValue([jest.fn()]), // Mock message API
      },
    };
  });
  

  // const createFile = (name: string, type: string, size: number): RcFile => {
  //   const file = new File(["content"], name, { type }) as RcFile;
  //   Object.defineProperty(file, "size", { value: size });
  //   return file;
  // };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the upload component", () => {
    renderComponent();
    expect(screen.getByText("click_drag_file")).toBeInTheDocument();
    expect(screen.getByText("supported_file")).toBeInTheDocument();
  });

  // it("validates file size and rejects files larger than 2MB", async () => {
  //   renderComponent();
  //   const largeFile = createFile(
  //     "large.xlsx",
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     3 * 1024 * 1024 // 3MB file
  //   );

  //   fireEvent.change(screen.getByText("click_drag_file"), {
  //     target: { files: [largeFile] },
  //   });

  //   await waitFor(() => {
  //     expect(message.useMessage()[0]).toHaveBeenCalledWith("file_too_large");
  //   });
  //   expect(mockNullifyOnDeleteHandler).toHaveBeenCalledWith([]);
  // });

  // it("accepts a valid XLSX file and reads the content", async () => {
  //   const validFile = createFile(
  //     "file.xlsx",
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     1 * 1024 * 1024 // 1MB file
  //   );
  
  //   const mockWorkbook = {
  //     SheetNames: ["Sheet1"],
  //     Sheets: { Sheet1: "sheetContent" },
  //   };
  //   (XLSX.read as jest.Mock).mockReturnValue(mockWorkbook);
  //   (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue([
  //     ["header1", "header2"],
  //     ["data1", "data2"],
  //   ]);
  
  //   const mockFileReader = {
  //     readAsBinaryString: jest.fn(),
  //     onload: jest.fn(), // Create a spy for onload
  //     result: "binaryString",
  //   };
  
  //   jest.spyOn(window, "FileReader").mockImplementation(() => mockFileReader as any);
  
  //   renderComponent();
  
  //   // Trigger file upload event
  //   fireEvent.change(screen.getByText("click_drag_file"), {
  //     target: { files: [validFile] },
  //   });
  
  //   // Manually trigger the FileReader's onload event
  //   mockFileReader.onload({
  //     target: { result: "binaryString" },
  //   });
  
  //   await waitFor(() => {
  //     expect(XLSX.read).toHaveBeenCalledWith("binaryString", { type: "binary" });
  //     expect(XLSX.utils.sheet_to_json).toHaveBeenCalledWith("sheetContent", {
  //       header: 1,
  //     });
  //     expect(mockSetUploadedData).toHaveBeenCalledWith([
  //       ["header1", "header2"],
  //       ["data1", "data2"],
  //     ]);
  //   });
  // });

  // it("handles FileReader error gracefully", async () => {
  //   const validFile = createFile(
  //     "file.xlsx",
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     1 * 1024 * 1024
  //   );
  
  //   const mockFileReader = {
  //     readAsBinaryString: jest.fn(),
  //     onload: null,
  //     onerror: jest.fn(), // Spy for onerror
  //     error: new Error("Error reading file"),
  //   };
  
  //   jest.spyOn(window, "FileReader").mockImplementation(() => mockFileReader as any);
  
  //   const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
  
  //   renderComponent();
  
  //   fireEvent.change(screen.getByText("click_drag_file"), {
  //     target: { files: [validFile] },
  //   });
  
  //   // Trigger the FileReader's error event
  //   mockFileReader.onerror({
  //     target: mockFileReader,
  //   });
  
  //   await waitFor(() => {
  //     expect(consoleErrorMock).toHaveBeenCalledWith(
  //       "Error reading file:",
  //       mockFileReader.error
  //     );
  //   });
  
  //   consoleErrorMock.mockRestore();
  // });

});
