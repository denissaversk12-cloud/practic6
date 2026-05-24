const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {
    // Перевіряємо метод та шлях
    if (req.method === 'GET' && req.url === '/data') {
        
        // Читаємо файл
        fs.readFile(FILE_PATH, 'utf8', (err, data) => {
            if (err) {
                // Якщо файл не знайдено або сталася системна помилка
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }

            try {
                // Пробуємо розпарсити вміст як JSON
                const jsonData = JSON.parse(data);

                // Якщо успішно - повертаємо 200 та дані
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(jsonData));
            } catch (parseError) {
                // Якщо JSON невалідний (Requirement: return 400 or 500)
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON format in file' }));
            }
        });
    } else {
        // Обробка інших маршрутів (наприклад, 404 Not Found)
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});