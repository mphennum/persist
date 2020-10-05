'use strict';

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

var KEYPREFIX = 'P:';
var persist = {};
var localStorage; // pointer to window.localStorage when available

var storage = {}; // internal storage for quick access + fallback

var timers = {};
var listeners = {}; // init

var init = function init() {
  try {
    localStorage = window.localStorage; // throws error if localStorage / cookies disabled

    var now = Date.now();

    for (var key in localStorage) {
      if (!key.startsWith(KEYPREFIX)) {
        continue;
      }

      var val = JSON.parse(localStorage.getItem(key));

      if (!val || val.exp && now > val.exp) {
        localStorage.removeItem(key);
        continue;
      }

      key = key.substr(KEYPREFIX.length);
      storage[key] = val;
      setExpTimeout(key, val);
    }
  } catch (error) {// do nothing
  }
}; // helpers


var setExpTimeout = function setExpTimeout(key, val) {
  if (!val.exp) {
    return;
  }

  clearTimeout(timers[key]);
  timers[key] = setTimeout(function () {
    var _storage$key;

    var exp = (_storage$key = storage[key]) === null || _storage$key === void 0 ? void 0 : _storage$key.exp;

    if (!exp || Date.now() < exp) {
      return;
    }

    persist.del(key);
  }, val.exp - Date.now() + 9);
}; // set


persist.set = function (key, data, ttl) {
  if (ttl === void 0) {
    ttl = null;
  }

  // console.log('persist set', key, data, ttl);
  var ts = Date.now();
  var val = {
    ts: ts,
    data: data,
    exp: ttl ? ts + ttl * 1000 : null
  };
  storage[key] = val;

  try {
    var _localStorage;

    (_localStorage = localStorage) === null || _localStorage === void 0 ? void 0 : _localStorage.setItem(KEYPREFIX + key, JSON.stringify(val)); // throws error when localStorage is full
  } catch (error) {// do nothing
  }

  for (var _iterator = _createForOfIteratorHelperLoose(listeners[key] || []), _step; !(_step = _iterator()).done;) {
    var cb = _step.value;
    cb(key, data);
  }
}; // get


persist.get = function (key) {
  var _storage$key$data, _storage$key2;

  return (_storage$key$data = (_storage$key2 = storage[key]) === null || _storage$key2 === void 0 ? void 0 : _storage$key2.data) !== null && _storage$key$data !== void 0 ? _storage$key$data : null;
}; // del


persist.del = function (key) {
  var _localStorage2;

  // console.log('persist del', key);
  delete storage[key];
  (_localStorage2 = localStorage) === null || _localStorage2 === void 0 ? void 0 : _localStorage2.removeItem(KEYPREFIX + key);

  for (var _iterator2 = _createForOfIteratorHelperLoose(listeners[key] || []), _step2; !(_step2 = _iterator2()).done;) {
    var cb = _step2.value;
    cb(key, null);
  }
}; // clear


persist.clear = function () {
  for (var key in storage) {
    persist.del(key);
  }
}; // on / listen


persist.on = function (key, cb) {
  if (!listeners[key]) {
    listeners[key] = [];
  }

  listeners[key].push(cb);
}; // off / unlisten


persist.off = function (key, cb) {
  for (var i = 0, cbs = listeners[key] || []; i < cbs.length; i++) {
    if (cbs[i] === cb) {
      cbs.splice(i, 1);
      break;
    }
  }
}; // tab data sharing


window.addEventListener('storage', function (_ref) {
  var key = _ref.key,
      val = _ref.newValue;

  // console.log('persist event listener', key, val);
  if (!key.startsWith(KEYPREFIX)) {
    return;
  }

  key = key.substr(KEYPREFIX.length);
  val = JSON.parse(val);

  if (val) {
    var _storage$key3;

    if (((_storage$key3 = storage[key]) === null || _storage$key3 === void 0 ? void 0 : _storage$key3.ts) === val.ts) {
      return;
    }

    storage[key] = val;
  } else {
    if (!storage[key]) {
      return;
    }

    delete storage[key];
    val = {
      data: null
    };
  }

  for (var _iterator3 = _createForOfIteratorHelperLoose(listeners[key] || []), _step3; !(_step3 = _iterator3()).done;) {
    var cb = _step3.value;
    cb(key, val.data);
  }
}); // init + export

init();

module.exports = persist;
