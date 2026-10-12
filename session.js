export class Session {
  constructor(clock=Date.now){this.clock=clock;this.round=1;this.scores=[0,0];this.remaining=300000;this.running=false;this.active=1;this.seen=new Set();this.last=null;this.anchor=clock();}
  tick(){const now=this.clock();if(this.running){this.remaining=Math.max(0,this.remaining-(now-this.anchor));if(!this.remaining)this.running=false;}this.anchor=now;}
  snapshot(){this.tick();return {round:this.round,scores:[...this.scores],remaining:this.remaining,running:this.running,active:this.active,last:this.last};}
  apply(e){this.tick();if(!e||typeof e.id!=='string'||e.id.length>100||!e.id||e.round!==this.round||this.seen.has(e.id))return false;
    if(!['start','pause','reset','select','rose'].includes(e.type))return false;
    if(['select','rose'].includes(e.type)&&![1,2].includes(e.candidate))return false;
    this.seen.add(e.id);
    if(e.type==='start'&&this.remaining>0)this.running=true;
    if(e.type==='pause')this.running=false;
    if(e.type==='select')this.active=e.candidate;
    if(e.type==='rose'){this.scores[e.candidate-1]++;this.last={id:e.id,candidate:e.candidate,at:this.clock()};}
    if(e.type==='reset'){this.round++;this.scores=[0,0];this.remaining=300000;this.running=false;this.last=null;this.seen.clear();}
    return true;
  }
}
