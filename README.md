# Seattle, mapped

An interactive [OpenStreetMap](https://www.openstreetmap.org/) map of interesting Seattle places. The data lives in plain CSV files in [`data/`](data/), so adding a place or a whole new dataset never needs a rebuild: edit a file, commit, and the live map updates about a minute later.

**Live site:** https://midtide.github.io/Lowtide-Seattle/

Datasets:

- **Oldschool Seattle**: three lists on one map, each a collapsible group in the results: Oldest businesses (88 Seattle businesses open to the public that started 50+ years ago), Stalwarts & Gems (53 long-running and independent Seattle places for film, books, music, repair, making, art and reuse) and National Register (220 places on the National Register of Historic Places that still exist, as small gray dots), with neighborhood counts when zoomed out.
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

- Basemap: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (Esri Light Gray Canvas tiles by default, built partly on OpenStreetMap data; detailed OpenStreetMap tiles are a menu option; the Mosquito Fleet tab uses NOAA nautical charts via CharTiles). Address look-ups use OpenStreetMap's Nominatim.
- Oldschool Seattle, businesses: City of Seattle active business license file plus historical sources noted per row. Bars & taverns follow the three lists on [seattlebars.org's Oldest Bars in Seattle page](http://www.seattlebars.org/p/oldest-bars-in-seattle.html) (Seattle's Oldest Bars, and bars established before 1940 and before 1950), leaving out places that only occupy old bar spaces and two bars that have since closed (Northlake Tavern, 2023; The Shanty, 2025). New addresses were geocoded with the U.S. Census Bureau geocoder. Neighborhood overlays: City of Seattle Neighborhood Map Atlas (Office of the City Clerk), from [Seattle GeoData](https://data.seattle.gov/), Public Domain (PDDL); the City notes these are not official neighborhood boundaries.
- Oldschool Seattle, Stalwarts & Gems: a curated list of Seattle-area places (only those inside Seattle are mapped; nine already on the Oldest businesses list were left there). Locations from OpenStreetMap, OpenStreetMap's Nominatim, and business listings; four Pike Place Market shops are pinned at the Market because their stalls aren't mapped.
- Oldschool Seattle, National Register places: [Wikipedia's list of National Register listings in Seattle](https://en.wikipedia.org/wiki/National_Register_of_Historic_Places_listings_in_Seattle) and National Park Service records. Years are the year a place was built (from Wikipedia and Wikidata, with some corrections by hand; districts and parks are approximate, and 40 places without a sourced year have none). The date each place was added to the Register is on its card. Some coordinates were corrected by hand (see the Notes column).
- Oldschool Seattle, City Landmarks: the City of Seattle [Landmarks layer](https://data.seattle.gov/d/8dww-4xrc) (Department of Neighborhoods, via Seattle GeoData), one pin per landmark. The 132 landmarks that match a National Register place are not repeated; the Register pin notes the City designation instead. Build years come from King County Assessor building records (matched by parcel number), Wikipedia’s List of Seattle landmarks, or Wikidata; vessels, clocks, parks, bridges and the like get no Assessor year, and about 150 landmarks have no year.
- Streetcars 1931: route list “Streetcar routes – April 1st, 1931” (Seattle Municipal Street Railway, mimeographed), as transcribed on [Gabor Sandi's Seattle 1931 page](http://www.tundria.com/trams/USA/Seattle-1931.php). Lines were traced by following each route's listed streets on OpenStreetMap's street network (© OpenStreetMap contributors, ODbL), so they follow present-day streets.
- Mosquito Fleet 1908: map and list of 195 “Puget Sound Ports of Call” from the Seattle Post-Intelligencer, 1908. The map has no legend, so the runs are a best-effort reading of its lines. Each run was routed over a 40 m grid of open water built from OpenStreetMap coastlines and rivers (© OpenStreetMap contributors, ODbL), with a cost that keeps routes well offshore except in narrow channels; they are not recorded courses. Port pins sit at the historic dock where one was found: a matching dock in OpenStreetMap, or a wharf drawn on the oldest USGS topographic sheet covering the port (1897–1943, via the USGS National Map); each port's card names its source, and the 15 still estimated are marked approximate.
- Old map crops on the Mosquito Fleet pins: USGS Historical Topographic Map Collection (public domain; each crop names its sheet and links to the full sheet). Lake Washington landings use only sheets from before the lake was lowered in 1916.
- Lake Washington 1909: T. H. Ellis’s map of Lake Washington and Mercer Island landings for the Anderson Steamboat Co., 1909.
