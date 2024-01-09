const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Set storage engine
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve the HTML file on the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('pdfFile'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const buffer = req.file.buffer;

        // Parse PDF
        pdfParse(buffer)
            .then(data => {
                // Log the parsed data
                console.log(data);

                // Send the extracted text back to the client as plain text
                res.send(data.text);
            })
            .catch(error => {
                console.error('Error parsing PDF:', error);
                res.status(500).send('Error parsing PDF.');
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
