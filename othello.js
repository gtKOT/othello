var ns = "http://www.w3.org/2000/svg";
var board_green = 'rgb(32,128,32)';

var size = 4; // half-size

//-- 各セルの現在の状態記録用 -------------------
var cell = [];
for (var i = 0; i < size * 2 + 2; i++) {
  cell[i] = [];
  for (var j = 0; j < size * 2 + 2; j++) {
    cell[i][j] = -1; // -1:None, 0:Black, 1:White
  }
}

cell[size][size] = 0;
cell[size][size + 1] = 1;
cell[size + 1][size] = 1;
cell[size + 1][size + 1] = 0;

//-- セルに配置された石：回転アニメーションのために3パーツに分割 -------------------
var stone_l = [];
var stone_c = [];
var stone_r = [];
var s_r = 30; // 石の半径
var s_h = 10;  // 石の厚み半分

var turn = 0;
var rect = []; //各セル

var onmouse_black; // オンマウス時の半透明黒石
var onmouse_white; // 半透明白石
var onmouse_i = 0;
var onmouse_j = 0;

var dt = 0.1; // 石の回転アニメーションの間隔ミリ秒
var d_ang = 6; // 石の回転アニメーションの角度ステップ

function set_board(evt) {
  var doc = evt.target.ownerDocument;
  var svgsvg = evt.target;
  var i, j, k, x, y, fill;

  //-- 各セルを個別の正方形として作成．クリック時のイベント処理のため．--------------------
  for (i = 1; i < size * 2 + 1; i++) {
    rect[i] = [null];
    for (j = 1; j < size * 2 + 1; j++) {
      k = (2 * size + 2) * i + j;
      rect[i][j] = doc.createElementNS(ns, 'rect');
      x = 10 + 80 * (i - 1);
      y = 10 + 80 * (j - 1);
      rect[i][j].setAttribute('x', x);
      rect[i][j].setAttribute('y', y);
      rect[i][j].setAttribute('width', '80');
      rect[i][j].setAttribute('height', '80');
      rect[i][j].setAttribute('fill', board_green);
      rect[i][j].setAttribute('id', k);
      rect[i][j].setAttribute('onmouseover', 'on_mouse_over(evt)');
      //rect[i][j].setAttribute('onmouseout', 'on_mouse_out(evt)');
      rect[i][j].setAttribute('onclick', 'on_click(evt)');
      svgsvg.appendChild(rect[i][j]);
    }
  }

  //--- 罫線 -------------------------------------------
  var line;
  for (i = 0; i < size * 2; i++) {
    line = doc.createElementNS(ns, 'line');
    line.setAttribute('x1', 90 + 80 * i);
    line.setAttribute('y1', 10);
    line.setAttribute('x2', 90 + 80 * i);
    line.setAttribute('y2', 10 + 80 * size * 2);
    line.setAttribute('stroke', 'black');
    line.setAttribute('stroke-width', 2);
    svgsvg.appendChild(line);
  }
  for (i = 0; i < size * 2; i++) {
    line = doc.createElementNS(ns, 'line');
    line.setAttribute('x1', 10);
    line.setAttribute('y1', 90 + 80 * i);
    line.setAttribute('x2', 10 + 80 * size * 2);
    line.setAttribute('y2', 90 + 80 * i);
    line.setAttribute('stroke', 'black');
    line.setAttribute('stroke-width', 2);
    svgsvg.appendChild(line);
  }

  //-- 外枠 --------------------------------------------
  line = doc.createElementNS(ns, 'rect');
  line.setAttribute('x', 10);
  line.setAttribute('y', 10);
  line.setAttribute('width', 80 * size * 2);
  line.setAttribute('height', 80 * size * 2);
  line.setAttribute('fill', 'none');
  line.setAttribute('stroke', 'black');
  line.setAttribute('stroke-width', 5);
  svgsvg.appendChild(line);

  //--- 4箇所のドット ----------------------------------
  var dot;
  for (i = 0; i < 2; i++) {
    for (j = 0; j < 2; j++) {
      dot = doc.createElementNS(ns, 'circle');
      dot.setAttribute('cx', 170 + 80 * size * i);
      dot.setAttribute('cy', 170 + 80 * size * j);
      dot.setAttribute('r', 5);
      dot.setAttribute('fill', 'black');
      svgsvg.appendChild(dot);
    }
  }

  //--- 各セルの石：回転アニメーションのために3パーツに分割 ----------------------------------
  var st_l, st_c, st_r, dr, dh, d_left, d_center, d_right;

  for (i = 1; i < size * 2 + 1; i++) {

    stone_l[i] = [];
    stone_c[i] = [];
    stone_r[i] = [];
    for (j = 1; j < size * 2 + 1; j++) {
      x = 10 + 40 + 80 * (i - 1);
      y = 10 + 40 + 80 * (j - 1) - s_r;

      stone_l[i][j] = document.createElementNS(ns, 'path');
      stone_c[i][j] = document.createElementNS(ns, 'path');
      stone_r[i][j] = document.createElementNS(ns, 'path');

      st_l = stone_l[i][j];
      st_c = stone_c[i][j];
      st_r = stone_r[i][j];

      dr = s_r * Math.cos(0);
      dh = s_h * Math.sin(0);

      d_left   = "M" + (x - dh) + "," + y;
      d_center = "M" + x + "," + y;
      d_right  = "M" + (x + dh) + "," + y;

      d_left   += " h" + dh + " a" + dr + "," + s_r + " 0 0,0 0," + (2 * s_r);
      d_left   += " h" + (-dh) + " a" + dr + "," + s_r + " 0 0,1 0," + (-2 * s_r);
      d_center += " h" + dh + " a" + dr + "," + s_r + " 0 0,0 0," + (2 * s_r);
      d_center += " h" + (-dh) + " a" + dr + "," + s_r + " 0 0,1 0," + (-2 * s_r);
      d_right  += " a" + dr + "," + s_r + " 0 0,0 0," + (2 * s_r);
      d_right  += " a" + dr + "," + s_r + " 0 0,0 0," + (-2 * s_r);

      st_l.setAttribute("d", d_left);
      st_c.setAttribute("d", d_center);
      st_r.setAttribute("d", d_right);

      st_l.setAttribute("fill", "black");
      st_c.setAttribute("fill", "white");
      st_r.setAttribute("fill", "white");

      st_l.setAttribute("fill-opacity", "0");
      st_c.setAttribute("fill-opacity", "0");
      st_r.setAttribute("fill-opacity", "0");

      svgsvg.appendChild(st_l);
      svgsvg.appendChild(st_c);
      svgsvg.appendChild(st_r);
    }
  }

  for (i = size; i < size + 2; i++) {
    for (j = size; j < size + 2; j++) {
      stone_l[i][j].setAttribute("fill-opacity", "1");
      stone_c[i][j].setAttribute("fill-opacity", "1");
      stone_r[i][j].setAttribute("fill-opacity", "1");
    }
  }
  stone_r[size][size].setAttribute("fill", "black");
  stone_r[size + 1][size + 1].setAttribute("fill", "black");


  //-- マウスオーバー時に表示させる半透明の石 ----------
  onmouse_black = doc.createElementNS(ns, 'circle');
  onmouse_black.setAttribute('cx', 10 + 40);
  onmouse_black.setAttribute('cy', 10 + 40);
  onmouse_black.setAttribute('r', 30);
  onmouse_black.setAttribute('fill', 'black');
  onmouse_black.setAttribute('fill-opacity', '0');
  onmouse_black.setAttribute('onclick', 'on_click_circle(evt)');
  svgsvg.appendChild(onmouse_black);

  onmouse_white = doc.createElementNS(ns, 'circle');
  onmouse_white.setAttribute('cx', 10 + 40);
  onmouse_white.setAttribute('cy', 10 + 40);
  onmouse_white.setAttribute('r', 30);
  onmouse_white.setAttribute('fill', 'white');
  onmouse_white.setAttribute('fill-opacity', '0');
  onmouse_white.setAttribute('onclick', 'on_click_circle(evt)');
  svgsvg.appendChild(onmouse_white);

}


function on_mouse_over(evt) {
  var id = evt.target.id;
  var j = id % (size * 2 + 2);
  var i = (id - j) / (size * 2 + 2);
  onmouse_i = i;
  onmouse_j = j;
  if (cell[i][j] === -1) {
    if (turn === 0) {
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

function on_mouse_out() {
  onmouse_black.setAttribute('fill-opacity', '0');
  onmouse_white.setAttribute('fill-opacity', '0');
}

function on_click(evt) {
  var id = evt.target.id;
  var j = id % (size * 2 + 2);
  var i = (id - j) / (size * 2 + 2);

  click(i, j);
}

function on_click_circle() {
  click(onmouse_i, onmouse_j);
}

function click(i, j) {
  var color1, color2, flip_que;
  if (turn === 0) {
    color1 = "black";
    color2 = "white";
  }
  else {
    color1 = "white";
    color2 = "black";
  }
  if (cell[i][j] === -1) {
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
  if (color === "black") {
    color2 = "white";
  }
  else {
    color2 = "black";
  }

  var st_l = stone_l[i][j];
  var st_c = stone_c[i][j];
  var st_r = stone_r[i][j];

  st_l.setAttribute("fill", color2);
  st_c.setAttribute("fill", color1);
  st_r.setAttribute("fill", color1);
  st_l.setAttribute("fill-opacity", "1");
  st_c.setAttribute("fill-opacity", "1");
  st_r.setAttribute("fill-opacity", "1");
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

  var d_left   = "M" + (x - dh) + "," + y;
  var d_center = "M" + x + "," + y;
  var d_right  = "M" + (x + dh) + "," + y;

  d_left   += " h" + dh + " a" + dr + "," + s_r + " 0 0,0 0," + (2 * s_r);
  d_left   += " h" + (-dh) + " a" + dr + "," + s_r + " 0 0,1 0," + (-2 * s_r);
  d_center += " h" + dh + " a" + dr + "," + s_r + " 0 0,0 0," + (2 * s_r);
  d_center += " h" + (-dh) + " a" + dr + "," + s_r + " 0 0,1 0," + (-2 * s_r);
  d_right  += " a" + dr + "," + s_r + " 0 0,0 0," + (2 * s_r);
  d_right  += " a" + dr + "," + s_r + " 0 0,0 0," + (-2 * s_r);

  left.setAttribute("d", d_left);
  center.setAttribute("d", d_center);
  right.setAttribute("d", d_right);

  left.setAttribute("fill", color1);
  center.setAttribute("fill", color2);
  right.setAttribute("fill", color2);
}

function rotate2(i, j, dr, dh, color1, color2) {
  var left   = stone_l[i][j];
  var center = stone_c[i][j];
  var right  = stone_r[i][j];

  var x = 10 + 40 + 80 * (i - 1);
  var y = 10 + 40 + 80 * (j - 1) - s_r;

  var d_left = "M" + (x - dh) + "," + y;
  var d_center = "M" + x + "," + y;
  var d_right = "M" + (x + dh) + "," + y;

  d_left   += " a" + dr + "," + s_r + " 0 0,0 0," + (2 * s_r);
  d_left   += " a" + dr + "," + s_r + " 0 0,0 0," + (-2 * s_r);
  d_center += " h" + (-dh) + " a" + dr + "," + s_r + " 0 0,1 0," + (2 * s_r);
  d_center += " h" + dh + " a" + dr + "," + s_r + " 0 0,0 0," + (-2 * s_r);
  d_right  += " h" + (-dh) + " a" + dr + "," + s_r + " 0 0,1 0," + (2 * s_r);
  d_right  += " h" + dh + " a" + dr + "," + s_r + " 0 0,0 0," + (-2 * s_r);

  left.setAttribute("d", d_left);
  center.setAttribute("d", d_center);
  right.setAttribute("d", d_right);

  left.setAttribute("fill", color1);
  center.setAttribute("fill", color1);
  right.setAttribute("fill", color2);
}


function pass() {
  var pass_button = document.getElementById("pass");
  pass_button.setAttribute("fill", "pink");
  turn++;
  turn %= 2;
  turn_coloring(turn);
  setTimeout("pass_color_reset()", 100);
}

function pass_color_reset() {
  var pass_button = document.getElementById("pass");
  pass_button.setAttribute("fill", "skyblue");
}

function turn_coloring(turn) {
  var turn_stone = document.getElementById("turn_stone");
  if (turn === 1) {
    turn_stone.setAttribute("fill", "white");
  }
  else {
    turn_stone.setAttribute("fill", "black");
  }
}
