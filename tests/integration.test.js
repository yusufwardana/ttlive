import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {WebSocket} from 'ws';

test('HTTP routes and two independent WebSocket clients share authoritative state',async()=>{
 const child=spawn(process.execPath,['server.js'],{env:{...process.env,PORT:'3011'},stdio:['ignore','pipe','pipe']});
 const clients=[];
 try {
  await Promise.race([once(child.stdout,'data'),new Promise((_,reject)=>setTimeout(()=>reject(Error('Server startup timed out')),5000).unref())]);
  for(const route of ['/overlay','/control','/preview','/app.js','/three.js','/three.core.js','/style.css'])assert.equal((await fetch('http://127.0.0.1:3011'+route)).status,200);
  assert.equal((await fetch('http://127.0.0.1:3011/missing')).status,404);
  const connect=()=>new Promise(resolve=>{const ws=new WebSocket('ws://127.0.0.1:3011');clients.push(ws);ws.once('message',()=>resolve(ws));});
  const a=await connect(),b=await connect();
  const wait=(ws,predicate)=>new Promise((resolve,reject)=>{const timeout=setTimeout(()=>{ws.off('message',onMessage);reject(Error('State timeout'));},3000);function onMessage(raw){const s=JSON.parse(raw);if(predicate(s)){clearTimeout(timeout);ws.off('message',onMessage);resolve(s);}}ws.on('message',onMessage);});
  const event={type:'rose',id:'same-event',round:1,candidate:2};
  const received=wait(b,s=>s.scores[1]===1);a.send(JSON.stringify(event));a.send(JSON.stringify(event));await received;
  const confirmation=await wait(b,s=>s.scores[1]>0);assert.deepEqual(confirmation.scores,[0,1]);
  const reset=wait(b,s=>s.round===2);a.send(JSON.stringify({type:'reset',id:'reset',round:1}));assert.deepEqual((await reset).scores,[0,0]);
 }finally{clients.forEach(c=>c.terminate());child.kill();}
});
