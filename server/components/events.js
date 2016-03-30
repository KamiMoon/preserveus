'use strict';

var util = require("util");
var EventEmitter = require("events").EventEmitter;

function AppEvents() {
    EventEmitter.call(this);
}

util.inherits(AppEvents, EventEmitter);



var AppEventsInstance = new AppEvents();

module.exports = AppEventsInstance;
