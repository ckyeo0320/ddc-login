function EmailLogin(config) {
	var _this = this;

	this.loginType = "email";
	this.config = config;

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
		return new Promise(function (resolve, reject) {
			_this.getRSAKey().then(function (response) {
				var params = _this.getLocatorParam(_this.makePassword(response));

				console.log("login params >>> ");
				console.log(params);

				_this.authResponse = params;
				return resolve(params);
			});
		})
	}

	this.logout = function(cb) {

	}

	this.autoLogin = function(){
		var param = {};
		param.client_type = "web";
		param.processor = "pp";
		param.provider = "Email";
		param.login_keep_token = window.localStorage.getItem('emailToken');

		_this.authResponse = param;

		return new Promise(function (resolve, reject) {

			return resolve(param);
		});

	}

	this.register = function(requestName) {
		return new Promise(function(resolve, reject){
			_this.getRSAKey().then(function(response) {
				var params = _this.getLocatorParam(_this.makePassword(response));
				// TODO: show agreement message
				return window.requestMessage(requestName, params);
			});
		});
	}

	this.getRSAKey = function() {
		return window.requestMessage("getRSAKey");
	}

	this.makePassword = function (response) {
		var pw = document.getElementById("pw").value || document.getElementById("rgstPassword").value;

		var index = Math.min(pw.codePointAt(2), 999);
		var md5text = CryptoJS.MD5(pw);
		var salt = '', hashed = pw;
		for (var i = 0; i < 1000; i++) {
				var tmp = CryptoJS.MD5(hashed).toString();
				if (i === index) {
						salt = tmp;
				} else {
						hashed = tmp;
				}
		}
		var encryptStr = hashed + salt;
		var bass64Str = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encryptStr)).toString();
		var cipherStr = bass64Str.replaceAll('=', '.');

		console.log(encryptStr, bass64Str, cipherStr);


		var encrypt = new JSEncrypt();
		encrypt.setPublicKey(response.data.public_key);
		var encrypted = encrypt.encrypt(cipherStr);

		var params = {
			kid: response.data.kid,
			password: encrypted
		};

		return params;
	}

	this.getSdkLoadedPromise = function() {
		return this.sdkLoadedPromise;
	}

	this.getLocatorParam = function(params) {
		params.client_type = "web";
		params.processor = "pp";
		params.provider = "Email";
		params.email = document.getElementById("emailID").value || document.getElementById("rgstEmailID").value;
		return params;
	}
	this.getAuthResponse = function() {
		return this.authResponse;
	}
}
