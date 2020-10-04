import { expect } from 'chai';
import persist from '../src/persist';

describe('persist', function() {

	describe('#get() + #set()', function() {

		it('should set strings', function() {
			let key = 'feanor';
			let data = '14';

			persist.set(key, data);
			let result = persist.get(key);

			// console.log({ key, data, result });
			expect(result).to.equal(data);
		});

		it('should set numbers', function() {
			let key = 'feanor';
			let data = 14;

			persist.set(key, data);
			let result = persist.get(key);

			// console.log({ key, data, result });
			expect(result).to.equal(data);
		});

		it('should set arrays', function() {
			let key = 'feanor';
			let data = [ 14 ];

			persist.set(key, [ ...data ]);
			let result = persist.get(key);

			// console.log({ key, data, result });
			expect(result).to.deep.equal(data);
		});

		it('should set objects', function() {
			let key = 'feanor';
			let data = { tengwar: 8 };

			persist.set(key, { ...data });
			let result = persist.get(key);

			// console.log({ key, data, result });
			expect(result).to.deep.equal(data);
		});

		it('should set bools + falsey values', function() {
			let key = 'feanor';
			let data = false;

			persist.set(key, data);
			let result = persist.get(key);

			// console.log({ key, data, result });
			expect(result).to.equal(data);
		});

	});

	describe('#del()', function() {

		it('should remove values by key', function() {
			let key = 'feanor';
			let data = '14';

			persist.set(key, data);
			persist.del(key);
			let result = persist.get(key);

			// console.log({ key, data, result });
			expect(result).to.be.null;
		});

	});

	describe('#clear()', function() {

		it('should remove all values', function() {
			let key = 'feanor';
			let data = '14';

			persist.set(key, data);
			persist.clear();
			let result = persist.get(key);

			// console.log({ key, data, result });
			expect(result).to.be.null;
		});

	});

	describe('#on()', function() {

		it('should listen for data updates', function() {
			let key = 'feanor';
			let data = '14';
			let result;

			persist.on(key, (key, data) => {
				result = data;
			});

			persist.set(key, data);

			// console.log({ key, data, result });
			expect(result).to.equal(data);
		});

	});

	describe('#off()', function() {

		it('should stop listening for data updates', function() {
			let key = 'feanor';
			let data = '14';
			let result;

			let handler = (key, data) => {
				result = data;
			};

			persist.on(key, handler);
			persist.off(key, handler);

			persist.set(key, data);

			// console.log({ key, data, result });
			expect(result).to.be.undefined;
		});

	});

});
