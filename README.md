# UV–Vis Spectral Studio

**Standalone UV–visible spectral analysis and derivative spectrophotometry in one HTML file.**

[Open the application](https://abd19990044-commits.github.io/UVVisSpectralStudio/) · [Download index.html](https://github.com/abd19990044-commits/UVVisSpectralStudio/raw/refs/heads/main/index.html) · [Apache-2.0 license](LICENSE) · [Changes](CHANGELOG.md)

**Current version: 1.3.0.** English and Arabic interface; scientific axes use English labels and wavelength in nm. The application has no runtime dependencies, CDN scripts, account requirement or analysis server. Spectral observations are processed locally in the browser. Download `index.html` to work offline; npm and Python are required only by contributors running verification tests.

## What it does

| Area | Capabilities |
| --- | --- |
| Import | TXT, CSV, TSV, multi-column and multi-sheet XLSX; automatic detection and manual wavelength/signal column mapping |
| CSV compatibility | Quoted numeric fields, embedded delimiters and newlines, doubled quote escapes, UTF-8 BOM and comment records |
| Derivatives | D1–D4 local polynomial least-squares fits on actual wavelength coordinates; adjustable window, degree and edge mask; gap isolation |
| Measurements | Extrema, global peak-to-peak and absolute peak-to-zero amplitudes, zero-crossing candidates, signed area in a selected wavelength interval, descriptive noise statistics |
| Processing | New curves from endpoint baseline correction, D0 smoothing, maximum-absolute normalization, reference subtraction and ratio; originals remain available |
| Plotting | Overlays and derivative gallery, editable axes and tick spacing/counts, per-curve colors/styles/widths, X/Y/XY drag zoom and zoom undo |
| Tables | Exact recorded, nearest or explicitly interpolated wavelength lookup; combined multi-spectrum D0–D4 tables, pagination and full CSV export |
| Figures | SVG; PNG with embedded DPI at 600/900/1200 DPI and selected physical width; browser Print / Save PDF |
| Reproducibility | Save/open a project containing observations, processed curves, source tables and settings; separate method-parameter JSON; versioned CSV metadata |

## Quick start

1. Open the live application or download `index.html` and open it in a modern browser.
2. Import your spectra, or choose **Load synthetic example**. Synthetic examples are not experimental measurements.
3. Check that the wavelength column is in **nm** and the ordinate is the intended signal. Use **Manual column mapping** if automatic detection is ambiguous.
4. Choose D0 or D1–D4. For derivatives, select a fitting window and polynomial degree and inspect the edge mask and fitting-window sensitivity.
5. The **processing range** controls which observations enter derivative fitting. The **display axes** and drag zoom only control the view. Click **Apply processing range** to apply changes to the processing interval.
6. Select a curve and wavelength interval for measurements, or use the reading tables for wavelength-specific values.
7. Export figures and numerical results. Use **Save project** before closing to retain spectra and settings. **Open project replaces the current session** after validating the complete file.

Example input:

```csv
"Wavelength (nm)","Sample A"
"200","0.032"
"201","0.035"
"202","0.039"
"203","0.041"
"204","0.045"
"205","0.048"
"206","0.051"
"207","0.054"
"208","0.056"
```

Text delimiters may be comma, tab, semicolon or whitespace. At least seven usable wavelength/signal pairs are required for import; derivative fitting may need more. Missing wavelengths are never invented. Positive measured wavelengths outside 200–800 nm are retained; use **Fit to data** to see the full extent. Recognized wavenumber headings are rejected, but generic headings cannot establish units: verify the source units yourself. Legacy binary `.xls` must be converted to `.xlsx` or `.csv`.

## Scientific conventions

Absorbance is dimensionless. For absorbance input, the D1–D4 ordinates have units nm⁻¹ through nm⁻⁴ because differentiation is with respect to wavelength in nm, not row index. Fits use centered/scaled wavelength coordinates and a QR-based least-squares solver. Irregular spacing is supported; gaps and masked boundaries are not crossed.

Normalization and signal ratios produce transformed signals. Their labels and CSV units distinguish them from absorbance. Derivatives amplify noise, especially D3/D4; inspect the window sensitivity, actual fit width in nm and experimental controls. The software does not determine an optimal window or identify chemical species.

### Area and measurement intervals

Area is the **signed piecewise-linear trapezoidal integral** over the requested interval. If a boundary falls between adjacent finite readings in a continuous segment, its ordinate is linearly interpolated and the partial trapezoid is included. The application never extrapolates or integrates across a declared gap or a nonfinite ordinate.

Results and measurement CSV report **integrated coverage** and **unintegrated width**. If coverage is incomplete, the area is the sum over available continuous portions, not the integral over a fully observed interval. For example, an absorbance of 1 across 200.5–205.5 nm gives an area of 5 absorbance·nm, including both partial endpoint intervals.

Extrema include interpolated boundary values when applicable and label those values explicitly. Global peak-to-peak need not refer to adjacent peaks. A sign-change zero crossing is an interpolated candidate, not an experimentally measured zero. A zero plateau is not a unique crossing.

The optional noise-region result is an amplitude/sample-standard-deviation ratio for the region you select. It is **not LOD, LOQ, instrument-certified S/N or analytical selectivity**. Software tests do not establish experimental method validation or ICH compliance.

## Data tables, figures and provenance

- Combined tables use the sorted union of recorded wavelength positions; missing readings remain blank. Table CSV includes all matching rows, even when the screen shows one 500-row page.
- Derivatives at recorded wavelengths are computed values. Aligned-grid CSV explicitly labels interpolated and unavailable readings; no gap is filled silently.
- CSV comment lines beginning with `#` identify the application version, processing/display ranges and fitting configuration. Per-curve provenance records transformations and reference interpolation. Spreadsheet programs may need an explicit import step to skip metadata lines.
- SVG and PNG use the same plotting implementation. PNG includes physical-resolution metadata. Exported plots omit the page title and developer credit; the in-plot legend is optional.
- **PDF uses the browser print dialog**. Choose Save as PDF and verify page size, scaling and margins. It is not a direct PDF encoder and does not promise identical print output in every browser.
- A journal's final size, typography and format requirements still determine the appropriate figure settings.

## Saving and reopening research work

**Save project** downloads `uvvis_project.json` with the actual imported and processed observations, gap indices, curve styles and provenance, imported source tables, applied processing range, and analysis/display/export controls. Reopening restores those values and recomputes plots and derivatives; cached numerical arrays are not treated as source data. Browser tests verify that the restored SVG and numerical derivative CSV match the original session.

Project files are validated before the current session is replaced. Malformed arrays, nonfinite observations, invalid ranges/styles, unsupported schemas and oversized files are rejected. Project loading resets zoom undo history and prior publication-mode axis snapshots. The language and theme are presentation preferences, not saved research settings. The **method JSON** is a smaller settings summary and deliberately does not contain spectral observations; use a project file for restoration.

There is no automatic cloud backup or session recovery after reload. Save projects explicitly and retain original instrument files. Project schema version 1 supports up to 128 curves, one million total spectral points, two million source-table cells and 1000 source tables, subject to the 25 MiB file limit. Larger work must be split into separate projects or exported as spectra.

## Limits and browser support

- Spectrum input files: at most **25 MiB each**. Text imports: at most 150,000 logical records and 80 columns. XLSX: at most 3000 ZIP entries, 150 MiB declared/actual expanded entry bytes, and 150,000 rows per sheet; wavelength/signal mapping considers the first 80 columns.
- XLSX requires `DecompressionStream('deflate-raw')`. Decompression is bounded while reading, verifies actual entry sizes and CRC32 checksums, and rejects corrupt, encrypted or unsupported archives. CRC32 detects corruption; it is not an authenticity signature.
- Automated browser verification targets **Chromium, Firefox and WebKit**. The test suite is not a certification of every mobile or vendor browser build.
- Numerical processing runs on the browser's main thread. Large batches can take time; input limits are resource safeguards, not a promise of responsiveness at every limit on every device.
- Spectra are not uploaded by application code. Hosting providers still receive ordinary page requests; external citation/source links open their respective services.

## Verification and deployment

The verification dependencies are development-only and pinned in `package-lock.json`. They are not loaded by `index.html`.

```bash
npm ci
npm test
python -m pip install numpy==2.2.6 scipy==1.15.3
python -m unittest discover -s tests -p scipy_reference.py -v
python tests/make_xlsx_fixture.py
npx playwright install --with-deps chromium firefox webkit
npm run test:browser
BROWSER=firefox npm run test:browser
BROWSER=webkit npm run test:browser
```

On Windows PowerShell, use `$env:BROWSER='firefox'` before `npm run test:browser` (and similarly for WebKit).

- Numerical tests cover known polynomial derivatives, processing/display independence, gap isolation, non-destructive transformations, axis scales, clipped AUC, quoted CSV, bounded decompression and corrupt archives.
- Independent SciPy/analytic checks cover all four derivatives, uniform and irregular sampling, and unmasked edges.
- Browser tests exercise imports, measurement and CSV export, language switching, zoom, SVG/PNG and DPI, project round trips and atomic rejection of invalid projects.
- Main-branch deployment **requires both numerical jobs (Node 22 and 24) and all three browser jobs to pass**. Only `index.html`, `LICENSE` and `NOTICE` are staged for GitHub Pages. `index.html` remains independently usable and embeds the full license and attribution.

Review the [Actions results](https://github.com/abd19990044-commits/UVVisSpectralStudio/actions) for the exact commit used. Passing tests establishes the documented checks, not a guarantee that all possible defects have been eliminated.

## Citation and versions

The current application and exports identify **v1.3.0**. Record the Git commit and processing parameters used in your research. [CITATION.cff](CITATION.cff) describes this version.

The following citation belongs specifically to the previously archived **v1.2.0**, and its DOI must not be used to imply that v1.3.0 is that same archived artifact:

> Hasan, A. S. (2026). UV-Vis Spectral Studio (Version v1.2.0) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.22923132

For current v1.3.0, cite the software version and repository commit; a new version DOI has not been assigned by this update.

## License

Copyright © 2026 **Abdulsalam S. Hasan**. Current source code and original project documentation are released under **Apache License 2.0**. See [LICENSE](LICENSE) and [NOTICE](NOTICE). Academic citation is requested for research attribution; it is not an additional license restriction.

This change does not alter historical release archives or revoke permissions previously granted under MIT. Third-party verification dependencies retain their own licenses. The application contains no bundled third-party runtime library.
