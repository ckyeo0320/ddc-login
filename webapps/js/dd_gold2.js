var ddGoldDomain = "http://goldshop.dev.doubledowncasino2.com";

var SEND_URL = {
	STOCK: '/stock/pack/default',
	PAYMENT_PREPARE: '/payment/prepare',
	PAYMENT_STATUS: '/payment/status/',
	PAYMENT_ERROR: '/payment/error',
}

var STATUS = {
	CHARGED: "charged",
	REFUND: "refund",
	PENDING: "pending"
}

function getSendURL() {
	return SEND_URL;
}

function getStatus() {
	return STATUS;
}

var pollID = 0;
var paySystemPopupOpen = false;
var popup = undefined;

function initEnv() {
	var host = document.location.host;
	var env = host.split(".")[0];

	switch (env) {
		case "dev":
			ddGoldDomain = "//goldshop.dev.doubledowncasino2.com";
			break;
		case "v2":
			ddGoldDomain = "//goldshop.dev.doubledowncasino2.com";
			break;
		case "duc":
			ddGoldDomain = "//goldshop.dev.doubledowncasino2.com";
			break;
		case "qa":
			ddGoldDomain = "//goldshop.qa.doubledowncasino2.com";
			break;
		case "slot":
			ddGoldDomain = "//goldshop.qa.doubledowncasino2.com";
			break;
		default:
			ddGoldDomain = "//goldshop.doubledowncasino2.com";
			break;
	}
}

function ajax(method, url, data) {
	var _this = this;

	return new Promise(function (success, error) {
		var request = null;

		if (window.XMLHttpRequest != null) {
			request = new XMLHttpRequest();
		} else {
			request = new ActiveXObject("Microsoft.XMLHTTP");
		}

		request.onreadystatechange = function () {
			if (request.readyState !== XMLHttpRequest.DONE) {
				return;
			}

			var response = request.responseText;

			try {
				response = JSON.parse(response);
			} catch (e) {

			}

			if (request.status < 200 || request.status >= 300) {
				return error(response, request);
			}
			return success(response, request);
		};

		request.open(method, ddGoldDomain + url);
		var headers = [['Accept', 'application/json'], ['Content-Type', 'application/json']];
		headers.forEach(function (h) {
			request.setRequestHeader(h[0], h[1]);
		});

		if (data != undefined) {
			request.send(JSON.stringify(data));
		} else {
			request.send();
		}
	});
}

function serialize(obj) {
	if (obj == null) {
		return null;
	}

	var str = [];
	for (var p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	return str.join("&");
}

function getStock() {
	return ajax('GET', getSendURL().STOCK);
}

function prepare(params) {
	return ajax('POST', getSendURL().PAYMENT_PREPARE, params).then(function (jsonResult) {
		if (jsonResult) {
			if (jsonResult.paypalUrl) {
				openPaypal(jsonResult, params.processor);
			} else if (jsonResult.xsollaToken) {
				openXsolla(jsonResult, params.processor);
			}
		}
	}, function(reason) {
		paySystemPopupOpen = false;
		popup = undefined;

		if(reason.message == "RECEIVER_EMAIL_NOT_VALID"){
			var dimmerTop = document.getElementById("dimmed_overlay_top");
			dimmerTop.children.dimmed_overlay_message.innerText = 'Purchase failed...\n\nPlease check the email address for errors.\n';

			var link = document.createElement('a');
			link.innerHTML = 'Click to continue.';
			link.href = "#";
			link.style = "font-size: 20px; color: blue;";
			dimmerTop.children.dimmed_overlay_message.appendChild(link);
		}
	});
}

function paymentError(orderUuid, processor, errorMsg) {
	var params = {
		orderUuid: orderUuid,
		reason: errorMsg,
		processor: processor,
		email: isGiftPopup() == false ? emailInput.val() : giftEmailInput.val()
	};

	ajax("POST", getSendURL().PAYMENT_ERROR, params);
}

function startPoll(checkUrl, orderUuid, processor) {
	removePoll();

	pollID = setInterval(function () {
		status(checkUrl, orderUuid, processor);
	}, 2000);
}

function removePoll() {
	clearInterval(pollID);
}

function status(checkUrl, orderUuid, processor) {
	var _this = this;
	ajax("GET", checkUrl).then(function (jsonData) {
		if (jsonData.status == getStatus().CHARGED) {
			removePoll();
			_this.ClosePopup(jsonData.paymentData, true);
			// 완료 페이지 띄우기
		} else if (jsonData.status == getStatus().REFUND) {
			removePoll();
		} else if (jsonData.status == getStatus().PENDING) {

		} else {
			removePoll();
			paymentError(orderUuid, processor, "undefined state");
		}
	}, function (status) {
		removePoll();
		paymentError(orderUuid, processor, status.error);
	});
}

function isPopupClosed() {
	var closed = false;

	if ((popup && popup.closed == true) || paySystemPopupOpen == false) {
		closed = true;
	}

	return closed
}

function openPaypal(jsonResult, processor) {
	popup = window.open('', '', 'toolbar=no,menubar=no,width=1024,height=768,scrollbars=yes');

	if (popup != null) {
		popup.document.write("<span style='font-size:15pt;font-weight:600;font-family:Arial;'>Connecting to PayPal . . .</span>");
		popup.location = jsonResult.paypalUrl;

		startPoll(jsonResult.statusCheckUrl, jsonResult.orderUuid, processor);
	} else {
		paySystemPopupOpen = false;
	}
}

function openXsolla(jsonResult, processor) {
	// check token sandbox state
	var sandbox = false;

	if (jsonResult.sandbox) {
		sandbox = jsonResult.sandbox;
	}

	var options = {
		access_token: jsonResult.xsollaToken,
		lightbox: {
			width: "650px",
			height: "800px",
			closeByClick: false,
			closeByKeyboard: false,
		},
		sandbox: sandbox,
		iframeOnly: true,
	};

	if (window.XPayStationWidget == undefined) {
		let script = document.createElement('script');
		script.type = "text/javascript";
		script.async = true;
		script.src = "//cdn.xsolla.net/embed/paystation/1.2.8/widget.min.js";
		script.addEventListener('load', function (e) {
			XPayStationWidget.init(options);
			XPayStationWidget.open();

			XPayStationWidget.on("close", function () {
				paySystemPopupOpen = false;
			})
			startPoll(jsonResult.statusCheckUrl, jsonResult.orderUuid, processor);
		}, false);
		let head = document.getElementsByTagName('head')[0];
		head.appendChild(script);
	} else {
		XPayStationWidget.init(options);
		XPayStationWidget.open();
		startPoll(jsonResult.statusCheckUrl, jsonResult.orderUuid, processor);
	}
}
