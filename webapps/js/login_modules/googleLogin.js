function GoogleLogin(config) {
	var _this = this;

	this.loginType = "google";
	this.config = config;

	// this.scope = "email profile https://www.googleapis.com/auth/calendar";
	this.scope = "email profile";

	this.resolve;
	this.reject;

	this.authResponse = null;

	this.sdkLoadedPromise = new Promise(function(resolve, reject){
		_this.resolve = resolve;
		_this.reject = resolve;
	});

	/*
		def function
	*/
	this.sdkLoad = function() {
		var e = document.createElement('script');
		e.src = window.location.protocol + '//apis.google.com/js/api.js';
		e.async = true;
		e.onload = this.sdkLoaded.bind(this);
		e.onreadystatechange = function() {
			if(this.readyState === 'complete') {
				this.onload();
			}
		}

		document.body.appendChild(e);
	}


	this.sdkLoaded = function() {
		var loginType = localStorage.getItem("loginType");
		if (loginType == "google") {
			gapi.load('client:auth2', this.sdkInit.bind(this));
		} else {
			_this.resolve();
		}
	}


	this.sdkInit = function() {
		gapi.auth2.init({
			'client_id': _this.config.clientId,
			'scope': _this.scope
		}).then(function() {
			GoogleAuth = gapi.auth2.getAuthInstance();
			console.log(GoogleAuth);
			// _this.resolve();
		}, function(error){
			console.error(error);

			if(error.error == "idpiframe_initialization_failed"){
				// window.localStorage.setItem("isPrivateMode", true);
				window.isPrivateMode = true;
			}
		}).then(function(){
			_this.resolve();
			console.log("client inited");
		}).catch(function(reason){
			console.error("catch:" + reason);
		});
	}

	this.register = function(requestName, isPrivateMode, accessToken) {

		if(window.localStorage.getItem("isPrivateMode") && isPrivateMode){
			return new Promise(function (resolve, reject) {
				var params = _this.getLocatorParamForPrivate(accessToken);
				_this.authResponse = {access_token : isPrivateMode};
				return window.requestMessage(requestName, params);
			});
		}else if(window.localStorage.getItem("isPrivateMode")){
			window.parent.postMessage({id: "goToGoogleAccount", value: _this.config.clientId}, "*");
			return;
		}

		return new Promise(function(resolve, reject){
			var GoogleAuth = gapi.auth2.getAuthInstance();
			GoogleAuth.signIn({
				prompt: "select_account"
			}).then(function(response){
				_this.authResponse = response.getAuthResponse();
				var params = _this.getLocatorParam(response);
				return window.requestMessage(requestName, params);
			}).catch(function(response){
				reject(response.error);
			});
		});
	}

	this.login = function(isPrivateMode, accessToken) {
		if(window.localStorage.getItem("isPrivateMode") && isPrivateMode){
			return new Promise(function (resolve, reject) {
				var params = _this.getLocatorParamForPrivate(accessToken);
				_this.authResponse = {access_token : isPrivateMode};
				resolve(params);
			});
		}else if(window.localStorage.getItem("isPrivateMode")){
			window.parent.postMessage({id: "goToGoogleAccount", value: _this.config.clientId}, "*");
			return;
		}

		return new Promise(function(resolve, reject) {
			window.startLoading("google");
			_this.showGoogleLoginPopup(resolve, reject);
		});
	}

	this.showGoogleLoginPopup = function(resolve, reject) {
		window.showInfoMessage('googlePopup');
		var GoogleAuth = gapi.auth2.getAuthInstance();
		GoogleAuth.signIn({
			prompt: "select_account"
		}).then(function(response){
			_this.authResponse = response.getAuthResponse();
			resolve(_this.getLocatorParam(response));
		}).catch(function(response){
			reject(response.error);
		})
	}

	this.autoLogin = function(isPrivateMode, accessToken) {
		if(window.localStorage.getItem("isPrivateMode") && isPrivateMode){
			return new Promise(function (resolve, reject) {
				var params = _this.getLocatorParamForPrivate(accessToken);
				_this.authResponse = {access_token : isPrivateMode};
				resolve(params);
			});
		}else if(window.localStorage.getItem("isPrivateMode")){
			window.parent.postMessage({id: "goToGoogleAccount", value: _this.config.clientId}, "*");
			return;
		}

		return new Promise(function (resolve, reject) {
			window.startLoading("google");

			var currentUserInfo = gapi.auth2.getAuthInstance().currentUser.get();
			if(currentUserInfo.getBasicProfile() != null) {
				_this.authResponse = currentUserInfo.getAuthResponse();
				resolve(_this.getLocatorParam(currentUserInfo));
				return;
			}

			_this.showGoogleLoginPopup(resolve, reject);
		});
	}

	this.logout = function(cb) {

	}

	this.getSdkLoadedPromise = function() {
		return this.sdkLoadedPromise;
	}

	this.getLocatorParam = function(response) {
		return {
			client_type: "web",
			processor: "pp",
			provider: "Google",
			access_token: response.getAuthResponse().access_token,
			email: response.getBasicProfile().getEmail(),
			first_name: response.getBasicProfile().getGivenName(),
			last_name: response.getBasicProfile().getFamilyName()
		}
	}

	this.getLocatorParamForPrivate = function(accessToken) {
		return {
			client_type: "web",
			processor: "pp",
			provider: "Google",
			access_token: accessToken
		}
	}

	this.getAuthResponse = function() {
		return this.authResponse;
	}
}
