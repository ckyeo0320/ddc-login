/*
 * SCRIPT LOAD
 */
// var scriptArr = [
// 	"/desktop/static/js/loginHandler_gz.js",
// 	"/desktop/static/js/facebookLogin_gz.js",
// 	"/desktop/static/js/googleLogin_gz.js",
// 	"/desktop/static/js/emailLogin_gz.js",
// 	"/desktop/static/js/jsencrypt.min_gz.js"
// ];

var scriptArr = [
	"/js/login_modules/loginHandler.js",
	"/js/login_modules/facebookLogin.js",
	"/js/login_modules/googleLogin.js",
	"/js/login_modules/googleLoginV2.js",
	"/js/login_modules/emailLogin.js",
	"/js/login_modules/jsencrypt.min.js",
];

function loadScripts() {
	var promiseArr = [];
	for (var i = 0; i < scriptArr.length; i++) {
		promiseArr.push(loadScript(scriptArr[i]));
	}

	return new Promise(function (resolve, reject) {
		Promise.all(promiseArr).then(
			function () {
				resolve();
			},
			function () {
				reject();
			}
		);
	});
}

function loadScript(url) {
	var _resolve, _reject;
	var promise = new Promise(function (resolve, reject) {
		_resolve = resolve;
		_reject = reject;
	});

	var script = document.createElement("script");
	script.src = url;
	script.type = "text/javascript";
	script.async = true;
	script.onload = function () {
		_resolve();
	};

	script.onerror = function () {
		_reject();
	};

	document.head.appendChild(script);
	return promise;
}

window.ddiLog = {
	arrLog: [],
	getJson: function (str) {
		try {
			return JSON.parse(str);
		} catch (e) {
			return str;
		}
	},
	getLog: function () {
		return JSON.stringify(this.arrLog);
	},
	clearLog: function () {
		this.arrLog.length = 0;
	},
	logging: function (type, string) {
		this.arrLog.push({
			date: new Date().toString(),
			type: type,
			msg: this.getJson(string),
		});

		if (this.arrLog.length > 20) {
			this.arrLog.shift();
		}
	},
	sendLog: function () {
		try {
			var _localStorage = {};

			Object.keys(localStorage).forEach(function (key) {
				_localStorage[key] = localStorage.getItem(key);
			});

			// https://stackoverflow.com/questions/16196338/json-stringify-doesnt-work-with-normal-javascript-array
			this.logging("localStorage", _localStorage);

			var log = JSON.parse(this.getLog());

			// todo send log
			console.log(JSON.stringify(log));

			this.clearLog();
		} catch (e) {
			console.log(e);
		}
	},
};

/*
 * DEFINE NETWORK BETWEEN page <-> locator iframe
 */
window.requestMessage = function (id, data) {
	return new Promise(function (resolve, reject) {
		var callbackBind;
		var callback = function (response) {
			if (response != null && response.data != null) {
				window.removeEventListener("message", callbackBind, false);
				resolve(response.data.value);
			}
		};

		callbackBind = callback.bind(this);
		window.addEventListener("message", callbackBind, false);

		var frame = document.getElementById("iframe_locator").contentWindow;
		frame.postMessage(
			{
				id: id,
				value: data,
			},
			"*"
		);
	});
};

/*
 * DEFINE NETWORK BETWEEN page <-> locator iframe, game iframe
 */
window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
	// try {
	// 	event && event.data && ddiLog.logging('receiveMessage', event.data);
	// } catch(e) {
	// 	console.log(e);
	// }

	if (event.data.id == "loginProxyLoaded") {
		initBaseInfo(event.data.value);
		load();
	} else if (event.data.id == "getLocatorResponse") {
		var frame = document.getElementById("iframe_canvas").contentWindow;
		var appId;

		if (loginHandler.getLastLoginType() == "facebook") {
			appId = window.BASE_INFO.facebookOffCanvasAppId;
		} else if (loginHandler.getLastLoginType() == "google") {
			appId = window.BASE_INFO.googleAuthClientid;
		}

		var data = {
			locatorRes: loginHandler.getLocatorResponse(),
			authData: loginHandler.getAuthResponse(),
			appId: appId,
		};

		frame.postMessage(
			{
				id: "authUser",
				key: "locatorResponse",
				value: data,
			},
			"*"
		);
	} else if (event.data.id == "regist") {
		regist(event.data.value);
	} else if (event.data.id == "logout") {
		logout();
	} else if (event.data.id == "reload") {
		reload();
	} else if (event.data.id == "validate") {
		validate(event.data.value);
	} else if (event.data.id == "goToGoogleAccount") {
		goToGoogleAccount(event.data.value);
	} else if (event.data.id == "EncryptPassword") {
		window.requestMessage("getRSAKey").then(function (response) {
			var data = {
				kid: response.data.kid,
				base64Encoded1: encrypt(event.data.value.oldPW, response.data.public_key),
				base64Encoded2: encrypt(event.data.value.newPW, response.data.public_key),
			};

			var frame = document.getElementById("iframe_canvas").contentWindow;

			frame.postMessage(
				{
					id: "EncryptPassword",
					value: data,
				},
				"*"
			);
		});
	} else if (event.data.id == "inviteFriends") {
		inviteFriends(event.data.title, event.data.message);
	}
}

function initBaseInfo(baseInfo) {
	window.BASE_INFO = baseInfo;
	// for(var i = 0; i < scriptArr.length; i++) {
	// 	scriptArr[i] = window.BASE_INFO.desktopUrl + scriptArr[i];
	// }
}

//start
var loginHandler;

function load() {
	loadScripts().then(
		function () {
			var loginInfoArr = [
				{
					cls: FacebookLogin,
					config: {
						appId: window.BASE_INFO.facebookOffCanvasAppId,
						cookie: true,
						version: "v19.0",
					},
				},
				{
					cls: GoogleLogin,
					config: {
						clientId: window.BASE_INFO.googleAuthClientid,
					},
				},
				{
					cls: GoogleLoginV2,
					config: {
						clientId: window.BASE_INFO.googleAuthClientid,
					},
				},
				{
					cls: EmailLogin,
				},
			];

			loginHandler = new LoginHandler(loginInfoArr);

			//if first visit is true, show index page
			if (loginHandler.hasLastLoginType() == false) {
				initPageForNonAutoLogin(true);
				//disable login button
				$("img.login_button").css("visibility", "hidden");
			}

			loginHandler
				.sdkLoad()
				.then(
					function () {
						var cookieValue = document.cookie.split("; ").find(function (row) {
							return row.startsWith("ddc_accept_cookies");
						});
						var cookie = "";
						if (cookieValue != null && cookieValue != undefined) {
							cookie = cookieValue.split("=")[1];
						}

						if (loginHandler.hasLastLoginType() == true && cookie == "Yes") {
							// show dialog for previous google auto login user to relogin with google
							if (IsPrevGoogleAutoLoginUser()) {
								initPageForNonAutoLogin();
								setDialog("prevGoogleAutoLoginUserAlert");
								showDialog();
								var dimmer = document.getElementById("dimmed_overlay");
								dimmer.style.display = "block";
								return;
							}
							FB.getLoginStatus();
							doLogin();
						} else {
							initPageForNonAutoLogin();
						}

						FB.getLoginStatus();
					},
					function () {
						//sdk is not loaded
						initPageForNonAutoLogin(true);
					}
				)
				.catch(function () {
					initPageForNonAutoLogin();
				});
		},
		function () {
			initPageForNonAutoLogin();
			// window.showInfoMessage("scriptLoadFailed", false);
		}
	);
}

// for previous google auto login user
function doGoogleLogin() {
	try {
		window.localStorage.setItem("registerType", "google");
		loginHandler && loginHandler.doLogin("google");
	} catch (e) {
		closeEmail();
	}
}
// for previous google auto login user
function IsPrevGoogleAutoLoginUser() {
	var loginType = window.localStorage.getItem("loginType");
	var authCode = window.localStorage.getItem("authCode");
	var googleLoginKeepToken = window.localStorage.getItem("googleLoginKeepToken");

	if (loginType == "google" && authCode == null && googleLoginKeepToken == null) return true;
	return false;
}

function initPageForNonAutoLogin(isNotAnimated) {
	if (document.getElementsByTagName("body")[0].style.display == "block") {
		$("img.login_button").css("visibility", "visible");
	} else {
		document.getElementsByTagName("body")[0].style.backgroundImage = "url('./images/bg_gradient_blue.jpg')";
		if (isNotAnimated != true) {
			document.getElementsByTagName("body")[0].style.animation = "1s ease-out 0s 1 fade_in";
		}
		document.getElementsByTagName("body")[0].style.display = "block";
	}
}

function goPage(page) {
	var url = "/";
	var queryString =
		window.localStorage.getItem("deeplinkQuery") != null ? "?" + window.localStorage.getItem("deeplinkQuery") : "";
	document.location.href = page + queryString;
}

function saveQueryString() {
	if (window.location.search.substr(1).trim() != "") {
		window.localStorage.setItem("deeplinkQuery", window.location.search.substr(1));
	} else {
		window.localStorage.setItem("deeplinkQuery", "");
	}
}

function clearQueryString() {
	window.localStorage.removeItem("deeplinkQuery");
}

function clearLocalStorage() {
	localStorage.clear();
}

function logout() {
	clearLocalStorage();
	window.localStorage.setItem("loginType", "NONE");
	window.location.href = window.location.origin;
}

function reload() {
	document.location.reload();
}

function inviteFriends(inviteTitle, inviteMessage) {
	FB.ui(
		{
			app_id: window.BASE_INFO.facebookOffCanvasAppId,
			method: "apprequests",
			message: inviteMessage,
			title: inviteTitle,
			data: {
				requestType: "invite",
				campaignId: 9,
			},
			filters: ["app_non_users"],
		},
		function (response) {}
	);
}

function doLogin() {
	var forceLoginType = loginHandler.hasLastLoginType() ? null : window.localStorage.getItem("registerType");
	var dimmer = document.getElementById("dimmed_overlay");
	dimmer.style.display = "block";

	var func;
	var loginType;
	if (forceLoginType != null) {
		loginType = forceLoginType;
		func = loginHandler.doLogin;
	} else {
		loginType = loginHandler.getLastLoginType();
		func = loginHandler.doAutoLogin;
	}

	func
		.call(loginHandler, loginType)
		.then(function (params) {
			return window.requestMessage("locate", params);
		})
		.then(
			function (response) {
				window.localStorage.removeItem("registerType");

				document.getElementsByTagName("body")[0].style.display = "block";
				if (response.status == "success") {
					if (loginType === "email") {
						window.localStorage.setItem("emailToken", response.login_keep_token);
						window.localStorage.removeItem("googleLoginKeepToken");
					} else if (loginType === "google") {
						window.localStorage.setItem("googleLoginKeepToken", response.login_keep_token);
						window.localStorage.removeItem("emailToken");
					}

					loginHandler.setLocatorResponse(response);
					loginHandler.setLastLoginType(loginType);

					window.hideInfoMessage();
					createGameRoom();

					dimmer.style.display = "none";
				} else {
					setTextField(".msgBox", "Requires correct email or password.");
					dimmer.style.display = "none";
				}
			},
			function (response) {
				dimmer.style.display = "none";
			}
		)
		.catch(function (e) {
			// window.showInfoMessage(e, true);
			dimmer.style.display = "none";
		});
}

function doRegister() {
	var type = window.localStorage.getItem("registerType");
	if (type == "email") {
		//email register
		if (checkRegistEmailValidation() == true) {
			loginHandler.doRegister("email", "regist");
		}
	} else {
		setAutoLoginForcely(type);
		// //google or facebook
		// window.hideInfoMessage();
		// createGameRoom();
		//
		// dimmer.style.display = "none";

		setDialog("congratsSection");
	}
}


//TODO remove unused function
function doLoginOrRegister(action, loginType) {
	var dimmer = document.getElementById("dimmed_overlay");
	dimmer.style.display = "block";

	var func;
	if (action == "register") {
		if (loginType != "email") {
			dimmer.style.display = "none";
			throw new Error("can regist only loginType is email!");
		}

		func = loginHandler.doRegister;
	} else {
		if (loginType != null) {
			func = loginHandler.doLogin;
		} else {
			loginType = loginHandler.getLastLoginType();
			func = loginHandler.doAutoLogin;
		}
	}

	func
		.call(loginHandler, loginType)
		.then(function (params) {
			return window.requestMessage("locate", params);
		})
		.then(
			function (response) {
				document.getElementsByTagName("body")[0].style.display = "block";
				if (response.status == "success") {
					window.localStorage.setItem("emailToken", response.login_keep_token);

					loginHandler.setLocatorResponse(response);
					loginHandler.setLastLoginType(loginType);

					if (response.new_user == true) {
						if (loginType != "email") {
							setDialog("privacySection");
							showDialog();
							console.log("Register social media account");
						}
					} else {
						window.hideInfoMessage();
						createGameRoom();

						dimmer.style.display = "none";
					}
				} else {
					setTextField(".msgBox", "Requires correct email or password.");
					dimmer.style.display = "none";
				}
			},
			function (response) {
				dimmer.style.display = "none";
			}
		)
		.catch(function (e) {
			// window.showInfoMessage(e, true);
			dimmer.style.display = "none";
		});
}

function setLastLoginType(loginType) {
	window.localStorage.setItem("loginType", loginType);
}

function isPromise(p) {
	if ((p != null) & (typeof p === "object") && typeof p.then === "function") {
		return true;
	}

	return false;
}

function validateRegister(type) {
	window.localStorage.setItem("registerType", type);

	if (type == "email" && checkRegistEmailValidation() == false) {
		return;
	}

	var result = loginHandler.doRegister(type, "validate");

	// if (isPromise(result)) {
	// 	result.catch( function(reason) {
	// 		ddiLog.logging('loginHandler.doRegister: ' + type, reason );
	// 	})
	// } else {
	// 	ddiLog.logging('loginHandler.doRegister(not promise): ' + type, result );
	// }

	if (type == "email") {
		console.log("Register User email account");
		doRegister();
	}
}

function emailLogin() {
	if (formatCheck() == true) {
		doLogin();
	}
}

function validate(params) {
	var type = window.localStorage.getItem("registerType");

	if (params.status == "success") {
		if (type != "email") {
			setDialog("privacySection");
			showDialog();
			var dimmer = document.getElementById("dimmed_overlay");
			dimmer.style.display = "block";
			console.log("Show privacy section");
			// setAutoLoginForcely(type);
		}
	} else {
		if (type == "email") {
			if (params.data.code == "exist email account") {
				setTextField(".msgBoxRgst", "Email already in use.");
				return;
			} else if (params.data.code == "exist guest email account") {
				setTextField(
					".msgBoxRgst",
					"This is the email registered by the Guest account in Mobile.<br/>Please input another email"
				);
				return;
			}
		} else if (params.data != null && params.data.code == false) {
			setAutoLoginForcely(type);
			doLogin();
			return;
		} else if (type === "google") {
			ddiLog.logging("google", {
				code: params.data.code,
			});
			ddiLog.sendLog();
			localStorage.removeItem("authCode");
		}

		setTextField(".msgBoxRgst", "Error.");
	}
}

function setAutoLoginForcely(type) {
	//For auto login. It looks like to work auto login.
	//First of all, do not show google or facebook login popup.
	//If you don't remove "registerType", it shows login popup twice.
	//First, for validation check, second, login.
	loginHandler.setLastLoginType(type);
	window.localStorage.removeItem("registerType");
}

function regist(params) {
	if (params.status == "success") {
		setDialog("congratsSection");
	} else {
		if (params.data.code == "exist email account") {
			setTextField(".msgBoxRgst", "Email already in use.");
		} else if (params.data.code == "exist guest email account") {
			setTextField(
				".msgBoxRgst",
				"This is the email registered by the Guest account in Mobile.<br/>Please input another email"
			);
		}
	}
}

function goToGoogleAccount(clientId) {
	window.location.href = getAuthUri(clientId);
}

function getAuthUri(clientId) {
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

	return (
		"https://accounts.google.com/o/oauth2/v2/auth" +
		"?client_id=" +
		encodeURIComponent(clientId) +
		"&redirect_uri=" +
		encodeURIComponent(base + "g_oauth.html") +
		"&state=" +
		encodeURIComponent(btoa(state)) +
		"&response_type=" +
		encodeURIComponent("code") +
		"&scope=" +
		encodeURIComponent("email profile") +
		"&include_granted_scopes=" +
		encodeURIComponent("true") +
		"&access_type=" +
		encodeURIComponent("offline") +
		"&prompt=" +
		encodeURIComponent("consent")
	);
}

function createGameRoom() {
	document.getElementsByTagName("body")[0].style.backgroundImage = "none";
	var gameRoom = document.createElement("iframe");
	var dimmer = document.getElementById("dimmed_overlay");
	dimmer.style.display = "none";

	gameRoom.setAttribute("id", "iframe_canvas");
	gameRoom.setAttribute("name", "iframe_canvas");
	gameRoom.setAttribute("frameborder", "0");
	// gameRoom.setAttribute("scrolling","yes");

	gameRoom.setAttribute("webkitallowfullscreen", "");
	gameRoom.setAttribute("mozallowfullscreen", "");
	gameRoom.setAttribute("oallowfullscreen", "");
	gameRoom.setAttribute("msallowfullscreen", "");
	gameRoom.setAttribute("allowfullscreen", "");

	// gameRoom.style.width = "100%";
	// gameRoom.style.height = "1060px";

	gameRoom.style =
		"overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:1060px;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px";

	// var url = unescape(location.href);
	// var params = "";
	// if(url.indexOf("?") > -1) {
	// 	params = url.substring(url.indexOf("?"), url.length);
	// }

	var params = "?" + window.localStorage.getItem("deeplinkQuery");
	clearQueryString();
	gameRoom.src = window.BASE_INFO.landingUrl + "/offcanvas" + params;
	document.body.appendChild(gameRoom);
	$("section").hide();
}

function encrypt(str, publicKey) {
	var index = Math.min(str.codePointAt(2), 999);
	var salt = "",
		hashed = str;

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
	var cipherStr = bass64Str.replaceAll("=", ".");

	var encrypt = new JSEncrypt();
	encrypt.setPublicKey(publicKey);
	var encrypted = encrypt.encrypt(cipherStr);

	return encrypted;
}
