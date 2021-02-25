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

        listElement.ondblclick = () => {
            listElement.contentEditable = true;
        }

        /*listElement.oncontextmenu = (e) => {
            var contextMenus = document.querySelectorAll('[id^="list-context-menu-"]');
            for(let i = 0; i < contextMenus.length; i++){
                if(contextMenus[i].style.display == 'block'){
                    contextMenus[i].style.display = 'none';
                }
            }
            e.preventDefault();
            this.buildListContextMenu(listElement, newList.id);
            var menu = document.getElementById("list-context-menu-" + newList.id);
            menu.style.display = 'block';
            menu.style.left = e.pageX + "px";
            menu.style.top = e.pageY + "px";
        };*/

        // UPDATE LIST NAME ON BLUR
        listElement.onblur = () => {
            if(listElement.innerHTML == ""){
                newList.setName("Untitled");
                listElement.innerHTML = "Untitled";
            }
            else{
                newList.setName(listElement.innerHTML);
            }
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
            listElement.style.color = "#ffc819";
        }

        listElement.appendChild(document.createTextNode(newList.name));
        listsElement.appendChild(listElement);

        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
        listElement.onmousedown = function(event) {
            if(event.which === 1){
                thisController.handleLoadList(newList.id);
            }
        }
    }

    buildListContextMenu(listElement, id) {
        var menuId = "list-context-menu-" + id;
        var contextMenu = document.createElement("div");
        contextMenu.setAttribute("id", menuId);
        contextMenu.setAttribute("style", 'display:none');
        var menu = document.createElement("ul");

        var rename = document.createElement("li");
        rename.setAttribute("id", "rename-" + id);
        rename.setAttribute("class", "todo_button");
        rename.setAttribute("style", "user-select: none;");
        rename.onmousedown = function() {
            if(event.which === 1){
                listElement.contentEditable = true;
                rename.contentEditable = false;
                del.contentEditable = false;
            }
        }
        rename.innerHTML = "Rename";

        var del = document.createElement("li");
        del.setAttribute("id", "delete-" + id);
        del.setAttribute("class", "todo_button");
        del.onmousedown = function() {
            
        }
        del.innerHTML = "Delete";

        menu.appendChild(rename);
        menu.appendChild(del);
        contextMenu.appendChild(menu);
        listElement.appendChild(contextMenu);
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
            let listItemElement = "<div id='todo-list-item-" + listItem.id + "' class='list-item-card'>"
                                + "<div class='task-col'>" + listItem.description + "</div>"
                                + "<div class='due-date-col'>" + listItem.dueDate + "</div>"
                                + "<div class='status-col'>" + listItem.status + "</div>"
                                + "<div class='list-controls-col'>"
                                + " <div class='list-item-control material-icons'>keyboard_arrow_up</div>"
                                + " <div class='list-item-control material-icons'>keyboard_arrow_down</div>"
                                + " <div class='list-item-control material-icons'>close</div>"
                                + "</div>";
            itemsListDiv.innerHTML += listItemElement;
        }
    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}