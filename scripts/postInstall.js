const fs = require('fs');
const path = require('path');

// Caminho para a pasta "wear/src/main"
const wearMainPath = path.join(__dirname, 'node_modules/smartwatch/wear/src/main');
console.log('>>>> 📂 Display full directory :: ' + wearMainPath);


// Verifica se a pasta existe
if (!fs.existsSync(wearMainPath)) {
    console.log('>>>> 📂 Creating directory : wear/src/main');
    fs.mkdirSync(wearMainPath, { recursive: true });
} else {
    console.log('>>>> 📂 WearMainPath alrady exists ' + wearMainPath);
}