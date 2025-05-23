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

	window.fbAsyncInit = function() {
		_this.sdkLoaded();
	};

	/*
		def function
	*/
	this.sdkLoad = function() {
		var e = document.createElement('script');
		e.src = window.location.protocol + '//connect.facebook.net/en_US/sdk.js';
		e.async = true;
		document.getElementById('fb-root').appendChild(e);
	}

	this.sdkLoaded = function() {
		// this.resolve();
		this.sdkInit();
	}

	this.sdkInit = function() {
		FB.init(this.config);
		this.resolve();
	}

	this.register = function(requestName) {
		return new Promise(function(resolve, reject){
			window.startLoading("facebook");

			if(_this.isTryLogin){
				_this.showFbLoginPopup(resolve, reject, null, function(response){
					//cache fb_login_response for safety
					window._fb_login_response = response;
					_this.isTryLogin = false;
					var params = _this.getLocatorParam(response);
					return window.requestMessage(requestName, params);
				});
			}else{
				FB.getLoginStatus(function(response) {
					if (response.status === 'connected') {

						_this.isTryLogin = false;

						var params = _this.getLocatorParam(response);
						return window.requestMessage(requestName, params);
					} else {
						_this.showFbLoginPopup(resolve, reject, null, function(response){
							//cache fb_login_response for safety
							window._fb_login_response = response;
							_this.isTryLogin = false;
							var params = _this.getLocatorParam(response);
							return window.requestMessage(requestName, params);
						});
					}

				});
			}
		});
	}

	this.login = function() {
		return _this.autoLogin();
		/*
		return new Promise(function (resolve, reject) {
			window.startLoading("facebook");

			if(_this.isTryLogin){
				_this.showFbLoginPopup(resolve, reject, null, function(response){
					_this.isTryLogin = false;
					var params = _this.getLocatorParam(response);
					_this.authResponse = response;
					resolve(params);
				});
			}else{
				FB.getLoginStatus(function(response) {
					if (response.status === 'connected') {
						_this.isTryLogin = false;
						_this.authResponse = response;
						resolve(_this.getLocatorParam(response));
					} else {
						_this.showFbLoginPopup(resolve, reject, null, function(response){
							_this.isTryLogin = false;
							var params = _this.getLocatorParam(response);
							_this.authResponse = response;
							resolve(params);
						});
					}
				});
			}
		});
		*/
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

	this.showFbLoginPopup = function(resolve, reject, authType, callback) {
		window.showInfoMessage('fbPopup');

		if(this.isTryLogin == false){
			var loading = setTimeout(function () {
				_this.showEntryFailure();
			}, 5000);
		}

		var options = (authType != null) ? { scope: _this.scope, auth_type: authType } : { scope: _this.scope };
		if (this.reAuthRequired) {
			options.auth_type = "reauthorize";
		}
		FB.login(function(response) {
			if (response.status === 'connected') {

				callback(response);
				clearTimeout(loading);

			} else {
				// reject('The user is logged into Facebook, but has not authorized the DoubleDown Casino Application.  This must be done before we can continue.');
				// showEntryFailure( 'fbPopup' );
				reject('error message');
			}
		}, options);
	}

	this.autoLogin = function() {
		return new Promise(function (resolve, reject) {
			window.startLoading("facebook");


			if(_this.isTryLogin){
				_this.showFbLoginPopup(resolve, reject, null, function(response){
					_this.isTryLogin = false;
					var params = _this.getLocatorParam(response);
					_this.authResponse = response;
					resolve(params);
				});
			}else{
				var isTimedOut = false;
				var statusTimeOut = setTimeout( function() {
					//_this.showFbLoginPopup(resolve, reject, null, function(response){
					//	var params = _this.getLocatorParam(response);
					//	_this.authResponse = response;
					//	resolve(params);
					//});
					_this.showEntryFailure();
					isTimedOut = true;
					reject("Getting FB LoginStatus is timed out.");
				}, 5000);

				FB.getLoginStatus( function( response ) {
					clearTimeout(statusTimeOut);
					if (isTimedOut) {
						return;
					}

					//If status is unknown and the value of the previous FB.Login status is connected, it is used.
					if( response.status == 'unknown' 
						&& window._fb_login_response != null && window._fb_login_response.status == 'connected' ) {
						response = window._fb_login_response;
					}

					if( response.status === 'connected' ) {
						var expire_date = new Date(response.authResponse.data_access_expiration_time * 1000 );
						var now_date = new Date();

						if ( expire_date.getTime() > now_date.getTime() ) {
							_this.authResponse = response;
							resolve(_this.getLocatorParam(response));
							return;
						} else {
							// Expired ReAuth required
							_this.showEntryFailure(true);
							reject("Connected but the access is expired. FB ReAuth required.");
							return;
							/*
							_this.showFbLoginPopup(resolve, reject, 'reauthorize', function(response){
								var params = _this.getLocatorParam(response);
								_this.authResponse = response;
								resolve(params);
							});
							*/
						}
					} else {
						// Not connected. Auth required
						_this.showEntryFailure();
						reject("Not connected. FB Auth required.");
						return;
						/*
						_this.showFbLoginPopup(resolve, reject, 'reauthorize', function(response){
							var params = _this.getLocatorParam(response);
							_this.authResponse = response;
							resolve(params);
						});
						 */
					}
				}, true );
			}

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
			provider: "Facebook Off Canvas",
			sid: response.authResponse.signedRequest,
			access_token: response.authResponse.accessToken,
			fbId: response.authResponse.userID
		};
	}

	this.getAuthResponse = function() {
		return this.authResponse;
	}
}
