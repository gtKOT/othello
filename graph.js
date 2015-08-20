(function(nSatohOthello) {
  'use strict';

  var k;
  var uniqueId = 0;
  
  function Graph(numberOfVertices) {
    this._vertices = [];
    for (k = 0; k < numberOfVertices; k++){
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
