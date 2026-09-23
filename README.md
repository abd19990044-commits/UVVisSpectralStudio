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
| Presentation | Light/dark interface, English/Arabic controls and a permanent journal-style figure layout and an independently switchable legend |

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
5. Set the derivative **processing range** separately from the **display axes**. Dragging or changing the display range never changes previously calculated derivatives; only **Apply processing range** does. Use **Fit to data** to show all visible measurements.
6. Inspect the original spectrum and derivative panels, then export SVG/PNG or numerical CSV.

A simple CSV/TXT input is:

```csv
Wavelength (nm),Sample A,Sample B
200,0.032,0.050
201,0.035,0.051
202,0.039,0.055
```

For delimiter-separated text, use a comma, tab, semicolon or whitespace as appropriate. A positive wavelength column in **nm** is required: **the application does not invent missing wavelength values**. Valid measured wavelengths below 200 nm and above 3000 nm are retained; wavenumber columns in cm⁻¹ require explicit conversion. For legacy binary `.xls` files, save a copy as `.xlsx` or `.csv` first.

## Preparing figures for publication

Figures omit the embedded title and credit; the legend can be shown or hidden independently. Supply a journal's figure caption separately. Both exported SVG and PNG originate from the same SVG plotting logic used by the on-screen chart; PNG is rasterized at the selected physical width and DPI.

For a submission, check the target journal's requirements for final figure size, text legibility, file format and resolution. **“Publication-ready” describes available formatting and export controls; it is not a guarantee of acceptance by a Q1 journal or validation of an analytical method.** Keep figures, captions, experimental conditions, and method-validation evidence consistent with the underlying measurements.

## Reproducibility and output provenance

**Version 1.2.0 (2026-09-23)** separates analysis from display. Processing range defaults to the full measured wavelength extent, while the initial display is 200–800 nm and 0–2.5 absorbance. To restrict fitting to 270–400 nm, enter those numbers under **Derivative processing range** and click **Apply processing range**. Keep the display range independent. `Fit to data` changes only display axes.

Derivative results use local polynomial least squares on measured wavelengths, with edge masking selected by default. The quality strip reports the actual minimum, median and maximum fitting-window spans in nm and identifies notably irregular wavelength sampling.

CSV metadata lines beginning with `#` record the software version, display and processing intervals, polynomial degree, point window and edge-mask setting. `Original wavelengths only` never fills cross-spectrum gaps; derivative values remain computed quantities at those wavelengths. `Aligned grid` explicitly adds per-spectrum provenance columns for interpolated, available and missing readings. If spreadsheet software does not skip comment lines, import the CSV beginning at the first `Wavelength (nm)` header row.

## Researcher-controlled analytical measurements

Choose one currently displayed curve and an explicit wavelength interval. The analytical panel reports the maximum/minimum ordinates and their measured wavelengths, a **global** peak-to-peak amplitude (the two extrema need not be adjacent), absolute peak-to-zero amplitude, gap-aware signed trapezoidal area, and zero-crossing candidates. A sign-change crossing is linearly interpolated **between adjacent finite points only** and is marked as interpolated; it is not an experimentally measured zero. Measurements can be exported with the derivative order, processing interval, fit configuration and edge-mask setting.

An optional **fitting-window sensitivity analysis** compares user-selected derivative curves for window lengths 11, 15, 21, 31 and the active window. It reports actual nanometer spans and dominant absolute amplitudes without declaring one window optimal, and exports a parameterized CSV.\n\nAn optional user-chosen noise interval produces a descriptive amplitude/sample-standard-deviation ratio. This is **not a determination of LOD, LOQ, instrumental S/N, or analytical selectivity**; the software does not infer a blank region automatically. Features are computed quantities, not chemical identifications.

## Non-destructive spectral preprocessing

The **Non-destructive spectral processing** panel produces a **new curve** from a selected source; it does not edit, discard or replace the original measurements. Operations use the explicit derivative-processing wavelength interval and preserve the original source wavelength positions:

- **Linear endpoint baseline correction** subtracts a straight line fitted through two user-selected, valid anchor wavelengths.
- **Local-polynomial smoothing** computes a zero-order fit using the selected point window, polynomial degree and edge-mask policy, independently within each continuous segment.
- **Maximum-absolute normalization** yields a *relative* signal (not absolute absorbance); the vertical title adapts when relative and raw curves are mixed.
- **Reference subtraction/ratio** use the source wavelength positions. Where the reference lacks a sampled value, interpolation is explicit, gap-aware and recorded in the derived-curve provenance; missing reference values are never extrapolated across gaps.

Processed curves inherit the same derivative settings as raw curves, but the user must determine whether a chosen transformation is chemically justified. CSV includes per-curve provenance, and the application does not claim that smoothing or normalization validates an analytical method.

## Citing and release history

See [CITATION.cff](CITATION.cff) for bibliographic metadata and [CHANGELOG.md](CHANGELOG.md) for version history. No DOI has been assigned in this repository; do not cite an invented identifier. The [proprietary license](LICENSE) remains unchanged, including previously granted rights in older MIT-licensed copies.

## Verification

- [Automated numerical regression](tests/uvvis-regression.test.cjs) verifies known polynomial derivatives, processing/display independence, discontinuity isolation, gap-aware analytical measurements, retained raw data, and SVG axis formatting.
- [Independent SciPy references](tests/scipy_reference.py) compare all four derivative orders at internal points and unmasked endpoints and check a nonuniform wavelength grid against known analytic derivatives.
- [Chromium smoke tests](tests/browser-smoke.cjs) verify import formats including two-sheet XLSX, numeric values before/after zoom, the PNG dimensions and embedded pHYs resolution, derivative panels, and SVG/CSV/PNG and analytical-metrics output.
- [Scientific QA](.github/workflows/scientific-qa.yml) and [Browser QA](.github/workflows/browser-qa.yml) run on pushes and pull requests.

These tests assess their documented cases; they are not a formal validation of an experimental analytical method or an independent certification of every browser or detector.

## Numerical and scientific notes

- Derivatives are estimated by local polynomial least squares against the **measured wavelength coordinates**, not the point index. The available fit-window and polynomial-degree controls influence smoothness and derivative stability.
- Higher-order derivatives amplify experimental noise and can be sensitive to window choice, uneven wavelength spacing and edges; inspect the original spectrum and perform parameter-sensitivity checks.
- Missing readings and sufficiently large wavelength gaps are treated as discontinuities rather than silently joined for derivative estimation.
- Cursor readings can use the nearest measured point or indicated linear interpolation. CSV defaults to native measured wavelength positions (computed derivative values are explicitly identified); optional aligned-grid CSV marks each interpolated value separately and leaves gaps empty.
- An overlay or matching profile alone does not establish chemical identity. The software is a processing and visualization aid, **not a substitute for experimental method validation**.

## Deployment and privacy

This repository publishes the static application from [`index.html`](index.html) using GitHub Pages. You can also open that file locally, without a build step. Imported spectra are processed in the browser by the application; uploading files in its import control is not a request to upload those spectra to a project backend. As with any hosted page, the hosting provider can receive ordinary requests for the page itself.

## Developer

**ABDULSALAM S. HASAN**

## License

**Copyright © 2026 ABDULSALAM S. HASAN. All rights reserved.** The current repository is distributed under a [proprietary license](LICENSE): public access does not grant permission to copy, modify, redistribute, or republish the covered source code. Normal operation of the officially hosted app, applicable legal exceptions, and rights required by GitHub's terms are unaffected. **Earlier copies distributed under the MIT License retain their previously granted MIT permissions**; changing this repository's license does not revoke those earlier grants.
