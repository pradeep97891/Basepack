import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

/**
 * Custom hook for downloading data as an XLSX file.
 * @returns An object containing functions and state variables related to XLSX download functionality.
 */
const useXLSXDownload = () => {
  const [sheetData, setSheetData] = useState<any[][]>([]);
  const [sheetName, setSheetName] = useState<string>("sample");
  const [downloadRequested, setDownloadRequested] = useState<boolean>(false);

  useEffect(() => {
    if (!downloadRequested) return;

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate the XLSX file
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Convert to a Blob
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sheetName}.xlsx`;
    document.body.appendChild(a);
    a.click();
    // Deferred execution
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setDownloadRequested(false);
    }, 0);

    // Cleanup function
    return () => {
      // Check if the element still exists in the DOM before removing it
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
      window.URL.revokeObjectURL(url);
      setDownloadRequested(false);
    };
  }, [downloadRequested, sheetData, sheetName]);

  /**
   * Function to initiate the XLSX download process.
   */
  const downloadHandler = () => {
    // Set flag to initiate download
    setDownloadRequested(true);
  };

  return { setSheetData, setSheetName, downloadHandler, sheetData, sheetName };
};

export default useXLSXDownload;
