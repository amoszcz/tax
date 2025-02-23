import {useState} from "react";
import "./App.css";
import {ClosedPositionsTable} from "./components/ClosedPositionsTable/ClosedPositionsTable";
import {Tab, Tabs} from "./components/Tabs/Tabs";
import {DividendsTable} from "./components/DividendsTable/DividendsTable";
import {AccountActivityTable} from "./components/ACcountActivityTable/AccountActivityTable";
import {useEtoroData} from "./operations/useEtoroData";

declare global {
    interface Window {
        backend: {
            readFile: (filePath: string) => Promise<Buffer>;
            openFile: () => Promise<{ filePath: string }>;
        }
    }
}


function App() {
    const [file, setFile] = useState<string>('');


    const {loadFile, dividends, closedPositions, accountActivities, errors} = useEtoroData();
    const handleFileSelect = async () => {

        // Use window.backend API (needs to be defined in preload.js)
        const result = await window.backend.openFile();
        if (result.filePath) {
            setFile(result.filePath);
            const fileBuffer = await window.backend.readFile(result.filePath);
            loadFile(fileBuffer);
        }
    };

    return (
        <div className="App">
            <button onClick={handleFileSelect}>Select Excel File</button>
            {file && <p>Selected file: {file}</p>}
            {errors && <div><h2>Errors</h2>{errors}</div>}
            <Tabs defaultTab={0}>
                {closedPositions.length > 0 ? (
                    <Tab label="Closed Positions">
                        <ClosedPositionsTable positions={closedPositions}/>
                    </Tab>
                ) : null}
                {dividends.length > 0 ? (
                    <Tab label="Dividends">
                        <DividendsTable dividends={dividends}/>
                    </Tab>
                ) : null}
                {accountActivities.length > 0 ? (
                    <Tab label="Account Activity">
                        <AccountActivityTable activities={accountActivities}/>
                    </Tab>
                ) : null}
            </Tabs>
        </div>
    );
}

export default App;