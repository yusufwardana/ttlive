export function rosePose(progress,target){
 const t=Math.max(0,Math.min(1,progress));
 return {x:target*t,y:t===1?2.1:1.1+t+Math.sin(t*Math.PI)*1.5,z:t===1?.8:3.8-3*t};
}
export function idlePose(time,index,reduced){
 const phase=time*.0018+index*Math.PI;
 return {y:reduced?1.65:1.65+Math.sin(phase)*.16,rotation:reduced?0:Math.sin(phase*.7)*.24,pulse:reduced?1:1+Math.sin(phase)*.12};
}
