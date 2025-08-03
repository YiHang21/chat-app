
const socket = io('ws://localhost:3000')

const activity = document.querySelector('.activity')
const msgInput = document.querySelector('input')

function sendMessage(e){
    e.preventDefault() //submit form without reloading the page
    if (msgInput.value) {
        socket.emit('message', msgInput.value)
        msgInput.value = ""
    }
    msgInput.focus()
}
msgInput.addEventListener('keypress', () => {
    socket.emit('activity', socket.id.substring(0, 5))
})
document.querySelector('form')
    .addEventListener('submit', sendMessage)

//listen for messages
socket.on("message", (data) => {
    activity.textContent = ""
    const li = document.createElement('li')
    li.textContent = data
    document.querySelector('ul').appendChild(li)
})
//listen for activity
let activityTimer
socket.on("activity", (name) => {
    activity.textContent = `${name} is typing...`
    //3 second close
    clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 3000)
})