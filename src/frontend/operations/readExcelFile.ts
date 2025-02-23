import * as XLSX from "xlsx";

export function readExcelFile<T>(
  fileBuffer: Buffer,
  sheetName: string,
): Array<T> {
  const workbook = XLSX.read(new Uint8Array(fileBuffer), { type: "array" });

  if (!workbook.Sheets[sheetName]) {
    throw new Error(`Sheet '${sheetName}' not found in the Excel file.`);
  }

  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  if (jsonData.length === 0) {
    throw new Error(`Sheet '${sheetName}' is empty.`);
  }

  const headers = jsonData[0] as string[];
  return jsonData.slice(1).map((row) => {
    const rowData: { [key: string]: any } = {};
    headers.forEach((header, index) => {
      rowData[header] = (row as any)[index] || null;
    });
    return rowData as T;
  });
}
