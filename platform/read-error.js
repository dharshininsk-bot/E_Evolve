const fs = require('fs');
try {
    const data = fs.readFileSync('seed_error.log', 'utf16le');
    console.log(data);
} catch (e) {
    console.log("Error reading file:", e.message);
}
