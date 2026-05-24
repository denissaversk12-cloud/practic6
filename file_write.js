const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {
  // Перевіряємо метод POST та шлях /data
  if (req.method === 'POST' && req.url === '/data') {
    let body = '';

    // Збираємо шматочки даних
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    // Коли всі дані отримані
    req.on('end', () => {
      try {
        // Перевіряємо, чи це валідний JSON (Requirement: return 400 if invalid)
        JSON.parse(body);

        // Записуємо отримане тіло у файл
        fs.writeFile(FILE_PATH, body, (err) => {
          if (err) {
            res.writeHead(500);
            return res.end();
          }

          // Успішне завершення (Requirement: return 200)
          res.writeHead(200);
          res.end();
        });
      } catch (error) {
        // Якщо JSON невалідний
        res.writeHead(400);
        res.end();
      }
    });
  } else {
    // Для всіх інших маршрутів
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT);