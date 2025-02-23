import {useState} from "react";
declare global {
    interface Window {
        backend: {
            readFile: (filePath: string) => Promise<Buffer>;
            openFile: () => Promise<{ filePath: string }>;
        }
    }
}
export const useReadExcelFile = () => {
    const [file, setFile] = useState<string>('');
    const selectAndReadFile = async  ()=>{
        const result = await window.backend.openFile();
        if (result.filePath) {
            setFile(result.filePath);
            return  await window.backend.readFile(result.filePath);
            
        }
    }
    return {
        selectAndReadFile,
        file
    }
}
