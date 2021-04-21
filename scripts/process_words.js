import { writeFileSync, readFileSync } from 'fs';

const contents = readFileSync('words.txt', {encoding: 'utf8'});
const words = contents.split("\n");
const cleaned = words.map(word => word.toLowerCase().replace("'", ""));
const deduped = cleaned.filter((item, index) => 
  cleaned.indexOf(item) == index
)
writeFileSync('public/words.json', JSON.stringify(words));
