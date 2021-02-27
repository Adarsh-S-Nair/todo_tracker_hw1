'use strict'

import { jsTPS_Transaction } from "../../common/jsTPS.js"

export default class ChangeDate_Transaction extends jsTPS_Transaction {
    constructor(initModel, listItem, date) {
        super();
        this.model = initModel;
        this.listItem = listItem;
        this.date = date;
    }

    doTransaction() {
        this.oldDate = this.model.editDate(this.listItem, this.date);
    }

    undoTransaction(){
        this.model.editDate(this.listItem, this.oldDate);
    }
}