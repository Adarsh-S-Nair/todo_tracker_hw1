'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import ChangeTask_Transaction from './transactions/ChangeTask_Transaction.js'
import ChangeDate_Transaction from './transactions/ChangeDate_Transaction.js'
import ChangeStatus_Transaction from './transactions/ChangeStatus_Transaction.js'
import MoveItemUp_Transaction from './transactions/MoveItemUp_Transaction.js'
import MoveItemDown_Transaction from './transactions/MoveItemDown_Transaction.js'
import DeleteItem_Transaction from './transactions/DeleteItem_Transaction.js'

/**
 * ToDoModel
 * 
 * This class manages all the app data.
 */
export default class ToDoModel {
    constructor() {
        // THIS WILL STORE ALL OF OUR LISTS
        this.toDoLists = [];

        // THIS IS THE LIST CURRENTLY BEING EDITED
        this.currentList = null;

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST ITEM
        this.nextListItemId = 0;
    }

    /**
     * addItemToCurrentList
     * 
     * This function adds the itemToAdd argument to the current list being edited.
     * 
     * @param {*} itemToAdd A instantiated item to add to the list.
     */
    addItemToCurrentList(itemToAdd) {
        this.currentList.push(itemToAdd);
    }

    /**
     * addNewItemToCurrentList
     * 
     * This function adds a brand new default item to the current list.
     */
    addNewItemToCurrentList() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.addItemToList(this.currentList, newItem);
        return newItem;
    }

    /**
     * addItemToList
     * 
     * Function for adding a new item to the list argument using the provided data arguments.
     */
    addNewItemToList(list, initDescription, initDueDate, initStatus) {
        let newItem = new ToDoListItem(this.nextListItemId++);
        newItem.setDescription(initDescription);
        newItem.setDueDate(initDueDate);
        newItem.setStatus(initStatus);
        list.addItem(newItem);
        if (this.currentList) {
            this.view.refreshLists(list);
        }
    }

    addItemToList(item) {
        this.currentList.addItem(item);
        this.view.viewList(this.currentList);
    }

    /**
     * addNewItemTransaction
     * 
     * Creates a new transaction for adding an item and adds it to the transaction stack.
     */
    addNewItemTransaction() {
        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
        this.view.updateUndoRedoButtons(this.tps);
    }

    changeTaskTransaction(listItem, task) {
        let transaction = new ChangeTask_Transaction(this, listItem, task);
        this.tps.addTransaction(transaction);
        this.view.updateUndoRedoButtons(this.tps);
    }

    changeDateTransaction(listItem, date) {
        let transaction = new ChangeDate_Transaction(this, listItem, date);
        this.tps.addTransaction(transaction);
        this.view.updateUndoRedoButtons(this.tps);
    }

    changeStatusTransaction(listItem, status) {
        let transaction = new ChangeStatus_Transaction(this, listItem, status);
        this.tps.addTransaction(transaction);
        this.view.updateUndoRedoButtons(this.tps);
    }

    moveItemUpTransaction(listItem) {
        let transaction = new MoveItemUp_Transaction(this, listItem);
        this.tps.addTransaction(transaction);
        this.view.updateUndoRedoButtons(this.tps);
    }

    moveItemDownTransaction(listItem) {
        let transaction = new MoveItemDown_Transaction(this, listItem);
        this.tps.addTransaction(transaction);
        this.view.updateUndoRedoButtons(this.tps);
    }

    deleteItemTransaction(listItem) {
        let tranasction = new DeleteItem_Transaction(this, listItem);
        this.tps.addTransaction(tranasction);
        this.view.updateUndoRedoButtons(this.tps);
    }


    /**
     * addNewList
     * 
     * This function makes a new list and adds it to the application. The list will
     * have initName as its name.
     * 
     * @param {*} initName The name of this to add.
     */
    addNewList(initName) {
        let newList = new ToDoList(this.nextListId++);
        if (initName)
            newList.setName(initName);
        this.toDoLists.push(newList);
        this.view.appendNewListToView(newList);
        return newList;
    }

    /**
     * Adds a brand new default item to the current list's items list and refreshes the view.
     */
    addNewItem() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.currentList.items.push(newItem);
        this.view.viewList(this.currentList);
        return newItem;
    }

    /**
     * Makes a new list item with the provided data and adds it to the list.
     */
    loadItemIntoList(list, description, due_date, assigned_to, completed) {
        let newItem = new ToDoListItem();
        newItem.setDescription(description);
        newItem.setDueDate(due_date);
        newItem.setAssignedTo(assigned_to);
        newItem.setCompleted(completed);
        this.addItemToList(list, newItem);
    }

    /**
     * Load the items for the listId list into the UI.
     */
    loadList(listId) {
        this.tps.clearAllTransactions();
        let listIndex = -1;
        for (let i = 0; i < this.toDoLists.length; i++) {
            if (this.toDoLists[i].id === listId) {
                listIndex = i;
                this.toDoLists[i].setSelected(true);
            }
            else {
                this.toDoLists[i].setSelected(false);
            }
        }
        if (listIndex >= 0) {
            this.view.listControlsVisible(true);
            this.currentList = this.toDoLists[listIndex];
            this.view.viewList(this.currentList);
            this.moveListToTop(this.currentList);
            this.view.refreshLists(this.toDoLists);
            this.view.updateUndoRedoButtons(this.tps);
            this.view.addListButtonEnabled(false);
        }
    }

    moveListToTop(list) {
        var i = this.toDoLists.findIndex(p => p.id === list.id)
        if(i === 0) return;
        if(i > 0) {this.toDoLists.splice(i, 1);}
        this.toDoLists.unshift(list);
    }

    editTask(listItem, task) {
        let oldTask = listItem.description;
        listItem.description = (task == "") ? "No description" : task;
        this.view.viewList(this.currentList);
        return oldTask;
    }

    editDate(listItem, date) {
        let oldDate = listItem.dueDate;
        listItem.dueDate = (date == "") ? "No Date" : date;
        this.view.viewList(this.currentList);
        return oldDate;
    }

    editStatus(listItem, status) {
        let oldStatus = listItem.status;
        listItem.status = status;
        this.view.viewList(this.currentList);
        return oldStatus;
    }

    moveItemUp(listItem) {
        let list = this.currentList;
        let index = -1;
        for(let i = 0; (i < list.items.length) && (index < 0); i++){
            if(listItem === list.items[i]){
                index = i;
            }
        }
        let temp = listItem;
        list.items[index] = list.items[index-1];
        list.items[index-1] = temp;
        this.view.viewList(list);
    }

    moveItemDown(listItem) {
        let list = this.currentList;
        let index = -1;
        for(let i = 0; (i < list.items.length) && (index < 0); i++){
            if(listItem === list.items[i]){
                index = i;
            }
        }
        let temp = listItem;
        list.items[index] = list.items[index+1];
        list.items[index+1] = temp;
        this.view.viewList(list);
    }

    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
        }
        this.view.updateUndoRedoButtons(this.tps);
    }   

    /**
     * Remove the itemToRemove from the current list and refresh.
     */
    removeItem(itemToRemove) {
        this.currentList.removeItem(itemToRemove);
        this.view.viewList(this.currentList);
        return itemToRemove;
    }

    selectList(list) {
        for(let i = 0; i < this.toDoLists.length; i++) {
            this.toDoLists[i].selected = false;
        }
        list.selected = true;
    }

    deleteListConfirmation() {
        this.view.deleteListModal();
    }

    /**
     * Finds and then removes the current list.
     */
    removeCurrentList() {
        this.tps.clearAllTransactions();
        let indexOfList = -1;
        for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0); i++) {
            if (this.toDoLists[i].id === this.currentList.id) {
                indexOfList = i;
            }
        }
        this.toDoLists.splice(indexOfList, 1);
        this.currentList = null;
        this.view.clearItemsList();
        this.view.refreshLists(this.toDoLists);
        this.view.updateUndoRedoButtons(this.tps);
        this.view.addListButtonEnabled(true);
    }

    closeList() {
        this.tps.clearAllTransactions();
        for(let i = 0; i < this.toDoLists.length; i++ ){
            if(this.toDoLists[i].getSelected() === true) {
                this.toDoLists[i].setSelected(false);
            }
        }
        this.currentList = null;
        this.view.listControlsVisible(false);
        this.view.clearItemsList();
        this.view.refreshLists(this.toDoLists);
        this.view.updateUndoRedoButtons(this.tps);
        this.view.addListButtonEnabled(true);
    }

    // WE NEED THE VIEW TO UPDATE WHEN DATA CHANGES.
    setView(initView) {
        this.view = initView;
    }

    /**
     * Undo the most recently done transaction if there is one.
     */
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
        }
        this.view.updateUndoRedoButtons(this.tps);
    } 
}