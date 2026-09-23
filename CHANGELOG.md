# Changelog

## 1.2.0 — 2026-09-23

- Added independent SciPy checks of unmasked edge derivatives, irregular wavelength grids, and reproducible tests of gap isolation.
- Browser checks compare numerical CSV values before and after display zoom; validate PNG dimensions and embedded DPI and import a generated two-sheet XLSX fixture.
- Explicit unit-range warnings for ambiguous wavelength columns; CSV measured-grid exports use indexed lookups and retain per-curve transformation provenance.
- Added researcher-controlled extrema, global peak-to-peak and peak-to-zero amplitudes, candidate zero crossings, discontinuity-safe signed areas, and optional sample-SD noise estimates.
- Added non-destructive straight-line baseline correction, local-polynomial D0 smoothing, maximum-amplitude normalization and reference subtraction/ratio. Originals are retained; reference interpolation is recorded.

## 1.1.0 — 2026-09-23

- Separated derivative processing ranges from chart zoom.
- Preserved wavelengths below 200 nm and above 3000 nm and displayed explicit unit/omission warnings.
- Added Fit to Data, traceable CSV metadata, physical fitting-window ranges in nm, and irregular-grid diagnostics.
- Added automated numerical and browser regression tests.

This changelog records implementation changes, not a guarantee of chemical method validation or cross-browser certification.
