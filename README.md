# Seattle, mapped

An interactive [OpenStreetMap](https://www.openstreetmap.org/) map of interesting Seattle places. The page reads its data live from a Google Sheet, so adding a place or a whole new dataset never needs a rebuild: edit the sheet and reload the page.

**Live site:** https://midtide.github.io/Lowtide-Seattle/

Datasets that ship in the starter workbook:

- **Old businesses**: 88 Seattle businesses open to the public that started 50+ years ago.
- **National Register**: 220 Seattle places on the National Register of Historic Places that still exist.

Each dataset has its own filters (year slider, type checkboxes, search), a results list, a detail card, shareable links and CSV export.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole page (no build step). It carries a built-in copy of both datasets, shown until a sheet is connected or if the sheet can't be reached. |
| `config.js` | The only file you edit: `sheetId` (your Google Sheet), `title`, `center`, `place`. |
| `data/seattle-map-data.xlsx` | Starter workbook. Upload it to Google Drive and open it with Google Sheets. |
| `apps-script/Code.gs` | Optional "Map tools" menu for the sheet that fills in map coordinates from addresses. |

## Connect your Google Sheet

1. Upload `data/seattle-map-data.xlsx` to Google Drive, open it with Google Sheets, then File → Save as Google Sheets.
2. Share → General access → **Anyone with the link → Viewer** (anyone with the link can read it, so keep private data out).
3. Copy the sheet's ID (the long part of its address between `/d/` and `/edit`) into `sheetId` in `config.js`, and commit.
4. To test before committing, open the site with `?sheet=YOUR_SHEET_ID` on the end of the address.

## Add a dataset

In the Google Sheet: duplicate the **Template** tab, rename it, fill in rows, then add one row for it in the **Datasets** tab (and optionally colors and shapes in **Types**). It appears as a new button on the map. The sheet's README tab explains every column. Extra columns (Phone, Website, ...) show up on the detail card automatically.

## Optional: fill in coordinates automatically

In the sheet choose Extensions → Apps Script, paste in `apps-script/Code.gs`, save and reload. A **Map tools** menu fills missing latitude/longitude from addresses and refines rows marked "Approximate". Google will ask you to authorize the script the first time (it shows an "unverified app" warning because it's your own script).

## Sources and credits

- Basemap: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (tiles from OpenStreetMap, falling back to CARTO's rendering of the same data). Address look-ups use OpenStreetMap's Nominatim.
- Old businesses: City of Seattle active business license file plus historical sources noted per row.
- National Register: [Wikipedia's list of National Register listings in Seattle](https://en.wikipedia.org/wiki/National_Register_of_Historic_Places_listings_in_Seattle) and National Park Service records. Years are the year a place was *added* to the Register, not when it was built. Some coordinates were corrected by hand (see the Notes column).
