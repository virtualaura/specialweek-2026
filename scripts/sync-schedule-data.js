const fs = require('fs');
const path = require('path');

const sourcePath = path.resolve(__dirname, '../data/ScheduleData.ts');
const targetPath = path.resolve(__dirname, '../src/data/scheduleData.js');

const source = fs.readFileSync(sourcePath, 'utf8');
const match = source.match(
  /export const eventScheduleData:\s*EventScheduleItem\[\]\s*=\s*(\[[\s\S]*?\]);/
);

if (!match) {
  throw new Error('Could not find `eventScheduleData` array in data/ScheduleData.ts');
}

const output = `// AUTO-GENERATED from data/ScheduleData.ts. Do not edit directly.
export const eventScheduleData = ${match[1]}
`;

fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, output, 'utf8');

console.log('Synced schedule data to src/data/scheduleData.js');
