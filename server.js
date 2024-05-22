const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('codeChange', (code) => {
        socket.broadcast.emit('codeChange', code);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.post('/run', (req, res) => {
    const { code, input, language } = req.body;

    // Save the code to a file and execute it based on the language
    // Note: This is a simplified example. Please ensure you sanitize inputs and handle errors properly.
    const filename = `temp.${language}`;
    const fs = require('fs');
    fs.writeFileSync(filename, code);

    let command = '';
    switch (language) {
        case 'javascript':
            command = `node ${filename}`;
            break;
        case 'python':
            command = `python ${filename}`;
            break;
        case 'java':
            fs.writeFileSync('Main.java', code);
            command = 'javac Main.java && java Main';
            break;
        case 'cpp':
            if (os.platform() === 'win32') {
                command = `g++ ${filename} -o temp.exe && temp.exe`;
            } else {
                command = `g++ ${filename} -o temp && ./temp`;
            }
            break;
        // Add more cases as needed for different languages
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.json({ output: stderr });
            return;
        }
        res.json({ output: stdout });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
