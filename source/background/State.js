define("State", function() {

	"use strict";

	var State = function() {
		this._sessions = [];
		this._unlockedSessions = [];
	};

	State.prototype.addSession = function(title, details) {
		this._sessions.push({
			title: title,
			source: details
		});
	};

	State.loadFromStorage = function() {
		var state = new State();

		return state;
	};

	return State;

});