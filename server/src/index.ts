import { createServer }  from 'http';
import { WebSocketServer } from 'ws';
import * as path from 'path';
import * as fs from 'fs';
import { randomAlias } from './aliasGenerator';

const PORT = Number(process.env.PORT) || 3000;
const HISTORY_SIZE = 50;
const history: any[] = [];

const httpServer = createServer((req, res) => {
    // very small static file handler (serve client’s /dist)
    const file = req.url === '/' ? '/index.html' : req.url!;
    const fp   = path.join(__dirname, '../public', file);
    fs.readFile(fp, (err, data) => {
        if (err) { res.writeHead(404); return res.end('Not found'); }
        res.end(data);
    });
});

const wss = new WebSocketServer({ server: httpServer });

// @ts-ignore
wss.on('connection', socket => {
    const alias = randomAlias();

    // send greeting + backlog
    socket.send(JSON.stringify({ type: 'SYSTEM', text: `You are **${alias}**` }));
    history.forEach(h => socket.send(JSON.stringify(h)));

    // @ts-ignore
    socket.on('message', raw => {
        const msg = raw.toString().trim();
        if (!msg) return;

        const payload = { type: 'CHAT', user: alias, text: msg, ts: Date.now() };
        history.push(payload);
        if (history.length > HISTORY_SIZE) history.shift(); // ring buffer

        // broadcast to everyone
        // @ts-ignore
        wss.clients.forEach(c => c.readyState === c.OPEN && c.send(JSON.stringify(payload)));
    });
});

httpServer.listen(PORT, () => console.log(`🟢 server listening on ${PORT}`));
