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

  
  function createSVG(attributes) {
    return _createSVGElement('svg', attributes);
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


  function createText(attributes) {
    return _createSVGElement('text', attributes);
  }

  
  function createG(attributes) {
    return _createSVGElement('g', attributes);
  }


  nSatohOthello.svgUtil = {
    createSVG: createSVG,
    createRect: createRect,
    createLine: createLine,
    createCircle: createCircle,
    createPath: createPath,
    createText: createText,
    createG: createG
  };

})(window.nSatohOthello, document);
