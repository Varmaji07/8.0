const socket = io('/'); // Socket connects to the root server

let localStream;
let peer;
let roomId;
let myName = "Anonymous";

// Get user name from localStorage
const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
if (loggedInUser && loggedInUser.name) {
    myName = loggedInUser.name;
}

const joinScreen = document.getElementById('join-screen');
const roomScreen = document.getElementById('room-screen');
const roomIdInput = document.getElementById('room-id-input');
const joinBtn = document.getElementById('join-btn');
const connectionStatus = document.getElementById('connection-status');
const myVideo = document.getElementById('my-video');
const userVideo = document.getElementById('user-video');
const remoteVideoContainer = document.getElementById('remote-video-container');
const callStartBtn = document.getElementById('call-start-btn');
const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

// Update labels
document.querySelector('#my-video').parentElement.querySelector('h3').innerText = myName;

joinBtn.onclick = () => {
    roomId = roomIdInput.value;
    if (roomId) {
        socket.emit('join-room', roomId, myName);
        joinScreen.style.display = 'none';
        roomScreen.style.display = 'block';
        connectionStatus.innerText = `CONNECTED TO: ${roomId}`;

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localStream = stream;
                myVideo.srcObject = stream;
                callStartBtn.style.display = 'block';
            })
            .catch(err => {
                console.error('Failed to get local stream', err);
                alert('Please allow camera and microphone access.');
            });
    }
};

callStartBtn.onclick = () => {
    initiatePeer(true);
    callStartBtn.style.display = 'none';
};

chatForm.onsubmit = (e) => {
    e.preventDefault();
    const message = chatInput.value;
    if (message && roomId) {
        socket.emit('send-message', { roomId, message });
        chatInput.value = '';
    }
};

socket.on('message', (payload) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    if (payload.userId === socket.id) {
        messageElement.classList.add('own');
    }
    const displayName = payload.userName || payload.userId.substring(0, 5);
    messageElement.innerHTML = `<span>${displayName}:</span> ${payload.message}`;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
});

socket.on('offer', async ({ userId, offer, userName }) => {
    console.log('Received offer from', userName || userId);
    if (userName) {
        document.querySelector('#user-video').parentElement.querySelector('h3').innerText = userName;
    }
    initiatePeer(false, offer);
});

socket.on('answer', ({ userId, answer, userName }) => {
    console.log('Received answer from', userName || userId);
    if (userName) {
        document.querySelector('#user-video').parentElement.querySelector('h3').innerText = userName;
    }
    if (peer) {
        peer.signal(answer);
    }
});

socket.on('ice-candidate', ({ userId, candidate }) => {
    if (peer && candidate) {
        peer.signal(candidate);
    }
});

function initiatePeer(initiator, incomingSignal = null) {
    peer = new SimplePeer({
        initiator: initiator,
        trickle: false,
        stream: localStream
    });

    peer.on('signal', data => {
        if (initiator) {
            socket.emit('offer', { roomId, offer: data, userName: myName });
        } else {
            socket.emit('answer', { roomId, answer: data, userName: myName });
        }
    });

    peer.on('stream', stream => {
        userVideo.srcObject = stream;
        remoteVideoContainer.style.display = 'block';
    });

    if (incomingSignal) {
        peer.signal(incomingSignal);
    }

    peer.on('error', err => console.error('Peer error:', err));
}
