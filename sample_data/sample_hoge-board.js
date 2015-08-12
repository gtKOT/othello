(function(nSatohOthello) {
  'use strict';

  /*-- directions --
        0  1  2
        3  x  4
        5  6  7
  -----------------*/

  /*
  +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+   
  |///|///|///|///|///|///|///|///|///|///|///|///|///|///|///|///|///|   
  +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+   
  |///|   |///|   |///|           |///|           |///|           |///|   
  +---+   +---+   +---+   +---+   +---+   +---+---+---+   +---+---+---+   
  |///|   |///|   |///|   |///|   |///|   |///|///|///|   |///|///|///|   
  +---+   +---+   +---+   +---+   +---+   +---+---+---+   +---+---+---+   
  |///|           |///|   |///|   |///|   |///|   |///|           |///|   
  +---+   +---+   +---+   +---+   +---+   +---+   +---+   +---+---+---+   
  |///|   |///|   |///|   |///|   |///|   |///|   |///|   |///|///|///|   
  +---+   +---+   +---+   +---+   +---+   +---+   +---+   +---+---+---+   
  |///|   |///|   |///|           |///|           |///|           |///|   
  +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+   
  |///|///|///|///|///|///|///|///|///|///|///|///|///|///|///|///|///|   
  +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+   
                                                                          
                              +---+---+---+                               
                              |///|///|///|                               
                              +---+---+---+                               
                              |///|   |///|                               
                              +---+---+---+                               
                              |///|///|///|                               
                              +---+---+---+                               
                                                                          
  */
  var Graph = window.nSatohOthello.Graph;
  var graph_directions = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
  var graph_data = new Graph(82);
  var v = graph_data.getVertices();

  v[0].addEdge(v[17], 4);
  v[0].addEdge(v[1], 6);
  v[1].addEdge(v[0], 1);
  v[1].addEdge(v[17], 2);
  v[1].addEdge(v[2], 6);
  v[1].addEdge(v[18], 7);
  v[2].addEdge(v[1], 1);
  v[2].addEdge(v[18], 4);
  v[2].addEdge(v[3], 6);
  v[3].addEdge(v[2], 1);
  v[3].addEdge(v[18], 2);
  v[3].addEdge(v[4], 6);
  v[3].addEdge(v[19], 7);
  v[4].addEdge(v[3], 1);
  v[4].addEdge(v[19], 4);
  v[4].addEdge(v[5], 6);
  v[5].addEdge(v[4], 1);
  v[5].addEdge(v[19], 2);
  v[5].addEdge(v[6], 6);
  v[6].addEdge(v[5], 1);
  v[6].addEdge(v[7], 6);
  v[7].addEdge(v[6], 1);
  v[7].addEdge(v[8], 6);
  v[7].addEdge(v[20], 7);
  v[8].addEdge(v[7], 1);
  v[8].addEdge(v[20], 4);
  v[8].addEdge(v[9], 6);
  v[9].addEdge(v[8], 1);
  v[9].addEdge(v[20], 2);
  v[9].addEdge(v[10], 6);
  v[10].addEdge(v[9], 1);
  v[10].addEdge(v[11], 6);
  v[11].addEdge(v[10], 1);
  v[11].addEdge(v[12], 6);
  v[11].addEdge(v[21], 7);
  v[12].addEdge(v[11], 1);
  v[12].addEdge(v[21], 4);
  v[12].addEdge(v[13], 6);
  v[13].addEdge(v[12], 1);
  v[13].addEdge(v[21], 2);
  v[13].addEdge(v[14], 6);
  v[14].addEdge(v[13], 1);
  v[14].addEdge(v[15], 6);
  v[15].addEdge(v[14], 1);
  v[15].addEdge(v[16], 6);
  v[15].addEdge(v[22], 7);
  v[16].addEdge(v[15], 1);
  v[16].addEdge(v[22], 4);
  v[17].addEdge(v[0], 3);
  v[17].addEdge(v[23], 4);
  v[17].addEdge(v[1], 5);
  v[18].addEdge(v[1], 0);
  v[18].addEdge(v[2], 3);
  v[18].addEdge(v[24], 4);
  v[18].addEdge(v[3], 5);
  v[19].addEdge(v[3], 0);
  v[19].addEdge(v[4], 3);
  v[19].addEdge(v[25], 4);
  v[19].addEdge(v[5], 5);
  v[20].addEdge(v[7], 0);
  v[20].addEdge(v[8], 3);
  v[20].addEdge(v[27], 4);
  v[20].addEdge(v[9], 5);
  v[21].addEdge(v[11], 0);
  v[21].addEdge(v[29], 2);
  v[21].addEdge(v[12], 3);
  v[21].addEdge(v[30], 4);
  v[21].addEdge(v[13], 5);
  v[22].addEdge(v[15], 0);
  v[22].addEdge(v[32], 2);
  v[22].addEdge(v[16], 3);
  v[22].addEdge(v[33], 4);
  v[23].addEdge(v[17], 3);
  v[23].addEdge(v[34], 4);
  v[24].addEdge(v[18], 3);
  v[25].addEdge(v[19], 3);
  v[25].addEdge(v[35], 4);
  v[26].addEdge(v[36], 4);
  v[27].addEdge(v[20], 3);
  v[27].addEdge(v[37], 4);
  v[28].addEdge(v[38], 4);
  v[28].addEdge(v[29], 6);
  v[29].addEdge(v[28], 1);
  v[29].addEdge(v[38], 2);
  v[29].addEdge(v[21], 5);
  v[29].addEdge(v[30], 6);
  v[29].addEdge(v[39], 7);
  v[30].addEdge(v[29], 1);
  v[30].addEdge(v[21], 3);
  v[30].addEdge(v[39], 4);
  v[31].addEdge(v[32], 6);
  v[32].addEdge(v[31], 1);
  v[32].addEdge(v[22], 5);
  v[32].addEdge(v[33], 6);
  v[32].addEdge(v[40], 7);
  v[33].addEdge(v[32], 1);
  v[33].addEdge(v[22], 3);
  v[33].addEdge(v[40], 4);
  v[34].addEdge(v[23], 3);
  v[34].addEdge(v[41], 4);
  v[35].addEdge(v[25], 3);
  v[35].addEdge(v[43], 4);
  v[36].addEdge(v[26], 3);
  v[36].addEdge(v[44], 4);
  v[37].addEdge(v[27], 3);
  v[37].addEdge(v[45], 4);
  v[38].addEdge(v[28], 3);
  v[38].addEdge(v[46], 4);
  v[38].addEdge(v[29], 5);
  v[39].addEdge(v[29], 0);
  v[39].addEdge(v[30], 3);
  v[39].addEdge(v[47], 4);
  v[40].addEdge(v[32], 0);
  v[40].addEdge(v[49], 2);
  v[40].addEdge(v[33], 3);
  v[40].addEdge(v[50], 4);
  v[41].addEdge(v[34], 3);
  v[41].addEdge(v[51], 4);
  v[42].addEdge(v[52], 4);
  v[43].addEdge(v[35], 3);
  v[43].addEdge(v[53], 4);
  v[44].addEdge(v[36], 3);
  v[45].addEdge(v[37], 3);
  v[45].addEdge(v[54], 4);
  v[46].addEdge(v[38], 3);
  v[47].addEdge(v[39], 3);
  v[47].addEdge(v[55], 4);
  v[48].addEdge(v[49], 6);
  v[49].addEdge(v[48], 1);
  v[49].addEdge(v[40], 5);
  v[49].addEdge(v[50], 6);
  v[49].addEdge(v[56], 7);
  v[50].addEdge(v[49], 1);
  v[50].addEdge(v[40], 3);
  v[50].addEdge(v[56], 4);
  v[51].addEdge(v[41], 3);
  v[51].addEdge(v[57], 4);
  v[51].addEdge(v[58], 7);
  v[52].addEdge(v[58], 2);
  v[52].addEdge(v[42], 3);
  v[52].addEdge(v[59], 4);
  v[52].addEdge(v[60], 7);
  v[53].addEdge(v[60], 2);
  v[53].addEdge(v[43], 3);
  v[53].addEdge(v[61], 4);
  v[53].addEdge(v[62], 7);
  v[54].addEdge(v[64], 2);
  v[54].addEdge(v[45], 3);
  v[54].addEdge(v[65], 4);
  v[54].addEdge(v[66], 7);
  v[55].addEdge(v[68], 2);
  v[55].addEdge(v[47], 3);
  v[55].addEdge(v[69], 4);
  v[55].addEdge(v[70], 7);
  v[56].addEdge(v[49], 0);
  v[56].addEdge(v[72], 2);
  v[56].addEdge(v[50], 3);
  v[56].addEdge(v[73], 4);
  v[57].addEdge(v[51], 3);
  v[57].addEdge(v[58], 6);
  v[58].addEdge(v[51], 0);
  v[58].addEdge(v[57], 1);
  v[58].addEdge(v[52], 5);
  v[58].addEdge(v[59], 6);
  v[59].addEdge(v[58], 1);
  v[59].addEdge(v[52], 3);
  v[59].addEdge(v[60], 6);
  v[60].addEdge(v[52], 0);
  v[60].addEdge(v[59], 1);
  v[60].addEdge(v[53], 5);
  v[60].addEdge(v[61], 6);
  v[61].addEdge(v[60], 1);
  v[61].addEdge(v[53], 3);
  v[61].addEdge(v[62], 6);
  v[62].addEdge(v[53], 0);
  v[62].addEdge(v[61], 1);
  v[62].addEdge(v[63], 6);
  v[63].addEdge(v[62], 1);
  v[63].addEdge(v[64], 6);
  v[64].addEdge(v[63], 1);
  v[64].addEdge(v[54], 5);
  v[64].addEdge(v[65], 6);
  v[65].addEdge(v[64], 1);
  v[65].addEdge(v[54], 3);
  v[65].addEdge(v[66], 6);
  v[66].addEdge(v[54], 0);
  v[66].addEdge(v[65], 1);
  v[66].addEdge(v[67], 6);
  v[67].addEdge(v[66], 1);
  v[67].addEdge(v[68], 6);
  v[68].addEdge(v[67], 1);
  v[68].addEdge(v[55], 5);
  v[68].addEdge(v[69], 6);
  v[69].addEdge(v[68], 1);
  v[69].addEdge(v[55], 3);
  v[69].addEdge(v[70], 6);
  v[70].addEdge(v[55], 0);
  v[70].addEdge(v[69], 1);
  v[70].addEdge(v[71], 6);
  v[71].addEdge(v[70], 1);
  v[71].addEdge(v[72], 6);
  v[72].addEdge(v[71], 1);
  v[72].addEdge(v[56], 5);
  v[72].addEdge(v[73], 6);
  v[73].addEdge(v[72], 1);
  v[73].addEdge(v[56], 3);
  v[74].addEdge(v[77], 4);
  v[74].addEdge(v[75], 6);
  v[75].addEdge(v[74], 1);
  v[75].addEdge(v[77], 2);
  v[75].addEdge(v[76], 6);
  v[75].addEdge(v[78], 7);
  v[76].addEdge(v[75], 1);
  v[76].addEdge(v[78], 4);
  v[77].addEdge(v[74], 3);
  v[77].addEdge(v[79], 4);
  v[77].addEdge(v[75], 5);
  v[77].addEdge(v[80], 7);
  v[78].addEdge(v[75], 0);
  v[78].addEdge(v[80], 2);
  v[78].addEdge(v[76], 3);
  v[78].addEdge(v[81], 4);
  v[79].addEdge(v[77], 3);
  v[79].addEdge(v[80], 6);
  v[80].addEdge(v[77], 0);
  v[80].addEdge(v[79], 1);
  v[80].addEdge(v[78], 5);
  v[80].addEdge(v[81], 6);
  v[81].addEdge(v[80], 1);
  v[81].addEdge(v[78], 3);

  nSatohOthello.graphData = graph_data;

})(window.nSatohOthello);
