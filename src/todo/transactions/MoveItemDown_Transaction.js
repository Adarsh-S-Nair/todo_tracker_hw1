'use strict'

import { jsTPS_Transaction } from "../../common/jsTPS.js"

export default class MoveItemDown_Transaction extends jsTPS_Transaction {
    constructor(initModel, listItem) {
        super();
        this.model = initModel;
        this.listItem = listItem;
    }

    doTransaction() {
        this.model.moveItemDown(this.listItem);
    }

    undoTransaction(){
        this.model.moveItemUp(this.listItem);
    }
}