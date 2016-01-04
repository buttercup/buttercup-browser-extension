define("State", function() {

	var State = function() {
		this._sessions = [];
	};

	State.loadFromStorage = function() {
		var state = new State();

		return state;
	};

	return State;

});