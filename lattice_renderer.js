(function(nSatohOthello) {
  'use strict';
   
  var svg_util = nSatohOthello.svgUtil;

  // 中間生成オブジェクト？（生き残らせた方が良いかもしれない）
  function Cell(vertex){
    this.x = undefined;
    this.y = undefined;
    this.vertex = vertex;
    this.group = undefined;
  }
  
   
  function draw_board(board_svg, cell_width, cell_height, graph_data, cell_directions) {
    var i, j;

    /*-- sample --
      <g transform="translate(100,100)">
        <rect x="0" y="0" width="100" height="100" fill="lightgreen" stroke="black" stroke-width="5" />
        <rect x="100" y="50" width="100" height="100" fill="lightgreen" stroke="black" stroke-width="5" />
      </g>
     --*/

    var cells = [];

    // 各頂点の座標決定を待っているグループidを記録
    var suspended_group_queues = {};

    
    // board 全体を平行移動するためにグループ要素
    var group_of_cells = svg_util.createG({
      id: "cells"
    });

    board_svg.appendChild(board_cells);

    /*--
      for v in vertices:
          min_terminal = min(e.getTerminal for e in v.getEdges)
          if min_terminal in already_rendered:
              get x, y of vertex (whose id == min_terminal)
              set (x of v) = x + direction[0] * cell_width 
              set (y of v) = y + direction[1] * cell_height
              record group_id 
          else:
              set x, y = 0, 0 # temp 
              push min_terminal to queue
              group_id ++
              record group_id
          search id of v in queue
          if found:
              move the group who wait v
              and rewrite group_id of it
    --*/

    
    //-- 下地 --------------------------------------------
    board_cells.appendChild(svg_util.createRect({
      'class': 'ground',
      x: 0,
      y: 0,
      width : cell_width  * size,
      height: cell_height * size
    }));
   
    //--- 罫線 -------------------------------------------
    for (i = 1; i <= size - 1; i++) {
      board_cells.appendChild(svg_util.createLine({
        'class': 'rule',
        x1: cell_width * i,
        y1: 0,
        x2: cell_width * i,
        y2: cell_height * size
      }));
    }
    for (i = 1; i <= size - 1; i++) {
      board_svg.appendChild(svg_util.createLine({
        'class': 'rule',
        x1: 0,
        y1: cell_width * i,
        x2: cell_height * size,
        y2: cell_width * i
      }));
    }
   
    //--- 4箇所のドット ----------------------------------
    for (i = 0; i < 2; i++) {
      for (j = 0; j < 2; j++) {
        board_cells.appendChild(svg_util.createCircle({
          'class': 'dot',
          cx: cell_width  * 2 + cell_width  * half_size * i,
          cy: cell_height * 2 + cell_height * half_size * j,
          r: 5
        }));
      }
    }
  }

  nSatohOthello.draw_board = draw_board;
  
})(window.nSatohOthello);
