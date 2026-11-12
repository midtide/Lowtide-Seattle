/**
 * Map tools: fills in map coordinates for the map spreadsheet.
 *
 * Install: in the Google Sheet choose Extensions → Apps Script, delete what is there,
 * paste this whole file, click Save, then reload the sheet. A "Map tools" menu appears.
 * The first time you use it Google asks you to authorize the script. It will say the app
 * is "unverified" because you wrote it yourself: choose Advanced → Go to (project) → Allow.
 *
 * What it does, for every dataset tab (README, Datasets, Types and Template are skipped):
 *   Fill missing coordinates   rows that have an Address but no Latitude/Longitude get them.
 *   Refine "Approximate" pins  rows whose Position is "Approximate" are looked up again and,
 *                              if Google finds the exact address, the coordinates are replaced
 *                              and Position becomes "Geocoded".
 * Rows you filled in by hand with Position left empty are never touched.
 * Uses Google's geocoder (the Maps service built into Apps Script), which has a daily quota
 * of roughly 1,000+ lookups for personal Google accounts. If it runs out, wait a day.
 */

var SKIP_TABS_ = ['readme', 'datasets', 'types', 'template'];
var MAX_KM_ = 5;               // ignore a match this far from the existing estimate
var TIME_BUDGET_MS_ = 270000;  // stop politely before Apps Script's 6 minute limit
var DEFAULT_PLACE_ = 'Seattle, WA';

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Map tools')
    .addItem('Fill missing coordinates (this tab)', 'fillThisTab')
    .addItem('Fill missing coordinates (all dataset tabs)', 'fillAllTabs')
    .addSeparator()
    .addItem('Refine “Approximate” pins (this tab)', 'refineThisTab')
    .addItem('Refine “Approximate” pins (all dataset tabs)', 'refineAllTabs')
    .addToUi();
}

function fillThisTab()   { run_('fill', true); }
function fillAllTabs()   { run_('fill', false); }
function refineThisTab() { run_('refine', true); }
function refineAllTabs() { run_('refine', false); }

function run_(mode, thisTabOnly) {
  var ss = SpreadsheetApp.getActive();
  var places = placesByTab_(ss);
  var deadline = Date.now() + TIME_BUDGET_MS_;
  var sheets = thisTabOnly ? [ss.getActiveSheet()] : ss.getSheets();
  var total = {updated: 0, notFound: 0, skippedFar: 0, kept: 0, stopped: ''};
  var skipped = [];
  for (var i = 0; i < sheets.length; i++) {
    var sh = sheets[i];
    if (SKIP_TABS_.indexOf(sh.getName().toLowerCase()) >= 0) {
      if (thisTabOnly) skipped.push(sh.getName());
      continue;
    }
    var s = processSheet_(sh, mode, places[sh.getName().toLowerCase()] || DEFAULT_PLACE_, deadline, Maps.newGeocoder());
    total.updated += s.updated; total.notFound += s.notFound; total.skippedFar += s.skippedFar; total.kept += s.kept;
    if (s.stopped) { total.stopped = s.stopped; break; }
  }
  var msg = [];
  if (skipped.length) msg.push('“' + skipped[0] + '” is not a dataset tab. Open a dataset tab first.');
  else {
    msg.push(total.updated + ' row(s) updated.');
    if (total.notFound) msg.push(total.notFound + ' address(es) were not found.');
    if (total.skippedFar) msg.push(total.skippedFar + ' match(es) were more than ' + MAX_KM_ + ' km from the existing pin and were ignored.');
    if (total.kept) msg.push(total.kept + ' address(es) only matched roughly, so the existing pin was kept.');
    if (total.stopped) msg.push(total.stopped);
  }
  SpreadsheetApp.getUi().alert('Map tools', msg.join('\n'), SpreadsheetApp.getUi().ButtonSet.OK);
}

/** Dataset tab name (lower case) → default "Place", from the Datasets tab. */
function placesByTab_(ss) {
  var out = {};
  var ds = ss.getSheetByName('Datasets');
  if (!ds || ds.getLastRow() < 2) return out;
  var v = ds.getDataRange().getValues();
  var h = headerIndex_(v[0]);
  var iName = pick_(h, ['dataset', 'name']), iTab = pick_(h, ['tab', 'sheet']), iPlace = pick_(h, ['place', 'default place']);
  for (var r = 1; r < v.length; r++) {
    var tab = String(v[r][iTab >= 0 ? iTab : iName] || v[r][iName] || '').trim();
    var place = iPlace >= 0 ? String(v[r][iPlace] || '').trim() : '';
    if (tab && place) out[tab.toLowerCase()] = place;
  }
  return out;
}

function headerIndex_(row) {
  var h = {};
  for (var i = 0; i < row.length; i++) {
    var k = String(row[i] || '').trim().toLowerCase();
    if (k && !(k in h)) h[k] = i;
  }
  return h;
}
function pick_(h, names) {
  for (var i = 0; i < names.length; i++) if (names[i] in h) return h[names[i]];
  return -1;
}
function isNum_(v) { return typeof v === 'number' && isFinite(v); }
function toNum_(v) {
  if (isNum_(v)) return v;
  var s = String(v === null || v === undefined ? '' : v).trim().replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(s) ? parseFloat(s) : null;
}

function distKm_(a, b, c, d) {
  var R = 6371, t = Math.PI / 180, dl = (c - a) * t, dn = (d - b) * t;
  var h = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(a * t) * Math.cos(c * t) * Math.sin(dn / 2) * Math.sin(dn / 2);
  return 2 * R * Math.asin(Math.sqrt(h));
}
function cleanStreet_(a) {
  return String(a).replace(/^(\d+)\s*(?:-|–|and|&)\s*\d+\b/i, '$1').replace(/^(\d+)[A-Za-z]\b/, '$1').replace(/\s+1\/2\b/, '').replace(/,?\s*(suite|ste|unit|#)\s*\S+$/i, '');
}

/**
 * Looks up one address. Returns {lat, lng, precise} or {status:'none'|'far'|'rough'}.
 * precise = Google matched the exact street address (rooftop or interpolated), not just a street or area.
 */
function lookup_(geocoder, query, ref) {
  var res = geocoder.geocode(query);
  if (!res || res.status !== 'OK' || !res.results || !res.results.length) return {status: 'none'};
  var r = res.results[0], loc = r.geometry.location, t = r.geometry.location_type;
  var lat = loc.lat, lng = loc.lng;
  if (ref && distKm_(lat, lng, ref[0], ref[1]) > MAX_KM_) return {status: 'far'};
  var precise = (t === 'ROOFTOP' || t === 'RANGE_INTERPOLATED') && !r.partial_match;
  return {status: 'ok', lat: lat, lng: lng, precise: precise};
}

/**
 * Pure-ish worker (takes the geocoder as an argument so it can be tested without Google).
 * mode 'fill': rows with an address but no coordinates.  mode 'refine': rows marked Approximate.
 */
function processSheet_(sheet, mode, defaultPlace, deadline, geocoder) {
  var stats = {updated: 0, notFound: 0, skippedFar: 0, kept: 0, stopped: ''};
  var lastRow = sheet.getLastRow(), lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return stats;
  var values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  var h = headerIndex_(values[0]);
  var iAddr = pick_(h, ['address', 'street address']);
  if (iAddr < 0) return stats;
  var iCity = pick_(h, ['city']), iState = pick_(h, ['state']);
  var iLat = pick_(h, ['latitude', 'lat']), iLon = pick_(h, ['longitude', 'lon', 'lng', 'long']);
  var iPos = pick_(h, ['position', 'pin position']);
  // add any missing output columns at the right-hand end of the header row
  var added = 0;
  function ensure_(idx, title) {
    if (idx >= 0) return idx;
    added++; var c = lastCol + added;
    sheet.getRange(1, c).setValue(title);
    for (var r = 0; r < values.length; r++) values[r].push('');
    return c - 1;
  }
  iLat = ensure_(iLat, 'Latitude'); iLon = ensure_(iLon, 'Longitude'); iPos = ensure_(iPos, 'Position');

  var changed = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var addr = String(row[iAddr] || '').trim();
    if (!addr) continue;
    var lat = toNum_(row[iLat]), lon = toNum_(row[iLon]);
    var hasCoords = lat !== null && lon !== null;
    var pos = String(row[iPos] || '').trim().toLowerCase();
    if (mode === 'fill' && hasCoords) continue;
    if (mode === 'refine' && !(hasCoords && pos.indexOf('approx') === 0)) continue;
    if (Date.now() > deadline) { stats.stopped = 'Stopped early to stay inside Google’s time limit. Run it again to continue.'; break; }

    var city = iCity >= 0 ? String(row[iCity] || '').trim() : '';
    var state = iState >= 0 ? String(row[iState] || '').trim() : '';
    var tail = (city || state) ? [city, state].filter(String).join(', ') : defaultPlace;
    var query = cleanStreet_(addr) + ', ' + tail;
    var out;
    try {
      out = lookup_(geocoder, query, hasCoords ? [lat, lon] : null);
    } catch (e) {
      stats.stopped = 'Stopped: ' + e.message;
      break;
    }
    if (out.status === 'none') { stats.notFound++; continue; }
    if (out.status === 'far') { stats.skippedFar++; continue; }
    if (mode === 'refine' && !out.precise) { stats.kept++; continue; }
    row[iLat] = Math.round(out.lat * 1e6) / 1e6;
    row[iLon] = Math.round(out.lng * 1e6) / 1e6;
    row[iPos] = out.precise ? 'Geocoded' : 'Approximate';
    changed.push(r);
    stats.updated++;
    Utilities.sleep(150);
  }
  // Write only the changed rows (in runs of consecutive rows), so every other cell,
  // including any formulas, is left exactly as it was.
  var runs = [];
  changed.forEach(function (r) {
    var last = runs[runs.length - 1];
    if (last && last[1] === r - 1) last[1] = r; else runs.push([r, r]);
  });
  runs.forEach(function (run) {
    [iLat, iLon, iPos].forEach(function (c) {
      var col = [];
      for (var r = run[0]; r <= run[1]; r++) col.push([values[r][c]]);
      sheet.getRange(run[0] + 1, c + 1, col.length, 1).setValues(col);
    });
  });
  return stats;
}
