function LoginHandler(loginInfoArr) {
	/*
		constructor
	*/
	var _this = this;

	this.logins = {};
	this.promiseArr = [];
	this.locatorResponse = null;

	this.setLoginTypeOnStorage = function (loginType) {
		localStorage.setItem("loginTypeLounge", loginType);
	}

	this.getLoginTypeFromStorage = function () {
		return localStorage.getItem("loginTypeLounge");
	}

	this.removeLoginTypeFromStorage = function () {
		localStorage.removeItem("loginTypeLounge");
	}

	this.lastLoginType = this.getLoginTypeFromStorage();

	if(this.lastLoginType != "email" && this.lastLoginType != "facebook" && this.lastLoginType != "google" && this.lastLoginType != "googleV2" && this.lastLoginType != "apple" && this.lastLoginType != "NONE"){
		this.removeLoginTypeFromStorage();
		this.lastLoginType = null;
	}

	if (loginInfoArr != null && loginInfoArr.length > 0) {
		for (var i = 0; i < loginInfoArr.length; i++) {
			var login = new loginInfoArr[i].cls(loginInfoArr[i].config);
			this.logins[login.loginType] = login;
			this.promiseArr.push(login.getSdkLoadedPromise());
		}
	}

	this.sendApplaunch = function() {
		//check Applaunch
		try {
			//find a_l_skey in url 
			var urlParams = new URL(location.href).searchParams;
			if (urlParams.has('a_l_skey')) {
				window.a_l_skey = urlParams.get('a_l_skey');
			}

			//find a_l_skey in deeplink of localstorage
			var deeplink = localStorage.getItem('deeplinkQuery');
			if(!!deeplink) {
				var pairs = deeplink.split('&');
				for (let i = 0; i < pairs.length; i++) {
					var keyValue = pairs[i].split('=');
					if (keyValue[0] === 'a_l_skey') {
						window.a_l_skey = keyValue[1];
					}
				}
			}
		}catch(e) {
		}

		var promise = null;
		//The url contains the applaunch key or has already called applaunch		
		if (!!window.a_l_skey) {
			promise = new Promise(function(resolve, resject) {
				//window.a_l_skey = applaunchKey;
				resolve();
			});
		} else {
			var url = _CONFIG_.applaunch.url;
			promise = sendMessage(url, {'proc':'pp', 'udid':getUdid()}, 'get');
			promise.then(function(response){
				console.log(response);
				window.a_l_skey = response.a_l_skey;
			});
		}
		return promise;
	};

	/*
		def function
	*/
	this.doLogin = function (loginType) {
		var obj = this.logins[loginType];
		var func = obj.login.bind(obj);
		return this.sendApplaunch().then(func);
	};

	this.doAutoLogin = function (loginType) {
		var isLoungeLoginWithGoogle = window.localStorage.getItem("loungeLoginWithGoogleV2");

		if (isLoungeLoginWithGoogle == "true" && (this.lastLoginType != "facebook" && this.lastLoginType != "apple")) {
			loginType = "googleV2";
		}

		var isLoungeLoginWithFacebook = window.localStorage.getItem("loungeLoginWithFacebook");
		if (isLoungeLoginWithFacebook == "true" && (this.lastLoginType != "googleV2" && this.lastLoginType != "apple")) {
			loginType = "facebook";
		}

		var obj = this.logins[loginType];
		var func = obj.autoLogin.bind(obj);
		return this.sendApplaunch().then(func);
	};

	this.doLogout = function (loginType) {};

	this.doRegister = function (name, requestName) {
		if (requestName == null) {
			requestName = "regist";
		}

		var obj = this.logins[name];
		var func  = obj.register.bind(obj, requestName);
		return this.sendApplaunch().then(func);
	};

	this.sdkLoad = function () {
		var keys = Object.keys(_this.logins);
		var i,
			max = keys.length;
		for (i = 0; i < max; ++i) {
			_this.logins[keys[i]].sdkLoad();
		}

		return new Promise(function (resolve, reject) {
			var timeoutId = setTimeout(function () {
				reject();
			}, 6000);

			Promise.all(_this.promiseArr).then(function () {
				resolve();

				clearTimeout(timeoutId);
			});
		});
	};

	this.hasLastLoginType = function () {
		return false;
	};

	this.getLastLoginType = function () {
		if (this.lastLoginType != null && this.lastLoginType != "NONE") {
			return this.lastLoginType;
		}

		throw new Error("last login type is null!!");
	};

	this.setLocatorResponse = function (response) {
		// Only for GoogleLogin, change provider value to request "v2/authenticate/user" API
		var loginType = this.getLoginTypeFromStorage();
		if (loginType === "google") {
			response.provider = "Google";
		}
		this.locatorResponse = response;
	};

	this.getLocatorResponse = function () {
		return this.locatorResponse;
	};

	this.setLastLoginType = function (loginType) {
		this.setLoginTypeOnStorage(loginType);
		this.lastLoginType = loginType;
	};

	this.getAuthResponse = function () {
		var loginType = this.getLoginTypeFromStorage();
		return this.logins[loginType].getAuthResponse();
	};

	this.getLoginModule = function (loginType) {
		return this.logins[loginType];
	}

	this.sendMessageWithXHR = function (url, data) {
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
					sendError("error", {"msg": "sendMessageWithXHR parse error : " + response.toString()});
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
		});
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
}
