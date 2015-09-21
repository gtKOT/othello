(function(nSatohOthello) {
  'use strict';

  var svg_util = nSatohOthello.svgUtil;

  // 中間生成オブジェクト？（生き残らせた方が良いかもしれない）
  function Cell(vertex) {
    /** @type {number} */
    this.x = undefined;
    /** @type {number} */
    this.y = undefined;
    /** @type {Vertex} */
    this.vertex = vertex;
    /** @type {number} */
    this.groupId = undefined;
    /** @type {number} */
    this.id = vertex.getId();
  }


  /**
   * @param {Cell} cell
   * @param {number} width
   * @param {number} height
   * @returns {SVGRectElement}
   * @private
   */
  function _cell_to_svg(cell, width, height) {
    return svg_util.createRect({
      'class': 'ground',
      x      : cell.x,
      y      : cell.y,
      width  : width,
      height : height
    });
  }


  function draw_board(board_svg, cell_width, cell_height, graph, cell_directions) {
    /*-- sample --
     <g transform="translate(100,100)">
       <rect x="0" y="0" width="100" height="100" fill="lightgreen" stroke="black" stroke-width="5" />
       <rect x="100" y="50" width="100" height="100" fill="lightgreen" stroke="black" stroke-width="5" />
     </g>
    --*/
    var vertices = graph.getVertices();

    // vertex_id: CellObject の形で格納する．現状では配列と大差ない．
    var cells = {};
    vertices.forEach(function(v) {
      cells[v.getId()] = new Cell(v);
    });

    // グループに属しているcellを，group_id: [cell, ...]の形で格納する
    var group_id = 0;
    var groups = {};

    // 各頂点に対応するセルの座標を決定
    vertices.forEach(function(v) {
      var neighbor_groups = [];  // TODO 名前変更
      var found_group_flags = {};

      v.getEdges().forEach(function(e) {
        var v_id = v.getId();
        var terminal_v = e.getTerminal();
        var terminal_v_id = terminal_v.getId();
        if (terminal_v_id < v_id) {
          var terminal_v_group_id = cells[terminal_v_id].groupId;
          // ここで重複は排除しておきたい．
          if (!found_group_flags[terminal_v_group_id]) {
            found_group_flags[terminal_v_group_id] = true;
            neighbor_groups.push({
              groupId          : terminal_v_group_id,
              connectionPointId: terminal_v_id,
              directionToGroup : e.getDirection()
            });
          }
        }
      });

      // グループ番号の若い順にソート
      neighbor_groups.sort(function(a, b) {
        if (a.groupId < b.groupId) return -1;
        if (a.groupId > b.groupId) return 1;
        return 0;
      });

      var cell = cells[v.getId()];

      if (neighbor_groups.length > 0) {
        // 既存のセルグループに追加
        var parent_group_id = neighbor_groups[0].groupId;
        var parent_v_id = neighbor_groups[0].connectionPointId;
        var unit_vector_to_parent = cell_directions[neighbor_groups[0].directionToGroup];

        cell.x = cells[parent_v_id].x - unit_vector_to_parent[0] * cell_width;
        cell.y = cells[parent_v_id].y - unit_vector_to_parent[1] * cell_height;
        cell.groupId = parent_group_id;
        groups[parent_group_id].push(cell);

        // 残りのグループたちをこのセルに結合
        for (var i = 1; i < neighbor_groups.length; i++) {
          var child_group_id = neighbor_groups[i].groupId;
          var child_group = groups[child_group_id];
          var unit_vector_to_child = cell_directions[neighbor_groups[i].directionToGroup];
          var linked_cell = cells[neighbor_groups[i].connectionPointId];

          child_group.forEach(function(child_cell) {
            child_cell.x += (cell.x - linked_cell.x) + unit_vector_to_child[0] * cell_width;
            child_cell.y += (cell.y - linked_cell.y) + unit_vector_to_child[1] * cell_height;
            child_cell.groupId = parent_group_id;
          });

          // 子グループを親グループに統合
          Array.prototype.push.apply(groups[parent_group_id], groups[child_group]);
          groups[child_group_id] = null;
        }

      }
      else {
        // 新規セルグループ
        cell.x = 0;
        cell.y = 0;
        cell.groupId = group_id;
        groups[group_id] = [cell];
        group_id++;
      }

    });



    // board 全体を平行移動するためにグループ要素
    var group_of_cells = svg_util.createG({
      id: 'cells'
    });

    //-- 下地 --------------------------------------------   
    for (var key in cells) {
      group_of_cells.appendChild( _cell_to_svg(cells[key], cell_width, cell_height) );
    }

    board_svg.appendChild(group_of_cells);


    //--- 4箇所のドット ----------------------------------
    /* 石の初期配置とともに，init_dataみたいなものを作って，それをうけ取って描画させよう．
      一旦切る
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
    */
  }

  nSatohOthello.draw_board = draw_board;

})(window.nSatohOthello);
