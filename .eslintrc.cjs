/* eslint-disable no-undef */
module.exports = {
	"env": {
		"node": true,
		"browser": false,
		"es2021": true,
	},
	"globals": {},
	"extends": "eslint:recommended",
	"overrides": [{
		"env": {
			"node": true,
			"browser": true,
		},
		"files": [
			".eslintrc.{js,cjs}"
		],
		"parserOptions": {
			"sourceType": "script"
		}
	}],
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"rules": {
		"no-prototype-builtins": "off",
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1,
			},
		],
		//"array-bracket-newline": ["error", { "multiline": true, "minItems": 3 }],
		//"array-element-newline": ["error", { "multiline": true }]
		"array-element-newline": ["error", "consistent"]
	}
};
