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
	// "/js/login_modules/googleLogin.js",
	"/js/login_modules/googleLoginV2.js",
	"/js/login_modules/emailLogin.js",
	"/js/login_modules/jsencrypt.min.js",
	"/js/login_modules/appleLogin.js"
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

	if(loginType === "google"){
		window.localStorage.setItem("loginType", "googleV2");
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

	if (event.data.id === "loginProxyLoaded") {
		initBaseInfo(event.data.value);
		load();
	} else if (event.data.id === "getLocatorResponse") {
		var frame = document.getElementById("iframe_canvas").contentWindow;
		var appId;

		if (loginHandler.getLastLoginType() === "facebook") {
			appId = window.BASE_INFO.facebookOffCanvasAppId;
		} else if (loginHandler.getLastLoginType() === "google" || loginHandler.getLastLoginType() === "googleV2") {
			appId = window.BASE_INFO.googleAuthClientid;
		} else if (loginHandler.getLastLoginType() === "apple") {
			appId = window.BASE_INFO.appleClientUrl;
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
	} else if (event.data.id === "regist") {
		regist(event.data.value);

	} else if (event.data.id === "logout") {
		logout();
	} else if (event.data.id === "reload") {
		reload();
	} else if (event.data.id === "validate") {
		validate(event.data.value);
	} else if (event.data.id === "goToGoogleAccount") {
		goToGoogleAccount(event.data.value);
	} else if (event.data.id === "EncryptPassword") {
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
	else if (event.data.id === "inviteFriends") {
		inviteFriends(event.data.title, event.data.message);
	}else if(event.data.id === "hideSection"){
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
						locatorUrl: window.BASE_INFO.locatorUrl,
					}
				}
			];

		loginHandler = new LoginHandler(loginInfoArr);

		//if first visit is true, show index page
		if (loginHandler.hasLastLoginType() == false) {
			initPageForNonAutoLogin(true);
			//disable login button
			$('img.login_button').css('visibility', 'hidden');
			$('button .login_button').parent().css('visibility', 'hidden');

			$(".tag-last-login").css("visibility", "hidden");
		}

		loginHandler.sdkLoad().then(function () {

			var cookieValue = document.cookie.split('; ').find(row => row.startsWith('ddc_accept_cookies'));
			var cookie = '';
			if (cookieValue != null && cookieValue != undefined) {
				cookie = cookieValue.split("=")[1];
			}

			if (loginHandler.hasLastLoginType() == true && cookie == "Yes") {
				FB.getLoginStatus();
				doLogin();
				// }else if(getAccessTokenForGoogle() != ''){
				// 	validateRegister("google");
			} else {

				// var registerType = window.localStorage.getItem("registerType");
				var appleAuthCode = getAccessTokenForApple();
				var isApple = appleAuthCode && appleAuthCode !== "" && appleAuthCode !== "undefined";
				var authCode = isApple === true ? window.localStorage.getItem("appleAuthCode") : window.localStorage.getItem("googleAuthCode");

				if (!!authCode && authCode !== "null" && authCode !== "undefined") {
					var type = isApple === true ? "apple" : "googleV2";
					validateRegister(type);
					return;
				}

				initPageForNonAutoLogin();
			}

			FB.getLoginStatus();
		}, function () {
			//sdk is not loaded
			// window.localStorage.setItem("isPrivateMode", true);
			// isPrivateMode = true;
			// var registerType = window.localStorage.getItem("registerType");
			var appleAuthCode = getAccessTokenForApple();
			var isApple = appleAuthCode && appleAuthCode !== "" && appleAuthCode !== "undefined";
			var authCode = isApple === true ? window.localStorage.getItem("appleAuthCode") : window.localStorage.getItem("googleAuthCode");

			if (!!authCode && authCode !== "null" && authCode !== "undefined") {
				var type = isApple === true ? "apple" : "googleV2";
				validateRegister(type);
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

	loginHandler.removeLoginTypeFromStorage();
	window.localStorage.removeItem("ddc_access_token");
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
	var lastLoginType = null;
	var loungeLastLoginType = null;

	try{
		udid = getUdid();
		lastLoginType = localStorage.getItem("lastLoginType");
		loungeLastLoginType = localStorage.getItem("loungeLastLoginType");
	}catch(e) {
	}

	localStorage.clear();

	try{
		//restore udid
		localStorage.setItem("udid", udid);
		localStorage.setItem("lastLoginType", lastLoginType);
		localStorage.setItem("loungeLastLoginType", loungeLastLoginType);		
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
	FB.ui({
		app_id: window.BASE_INFO.facebookOffCanvasAppId,
		method: 'apprequests',
		message: inviteMessage,
		title: inviteTitle,
		data: {
			requestType: 'invite',
			campaignId: 9
		},
		filters: ['app_non_users']
	}, function(response) {
	});
}

function doLogin() {
	var forceLoginType = window.loginHandler.registerType;
	var dimmer = document.getElementById('dimmed_overlay');
	dimmer.style.display = "block";
	if(forceLoginType == "email") {
		showLoadingIndicator();
	}
	// var accessToken = getAccessTokenForGoogle();

	// var isPrivateMode = false;
	var loginType = window.localStorage.getItem("loginType");

	var func;

	if (!!forceLoginType) {
		loginType = forceLoginType;
		func = loginHandler.doLogin;

	} else {
		loginType = loginHandler.getLastLoginType();
		func = loginHandler.doAutoLogin;
	}

	localStorage.setItem("lastLoginType", loginType);	

	func.call(loginHandler, loginType, window.isPrivateMode).then(function (params) {
		if(loginType == "googleV2"|| loginType == "apple"){
			var response = params.data;
			response.status = params.status;
			response.service = "new_service";
			return new Promise((resolve, reject) => resolve(response));
		}

		return window.requestMessage("locate", params);
	}).then(function (response) {
		// window.localStorage.removeItem("registerType");
		window.loginHandler.registerType = null;

		document.getElementsByTagName("body")[0].style.display = "block";
		if (response.status == "success") {

			window.localStorage.setItem("emailToken", response.login_keep_token);

			loginHandler.setLocatorResponse(response);
			loginHandler.setLastLoginType(loginType);


			window.hideInfoMessage();
			createGameRoom();

			dimmer.style.display = "none";
			hideLoadingIndicator();

		} else {
			setTextField(".msgBox", `Requires correct email or password.`);
			dimmer.style.display = "none";
			hideLoadingIndicator();
		}
	}, function (response) {
		dimmer.style.display = "none";
		hideLoadingIndicator();
	}).catch(function (e) {
		// window.showInfoMessage(e, true);
		dimmer.style.display = "none";
		hideLoadingIndicator();
	});
}

function doRegister() {

	var type = window.loginHandler.registerType;
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

		setDialog('congratsSection');
		showDialog();
	}

}

function setLastLoginType(loginType) {
	window.localStorage.setItem('loginType', loginType);
	window.localStorage.setItem("lastLoginType", loginType);
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

	if (type == "email" && checkRegistEmailValidation() == false) {
		return;
	}

	var result = loginHandler.doRegister(type, "validate");

	if (type == "email") {
		console.log("Register User email account");
		doRegister();
	}
}

function getAccessTokenForGoogle() {
	return window.localStorage.getItem("googleAuthCode");
}

function getAccessTokenForApple() {
	return window.localStorage.getItem("appleAuthCode");
}

function emailLogin() {
	if (formatCheck() == true) {
		doLogin();
	}
}

function validate(params) {
	var type = window.loginHandler.registerType;

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
			localStorage.removeItem("googleAuthCode");
		}else if(type === "facebook"){
			var key = "fblst_" + FB.getUserID();
			localStorage.removeItem(key);
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

function goToGoogleAccount(clientId) {
	window.location.href = getAuthUri(clientId);
}

function goToAppleAccount(clientId) {
	window.location.href = getAppleAuthUri(clientId);
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
		"?scope=" +
		encodeURIComponent("email profile") +
		"&access_type=" +
		encodeURIComponent("offline") +
		"&prompt=" +
		encodeURIComponent("consent") +
		"&include_granted_scopes=" +
		encodeURIComponent("true") +
		"&response_type=" +
		encodeURIComponent("code") +
		"&state=" +
		encodeURIComponent(btoa(state)) +
		"&redirect_uri=" +
		encodeURIComponent(base + "g_oauth.html") +
		"&client_id=" +
		encodeURIComponent(clientId)
	);
}

function getAppleAuthUri(clientId) {
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
		"https://appleid.apple.com/auth/authorize?client_id=" +
		encodeURIComponent(clientId) +
		"&redirect_uri=" +
		encodeURIComponent(base + "a_oauth.html") +
		"&response_type=code" +
		// "&scope=" +
		// encodeURIComponent("email name") +
		"&response_mode=query"
	);
}

function createGameRoom() {
	document.getElementsByTagName("body")[0].style.backgroundImage = "none";
	var gameRoom = document.createElement("iframe");
	var dimmer = document.getElementById('dimmed_overlay');
	dimmer.style.display = "none";

	gameRoom.setAttribute("id", "iframe_canvas");
	gameRoom.setAttribute("name", "iframe_canvas");
	gameRoom.setAttribute("frameborder", "0");
	// gameRoom.setAttribute("scrolling","yes");
	gameRoom.setAttribute("allow", "clipboard-write");

	gameRoom.setAttribute("webkitallowfullscreen", "");
	gameRoom.setAttribute("mozallowfullscreen", "");
	gameRoom.setAttribute("oallowfullscreen", "");
	gameRoom.setAttribute("msallowfullscreen", "");
	gameRoom.setAttribute("allowfullscreen", "");

	// gameRoom.style.width = "100%";
	// gameRoom.style.height = "1060px";

	gameRoom.style = "overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:1060px;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px";

	// var url = unescape(location.href);
	// var params = "";
	// if(url.indexOf("?") > -1) {
	// 	params = url.substring(url.indexOf("?"), url.length);
	// }

	var deeplink = window.localStorage.getItem("deeplinkQuery") ;
	var params = null;
	if (!!deeplink) {

		params = "?" + deeplink;
		//for safety, deeplink doesn't contain a_l_skey
		if (deeplink.indexOf('a_l_skey') <= 0) {
			params += "&a_l_skey="+window.a_l_skey;
		}
	} else {
		params = "?a_l_skey="+window.a_l_skey;
	}

	clearQueryString();
	gameRoom.src = window.BASE_INFO.landingUrl + "/offcanvas" + params;
	document.body.appendChild(gameRoom);
	$("section").hide();
	if(loginHandler.lastLoginType == "facebook") {
		registerFBListener(gameRoom);
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

function getLastLoginBtnId(lastLoginType) {
	var buttonIdMap = {
		"facebook": "btn_fb",
		"apple": "btn_apple",
		"googleV2": "btn_google",
		"google": "btn_google", // defence code
		"email": "btn_email"
	};

	if (buttonIdMap[lastLoginType]) {
		return buttonIdMap[lastLoginType];
	}
}    

function showLastLoginTag() {
	$(".tag-last-login").css("visibility", "hidden");
	
	var lastLoginType = localStorage.getItem("lastLoginType");

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
	var lastLoginTag = parentDiv.querySelector(".tag-last-login");

	if (lastLoginTag) {
		lastLoginTag.style.visibility = "visible";
	}
}

function registerFBListener(iframe){
	window.addEventListener("message", (event) => {
		if(event && event.data && event.data.id == "FB_login_request_to_OffC_login_page") {
			let permission = event.data.permission;
			let authType = event.data.authType;
			
			if(this.isAllowedDomain(event.origin) == true) {				
				FB.login((response)=>{
					const hasIFrameWindow = iframe && iframe.contentWindow && iframe.contentWindow.postMessage;
					if (!!hasIFrameWindow == true) {
						let stringifiedData = JSON.stringify(response);
						iframe.contentWindow.postMessage({id:"FB_login_response_by_OffC_login_page", responseData: stringifiedData}, event.origin);
					}
				},
				{
					scope: permission,
					auth_type: authType,
				});	
			}
		}
	})
}

function isAllowedDomain(origin) {
	try {
	  const url = new URL(origin);
	  let hostname = url.hostname;
  
	  if (hostname.startsWith("www.")) {
		hostname = hostname.slice(4);
	  }
  
	  return _CONFIG_.loginProxyDomain.includes(hostname);
	} catch (e) {
	  return false;
	}
  }

function showLoadingIndicator() {
	const indicator = document.getElementById("loadingIndicator");
	indicator.hidden = false;
}

function hideLoadingIndicator() {
	const indicator = document.getElementById("loadingIndicator");
	indicator.hidden = true;
}