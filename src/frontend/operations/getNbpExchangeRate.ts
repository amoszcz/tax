import {getDateDayBefore} from "./date";

interface NbpResponse {
    "table": string,
    "currency": string,
    "code": string,
    "rates": [{ "no": string, "effectiveDate": string, "mid": number }]
}

export const getNbpExchangeRate = (date: Date) => {
    return new Promise<{rate:number,date:string}>((resolve, reject) => {
        fetchNbpExchangeRate(date)
            .then(result => resolve(result))
            .catch(() =>
                fetchNbpExchangeRate(getDateDayBefore(date))
                    .then(result => resolve(result)).catch(() =>
                    fetchNbpExchangeRate(getDateDayBefore(getDateDayBefore(date)))
                        .then(result => resolve(result)).catch(reject)));
    });
}
const fetchNbpExchangeRate = async (date: Date) => {
    let response1 = await fetch(`http://api.nbp.pl/api/exchangerates/rates/a/usd/${toNbpDate(date)}/`);
    let response2: any = await response1.json() as NbpResponse;
    return {
        rate: response2.rates[0].mid,
        date: response2.rates[0].effectiveDate
    };
}


function toNbpDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}