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
vm.runInContext('let processingRange={lo:270,hi:400};',ctx);
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
 vm.runInContext('processingRange={lo:330,hi:335}',ctx);
 const x=Array.from({length:301},(_,i)=>200+i);
 const s={name:'Narrow',x,y:x.map(w=>w*w),breaks:[],cache:{}};
 assert.throws(()=>ctx.useData(s,4),/nPoints/);
 vm.runInContext('processingRange={lo:270,hi:400}',ctx);
});
test('ROI caches are bounded while changing processing range',()=>{
 const x=Array.from({length:301},(_,i)=>200+i);
 const s={name:'Memory',x,y:x.map(w=>Math.sin(w/100)),breaks:[],cache:{}};
 for(let i=0;i<10;i++){
  vm.runInContext('processingRange={lo:'+(270+i)+',hi:400}',ctx);
  ctx.useData(s,1);
 }
 assert.ok(s.cache.__roiKeys.length<=3);
 assert.ok(Object.keys(s.cache).filter(k=>k.startsWith('roi:')).length<=3);
 vm.runInContext('processingRange={lo:270,hi:400}',ctx);
});
test('Changing only display X limits never changes computed derivatives',()=>{
 const x=Array.from({length:201},(_,i)=>250+i),y=x.map(w=>Math.exp(-(((w-330)/23)**2)));
 const s={name:'Stable',x,y,breaks:[],cache:{}};
 vm.runInContext('processingRange={lo:270,hi:400}',ctx);
 const before=ctx.useData(s,2).y.slice();
 controls.xmin.value='300';controls.xmax.value='350';
 const after=ctx.useData(s,2).y;
 assert.deepEqual(before,after);
 controls.xmin.value='270';controls.xmax.value='400';
});
test('CSV and import hard limits are absent',()=>{
 assert.ok(!script.includes('x>=200&&x<=3000'));
 assert.ok(!script.includes('v>=200&&v<=3000'));
 assert.ok(script.includes('function exportedCsv()'));
 assert.ok(script.includes('per-value provenance')||script.includes('provenance'));
});
test('Derivative never crosses gaps or masked boundaries',()=>{
 vm.runInContext('processingRange={lo:200,hi:260}',ctx);
 const x=Array.from({length:61},(_,i)=>200+i);
 const left=x.map((w,i)=>i<31?Math.sin(i/9):0);
 const sA={name:'Gap A',x,y:left.map((v,i)=>i<31?v:100+10*i),breaks:[31],cache:{}};
 const sB={name:'Gap B',x,y:left.map((v,i)=>i<31?v:-1000-300*i),breaks:[31],cache:{}};
 for(const order of [1,2,3,4]){
  const a=ctx.useData(sA,order),b=ctx.useData(sB,order);
  for(let i=7;i<=23;i++)assert.ok(Math.abs(a.y[i]-b.y[i])<1e-10,'Gap leakage D'+order);
  assert.ok(Number.isNaN(a.y[30]),'Mask must exclude near-gap edge D'+order);
  assert.ok(Number.isNaN(a.y[31]),'Mask must exclude next-segment edge D'+order);
 }
 vm.runInContext('processingRange={lo:270,hi:400}',ctx);
});
test('Gap-aware extrema, signed area and zero-crossing candidates',()=>{
 vm.runInContext(extract('function analyticalMetrics(','function interp('),ctx);
 const s={x:[0,1,2,3,4],y:[-1,1,2,-2,1],breaks:[4]};
 const m=ctx.analyticalMetrics(s,0,4);
 assert.equal(m.highest.y,2);assert.equal(m.lowest.y,-2);
 assert.equal(m.peakToPeak,4);
 assert.equal(m.area,1.5,'Trapezoidal area must not bridge the gap at x=4');
 assert.deepEqual(Array.from(m.zeros,z=>z.x),[.5,2.5],
  'Opposite-sign readings separated by a gap must not create a crossing');
 assert.throws(()=>ctx.analyticalMetrics(s,4,4),/Invalid/);
});
test('User-specified noise region is required for finite S/N',()=>{
 const s={x:[0,1,2,3,4,5],y:[.1,.2,.1,2,-1,.1],breaks:[]};
 const bare=ctx.analyticalMetrics(s,0,5);
 assert.equal(bare.noise,null);
 const measured=ctx.analyticalMetrics(s,0,5,{lo:0,hi:2});
 assert.equal(measured.noise.n,3);
 assert.ok(Number.isFinite(measured.noise.snr));
});
test('Non-destructive preprocessing preserves source and units',()=>{
 vm.runInContext(extract('function interp(','function visible('),ctx);
 vm.runInContext(extract('function measuredAt(','function qualityPanel('),ctx);
 vm.runInContext(extract('function updatePrepOptions(','function analyticalMetrics('),ctx);
 vm.runInContext('processingRange={lo:270,hi:300}',ctx);
 const x=Array.from({length:31},(_,i)=>270+i);
 const originalY=x.map(w=>.5+.01*(w-270));
 const source={id:1,name:'Measured',x,y:originalY.slice(),breaks:[],cache:{}};
 const reference={id:2,name:'Blank',x,y:x.map(()=>.2),breaks:[],cache:{}};
 const baseline=ctx.prepareProcessedCurve(source,null,'baseline');
 assert.equal(baseline.x[0],270);assert.equal(baseline.x.at(-1),300);
 assert.ok(baseline.y.every(z=>Math.abs(z)<1e-10));
 assert.deepEqual(source.y,originalY,'Raw spectrum must never be edited');
 const norm=ctx.prepareProcessedCurve(source,null,'normalize');
 assert.equal(norm.scaleType,'relative');
 assert.ok(Math.abs(Math.max(...norm.y)-1)<1e-12);
 const difference=ctx.prepareProcessedCurve(source,reference,'subtract');
 assert.ok(difference.y.every((z,i)=>Math.abs(z-(originalY[i]-.2))<1e-12));
 assert.equal(difference.scaleType,'absorbance');
 const ratio=ctx.prepareProcessedCurve(source,reference,'ratio');
 assert.equal(ratio.scaleType,'ratio');
 assert.ok(ratio.y.every((z,i)=>Math.abs(z-originalY[i]/.2)<1e-12));
 controls.edgeMode.checked=false;
 const smooth=ctx.prepareProcessedCurve(source,null,'smooth');
 assert.ok(smooth.y.every((z,i)=>Math.abs(z-originalY[i])<1e-10));
 controls.edgeMode.checked=true;
 vm.runInContext('processingRange={lo:270,hi:400}',ctx);
});
test('Reference arithmetic cannot bridge a gap or divide by zero',()=>{
 vm.runInContext('processingRange={lo:270,hi:300}',ctx);
 const x=Array.from({length:31},(_,i)=>270+i);
 const source={id:10,name:'Drug',x,y:x.map(()=>1),breaks:[],cache:{}};
 const ref={id:11,name:'Reference',x,y:x.map((_,i)=>i<15?.5:i>15?0:NaN),breaks:[16],cache:{}};
 const out=ctx.prepareProcessedCurve(source,ref,'subtract');
 assert.ok(out.x.every(w=>w!==285),'Missing or discontinuous reference values must stay absent');
 assert.ok(out.breaks.length>0,'Discontinuities must be preserved');
 assert.throws(()=>ctx.prepareProcessedCurve(source,source,'ratio'),/different reference/);
 vm.runInContext('processingRange={lo:270,hi:400}',ctx);
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
