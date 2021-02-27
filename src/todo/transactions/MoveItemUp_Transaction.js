'use strict'

import { jsTPS_Transaction } from "../../common/jsTPS.js"

export default class MoveItemUp_Transaction extends jsTPS_Transaction {
    constructor(initModel, listItem) {
        super();
        this.model = initModel;
        this.listItem = listItem;
    }

    doTransaction() {
        this.model.moveItemUp(this.listItem);
    }

    undoTransaction(){
        this.model.moveItemDown(this.listItem);
    }
}