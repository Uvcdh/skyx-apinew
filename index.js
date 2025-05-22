const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.enable("trust proxy");
app.set("json spaces", 2);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/', express.static(path.join(__dirname, 'api-page')));
app.use('/src', express.static(path.join(__dirname, 'src')));

const settingsPath = path.join(__dirname, './src/settings.json');
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));

app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (data) {
        if (data && typeof data === 'object') {
            const responseData = {
                status: data.status,
                creator: settings.apiSettings.creator || "Created Using Rynn UI",
                ...data
            };
            return originalJson.call(this, responseData);
        }
        return originalJson.call(this, data);
    };
    next();
});

// Api Route
// Api Route
// Api Route
let totalRoutes = 0;
const loadedRoutes = new Set(); // Track loaded routes to prevent duplicates
const apiFolder = path.join(__dirname, './src/api');

try {
    fs.readdirSync(apiFolder).forEach((subfolder) => {
        const subfolderPath = path.join(apiFolder, subfolder);
        if (fs.statSync(subfolderPath).isDirectory()) {
            fs.readdirSync(subfolderPath).forEach((file) => {
                const filePath = path.join(subfolderPath, file);
                if (path.extname(file) === '.js' && !loadedRoutes.has(filePath)) {
                    try {
                        const routeModule = require(filePath);
                        if (typeof routeModule === 'function') {
                            routeModule(app);
                            loadedRoutes.add(filePath);
                            totalRoutes++;
                            console.log(chalk.bgHex('#FFFF99').hex('#333').bold(` Loaded Route: ${file} `));
                        } else {
                            console.error(chalk.bgRed.white.bold(` Error: ${file} does not export a function `));
                        }
                    } catch (error) {
                        console.error(chalk.bgRed.white.bold(` Failed to load ${file}: ${error.message} `));
                    }
                }
            });
        }
    });
} catch (error) {
    console.error(chalk.bgRed.white.bold(` Error loading API routes: ${error.message} `));
    process.exit(1);
}
console.log(chalk.bgHex('#90EE90').hex('#333').bold(' Load Complete! ✓ '));
console.log(chalk.bgHex('#90EE90').hex('#333').bold(` Total Routes Loaded: ${totalRoutes} `));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'api-page', 'index.html'));
});

app.use((req, res, next) => {
    res.status(404).sendFile(process.cwd() + "/api-page/404.html");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).sendFile(process.cwd() + "/api-page/500.html");
});

app.listen(PORT, () => {
    console.log(chalk.bgHex('#90EE90').hex('#333').bold(` Server is running on port ${PORT} `));
});

module.exports = app;