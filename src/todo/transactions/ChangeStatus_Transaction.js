'use strict'

import { jsTPS_Transaction } from "../../common/jsTPS.js"

export default class ChangeStatus_Transaction extends jsTPS_Transaction {
    constructor(initModel, listItem, status) {
        super();
        this.model = initModel;
        this.listItem = listItem;
        this.status = status;
    }

    doTransaction() {
        this.oldStatus = this.model.editStatus(this.listItem, this.status);
    }

    undoTransaction(){
        this.model.editStatus(this.listItem, this.oldStatus);
    }
}