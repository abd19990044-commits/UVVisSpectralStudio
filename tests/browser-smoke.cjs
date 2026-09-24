'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');

async function run(){
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({acceptDownloads:true,viewport:{width:1440,height:900}});
 const errors=[];
 page.on('pageerror',err=>errors.push(err.message));
 try{
  await page.goto(pathToFileURL(path.resolve(__dirname,'..','index.html')).href);
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'light');
  await page.locator('#themeToggle').click();
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'dark');
  await page.reload();
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'light');

  const citation=page.locator('#citationText');
  assert.match(await citation.inputValue(),/Hasan, A\. S\. \(2026\)/);
  assert.match(await citation.inputValue(),/Version v1\.2\.0/);
  assert.match(await citation.inputValue(),/\[Computer software\]\. Zenodo\. https:\/\/doi\.org\/10\.5281\/zenodo\.22923132/);
  assert.match(await citation.inputValue(),/https:\/\/doi\.org\/10\.5281\/zenodo\.22923132/);
  assert.equal(await page.locator('#citationPanel .citation-doi a').getAttribute('href'),
    'https://doi.org/10.5281/zenodo.22923132');
  const citationLayout=await citation.evaluate(el=>({
    panelWidth:el.closest('.field').getBoundingClientRect().width,
    width:el.getBoundingClientRect().width,
    height:el.getBoundingClientRect().height,
    fontSize:parseFloat(getComputedStyle(el).fontSize)
  }));
  assert.ok(citationLayout.width>=citationLayout.panelWidth-3,
    'Citation textarea must fill its parent instead of collapsing to a narrow default width');
  assert.ok(citationLayout.height>=100,'Citation must be tall enough to read');
  assert.ok(citationLayout.fontSize>=14,'Citation text must be legible');
  await page.locator('#copyCitation').click();
  await page.waitForFunction(()=>/copied|نُسخ|Select the text|حدّد النص/i.test(document.querySelector('#citationStatus').textContent));
  await page.locator('#langToggle').click();
  assert.match(await page.locator('#citationPanel h2').textContent(),/الاستشهاد/);
  await page.locator('#langToggle').click();
  assert.match(await citation.inputValue(),/UV[-–]Vis Spectral Studio/);
  await page.locator('#demo').click();
  await page.locator('#xmin').fill('270');
  await page.locator('#xmax').fill('400');
  await page.locator('#axisApply').click();
  await page.locator('#processMin').fill('270');
  await page.locator('#processMax').fill('400');
  await page.locator('#applyProcess').click();
  await page.locator('#view').selectOption('all');
  assert.equal(await page.locator('#overview .mini').count(),4);
  await page.locator('#overview .mini').first().click();
  assert.equal(await page.locator('#overview .mini').count(),4);
  assert.equal(await page.locator('#view').inputValue(),'1');
  assert.ok((await page.locator('#chart').innerHTML()).includes('270.0'));
  assert.ok((await page.locator('#chart').innerHTML()).includes('400.0'));

  const baselineDownload=page.waitForEvent('download');
  await page.locator('#exportData').click();
  const baselineCsv=fs.readFileSync(await (await baselineDownload).path(),'utf8');
  const numericRows=s=>s.replace(/^\uFEFF/,'').split(/\r?\n/).filter(l=>/^\d+(?:\.\d+)?,/.test(l));
  const baselineZoomRows=numericRows(baselineCsv).filter(line=>{const w=Number(line.split(',')[0]);return w>=300&&w<=350;});
  assert.ok(baselineZoomRows.length>=40,'Expected measured wavelengths in zoomed range');
  await page.locator('#xmin').fill('300');
  await page.locator('#xmax').fill('350');
  await page.locator('#axisApply').click();
  assert.ok((await page.locator('#chart').innerHTML()).includes('300.0'));
  const zoomDownload=page.waitForEvent('download');
  await page.locator('#exportData').click();
  const zoomCsv=fs.readFileSync(await (await zoomDownload).path(),'utf8');
  assert.deepEqual(numericRows(zoomCsv),baselineZoomRows,
    'Zooming must preserve exact numeric derivative data at common wavelengths');
  await page.locator('#fitData').click();
  await page.locator('#xmin').fill('270');
  await page.locator('#xmax').fill('400');
  await page.locator('#axisApply').click();
  await page.locator('#view').selectOption('4');
  assert.ok((await page.locator('#chart').innerHTML()).includes('e-'));
  await page.locator('#langToggle').click();
  assert.ok((await page.locator('#chart').innerHTML()).includes('Wavelength (nm)'));

  await page.locator('#measurementStart').fill('300');
  await page.locator('#measurementEnd').fill('380');
  await page.locator('#noiseStart').fill('290');
  await page.locator('#noiseEnd').fill('305');
  await page.locator('#analyzeSpectrum').click();
  assert.match(await page.locator('#analysisResults').textContent(),/Global peak-to-peak/);
  assert.match(await page.locator('#analysisResults').textContent(),/signal \/ sample SD/);
  const metricsDownload=page.waitForEvent('download');
  await page.locator('#exportMetrics').click();
  const metrics=fs.readFileSync(await (await metricsDownload).path(),'utf8');
  assert.ok(metrics.includes('Global peak-to-peak'));
  assert.ok(metrics.includes('Noise sample SD'));
  await page.locator('#sensitivityRun').click();
  assert.match(await page.locator('#sensitivityResults').textContent(),/W=15 points/);
  assert.match(await page.locator('#sensitivityResults').textContent(),/median/);
  const sensitivityDownload=page.waitForEvent('download');
  await page.locator('#sensitivityExport').click();
  const sensitivityCsv=fs.readFileSync(await (await sensitivityDownload).path(),'utf8');
  assert.ok(sensitivityCsv.includes('median_span_nm'));
  assert.ok(sensitivityCsv.includes('no automatic window recommendation'));
  const csvPromise=page.waitForEvent('download');
  await page.locator('#exportData').click();
  const csv=fs.readFileSync(await (await csvPromise).path(),'utf8');
  assert.ok(csv.includes('Derivative processing wavelength (nm): 270 .. 400'));
  assert.ok(csv.includes('Fit points:'));
  await page.locator('#showCurveLegend').uncheck();
  await page.locator('#imageWidth').fill('1');
  await page.locator('#dpi').selectOption('600');
  const svgPromise=page.waitForEvent('download');
  await page.locator('#exportSvg').click();
  const svgDownload=await svgPromise;
  const svg=fs.readFileSync(await svgDownload.path(),'utf8');
  assert.ok(svg.includes('Wavelength (nm)'));
  assert.ok(!svg.includes('Developed by'));
  assert.ok(!svg.includes('Sample A'));

  const pngPromise=page.waitForEvent('download');
  await page.locator('#exportPng').click();
  const pngDownload=await pngPromise;
  const png=fs.readFileSync(await pngDownload.path());
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
  assert.equal(width,600,'One inch at 600 DPI must rasterize to 600 pixels');
  assert.ok(height>200&&height<1000);
  let off=8,ppm=null;
  while(off+12<=png.length){const len=png.readUInt32BE(off),type=png.toString('ascii',off+4,off+8);
   if(type==='pHYs'){ppm=[png.readUInt32BE(off+8),png.readUInt32BE(off+12),png[off+16]];break;}
   off+=12+len;
  }
  assert.ok(ppm,'PNG must contain physical-resolution metadata');
  assert.equal(ppm[2],1);
  assert.ok(Math.abs(ppm[0]-Math.round(600/0.0254))<=1,'PNG X DPI metadata');
  assert.ok(Math.abs(ppm[1]-Math.round(600/0.0254))<=1,'PNG Y DPI metadata');

  await page.locator('#upload').setInputFiles({
   name:'Imported.csv',mimeType:'text/csv',buffer:Buffer.from(
    'Wavelength (nm),NAP\n'+Array.from({length:31},(_,i)=>
      (270+i)+','+(0.4+Math.sin(i/6)*.1)).join('\n')+'\n'
   )
  });
  await page.waitForFunction(()=>document.querySelectorAll('#samples [data-name]').length===4);
  await page.locator('#mapApply').click();
  await page.locator('#mapApply').click();
  assert.equal(await page.locator('#samples [data-name]').count(),4,
    'Repeated import of same column must not add curves');
  await page.locator('#upload').setInputFiles({name:'DeepUV.txt',mimeType:'text/plain',buffer:Buffer.from(Array.from({length:21},(_,i)=>(185+i)+' '+(.2+i*.01)).join('\n'))});
  await page.waitForFunction(()=>document.querySelectorAll('#samples [data-name]').length===5);
  const inputMin=await page.locator('#samples [data-name]').last().evaluate(el=>el.parentElement.textContent);
  assert.ok(inputMin.includes('185'),'Valid 185 nm readings must remain');
  await page.locator('#upload').setInputFiles({name:'AmbiguousAxis.csv',mimeType:'text/csv',
   buffer:Buffer.from('X,Absorbance\n'+Array.from({length:15},(_,i)=>(4000-i*50)+','+(0.1+i*.01)).join('\n'))});
  await page.waitForFunction(()=>document.querySelectorAll('#samples [data-name]').length===6);
  assert.match(await page.locator('#status').textContent(),/unusual|غير معتاد/i);
  await page.locator('#upload').setInputFiles(path.join(__dirname,'multisheet_fixture.xlsx'));
  await page.waitForFunction(()=>document.querySelectorAll('#samples [data-name]').length===8);
  const summaries=await page.locator('#samples [data-name]').evaluateAll(els=>els.slice(-2).map(el=>el.parentElement.textContent));
  assert.ok(summaries[0].includes('185'),'First XLSX sheet must retain 185 nm');
  assert.ok(summaries[1].includes('310'),'Second XLSX sheet must retain 310 nm');
  await page.locator('#prepMode').selectOption('baseline');
  await page.locator('#prepApply').click();
  await page.waitForFunction(()=>document.querySelectorAll('#samples [data-name]').length===9);
  assert.match(await page.locator('#prepStatus').textContent(),/derived|processed|جديد|معالج/i);
  const originalSummary=await page.locator('#samples [data-name]').first().evaluate(el=>el.parentElement.textContent);
  assert.match(originalSummary,/301/,'Original demo spectrum must remain unchanged');
  const derivedCsvPromise=page.waitForEvent('download');
  await page.locator('#exportData').click();
  const derivedCsv=fs.readFileSync(await (await derivedCsvPromise).path(),'utf8');
  assert.ok(derivedCsv.includes('Curve provenance'));
  assert.ok(derivedCsv.includes('operation=baseline'));
  assert.deepEqual(errors,[],'No uncaught browser errors');
  process.stdout.write('Browser smoke tests passed: ROI, gallery, theme, Arabic labels, SVG, PNG, duplicate prevention.\n');
 }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
