'use strict'

/**
 * ToDoController
 * 
 * This class serves as the event traffic manager, routing all
 * event handling responses.
 */
export default class ToDoController {    
    constructor() {}

    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;

        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list").onclick = function() {
            appModel.addNewListSelected();
        }
        document.getElementById("undo").onclick = function() {
            appModel.undo();
        }
        document.getElementById("redo").onclick = function() {
            appModel.redo();
        }
        document.getElementById("delete-list-button").onclick = function() {
            appModel.deleteListConfirmation();
        }
        document.getElementById("add-item-button").onclick = function() {
            appModel.addNewItemTransaction();
        }
        document.getElementById("close-list-button").onclick = function() {
            appModel.closeList();
        }
    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        this.model.loadList(listId);
    }

    addNewList() {
        this.model.addNewList();
    }

    addNewListSelected() {
        this.model.addNewListSelected();
    }

    changeName(name) {
        this.model.renameTransaction(name);
    }

    changeTask(listItem, task) {
        this.model.changeTaskTransaction(listItem, task);
    }

    changeDate(listItem, date) {
        this.model.changeDateTransaction(listItem, date);
    }

    changeStatus(listItem, status) {
        this.model.changeStatusTransaction(listItem, status);
    }

    moveItemUp(listItem) {
        this.model.moveItemUpTransaction(listItem);
    }

    moveItemDown(listItem) {
        this.model.moveItemDownTransaction(listItem);
    }

    deleteItem(listItem) {
        this.model.deleteItemTransaction(listItem);
    }

    removeCurrentList() {
        this.model.removeCurrentList();
    }
}