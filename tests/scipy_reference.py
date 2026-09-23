"""Independent SciPy reference checks for the production local-polynomial derivatives."""
import json
import math
import pathlib
import subprocess
import unittest

import numpy as np
from scipy.signal import savgol_filter

ROOT = pathlib.Path(__file__).resolve().parents[1]
NODE = r"""
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const begin=html.indexOf('function factorial('),end=html.indexOf('function derivative(',begin);
if(begin<0||end<0)throw Error('Production derivative implementation not found');
const fn=new Function('x','y','indices','win','degree','orders',
html.slice(begin,end)+'return indices.map(i=>orders.map(n=>localDerivative(x,y,i,i-Math.floor(win/2),win,degree,n)));');
const p=JSON.parse(fs.readFileSync(0,'utf8'));
process.stdout.write(JSON.stringify(fn(p.x,p.y,p.indices,p.win,p.degree,p.orders)));
"""

def compute(x,y,indices,window=15,degree=4):
    p=dict(x=list(map(float,x)),y=list(map(float,y)),indices=list(map(int,indices)),
           win=window,degree=degree,orders=[1,2,3,4])
    result=subprocess.run(['node','-e',NODE],input=json.dumps(p),text=True,
        cwd=ROOT,capture_output=True,check=True)
    return np.array(json.loads(result.stdout))

class IndependentReference(unittest.TestCase):
    def test_uniform_gaussian_against_scipy(self):
        x=270+np.arange(301)*.5
        y=.05+.7*np.exp(-.5*((x-330)/19)**2)
        indices=[100,120,150,180,210]
        actual=compute(x,y,indices)
        for n in range(1,5):
            reference=savgol_filter(y,15,4,deriv=n,delta=.5,mode='interp')
            for k,i in enumerate(indices):
                self.assertAlmostEqual(actual[k,n-1],reference[i],
                    delta=max(1e-10,abs(reference[i])*2e-6),
                    msg=f'D{n} at wavelength {x[i]} nm')
    def test_irregular_nm_grid_against_analytic_polynomial(self):
        t=np.arange(301)
        x=270+t*.5+.05*np.sin(t*.6)
        z=x-330
        y=.5+.002*z+1e-5*z*z+1e-8*z**4
        indices=[95,120,150,200]
        actual=compute(x,y,indices)
        for k,i in enumerate(indices):
            zz=z[i]
            expected=[.002+4e-8*zz**3,2e-5+12e-8*zz**2,24e-8*zz,24e-8]
            for n,truth in enumerate(expected,1):
                self.assertAlmostEqual(actual[k,n-1],truth,delta=2e-9,
                    msg=f'Irregular grid D{n} at {x[i]} nm')

if __name__=='__main__':
    unittest.main()
