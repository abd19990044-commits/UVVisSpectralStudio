# UV–Vis Spectral Studio

**A browser-based workspace for UV–visible absorbance spectra, derivative spectrophotometry, non-destructive processing, multi-spectrum reading tables, wavelength-specific measurements, spectral overlays, and manuscript-oriented figures.**

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22923132.svg)](https://doi.org/10.5281/zenodo.22923132)

[**Launch the live app**](https://abd19990044-commits.github.io/UVVisSpectralStudio/) · [Source code](https://github.com/abd19990044-commits/UVVisSpectralStudio/blob/main/index.html) · [Archived release and DOI](https://doi.org/10.5281/zenodo.22923132)

UV–Vis Spectral Studio is a single-file HTML/CSS/JavaScript application. Spectra are processed in the browser: no account, server-side spectral analysis, or installation is required. The interface can switch between **English and Arabic**; scientific axis labels and units remain **in English** in both modes.

## Features

| Area | Capabilities |
| --- | --- |
| Import | TXT, CSV, TSV and XLSX; multiple spectra; multi-column and multi-sheet XLSX; manual wavelength/absorbance column mapping |
| Visualization | Overlaid spectra, original and D1–D4 views (including a derivative gallery), sample visibility, independently adjustable curve widths, line colors and styles, a below-plot wavelength readout, and horizontal zoom |
| Derivatives | First through fourth derivatives using local polynomial least-squares fits on actual wavelength coordinates; independent processing and display ranges; adjustable point window, degree and edge mask |
| Numerical measurements | User-selected extrema, global peak-to-peak and peak-to-zero amplitudes, candidate zero crossings, signed trapezoidal area, optional noise-region statistic, and fitting-window sensitivity comparison |
| Preprocessing | New curves from endpoint baseline correction, local-polynomial D0 smoothing, maximum-absolute normalization, reference subtraction or ratio; originals are retained |
| Axes | Editable limits via fields or clickable axis endpoints, configurable X/Y tick modes and intervals, separate axis/tick widths, data-dependent D0 upper limit, scale-aware derivative tick labels, figure title and axis labels, inward-facing ticks, white scientific plotting area, and Fit to data |
| Reading tables | Wavelength-specific lookup at recorded or nearest wavelengths, or explicitly flagged gap-aware linear interpolation; single-curve reading table and combined multi-spectrum D0–D4 table with wavelength filtering, 500-row pages, and complete CSV export |
| Output | SVG, PNG at selectable 600/900/1200 DPI and physical width, measured-position or provenance-flagged aligned CSV, full combined-table CSV, and separate measurement/sensitivity CSV exports |
| Presentation | Light-by-default/dark-switchable interface, English/Arabic controls, permanently title/credit-free exported plots and an independently switchable in-plot legend |

### Analytical notation

For original absorbance input, the signal is **A** and the horizontal axis is **Wavelength (nm)**. The default vertical title is **Absorbance**; derivatives of absorbance with respect to wavelength are labeled:

| View | Y-axis label |
| --- | --- |
| D0 | Absorbance |
| D1 | dA/dλ (nm⁻¹) |
| D2 | d²A/dλ² (nm⁻²) |
| D3 | d³A/dλ³ (nm⁻³) |
| D4 | d⁴A/dλ⁴ (nm⁻⁴) |

Absorbance is dimensionless; these wavelength-derivative units follow from using nm. **Normalized and ratio curves are transformed signals, not raw absorbance**, so their ordinate labels may be relative or mixed-signal labels instead. The initial **D0** X display limits are **200–800 nm**, irrespective of the imported spectrum's extent. For nonnegative absorbance spectra, the default Y minimum is **0**, and the automatic Y maximum rounds upward in **0.5-absorbance increments** according to the largest visible reading (for example, a maximum of 0.79 gives an upper limit of 1.0). Negative data are not suppressed by this automatic rule. Explicit user-selected Y limits take precedence. **Fit to data** adjusts the display range without changing the underlying observations. D0 Y-axis tick labels use two fixed decimal places, and X-axis tick labels use one fixed decimal place. D1–D4 Y tick labels instead adapt their precision to the derivative scale so distinct small values are not shown as repeated `0.00` labels.

## Quick start

1. Open the [live application](https://abd19990044-commits.github.io/UVVisSpectralStudio/), or download [`index.html`](index.html) and open it in a modern browser.
2. Import a TXT/CSV/TSV/XLSX file, or select **Load synthetic example** to explore the controls. Synthetic examples are **not experimental measurements**.
3. If automatic wavelength or absorbance detection is ambiguous, use **Manual column mapping**.
4. For derivatives, choose D1–D4 (or the gallery), adjust the point window and polynomial degree, and review the edge-mask setting.
5. Set the derivative **processing range** separately from the **display axes**. To process only 270–400 nm, enter those limits under **Derivative processing range** and click **Apply processing range**. Dragging or editing display axes does **not** change derivative values; changing the processing range, fitting parameters or edge mask **does**. Use **Fit to data** to display the visible measurements.
6. Use **Spectral readings & wavelength lookup** to inspect a single D0–D4 curve or enter a wavelength; choose exact recorded wavelength, nearest recorded wavelength, or explicitly flagged linear interpolation.
7. Open **Combined spectral data table** to inspect multiple spectra side by side. Select D0–D4, restrict the wavelength interval if necessary, page through the grid, or export all matching rows as CSV.
8. Optionally create a new processed curve, measure a selected spectral interval, or compare fitting windows. These operations do not overwrite the original imported spectra.
9. Export SVG/PNG figures, displayed numerical CSV, or measurement/sensitivity CSV as appropriate.

A simple **illustrative extract** of a CSV file is:

```csv
Wavelength (nm),Sample A,Sample B
200,0.032,0.050
201,0.035,0.051
202,0.039,0.055
203,0.041,0.058
204,0.045,0.060
205,0.048,0.063
206,0.051,0.066
207,0.054,0.069
208,0.056,0.072
```

For delimiter-separated text, use a comma, tab, semicolon or whitespace as appropriate. A positive wavelength column in **nm** is required: **the application does not invent missing wavelength values**. Valid measured wavelengths below 200 nm and above 3000 nm are retained. A recognized wavenumber heading in cm⁻¹ is rejected; **generic headings are not proof of units**, so confirm that the supplied values are wavelengths in nm before import. For legacy binary `.xls` files, save a copy as `.xlsx` or `.csv` first.

## Spectral readings and combined tables

The **Spectral readings & wavelength lookup** panel supports a selected original spectrum (**D0**) or its first through fourth numerical derivatives (**D1–D4**). Enter a wavelength and choose one of three policies: an exact recorded wavelength only, the nearest recorded wavelength within the available range, or gap-aware **linear interpolation explicitly labeled as interpolated**. No values are extrapolated beyond the available spectrum, and missing or edge-masked derivative values are reported as unavailable. An individual reading table can be restricted to a wavelength interval and exported to CSV; the on-screen individual table shows at most 500 rows while the CSV includes all matching rows.

The **Combined spectral data table** displays a common wavelength column with one column per included spectrum, like an instrument's multi-trace data printout. It can show the currently displayed derivative order or explicitly select **D0–D4**. The **Visible spectra only** checkbox limits the columns to traces currently shown in the plot; when unchecked, all imported spectra are included. The wavelength range can be filtered independently of the plot's display limits. The common grid is the sorted **union of recorded wavelength positions** of the included curves, not a fabricated evenly spaced grid. At each row, a cell is populated only when that spectrum has a finite value at that same recorded wavelength; missing readings and unavailable derivatives remain **blank without interpolation**. For derivatives, wavelength positions refer to recorded wavelengths, while the ordinate values are *computed*, not independently measured. A missing derivative for a given spectrum does not prevent other columns from being displayed.

The combined table has sticky wavelength and column headers, horizontal and vertical scrolling, and pages of **500 rows** for responsive viewing. **Export all rows CSV** writes the complete filtered grid, not merely the current page, with curve names, derivative order and numerical-processing settings. Empty cells are retained in the export. The two tables complement the existing **Save displayed curves as CSV** option; its optional aligned-grid provenance columns can label interpolation, whereas the combined table deliberately does not perform interpolation.

## Preparing figures for publication

Exported plot graphics omit the embedded figure title and developer credit by default and without an extra mode switch; the **in-plot** curve legend can be shown or hidden independently. The editable title can still appear in the application's page heading. Supply a journal's figure caption separately. Both exported SVG and PNG originate from the same SVG plotting logic used by the on-screen chart; PNG is rasterized at the selected physical width and DPI.

For a submission, check the target journal's requirements for final figure size, text legibility, file format and resolution. **“Publication-ready” describes available formatting and export controls; it is not a guarantee of acceptance by a Q1 journal or validation of an analytical method.** Keep figures, captions, experimental conditions, and method-validation evidence consistent with the underlying measurements.

## Reproducibility and output provenance

**The archived v1.2.0 release (2026-09-23)** separates analysis from display. The current `main` branch includes additional changes made after that archive; the Zenodo version DOI below must not be taken to identify those later changes. The derivative-processing range is unrestricted by default (so it includes all available measured wavelengths), while the initial D0 display is 200–800 nm with an automatically selected Y maximum for nonnegative absorbance. To restrict fitting to 270–400 nm, enter those numbers under **Derivative processing range** and click **Apply processing range**. Display zoom does not alter the processing range; **Fit to data** changes only display axes.

Derivative results use local polynomial least squares on measured wavelengths, with edge masking selected by default. The quality strip reports the actual minimum, median and maximum fitting-window spans in nm and identifies notably irregular wavelength sampling.

CSV metadata lines beginning with `#` record the software version, display and processing intervals, polynomial degree, point window and edge-mask setting. `Original wavelengths only` never fills cross-spectrum gaps; derivative values remain computed quantities at those wavelengths. `Aligned grid` explicitly adds per-spectrum provenance columns for interpolated, available and missing readings. If spreadsheet software does not skip comment lines, import the CSV beginning at the first `Wavelength (nm)` header row.

## Researcher-controlled analytical measurements

Choose one currently displayed curve and a wavelength interval (or leave the interval fields blank to use the displayed limits). The analytical panel reports the maximum/minimum ordinates and their measured wavelengths, a **global** peak-to-peak amplitude (the two extrema need not be adjacent), absolute peak-to-zero amplitude, gap-aware signed trapezoidal area, and zero-crossing candidates. A sign-change crossing is linearly interpolated **between adjacent finite points only** and is marked as interpolated; it is not an experimentally measured zero. Measurements can be exported with the derivative order, processing interval, fit configuration and edge-mask setting.

An optional **fitting-window sensitivity analysis** compares user-selected derivative curves for window lengths 11, 15, 21, 31 and the active window. It reports actual nanometer spans and dominant absolute amplitudes without declaring one window optimal, and exports a parameterized CSV.

An optional user-chosen noise interval produces a descriptive amplitude/sample-standard-deviation ratio. This is **not a determination of LOD, LOQ, instrumental S/N, or analytical selectivity**; the software does not infer a blank region automatically. Features are computed quantities, not chemical identifications.

## Non-destructive spectral preprocessing

The **Non-destructive spectral processing** panel produces a **new curve** from a selected source; it does not edit, discard or replace the original measurements. Operations use the selected derivative-processing wavelength interval and retain surviving source wavelength positions (points unavailable after processing may be omitted):

- **Linear endpoint baseline correction** subtracts a straight line fitted through two user-selected, valid anchor wavelengths.
- **Local-polynomial smoothing** computes a zero-order fit using the selected point window, polynomial degree and edge-mask policy, independently within each continuous segment.
- **Maximum-absolute normalization** yields a *relative* signal (not absolute absorbance); the vertical title adapts when relative and raw curves are mixed.
- **Reference subtraction/ratio** use the source wavelength positions. Where the reference lacks a sampled value, interpolation is explicit, gap-aware and recorded in the derived-curve provenance; missing reference values are never extrapolated across gaps.

Processed curves inherit the same derivative settings as raw curves, but the user must determine whether a chosen transformation is chemically justified. CSV includes per-curve provenance, including any reference interpolation used during arithmetic. Derived-curve measurements are computed from transformed signals, not new instrument observations. Smoothing or normalization does not validate an analytical method.

## Citing and release history

Suggested citation:

> Hasan, A. S. (2026). UV-Vis Spectral Studio (Version v1.2.0) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.22923132


See [CITATION.cff](CITATION.cff) for bibliographic metadata and [CHANGELOG.md](CHANGELOG.md) for version history. The **v1.2.0 archive is distinct from subsequent commits on `main`**: cite the archived version when you use it; for newer functionality, additionally identify the Git commit used. **Version 1.2.0 DOI:** [10.5281/zenodo.22923132](https://doi.org/10.5281/zenodo.22923132). Cite the archived version you used and record the relevant spectral-processing parameters in Methods. The current [proprietary license](LICENSE) does not revoke permissions previously granted for copies released under MIT.

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
- Cursor readings can use the nearest recorded point or indicated linear interpolation; the detailed lookup additionally offers exact-wavelength-only reads. CSV defaults to native recorded wavelength positions (computed derivative values are explicitly identified); optional aligned-grid CSV marks each interpolated value separately and leaves gaps empty. The combined table uses the union of recorded wavelengths without cross-spectrum interpolation.
- An overlay or matching profile alone does not establish chemical identity. The software is a processing and visualization aid, **not a substitute for experimental method validation**.

## Deployment and privacy

This repository publishes the static application from [`index.html`](index.html) using GitHub Pages. You can also open that file locally, without a build step. Imported spectra are processed in the browser by the application; uploading files in its import control is not a request to upload those spectra to a project backend. As with any hosted page, the hosting provider can receive ordinary requests for the page itself.

## Developer

**ABDULSALAM S. HASAN**

## License

**Copyright © 2026 ABDULSALAM S. HASAN. All rights reserved.** The current repository is distributed under a [proprietary license](LICENSE). Public visibility is not a general grant to modify or redistribute its covered source code. The license permits access to the officially hosted application and preserves applicable exceptions and third-party rights. **Earlier copies distributed under MIT retain the permissions granted for those copies.** See the complete license for scope and conditions.
