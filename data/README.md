# Map data

The map page reads these CSV files. Edit a file (on GitHub: open it → pencil icon → commit), and the live map shows the change about a minute later, once GitHub Pages has rebuilt.

## Files

| File | What it is |
| --- | --- |
| `datasets.csv` | One row per dataset. Each becomes a button at the top of the map. |
| `types.csv` | Optional. Color and pin shape for each type in a dataset. Types missing here still work; the page picks colors for them. |
| `old-businesses.csv`, `national-register.csv` | One file per dataset, one row per place. |
| `template.csv` | Column headings to copy when starting a new dataset. |
| `seattle-map-data.xlsx` | The original starter workbook, kept only for the optional Google Sheets setup. The map doesn't read it. |

A dataset's file name comes from its **Tab** in `datasets.csv`, lower-cased with spaces and punctuation turned into dashes: "Old businesses" → `old-businesses.csv`.

## Add a dataset

1. Copy `template.csv` to a new file, for example `public-art.csv`, and fill in rows. Only **Name** is required, plus either an **Address** or a **Latitude** and **Longitude**.
2. Add a row to `datasets.csv`: **Dataset** (the button label), **Tab** (`Public art`, matching the file name), and optionally a **Description**, **Year label**, **Type label**, **Eras** (comma-separated era start years) and **Place**.
3. Optional: add rows to `types.csv` to choose colors (`#RRGGBB`) and shapes for its types.

## Dataset columns

Headings can be in any order. Extra columns are fine.

- **Name**: required.
- **Type**: groups places into filterable categories with their own pin color and shape. Leave the whole column empty for a dataset with no categories.
- **Year**: a plain 4-digit number (founded, built, opened…). Leave it empty if unknown. Don't write text like "c. 1924" here; use **Year basis** instead.
- **Year basis**: Sourced (default), Approximate, Minimum (a "by 19xx" year; the real one may be earlier) or Unclear.
- **Year label**: optional text to show instead of the year, for example "c. 1920s".
- **Address, City, State, Neighborhood**: used for search, the detail card and finding map positions.
- **Latitude, Longitude**: plain decimal numbers (47.6097, -122.3331). If they're empty, the page looks the address up on OpenStreetMap in each visitor's browser.
- **Position**: Approximate if the coordinates are rough guesses (the page then offers to snap those pins to the address). Geocoded means the coordinates came from an address lookup.
- **Confidence**: High, Medium or Low (shown as a colored chip on the detail card).
- **Notes, Source link**: shown on the detail card.
- Any other column (Phone, Website, Owner…) is shown on the detail card automatically. A cell that is a web address becomes a link.

## Good habits

- Save files as UTF-8 CSV with the headings in the first row.
- Wrap a value in double quotes if it contains a comma, a quote or a line break (spreadsheet apps do this for you).
- Everything here is public, so keep private information out.
