"""Create a deterministic multi-sheet XLSX fixture using only Python's standard library."""
from pathlib import Path
from zipfile import ZipFile, ZIP_STORED
from xml.sax.saxutils import escape

out=Path(__file__).with_name("multisheet_fixture.xlsx")
ns='http://schemas.openxmlformats.org/spreadsheetml/2006/main'
rel='http://schemas.openxmlformats.org/officeDocument/2006/relationships'
sheets=[]
for sheet,series in [(1,'A'),(2,'B')]:
    rows=[f'<row r="1"><c r="A1" t="inlineStr"><is><t>λ (nm)</t></is></c><c r="B1" t="inlineStr"><is><t>Absorbance {series}</t></is></c></row>']
    for k in range(20):
        wavelength=185+k if sheet==1 else 310+k
        absorbance=.2+k*.01+(sheet-1)*.1
        rows.append(f'<row r="{k+2}"><c r="A{k+2}"><v>{wavelength}</v></c><c r="B{k+2}"><v>{absorbance:.8f}</v></c></row>')
    sheets.append(f'<?xml version="1.0" encoding="utf-8"?><worksheet xmlns="{ns}"><sheetData>{"".join(rows)}</sheetData></worksheet>')
workbook=f'<?xml version="1.0" encoding="utf-8"?><workbook xmlns="{ns}" xmlns:r="{rel}"><sheets><sheet name="UV deep" sheetId="1" r:id="rId1"/><sheet name="UV blue" sheetId="2" r:id="rId2"/></sheets></workbook>'
relationships=f'<?xml version="1.0" encoding="utf-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="{rel}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="{rel}/worksheet" Target="worksheets/sheet2.xml"/></Relationships>'
with ZipFile(out,'w',compression=ZIP_STORED) as z:
    z.writestr('xl/workbook.xml',workbook)
    z.writestr('xl/_rels/workbook.xml.rels',relationships)
    for i,content in enumerate(sheets,1):
        z.writestr(f'xl/worksheets/sheet{i}.xml',content)
print(out)
