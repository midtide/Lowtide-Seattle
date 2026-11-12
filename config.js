/* Settings for the map page. Edit this file, nothing else, to point the page at your spreadsheet.
 *
 * sheetId  The long ID from your Google Sheet's address:
 *          https://docs.google.com/spreadsheets/d/  <<< THIS PART >>>  /edit
 *          The sheet must be shared as "Anyone with the link: Viewer".
 *          Leave it empty ('') to show the built-in sample (the 88 old Seattle businesses).
 * title    Small heading above the dataset name.
 * center   [latitude, longitude] the map starts on when a dataset has no positioned places.
 * place    Added to street addresses when looking them up, if a row has no City/State
 *          (a dataset can override it with its own "Place" in the Datasets tab).
 */
window.MAP_CONFIG = {
  sheetId: '1it3mqHtfx_E8hj1sr4Ya8o0iJtDDhwML',
  title: 'Seattle, mapped',
  center: [47.6205, -122.335],
  place: 'Seattle, WA'
};
