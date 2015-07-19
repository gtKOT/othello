'use strict';

var svg_util = window.nSatohOthello.svgUtil;

var board_green = 'rgb(32,128,32)';

var half_size = 4;
var size = half_size * 2;


//-- 各セルの現在の状態記録用 -------------------
var BLACK = 0;
var WHITE = 1;
var EMPTY = -1;

var cell = [];
for (var i = 0; i < size + 2; i++) {
  cell[i] = [];
  for (var j = 0; j < size + 2; j++) {
    cell[i][j] = EMPTY;
  }
}

cell[half_size][half_size] = BLACK;
cell[half_size][half_size + 1] = WHITE;
cell[half_size + 1][half_size] = WHITE;
cell[half_size + 1][half_size + 1] = BLACK;

//-- セルに配置された石：回転アニメーションのために3パーツに分割 -------------------
var stone_l = [];
var stone_c = [];
var stone_r = [];
var s_r = 30; // 石の半径
var s_h = 10;  // 石の厚み半分

var BLACK_TURN = BLACK;
var WHITE_TURN = WHITE;

var turn = BLACK_TURN;
var rects = []; //各セル

/** @type {SVGCircleElement} オンマウス時の半透明黒石 */
var onmouse_black;
/** @type {SVGCircleElement} 半透明白石 */
var onmouse_white;
var onmouse_i = 0;
var onmouse_j = 0;

var dt = 0.1; // 石の回転アニメーションの間隔ミリ秒
var d_ang = 6; // 石の回転アニメーションの角度ステップ


function set_board(evt) {
  var svgsvg = evt.target;
  var i, j, x, y, fill;

  var cell_width  = 80;
  var cell_height = 80;

  //-- 各セルを個別の正方形として作成．クリック時のイベント処理のため．--------------------
  for (i = 1; i < size + 1; i++) {
    rects[i] = [];

    for (j = 1; j < size + 1; j++) {
      var rect = svg_util.createRect({
        id: (size + 2) * i + j,
        x: 10 + cell_width  * (i - 1),
        y: 10 + cell_height * (j - 1),
        width : cell_width,
        height: cell_height,
        fill: board_green
      });
      rect.onmouseover = on_mouse_over;
      rect.onclick = on_click;
      svgsvg.appendChild(rect);

      rects[i][j] = rect;
    }
  }

  //--- 罫線 -------------------------------------------
  for (i = 0; i < size; i++) {
    svgsvg.appendChild(svg_util.createLine({
      x1: (10 + cell_width) + cell_width * i,
      y1: 10,
      x2: (10 + cell_width) + cell_width * i,
      y2: 10 + cell_height * size,
      stroke: 'black',
      'stroke-color': 2
    }));
  }
  for (i = 0; i < size; i++) {
    svgsvg.appendChild(svg_util.createLine({
      x1: 10,
      y1: (10 + cell_width) + cell_width * i,
      x2: 10 + cell_height * size,
      y2: (10 + cell_width) + cell_width * i,
      stroke: 'black',
      'stroke-color': 2
    }));
  }

  //-- 外枠 --------------------------------------------
  svgsvg.appendChild(svg_util.createRect({
    x: 10,
    y: 10,
    width : cell_width * size,
    height: cell_height * size,
    fill: 'none',
    stroke: 'black',
    'stroke-width': 5
  }));

  //--- 4箇所のドット ----------------------------------
  for (i = 0; i < 2; i++) {
    for (j = 0; j < 2; j++) {
      svgsvg.appendChild(svg_util.createCircle({
        cx: (10 + cell_width  * 2) + cell_width  * half_size * i,
        cy: (10 + cell_height * 2) + cell_height * half_size * j,
        r: 5,
        fill: 'black'
      }));
    }
  }

  //--- 各セルの石：回転アニメーションのために3パーツに分割 ----------------------------------
  var st_l, st_c, st_r, dr, dh, d_left, d_center, d_right;

  for (i = 1; i < size + 1; i++) {
    stone_l[i] = [];
    stone_c[i] = [];
    stone_r[i] = [];
    for (j = 1; j < size + 1; j++) {
      x = 10 + cell_width  / 2 + cell_width  * (i - 1);
      y = 10 + cell_height / 2 + cell_height * (j - 1) - s_r;

      dr = s_r * Math.cos(0);
      dh = s_h * Math.sin(0);

      d_left   = 'M' + (x - dh) + ',' + y;
      d_center = 'M' + x + ',' + y;
      d_right  = 'M' + (x + dh) + ',' + y;

      d_left   += ' h' + dh + ' a' + dr + ',' + s_r + ' 0 0,0 0,' + (2 * s_r);
      d_left   += ' h' + (-dh) + ' a' + dr + ',' + s_r + ' 0 0,1 0,' + (-2 * s_r);
      d_center += ' h' + dh + ' a' + dr + ',' + s_r + ' 0 0,0 0,' + (2 * s_r);
      d_center += ' h' + (-dh) + ' a' + dr + ',' + s_r + ' 0 0,1 0,' + (-2 * s_r);
      d_right  += ' a' + dr + ',' + s_r + ' 0 0,0 0,' + (2 * s_r);
      d_right  += ' a' + dr + ',' + s_r + ' 0 0,0 0,' + (-2 * s_r);

      st_l = svg_util.createPath({d: d_left,   fill: 'black', 'fill-opacity': 0});
      st_c = svg_util.createPath({d: d_center, fill: 'white', 'fill-opacity': 0});
      st_r = svg_util.createPath({d: d_right,  fill: 'white', 'fill-opacity': 0});

      svgsvg.appendChild(st_l);
      svgsvg.appendChild(st_c);
      svgsvg.appendChild(st_r);

      stone_l[i][j] = st_l;
      stone_c[i][j] = st_c;
      stone_r[i][j] = st_r;
    }
  }

  for (i = half_size; i < half_size + 2; i++) {
    for (j = half_size; j < half_size + 2; j++) {
      stone_l[i][j].setAttribute('fill-opacity', 1);
      stone_c[i][j].setAttribute('fill-opacity', 1);
      stone_r[i][j].setAttribute('fill-opacity', 1);
    }
  }
  stone_r[half_size][half_size].setAttribute('fill', 'black');
  stone_r[half_size + 1][half_size + 1].setAttribute('fill', 'black');


  //-- マウスオーバー時に表示させる半透明の石 ----------
  onmouse_black = svg_util.createCircle({
    cx: 10 + cell_width  / 2,
    cy: 10 + cell_height / 2,
    r: 30,
    fill: 'black'
  });
  onmouse_black.setAttribute('fill-opacity', 0);
  onmouse_black.onclick = on_click_circle;
  svgsvg.appendChild(onmouse_black);

  onmouse_white = svg_util.createCircle({
    cx: 10 + cell_width  / 2,
    cy: 10 + cell_height / 2,
    r: 30,
    fill: 'white'
  });
  onmouse_white.setAttribute('fill-opacity', 0);
  onmouse_white.onclick = on_click_circle;
  svgsvg.appendChild(onmouse_white);
}


function on_mouse_over(evt) {
  var id = evt.target.id;
  var j = id % (size + 2);
  var i = (id - j) / (size + 2);
  onmouse_i = i;
  onmouse_j = j;
  if (cell[i][j] === EMPTY) {
    if (turn === BLACK_TURN) {
      onmouse_black.setAttribute('cx', 10 + 40 + (i - 1) * 80);
      onmouse_black.setAttribute('cy', 10 + 40 + (j - 1) * 80);
      onmouse_black.setAttribute('fill-opacity', '0.5');
    }
    else {
      onmouse_white.setAttribute('cx', 10 + 40 + (i - 1) * 80);
      onmouse_white.setAttribute('cy', 10 + 40 + (j - 1) * 80);
      onmouse_white.setAttribute('fill-opacity', '0.5');
    }
  }
}

function on_click(evt) {
  var id = evt.target.id;
  var j = id % (size + 2);
  var i = (id - j) / (size + 2);

  click(i, j);
}

function on_click_circle() {
  click(onmouse_i, onmouse_j);
}

function click(i, j) {
  var color1, color2, flip_que;
  if (turn === BLACK_TURN) {
    color1 = 'black';
    color2 = 'white';
  }
  else {
    color1 = 'white';
    color2 = 'black';
  }
  if (cell[i][j] === EMPTY) {
    flip_que = check_stone(i, j, turn);
    if (flip_que.length > 0) {
      cell[i][j] = turn;
      coloring_stone(i, j, color1);
      for (var k = 0; k < flip_que.length; k++) {
        var ci = flip_que[k][0];
        var cj = flip_que[k][1];
        cell[ci][cj] = turn;
      }
      flip_stone(flip_que, color1, color2);
      turn++;
      turn %= 2;
    }
  }
}


function check_stone(i, j, turn) {
  var flip_que = [];
  var itself = turn;
  var another = (turn + 1) % 2;
  var cnt, ci, cj, next, ti, tj;
  for (var di = -1; di < 2; di++) {
    for (var dj = -1; dj < 2; dj++) {
      ci = i + di;
      cj = j + dj;
      next = cell[ci][cj];
      if (next === another) { // di=dj=0 はここで除外される
        cnt = 0;
        while (next === another) {
          ci += di;
          cj += dj;
          next = cell[ci][cj];
          cnt++;
        }
        if (next === itself) {
          ti = i;
          tj = j;
          for (var k = 0; k < cnt; k++) {
            ti += di;
            tj += dj;
            flip_que.push([ti, tj]);
          }
        }
      }
    }
  }

  return flip_que;
}

function coloring_stone(i, j, color) {
  var color1 = color;
  var color2;
  if (color === 'black') {
    color2 = 'white';
  }
  else {
    color2 = 'black';
  }

  var st_l = stone_l[i][j];
  var st_c = stone_c[i][j];
  var st_r = stone_r[i][j];

  st_l.setAttribute('fill', color2);
  st_c.setAttribute('fill', color1);
  st_r.setAttribute('fill', color1);
  st_l.setAttribute('fill-opacity', '1');
  st_c.setAttribute('fill-opacity', '1');
  st_r.setAttribute('fill-opacity', '1');
}

function flip_stone(flip_que, color1, color2) {
  onmouse_black.setAttribute('fill-opacity', '0'); // 半透明石が変な位置に
  onmouse_white.setAttribute('fill-opacity', '0'); // 表示されるのを防ぐため

  var ang = 0;
  flip_stone1(flip_que, ang, color1, color2);
}

function flip_stone1(flip_que, ang, color1, color2) {
  var dr = s_r * Math.cos(ang * Math.PI / 180);
  var dh = s_h * Math.sin(ang * Math.PI / 180);

  for (var k = 0; k < flip_que.length; k++) {
    var i = flip_que[k][0];
    var j = flip_que[k][1];
    rotate1(i, j, dr, dh, color1, color2);
  }

  ang += d_ang;

  if (ang === 90) {
    setTimeout(function() {
      flip_stone2(flip_que, ang, color1, color2);
    }, dt); //タイマーセット．dtミリ秒ごとに1ステップ実行
  }
  else {
    setTimeout(function() {
      flip_stone1(flip_que, ang, color1, color2);
    }, dt); //タイマーセット．dtミリ秒ごとに1ステップ実行
  }
}

function flip_stone2(flip_que, ang, color1, color2) {
  if (ang > 180) {
    return;
  }

  var dr = s_r * Math.cos(ang * Math.PI / 180);
  var dh = s_h * Math.sin(ang * Math.PI / 180);

  for (var k = 0; k < flip_que.length; k++) {
    var i = flip_que[k][0];
    var j = flip_que[k][1];
    rotate2(i, j, dr, dh, color1, color2);
  }

  ang += d_ang;

  setTimeout(function() {
    flip_stone2(flip_que, ang, color1, color2);
  }, dt); //タイマーセット．dtミリ秒ごとに1ステップ実行
}


function rotate1(i, j, dr, dh, color1, color2) {
  var left   = stone_l[i][j];
  var center = stone_c[i][j];
  var right  = stone_r[i][j];

  var x = 10 + 40 + 80 * (i - 1);
  var y = 10 + 40 + 80 * (j - 1) - s_r;

  var d_left   = 'M' + (x - dh) + ',' + y;
  var d_center = 'M' + x + ',' + y;
  var d_right  = 'M' + (x + dh) + ',' + y;

  d_left   += ' h' + dh + ' a' + dr + ',' + s_r + ' 0 0,0 0,' + (2 * s_r);
  d_left   += ' h' + (-dh) + ' a' + dr + ',' + s_r + ' 0 0,1 0,' + (-2 * s_r);
  d_center += ' h' + dh + ' a' + dr + ',' + s_r + ' 0 0,0 0,' + (2 * s_r);
  d_center += ' h' + (-dh) + ' a' + dr + ',' + s_r + ' 0 0,1 0,' + (-2 * s_r);
  d_right  += ' a' + dr + ',' + s_r + ' 0 0,0 0,' + (2 * s_r);
  d_right  += ' a' + dr + ',' + s_r + ' 0 0,0 0,' + (-2 * s_r);

  left.setAttribute('d', d_left);
  center.setAttribute('d', d_center);
  right.setAttribute('d', d_right);

  left.setAttribute('fill', color1);
  center.setAttribute('fill', color2);
  right.setAttribute('fill', color2);
}

function rotate2(i, j, dr, dh, color1, color2) {
  var left   = stone_l[i][j];
  var center = stone_c[i][j];
  var right  = stone_r[i][j];

  var x = 10 + 40 + 80 * (i - 1);
  var y = 10 + 40 + 80 * (j - 1) - s_r;

  var d_left = 'M' + (x - dh) + ',' + y;
  var d_center = 'M' + x + ',' + y;
  var d_right = 'M' + (x + dh) + ',' + y;

  d_left   += ' a' + dr + ',' + s_r + ' 0 0,0 0,' + (2 * s_r);
  d_left   += ' a' + dr + ',' + s_r + ' 0 0,0 0,' + (-2 * s_r);
  d_center += ' h' + (-dh) + ' a' + dr + ',' + s_r + ' 0 0,1 0,' + (2 * s_r);
  d_center += ' h' + dh + ' a' + dr + ',' + s_r + ' 0 0,0 0,' + (-2 * s_r);
  d_right  += ' h' + (-dh) + ' a' + dr + ',' + s_r + ' 0 0,1 0,' + (2 * s_r);
  d_right  += ' h' + dh + ' a' + dr + ',' + s_r + ' 0 0,0 0,' + (-2 * s_r);

  left.setAttribute('d', d_left);
  center.setAttribute('d', d_center);
  right.setAttribute('d', d_right);

  left.setAttribute('fill', color1);
  center.setAttribute('fill', color1);
  right.setAttribute('fill', color2);
}


function pass() {
  var pass_button = document.getElementById('pass');
  pass_button.setAttribute('fill', 'pink');
  turn++;
  turn %= 2;
  turn_coloring(turn);
  setTimeout(pass_color_reset, 100);
}

function pass_color_reset() {
  var pass_button = document.getElementById('pass');
  pass_button.setAttribute('fill', 'skyblue');
}

function turn_coloring(turn) {
  var turn_stone = document.getElementById('turn_stone');
  if (turn === BLACK_TURN) {
    turn_stone.setAttribute('fill', 'black');
  }
  else {
    turn_stone.setAttribute('fill', 'white');
  }
}
