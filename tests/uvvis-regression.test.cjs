'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const html=fs.readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
const match=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(match,'Inline application script must exist');
const script=match[1];
const extract=(start,end)=>{
 const i=script.indexOf(start),j=script.indexOf(end,i+start.length);
 assert.ok(i>=0&&j>i,'Missing production source anchors: '+start);
 return script.slice(i,j);
};
const controls={
 xmin:{value:'270'},xmax:{value:'400'},window:{value:'15'},
 degree:{value:'4'},edgeMode:{checked:true},
 chartTitle:{value:''},showCurveLegend:{checked:false}
};
const ctx={
 $:id=>{assert.ok(controls[id],'Unknown mocked control: '+id);return controls[id];},
 t:key=>key, E:s=>String(s), fmt:v=>String(v),
 NS:'http://www.w3.org/2000/svg',
 xAxisLabel:()=> 'Wavelength (nm)',
 axisLabel:order=>order?'Derivative':'Absorbance'
};
vm.createContext(ctx);
vm.runInContext(extract('function factorial(','function interp('),ctx);

test('Complete inline application JavaScript parses',()=>{
 assert.doesNotThrow(()=>new vm.Script(script,{filename:'index.html:inline'}));
});
test('ROI excludes noisy UV region and retains raw data unchanged',()=>{
 const x=Array.from({length:301},(_,i)=>200+i);
 const y=x.map(w=>w<270?100*Math.sin(w):.5+.002*(w-330)+.00001*(w-330)**2+1e-8*(w-330)**4);
 const original={name:'Example',x,y,breaks:[],cache:{},color:'#145c9a',style:'solid'};
 const expected=[0,.002,.00002,0,2.4e-7],tolerance=[0,1e-10,1e-10,1e-11,1e-10];
 for(let order=1;order<=4;order++){
  const d=ctx.useData(original,order);
  assert.equal(d.x[0],270);assert.equal(d.x.at(-1),400);assert.equal(d.x.length,131);
  const i=d.x.indexOf(330);
  assert.ok(Math.abs(d.y[i]-expected[order])<tolerance[order],`D${order}: ${d.y[i]}`);
  assert.ok(Number.isNaN(d.y[0]),'Masked boundary must not appear as reliable derivative');
  assert.ok(Number.isNaN(d.y.at(-1)),'Masked boundary must not appear as reliable derivative');
 }
 assert.equal(original.x[0],200);
 assert.ok(Math.abs(original.y[0])>1);
});
test('Too-narrow ROI reports inability to fit rather than fabricating derivatives',()=>{
 controls.xmin.value='330';controls.xmax.value='335';
 const x=Array.from({length:301},(_,i)=>200+i);
 const s={name:'Narrow',x,y:x.map(w=>w*w),breaks:[],cache:{}};
 assert.throws(()=>ctx.useData(s,4),/nPoints/);
 controls.xmin.value='270';controls.xmax.value='400';
});
test('ROI caches are bounded while changing zoom',()=>{
 const x=Array.from({length:301},(_,i)=>200+i);
 const s={name:'Memory',x,y:x.map(w=>Math.sin(w/100)),breaks:[],cache:{}};
 for(let i=0;i<10;i++){
  controls.xmin.value=String(270+i);controls.xmax.value='400';
  ctx.useData(s,1);
 }
 assert.ok(s.cache.__roiKeys.length<=3);
 assert.ok(Object.keys(s.cache).filter(k=>k.startsWith('roi:')).length<=3);
 controls.xmin.value='270';
});
test('Source plotting logic formats D0 in 0.10 multiples and D4 scientifically',()=>{
 vm.runInContext(extract('function pathOf(','function geometry('),ctx);
 vm.runInContext(extract('function geometry(','function boundsMini('),ctx);
 const d={x:[200,300,400],y:[0,.8,.3],breaks:[],s:{name:'Sample',color:'#145c9a',style:'solid'}};
 const svg=ctx.buildSvg([d],0,{xmin:200,xmax:400,ymin:0,ymax:1.2}).svg;
 for(const y of ['0.00','0.20','0.40','0.60','0.80','1.00','1.20'])
  assert.ok(svg.includes('>'+y+'</text>'),y+' missing');
 assert.ok(svg.includes('>200.0</text>'));
 const small=ctx.buildSvg([d],4,{xmin:270,xmax:400,ymin:-2e-5,ymax:3e-5}).svg;
 assert.match(small,/e-5/);
 assert.ok(!small.includes('>0.00</text>'));
});
test('SVG and PNG share source plotting function',()=>{
 assert.ok(script.includes('function exportPlotMarkup(plot){return buildSvg(plot.data,plot.order,plot.B).svg;}'));
 assert.ok(script.includes('svgImage(exportPlotMarkup(plot))'));
 assert.ok(script.includes('svg=exportPlotMarkup(plotState)'));
});
