/* Select all the elements */
const alert = document.querySelector(".alert");
const input = document.querySelector(".input");
const submitBtn = document.querySelector(".submitBtn");
const todoContainer = document.querySelector(".todoContainer");
const todoList = document.querySelector(".todoList");
const form = document.querySelector(".todoForm");

let edit = false;
let editElement;
let editID;

let clearBtn = document.querySelector('.clearBtn');
console.log(clearBtn);
/* Event listeners***** */
form.addEventListener("submit",addItem);
clearBtn.addEventListener("click",clearItems);
window.addEventListener('DOMContentLoaded',setUpItems);
/* FUNCTIONS *********** */
function addItem(e){
  
    e.preventDefault();
    let value = input.value;
    let id = new Date().getTime();
    if(value && !edit){        
        
        createListItem(id,value);
        setDefault();
        addToLocalStorage(id,value);
        displayAlert('Added item successfully','success');
            }
            else if (value && edit){
                editElement.innerHTML = value; 
                editLocalStorage(editID,value);
                setDefault();
                /* Edit the item in local storage */
            }else{
                displayAlert('Please enter value','danger');
            }
        }
 
function clearItems(){

let items = document.querySelectorAll(".grocery-item");
console.log(items);
if(items.length>0){
    items.forEach(function(item){
       todoList.remove(item); 
    });
}
todoContainer.classList.add("hidden");
displayAlert('Items successfully cleared','success');
setDefault();
localStorage.removeItem('list');
}
function setDefault(){
    input.value="";
    edit = false;
    editID = '';
    submitBtn.textContent = 'Submit';
}
function displayAlert(text,condition){
    /* show alert */
    alert.classList.remove('hidden');
    alert.textContent = text;
    alert.classList.add(condition);

    /* remove alert */
    setTimeout(function(){
        alert.classList.add('hidden');
        alert.textContent = '';
        alert.classList.remove(condition);
    },1000);

}
function deleteItem(e){


    let element = e.currentTarget.parentElement.parentElement;
    const id = parseInt(element.dataset.id);

    /* remove the item from the list */
    todoList.removeChild(element);
    if(todoList.children.length === 0){
        todoContainer.classList.add('hidden');
    }
    displayAlert('Item removed successfully','success');

    /* Remove from local storage */
    removeFromLocalStorage(id);
    console.log(id);
    /* set default */
    setDefault()
   
}
function editItem(e){


    let element = e.currentTarget.parentElement.parentElement;
    /* Set the edit item */
    editElement = e.currentTarget.parentElement.previousElementSibling;
    /* set the form value */
    input.value = editElement.innerHTML;
    edit = true;
    /* set the item id */
    editID = element.dataset.id;

    submitBtn.textContent = "edit";
}


/* LOCAL STORAGE *********/
// Use the local storage API
// it has the setItem
// it has the getItem 
// it has the removeItem
// Save as strings 
function addToLocalStorage(id, value){

    let grocery = {id,value};
    let items = getLocalStorage();
    console.log(items);

    items.push(grocery);
    localStorage.setItem('list',JSON.stringify(items));


}
function removeFromLocalStorage(id){

    let items = getLocalStorage();

    items = items.filter(function (item) {
      if (item.id !== id) {
        return item;
      }
    });
    localStorage.setItem("list", JSON.stringify(items));


}   
function editLocalStorage(id,value) {
    let items = getLocalStorage();
    id = parseInt(id);
   items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    });

    localStorage.setItem("list", JSON.stringify(items));

}   
function getLocalStorage(){
    return localStorage.getItem('list')?JSON.parse(localStorage.getItem('list')):[];
}

/* Setup items */
function setUpItems(){
    let items = getLocalStorage();
    console.log(items);
    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id, item.value);
        });
    }
}
function createListItem(id,value){
let element = document.createElement("article");
        let dataID = document.createAttribute("data-id");
        element.setAttributeNode(dataID);
        element.dataset.id = id;
        // console.log(element);
        element.classList.add('grocery-item');
        element.innerHTML = `   
        <p class="text-black">${value}</p>
        <div>
            <button class="editBtn text-green-400">
            edit
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="deleteBtn text-red-500">
            delete
                <i class="fa-solid fa-trash"></i>
            </button>
            </div>`;

        const deleteBtn = element.querySelector(".deleteBtn");
        deleteBtn.addEventListener("click",deleteItem);
        const editBtn = element.querySelector(".editBtn");
        editBtn.addEventListener('click',editItem);

        todoContainer.classList.remove("hidden");    
            /* append child */
        todoList.appendChild(element);
}