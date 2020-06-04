"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const isPluralized = (json) => Object.keys(json).every(key => constants_1.PLURALIZATION_KEYS.includes(key));
exports.extractInterpolations = (str) => {
    const interpolations = [];
    while (true) {
        const matches = str.match(constants_1.INTERPOLATION_PATTERN);
        if (!matches) {
            break;
        }
        interpolations.push(matches[1]);
        str = str.replace(constants_1.INTERPOLATION_PATTERN, '');
    }
    return interpolations;
};
exports.flattenKeys = (json, prefix = undefined, result = []) => {
    Object.keys(json).forEach(key => {
        const flatKey = prefix ? `${prefix}.${key}` : key;
        const value = json[key];
        if (typeof value === 'object') {
            if (isPluralized(value)) {
                let interpolations = ['count'];
                const values = [];
                Object.keys(value).map(key => {
                    const pluralValue = value[key];
                    interpolations = interpolations.concat(exports.extractInterpolations(pluralValue));
                    values.push(pluralValue);
                });
                result.push({ key: flatKey, value: values, interpolations });
            }
            else {
                exports.flattenKeys(value, flatKey, result);
            }
        }
        else {
            const interpolations = exports.extractInterpolations(value);
            result.push({ key: flatKey, value, interpolations });
        }
    });
    return result;
};
//# sourceMappingURL=parser.js.map