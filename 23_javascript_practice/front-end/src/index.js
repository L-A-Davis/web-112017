const link = "http://localhost:3000/tasks"


document.addEventListener("DOMContentLoaded", function() {

showTasks()
let submitButton = document.getElementById("submit")
submitButton.addEventListener("click", addNewTask)


function showTasks() {
  fetch(`${link}`).then(resp => resp.json()).then(json => showEach(json))
}

function showEach(data) {
  for(let i = 0; i < data.length; i++) {
    addEach(data[i])
  }
}

 function addEach(item) {

 let task = new Task(item)
 task.render()
 
}

function addNewTask(event){
  event.preventDefault()
  let desc = document.getElementById("add-task-desc").value
  let pri = document.getElementById("add-task-priority").value
  fetch(`${link}`, {
    method: "Post",
    headers: {'Accept': 'application/json',
      'Content-Type': 'application/json'},
    body: JSON.stringify({description: desc, priority: pri, completed: false })
  }).then(res => res.json()).then(json=> addEach(json))
   document.getElementById("add-task-desc").value = ''
   document.getElementById("add-task-priority").value = ''
}

function deleteTask(x) {
    fetch(`${link}/${x}`, {
      method: "Delete",
    })
}

function handleDelete(event) {
  if (event.target.className === "delete") {
    event.preventDefault()
    let x = event.target.dataset.id
    deleteTask(x)
    let taskdiv = event.target.parentNode
    taskdiv.remove()
  }
}

let tasklist = document.getElementById("tasks")
tasklist.addEventListener("click", handleDelete)

tasklist.addEventListener("change", handleCompletedEdit)

tasklist.addEventListener("focusout", handleDescriptionEdit)
tasklist.addEventListener("focusout", handlePriorityEdit)

function handleCompletedEdit(event) {
  if (event.target.className === "completed") {
    event.preventDefault()
    let box = event.target
    let x = box.dataset.id
    if (box.checked) {
      status = true
    }
     else {status = false}
    editTask(x, status)
  }
}

function handleDescriptionEdit(event) {
  let type = event.target.className
  if (type === "description") {
    event.preventDefault()
    let x = event.target.dataset.id
    let value = event.target.innerText;
    editTaskDescription(x, type, value)
  }
}

function handlePriorityEdit(event) {
  let type = event.target.className
  if (type === "priority") {
    event.preventDefault()
    let x = event.target.dataset.id
    let value = event.target.innerText;
    editTaskPriority(x, type, value)
  }
}


function editTask(x, status) {
  fetch(`${link}/${x}`, {
    method: "PATCH",
    headers: {'Accept': 'application/json',
      'Content-Type': 'application/json'},
    body: JSON.stringify({"completed": status})
  }).then(resp=> resp.json()).then(json => console.log(json))
}


function editTaskDescription(x, type, value) {
  fetch(`${link}/${x}`, {
    method: "PATCH",
    headers: {'Accept': 'application/json',
      'Content-Type': 'application/json'},
    body: JSON.stringify({"description": value})
  }).then(resp=> resp.json()).then(json => console.log(json))
}

function editTaskPriority(x, type, value) {
  fetch(`${link}/${x}`, {
    method: "PATCH",
    headers: {'Accept': 'application/json',
      'Content-Type': 'application/json'},
    body: JSON.stringify({"priority": value})
  }).then(resp=> resp.json()).then(json => console.log(json))
}


} )
