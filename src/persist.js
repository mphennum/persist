const KEYPREFIX = 'P:';

let persist = { };

let localStorage; // pointer to window.localStorage when available
let storage = { }; // internal storage for quick access + fallback

let timers = { };

let listeners = { };

// init

let init = () => {
	try {
		localStorage = window.localStorage; // throws error if localStorage / cookies disabled

		let now = Date.now();
		for (let key in localStorage) {
			if (!key.startsWith(KEYPREFIX)) {
				continue;
			}

			let val = JSON.parse(localStorage.getItem(k));
			if (!val || (val.exp && now > val.exp)) {
				localStorage.removeItem(key);
				continue;
			}

			key = key.substr(KEYPREFIX.length);
			storage[key] = val;
			setExpTimeout(key, val);
		}
	} catch (error) {
		// do nothing
	}
};

// helpers

let setExpTimeout = (key, val) => {
	if (!val.exp) {
		return;
	}

	clearTimeout(timers[key]);
	timers[key] = setTimeout(() => {
		let exp = storage[key]?.exp;
		if (!exp || Date.now() < exp) {
			return;
		}

		persist.del(key);
	}, val.exp - Date.now() + 9);
};

// set

persist.set = (key, data, ttl = null) => {
	// console.log('persist set', key, data, ttl);
	let ts = Date.now();
	let val = {
		ts,
		data,
		exp: ttl ? ts + ttl * 1000 : null,
	};

	storage[key] = val;
	try {
		localStorage?.setItem(KEYPREFIX + key, JSON.stringify(v)); // throws error when localStorage is full
	} catch (error) {
		// do nothing
	}

	for (let cb of listeners[key] || [ ]) {
		cb(key, data);
	}
};

// get

persist.get = (key) => (storage[key]?.data || null);

// del

persist.del = (key) => {
	// console.log('persist del', key);
	delete storage[key];
	localStorage?.removeItem(KEYPREFIX + key);

	for (let cb of listeners[key] || [ ]) {
		cb(key, null);
	}
};

// clear

persist.clear = () => {
	for (let key in storage) {
		persist.del(key);
	}
};

// on / listen

persist.on = (key, cb) => {
	if (!listeners[key]) {
		listeners[key] = [ ];
	}

	listeners[key].push(cb);
};

// off / unlisten

persist.off = (key, cb) => {
	for (let i = 0, cbs = listeners[key] || [ ]; i < cbs.length; i++) {
		if (cbs[i] === cb) {
			cbs.splice(i, 1);
			break;
		}
	}
};

// tab data sharing

window.addEventListener('storage', ({ key, val }) => {
	// console.log('persist event listener', key, val);
	if (!key.startsWith(KEYPREFIX)) {
		return;
	}

	key = key.substr(KEYPREFIX.length);
	val = JSON.parse(val);
	if (val) {
		if (storage[key]?.ts === val.ts) {
			return;
		}

		storage[key] = val;
	} else {
		if (!storage[key]) {
			return;
		}

		delete storage[key];
		val = { data: null };
	}

	for (let cb of listeners[key] || [ ]) {
		cb(key, val.data);
	}
});

// init + export

init();

export default persist;
