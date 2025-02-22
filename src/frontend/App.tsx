import { useState } from "react";
import * as XLSX from 'xlsx';
import "./App.css";

declare global {
    interface Window {
        backend: {
            readFile: (filePath: string) => Promise<Buffer>;
            openFile: () => Promise<{ filePath: string }>;
        }
    }
}

export function readExcelFile(fileBuffer: Buffer, sheetName: string): Array<{ [key: string]: any }> {
  
    const workbook = XLSX.read(new Uint8Array(fileBuffer), { type: 'array' });

    if (!workbook.Sheets[sheetName]) {
        throw new Error(`Sheet '${sheetName}' not found in the Excel file.`);
    }

    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (jsonData.length === 0) {
        throw new Error(`Sheet '${sheetName}' is empty.`);
    }

    const headers = jsonData[0] as string[];
    return jsonData.slice(1).map(row => {
        const rowData: { [key: string]: any } = {};
        headers.forEach((header, index) => {
            rowData[header] = (row as any)[index] || null;
        });
        return rowData;
    });
   
}

function App() {
    const [file, setFile] = useState<string>('');
    const [data, setData] = useState<any[]>([]);
    const [info, setInfo] = useState<string>('');

    const handleFileSelect = async () => {
        try {
            // Use window.backend API (needs to be defined in preload.js)
            const result = await window.backend.openFile();
            if (result.filePath) {
                setFile(result.filePath);
                const fileBuffer =await window.backend.readFile(result.filePath);
                const data = readExcelFile(fileBuffer, 'Closed Positions');
                // setData(data);
                setInfo(JSON.stringify(data));
            }
        } catch (error) {
            setInfo(JSON.stringify(error));
        }
    };

    return (
        <div className="App">
            <button onClick={handleFileSelect}>Select Excel File</button>
            {file && <p>Selected file: {file}</p>}
            <div><h2>info</h2>{info}</div>
        </div>
    );
}

export default App;