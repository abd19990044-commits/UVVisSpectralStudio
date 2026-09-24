# Changelog

## 1.3.0 — 2026-09-24

- Correct signed AUC for boundaries between measured wavelengths, including intervals smaller than one sampling step. Report integrated and missing coverage; label interpolated extrema.
- Parse quoted CSV/TSV/semicolon fields, embedded newlines, delimiters and escaped quotes. Reject malformed records.
- Bound XLSX decompression while streaming, validate archive bounds, reject duplicate entries and verify CRC32 checksums.
- Save and restore project observations, transformed curves, source tables and settings with validation before replacing a session.
- Correct transformed-signal CSV units and metadata; identify the current application as v1.3.0 while preserving the historical v1.2.0 citation.
- Fix the browser test interaction with collapsed axis controls and replace an incorrect zero-tick assertion with numerical scale checks.
- Add regression cases for clipped integration, CSV and XLSX safeguards, project round trips and malformed project rejection. Avoid argument-count overflow when finding bounds of large spectra.
- Gate deployment on Node 22/24 numerical checks and Chromium/Firefox/WebKit browser checks; pin verification dependencies.
- Re-license current code and documentation under Apache-2.0, embedding the full license in the standalone HTML. Historical release archives are unchanged.

## 1.2.0 — 2026-09-23

- Added independent SciPy checks of unmasked edge derivatives, irregular wavelength grids, and reproducible tests of gap isolation.
- Browser checks compare numerical CSV values before and after display zoom; validate PNG dimensions and embedded DPI and import a generated two-sheet XLSX fixture.
- Explicit unit-range warnings for ambiguous wavelength columns; CSV measured-grid exports use indexed lookups and retain per-curve transformation provenance.
- Added researcher-controlled extrema, global peak-to-peak and peak-to-zero amplitudes, candidate zero crossings, discontinuity-safe signed areas, and optional sample-SD noise estimates.
- Added non-destructive straight-line baseline correction, local-polynomial D0 smoothing, maximum-amplitude normalization and reference subtraction/ratio. Originals are retained; reference interpolation is recorded.
- Added quantitative sensitivity comparison across fitting windows and traceable CSV exports.
- Prevented off-range visible curves from invalidating otherwise valid derivative plots; added regression coverage.

## 1.1.0 — 2026-09-23

- Separated derivative processing ranges from chart zoom.
- Preserved wavelengths below 200 nm and above 3000 nm and displayed explicit unit/omission warnings.
- Added Fit to Data, traceable CSV metadata, physical fitting-window ranges in nm, and irregular-grid diagnostics.
- Added automated numerical and browser regression tests.

This changelog records implementation changes, not a guarantee of chemical method validation or cross-browser certification.
