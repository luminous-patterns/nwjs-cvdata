'use strict';

var NodeApp = require('./src/node/classes/NodeApp');

process.nodeApp = new NodeApp(require('nw.gui'));
