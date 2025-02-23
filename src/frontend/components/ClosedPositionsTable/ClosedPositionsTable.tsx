import {ClosedPosition} from "../../eToroExcel.types";
import './ClosedPositionsTable.css';
import {useEffect, useState} from "react";
import {getNbpExchangeRate} from "../../operations/getNbpExchangeRate";
import {toDate} from "../../operations/date";

interface ExchangeRate {
    positionId: string;
    closeMidExchangeRate: number | null;
    closeMidExchangeDate: string | null;
    openMidExchangeRate: number | null;
    openMidExchangeDate: string | null;
}

interface ClosedPositionTableElement extends ClosedPosition {
    ValueOpen: number;
    ValueClose: number;
    ValueOpenPLN: number | null;
    ValueClosePLN: number | null;
    CloseExchangeRate: number | null;
    OpenExchangeRate: number | null;
    CloseExchangeRateDate: string | null;
    OpenExchangeRateDate: string | null;
    "Profit (PLN)": number | null;
}



const toClosedPositionTableElement = (position: ClosedPosition, exchangeRates: ExchangeRate[]): ClosedPositionTableElement => {

    const closeExchangeRate = exchangeRates.find(p => p.positionId === position["Position ID"]) ?? null;
    const openExchangeRate = exchangeRates.find(p => p.positionId === position["Position ID"]) ?? null;
    const valueOpen = position["Open Rate"] * parseFloat(position["Units / Contracts"]);
    const valueClose = position["Close Rate"] * parseFloat(position["Units / Contracts"]);
    const valueOpenPLN = openExchangeRate?.openMidExchangeRate ? valueOpen * openExchangeRate.openMidExchangeRate : null;
    const valueClosePLN = closeExchangeRate?.closeMidExchangeRate ? valueClose * closeExchangeRate.closeMidExchangeRate : null;
    return {
        ...position,
        ValueOpen: valueOpen,
        ValueClose: valueClose,
        ValueClosePLN: valueClosePLN,
        ValueOpenPLN: valueOpenPLN,
        CloseExchangeRate: closeExchangeRate?.closeMidExchangeRate ?? null,
        OpenExchangeRate:openExchangeRate?.openMidExchangeRate ?? null,
        CloseExchangeRateDate:closeExchangeRate?.closeMidExchangeDate ?? null,
        OpenExchangeRateDate:openExchangeRate?.openMidExchangeDate ?? null,
        "Profit (PLN)": (!!valueClosePLN && !!valueOpenPLN) ? valueClosePLN - valueOpenPLN : null
    }
}







export const ClosedPositionsTable = (props: { positions: Array<ClosedPosition> }) => {
    const {positions} = props;
    // const positionsTableElements = positions.map(toClosedPositionTableElement);
    const [nbpExchangeRates, setNbpExchangeRates] = useState<ExchangeRate[]>(positions.map(p => ({
        positionId: p["Position ID"],
        closeMidExchangeRate: null,
        closeMidExchangeDate: null,
        openMidExchangeDate: null,
        openMidExchangeRate: null
    })));
    const [closedPositionsTableElements, setClosedPositionsTableElements] = useState<ClosedPositionTableElement[]>(positions.map(p => toClosedPositionTableElement(p, nbpExchangeRates)));
    useEffect(() => {
        setClosedPositionsTableElements(positions.map(p => toClosedPositionTableElement(p, nbpExchangeRates)));
    }, [nbpExchangeRates, positions])

    function handleGetExchangeRates() {
        positions.forEach((position) => {
            const closeDate = toDate(position["Close Date"]);
            const openDate = toDate(position["Open Date"]);
            getNbpExchangeRate(closeDate).then((rate) => setNbpExchangeRates(prevState => {
                const existingRate = prevState.find(p => p.positionId === position["Position ID"]);
                return [...prevState.filter(p => p.positionId !== position["Position ID"]), {
                    positionId: position["Position ID"],
                    closeMidExchangeRate:rate.rate,
                    closeMidExchangeDate:rate.date,
                    openMidExchangeRate:existingRate?.openMidExchangeRate ?? null,
                    openMidExchangeDate:existingRate?.openMidExchangeDate ?? null
                }]
            }));
            getNbpExchangeRate(openDate).then((rate) => setNbpExchangeRates(prevState => {
                const existingRate = prevState.find(p => p.positionId === position["Position ID"]);
                return [...prevState.filter(p => p.positionId !== position["Position ID"]), {
                    positionId: position["Position ID"],
                    closeMidExchangeRate:existingRate?.closeMidExchangeRate ?? null,
                    closeMidExchangeDate:existingRate?.closeMidExchangeDate ?? null,
                    openMidExchangeRate:rate.rate,
                    openMidExchangeDate:rate.date
                }]
            }));
        })

    }

    return <div>
        <h2>Closed Positions</h2>
        <button onClick={handleGetExchangeRates}>Get NBP exchange rates</button>
        <div className="table">
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Position ID</th>
                    <th>Action</th>
                    <th>Long / Short</th>
                    {/*<th>Amount</th>*/}
                    <th>Open Date</th>
                    <th>Close Date</th>
                    {/*<th>Leverage</th>*/}
                    {/*<th>Market Spread (USD)</th>*/}
                    {/*<th>FX rate at open (USD)</th>*/}
                    {/*<th>FX rate at close (USD)</th>*/}
                    {/*<th>Take profit rate</th>*/}
                    {/*<th>Stop loss rate</th>*/}
                    {/*<th>Copied From</th>*/}
                    <th>Units / Contracts</th>
                    <th>Open Rate</th>
                    <th>Close Rate</th>
                    {/*<th>ValueOpen</th>*/}
                    {/*<th>ValueClose</th>*/}
                    <th>Profit(USD)</th>
                    <th>OpenExchangeRate</th>
                    <th>OpenExchangeRateDate</th>
                    <th>CloseExchangeRate</th>
                    <th>CloseExchangeRateDate</th>
                    <th>Profit (PLN)</th>
                    {/*<th>Profit Calculated</th>*/}
                    {/*<th>Overnight Fees and Dividends</th>*/}
                    {/*<th>Spread Fees (USD)</th>*/}
                </tr>
                </thead>
                <tbody>
                {closedPositionsTableElements.map((position, index) => {
                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{position["Position ID"]}</td>
                        <td>{position["Action"]}</td>
                        <td>{position["Long / Short"]}</td>
                        {/*<td>{position["Amount"]}</td>*/}
                        <td>{position["Open Date"]}</td>
                        <td>{position["Close Date"]}</td>
                        {/*<td>{position["Leverage"]}</td>*/}
                        {/*<td>{position["Market Spread (USD)"]}</td>*/}
                        {/*<td>{position["FX rate at open (USD)"]}</td>*/}
                        {/*<td>{position["FX rate at close (USD)"]}</td>*/}
                        {/*<td>{position["Take profit rate"]}</td>*/}
                        {/*<td>{position["Stop loss rate"]}</td>*/}
                        {/*<td>{position["Copied From"]}</td>*/}
                        <td>{position["Units / Contracts"]}</td>
                        <td>{position["Open Rate"]}</td>
                        <td>{position["Close Rate"]}</td>
                        {/*<td>{position["ValueOpen"]}</td>*/}
                        {/*<td>{position["ValueClose"]}</td>*/}
                        <td>{position["Profit(USD)"]}</td>
                        <td>{position["OpenExchangeRate"]}</td>
                        <td>{position["OpenExchangeRateDate"]}</td>
                        <td>{position["CloseExchangeRate"]}</td>
                        <td>{position["CloseExchangeRateDate"]}</td>
                        <td>{position["Profit (PLN)"]}</td>
                        {/*<td>{position["ProfitCalculated"]}</td>*/}
                        {/*<td>{position["Overnight Fees and Dividends"]}</td>*/}
                        {/*<td>{position["Spread Fees (USD)"]}</td>*/}
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    </div>
}