'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
module.exports=function renderHarness(){
 const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
 const controls={chartTitle:{value:''},showCurveLegend:{checked:false},publicationMode:{checked:false},
  xTickMode:{value:'auto'},yTickMode:{value:'auto'},xTickCount:{value:'4'},yTickCount:{value:'5'},
  xTickStep:{value:'50'},yTickStep:{value:'0.2'},curveWidth:{value:'1.7'},axisWidth:{value:'1.3'},
  tickWidth:{value:'1.2'},derivativeAxisFormat:{value:'scaled'}};
 const ctx={$:id=>{if(!controls[id])throw Error(id);return controls[id];},
  E:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
  t:String,NS:'http://www.w3.org/2000/svg',xAxisLabel:()=> 'Wavelength (nm)',
  axisLabel:n=>n?'Derivative':'Absorbance'};
 vm.createContext(ctx);
 vm.runInContext(html.slice(html.indexOf('function pathOf('),html.indexOf('function boundsMini(')),ctx);
 const data=[{x:[200,201,202,203,204,205,206],y:[-.01,.1,.4,NaN,.7,.2,0],breaks:[4],
  s:{name:'Sample A',color:'#145c9a',style:'solid'}},
  {x:[200,201,202,203,204,205,206],y:[0,.2,.5,.8,.5,.2,0],breaks:[],
  s:{name:'Sample B & reference',color:'#bb4f21',style:'dash',lineWidth:2.4}}];
 const cases=[
  {name:'default',bounds:{xmin:200,xmax:800,ymin:0,ymax:1}},
  {name:'legend',legend:true,bounds:{xmin:200,xmax:206,ymin:-.1,ymax:1}},
  {name:'small-absorbance',bounds:{xmin:200,xmax:206,ymin:.001,ymax:.003}},
  {name:'manual-ticks',xTickMode:'count',yTickMode:'step',bounds:{xmin:201.5,xmax:205.5,ymin:-.2,ymax:1}},
  {name:'preview',preview:true,bounds:{xmin:200,xmax:206,ymin:-.1,ymax:1}}
 ];
 const renderD0=spec=>{
  controls.showCurveLegend.checked=!!spec.legend;
  controls.publicationMode.checked=true;
  controls.xTickMode.value=spec.xTickMode||'auto';
  controls.yTickMode.value=spec.yTickMode||'auto';
  return ctx.buildSvg(data,0,spec.bounds,!!spec.preview).svg;
 };
 return {ctx,controls,data,cases,renderD0};
};
