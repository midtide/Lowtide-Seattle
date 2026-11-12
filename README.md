# Seattle, mapped

An interactive [OpenStreetMap](https://www.openstreetmap.org/) map of interesting Seattle places. The data lives in plain CSV files in [`data/`](data/), so adding a place or a whole new dataset never needs a rebuild: edit a file, commit, and the live map updates about a minute later.

**Live site:** https://midtide.github.io/Lowtide-Seattle/

Datasets:

- **Old businesses**: 88 Seattle businesses open to the public that started 50+ years ago.
- **National Register**: 220 Seattle places on the National Register of Historic Places that still exist.
- **Public staircases**: 599 public stairways from the Seattle Department of Transportation's stairway inventory, with step counts, condition and closures.
- **Streetcars 1931**: the 28 streetcar routes and 4 cable car lines in the Seattle Municipal Street Railway's April 1931 route list, drawn as selectable lines.
- **Mosquito Fleet 1908**: 37 steamer runs and 93 ports of call from a 1908 Seattle Post-Intelligencer map of the Puget Sound “Mosquito Fleet,” drawn over water.

Each dataset has its own filters (year slider, type checkboxes, search), a results list, a detail card, shareable links and CSV export.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole page (no build step). It also carries a built-in copy of both datasets, shown only if the data files can't be loaded. |
| `config.js` | Settings: `data` (the data folder), optional `sheetId`, `title`, `center`, `place`. |
| `data/` | The map's data as CSV files. See [`data/README.md`](data/README.md) for every column and how to add a dataset. |
| `apps-script/Code.gs` | Only for the optional Google Sheets setup below. |

## Edit the data

Edit the CSV files in `data/`, either on GitHub (open the file → pencil icon → commit changes) or in any spreadsheet app, saving as CSV. Each commit updates the live map once GitHub Pages has rebuilt (about a minute). Every change is kept in the repo's history, so any edit can be seen or undone.

## Optional: use a Google Sheet instead

The page can still read a Google Sheet with the same tabs (Datasets, Types, one tab per dataset). Upload `data/seattle-map-data.xlsx` to Google Drive, open it with Google Sheets, choose File → Save as Google Sheets, share it as **Anyone with the link → Viewer**, and put its ID (the part of its address between `/d/` and `/edit`) in `sheetId` in `config.js`. When `sheetId` is set, the sheet is used instead of `data/`. To try a sheet without committing, add `?sheet=YOUR_SHEET_ID` to the end of the site's address.

In the sheet, `apps-script/Code.gs` adds a **Map tools** menu (Extensions → Apps Script, paste it in, save, reload) that fills in missing coordinates from addresses.

## Sources and credits

- Basemap: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (tiles from OpenStreetMap, falling back to CARTO's rendering of the same data). Address look-ups use OpenStreetMap's Nominatim.
- Old businesses: City of Seattle active business license file plus historical sources noted per row.
- National Register: [Wikipedia's list of National Register listings in Seattle](https://en.wikipedia.org/wiki/National_Register_of_Historic_Places_listings_in_Seattle) and National Park Service records. Years are the year a place was *added* to the Register, not when it was built. Some coordinates were corrected by hand (see the Notes column).
- Public staircases: Seattle Department of Transportation stairway inventory (Stairways dataset on the City of Seattle's open GIS data). Pins sit at the middle of each mapped stairway; step counts are SDOT's riser counts.
- Streetcars 1931: route list “Streetcar routes – April 1st, 1931” (Seattle Municipal Street Railway, mimeographed), as transcribed on [Gabor Sandi's Seattle 1931 page](http://www.tundria.com/trams/USA/Seattle-1931.php). Lines were traced by following each route's listed streets on OpenStreetMap's street network (© OpenStreetMap contributors, ODbL), so they follow present-day streets.
- Mosquito Fleet 1908: map and list of 195 “Puget Sound Ports of Call” from the Seattle Post-Intelligencer, 1908. The map has no legend, so the runs are a best-effort reading of its lines. Each run was routed over a 40 m grid of open water built from OpenStreetMap coastlines and rivers (© OpenStreetMap contributors, ODbL), with a cost that keeps routes well offshore except in narrow channels; they are not recorded courses. Port pins sit at the historic dock where one was found: a matching dock in OpenStreetMap, or a wharf drawn on the oldest USGS topographic sheet covering the port (1897–1943, via the USGS National Map); each port's card names its source, and the 15 still estimated are marked approximate.
