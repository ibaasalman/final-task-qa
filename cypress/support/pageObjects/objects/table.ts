class table{
    private columns: Array<string> = new Array;

    //this functon work as constructor
    create(columns:Array<string>){
        this.columns = columns;
    }

    getNumOfRows(url: string){
        return cy.api({
            url: url,
            method: 'GET',
            body: {}
        }).its('body').its('meta').its('total');
    }

    //getting cell based on row number and column attribute
    getCell(row:number,attr:string){

        // get column cell index from columns array
        let index = this.columns.indexOf(attr);
        
        return cy.get(`div.oxd-table-body > div:nth-child(${row}) > div > div:nth-child(${index+2}) > div`)
    }


    //cheack if the cell with certain row and columng (attr) have the expected value
    checkValue(row: number, attr: string, expected: any){
        this.getCell(row, attr).should('contain.text', expected);
    }

}

export default table;