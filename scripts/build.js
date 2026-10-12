import {build} from 'esbuild';
await build({entryPoints:['public/app.js'],bundle:true,format:'esm',outfile:'dist/app.js',minify:true});
console.log('Browser bundle validated. Run npm start for the local WebSocket application.');
