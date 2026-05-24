const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {
  // Обробляємо DELETE /data/:id
  if (req.method === 'DELETE' && req.url.startsWith('/data/')) {
    const id = parseInt(req.url.replace('/data/', ''));

    // 1. Перевірка наявності файлу (Req: 500 if not exist)
    if (!fs.existsSync(FILE_PATH)) {
      res.writeHead(500);
      return res.end();
    }

    // 2. Читаємо файл
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end();
      }

      let list;
      try {
        list = JSON.parse(data);
      } catch (e) {
        // Якщо файл пошкоджений (Req: 400 if malformed)
        res.writeHead(400);
        return res.end();
      }

      // Перевіряємо, чи є об'єкт з таким ID
      const exists = list.some(item => item.id === id);
      if (!exists) {
        // (Req: 404 if not found)
        res.writeHead(404);
        return res.end();
      }

      // 3. Видаляємо об'єкт (фільтруємо масив)
      const updatedList = list.filter(item => item.id !== id);

      // 4. Записуємо оновлений масив назад у файл
      fs.writeFile(FILE_PATH, JSON.stringify(updatedList, null, 2), (err) => {
        if (err) {
          res.writeHead(500);
          return res.end();
        }
        // Успіх (Req: 200)
        res.writeHead(200);
        res.end();
      });
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT);