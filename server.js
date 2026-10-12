import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {WebSocketServer,WebSocket} from 'ws';
import {Session} from './session.js';
const session=new Session();
const routes={'/':'index.html','/preview':'index.html','/overlay':'index.html','/control':'index.html','/app.js':'app.js','/motion.js':'motion.js','/style.css':'style.css','/three.js':'../node_modules/three/build/three.module.js','/three.core.js':'../node_modules/three/build/three.core.js'};
const server=http.createServer(async(req,res)=>{const path=new URL(req.url,'http://localhost').pathname;const file=routes[path];if(!file){res.writeHead(404);return res.end('Not found');}try{const data=await readFile(new URL('./public/'+file,import.meta.url));res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':'text/javascript','Cache-Control':'no-store'});res.end(data);}catch{res.writeHead(500);res.end('Asset unavailable');}});
const wss=new WebSocketServer({server,maxPayload:2048});
function broadcast(){const data=JSON.stringify(session.snapshot());for(const c of wss.clients)if(c.readyState===WebSocket.OPEN)c.send(data);}
wss.on('connection',(ws,req)=>{const origin=req.headers.origin;if(origin&&new URL(origin).host!==req.headers.host){ws.close(1008);return;}ws.send(JSON.stringify(session.snapshot()));ws.on('message',raw=>{try{if(session.apply(JSON.parse(raw)))broadcast();}catch{ /* Invalid local input is ignored. */ }});});
setInterval(broadcast,200);
server.listen(Number(process.env.PORT)||3000,'127.0.0.1',()=>console.log('Local simulation: http://localhost:3000/preview'));

