let __token = null;

module.exports = {

    getToken: function() {
        return __token;
    },

    setToken: function(token) {
        __token = token;
    }

};
