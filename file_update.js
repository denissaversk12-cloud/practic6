const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {
  // Перевіряємо метод PUT та чи шлях починається з /data/
  if (req.method === 'PUT' && req.url.startsWith('/data/')) {
    // Отримуємо ID з URL (видаляємо "/data/")
    const id = parseInt(req.url.replace('/data/', ''));

    let body = '';
    req.on('data', chunk => body += chunk.toString());

    req.on('end', () => {
      // 1. Перевіряємо наявність файлу (Requirement: 500 if not exist)
      if (!fs.existsSync(FILE_PATH)) {
        res.writeHead(500);
        return res.end();
      }

      // 2. Парсимо тіло запиту (Requirement: 400 if malformed)
      let updateData;
      try {
        updateData = JSON.parse(body);
      } catch (e) {
        res.writeHead(400);
        return res.end();
      }

      // 3. Читаємо файл
      fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500);
          return res.end();
        }

        let list = JSON.parse(data);
        // Шукаємо індекс об'єкта
        const index = list.findIndex(item => item.id === id);

        // 4. Перевіряємо чи існує такий ID (Requirement: 404 if not found)
        if (index === -1) {
          res.writeHead(404);
          return res.end();
        }

        // 5. Оновлюємо об'єкт (зберігаємо id, замінюємо інші поля)
        list[index] = { ...list[index], ...updateData, id };

        // 6. Записуємо оновлений масив
        fs.writeFile(FILE_PATH, JSON.stringify(list, null, 2), (err) => {
          if (err) {
            res.writeHead(500);
            return res.end();
          }
          res.writeHead(200);
          res.end();
        });
      });
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT);