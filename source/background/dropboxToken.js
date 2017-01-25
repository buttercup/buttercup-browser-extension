let __token = null;

let dropboxToken = {

    getToken: function() {
        return __token;
    },

    setToken: function(token) {
        __token = token;
    }

};

export default dropboxToken;
