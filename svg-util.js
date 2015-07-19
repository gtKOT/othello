(function(nSatohOthello, doc) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';


  function _createSVGElement(elementName, attributes) {
    var element = doc.createElementNS(NS, elementName);
    Object.keys(attributes).forEach(function(name) {
      element.setAttribute(name, attributes[name]);
    });
    return element;
  }


  function createRect(attributes) {
    return _createSVGElement('rect', attributes);
  }


  function createLine(attributes) {
    return _createSVGElement('line', attributes);
  }


  function createCircle(attributes) {
    return _createSVGElement('circle', attributes);
  }


  function createPath(attributes) {
    return _createSVGElement('path', attributes);
  }


  nSatohOthello.svgUtil = {
    createRect: createRect,
    createLine: createLine,
    createCircle: createCircle,
    createPath: createPath
  };

})(window.nSatohOthello, document);
