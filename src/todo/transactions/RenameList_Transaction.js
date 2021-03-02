'use strict'

import { jsTPS_Transaction } from "../../common/jsTPS.js"

export default class RenameList_Transaction extends jsTPS_Transaction {
    constructor(initModel, name) {
        super();
        this.model = initModel;
        this.name = name;
    }

    doTransaction() {
        this.oldName = this.model.renameList(this.name);
    }

    undoTransaction(){
        this.model.renameList(this.oldName);
    }
}