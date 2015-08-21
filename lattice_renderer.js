(function(nSatohOthello) {
  'use strict';
   
  var svg_util = nSatohOthello.svgUtil;

  // 中間生成オブジェクト？（生き残らせた方が良いかもしれない）
  function Cell(vertex){
    this.x = undefined;
    this.y = undefined;
    this.vertex = vertex;
    this.group = undefined;
    this.id = vertex.getId();
  }
  
   
  function draw_board(board_svg, cell_width, cell_height, graph_data, cell_directions) {
    var i, j;

    /*-- sample --
      <g transform="translate(100,100)">
        <rect x="0" y="0" width="100" height="100" fill="lightgreen" stroke="black" stroke-width="5" />
        <rect x="100" y="50" width="100" height="100" fill="lightgreen" stroke="black" stroke-width="5" />
      </g>
     --*/

    // id: CellObject の形で格納する．現状では配列と大差ない．
    var cells = {};

    // 各頂点の座標決定を待っているグループidを記録
    // cell_id: [{group_id, direction}, ...] の形
    var suspended_group_queues = {};

    // グループに属しているcellを，id: [cell, ...]の形で格納する
    var groups = {};
    
    // 各頂点に対応するセルの座標を決定

    var vertices = graph_data.getVertices();
    var group_id = 0;
    for (var v_num = 0; v_num < vertices.length; v_num++) {
      var v = vertices[v_num];
      var cell = new Cell(v);
      cells[cell.id] = cell;
      
      var min_edge = v.getMinEdge();
      var min_terminal_id = min_edge.getTerminal().getId();
      var direction_vector = cell_directions[min_edge.getDirection()];
      
      if (v.getId() > min_terminal_id) {
        // 既存のセルグループに追加
        var parent_cell = cells[min_terminal_id];
        
        cell.group = parent_cell.group;
        cell.x = parent_cell.x - direction_vector[0] * cell_width;
        cell.y = parent_cell.y - direction_vector[1] * cell_height;
        groups[cell.group].push(cell);
      } else {
        // 新規セルグループ
        cell.group = group_id;
        group_id ++;
        cell.x = 0; // 気持ちの上ではここを - direction_vector[0] * cell_width にしたい(というか new Cell(v)の時点でしたい)が
        cell.y = 0; // initial cellだけ処理を変えないと面倒になりそうなのでそうしない．
        groups[cell.group] = [cell];
        if (v_num > 0){ // 最初のvertexはqueueに入れない．
          // 未定義なら空リスト作成
          suspended_group_queues[min_terminal_id] = suspended_group_queues[min_terminal_id] || [];
          suspended_group_queues[min_terminal_id].push({group:cell.group, direction:direction_vector});
        }
      }

      // このcell用のqueueにある子グループの各child_cellを，
      // このcellの位置 - direction 分だけ移動してこのセルグループに結合させる．
      var queue = suspended_group_queues[cell.id] || []; // undefined回避
      for (var k = 0; k < queue.length; k++ ) {
        var child_group_id = queue[k].group;
        var direction_to_parent = queue[k].direction;
        var child_group = groups[child_group_id];
        for (var cell_k = 0; cell_k < child_group.length; cell_k++ ) {
          var child_cell = child_group[cell_k];
          child_cell.x += cell.x - direction_to_parent[0] * cell_width;
          child_cell.y += cell.y - direction_to_parent[1] * cell_height;
          child_cell.group = cell.group;
        }

        // 子グループを親グループに統合
        groups[cell.id] += groups[child_group_id];
        groups[child_group_id] = null;
      }                  
    }




    // board 全体を平行移動するためにグループ要素
    var group_of_cells = svg_util.createG({
      id: "cells"
    });

    board_svg.appendChild(group_of_cells);

    
    //-- 下地 --------------------------------------------
    group_of_cells.appendChild(svg_util.createRect({
      'class': 'ground',
      x: 0,
      y: 0,
      width : cell_width,
      height: cell_height
    }));
   
    //--- 罫線 -------------------------------------------
    for (i = 1; i <= size - 1; i++) {
      group_of_cells.appendChild(svg_util.createLine({
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
        group_of_cells.appendChild(svg_util.createCircle({
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
