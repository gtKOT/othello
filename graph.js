(function(nSatohOthello) {
  'use strict';

  var k;
  var uniqueId = 0;
  
  function Graph(numberOfVertices) {
    this._vertices = [];
    for (k = 0; k < numberOfVertices; k++){
      // vertex は，idが小さい順に格納される．
      this._vertices.push(new Vertex()); 
    }
  }

  Graph.prototype.getVertices = function() {
    return this._vertices;
  };
  
  function Vertex() {
    this._id = uniqueId;
    uniqueId ++;
    this._edges = [];
  }

  Vertex.prototype.getId = function(){
    return this._id;
  };
  
  Vertex.prototype.addEdge = function(terminalVertex, direction){
    var newEdge = new Edge(terminalVertex, direction);
    this._edges.push(newEdge, direction);
  };

  Vertex.prototype.getEdges = function() {
    return this._edges;
  };

  // レンダラ用 多分あった方が便利
  // 最小の終端点idを持つedgeを返す．
  Vertex.prototype.GetMinEdge = function() {
    var edges = this.getEdges();
    var min_edge = edges[0];
    var min_id = min_edge.getTerminal().getId();
    
    for (k = 1; k < edges.length; k++){
      var edge = edges[k];
      var edge_id = edge.getTerminal().getId();
      if (edge_id < min_id) {
        min_edge = edge;
        min_id = edge_id;
      }
    }
    
    return min_edge;
  };

  // 使わないかもしれん
  Vertex.prototype.GetMinTerminalId = function() {
    var edges = this.getEdges();
    return Math.min.apply(
      null,
      edges.map(function (x) {return x.getTerminal().getId();})
    );
  };

  
  function Edge(terminalVertex, direction) {
    this._terminalPoint = terminalVertex;
    this._direction     = direction; // weight of this edge for indicate the direction.
  }

  Edge.prototype.getTerminal = function() {
    return this._terminalPoint;
  };

  Edge.prototype.getDirection = function() {
    return this._direction;
  };

 
  nSatohOthello.Graph = Graph;
  
})(window.nSatohOthello);
