(function(nSatohOthello) {
  'use strict';

  var BLACK = 0;
  var WHITE = 1;

  function Stone() {
    this._color = BLACK;
    this._svg   = null;
  }


  Stone.prototype.setBlack = function() {
    this._color = BLACK;
  };

  Stone.prototype.setWhite = function() {
    this._color = WHITE;
  };

  Stone.prototype.flip = function() {
    if (this._color === BLACK) {
      this._color = WHITE;
    } else {
      this._color = BLACK;
    }
  };

  Stone.prototype.getSVG = function() {
    if (!this._svg) {
      this._svg = _createSVG(self);
    }
    return this._svg;
  };

  function _createSVG(self) {
    return null;
  }


  nSatohOthello.Stone = Stone;

})(window.nSatohOthello);
