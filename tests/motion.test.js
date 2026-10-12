import test from 'node:test';
import assert from 'node:assert/strict';
import {rosePose, idlePose} from '../public/motion.js';
test('rose remains above the stage and reaches the selected podium',()=>{
 for(const target of [-2.1,2.1]){
  for(let t=0;t<=1;t+=.05)assert.ok(rosePose(t,target).y>=1);
  const end=rosePose(1,target);assert.equal(end.x,target);assert.equal(end.z,.8);assert.equal(end.y,2.1);
 }
});
test('idle motion is visible and reduced motion stays still',()=>{
 assert.ok(Math.abs(idlePose(0,0,false).y-idlePose(1000,0,false).y)>.1);
 assert.deepEqual(idlePose(0,0,true),idlePose(1000,0,true));
});
