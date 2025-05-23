function FacebookLogin(config) {
	var _this = this;

	this.loginType = "facebook";
	this.config = config;
	this.scope = 'public_profile,email,user_friends';
	this.authResponse = null;
	this.isTryLogin = false;
	this.reAuthRequired = true;

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
		_this.resolve();
	}

	this.prepare = function () {
		var authCode = window.localStorage.getItem("facebookAuthCodeLounge");
		var hasAuthCodeForLounge = authCode && authCode !== "null" && authCode !== "undefined";

		if (!!hasAuthCodeForLounge) {
			return this.authorizeCode(authCode);
		}

		window.localStorage.setItem("loungeLoginWithFacebook", true);
		window.loginRedirector.redirectToSocialLogin(this.config.appId, "facebook");
		return new Promise((resolve,reject)=> resolve());
	}

	this.authorizeCode = function(authCode) {
		var locatorUrl = this.config.locatorUrl;
		var url = locatorUrl + "/oauth/authorize";

		var data = {
			client_type: "web",
			processor: "pp",
			provider: "Facebook",
			code: authCode,
			a_l_skey: window.a_l_skey,
			udid: getUdid(),
			use_lounge: true,
		};

		//check beta
		var base = window.location.href;
		if(base.indexOf("beta")>-1){
			data.mode = "beta";
		}

		var promise = window.loginHandler.sendMessageWithXHR(url, data);
		promise.then(function(response){
			window.loginHandler.removeLoginTypeFromStorage();
			window.localStorage.removeItem("loungeLoginWithFacebook");
			window.localStorage.removeItem("facebookAuthCodeLounge");
			if (response.status === "success") {
				var loungeUrl = getLoungeUrl();
				window.location.href = loungeUrl + "?accessToken=" + response.data.ddc_access_token;
			} else {
				goToLoungeErrorPage(response);
			}
		}, function(response){
			window.loginHandler.removeLoginTypeFromStorage();
			window.localStorage.removeItem("loungeLoginWithFacebook");
			window.localStorage.removeItem("facebookAuthCodeLounge");
			initPageForNonAutoLogin(true);

			//send error
			console.log("Error : "+response.toString());
			sendError("error", {"authCode": authCode, "msg": "authorizeCode response: " + response.toString()});
		});
		return new Promise((resolve,reject)=> resolve());
	}

	this.register = function(requestName) {
		return _this.prepare();
	}

	this.login = function() {
		return _this.prepare();
	}

	this.autoLogin = function() {
		return _this.login();
	}

	this.showEntryFailure = function(reAuthRequired = false){
		_this.isTryLogin = true;
		_this.reAuthRequired = reAuthRequired;
		var text = '<h1>Please accept the presented Facebook permissions to play. Click <a href="#" onclick="checkValidationForRegist(\'facebook\'); return false;" id="entryFailureButton">here</a> to retry.<br/>(Allow Pop-up Windows)</h1>';
		$('#entryFailure').find('.ddc_header_txt').html(text);

		$('#entryFailure').show();

		$('#loginbox').hide();
		$('#dimmed_overlay').hide();
		$('body').show();
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
			provider: "Facebook Off Canvas",
			code: response.code,
			a_l_skey: window.a_l_skey,
			use_lounge: true,
		};
	}

	this.getAuthResponse = function() {
		return this.authResponse;
	}
}
