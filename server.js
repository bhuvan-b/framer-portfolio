const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Set response header to HTML
    res.writeHead(200, { 'Content-Type': 'text/html' });

    // Read and stream the HTML file
    fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
});

// Server listens on port 3000
server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
