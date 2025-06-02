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
	"/js/lounge_modules/loginHandler.js",
	"/js/lounge_modules/facebookLogin.js",
	"/js/lounge_modules/googleLoginV2.js",
	"/js/lounge_modules/emailLogin.js",
	"/js/lounge_modules/appleLogin.js",
	"/js/lounge_modules/jsencrypt.min.js",
	"/js/lounge_modules/loginRedirector.js"
];

function loadScripts() {

	removeGoogleV1();

	var promiseArr = [];
	for (var i = 0; i < scriptArr.length; i++) {
		promiseArr.push(loadScript(scriptArr[i]));
	}

	return new Promise(function (resolve, reject) {
		Promise.all(promiseArr).then(function () {
			resolve();
		}, function () {
			reject();
		});
	});
}

function removeGoogleV1(){
	var loginType = window.localStorage.getItem("loginType");

	if(loginType == "google"){
		window.localStorage.setItem("loginType", "googleV2");
	}

	var loungeLoginType = window.localStorage.getItem("loginTypeLounge");

	if(loungeLoginType == "google") {
		window.localStorage.setItem("loginTypeLounge", "googleV2");
	}
}

function loadScript(url) {
	var _resolve, _reject;
	var promise = new Promise(function (resolve, reject) {
		_resolve = resolve;
		_reject = reject;
	});

	var script = document.createElement('script');
	script.src = url;
	script.type = "text/javascript";
	script.async = true;
	script.onload = function () {
		_resolve();
	}

	script.onerror = function () {
		_reject();
	}

	document.head.appendChild(script);
	return promise;
}

window.ddiLog = {
	arrLog: [],
	getJson: function(str) {
		try {
			return JSON.parse(str)
		} catch(e) {
			return str;
		}
	},
	getLog: function() {
		return JSON.stringify(this.arrLog);
	},
	clearLog: function() {this.arrLog.length = 0;},
	logging: function(type, string) {
		this.arrLog.push({
			date: new Date().toString(),
			type: type,
			msg: this.getJson(string)
		})

		if (this.arrLog.length > 20) {
			this.arrLog.shift();
		}
	},
	sendLog: function() {
		try {
			var log = JSON.parse(this.getLog())
			log.localStorage = {};

			Object.keys(localStorage).forEach(function(key){
				log.localStorage[key] = localStorage.getItem(key);
			});

			// console.log(log)

			// todo send log
			// console.log(JSON.stringify(log));

			// todo clear arrLog?
			// this.clearLog();
		} catch(e) {
			console.log(e);
		}
	},
}

/*
 * DEFINE NETWORK BETWEEN page <-> locator iframe
 */
window.requestMessage = function (id, data) {
	return new Promise(function (resolve, reject) {
		var callbackBind;
		var callback = function (response) {
			if (response != null && response.data != null) {
				window.removeEventListener("message", callbackBind, false);
				resolve(response.data.value)
			}
		};

		callbackBind = callback.bind(this);
		window.addEventListener("message", callbackBind, false);

		var frame = document.getElementById("iframe_locator").contentWindow;
		frame.postMessage({
			id,
			value: data
		}, '*');
	});
}

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
		} else if (loginHandler.getLastLoginType() == "google" || loginHandler.getLastLoginType() == "googleV2") {
			appId = window.BASE_INFO.googleAuthClientid;
		}

		var data = {
			locatorRes: loginHandler.getLocatorResponse(),
			authData: loginHandler.getAuthResponse(),
			appId: appId
		}

		frame.postMessage({
			id: "authUser",
			key: "locatorResponse",
			value: data
		}, '*');
	} else if (event.data.id == "regist") {
		regist(event.data.value);

	} else if (event.data.id == "logout") {
		logout();
	} else if (event.data.id == "reload") {
		reload();
	} else if (event.data.id == "validate") {
		validate(event.data.value);
	} else if (event.data.id == "goToGoogleAccount") {
		redirectToSocialLogin(event.data.value, "google");
	} else if (event.data.id == "EncryptPassword") {
		window.requestMessage("getRSAKey").then(function (response) {
			var data = {
				kid: response.data.kid,
				base64Encoded1: encrypt(event.data.value.oldPW, response.data.public_key),
				base64Encoded2: encrypt(event.data.value.newPW, response.data.public_key)
			};

			var frame = document.getElementById("iframe_canvas").contentWindow;

			frame.postMessage({
				id: "EncryptPassword",
				value: data
			}, '*');
		});
	}
	else if (event.data.id == "inviteFriends") {
		inviteFriends(event.data.title, event.data.message);
	}else if(event.data.id == "hideSection"){
		$("section").hide();
	}
}

function failToLogin(){
	initPageForNonAutoLogin();
	setDialog("prevGoogleAutoLoginUserAlert");
	showDialog();
	document.getElementById("text_area").innerHTML = "Login failed. Please try again in a moment.";
	document.getElementById("button_area").style.display = "none";
	$('img.login_button').css('visibility', 'visible');
}

function initBaseInfo(baseInfo) {
	window.BASE_INFO = baseInfo;
	// for(var i = 0; i < scriptArr.length; i++) {
	// 	scriptArr[i] = window.BASE_INFO.desktopUrl + scriptArr[i];
	// }
}

//start
var loginHandler;
var loginRedirector;
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
						locatorUrl:window.BASE_INFO.locatorUrl,
					},
				},
				{
					cls: GoogleLoginV2,
					config: {
						clientId: window.BASE_INFO.googleAuthClientid,
						locatorUrl:window.BASE_INFO.locatorUrl,
					},
				},
				{
					cls: EmailLogin,
					locatorUrl:window.BASE_INFO.locatorUrl,
				},
				{
					cls: AppleLogin,
					config: {
						clientId: window.BASE_INFO.appleClientUrl,
						redirectUrl: window.BASE_INFO.wwwUrl,
					}
				}
			];

		loginHandler = new LoginHandler(loginInfoArr);
		loginRedirector = new LoginRedirector();

		//if first visit is true, show index page
		if (loginHandler.hasLastLoginType() == false) {
			initPageForNonAutoLogin(true);
			//disable login button
			$('img.login_button').css('visibility', 'hidden');
			$(".tag-last-login-lounge").css("visibility", "hidden");
		}

		function showLoadingIndicator() {
			const loader = document.getElementById("loadingIndicator");
			loader.classList.remove("hidden");
		}

		loginHandler.sdkLoad().then(function () {

			var cookieValue = document.cookie.split('; ').find(row => row.startsWith('ddc_accept_cookies'));
			var cookie = '';
			if (cookieValue != null && cookieValue != undefined) {
				cookie = cookieValue.split("=")[1];
			}


			var authCode = window.localStorage.getItem("googleAuthCodeLounge");

			if (!!authCode && authCode != "null" && authCode != "undefined") {
				showLoadingIndicator()
				validateRegister("googleV2");
				return;
			}

			var fbAuthCode = window.localStorage.getItem("facebookAuthCodeLounge");
			if (!!fbAuthCode && fbAuthCode != "null" && fbAuthCode != "undefined") {
				showLoadingIndicator();
				validateRegister("facebook");
				return;
			}

			initPageForNonAutoLogin();
		}, function () {
			var googleAuthCode = window.localStorage.getItem("googleAuthCodeLounge");

			if (!!googleAuthCode && googleAuthCode != "null" && googleAuthCode != "undefined") {
				validateRegister("googleV2");
				return;
			}

			var fbAuthCode = window.localStorage.getItem("googleAuthCodeLounge");
			if (!!fbAuthCode && fbAuthCode != "null" && fbAuthCode != "undefined") {
				validateRegister("facebook");
				return;
			}

			initPageForNonAutoLogin(true);

		}).catch(function () {
			initPageForNonAutoLogin();
		});



	}, function () {
		initPageForNonAutoLogin();
		// window.showInfoMessage("scriptLoadFailed", false);
	});
};

function initPageForNonAutoLogin(isNotAnimated) {
	showLastLoginTag();

	if (document.getElementsByTagName("body")[0].style.display == "block") {
		$('img.login_button').css('visibility', 'visible');
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
	var queryString = window.localStorage.getItem("deeplinkQuery") != null ? "?" + window.localStorage.getItem("deeplinkQuery") : "";
	document.location.href = page + queryString;
}

function saveQueryString() {
	if (window.location.search.substring(1).trim() != '') {
		window.localStorage.setItem("deeplinkQuery", window.location.search.substring(1));
	}
//  Redirectiong to the social platform and logging back in will cause the loss of the deeplink
//	else {
//		window.localStorage.setItem("deeplinkQuery", '');
//	}
}

function clearQueryString() {
	window.localStorage.removeItem("deeplinkQuery");
}

function clearLocalStorage() {
	var udid = null;

	try{
		udid = getUdid();
	}catch(e) {
	}

	localStorage.clear();

	try{
		//restore udid
		localStorage.setItem("udid", udid);
	}catch(e) {
	}
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
	// lounge didn't use invite function
}


// 20240820: only use email, apple in lounge
function doLogin() {
	var forceLoginType = window.loginHandler.registerType;
	var dimmer = document.getElementById('dimmed_overlay');
	dimmer.style.display = "block";

	// var accessToken = getAccessTokenForGoogle();

	// var isPrivateMode = false;
	var loginType = loginHandler.getLoginTypeFromStorage();

	var func;

	if (!!forceLoginType) {
		loginType = forceLoginType;
		func = loginHandler.doLogin;

	} else {
		loginType = loginHandler.getLastLoginType();
		func = loginHandler.doAutoLogin;
	}

	func.call(loginHandler, loginType, window.isPrivateMode).then(function (params) {
		return loungeLogin(loginType, params);
	}).then(function (response) {
		if (response.status !== "success" && response.token == null && response.message !== "NOT_ENOUGH_TIER" && response.message !== "NOT_ENOUGH_LEVEL") {
			setTextField(".msgBox", `Requires correct email or password.`);
		}
		window.loginHandler.registerType = null;
		document.getElementsByTagName("body")[0].style.display = "block";
		dimmer.style.display = "none";
	}, function () {
		dimmer.style.display = "none";
	}).catch(function (e) {
		dimmer.style.display = "none";
	});
}

function doRegister() {

	var type = window.loginHandler.registerType;
	if (type == "email") {
		return;
	} else {
		setAutoLoginForcely(type);
		// //google or facebook
		// window.hideInfoMessage();
		// createGameRoom();
		//
		// dimmer.style.display = "none";

		setDialog('congratsSection');
		showDialog();
	}

}

function setLastLoginType(loginType) {
	window.loginHandler.setLoginTypeOnStorage(loginType);
}

function isPromise(p) {
	if (p != null & typeof p === 'object' && typeof p.then === 'function') {
		return true;
	}

	return false;
}

function validateRegister(type) {
	// window.localStorage.setItem("registerType", type);
	window.loginHandler.registerType = type;

	if (type == "email") {
		return;
	}

	var result = loginHandler.doRegister(type, "validate");
	localStorage.setItem("loungeLastLoginType", type);

	if (type == "email") {
		console.log("Register User email account");
		doRegister();
	}
}

function getAccessTokenForGoogle() {
	return window.localStorage.getItem("googleAuthCodeLounge");
}

function emailLogin() {
	if (formatCheck() == true) {
		doLogin();
	}
}

function validate(params) {
	var type = window.loginHandler.registerType;

	if (params.status == "success") {
		var loungeUrl = getLoungeUrl() + "newUser.html";
		window.location.href = loungeUrl;

		return;
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
			localStorage.removeItem("googleAuthCodeLounge");
		}

		if(type == "facebook" && params && params.data && params.data.message && params.data.message.indexOf("not authorized") > -1) {
			window.loginHandler.getLoginModule("facebook").isTryLogin = false;
			window.loginHandler.getLoginModule("facebook").reAuthRequired = false;

			window._fb_login_response = response;
			var params = window.loginHandler.getLoginModule("facebook").getLocatorParam(response);
			window.requestMessage("validate", params);
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
	// window.localStorage.removeItem("registerType");
	window.loginHandler.registerType = null;
}

function regist(params) {

	if (params.status == "success") {
		setDialog('congratsSection');
		showDialog();
	} else {
		if (params.data.code == "exist email account") {
			setTextField(".msgBoxRgst", `Email already in use.`);
		} else if (params.data.code == "exist guest email account") {
			setTextField(".msgBoxRgst", `This is the email registered by the Guest account in Mobile.<br/>Please input another email`);
		}
	}
}

function encrypt(str, publicKey) {
	let index = Math.min(str.codePointAt(2), 999);
	let salt = '', hashed = str;

	for (let i = 0; i < 1000; i++) {
		let tmp = CryptoJS.MD5(hashed).toString();
		if (i === index) {
			salt = tmp;
		} else {
			hashed = tmp;
		}
	}

	let encryptStr = hashed + salt;
	let bass64Str = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encryptStr)).toString();
	let cipherStr = bass64Str.replaceAll('=', '.');

	var encrypt = new JSEncrypt();
	encrypt.setPublicKey(publicKey);
	var encrypted = encrypt.encrypt(cipherStr);

	return encrypted;
}

// 20240820: only use email, apple
function loungeLogin(loginType, params){
	localStorage.setItem("loungeLastLoginType", loginType);

	var locatorUrl = window.BASE_INFO.locatorUrl;
	var url = locatorUrl + "/user/authToken";
	var param = getLoungeLoginParameters(loginType, params);
	var promise = sendMessage(url, param, "post");
	promise.then( function (response){
		if (response.token) {
			window.localStorage.removeItem("loginTypeLounge");
			let loungeUrl = getLoungeUrl();
			window.location.href = loungeUrl + "?accessToken=" + response.token;
			resolve(response);
		}

		goToLoungeErrorPage(response);
	}, function (response){
		goToLoungeErrorPage(response);
		initPageForNonAutoLogin(true);
		console.log("Error : "+response.toString());
		response.status = "fail";
		resolve(response);
	})

	return promise;
}

function getLoungeLoginParameters(loginType, params){
	console.log(params);
	switch(loginType){
		case "facebook":
			return params
		case "googleV2":
			return {
				provider: "Google",
				token: params,
			}
		case "email":
			let provider = "Email"
			if (mobileAndTabletcheck() == true) {
				provider = provider+"Guest";
			}

			return params;
		case "apple":
			return params;
		case "NONE":
		default:
			return {}
	}
}

function getLoungeUrl() {
	let env = window["env"];
	switch(env) {
		case "dev":
			return "https://lounge.dev.doubledowncasino.com/";
		case "qa":
			return "https://lounge.qa.doubledowncasino.com/";
		case "www":
		case "prod":
		default:
			return "https://lounge.doubledowncasino.com/";
	}
}

function goToLoungeErrorPage(response) {
	if(response.message === "NOT_ENOUGH_TIER" || response.message === "NOT_ENOUGH_LEVEL" || response.message === "INVALID_USER" || response.message === "DELETED_ACCOUNT_USER") {
		var loungeUrl = getLoungeUrl() + "error.html?type=" + response.message;
		window.location.href = loungeUrl;
	} else if (response.message === "INVALID_PLATFORM") {
		var loungeUrl = getLoungeUrl() + "error.html";
		window.location.href = loungeUrl;
	} else {
		var loungeUrl = getLoungeUrl() + "error.html";
		window.location.href = loungeUrl;
	}
	return;
}

function getLastLoginBtnId(lastLoginType) {
	var buttonIdMap = {
		"facebook": "btn_fb",
		"apple": "btn_apple",
		"googleV2": "btn_google",
		"google": "btn_google", // defence code
		"email": "btn_email",
		"app" : "btn_app"
	};

	if (buttonIdMap[lastLoginType]) {
		return buttonIdMap[lastLoginType];
	}
}

function showLastLoginTag() {
	$(".tag-last-login-lounge").css("visibility", "hidden");

	var lastLoginType = localStorage.getItem("loungeLastLoginType");

	if (!lastLoginType) {
		return;
	}

	var lastLoginButtonId = getLastLoginBtnId(lastLoginType);
	var lastLoginTag;

	var lastLoginButton = document.getElementById(lastLoginButtonId);
	if (!lastLoginButton) {
		return;
	}

	var parentDiv = lastLoginButton.parentNode;
	var lastLoginTag = parentDiv.querySelector(".tag-last-login-lounge");

	if (lastLoginTag) {
		lastLoginTag.style.visibility = "visible";
	}
}
