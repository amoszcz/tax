import { readExcelFile } from "./readExcelFile";
import { AccountActivity, ClosedPosition, Dividend } from "../eToroExcel.types";
import { useState } from "react";

export const useEtoroData = () => {
  const [closedPositions, setClosedPositions] = useState<ClosedPosition[]>([]);
  const [dividends, setDividends] = useState<Dividend[]>([]);
  const [accountActivities, setAccountActivities] = useState<AccountActivity[]>(
    [],
  );
  const [errors, setErrors] = useState<string>("");
  const loadFile = (fileBuffer: Buffer) => {
    try {
      const closedPositions = readExcelFile<ClosedPosition>(
        fileBuffer,
        "Closed Positions",
      );
      setClosedPositions(
        closedPositions.map((position) => ({
          ...position,
          "Units / Contracts":
            position["Units"] ?? position["Units / Contracts"],
        })),
      );
      setDividends(readExcelFile<Dividend>(fileBuffer, "Dividends"));
      const activity = readExcelFile<AccountActivity>(
        fileBuffer,
        "Account Activity",
      );

      setAccountActivities(activity);
    } catch (error) {
      setErrors(JSON.stringify(error));
    }
  };
  return { closedPositions, dividends, accountActivities, loadFile, errors };
};
