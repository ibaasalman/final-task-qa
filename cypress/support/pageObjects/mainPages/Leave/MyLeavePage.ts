import table from "../../objects/table";

export default class MyLeavePage{
    private myLeavePageTable: table = new table();

    createTable = () => {
        this.myLeavePageTable.create(['Date', 'Employee Name', 'Leave Type','Leave Balance (Days)', 'Number of Days','Status', 'Comments']);
        return this.myLeavePageTable;
    }


}