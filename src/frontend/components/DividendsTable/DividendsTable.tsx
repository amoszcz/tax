import {type Dividend} from "../../eToroExcel.types";
import {useEffect, useState} from "react";
import {getNbpExchangeRate} from "../../operations/getNbpExchangeRate";
import {getDateDayBefore, toDate} from "../../operations/date";


interface DividendForTable extends Dividend {
    NbpExchangeRate: number | null;
    NbpExchangeRateDate: string | null;
    "Net Dividend Received (PLN)": number,
    "Withholding Tax Amount (PLN)": number,
}
interface ExchangeRate {
    positionId: string;
    midExchangeRate: number | null;
    midExchangeDate: string | null;
}


function toDividendForTable (dividend: Dividend, exchangeRates: ExchangeRate[]): DividendForTable {
    const exchangeRate = exchangeRates.find(p => p.positionId === dividend["Position ID"]) ?? null;
    return {
        ...dividend,
        NbpExchangeRate: exchangeRate?.midExchangeRate ?? null,
        NbpExchangeRateDate: exchangeRate?.midExchangeDate ?? null,
        "Net Dividend Received (PLN)": exchangeRate?.midExchangeRate ? dividend["Net Dividend Received (USD)"] * exchangeRate.midExchangeRate : 0,
        "Withholding Tax Amount (PLN)": exchangeRate?.midExchangeRate ? dividend["Withholding Tax Amount (USD)"] * exchangeRate.midExchangeRate : 0
    }
}

export const DividendsTable = (props: { dividends: Array<Dividend> }) => {
    const {dividends} = props;
    const [exchangeRates,setExchangeRates] = useState<ExchangeRate[]>([]);
    const [dividendForTable, setDividendForTable] = useState<DividendForTable[]>(dividends.map(dividend => toDividendForTable(dividend, exchangeRates)));
    useEffect(() => {
        setDividendForTable(dividends.map(p => toDividendForTable(p, exchangeRates)));
    }, [exchangeRates, dividends])
    function handleGetExchangeRates() {
        
        dividends.forEach(async (dividend) => {
           const date = toDate(dividend["Date of Payment"]);
           const dayBefore = getDateDayBefore(date);
           debugger;
           //todo: fix this date calculation for 2023 file
            getNbpExchangeRate(dayBefore).then((rate) => setExchangeRates(prevState => {
              
                return [...prevState.filter(p => p.positionId !== dividend["Position ID"]), {
                    positionId: dividend["Position ID"],
                    midExchangeRate:rate.rate,
                    midExchangeDate:rate.date,
                   
                }]
            }));
        });
    }

    return <div>
        <h2>Dividends</h2>
        <button onClick={handleGetExchangeRates}>Get Nbp exchange rates</button>
        <div className="table">
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Position ID</th>
                    <th>Date of Payment</th>
                    <th>Instrument Name</th>
                    <th> Dividend  (USD)</th>
                    <th>Withholding Tax Rate (%)</th>
                    <th> Tax  (USD)</th>
                    <th>Type</th>
                    <th>ISIN</th>
                    <th>NbpExchangeRate</th>
                    <th>NbpExchangeRateDate</th>
                    <th> Dividend  (PLN)</th>
                    <th> Tax  (PLN)</th>
                </tr>
                </thead>
                <tbody>
                {dividendForTable.map((dividend, index) => {
                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{dividend["Position ID"]}</td>
                        <td>{dividend["Date of Payment"]}</td>
                        <td>{dividend["Instrument Name"]}</td>
                        <td>{dividend["Net Dividend Received (USD)"]}</td>
                        <td>{dividend["Withholding Tax Rate (%)"]}</td>
                        <td>{dividend["Withholding Tax Amount (USD)"]}</td>
                        <td>{dividend["Type"]}</td>
                        <td>{dividend["ISIN"]}</td>
                        <td>{dividend["NbpExchangeRate"]}</td>
                        <td>{dividend["NbpExchangeRateDate"]}</td>
                        <td>{dividend["Net Dividend Received (PLN)"]}</td>
                        <td>{dividend["Withholding Tax Amount (PLN)"]}</td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    </div>
}