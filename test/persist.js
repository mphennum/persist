import { expect } from 'chai';
import persist from '../src/persist';

describe('persist', function() {

	describe('#set()', function() {

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

});
