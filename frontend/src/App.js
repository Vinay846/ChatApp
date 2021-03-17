import './App.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:9999');

function App() {
	const [ messages, setMessages ] = useState([]);
	const [ chat, setChat ] = useState('');
	const [ name, setName ] = useState('');

	const sendChat = () => {
		sendChatToServer(chat);
	};

	const storeInput = (e) => {
		setChat(e.target.value);
	};

	const sendonEnter = (e) => {
		if (e.keyCode === 13) {
			sendChatToServer(chat);
		}
	};

	const sendChatToServer = (msg) => {
		if (msg.trim() !== '') {
			socket.emit('chat message', {name, txt: msg});
			setChat('');
		}
	};

	useEffect(() => {
    fetch('http://localhost:9999/history')
    .then((r) => r.json())
    .then((msg) => {
			setMessages(msg);
    })
    .then(() => {
      const inputName = prompt("Enter a name ?");
      setName(inputName);
	  socket.emit('new user join', {name: inputName});
	  socket.on("broadcast message", (msg) => {
		  setMessages(m => [...m, msg]);
	  })
    });
	}, []);

	return (
		<div className="App">
			<ul id="messages">
				{messages.map((msg, idx) => (
					<li key={idx}>
						<b>{msg.name}</b> {msg.txt}
					</li>
				))}
			</ul>
			<div id="form" onKeyPress={sendonEnter}>
				<input id="input" autoComplete="off" onChange={storeInput} value={chat} />
				<button onClick={sendChat}>Send</button>
			</div>
		</div>
	);
}

export default App;
