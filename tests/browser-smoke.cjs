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

  await page.locator('#demo').click();
  await page.locator('#xmin').fill('270');
  await page.locator('#xmax').fill('400');
  await page.locator('#axisApply').click();
  await page.locator('#view').selectOption('all');
  assert.equal(await page.locator('#overview .mini').count(),4);
  await page.locator('#overview .mini').first().click();
  assert.equal(await page.locator('#overview .mini').count(),4);
  assert.equal(await page.locator('#view').inputValue(),'1');
  assert.ok((await page.locator('#chart').innerHTML()).includes('270.0'));
  assert.ok((await page.locator('#chart').innerHTML()).includes('400.0'));

  await page.locator('#view').selectOption('4');
  assert.ok((await page.locator('#chart').innerHTML()).includes('e-'));
  await page.locator('#langToggle').click();
  assert.ok((await page.locator('#chart').innerHTML()).includes('Wavelength (nm)'));

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

  await page.locator('#upload').setInputFiles({
   name:'Imported.csv',mimeType:'text/csv',buffer:Buffer.from(
    'Wavelength (nm),NAP\\n'+Array.from({length:31},(_,i)=>
      (270+i)+','+(0.4+Math.sin(i/6)*.1)).join('\\n')+'\\n'
   )
  });
  await page.waitForFunction(()=>document.querySelectorAll('#samples [data-name]').length===4);
  await page.locator('#mapApply').click();
  await page.locator('#mapApply').click();
  assert.equal(await page.locator('#samples [data-name]').count(),4,
    'Repeated import of same column must not add curves');
  assert.deepEqual(errors,[],'No uncaught browser errors');
  process.stdout.write('Browser smoke tests passed: ROI, gallery, theme, Arabic labels, SVG, PNG, duplicate prevention.\\n');
 }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
