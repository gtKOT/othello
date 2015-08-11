(function(nSatohOthello) {

  'use strict';

  function genGraphScript(vertices, indices, adjoints, directions){
    var number_of_vertices = vertices.length();

    var graph_script = 'var graph_data = new Graph(' + number_of_vertices + ');\n';
    graph_script += 'var v = graph_data.getVertices();\n';
     
    for (var v_k = 0; v_k < number_of_vertices; v_k++){
      var number_of_edges = adjoints[i][j].length();
      for (var e_k = 0; e_k < number_of_edges; e_k++){
        graph_script += '';
      }
    }

    return graph_script;

  }

  function generateCommentDiagram(vertices, indices, adjoints, directions){
    return null;
  }

  nSatohOthello.genGraphScript = genGraphScript;
  
})(window.nSatohOthello);

