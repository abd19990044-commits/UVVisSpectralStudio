# UV–Vis Spectral Studio

**A browser-based workspace for UV–visible absorbance spectra, derivative spectrophotometry, spectral overlays, and manuscript-oriented figures.**

[**Launch the live app**](https://abd19990044-commits.github.io/UVVisSpectralStudio/) · [Source code](https://github.com/abd19990044-commits/UVVisSpectralStudio/blob/main/index.html)

UV–Vis Spectral Studio is a single-file HTML/CSS/JavaScript application. Spectra are processed in the browser: no account, server-side spectral analysis, or installation is required. The interface can switch between **English and Arabic**; scientific axis labels and units remain **in English** in both modes.

## Features

| Area | Capabilities |
| --- | --- |
| Import | TXT, CSV, TSV and XLSX; multiple spectra; multi-column and multi-sheet XLSX; manual wavelength/absorbance column mapping |
| Visualization | Overlaid spectra, separate D0–D4 views, sample visibility, line colors and styles, interactive wavelength cursor and horizontal zoom |
| Derivatives | First through fourth derivatives using local polynomial least-squares fits on the actual wavelength coordinates |
| Axes | Editable limits, figure title and axis labels; inward-facing ticks; white scientific plotting area |
| Output | SVG, PNG at selectable 600/900/1200 DPI and physical width, and CSV containing displayed numerical curves |
| Presentation | Light/dark interface, English/Arabic controls and an optional journal-figure layout |

### Analytical notation

The original signal is absorbance **A**; the horizontal axis is **Wavelength (nm)**. In the default plot, the vertical title is **Absorbance**. Derivative plots use the corresponding expressions and units:

| View | Y-axis label |
| --- | --- |
| D0 | Absorbance |
| D1 | dA/dλ (nm⁻¹) |
| D2 | d²A/dλ² (nm⁻²) |
| D3 | d³A/dλ³ (nm⁻³) |
| D4 | d⁴A/dλ⁴ (nm⁻⁴) |

Absorbance is dimensionless; the wavelength-derivative units follow from using nm as the wavelength unit. The initial **D0** display limits are **200–800 nm** (X) and **0–2.5** (Y). Axis limits can be edited; higher-derivative views can use automatically determined Y limits so negative and small derivative values are not hidden.

## Quick start

1. Open the [live application](https://abd19990044-commits.github.io/UVVisSpectralStudio/), or download [`index.html`](index.html) and open it in a modern browser.
2. Import a TXT/CSV/TSV/XLSX file, or select **Load synthetic example** to explore the controls. Synthetic examples are **not experimental measurements**.
3. If automatic wavelength or absorbance detection is ambiguous, use **Manual column mapping**.
4. Choose the original spectrum or derivative order D1–D4, then adjust the local-fit window and polynomial degree when needed.
5. Set the plotted wavelength/absorbance region and axis labels, inspect the overlaid curves, and export SVG/PNG or numerical CSV.

A simple CSV/TXT input is:

```csv
Wavelength (nm),Sample A,Sample B
200,0.032,0.050
201,0.035,0.051
202,0.039,0.055
```

For delimiter-separated text, use a comma, tab, semicolon or whitespace as appropriate. A real wavelength column is required: **the application does not invent missing wavelength values**. For legacy binary `.xls` files, save a copy as `.xlsx` or `.csv` first.

## Preparing figures for publication

The **Journal figure** option omits the embedded title and credit from the exported plot while retaining the legend, so a journal's figure caption can be supplied separately. Both exported SVG and PNG originate from the same SVG plotting logic used by the on-screen chart; PNG is rasterized at the selected physical width and DPI.

For a submission, check the target journal's requirements for final figure size, text legibility, file format and resolution. **“Publication-ready” describes available formatting and export controls; it is not a guarantee of acceptance by a Q1 journal or validation of an analytical method.** Keep figures, captions, experimental conditions, and method-validation evidence consistent with the underlying measurements.

## Numerical and scientific notes

- Derivatives are estimated by local polynomial least squares against the **measured wavelength coordinates**, not the point index. The available fit-window and polynomial-degree controls influence smoothness and derivative stability.
- Higher-order derivatives amplify experimental noise and can be sensitive to window choice, uneven wavelength spacing and edges; inspect the original spectrum and perform parameter-sensitivity checks.
- Missing readings and sufficiently large wavelength gaps are treated as discontinuities rather than silently joined for derivative estimation.
- Cursor readings can use the nearest measured point or indicated linear interpolation; CSV tabulation can interpolate between available readings but leaves positions outside spectra or across gaps empty.
- An overlay or matching profile alone does not establish chemical identity. The software is a processing and visualization aid, **not a substitute for experimental method validation**.

## Deployment and privacy

This repository publishes the static application from [`index.html`](index.html) using GitHub Pages. You can also open that file locally, without a build step. Imported spectra are processed in the browser by the application; uploading files in its import control is not a request to upload those spectra to a project backend. As with any hosted page, the hosting provider can receive ordinary requests for the page itself.

## Developer

**ABDULSALAM S. HASAN**

## License

**Copyright © 2026 ABDULSALAM S. HASAN. All rights reserved.** The current repository is distributed under a [proprietary license](LICENSE): public access does not grant permission to copy, modify, redistribute, or republish the covered source code. Normal operation of the officially hosted app, applicable legal exceptions, and rights required by GitHub's terms are unaffected. **Earlier copies distributed under the MIT License retain their previously granted MIT permissions**; changing this repository's license does not revoke those earlier grants.
