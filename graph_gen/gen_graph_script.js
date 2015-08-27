(function(nSatohOthello) {

  'use strict';
  
  function genGraphScript(vertices, indices, adjoints, directions, comment){
    var number_of_vertices = vertices.length;

    var graph_script = '(function(nSatohOthello) {\n' +
                       '  \'use strict\';\n\n' +
                         comment + '\n' + 
                       '  var Graph = window.nSatohOthello.Graph;\n' +
                       '  var graph_directions = ' + listScript(directions) + ';\n' +
                       '  var graph_data = new Graph(' + number_of_vertices + ');\n' +
                       '  var v = graph_data.getVertices();\n\n';
     
    for (var v_k = 0; v_k < number_of_vertices; v_k++){
      var i = vertices[v_k][0];
      var j = vertices[v_k][1];
      var edges = adjoints[i][j];
      var number_of_edges = edges.length;
      for (var e_k = 0; e_k < number_of_edges; e_k++){
        var ti = edges[e_k].terminal[0];
        var tj = edges[e_k].terminal[1];
        var index = indices[ti][tj];
        var direction = edges[e_k].direction;
        graph_script += '  v[' + v_k + '].addEdge(v[' + index + '], ' + direction + ');\n';
      }
    }
    
    graph_script += '\n' + 
                    '  nSatohOthello.graphData = graph_data;\n\n' + 
                    '  nSatohOthello.graphDirections = graph_directions;\n\n' + 
                    '})(window.nSatohOthello);';
    return graph_script;

  }

  function listScript(list){
    var list_script = '[';
    for (var k = 0; k < list.length; k++){
      if (Object.prototype.toString.call(list[k]) === '[object Array]') {
        list_script += listScript(list[k]);
      } else {
        list_script += list[k];
      }
      list_script += (k < list.length - 1) ? ', ' : ']';
    }

    return list_script;
  }

  nSatohOthello.genGraphScript = genGraphScript;
  
})(window.nSatohOthello);

