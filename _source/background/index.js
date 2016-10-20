require([
	"State",
	"MessageRouter"
], function(State, MessageRouter) {

	"use strict";

	console.log("Buttercup - Background initialisation");

	var __state = State.loadFromStorage(),
		__msgRouter = new MessageRouter(__state);

	chrome.runtime.onMessage.addListener(__msgRouter.handle.bind(__msgRouter));

});
