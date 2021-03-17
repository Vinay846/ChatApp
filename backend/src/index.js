const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const http = require('http');
const server = http.createServer(app);

const socket_io = require('socket.io');
const io = socket_io(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: [ 'GET', 'POST' ]
	}
});

const history = [];
const users = {};

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
		if (users[socket.id]) {
			io.emit('broadcast message', {
				name: 'Server',
				txt: `${msg.name} has left the chat`
			});
		}
	});

	socket.on('new user join', (msg) => {
		users[socket.id] = msg.name;
		io.emit('broadcast message', {
			name: 'Server',
			txt: `${msg.name} has join the chat`
		});
	});

	socket.on('chat message', (msg) => {
		console.log('message: ' + msg);
		history.push(msg);
		io.emit('broadcast message', msg);
	});
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/history', (req, res) => {
	res.send(history);
});

server.listen(9999, () => {
	console.log('listening on *:9999');
});
