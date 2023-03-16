import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const todoForm = document.getElementById('todo-form')
const todoInput = document.getElementById('todo-input')
const createBtn = document.getElementById('create-todo')
const listContainer = document.getElementById('list-container')
const current = document.getElementsByClassName('active')

todoForm.addEventListener('click', (e)=>{
    e.preventDefault();
})

document.getElementById('theme-icon').addEventListener('click', () => {
    document.body.classList.toggle('light-mode')
    document.body.classList.contains('light-mode') ? document.getElementById('theme-icon').src = "images/icon-moon.svg" : document.getElementById('theme-icon').src = "images/icon-sun.svg"
})

document.addEventListener('click', (e) => {
    if(e.target.dataset.delete){
        deleteTodoObj(e.target.dataset.delete)
    }else if(e.target.dataset.check){
        checkTodoObj(e.target.dataset.check)
    }else if(e.target.id === 'active-todo'){
        filterActive()
        if(current.length > 0){
            current[0].classList.remove('active')
            e.target.classList.add('active')
        }
    }
    else if(e.target.id === 'completed-todo'){
        filterCompleted()
        if(current.length > 0){
            current[0].classList.remove('active')
            e.target.classList.add('active')
        }
    }
    else if(e.target.id === 'all-todo'){
        renderTodoHtml()
        if(current.length > 0){
            current[0].classList.remove('active')
            e.target.classList.add('active')
        }
    }
    else if (e.target.id === 'clear-btn'){
        clearCompleted()
    }
})


//class
class Todo {
    constructor(name, isActive, isCompleted, id){
        this.name = name
        this.isActive = isActive
        this.isCompleted = isCompleted
        this.id = id
    }
}

// functions

let todoArrList = JSON.parse(localStorage.getItem('todoArrList')) || []
let activeArrList = []
let completedArrList = []
//create todo
const createTodoObj = () => {
    if(todoInput.value){
        const todoObj = new Todo (todoInput.value, true, false, uuidv4())
        todoArrList.unshift(todoObj)
        todoInput.value = ''
        localStorage.setItem('todoArrList', JSON.stringify(todoArrList))
        if(current.length > 0){
            current[0].classList.remove('active')
            document.getElementById('all-todo').classList.add('active')
        }
        renderTodoHtml()
    }
}
// delete todo
const deleteTodoObj = (param) => {
    const targetTodoObj = todoArrList.filter((todo)=>{
        return todo.id === param
    })[0]
    const index = todoArrList.indexOf(targetTodoObj)
    todoArrList.splice(index, 1)
    localStorage.setItem('todoArrList', JSON.stringify(todoArrList))
    renderTodoHtml()
}
// complete todo filter function
const filterCompletedTodo = () =>{
    completedArrList = todoArrList.filter((todo)=>{
        return todo.isCompleted === true
    })
    
    return completedArrList.map((todo)=>{
        return `
        <li>
            <a href="#" class="li-btn ${todo.isCompleted ? "check-background" : ""}" id = "btn-${todo.id}"  data-check = "${todo.id}"><i class="bi bi-check check"></i></a>
            <p class="li-text ${todo.isCompleted ? "check-text" : ""}">${todo.name}</p>
            <button class="delete-btn"><svg xmlns="http://www.w3.org/2000/svg" data-delete = "${todo.id}" class="delete-svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg></button>
        </li>`
    }).join('')
}

// active todo filter function
const filterActiveTodo = () => {
    activeArrList = todoArrList.filter((todo)=>{
        return todo.isActive === true
    })
    return activeArrList.map((todo)=>{
        return `<li>
        <a href="#" class="li-btn ${todo.isCompleted ? "check-background" : ""}" id = "btn-${todo.id}"  data-check = "${todo.id}"><i class="bi bi-check check"></i></a>
        <p class="li-text ${todo.isCompleted ? "check-text" : ""}">${todo.name}</p>
        <button class="delete-btn"><svg xmlns="http://www.w3.org/2000/svg" data-delete = "${todo.id}" class="delete-svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg></button>
    </li>`
    }).join('')
}

// check todo as active
const checkTodoObj = (param) =>{
    const targetTodoObj = todoArrList.filter((todo)=>{
        return todo.id === param
    })[0]
    const checkBtn = document.getElementById(`btn-${param}`)
    checkBtn.classList.toggle('check-background')
    checkBtn.nextElementSibling.classList.toggle('check-text')
    checkBtn.firstChild.classList.toggle('block')
    if(checkBtn.classList.contains('check-background')){
        targetTodoObj.isCompleted = true
        targetTodoObj.isActive = false
        
    }else {
        targetTodoObj.isCompleted = false
        targetTodoObj.isActive = true
    }
    localStorage.setItem('todoArrList', JSON.stringify(todoArrList))
    
}
// todo status
const filterActive = () => {
    listContainer.innerHTML = filterActiveTodo()
    document.getElementById('num-of-todo').innerHTML = `${activeArrList.length} items left`
}

const filterCompleted = () => {
    listContainer.innerHTML = filterCompletedTodo()
    document.getElementById('num-of-todo').innerHTML = `${completedArrList.length} items left`
}

// render to the html
const renderTodoHtml = () => {
    listContainer.innerHTML = todoArrList.map((todo)=>{
        return `
        <li>
            <a href="#" class="li-btn ${todo.isCompleted ? "check-background" : ""}" id = "btn-${todo.id}"  data-check = "${todo.id}"><i class="bi bi-check check"></i></a>
            <p class="li-text ${todo.isCompleted ? "check-text" : ""}">${todo.name}</p>
            <button class="delete-btn"><svg xmlns="http://www.w3.org/2000/svg" data-delete = "${todo.id}" class="delete-svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg></button>
        </li>`
    }).join('')
    document.getElementById('num-of-todo').innerHTML = `${todoArrList.length} items left`
}

//clear completed
const clearCompleted = () =>{
    todoArrList = todoArrList.filter((todo)=>{
        return todo.isCompleted === false
    })
    localStorage.setItem('todoArrList', JSON.stringify(todoArrList))
    renderTodoHtml()
}

renderTodoHtml()

createBtn.addEventListener('click', createTodoObj)



