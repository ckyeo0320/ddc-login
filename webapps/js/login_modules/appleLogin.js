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
	this.authResponse = {};
	this.retryCount = 0;

	function sendMessage(url, data) {
		return new Promise(function (resolve, reject) {
			var request = new XMLHttpRequest();

			request.withCredentials = true;
			request.onreadystatechange = function () {
				if (request.readyState !== XMLHttpRequest.DONE) {
					return;
				}

				var response = request.responseText;

				try {
					response = JSON.parse(response);
				} catch (e) {
					sendError("error", {"msg": "sendMessage parse error : " + response.toString()});
				}

				if (request.status >= 200 && request.status < 403) {
					return resolve(response, request);
				}
				return reject(response, request);
			};

			request.open("POST", url);

			var headers = [['Accept', 'application/json'], ['Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8']];

			headers.forEach(function (h) {
				request.setRequestHeader(h[0], h[1]);
			});

			if (data) {
				data = formatQuery(data).replace(/^\?/gi, '');
				request.send(data);
			} else {
				request.send();
			}
		})
	}

	function formatQuery(query) {
		var items = [];

		for (var member in query) {
			var values = Array.isArray(query[member]) ? query[member] : [query[member]];

			values.forEach(function (value) {
				value = typeof value === 'undefined' ? '' : value.toString();
				items.push(encodeURIComponent(member) + '=' + encodeURIComponent(value));
			});
		}

		return items.length ? '?' + items.join('&') : '';
	}

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

	this.prepare = function(){
		var authCode = window.localStorage.getItem("appleAuthCode");
		var ddcToken = window.localStorage.getItem("ddc_access_token");

		if (ddcToken == null && authCode && authCode !== "null" && authCode !== "undefined") {
			return this.authorizeCode(authCode);
		} else if(!!ddcToken){
			return new Promise((resolve, reject) => {resolve();});
		}

		return this.accountSign();
	}

	this.authorizeCode = function (authCode) {
		var locatorUrl = this.config.locatorUrl;
		var url = locatorUrl + "/oauth/authorize";

		var firstname = window.localStorage.getItem("firstname");
		var lastname = window.localStorage.getItem("lastname");
		var email = window.localStorage.getItem("email");

		var data = {
			code: authCode,
			udid: getUdid(),
			apple_is_web: true,
			client_type: "web",
			processor: "pp",
			provider: "Apple",
		};

		if (this.checkUserInfo(firstname)) {
			data.first_name = firstname;
		}
		if (this.checkUserInfo(lastname)) {
			data.last_name = lastname;
		}
		if (this.checkUserInfo(email)) {
			data.email = email;
		}

		var base = window.location.href;

		if (base.indexOf("beta") >= 1) {
			data.mode = "beta";
		}

		var promise = sendMessage(url, data);
		promise.then(function (response) {
			if (response.status === "success") {
				ddc_access_token = response.data.ddc_access_token;
				window.localStorage.setItem("ddc_access_token", ddc_access_token);
				window.localStorage.removeItem("appleAuthCode");
				// first login user info
				window.localStorage.removeItem("firstname");
				window.localStorage.removeItem("lastname");
				window.localStorage.removeItem("email");
			} else {
				window.localStorage.removeItem("appleAuthCode");
				initPageForNonAutoLogin(true);
				console.log("Error : " + response.toString());
				sendError("error", {"authCode": authCode, "msg": "authorizeCode response: " + response.toString()});
			}
		}, function (response) {
			window.localStorage.removeItem("appleAuthCode");
			initPageForNonAutoLogin(true);
			console.log("Error : " + response.toString());
			sendError("error", {"authCode": authCode, "msg": "authorizeCode response: " + response.toString()});
		});
		return promise;
	}

	this.registerToken = function (token) {
		var locatorUrl = this.config.locatorUrl;
		var url = locatorUrl + "/oauth/register";

		var data = {
			token: token,
		};

		var promise = sendMessage(url, data);
		promise.then(function (response) {
			if (response && response.status && response.status === "success") {
				regist(response);
			} else if (response.status !== "success") {
				// todo check
				console.log("Error : " + response.mesage);
				sendError("error", {"token":token, "msg": "registerToken : " + response.toString()});
				$('img.login_button').css('visibility', 'visible');
				showLastLoginTag();
			}
		}, function (response) {
			console.log("Error : " + response.mesage);
			sendError("error", {"token":token, "msg": "registerToken : " + response.toString()});
			$('img.login_button').css('visibility', 'visible');
			showLastLoginTag();
		});

		return promise;
	}

	this.getAuthInfo = function (ddcToken) {
		var locator = this.config.locatorUrl;
		var url = locator + "/oauth/info";

		var data = {
			token: ddcToken,
			a_l_skey: window.a_l_skey,
		};

		var promise = sendMessage(url, data);
		promise.then(function (response) {
			if (response && response.status && response.status === "success") {
				ddc_access_token = response.data.ddc_access_token;
				window.localStorage.setItem("ddc_access_token", ddc_access_token);
				console.log("success");
			} else if (response.status !== "success") {
				sendError("error", {"token":ddcToken, "msg": "getAuthInfo : " + response.toString()});

				window.localStorage.removeItem("ddc_access_token");
				if(response.message == "expired token"){
					return ;
				}
				failToLogin();
			}
		}, function (response) {
			if (response && response.status && response.status !== "success") {
				sendError("error", {"token":ddcToken, "msg": "getAuthInfo : " + response.toString()});
				failToLogin();
			}
		});
		return promise;
	}

	this.register = function () {
		return this.prepare().then((response) => {
			var isUnregistered = response && response.data && response.data.unregistered !== null ? response.data.unregistered : false;

			if (isUnregistered) {
				return this.registerToken(response.data.ddc_access_token);
			} else {
				loginHandler.setLastLoginType("apple");
				doLogin();
			}

			return new Promise((resolve, reject) => resolve());
		});
	};

	this.accountSign = function () {
		return new Promise((resolve, reject)=>{
			var APPLE_CLIENT_ID = this.config.clientId;
			var appleRedirectURI = this.config.redirectUrl;

			AppleID.auth.init({
				clientId : APPLE_CLIENT_ID,
				scope : 'name email',
				redirectURI : appleRedirectURI,
				usePopup : true //or false defaults to false
			});

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
			},{ once: true });

			//Listen for authorization failures
			document.addEventListener('AppleIDSignInOnFailure', (error) => {
				//handle error.
				loginHandler.removeLoginTypeFromStorage();
				loginHandler.lastLoginType = null;
				initPageForNonAutoLogin();
				reject();
			},{ once: true });

			AppleID.auth.signIn().then((response) => {
				window.localStorage.setItem("appleAuthCode", response.authorization.code);

				// first login user info
				if(response.user) {
					window.localStorage.setItem("firstname", response.user.name.firstName);
					window.localStorage.setItem("lastname", response.user.name.lastName);
					window.localStorage.setItem("email", response.user.email);
				}
				window.location.href = this.config.redirectUrl;
			});
		})
	}

	this.login = function () {
		return this.prepare().then(() => {
			var token = window.localStorage.getItem("ddc_access_token");
			return this.getAuthInfo(token);
		});
	};

	this.logout = function(cb) {}

	this.autoLogin = function(){
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

	this.checkUserInfo = function (infoString) {
		return infoString != null && infoString !== "" && infoString !== "undefined";
	}
}
