'use strict';

var svg_util = window.nSatohOthello.svgUtil;
var genGraphScript = window.nSatohOthello.genGraphScript;

var size = 18;
var cell_size = 20;
var interval_size = 5;
var circle_adjust = -6;
var sheet_adjust = 0;

var i, j, k;
var selected = [];
for (i = 0; i < size; i++){
  selected[i] = [];
  for (j = 0; j < size; j++){
    selected[i][j] = false;
  }
}

// lattice direction
var directions_xy = [[-1,-1], [0,-1], [1,-1],  //  0  1  2
                     [-1, 0],         [1, 0],  //  3  x  4
                     [-1, 1], [0, 1], [1, 1]]; //  5  6  7


function set_board(evt) {
  var frame_width = 10;
  var cell_width  = 80;
  var cell_height = 80;

  var svgsvg = evt.target;

  //- sheet ---
  var rect = svg_util.createRect({
    x: -interval_size -sheet_adjust,
    y: -interval_size -sheet_adjust,
    width:  (cell_size + interval_size) * size + interval_size + sheet_adjust,
    height: (cell_size + interval_size) * size + interval_size + sheet_adjust,
    fill: 'silver'
  });
  svgsvg.appendChild(rect);

  //- cells ---
  for (i = 0; i < size; i++) {
    for (j = 0; j < size; j++) {
      rect = svg_util.createRect({
        id: size * i + j,
        x: (cell_size + interval_size) * j,
        y: (cell_size + interval_size)  * i,
        width : cell_size,
        height: cell_size,
        fill: 'lightgray'
      });
      rect.onmouseover = on_mouse_over;
      rect.onmouseout = on_mouse_out;
      rect.onclick = on_click;
      svgsvg.appendChild(rect);
    }
  }

  for (i = 0; i < size; i++) {
    //- colomn labels ---
    var col_x = (cell_size + interval_size)  * i + cell_size * 0.5;
    var col_y = -10;
    var circle = svg_util.createCircle({
      id: 'c' + (i + 1),
      cx: col_x,
      cy: col_y + circle_adjust,
      r: 10,
      fill: 'none'
    });
    svgsvg.appendChild(circle);
    var text = svg_util.createText({
      x: col_x,
      y: col_y,
     'text-anchor' : 'middle'
    });
    text.textContent = (i + 1);
    svgsvg.appendChild(text);

    //- row labels ---
    var row_x = -15;
    var row_y = (cell_size + interval_size)  * i + cell_size * 0.7;
    circle = svg_util.createCircle({
      id: 'r' + (i + 1),
      cx: row_x,
      cy: row_y + circle_adjust,
      r: 10,
      fill: 'none'
    });
    svgsvg.appendChild(circle);
    text = svg_util.createText({
      x: row_x,
      y: row_y,
     'text-anchor' : 'middle'
    });
    text.textContent = (i + 1);
    svgsvg.appendChild(text);
  }
}


function coordFromId(id) {
  var j = id % size;
  var i = (id - j) / size;
  return [i,j];
}

function setCellColor(i,j) {
  var id = i * size + j;
  var cell = document.getElementById(id);
  if (selected[i][j]){
    cell.setAttribute('fill', 'green');
  } else {
    cell.setAttribute('fill', 'lightgray');
  }
}

function on_click(evt) {
  var coord = coordFromId(evt.target.id);
  var i = coord[0];
  var j = coord[1];

  selected[i][j] = ! selected[i][j];
  setCellColor(i,j);
  return null;
}


function on_mouse_over(evt) {
  var cell = evt.target;
  var coord = coordFromId(cell.id);
  var i = coord[0];
  var j = coord[1];

  var rowLabel = document.getElementById('r' + (i+1));
  var colLabel = document.getElementById('c' + (j+1));
  
  rowLabel.setAttribute('fill', 'yellow');
  colLabel.setAttribute('fill', 'yellow');

  var color = selected[i][j] ? 'aquamarine' : 'lightpink';
  cell.setAttribute('fill', color);
}


function on_mouse_out(evt) {
  var coord = coordFromId(evt.target.id);
  var i = coord[0];
  var j = coord[1];
  var rowLabel = document.getElementById('r' + (i+1));
  var colLabel = document.getElementById('c' + (j+1));

  rowLabel.setAttribute('fill', 'none');
  colLabel.setAttribute('fill', 'none');
  setCellColor(i,j);
}


function setExport(){  
  if (typeof Blob == 'undefined') {
    alert('Require FileAPI.');
  } else {
    var graph_script = generateGraph();
    setBlobUrl('download', graph_script);
  }
}

function setBlobUrl(id, content) {
  var blob = new Blob([ content ], { 'type' : 'application/x-msdownload' });
 
  window.URL = window.URL || window.webkitURL;
  var dl_link = document.getElementById(id);
  dl_link.setAttribute('href', window.URL.createObjectURL(blob));
  dl_link.setAttribute('download', 'data.js');
  dl_link.textContent = 'Dowload from here.';
}


function generateGraph(){
  var vertices = getVertices();
  var indices = getIndices(vertices);
  var adjoints = generateAdjoints();
  var comment = generateCommentScript();
  var graph_script = genGraphScript(vertices, indices, adjoints, directions_xy, comment);

  return graph_script;
}

function getVertices(){
  var vertices = [];
  for (i = 0; i < size; i++){
    for (j = 0; j < size; j++){
      if (selected[i][j]) {
        vertices.push([i,j]);
      }
    }
  }
  
  return vertices;
}

function getIndices(vertices){
  var indices = [];
  for (i = 0; i < size; i++){
    indices[i] = [];
    for (j = 0; j < size; j++){
      indices[i][j] = null;
    }
  }

  for (var v_k = 0; v_k < vertices.length; v_k++){
    var v = vertices[v_k];
    indices[v[0]][v[1]] = v_k;
  }
  return indices;
}

function generateAdjoints() {
  var adjoints = [];
  var di, dj;
  for (i = 0; i < size; i++){
    adjoints[i] = [];
    for (j = 0; j < size; j++){
      adjoints[i][j] = [];
      for (var k = 0; k < directions_xy.length; k++){
        di = directions_xy[k][0];
        dj = directions_xy[k][1];
        if (existsAdjoint(i + di, j + dj)) {
          adjoints[i][j].push({direction: k,
                               terminal:  [i + di, j + dj]});
        }
      }
    }
  }

  return adjoints;
}

function existsAdjoint(i,j) {
  if (selected[i] !== undefined
      && selected[i][j] !== undefined){
    if (selected[i][j]) {
      return true;
    }
  }

  return false;
}


function generateCommentScript(){
  var comment = '  /*-- directions --\n' +
                '        0  1  2\n' +
                '        3  x  4\n' +
                '        5  6  7\n' +
                '  -----------------*/\n';
 
  var clipped_data = clippingData();
  var i_size = clipped_data.i_size;
  var j_size = clipped_data.j_size;
  var has_cell = clipped_data.data;  

  
  var CORNER          = '+';
  var HORIZONTAL_EDGE = '---';
  var VERTICAL_EDGE   = '|';
  var CELL_FILLING    = '///';
  var EMPTY_CORNER    = ' ';
  var EMPTY_H_EDGE    = '   ';
  var EMPTY_V_EDGE    = ' ';
  var EMPTY_CELL      = '   ';

  comment += '\n' + 
             '  /*\n';

  for (i = 1; i < i_size; i++){
    
    // horizontal-edges and corners
    comment += '  ';
    for (j = 1; j < j_size; j++){
      if ((has_cell[i-1][j-1]) || (has_cell[i-1][j]) ||
          (has_cell[i][j-1])   || (has_cell[i][j])) {
        comment += CORNER;
      } else {
        comment += EMPTY_CORNER;
      }
      if ((has_cell[i-1][j]) || (has_cell[i][j])) {
        comment += HORIZONTAL_EDGE;
      } else {
        comment += EMPTY_H_EDGE;
      }
    }
    comment += '\n';

    // vertical-edges and cells
    comment += '  ';
    for (j = 1; j < j_size; j++){
      if ((has_cell[i][j-1]) || (has_cell[i][j])) {
        comment += VERTICAL_EDGE;
      } else {
        comment += EMPTY_V_EDGE;
      }
      if (has_cell[i][j]) {
        comment += CELL_FILLING;
      } else {
        comment += EMPTY_CELL;
      }
    }
    comment += '\n';
  }

  comment += '  */';
  
  return comment;
}


// clipping the list "selected" and extend by adding sentinel-node arround it.
function clippingData(){
  // size check
  var i_min = size;
  var i_max = 0;
  var j_min = size;
  var j_max = 0;
  for (i = 0; i < size; i++){
    for (j = 0; j < size; j++){
      if (selected[i][j]){
        i_min = (i_min > i) ? i : i_min;
        i_max = (i_max < i) ? i : i_max;
        j_min = (j_min > j) ? j : j_min;
        j_max = (j_max < j) ? j : j_max;
      }
    }
  }
  
  var i_size = i_max - i_min + 1;  
  var j_size = j_max - j_min + 1;  
  var clipped_data = [];

  for (i = 0; i < i_size + 2; i++){
    clipped_data[i] = [];
    for (j = 0; j < j_size + 2; j++){
      if (i === 0 || i === i_size + 1 || j === 0 || j === j_size + 1){
        clipped_data[i][j] = false; // sentinel
      } else {
        clipped_data[i][j] = selected[i_min + i - 1][j_min + j - 1];
      }
    }
  }

  return {data: clipped_data,
          i_size: i_size + 2,
          j_size: j_size + 2};
}
