function AppleLogin(config) {
	var _this = this;

	this.loginType = "apple";
	this.config = config;

	var isProd = window["env"] != "dev" && window["env"] != "qa";

	if (isProd == true
		&& this.config.redirectUrl
		&& this.config.redirectUrl.indexOf("www") > -1
		&& window.location
		&& window.location.href
		&& window.location.href.indexOf("www") < 0) {
		let splitUrl = this.config.redirectUrl.split("www.");
		this.config.redirectUrl = splitUrl[0] + splitUrl[1];
	}

	this.resolve;
	this.reject;

	this.sdkLoadedPromise = new Promise(function(resolve, reject){
		_this.resolve = resolve;
		_this.reject = resolve;
	});

	/*
		def function
	*/
	this.sdkLoad = function() {
		this.resolve();
	}

	this.login = function() {
		return new Promise((resolve, reject)=>{
			var APPLE_CLIENT_ID = this.config.clientId;
			var appleRedirectURI = this.config.redirectUrl;

		AppleID.auth.init({
			clientId : APPLE_CLIENT_ID,
			scope : 'name email',
			redirectURI : appleRedirectURI,
			usePopup : true //or false defaults to false
		});

		loginHandler.setLastLoginType("apple");

		document.addEventListener('AppleIDSignInOnSuccess', (response) => {
			//handle successful response

			var apple_code = response.detail.authorization.code;
			var apple_id = response.detail.authorization.id_token
			var params = _this.getLocatorParam({
				apple_code,
				apple_id,
				apple_is_web: true
			})
			_this.authResponse = response.detail;
			
			resolve(params);
		},{ once: true });
	
		//Listen for authorization failures
		document.addEventListener('AppleIDSignInOnFailure', (error) => {
			//handle error.
			loginHandler.removeLoginTypeFromStorage();
			loginHandler.lastLoginType = null;
			initPageForNonAutoLogin();
			reject();
		},{ once: true });

		AppleID.auth.signIn();
		})
	}

	this.logout = function(cb) {

	}

	this.autoLogin = function(){
		return _this.login();
	}

	this.register = function(requestName) {
		return _this.login();
	}

	this.getSdkLoadedPromise = function() {
		return _this.sdkLoadedPromise;
	}

	this.getLocatorParam = function(params) {
		params.client_type = "web";
		params.processor = "pp";
		params.provider = "Apple";
		return params;
	}

	this.getAuthResponse = function() {
		return this.authResponse;
	}
}
