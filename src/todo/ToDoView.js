'use strict'

/**
 * ToDoView
 * 
 * This class generates all HTML content for the UI.
 */
export default class ToDoView {
    constructor() {}

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendNewListToView(newList) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("lists-list");

        // MAKE AND ADD THE NODE
        let newListId = "list-element-" + newList.id;
        let listElement = document.createElement("div");
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todo_button list");

        // UPDATE LIST NAME ON BLUR
        listElement.onblur = () => {
            if(listElement.innerHTML == ""){
                newList.setName("Untitled");
            }
            else{
                newList.setName(listElement.innerHTML);
            }
            listElement.innerHTML = newList.name;
            listElement.contentEditable = false;
        }
        
        // 'ENTER' KEY BLURS LIST ELEMENT
        listElement.addEventListener('keydown', (e) => {
            if(e.keyCode === 13){
                listElement.blur();
            }
        })

        if(newList.getSelected() === true){
            listElement.style.backgroundColor = "#40454e";
            listElement.setAttribute("class", "selected-list todo_button list");

            listElement.ondblclick = () => {
                listElement.contentEditable = true;
                listElement.focus();
            }
        }

        listElement.appendChild(document.createTextNode(newList.name));
        listsElement.appendChild(listElement);

        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
        listElement.onmousedown = function(event) {
            if(newList.getSelected() != true && event.which === 1) {
                thisController.handleLoadList(newList.id);
            }
        }
    }

    listControlsVisible(bool) {
        let addItem = document.getElementById("add-item-button");
        let deleteList = document.getElementById("delete-list-button");
        let closeList = document.getElementById("close-list-button");
        if  (bool) {
            addItem.style.display = "block";
            deleteList.style.display = "block";
            closeList.style.display = "block";
        }
        else {
            addItem.style.display = "none";
            deleteList.style.display = "none";
            closeList.style.display = "none";
        }
    }

    // REMOVES ALL THE LISTS FROM THE LEFT SIDEBAR
    clearItemsList() {
        let itemsListDiv = document.getElementById("list-items");
        // BUT FIRST WE MUST CLEAR THE WORKSPACE OF ALL CARDS BUT THE FIRST, WHICH IS THE ITEMS TABLE HEADER
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR
    refreshLists(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("lists-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendNewListToView(list);
        }
    }

    // LOADS THE list ARGUMENT'S ITEMS INTO THE VIEW
    viewList(list) {
        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("list-items");

        // GET RID OF ALL THE ITEMS
        this.clearItemsList();

        for (let i = 0; i < list.items.length; i++) {
            // NOW BUILD ALL THE LIST ITEMS
            let listItem = list.items[i];

            // BUILD THE LIST ITEM DIV
            let listItemElement = document.createElement("div");
            listItemElement.setAttribute("id", "todo-list-item-" + listItem.id);
            listItemElement.setAttribute("class", "list-item-card");

            // BUILD THE TASK ELEMENT
            let taskElement = document.createElement("div");
            taskElement.setAttribute("id", "task-" + listItem.id);
            taskElement.setAttribute("class", "task-col");
            taskElement.innerHTML += listItem.description;
            taskElement.onclick = () => {this.editTask(listItem, taskElement);};

            // BUILD THE DATE ELEMENT
            let dateElement = document.createElement("div");
            dateElement.setAttribute("class", "due-date-col");
            dateElement.innerHTML += listItem.dueDate;
            dateElement.onclick = () => {this.editDate(listItem, dateElement);};

            // BUILD THE STATUS ELEMENT
            let statusElement = document.createElement("div");
            if(listItem.status == "complete")
                {statusElement.setAttribute("class", "status-col complete");}
            else {statusElement.setAttribute("class", "status-col incomplete");}
            statusElement.innerHTML += listItem.status;
            statusElement.onclick = () => {this.editStatus(listItem, statusElement)};

            // BUILD THE LIST CONTROLS
            let listControls = document.createElement("div");
            listControls.setAttribute("id", "list-controls");
            let upArrow = document.createElement("div");
            upArrow.setAttribute("class", "list-item-control material-icons control_button");
            upArrow.innerText = "keyboard_arrow_up";
            if(listItem === list.items[0]){
                upArrow.style.filter = "invert(0.6)";
                upArrow.style.cursor = "default";
            }
            else {upArrow.onclick = () => {this.controller.moveItemUp(listItem)};}

            let downArrow = document.createElement("div");
            downArrow.setAttribute("class", "list-item-control material-icons control_button");
            downArrow.innerText = "keyboard_arrow_down";
            if (listItem == list.items[list.items.length-1]) {
                downArrow.style.filter = "invert(0.6)";
                downArrow.style.cursor = "default";
            }
            else {downArrow.onclick = () => {this.controller.moveItemDown(listItem)};}

            let close = document.createElement("div");
            close.setAttribute("class", "list-item-control material-icons control_button");
            close.innerText = "close";
            close.onclick = () => {this.controller.deleteItem(listItem)};

            listControls.appendChild(upArrow);
            listControls.appendChild(downArrow);
            listControls.appendChild(close);

            // APPEND THE ELEMENTS TO THE ITEM CARD
            listItemElement.appendChild(taskElement);
            listItemElement.appendChild(dateElement);
            listItemElement.appendChild(statusElement);
            listItemElement.appendChild(listControls);

            // APPEND THE ITEM CARD TO THE LIST DIV
            itemsListDiv.appendChild(listItemElement);
        }
    }

    editTask(listItem, taskElement) {
        let listItemElement = document.getElementById("todo-list-item-" + listItem.getId());
        let taskInput = document.createElement("input");
        taskInput.type = "text";
        taskInput.value = listItem.description;
        listItemElement.replaceChild(taskInput, taskElement);
        taskInput.focus();
        taskInput.onblur = () => {
            this.controller.changeTask(listItem, taskInput.value);
            listItemElement.replaceChild(taskElement, taskInput);
            taskElement.onclick = () => {this.editTask(listItem, taskElement);};
        }
        taskInput.addEventListener("keydown", (e) => {
            if(e.keyCode === 13){
                taskInput.blur();
            }
        });
    }

    editDate(listItem, dateElement) {
        let listItemElement = document.getElementById("todo-list-item-" + listItem.getId());
        let datePicker = document.createElement("input");
        datePicker.type = "date";
        datePicker.value = listItem.dueDate;
        listItemElement.replaceChild(datePicker, dateElement);
        datePicker.focus();
        datePicker.onblur = () => {
            this.controller.changeDate(listItem, datePicker.value);
            listItemElement.replaceChild(dateElement, datePicker);
            dateElement.onclick = () => {this.editDate(listItem, dateElement);};
        };
        datePicker.addEventListener("keydown", (e) => {
            if(e.keyCode === 13){
                datePicker.blur();
            }
        });
    }

    editStatus(listItem, statusElement) {
        let listItemElement = document.getElementById("todo-list-item-" + listItem.getId());
        let statusOptions = document.createElement("select");
        listItemElement.replaceChild(statusOptions, statusElement);
        statusOptions.focus();

        let completeOption = document.createElement("option");
        completeOption.innerText = "complete";
        let incompleteOption = document.createElement("option");
        incompleteOption.innerText = "incomplete";
        statusOptions.appendChild(completeOption);
        statusOptions.appendChild(incompleteOption);

        statusOptions.value = listItem.status;

        statusOptions.onblur = () => {
            this.controller.changeStatus(listItem, statusOptions.value);
            listItemElement.replaceChild(statusElement, statusOptions);
            if(listItem.status == "complete") { statusElement.setAttribute("class", "status-col complete"); }
            else{ statusElement.setAttribute("class", "status-col incomplete"); }
            statusElement.onclick = () => {this.editStatus(listItem, statusElement);};
        };
        statusOptions.addEventListener("keydown", (e) => {
            if(e.keyCode === 13){
                statusOptions.blur();
            }
        });
    }

    updateUndoRedoButtons(tps) {
        let undo = document.getElementById("undo");
        let redo = document.getElementById("redo");

        if(tps.hasTransactionToUndo()) {
            undo.classList.remove("inactive");
            undo.classList.add("active");
        }
        else {
            undo.classList.remove("active");
            undo.classList.add("inactive");
        }

        if(tps.hasTransactionToRedo()) {
            redo.classList.remove("inactive");
            redo.classList.add("active");
        }
        else {
            redo.classList.remove("active");
            redo.classList.add("inactive");
        }
    }

    addListButtonEnabled(bool){
        let button = document.getElementById("add-list");
        if (bool) {
            button.classList.remove("inactive");
            button.classList.add("active")
            button.onclick = () => {this.controller.addNewList();};
        }
        else{
            button.classList.remove("active");
            button.classList.add("inactive")
            button.onclick = () => {};
        }
    }

    deleteListModal(){
        let overlay = document.createElement("div");
        overlay.className += "overlay";
        document.body.appendChild(overlay);
        let popup = document.getElementById("delete-confirmation");
        popup.style.display = "block";
        let cancel = document.getElementById("cancel-button");
        cancel.onclick = () => {
            document.body.removeChild(overlay);
            popup.style.display = "none";
        };
        let confirm = document.getElementById("confirm-delete");
        confirm.onclick = () => {
            this.listControlsVisible(false);
            document.body.removeChild(overlay);
            popup.style.display = "none";
            this.controller.removeCurrentList();
        };
    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}