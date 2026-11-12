/* Settings for the map page.
 *
 * data     Folder holding the map's data as CSV files (the default, 'data/'):
 *            datasets.csv   one row per dataset (each becomes a button at the top of the page)
 *            types.csv      optional colors and pin shapes for each type
 *            <tab>.csv      one file per dataset, named after its "Tab" in datasets.csv,
 *                           lower-case with dashes: "Old businesses" -> old-businesses.csv
 * sheetId  Optional. The ID of a Google Sheet with the same tabs, shared as
 *          "Anyone with the link: Viewer". If set, it is used instead of the data folder.
 *          Leave it empty ('') to use the data folder.
 * title    Small heading above the dataset name.
 * center   [latitude, longitude] the map starts on when a dataset has no positioned places.
 * place    Added to street addresses when looking them up, if a row has no City/State
 *          (a dataset can override it with its own "Place" in datasets.csv).
 */
window.MAP_CONFIG = {
  data: 'data/',
  sheetId: '',
  title: 'Seattle, mapped',
  center: [47.6205, -122.335],
  place: 'Seattle, WA'
};
