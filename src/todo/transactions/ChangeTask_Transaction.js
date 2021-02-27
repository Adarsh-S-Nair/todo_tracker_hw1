'use strict'

import { jsTPS_Transaction } from "../../common/jsTPS.js"

export default class ChangeTask_Transaction extends jsTPS_Transaction {
    constructor(initModel, listItem, task) {
        super();
        this.model = initModel;
        this.listItem = listItem;
        this.task = task;
    }

    doTransaction() {
        this.oldTask = this.model.editTask(this.listItem, this.task);
    }

    undoTransaction(){
        this.model.editTask(this.listItem, this.oldTask);
    }
}