import {AccountActivity, type Dividend} from "../../eToroExcel.types";

export const AccountActivityTable = (props: { activities: Array<AccountActivity> }) => {
    const {activities} = props;

    return <div>
        <h2>Account Activity</h2>
        <div className="table">
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Position ID</th>
                    <th>Amount</th>
                    <th>NWA</th>
                    <th>Balance</th>
                    <th>Units</th>
                    <th>Realized Equity Change</th>
                    <th>Realized Equity</th>
                    <th>Details</th>
                    <th>Asset type</th>
                </tr>
                </thead>
                <tbody>
                {activities.map((activity, index) => {
                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{activity["Date"]}</td>
                        <td>{activity["Type"]}</td>
                        <td>{activity["Position ID"]}</td>
                        <td>{activity["Amount"]}</td>
                        <td>{activity["NWA"]}</td>
                        <td>{activity["Balance"]}</td>
                        <td>{activity["Units"]}</td>
                        <td>{activity["Realized Equity Change"]}</td>
                        <td>{activity["Realized Equity"]}</td>
                        <td>{activity["Details"]}</td>
                        <td>{activity["Asset type"]}</td>
                      
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    </div>
}