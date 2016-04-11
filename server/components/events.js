'use strict';

//TODO:  leaks - http://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected
//Do not use this with Socket.io

var util = require("util");
var EventEmitter = require("events").EventEmitter;

function AppEvents() {
    EventEmitter.call(this);
}

util.inherits(AppEvents, EventEmitter);

var AppEventsInstance = new AppEvents();

module.exports = AppEventsInstance;
