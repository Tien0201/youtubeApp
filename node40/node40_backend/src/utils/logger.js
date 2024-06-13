// const { format } = require('date-fns');
// const {v4 : uuid} = require('uuid');
// const fs = require('fs');
// const fsPromises = require('fs').promises;
// const path = require('path');

import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import url from 'url'

const { fileURLToPath } = url;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logEvents = async (message, logFileName) => {
    const datetime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${datetime}\t${uuid()}\t${message}\n`;

    try {
        const logsDir = path.join(__dirname, '..', 'logs');
        if (!fs.existsSync(logsDir)) {
            await fsPromises.mkdir(logsDir);
        }
        await fsPromises.appendFile(path.join(logsDir, logFileName), logItem);
    } catch (err) {
        console.log(err);
    }
};

const logger = (req,res,next) =>{
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,'reqLog.txt');
    console.log('path',`${req.method} ${req.path}`);
    next()
}
export { logEvents , logger}