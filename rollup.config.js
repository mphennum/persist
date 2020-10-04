import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
	input: 'src/persist.js',
	output: [
		{
			file: 'dist/index.js',
			format: 'cjs',
			exports: 'auto',
		},
		{
			file: 'dist/persist.js',
			format: 'iife',
			name: 'persist',
			compact: true,
			plugins: [
				terser(),
			],
		},
	],
	plugins: [
		babel({ babelHelpers: 'bundled' }),
	],
};
