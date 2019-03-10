'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const data_1 = require("./data");
const readState_1 = require("./readState");
const field_1 = require("./field");
class Type {
    constructor(type) {
        this.TYPE = {
            UINT: 'uint',
            INT: 'int',
            FLOAT: 'float',
            BIGINT: 'bigint',
            STRING: 'string',
            BUFFER: 'Buffer',
            BOOLEAN: 'boolean',
            JSON: 'json',
            OID: 'oid',
            REGEX: 'regex',
            DATE: 'date',
            ARRAY: '[array]',
            OBJECT: '{object}'
        };
        this.subType = {};
        this.fields = [];
        if (typeof type === 'string') {
            if (type in this.TYPE && type !== this.TYPE.ARRAY && type !== this.TYPE.OBJECT) {
                throw new TypeError('Unknown basic type: ' + type);
            }
            this.type = type;
        }
        else if (Array.isArray(type)) {
            if (type.length !== 1) {
                throw new TypeError('Invalid array type, it must have exactly one element');
            }
            this.type = this.TYPE.ARRAY;
            this.subType = new Type(type[0]);
        }
        else {
            if (!type || typeof type !== 'object') {
                throw new TypeError('Invalid type: ' + type);
            }
            this.type = this.TYPE.OBJECT;
            this.fields = Object.keys(type).map((name) => {
                return new field_1.Field(name, type[name]);
            });
        }
    }
    encode(value) {
        const data = new data_1.Data();
        this.write(value, data, '');
        return data.toBuffer();
    }
    decode(buffer) {
        return this.read(new readState_1.ReadState(buffer));
    }
    write(value, data, path) {
        let i, field, subpath, subValue, len;
        if (this.type === this.TYPE.ARRAY) {
            // Array field
            return this.writeArray(value, data, path, this.subType);
        }
        else if (this.type !== this.TYPE.OBJECT) {
            // Simple type
            return types_1.types[this.type].write(value, data, path);
        }
        // Check for object type
        if (!value || typeof value !== 'object') {
            throw new TypeError('Expected an object at ' + path);
        }
        // Write each field
        for (i = 0, len = this.fields.length; i < len; i++) {
            field = this.fields[i];
            subpath = path ? path + '.' + field.name : field.name;
            subValue = value[field.name];
            if (field.optional) {
                // Add 'presence' flag
                if (subValue === undefined || subValue === null) {
                    types_1.types.boolean.write(false, data);
                    continue;
                }
                else {
                    types_1.types.boolean.write(true, data);
                }
            }
            if (!field.array) {
                // Scalar field
                field.type.write(subValue, data, subpath);
                continue;
            }
            // Array field
            this.writeArray(subValue, data, subpath, field.type);
        }
    }
    writeArray(value, data, path, type) {
        let i, len;
        if (!Array.isArray(value)) {
            throw new TypeError('Expected an Array at ' + path);
        }
        len = value.length;
        types_1.types.uint.write(len, data);
        for (i = 0; i < len; i++) {
            type.write(value[i], data, path + '.' + i);
        }
    }
    read(state) {
        this.read = this.compileRead();
        return this.read(state);
    }
    getHash() {
        const hash = new data_1.Data();
        this.hashType(hash, this, false, false);
        return hash.toBuffer();
    }
    hashType(hash, type, array, optional) {
        // Write type (first char + flags)
        // AOxx xxxx
        hash.writeUInt8((type.type.charCodeAt(0) & 0x3f) | (array ? 0x80 : 0) | (optional ? 0x40 : 0));
        if (type.type === this.TYPE.ARRAY) {
            this.hashType(hash, type.subType, false, false);
        }
        else if (type.type === this.TYPE.OBJECT) {
            types_1.types.uint.write(type.fields.length, hash);
            type.fields.forEach((field) => {
                this.hashType(hash, field.type, field.array, field.optional);
            });
        }
    }
    compileRead() {
        if (this.type !== this.TYPE.OBJECT && this.type !== this.TYPE.ARRAY) {
            // Scalar type
            // In this case, there is no need to write custom code
            return types_1.types[this.type].read;
        }
        else if (this.type === this.TYPE.ARRAY) {
            return this.readArray.bind(this, this.subType);
        }
        // As an example, compiling code to new Type({a:'int', 'b?':['string']}) will result in:
        // return {
        //     a: this.fields[0].type.read(state),
        //     b: this.Types.boolean.read(state) ? this._readArray(state, this.fields[1].type) : undefined
        // }
        const code = 'return {' + this.fields.map((field, i) => {
            const name = JSON.stringify(field.name), fieldStr = 'this.fields[' + i + ']';
            let readCode, code;
            if (field.array) {
                readCode = 'this.readArray(' + fieldStr + '.type, state)';
            }
            else {
                readCode = fieldStr + '.type.read(state)';
            }
            if (!field.optional) {
                code = name + ': ' + readCode;
            }
            else {
                code = name + ': this.Types.boolean.read(state) ? ' + readCode + ' : undefined';
            }
            return code;
        }).join(',') + '}';
        // tslint:disable-next-line:function-constructor
        return new Function('state', code);
    }
    readArray(type, state) {
        const arr = new Array(types_1.types.uint.read(state));
        let j;
        for (j = 0; j < arr.length; j++) {
            arr[j] = type.read(state);
        }
        return arr;
    }
}
exports.Type = Type;
