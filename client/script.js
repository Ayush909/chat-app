const socket = io();
const messageForm = document.getElementById('send-container');
const messageContainer = document.getElementById('message-container');
const usercontainer = document.getElementById('user-count');
const messageInput = document.getElementById('message-input');
const userName = document.getElementById('user-name');

const name = prompt('What is your name?');
appendMessage('You joined');
socket.emit('new-user',name);

socket.on('chat-message', data=>{
    appendMessage(`${data.name} : ${data.msg}`);
})

socket.on('user-connected', name=>{
    appendMessage(`${name} connected`);
})



socket.on('account-details',(data)=>{
    userName.innerText = 'Your name: '+data.name;
})

socket.on('user-count',(data)=>{
    userdetails(`No of Users connected : ${data.no_of_users}`);
})

socket.on('user-disconnected' , name=>{
    appendMessage(`${name} disconnected`)
})

function userdetails(message){
    usercontainer.innerText = message;
}

messageForm.addEventListener('submit', e=>{
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message',message);
    messageInput.value = '';
})

function appendMessage(message){
    const msgElement = document.createElement('div');
    msgElement.innerText = message;
    messageContainer.append(msgElement);
}