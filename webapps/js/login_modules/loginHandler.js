function LoginHandler(loginInfoArr) {
	/*
		constructor
	*/
	var _this = this;

	this.logins = {};
	this.promiseArr = [];
	this.locatorResponse = null;
	this.lastLoginType = localStorage.getItem("loginType");

	if(this.lastLoginType != "email" && this.lastLoginType != "facebook" && this.lastLoginType != "google" && this.lastLoginType != "googleV2" && this.lastLoginType != "apple" && this.lastLoginType != "NONE"){
		localStorage.removeItem("loginType");
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

		if(this.lastLoginType != "email" && this.lastLoginType != "facebook" && this.lastLoginType != "google" && this.lastLoginType != "googleV2" && this.lastLoginType != "apple" && this.lastLoginType != "NONE"){
			localStorage.removeItem("loginType");
			this.lastLoginType = null;

			return false;
		}

		if (this.lastLoginType != null && this.lastLoginType != "NONE") {
			return true;
		}

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
		var loginType = localStorage.getItem("loginType");
		if (loginType === "google") {
			response.provider = "Google";
		}
		this.locatorResponse = response;
	};

	this.getLocatorResponse = function () {
		return this.locatorResponse;
	};

	this.setLastLoginType = function (loginType) {
		localStorage.setItem("loginType", loginType);
		this.lastLoginType = loginType;
	};

	this.removeLoginTypeFromStorage = function () {
		localStorage.removeItem("loginType");
	}

	this.getAuthResponse = function () {
		var loginType = localStorage.getItem("loginType");
		return this.logins[loginType].getAuthResponse();
	};
}
