//<![CDATA[
var uStatus = {};
var apihost = null;
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function getParameter(param) {
    var returnValue;
    var url = location.href;
    var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');
    for (var i = 0; i < parameters.length; i++) {
        var varName = parameters[i].split('=')[0];
        if (varName.toUpperCase() == param.toUpperCase()) {
            returnValue = parameters[i].split('=')[1];
            return decodeURIComponent(returnValue);
        }
    }
};
function locate(obj) {
}
function login(jwt, obj) {
	try {
		console.log("login");
		uStatus.t = jwt;
		apihost = obj.apihost;
		if(apihost == null && apis.length == 1) {
			// temporary
			apihost = apis[0];
		}
		uStatus.login = true;
		window.beforeunload = function(){
			// page out
			logout(uStatus.t);
		};
		window.unload = function(){
			// reload
			logout(uStatus.t);
		};
		lobbyIn(jwt, obj);
	} catch(e) {console.error(e);}
}

function loginV2(jwt, obj) {
	try {
		console.log("login");
		uStatus.t = jwt;
		apihost = obj.apihost;
		if(apihost == null && apis.length == 1) {
			// temporary
			apihost = apis[0];
		}
		uStatus.login = true;
		window.beforeunload = function(){
			// page out
			logout(uStatus.t);
		};
		window.unload = function(){
			// reload
			logout(uStatus.t);
		};
		window.addEventListener("beforeunload", function (e) { 
			logout(uStatus.t); 
		});
		window.addEventListener("unload", function (e) { 
			logout(uStatus.t); 
		});
	} catch(e) {console.error(e);}
}

function logout() {
	try {
		if(uStatus.login) {
			uStatus.login = false;
			console.log("logout");
			url = apihost + "/u/logout.json?j="+uStatus.t;
			if(url.indexOf('http') == -1) {
				url = location.protocol + "//" + url;
			}
			var ii = new Image();
			ii.src = url;
		}
	} catch(e) {console.error(e);}
}

function lobbyIn(jwt, obj) {
	try {
		uStatus.t = jwt;
		console.log("lobbyIn");
		uStatus.prevLoc = uStatus.lastLoc;
		uStatus.lastLoc = 'lobby';
		if(uStatus.prevLoc != uStatus.lastLoc) {
			// from game or first lobby in
			ajax('POST', apihost + "/lb/in.json", null, null);
		}
	} catch(e) {console.error(e);}
}

function lobbyOut(jwt, obj) {
	try {
		uStatus.t = jwt;
		console.log("lobbyOut");
	} catch(e) {console.error(e);}
}

function gameIn(jwt, obj) {
	try {
		uStatus.t = jwt;
		console.log(obj.slotId);
		console.log("slotIn");
		uStatus.prevLoc = uStatus.lastLoc; 
		uStatus.lastLoc = 'game';
		// from lobby
		ajax('POST', apihost + "/lb/out.json", null, function(res) {
			if (res.readyState == 4 && res.status == 200) {
				ajax("POST", apihost + "/g/in.json", obj, null);
			}
		});
	} catch(e) {console.error(e);}
}

function gameOut(jwt, obj) {
	try {
		uStatus.t = jwt;
		console.log("slotOut");
		ajax('POST', apihost + "/g/out.json", null, null);
	} catch(e) {console.error(e);}
}

function sfsEvent(obj) {
	try {
		console.log("sfsEvent : " + JSON.stringify(obj));
	} catch(e) {console.error(e);}
}

function ajax(method, url, data, callback) {
	if(url.indexOf('http') == -1) {
		url = location.protocol + "//" + url;
	}
	  var xhttp = null;
	  if (window.XMLHttpRequest) {
		    // code for modern browsers
		  xhttp = new XMLHttpRequest();
		 } else {
		    // code for old IE browsers
			 xhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
	  xhttp.withCredentials = true;
	  xhttp.onreadystatechange = function() {
		if(callback != null)
			callback(this);
	  };
	  if(method == 'GET') {
		  xhttp.open(method, url + '?' + serialize(data), true);
		  if(uStatus.t != null) {
			xhttp.setRequestHeader('authorization', "Bearer " + uStatus.t);
		  }
		  xhttp.send();
	  }
	  else {
		  xhttp.open(method, url, true);
		  if(uStatus.t != null) {
			  xhttp.setRequestHeader('authorization', "Bearer " + uStatus.t);
		  }
		  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
		  xhttp.send(serialize(data));
	  }
}

function serialize(obj) {
	if(obj == null) 
		return null;
	  var str = [];
	  for(var p in obj)
	    if (obj.hasOwnProperty(p)) {
	      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	    }
	  return str.join("&");
	}
//]]>	
