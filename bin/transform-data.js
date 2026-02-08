import { SmartData } from './smart-data/index.js';
import path from 'node:path';
import CONSTS from '../src/consts/index.json' with { type: 'json' };
import fs from 'node:fs';

function main(sFileName, sDestPath) {
    const sd = new SmartData({ data: CONSTS });
    const aRows = sd.loadCSV(sFileName);
    const oOutput = sd.run(aRows);
    Object.entries(oOutput)
        .filter(([sFile]) => sFile !== '')
        .forEach(([sFile, oStruct]) => {
            const sFileFinal = path.resolve(sDestPath, sFile + '.json');
            fs.writeFileSync(sFileFinal, JSON.stringify(oStruct, null, '  '));
        });
}

main(process.argv[2], process.argv[3]);
