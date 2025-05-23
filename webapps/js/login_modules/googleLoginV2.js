function GoogleLoginV2(config) {
	var _this = this;

	this.loginType = "googleV2";
	this.config = config;

	// this.scope = "email profile https://www.googleapis.com/auth/calendar";
	this.scope = "email profile";

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


	this.sdkLoadedPromise = new Promise(function (resolve, reject) {
		_this.resolve = resolve;
		_this.reject = resolve;
	});

	/*
		def function
	*/
	this.sdkLoad = function () {
		_this.resolve();
	};

	this.prepare = function () {
		//authCode를 얻어서, /oauth/authorize를 호출 ddc_token으로 변환한다.

		var authCode = window.localStorage.getItem("googleAuthCode");
		var ddcToken = window.localStorage.getItem("ddc_access_token");
		// if(ddcToken && ddcToken != "null" && ddcToken != "undefined"){
		// 	return this.refreshDDCToken();
		// }else
		//
		if (ddcToken == null && authCode && authCode !== "null" && authCode !== "undefined") {
			return this.authorizeCode(authCode);
		} else if(!!ddcToken){
			// goToGoogleAccount(this.config.clientId);
			return new Promise((resolve, reject) => {resolve();});
		}

		goToGoogleAccount(this.config.clientId);
		return;
	};

	// this.refreshDDCToken = function(){
	// 	var locatorUrl = this.config.locatorUrl;
	// 	var url = locatorUrl + "/oauth/info";
	// 	var ddcToken = window.localStorage.getItem("ddc_access_token");
	// 	var data = {token:ddcToken};

	// 	var promise = sendMessage(url, data);
	// 	promise.then(function(response){
	// 		ddc_access_token = response.data.ddc_access_token;
	// 		window.localStorage.setItem("ddc_access_token", ddc_access_token);
	// 	}, function(response){
	// 		window.localStorage.removeItem("ddc_access_token");
	// 		initPageForNonAutoLogin(true);
	// 	});

	// 	return promise;
	// }

	this.authorizeCode = function(authCode) {

		//ajax call /oauth/authorize
		//ddc_access_token 얻음, 가입여부알게 됨
		var locatorUrl = this.config.locatorUrl;
		var url = locatorUrl + "/oauth/authorize";

		var data = {
			client_type: "web",
			processor: "pp",
			provider: "Google",
			code: authCode,
			a_l_skey: window.a_l_skey,
		};

		//check beta
		var base = window.location.href;
		if(base.indexOf("beta")>-1){
			data.mode = "beta";
		}

		var promise = sendMessage(url, data);
		promise.then(function(response){

			if(response.status === "success"){
				ddc_access_token = response.data.ddc_access_token;
				window.localStorage.setItem("ddc_access_token", ddc_access_token);
				window.localStorage.removeItem("googleAuthCode");
			}else{
				window.localStorage.removeItem("googleAuthCode");
				initPageForNonAutoLogin(true);
				//send error
				console.log("Error : "+response.toString());
				sendError("error", {"authCode": authCode, "msg": "authorizeCode response: " + response.toString()});
			}

		}, function(response){
			window.localStorage.removeItem("googleAuthCode");
			initPageForNonAutoLogin(true);

			//send error
			console.log("Error : "+response.toString());
			sendError("error", {"authCode": authCode, "msg": "authorizeCode response: " + response.toString()});
		});

		return promise;
	}

	this.registerToken = function(token){
		var locatorUrl = this.config.locatorUrl;
		var url = locatorUrl + "/oauth/register";

		var data = {
			token: token,
		};

		var promise = sendMessage(url, data);
		promise.then(function(response){
			if(response && response.status && response.status === "success"){
				// this.doLogin(response.data.ddc_access_token);
				regist(response);
			}else if(response.status !== "success"){

				//send error
				console.log("Error :" + response.mesage);
				sendError("error", {"token":token, "msg": "registerToken : " + response.toString()});

				$('img.login_button').css('visibility', 'visible');
				showLastLoginTag();
			}
		}, function(response){

			//send error
			console.log("Error : "+response.toString());
			sendError("error", {"token": token, "msg": "registerToken response: " + response.toString()});
			$('img.login_button').css('visibility', 'visible');
			showLastLoginTag();
		});

		return promise;
	}

	this.getAuthInfo = function (ddcToken){
		var locatorUrl = this.config.locatorUrl;
		var url = locatorUrl + "/oauth/info";

		var data = {
			token: ddcToken,
			a_l_skey: window.a_l_skey,
		};

		var promise = sendMessage(url, data);
		promise.then(function(response){
			if(response && response.status && response.status === "success"){
				//there is nothing to do.. really?
				ddc_access_token = response.data.ddc_access_token;
				window.localStorage.setItem("ddc_access_token", ddc_access_token);

				console.log("success");
			}else if(response.status !== "success"){

				sendError("error", {"token":ddcToken, "msg": "getAuthInfo : " + response.toString()});

				window.localStorage.removeItem("ddc_access_token");
				if(response.message == "expired token"){
					return ;
				}
				failToLogin();
			}
		}, function(response){
			if(response && response.status && response.status !== "success"){
				sendError("error", {"token":ddcToken, "msg": "getAuthInfo : " + response.toString()});
				failToLogin();
			}
		});

		return promise;
	}


	this.register = function () {
		return this.prepare().then((response)=>{
			var isUnregistered = response && response.data && response.data.unregistered !== null ? response.data.unregistered : false;
			if(isUnregistered){
				return this.registerToken(response.data.ddc_access_token);
			}else{
				loginHandler.setLastLoginType("googleV2");
				doLogin();
			}

			return new Promise((resolve, reject) => resolve());
		});

	};


	this.login = function () {

		return this.prepare().then(()=> {
			var token = window.localStorage.getItem("ddc_access_token");
			return this.getAuthInfo(token);
		});
	};

	this.autoLogin = function () {

		//autologin은 결국 ddc_token 유무로 자동 로그인을 판단, ddc_token이 있으면 /oauth/register를 호출해서 ddc_token 갱신.

		return this.login();
		// return new Promise(function (resolve, reject) {
		// 	window.startLoading("google");
		//
		// 	var authCode = window.localStorage.getItem("googleAuthCode");
		// 	if (authCode && authCode !== "null" && authCode !== "undefined") {
		// 		var params = this.getLocatorParam(authCode);
		// 		window.localStorage.removeItem("googleAuthCode");
		// 		resolve(params);
		// 		return;
		// 	}
		//
		// 	// auto login with login_keep_token
		// 	var loginKeepToken = window.localStorage.getItem("googleLoginKeepToken");
		// 	if (loginKeepToken) {
		// 		var params = this.getLocatorKeepTokenParam(loginKeepToken);
		// 		resolve(params);
		// 		return;
		// 	}
		//
		// 	// cookie=Yes but no data for autoLogin page reload
		// 	//window.localStorage.removeItem("loginType");
		// 	window.localStorage.setItem("loginType", "NONE");
		// 	window.localStorage.removeItem("registerType");
		// 	window.parent.postMessage({ id: "reload" }, "*");
		// });
	};

	this.logout = function (cb) {};

	this.getSdkLoadedPromise = function () {
		return this.sdkLoadedPromise;
	};

	this.getLocatorParam = function (authCode) {
		return {
			client_type: "web",
			processor: "pp",
			provider: "Google",
			authorization_code: authCode,
		};
	};

	this.getLocatorKeepTokenParam = function (loginKeepToken) {
		return {
			client_type: "web",
			processor: "pp",
			provider: "Google",
			login_keep_token: loginKeepToken,
		};
	};

	this.getAuthResponse = function () {
		return this.authResponse;
	};
}
