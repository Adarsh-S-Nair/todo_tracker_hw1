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
            console.log(newList.getName());
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

            // BUILD THE TASK ELEMENT AND MAKE IT EDITABLE ON CLICK
            let taskElement = document.createElement("div");
            taskElement.setAttribute("class", "task-col");
            taskElement.innerHTML += listItem.description;
            taskElement.onclick = createTaskInput;

            function createTaskInput(){
                let taskInput = document.createElement("input");
                taskInput.type = "text";
                taskInput.value = listItem.description;
                listItemElement.replaceChild(taskInput, taskElement);
                taskInput.focus();
                taskInput.onblur = () => {
                    if(taskInput.value == ""){
                        listItem.setDescription("No Description");
                    }
                    else{
                        listItem.setDescription(taskInput.value);
                    }
                    taskElement.innerHTML = listItem.description;
                    listItemElement.replaceChild(taskElement, taskInput);
                    console.log(listItem.description);
                    taskElement.onclick = createTaskInput;
                }
                taskInput.addEventListener("keydown", (e) => {
                    if(e.keyCode === 13){
                        taskInput.blur();
                    }
                });
            }

            listItemElement.appendChild(taskElement);

            // BUILD THE DATE ELEMENT AND MAKE IT EDITABLE ON CLICK
            let dateElement = document.createElement("div");
            dateElement.setAttribute("class", "due-date-col");
            dateElement.innerHTML += listItem.dueDate;
            dateElement.onclick = createDatePicker;

            function createDatePicker() {
                let datePicker = document.createElement("input");
                datePicker.type = "date";
                datePicker.value = listItem.getDueDate();
                listItemElement.replaceChild(datePicker, dateElement);
                datePicker.focus();
                datePicker.onblur = () => {
                    if(datePicker.value == ""){
                        listItem.setDueDate("No Date");
                    }
                    else{
                        listItem.setDueDate(datePicker.value);
                    }
                    dateElement.innerHTML = listItem.dueDate;
                    listItemElement.replaceChild(dateElement, datePicker);
                    console.log(listItem.getDueDate());
                    dateElement.onclick = createDatePicker;
                };
                datePicker.addEventListener("keydown", (e) => {
                    if(e.keyCode === 13){
                        datePicker.blur();
                    }
                });
            };

            listItemElement.appendChild(dateElement);

            // BUILD THE STATUS ELEMENT AND MAKE IT EDITABLE ON CLICK
            let statusElement = document.createElement("div");
            if(listItem.status == "complete"){
                statusElement.setAttribute("class", "status-col complete");   
            }
            else{
                statusElement.setAttribute("class", "status-col incomplete"); 
            }
            statusElement.innerHTML += listItem.status;
            statusElement.onclick = createStatusOptions;
            
            function createStatusOptions() {
                let statusOptions = document.createElement("select");
                listItemElement.replaceChild(statusOptions, statusElement);
                statusOptions.focus();

                let completeOption = document.createElement("option");
                completeOption.innerText = "complete";
                let incompleteOption = document.createElement("option");
                incompleteOption.innerText = "incomplete";
                statusOptions.appendChild(completeOption);
                statusOptions.appendChild(incompleteOption);

                statusOptions.onblur = () => {
                    listItem.setStatus(statusOptions.value);
                    statusElement.innerHTML = listItem.status;
                    listItemElement.replaceChild(statusElement, statusOptions);
                    if(listItem.status == "complete"){
                        statusElement.setAttribute("class", "status-col complete");   
                    }
                    else{
                        statusElement.setAttribute("class", "status-col incomplete"); 
                    }
                    console.log(listItem.getStatus());
                    statusElement.onclick = createStatusOptions;
                };
                statusOptions.addEventListener("keydown", (e) => {
                    if(e.keyCode === 13){
                        statusOptions.blur();
                    }
                });
            };

            listItemElement.appendChild(statusElement);

            let listControls = document.createElement("div");
            let upArrow = document.createElement("div");
            upArrow.setAttribute("class", "list-item-control material-icons");
            upArrow.innerText = "keyboard_arrow_up";
            let downArrow = document.createElement("div");
            downArrow.setAttribute("class", "list-item-control material-icons");
            downArrow.innerText = "keyboard_arrow_down";
            let close = document.createElement("div");
            close.setAttribute("class", "list-item-control material-icons");
            close.innerText = "close";

            listControls.appendChild(upArrow);
            listControls.appendChild(downArrow);
            listControls.appendChild(close);

            listItemElement.appendChild(listControls);

            itemsListDiv.appendChild(listItemElement);
        }
    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}