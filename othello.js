'use strict';

var svg_util = window.nSatohOthello.svgUtil;

var half_size = 4;
var size = half_size * 2;

var cell_width  = 80;
var cell_height = 80;


//-- 各セルの現在の状態記録用 -------------------
var BLACK = 0;
var WHITE = 1;
var EMPTY = -1;

var cells = [];
for (var i = 0; i < size + 2; i++) {
  cells[i] = [];
  for (var j = 0; j < size + 2; j++) {
    cells[i][j] = EMPTY;
  }
}

cells[half_size][half_size] = BLACK;
cells[half_size][half_size + 1] = WHITE;
cells[half_size + 1][half_size] = WHITE;
cells[half_size + 1][half_size + 1] = BLACK;

//-- AI実装のための準備 --
var players = [];

var HUMAN = 0;
var CPU = 1;
players[WHITE] = HUMAN;
players[BLACK] = HUMAN;

var pass_flag = [0, 0];


//-- セルに配置された石：回転アニメーションのために3パーツに分割 -------------------
var stones = [];
var stone_radius = 30;  // 石の半径
var stone_thickness = 10;  // 石の厚み半分

var BLACK_TURN = BLACK;
var WHITE_TURN = WHITE;

var turn = BLACK_TURN;

/** @type {SVGCircleElement} オンマウス時の半透明石 */
var helper_stone;
var helper_stone_i = 0;
var helper_stone_j = 0;

var dt = 0.1; // 石の回転アニメーションの間隔ミリ秒
var d_ang = 6; // 石の回転アニメーションの角度ステップ


function set_board(evt) {
  var svgsvg = evt.target;
  draw_board(svgsvg);
  draw_stones(svgsvg);
}


function draw_board(board_svg) {
  var i, j;

  var board_width  = cell_width  * size;
  var board_height = cell_height * size;

  //-- 下地 --------------------------------------------
  board_svg.appendChild(svg_util.createRect({
    'class': 'ground',
    x: 0,
    y: 0,
    width : board_width,
    height: board_height
  }));

  //--- 罫線 -------------------------------------------
  for (i = 1; i <= size - 1; i++) {
    board_svg.appendChild(svg_util.createLine({
      'class': 'rule',
      x1: cell_width * i,
      y1: 0,
      x2: cell_width * i,
      y2: board_height
    }));
  }
  for (i = 1; i <= size - 1; i++) {
    board_svg.appendChild(svg_util.createLine({
      'class': 'rule',
      x1: 0,
      y1: cell_height * i,
      x2: board_width,
      y2: cell_height * i
    }));
  }

  //--- 4箇所のドット ----------------------------------
  for (i = 0; i < 2; i++) {
    for (j = 0; j < 2; j++) {
      board_svg.appendChild(svg_util.createCircle({
        'class': 'dot',
        cx: cell_width  * 2 + cell_width  * half_size * i,
        cy: cell_height * 2 + cell_height * half_size * j,
        r: 5
      }));
    }
  }
}


function draw_stones(board_svg) {
  var i, j;

  //--- 各セルの石：回転アニメーションのために3パーツに分割 ----------------------------------
  var st_l, st_c, st_r, dr, dh, d_left, d_center, d_right;

  for (i = 1; i < size + 1; i++) {
    stones[i] = [];

    for (j = 1; j < size + 1; j++) {
      var cell = svg_util.createSVG({
        'class': 'cell',
        id: to_id(i, j),
        x: cell_width  * (i - 1),
        y: cell_height * (j - 1),
        width : cell_width,
        height: cell_height,
        viewBox: [0, 0, cell_width, cell_height].join(' ')
      });
      cell.onmouseover = on_mouse_over;
      cell.onclick = on_click;

      var stone_center_x = cell_width  / 2;
      var stone_center_y = cell_height / 2;

      dr = stone_radius * Math.cos(0);
      dh = stone_thickness * Math.sin(0);

      d_left = [
        svg_util.absM(stone_center_x - dh, stone_center_y - stone_radius),
        svg_util.relH(dh),
        svg_util.relA(dr, stone_radius, 0, 2 * stone_radius),
        svg_util.relH(-dh),
        svg_util.relA(dr, stone_radius, 0, -2 * stone_radius, { clockwise: true })
      ].join(' ');

      d_center = [
        svg_util.absM(stone_center_x, stone_center_y - stone_radius),
        svg_util.relH(dh),
        svg_util.relA(dr, stone_radius, 0, 2 * stone_radius),
        svg_util.relH(-dh),
        svg_util.relA(dr, stone_radius, 0, -2 * stone_radius, { clockwise: true })
      ].join(' ');

      d_right = [
        svg_util.absM(stone_center_x + dh, stone_center_y - stone_radius),
        svg_util.relA(dr, stone_radius, 0,  2 * stone_radius),
        svg_util.relA(dr, stone_radius, 0, -2 * stone_radius)
      ].join(' ');

      st_l = svg_util.createPath({d: d_left,   fill: 'black', 'fill-opacity': 0});
      st_c = svg_util.createPath({d: d_center, fill: 'white', 'fill-opacity': 0});
      st_r = svg_util.createPath({d: d_right,  fill: 'white', 'fill-opacity': 0});

      cell.appendChild(st_l);
      cell.appendChild(st_c);
      cell.appendChild(st_r);
      board_svg.appendChild(cell);

      stones[i][j] = {
        left  : st_l,
        center: st_c,
        right : st_r
      };
    }
  }

  for (i = 0; i < cells.length; i++) {
    for (j = 0; j < cells[i].length; j++) {
      if (cells[i][j] === EMPTY) {
        continue;
      }
      var stone = stones[i][j];
      var stone_color = (cells[i][j] === BLACK) ? 'black' : 'white';

      stone.left.setAttribute('fill-opacity', 1);
      stone.center.setAttribute('fill-opacity', 1);
      stone.right.setAttribute('fill-opacity', 1);
      stone.right.setAttribute('fill', stone_color);
    }
  }

  //-- マウスオーバー時に表示させる半透明の石 ----------
  helper_stone = svg_util.createCircle({
    'class': 'helper-stone',
    r: stone_radius
  });
  helper_stone.onclick = on_click_circle;
  board_svg.appendChild(helper_stone);
}


function to_id(i, j) {
  return (size + 2) * i + j;
}

function to_pos(id) {
  var j = id % (size + 2);
  var i = (id - j) / (size + 2);
  return { i: i, j: j };
}


function on_mouse_over(evt) {
  var pos = to_pos(evt.currentTarget.id);
  var i = pos.i;
  var j = pos.j;
  helper_stone_i = i;
  helper_stone_j = j;
  if (cells[i][j] === EMPTY) {
    var stone_color = (turn === BLACK_TURN) ? 'black' : 'white';
    helper_stone.setAttribute('fill', stone_color);
    helper_stone.setAttribute('cx', (i - 1) * cell_width + cell_width / 2);
    helper_stone.setAttribute('cy', (j - 1) * cell_height + cell_height / 2);
  }
}

function on_click(evt) {
  var pos = to_pos(evt.currentTarget.id);
  put_stone(pos.i, pos.j);
}

function on_click_circle() {
  put_stone(helper_stone_i, helper_stone_j);
}

function put_stone(i, j) {
  if (players[turn] !== HUMAN) {
    return;
  }

  var color1 = (turn === BLACK_TURN) ? 'black' : 'white';
  var color2 = (turn === BLACK_TURN) ? 'white' : 'black';
  var flip_que;

  if (cells[i][j] === EMPTY) {
    flip_que = check_stone(i, j, turn);
    if (flip_que.length > 0) {
      cells[i][j] = turn;
      coloring_stone(stones[i][j], color1);
      for (var k = 0; k < flip_que.length; k++) {
        var ci = flip_que[k][0];
        var cj = flip_que[k][1];
        cells[ci][cj] = turn;
      }
      flip_stone(flip_que, color1, color2);
      turn++;
      turn %= 2;
      turn_coloring(turn);
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
      next = cells[ci][cj];
      if (next === another) { // di=dj=0 はここで除外される
        cnt = 0;
        while (next === another) {
          ci += di;
          cj += dj;
          next = cells[ci][cj];
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

function coloring_stone(stone, color) {
  var color1 = color;
  var color2 = (color === 'black') ? 'white' : 'black';

  stone.left.setAttribute('fill', color2);
  stone.center.setAttribute('fill', color1);
  stone.right.setAttribute('fill', color1);
  stone.left.setAttribute('fill-opacity', '1');
  stone.center.setAttribute('fill-opacity', '1');
  stone.right.setAttribute('fill-opacity', '1');
}

function flip_stone(flip_que, color1, color2) {
  var ang = 0;
  flip_stone1(flip_que, ang, color1, color2);
}

function flip_stone1(flip_que, ang, color1, color2) {
  var dr = stone_radius * Math.cos(ang * Math.PI / 180);
  var dh = stone_thickness * Math.sin(ang * Math.PI / 180);

  for (var k = 0; k < flip_que.length; k++) {
    var i = flip_que[k][0];
    var j = flip_que[k][1];
    rotate1(stones[i][j], dr, dh, color1, color2);
  }

  ang += d_ang;

  var flip = (ang === 90) ? flip_stone2 : flip_stone1;
  setTimeout(function() {
    flip(flip_que, ang, color1, color2);
  }, dt); //タイマーセット．dtミリ秒ごとに1ステップ実行
}

function flip_stone2(flip_que, ang, color1, color2) {
  if (ang > 180) {
    return;
  }

  var dr = stone_radius * Math.cos(ang * Math.PI / 180);
  var dh = stone_thickness * Math.sin(ang * Math.PI / 180);

  for (var k = 0; k < flip_que.length; k++) {
    var i = flip_que[k][0];
    var j = flip_que[k][1];
    rotate2(stones[i][j], dr, dh, color1, color2);
  }

  ang += d_ang;

  setTimeout(function() {
    flip_stone2(flip_que, ang, color1, color2);
  }, dt); //タイマーセット．dtミリ秒ごとに1ステップ実行
}


function rotate1(stone, dr, dh, color1, color2) {
  var stone_center_x = cell_width  / 2;
  var stone_center_y = cell_height / 2;

  var d_left = [
    svg_util.absM(stone_center_x - dh, stone_center_y - stone_radius),
    svg_util.relH(dh),
    svg_util.relA(dr, stone_radius, 0,  2 * stone_radius),
    svg_util.relH(-dh),
    svg_util.relA(dr, stone_radius, 0, -2 * stone_radius, { clockwise: true })
  ].join(' ');

  var d_center = [
    svg_util.absM(stone_center_x, stone_center_y - stone_radius),
    svg_util.relH(dh),
    svg_util.relA(dr, stone_radius, 0,  2 * stone_radius),
    svg_util.relH(-dh),
    svg_util.relA(dr, stone_radius, 0, -2 * stone_radius, { clockwise: true })
  ].join(' ');

  var d_right = [
    svg_util.absM(stone_center_x + dh, stone_center_y - stone_radius),
    svg_util.relA(dr, stone_radius, 0,  2 * stone_radius),
    svg_util.relA(dr, stone_radius, 0, -2 * stone_radius)
  ].join(' ');

  stone.left.setAttribute('d', d_left);
  stone.center.setAttribute('d', d_center);
  stone.right.setAttribute('d', d_right);

  stone.left.setAttribute('fill', color1);
  stone.center.setAttribute('fill', color2);
  stone.right.setAttribute('fill', color2);
}

function rotate2(stone, dr, dh, color1, color2) {
  var stone_center_x = cell_width  / 2;
  var stone_center_y = cell_height / 2;

  var d_left = [
    svg_util.absM(stone_center_x - dh, stone_center_y - stone_radius),
    svg_util.relA(dr, stone_radius, 0,  2 * stone_radius),
    svg_util.relA(dr, stone_radius, 0, -2 * stone_radius)
  ].join(' ');

  var d_center = [
    svg_util.absM(stone_center_x, stone_center_y - stone_radius),
    svg_util.relH(-dh),
    svg_util.relA(dr, stone_radius, 0, 2 * stone_radius, { clockwise: true }),
    svg_util.relH(dh),
    svg_util.relA(dr, stone_radius, 0, -2 * stone_radius)
  ].join(' ');

  var d_right = [
    svg_util.absM(stone_center_x + dh, stone_center_y - stone_radius),
    svg_util.relH(-dh),
    svg_util.relA(dr, stone_radius, 0, 2 * stone_radius, { clockwise: true }),
    svg_util.relH(dh),
    svg_util.relA(dr, stone_radius, 0, -2 * stone_radius)
  ].join(' ');

  stone.left.setAttribute('d', d_left);
  stone.center.setAttribute('d', d_center);
  stone.right.setAttribute('d', d_right);

  stone.left.setAttribute('fill', color1);
  stone.center.setAttribute('fill', color1);
  stone.right.setAttribute('fill', color2);
}


function pass() {
  if (players[turn] === HUMAN) {
    turn++;
    turn %= 2;
    turn_coloring(turn);
    pass_flag[turn] = 1;
  }
}

function turn_coloring(turn) {
  var turn_stone = document.getElementById('turn-stone-holder');
  turn_stone.innerHTML = (turn === BLACK_TURN) ? '●' : '○';
}

function player_change(color, value){
  players[color] = value;
}
