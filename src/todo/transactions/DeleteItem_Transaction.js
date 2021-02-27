'use strict'

import { jsTPS_Transaction } from "../../common/jsTPS.js"

export default class DeleteItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, listItem) {
        super();
        this.model = initModel;
        this.listItem = listItem;
    }

    doTransaction() {
        this.item = this.model.removeItem(this.listItem);
    }

    undoTransaction(){
        this.model.addItemToList(this.item);
    }
}