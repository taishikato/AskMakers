"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};
//# sourceMappingURL=asyncForEach.js.map