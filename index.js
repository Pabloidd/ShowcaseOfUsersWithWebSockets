const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const { createServer } = require('http');

const app = express();
const PORT = 3001;

const USERS_PER_PART = 15;

app.use(express.json());

const server = createServer(app);
const wsServer = new WebSocketServer({
    server: server,
});

wsServer.on('connection', ws => {
    console.log('Client connected');

    ws.on('message', message => {
        try {
            const parsedMessage = JSON.parse(message.toString());
            const { type, payload } = parsedMessage;

            switch (type) {
                case 'getUsers':
                    handleGetUsers(ws, payload);
                    break;
                case 'updateUser':
                    handleUpdateUser(ws, payload);
                    break;
                default:
                    console.log(`Unknown message type: ${type}`);
            }
        } catch (error) {
            console.error('Failed to parse message from client:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

function handleGetUsers(ws, payload) {
    const start = parseInt(payload.start);

    if (isNaN(start) || start < 0) {
        return ws.send(JSON.stringify({ type: 'error', payload: 'Invalid start parameter. Must be a non-negative number.' }));
    }

    fs.readFile('data/Users.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return ws.send(JSON.stringify({ type: 'error', payload: 'Data Base mistake' }));
        }

        try {
            const users = JSON.parse(data);
            const startIndex = start * USERS_PER_PART;
            const endIndex = startIndex + USERS_PER_PART;
            const usersToSend = users.slice(startIndex, endIndex);

            ws.send(JSON.stringify({ type: 'users', payload: usersToSend }));
        } catch (parseError) {
            console.error(parseError);
            return ws.send(JSON.stringify({ type: 'error', payload: 'Parsing mistake' }));
        }
    });
}

function handleUpdateUser(ws, payload) {
    const userId = parseInt(payload.id);
    fs.readFile('data/Users.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return ws.send(JSON.stringify({ type: 'error', payload: 'Database error' }));
        }

        try {
            let users = JSON.parse(data);
            const userIndex = users.findIndex(u => u.id === userId);

            if (userIndex === -1) {
                return ws.send(JSON.stringify({ type: 'error', payload: 'User not found' }));
            }

            const updatedUser = {
                ...users[userIndex],
                FIO: payload.FIO,
                post: payload.post,
                address: payload.address,
                age: Number(payload.age),
                salary: Number(payload.salary),
                haveINN: Boolean(payload.haveINN),
                INN: payload.haveINN ? Number(payload.INN) : null
            };

            users[userIndex] = updatedUser;

            fs.writeFile('data/Users.json', JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return ws.send(JSON.stringify({ type: 'error', payload: 'Save failed' }));
                }
                ws.send(JSON.stringify({ type: 'userUpdated', payload: updatedUser }));
            });
        } catch (error) {
            console.error(error);
            ws.send(JSON.stringify({ type: 'error', payload: 'Processing error' }));
        }
    });
}

server.listen(PORT, () => {
    console.log(`WebSocket server listening at http://localhost:${PORT}`);
});
