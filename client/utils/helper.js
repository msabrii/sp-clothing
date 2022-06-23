export const unique = (array, property) => {
	const compare = typeof property === 'function' ? property : (left, right) => left[property] == right[property];

	const newArray = [];

	array.forEach((right) => {
		const run = (left) => compare.call(this, left, right);
		var i = newArray.findIndex(run);
		if (i === -1) newArray.push(right);
	});

	return newArray;
};

export const isObject = (val) => {
	return val instanceof Object;
};

export const isEmpty = (obj) => {
	return Object.keys(obj).length === 0;
};

export const setCookie = (cookieName, cookieValue, days) => {
	const d = new Date();
	d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
	let expires = 'expires=' + d.toUTCString();
	document.cookie = cookieName + '=' + cookieValue + ';' + expires + ';path=/';
};

export const getCookie = (cookieName) => {
	let name = cookieName + '=';
	let decodedCookie = decodeURIComponent(document.cookie);

	let cookieArray = decodedCookie.split(';');

	for (let i = 0; i < cookieArray.length; i++) {
		let cookie = cookieArray[i];
		while (cookie.charAt(0) == ' ') {
			cookie = cookie.substring(1);
		}
		if (cookie.indexOf(name) == 0) {
			return cookie.substring(name.length, cookie.length);
		}
	}
	return undefined;
};

export const getVisitorId = () => {
	var decodedCookie = decodeURIComponent(document.cookie);
	var cookieArray = decodedCookie.split(';');
	var finalVisId = '';

	for (var i = 0; i < cookieArray.length; i++) {
		var cookieStr = cookieArray[i];

		if (cookieStr.indexOf('visitor_id') > -1 && cookieStr.indexOf('hash') == -1) {
			var cookieParts = cookieStr.split('=');
			finalVisId = cookieParts[1];
		}
	}
	return finalVisId;
};
export const getFormData = (object) => {
	const formData = new FormData();
	Object.keys(object).forEach((key) => formData.append(key, object[key]));
	return formData;
};

export const EventBus = {
	on(event, callback) {
		document.addEventListener(event, (e) => callback(e.detail));
	},
	dispatch(event, data) {
		document.dispatchEvent(new CustomEvent(event, { detail: data }));
	},
	remove(event, callback) {
		document.removeEventListener(event, callback);
	}
};
