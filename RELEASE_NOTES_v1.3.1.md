# UV–Vis Spectral Studio v1.3.1

This release updates the single-file, bilingual UV–Vis spectral analysis app and its research citation.

## Changes since v1.2.0

- Corrected signed area under a curve at interpolated interval boundaries and reported uncovered wavelength ranges.
- Hardened quoted CSV and multi-sheet XLSX imports, including bounded decompression and integrity checks.
- Added save/open project support with source observations, transformed curves and settings.
- Kept the first through fourth wavelength derivatives on measured wavelength coordinates and gaps separate; integer X-axis tick labels now omit unnecessary decimal zeros.
- Aligned the interface, APA 7 citation, `CITATION.cff` and README with the stable Zenodo concept DOI.

## Citation

Hasan, A. S. (2026). UV-Vis Spectral Studio (Version v1.3.1) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.22923131

The DOI above is the **concept DOI** shared by the project's Zenodo versions. Zenodo assigns a separate DOI to each archived version; the older 10.5281/zenodo.22923132 identifies v1.2.0. For exact reproducibility, retain the Git commit, data and analysis settings alongside the citation.

The application is licensed under Apache-2.0. GitHub Pages deployment requires numerical checks and browser checks in Chromium, Firefox and WebKit to pass.
