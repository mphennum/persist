# persist

LocalStorage with built in expiration times, listeners, and fallbacks. Automatically shared accross tabs.

## content

- [install](#install)
- [usage](#usage)
- [methods](#methods)

* * *

## install

### npm

```bash
$ npm install @mphennum/persist
```

### browser

```html
<script src="/path/to/dist/persist.js"></script>
```

* * *

## usage

### node

```js
import persist from '@mphennum/persist';
let key = 'feanor';
persist.set(key, 14);
let data = persist.get(key);
console.log(data); // 14
```

### browser

```js
var persist = window.persist;
var key = 'feanor';
persist.set(key, 14);
var data = persist.get(key);
console.log(data); // 14
```

* * *

## methods

### set

Store data identified by a key for a specified period of time.

- params
	- key: `String` - unique identifier
		- required
	- data: any type - stored data
		- required
	- ttl: `Number` - time to live (seconds)
		- optional
		- default: `null` - never expires

```js
persist.set('feanor', 14, null); // never expires
persist.set('feanor', { tengwar: 8 }, 3600); // expires in 1 hour
```

### get

Retrieve previously stored data by key. Returns null when no data is found with specified key.

- params
	- key: `String` - unique identifier
- returns
	- data: any type - stored data

```js
var data = persist.get('feanor');
```

### del

Deletes data stored by key.

- params
	- key: `String` - unique identifier

```js
persist.del('feanor');
```

### clear

Deletes all stored data.

```js
persist.clear();
```

### on

Adds an event listener for data changes key.

```js
function listener(key, data) {
	// handle data change or deletion
}

persist.on('feanor', listener);
```

### off

Removes an event listener by key.

```js
function listener(key, data) {
	// handle data change or deletion
}

persist.off('feanor', listener);
```
