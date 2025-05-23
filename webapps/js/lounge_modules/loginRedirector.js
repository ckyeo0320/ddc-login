function LoginRedirector() {

	var _this = this;

	this.redirectToSocialLogin = function (clientId, authType) {
		window.location.href = _this.getAuthUri(clientId, authType);
	}
	
	this.getAuthUri = function (clientId, authType) {
		var base = window.location.href,
			state = "";
		var i = base.indexOf("#");
		if (i > -1) {
			state = base.substring(i);
			base = base.substring(0, i);
		}
	
		var index = base.indexOf("?");
		if (index > -1) {
			base = base.substring(0, index);
		}
	
		var indexOfLounge = base.indexOf("lounge.html");
		if (indexOfLounge > -1) {
			base = base.substring(0, indexOfLounge);
		}

		return _this.makeAuthUri(authType, clientId, base, state);
	}

	this.makeAuthUri = function (authType, clientId, base, state) {
		if (authType == "google") {
			return (
				"https://accounts.google.com/o/oauth2/v2/auth" +
				"?scope=" +
				encodeURIComponent("email profile") +
				"&access_type=" +
				encodeURIComponent("offline") +
				"&prompt=" +
				encodeURIComponent("consent") +
				"&include_granted_scopes=" +
				encodeURIComponent("true") +
				"&response_type=" +
				encodeURIComponent("code") +
				"&state=" +
				encodeURIComponent(btoa(state)) +
				"&redirect_uri=" +
				encodeURIComponent(base + "g_oauth_lounge.html") +
				"&client_id=" +
				encodeURIComponent(clientId)
			);
		} else if (authType == "facebook") {
			return (
				"https://www.facebook.com/v19.0/dialog/oauth?client_id=" +
				encodeURIComponent(clientId) +
				"&redirect_uri=" +
				encodeURIComponent(base + "f_oauth_lounge.html") +
				"&state=" +
				encodeURIComponent("")
			);
		}
	}
}
