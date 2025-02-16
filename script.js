import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'indian_food.csv');
const results = [];

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (data) => {
    for (const key in data) {
      if (data[key] === '-1') {
        data[key] = '';
      } else if (typeof data[key] === 'string') {
        data[key] = data[key].replace(/\b\w/g, (char) => char.toUpperCase());
      }
    }
    results.push(data);
  })
  .on('end', () => {
    fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
    console.log('CSV successfully converted to JSON. Output saved as output.json');
  });
