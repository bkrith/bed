'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("./type");
class Field {
    constructor(name, type) {
        this.optional = false;
        if (name[name.length - 1] === '?') {
            this.optional = true;
            name = name.substr(0, name.length - 1);
        }
        this.name = name;
        this.array = Array.isArray(type);
        if (Array.isArray(type) && type.length !== 1) {
            throw new TypeError('Invalid array type, it must have exactly one element');
        }
        if (Array.isArray(type))
            type = type[0];
        this.type = new type_1.Type(type);
    }
}
exports.Field = Field;
