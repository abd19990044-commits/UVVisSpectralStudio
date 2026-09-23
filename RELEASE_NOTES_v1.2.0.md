# UV–Vis Spectral Studio v1.2.0

UV–Vis Spectral Studio is a self-contained, bilingual browser application for UV–visible spectral visualization, wavelength-based D1–D4 derivative spectrophotometry, and researcher-controlled analysis.

## Highlights
- Fit first- to fourth-order derivatives on actual measured wavelength coordinates, including nonuniform grids, with an independent processing range and display zoom.
- Retain source readings and discontinuities without silently inventing wavelengths or bridging gaps.
- Import TXT, CSV, TSV and multi-sheet XLSX files; distinguish measured wavelengths and explicitly interpolated numerical values in CSV output.
- Create additional curves by non-destructive baseline correction, local-polynomial smoothing, normalization, reference subtraction or ratio.
- Report wavelength-bounded extrema, numerical zero-crossing candidates, peak amplitudes, signed area and optional user-selected noise statistics.
- Compare window sensitivity and export figures as SVG or PNG with embedded physical-resolution metadata.
- Include automated mathematical/SciPy reference tests and headless-browser regression tests.

## Reproducibility and citation
- Version: **1.2.0**
- Creator: **Abdulsalam S. Hasan**
- Software citation: `Hasan, A. S. (2026). UV–Vis Spectral Studio (Version 1.2.0) [Computer software]. https://github.com/abd19990044-commits/UVVisSpectralStudio`
- Machine-readable citation: [CITATION.cff](CITATION.cff)
- License: [UV–Vis Spectral Studio Proprietary License](LICENSE). Public source availability does **not** grant general redistribution or modification rights; permissions associated with earlier MIT-licensed copies are unaffected.
- Zenodo DOI: **not yet assigned**. Replace this statement and update `CITATION.cff` only when a real DOI is minted.

The source is distributed as one standalone `index.html`; no refactoring, package installation, or build step is required to use the application. Figures and calculations assist research; they do not establish analytical-method validation or chemical identity.

Before publishing a GitHub release intended for automatic Zenodo archiving, connect and enable this GitHub repository under your Zenodo account. Zenodo generally processes *new releases after the repository has been enabled*, not earlier releases.
