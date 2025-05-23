function sendMessage(url, data, method) {
    //default post
    if (!method) {
        method = 'post'
    }

    switch(method) {
        case 'get' :
            return sendMessageByGetMethod(url, data);
            break;
        case 'post' :
            return sendMessageByPostMethod(url, data);
            break;        
        }
}
function sendMessageByPostMethod(url, data) {
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

function sendMessageByGetMethod(url, data) {
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

        request.open("GET", url + formatQuery(data));

        var headers = [['Accept', 'application/json'], ['Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8']];
        headers.forEach(function (h) {
            request.setRequestHeader(h[0], h[1]);
        });

        request.send();        
    });
}

function formatQuery(query) {
    var items = [];
    for (var key in query) {
        var values = Array.isArray(query[key]) ? query[key] : [query[key]];
        values.forEach(function (value) {
            value = typeof value === 'undefined' ? '' : value.toString();
            items.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        });
    }
    return items.length ? '?' + items.join('&') : '';
}			
