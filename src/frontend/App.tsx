import "./App.css";
import { ClosedPositionsTable } from "./components/ClosedPositionsTable/ClosedPositionsTable";
import { Tab, Tabs } from "./components/Tabs/Tabs";
import { DividendsTable } from "./components/DividendsTable/DividendsTable";
import { AccountActivityTable } from "./components/ACcountActivityTable/AccountActivityTable";
import { useEtoroData } from "./operations/useEtoroData";
import { useReadExcelFile } from "./operations/useReadExcelFile";

function App() {
  const { selectAndReadFile, file } = useReadExcelFile();

  const { loadFile, dividends, closedPositions, accountActivities, errors } =
    useEtoroData();
  const handleFileSelect = async () => {
    // Use window.backend API (needs to be defined in preload.js)
    const fileBuffer = await selectAndReadFile();
    if (fileBuffer) loadFile(fileBuffer);
  };

  return (
    <div className="App">
      <button onClick={handleFileSelect}>Select Excel File</button>
      {file && <p>Selected file: {file}</p>}
      {errors && (
        <div>
          <h2>Errors</h2>
          {errors}
        </div>
      )}
      <Tabs defaultTab={0}>
        {closedPositions.length > 0 ? (
          <Tab label="Closed Positions">
            <ClosedPositionsTable positions={closedPositions} />
          </Tab>
        ) : null}
        {dividends.length > 0 ? (
          <Tab label="Dividends">
            <DividendsTable dividends={dividends} />
          </Tab>
        ) : null}
        {accountActivities.length > 0 ? (
          <Tab label="Account Activity">
            <AccountActivityTable activities={accountActivities} />
          </Tab>
        ) : null}
      </Tabs>
    </div>
  );
}

export default App;
