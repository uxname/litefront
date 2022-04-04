import * as fs from 'fs';
import path from 'path';

export function loadTypeDefs(): string {
    const dir = './src/pages/api/schema';
    const files: Array<string> = fs.readdirSync(dir);
    let result = '';

    for (const fileName of files) {
        if (fileName === 'index.ts') {
            continue;
        }
        const schema = fs.readFileSync(path.join(dir, fileName)).toString('utf-8');
        result += `\n${schema}`;
    }

    return result;
}
