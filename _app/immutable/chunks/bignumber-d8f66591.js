var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { d as derived, w as writable } from "./paths-9d4e3692.js";
import { G as get_store_value } from "./index-64643071.js";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function getAugmentedNamespace(n) {
  if (n.__esModule)
    return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        var args = [null];
        args.push.apply(args, arguments);
        var Ctor = Function.bind.apply(f, args);
        return new Ctor();
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else
    a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var dist$2 = {};
var dist$1 = {};
var Address$1 = {};
const SymbolInspect = Symbol.for("nodejs.util.inspect.custom");
var symbol_inspect = SymbolInspect;
var crc16$2 = {};
Object.defineProperty(crc16$2, "__esModule", { value: true });
crc16$2.crc16 = void 0;
function crc16$1(data2) {
  const poly = 4129;
  let reg = 0;
  const message2 = Buffer.alloc(data2.length + 2);
  message2.set(data2);
  for (let byte of message2) {
    let mask = 128;
    while (mask > 0) {
      reg <<= 1;
      if (byte & mask) {
        reg += 1;
      }
      mask >>= 1;
      if (reg > 65535) {
        reg &= 65535;
        reg ^= poly;
      }
    }
  }
  return Buffer.from([Math.floor(reg / 256), reg % 256]);
}
crc16$2.crc16 = crc16$1;
var __importDefault$9 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
var _a$2;
Object.defineProperty(Address$1, "__esModule", { value: true });
Address$1.Address = void 0;
const symbol_inspect_1$2 = __importDefault$9(symbol_inspect);
const crc16_1$1 = crc16$2;
const bounceable_tag = 17;
const non_bounceable_tag = 81;
const test_flag = 128;
function parseFriendlyAddress(src2) {
  const data2 = Buffer.isBuffer(src2) ? src2 : Buffer.from(src2, "base64");
  if (data2.length !== 36) {
    throw new Error("Unknown address type: byte length is not equal to 36");
  }
  const addr = data2.subarray(0, 34);
  const crc = data2.subarray(34, 36);
  const calcedCrc = (0, crc16_1$1.crc16)(addr);
  if (!(calcedCrc[0] === crc[0] && calcedCrc[1] === crc[1])) {
    throw new Error("Invalid checksum: " + src2);
  }
  let tag = addr[0];
  let isTestOnly = false;
  let isBounceable = false;
  if (tag & test_flag) {
    isTestOnly = true;
    tag = tag ^ test_flag;
  }
  if (tag !== bounceable_tag && tag !== non_bounceable_tag)
    throw "Unknown address tag";
  isBounceable = tag === bounceable_tag;
  let workchain = null;
  if (addr[1] === 255) {
    workchain = -1;
  } else {
    workchain = addr[1];
  }
  const hashPart = addr.subarray(2, 34);
  return { isTestOnly, isBounceable, workchain, hashPart };
}
class Address {
  static isAddress(src2) {
    return src2 instanceof Address;
  }
  static isFriendly(source) {
    return source.indexOf(":") < 0;
  }
  static normalize(source) {
    if (typeof source === "string") {
      return Address.parse(source).toString();
    } else {
      return source.toString();
    }
  }
  static parse(source) {
    if (Address.isFriendly(source)) {
      return this.parseFriendly(source).address;
    } else {
      return this.parseRaw(source);
    }
  }
  static parseRaw(source) {
    let workChain = parseInt(source.split(":")[0]);
    let hash = Buffer.from(source.split(":")[1], "hex");
    return new Address(workChain, hash);
  }
  static parseFriendly(source) {
    if (Buffer.isBuffer(source)) {
      let r = parseFriendlyAddress(source);
      return {
        isBounceable: r.isBounceable,
        isTestOnly: r.isTestOnly,
        address: new Address(r.workchain, r.hashPart)
      };
    } else {
      let addr = source.replace(/\-/g, "+").replace(/_/g, "/");
      let r = parseFriendlyAddress(addr);
      return {
        isBounceable: r.isBounceable,
        isTestOnly: r.isTestOnly,
        address: new Address(r.workchain, r.hashPart)
      };
    }
  }
  constructor(workChain, hash) {
    this.toRawString = () => {
      return this.workChain + ":" + this.hash.toString("hex");
    };
    this.toRaw = () => {
      const addressWithChecksum = Buffer.alloc(36);
      addressWithChecksum.set(this.hash);
      addressWithChecksum.set([this.workChain, this.workChain, this.workChain, this.workChain], 32);
      return addressWithChecksum;
    };
    this.toStringBuffer = (args) => {
      let testOnly = args && args.testOnly !== void 0 ? args.testOnly : false;
      let bounceable = args && args.bounceable !== void 0 ? args.bounceable : true;
      let tag = bounceable ? bounceable_tag : non_bounceable_tag;
      if (testOnly) {
        tag |= test_flag;
      }
      const addr = Buffer.alloc(34);
      addr[0] = tag;
      addr[1] = this.workChain;
      addr.set(this.hash, 2);
      const addressWithChecksum = Buffer.alloc(36);
      addressWithChecksum.set(addr);
      addressWithChecksum.set((0, crc16_1$1.crc16)(addr), 34);
      return addressWithChecksum;
    };
    this.toString = (args) => {
      let urlSafe = args && args.urlSafe !== void 0 ? args.urlSafe : true;
      let buffer = this.toStringBuffer(args);
      if (urlSafe) {
        return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_");
      } else {
        return buffer.toString("base64");
      }
    };
    this[_a$2] = () => this.toString();
    this.workChain = workChain;
    this.hash = hash;
    Object.freeze(this);
  }
  equals(src2) {
    if (src2.workChain !== this.workChain) {
      return false;
    }
    return src2.hash.equals(this.hash);
  }
}
Address$1.Address = Address;
_a$2 = symbol_inspect_1$2.default;
var ExternalAddress$1 = {};
var __importDefault$8 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
var _a$1;
Object.defineProperty(ExternalAddress$1, "__esModule", { value: true });
ExternalAddress$1.ExternalAddress = void 0;
const symbol_inspect_1$1 = __importDefault$8(symbol_inspect);
class ExternalAddress {
  static isAddress(src2) {
    return src2 instanceof ExternalAddress;
  }
  constructor(value, bits) {
    this[_a$1] = () => this.toString();
    this.value = value;
    this.bits = bits;
  }
  toString() {
    return `External<${this.bits}:${this.value}>`;
  }
}
ExternalAddress$1.ExternalAddress = ExternalAddress;
_a$1 = symbol_inspect_1$1.default;
var ADNLAddress$1 = {};
var base32 = {};
Object.defineProperty(base32, "__esModule", { value: true });
base32.base32Decode = base32.base32Encode = void 0;
const alphabet = "abcdefghijklmnopqrstuvwxyz234567";
function base32Encode(buffer) {
  const length = buffer.byteLength;
  let bits = 0;
  let value = 0;
  let output = "";
  for (let i = 0; i < length; i++) {
    value = value << 8 | buffer[i];
    bits += 8;
    while (bits >= 5) {
      output += alphabet[value >>> bits - 5 & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += alphabet[value << 5 - bits & 31];
  }
  return output;
}
base32.base32Encode = base32Encode;
function readChar(alphabet2, char) {
  const idx = alphabet2.indexOf(char);
  if (idx === -1) {
    throw new Error("Invalid character found: " + char);
  }
  return idx;
}
function base32Decode(input) {
  let cleanedInput;
  cleanedInput = input.toLowerCase();
  const { length } = cleanedInput;
  let bits = 0;
  let value = 0;
  let index = 0;
  const output = Buffer.alloc(length * 5 / 8 | 0);
  for (let i = 0; i < length; i++) {
    value = value << 5 | readChar(alphabet, cleanedInput[i]);
    bits += 5;
    if (bits >= 8) {
      output[index++] = value >>> bits - 8 & 255;
      bits -= 8;
    }
  }
  return output;
}
base32.base32Decode = base32Decode;
var __importDefault$7 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
var _a;
Object.defineProperty(ADNLAddress$1, "__esModule", { value: true });
ADNLAddress$1.ADNLAddress = void 0;
const symbol_inspect_1 = __importDefault$7(symbol_inspect);
const base32_1 = base32;
const crc16_1 = crc16$2;
class ADNLAddress {
  static parseFriendly(src2) {
    if (src2.length !== 55) {
      throw Error("Invalid address");
    }
    src2 = "f" + src2;
    let decoded = (0, base32_1.base32Decode)(src2);
    if (decoded[0] !== 45) {
      throw Error("Invalid address");
    }
    let gotHash = decoded.slice(33);
    let hash = (0, crc16_1.crc16)(decoded.slice(0, 33));
    if (!hash.equals(gotHash)) {
      throw Error("Invalid address");
    }
    return new ADNLAddress(decoded.slice(1, 33));
  }
  static parseRaw(src2) {
    const data2 = Buffer.from(src2, "base64");
    return new ADNLAddress(data2);
  }
  constructor(address) {
    this.toRaw = () => {
      return this.address.toString("hex").toUpperCase();
    };
    this.toString = () => {
      let data2 = Buffer.concat([Buffer.from([45]), this.address]);
      let hash = (0, crc16_1.crc16)(data2);
      data2 = Buffer.concat([data2, hash]);
      return (0, base32_1.base32Encode)(data2).slice(1);
    };
    this[_a] = () => this.toString();
    if (address.length !== 32) {
      throw Error("Invalid address");
    }
    this.address = address;
  }
  equals(b) {
    return this.address.equals(b.address);
  }
}
ADNLAddress$1.ADNLAddress = ADNLAddress;
_a = symbol_inspect_1.default;
var contractAddress$1 = {};
var Builder = {};
var BitBuilder = {};
var BitString = {};
var paddedBits = {};
var hasRequiredPaddedBits;
function requirePaddedBits() {
  if (hasRequiredPaddedBits)
    return paddedBits;
  hasRequiredPaddedBits = 1;
  Object.defineProperty(paddedBits, "__esModule", { value: true });
  paddedBits.bitsToPaddedBuffer = void 0;
  const BitBuilder_1 = requireBitBuilder();
  function bitsToPaddedBuffer(bits) {
    let builder2 = new BitBuilder_1.BitBuilder(Math.ceil(bits.length / 8) * 8);
    builder2.writeBits(bits);
    let padding = Math.ceil(bits.length / 8) * 8 - bits.length;
    for (let i = 0; i < padding; i++) {
      if (i === 0) {
        builder2.writeBit(1);
      } else {
        builder2.writeBit(0);
      }
    }
    return builder2.buffer();
  }
  paddedBits.bitsToPaddedBuffer = bitsToPaddedBuffer;
  return paddedBits;
}
var hasRequiredBitString;
function requireBitString() {
  if (hasRequiredBitString)
    return BitString;
  hasRequiredBitString = 1;
  var __importDefault2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  var _a2;
  Object.defineProperty(BitString, "__esModule", { value: true });
  BitString.BitString = void 0;
  const paddedBits_12 = requirePaddedBits();
  const symbol_inspect_12 = __importDefault2(symbol_inspect);
  let BitString$1 = class BitString {
    /**
     * Constructing BitString from a buffer
     * @param data data that contains the bitstring data. NOTE: We are expecting this buffer to be NOT modified
     * @param offset offset in bits from the start of the buffer
     * @param length length of the bitstring in bits
     */
    constructor(data2, offset, length) {
      this[_a2] = () => this.toString();
      if (length < 0) {
        throw new Error(`Length ${length} is out of bounds`);
      }
      this._length = length;
      this._data = data2;
      this._offset = offset;
    }
    /**
     * Returns the length of the bitstring
     */
    get length() {
      return this._length;
    }
    /**
     * Returns the bit at the specified index
     * @param index index of the bit
     * @throws Error if index is out of bounds
     * @returns true if the bit is set, false otherwise
     */
    at(index) {
      if (index >= this._length) {
        throw new Error(`Index ${index} > ${this._length} is out of bounds`);
      }
      if (index < 0) {
        throw new Error(`Index ${index} < 0 is out of bounds`);
      }
      let byteIndex = this._offset + index >> 3;
      let bitIndex = 7 - (this._offset + index) % 8;
      return (this._data[byteIndex] & 1 << bitIndex) !== 0;
    }
    /**
     * Get a subscring of the bitstring
     * @param offset
     * @param length
     * @returns
     */
    substring(offset, length) {
      if (length === 0 && offset === this._length) {
        return BitString$1.EMPTY;
      }
      if (offset >= this._length) {
        throw new Error(`Offset(${offset}) > ${this._length} is out of bounds`);
      }
      if (offset < 0) {
        throw new Error(`Offset(${offset}) < 0 is out of bounds`);
      }
      if (offset + length > this._length) {
        throw new Error(`Offset ${offset} + Length ${length} > ${this._length} is out of bounds`);
      }
      return new BitString$1(this._data, this._offset + offset, length);
    }
    /**
     * Try to get a buffer from the bitstring without allocations
     * @param offset offset in bits
     * @param length length in bits
     * @returns buffer if the bitstring is aligned to bytes, null otherwise
     */
    subbuffer(offset, length) {
      if (offset >= this._length) {
        throw new Error(`Offset ${offset} is out of bounds`);
      }
      if (offset < 0) {
        throw new Error(`Offset ${offset} is out of bounds`);
      }
      if (offset + length > this._length) {
        throw new Error(`Offset + Lenght = ${offset + length} is out of bounds`);
      }
      if (length % 8 !== 0) {
        return null;
      }
      if ((this._offset + offset) % 8 !== 0) {
        return null;
      }
      let start = this._offset + offset >> 3;
      let end = start + (length >> 3);
      return this._data.subarray(start, end);
    }
    /**
     * Checks for equality
     * @param b other bitstring
     * @returns true if the bitstrings are equal, false otherwise
     */
    equals(b) {
      if (this._length !== b._length) {
        return false;
      }
      for (let i = 0; i < this._length; i++) {
        if (this.at(i) !== b.at(i)) {
          return false;
        }
      }
      return true;
    }
    /**
     * Format to canonical string
     * @returns formatted bits as a string
     */
    toString() {
      const padded = (0, paddedBits_12.bitsToPaddedBuffer)(this);
      if (this._length % 4 === 0) {
        const s = padded.subarray(0, Math.ceil(this._length / 8)).toString("hex").toUpperCase();
        if (this._length % 8 === 0) {
          return s;
        } else {
          return s.substring(0, s.length - 1);
        }
      } else {
        const hex = padded.toString("hex").toUpperCase();
        if (this._length % 8 <= 4) {
          return hex.substring(0, hex.length - 1) + "_";
        } else {
          return hex + "_";
        }
      }
    }
  };
  BitString.BitString = BitString$1;
  _a2 = symbol_inspect_12.default;
  BitString$1.EMPTY = new BitString$1(Buffer.alloc(0), 0, 0);
  return BitString;
}
var hasRequiredBitBuilder;
function requireBitBuilder() {
  if (hasRequiredBitBuilder)
    return BitBuilder;
  hasRequiredBitBuilder = 1;
  Object.defineProperty(BitBuilder, "__esModule", { value: true });
  BitBuilder.BitBuilder = void 0;
  const Address_12 = Address$1;
  const ExternalAddress_12 = ExternalAddress$1;
  const BitString_12 = requireBitString();
  let BitBuilder$1 = class BitBuilder {
    constructor(size2 = 1023) {
      this._buffer = Buffer.alloc(Math.ceil(size2 / 8));
      this._length = 0;
    }
    /**
     * Current number of bits written
     */
    get length() {
      return this._length;
    }
    /**
     * Write a single bit
     * @param value bit to write, true or positive number for 1, false or zero or negative for 0
     */
    writeBit(value) {
      let n = this._length;
      if (n > this._buffer.length * 8) {
        throw new Error("BitBuilder overflow");
      }
      if (value === true || value > 0) {
        this._buffer[n / 8 | 0] |= 1 << 7 - n % 8;
      }
      this._length++;
    }
    /**
     * Copy bits from BitString
     * @param src source bits
     */
    writeBits(src2) {
      for (let i = 0; i < src2.length; i++) {
        this.writeBit(src2.at(i));
      }
    }
    /**
     * Write bits from buffer
     * @param src source buffer
     */
    writeBuffer(src2) {
      if (this._length % 8 === 0) {
        if (this._length + src2.length * 8 > this._buffer.length * 8) {
          throw new Error("BitBuilder overflow");
        }
        src2.copy(this._buffer, this._length / 8);
        this._length += src2.length * 8;
      } else {
        for (let i = 0; i < src2.length; i++) {
          this.writeUint(src2[i], 8);
        }
      }
    }
    /**
     * Write uint value
     * @param value value as bigint or number
     * @param bits number of bits to write
     */
    writeUint(value, bits) {
      if (bits === 8 && this._length % 8 === 0) {
        let v2 = Number(value);
        if (v2 < 0 || v2 > 255 || !Number.isSafeInteger(v2)) {
          throw Error(`value is out of range for ${bits} bits. Got ${value}`);
        }
        this._buffer[this._length / 8] = Number(value);
        this._length += 8;
        return;
      }
      if (bits === 16 && this._length % 8 === 0) {
        let v2 = Number(value);
        if (v2 < 0 || v2 > 65536 || !Number.isSafeInteger(v2)) {
          throw Error(`value is out of range for ${bits} bits. Got ${value}`);
        }
        this._buffer[this._length / 8] = v2 >> 8;
        this._buffer[this._length / 8 + 1] = v2 & 255;
        this._length += 16;
        return;
      }
      let v = BigInt(value);
      if (bits < 0 || !Number.isSafeInteger(bits)) {
        throw Error(`invalid bit length. Got ${bits}`);
      }
      if (bits === 0) {
        if (value !== 0n) {
          throw Error(`value is not zero for ${bits} bits. Got ${value}`);
        } else {
          return;
        }
      }
      let vBits = 1n << BigInt(bits);
      if (v < 0 || v >= vBits) {
        throw Error(`bitLength is too small for a value ${value}. Got ${bits}`);
      }
      let b = [];
      while (v > 0) {
        b.push(v % 2n === 1n);
        v /= 2n;
      }
      for (let i = 0; i < bits; i++) {
        let off = bits - i - 1;
        if (off < b.length) {
          this.writeBit(b[off]);
        } else {
          this.writeBit(false);
        }
      }
    }
    /**
     * Write int value
     * @param value value as bigint or number
     * @param bits number of bits to write
     */
    writeInt(value, bits) {
      let v = BigInt(value);
      if (bits < 0 || !Number.isSafeInteger(bits)) {
        throw Error(`invalid bit length. Got ${bits}`);
      }
      if (bits === 0) {
        if (value !== 0n) {
          throw Error(`value is not zero for ${bits} bits. Got ${value}`);
        } else {
          return;
        }
      }
      if (bits === 1) {
        if (value !== -1n && value !== 0n) {
          throw Error(`value is not zero or -1 for ${bits} bits. Got ${value}`);
        } else {
          this.writeBit(value === -1n);
          return;
        }
      }
      let vBits = 1n << BigInt(bits) - 1n;
      if (v < -vBits || v >= vBits) {
        throw Error(`value is out of range for ${bits} bits. Got ${value}`);
      }
      if (v < 0) {
        this.writeBit(true);
        v = (1n << BigInt(bits) - 1n) + v;
      } else {
        this.writeBit(false);
      }
      this.writeUint(v, bits - 1);
    }
    /**
     * Wrtie var uint value, used for serializing coins
     * @param value value to write as bigint or number
     * @param bits header bits to write size
     */
    writeVarUint(value, bits) {
      let v = BigInt(value);
      if (bits < 0 || !Number.isSafeInteger(bits)) {
        throw Error(`invalid bit length. Got ${bits}`);
      }
      if (v < 0) {
        throw Error(`value is negative. Got ${value}`);
      }
      if (v === 0n) {
        this.writeUint(0, bits);
        return;
      }
      const sizeBytes = Math.ceil(v.toString(2).length / 8);
      const sizeBits = sizeBytes * 8;
      this.writeUint(sizeBytes, bits);
      this.writeUint(v, sizeBits);
    }
    /**
     * Wrtie var int value, used for serializing coins
     * @param value value to write as bigint or number
     * @param bits header bits to write size
     */
    writeVarInt(value, bits) {
      let v = BigInt(value);
      if (bits < 0 || !Number.isSafeInteger(bits)) {
        throw Error(`invalid bit length. Got ${bits}`);
      }
      if (v === 0n) {
        this.writeUint(0, bits);
        return;
      }
      let v2 = v > 0 ? v : -v;
      const sizeBytes = 1 + Math.ceil(v2.toString(2).length / 8);
      const sizeBits = sizeBytes * 8;
      this.writeUint(sizeBytes, bits);
      this.writeInt(v, sizeBits);
    }
    /**
     * Write coins in var uint format
     * @param amount amount to write
     */
    writeCoins(amount) {
      this.writeVarUint(amount, 4);
    }
    /**
     * Write address
     * @param address write address or address external
     */
    writeAddress(address) {
      if (address === null || address === void 0) {
        this.writeUint(0, 2);
        return;
      }
      if (Address_12.Address.isAddress(address)) {
        this.writeUint(2, 2);
        this.writeUint(0, 1);
        this.writeInt(address.workChain, 8);
        this.writeBuffer(address.hash);
        return;
      }
      if (ExternalAddress_12.ExternalAddress.isAddress(address)) {
        this.writeUint(1, 2);
        this.writeUint(address.bits, 9);
        this.writeUint(address.value, address.bits);
        return;
      }
      throw Error(`Invalid address. Got ${address}`);
    }
    /**
     * Build BitString
     * @returns result bit string
     */
    build() {
      return new BitString_12.BitString(this._buffer, 0, this._length);
    }
    /**
     * Build into Buffer
     * @returns result buffer
     */
    buffer() {
      if (this._length % 8 !== 0) {
        throw new Error("BitBuilder buffer is not byte aligned");
      }
      return this._buffer.subarray(0, this._length / 8);
    }
  };
  BitBuilder.BitBuilder = BitBuilder$1;
  return BitBuilder;
}
var Cell = {};
var CellType = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.CellType = void 0;
  (function(CellType2) {
    CellType2[CellType2["Ordinary"] = -1] = "Ordinary";
    CellType2[CellType2["PrunedBranch"] = 1] = "PrunedBranch";
    CellType2[CellType2["MerkleProof"] = 3] = "MerkleProof";
    CellType2[CellType2["MerkleUpdate"] = 4] = "MerkleUpdate";
  })(exports.CellType || (exports.CellType = {}));
})(CellType);
var Slice = {};
var Dictionary$1 = {};
var parseDict$1 = {};
Object.defineProperty(parseDict$1, "__esModule", { value: true });
parseDict$1.parseDict = void 0;
function readUnaryLength(slice) {
  let res = 0;
  while (slice.loadBit()) {
    res++;
  }
  return res;
}
function doParse(prefix, slice, n, res, extractor) {
  let lb0 = slice.loadBit() ? 1 : 0;
  let prefixLength = 0;
  let pp = prefix;
  if (lb0 === 0) {
    prefixLength = readUnaryLength(slice);
    for (let i = 0; i < prefixLength; i++) {
      pp += slice.loadBit() ? "1" : "0";
    }
  } else {
    let lb1 = slice.loadBit() ? 1 : 0;
    if (lb1 === 0) {
      prefixLength = slice.loadUint(Math.ceil(Math.log2(n + 1)));
      for (let i = 0; i < prefixLength; i++) {
        pp += slice.loadBit() ? "1" : "0";
      }
    } else {
      let bit = slice.loadBit() ? "1" : "0";
      prefixLength = slice.loadUint(Math.ceil(Math.log2(n + 1)));
      for (let i = 0; i < prefixLength; i++) {
        pp += bit;
      }
    }
  }
  if (n - prefixLength === 0) {
    res.set(BigInt("0b" + pp), extractor(slice));
  } else {
    let left2 = slice.loadRef();
    let right2 = slice.loadRef();
    if (!left2.isExotic) {
      doParse(pp + "0", left2.beginParse(), n - prefixLength - 1, res, extractor);
    }
    if (!right2.isExotic) {
      doParse(pp + "1", right2.beginParse(), n - prefixLength - 1, res, extractor);
    }
  }
}
function parseDict(sc, keySize, extractor) {
  let res = /* @__PURE__ */ new Map();
  if (sc) {
    doParse("", sc, keySize, res, extractor);
  }
  return res;
}
parseDict$1.parseDict = parseDict;
var serializeDict = {};
var findCommonPrefix$1 = {};
Object.defineProperty(findCommonPrefix$1, "__esModule", { value: true });
findCommonPrefix$1.findCommonPrefix = void 0;
function findCommonPrefix(src2) {
  if (src2.length === 0) {
    return "";
  }
  if (src2.length === 1) {
    return src2[0];
  }
  const sorted = [...src2].sort();
  let size2 = 0;
  for (let i = 0; i < sorted[0].length; i++) {
    if (sorted[0][i] !== sorted[sorted.length - 1][i]) {
      break;
    }
    size2++;
  }
  return src2[0].slice(0, size2);
}
findCommonPrefix$1.findCommonPrefix = findCommonPrefix;
var hasRequiredSerializeDict;
function requireSerializeDict() {
  if (hasRequiredSerializeDict)
    return serializeDict;
  hasRequiredSerializeDict = 1;
  Object.defineProperty(serializeDict, "__esModule", { value: true });
  serializeDict.serializeDict = serializeDict.detectLabelType = serializeDict.writeLabelSame = serializeDict.writeLabelLong = serializeDict.writeLabelShort = serializeDict.buildTree = void 0;
  const Builder_12 = requireBuilder();
  const findCommonPrefix_1 = findCommonPrefix$1;
  function pad(src2, size2) {
    while (src2.length < size2) {
      src2 = "0" + src2;
    }
    return src2;
  }
  function removePrefixMap(src2, length) {
    if (length === 0) {
      return src2;
    } else {
      let res = /* @__PURE__ */ new Map();
      for (let k of src2.keys()) {
        let d = src2.get(k);
        res.set(k.slice(length), d);
      }
      return res;
    }
  }
  function forkMap(src2) {
    if (src2.size === 0) {
      throw Error("Internal inconsistency");
    }
    let left2 = /* @__PURE__ */ new Map();
    let right2 = /* @__PURE__ */ new Map();
    for (let k of src2.keys()) {
      let d = src2.get(k);
      if (k.startsWith("0")) {
        left2.set(k.substr(1), d);
      } else {
        right2.set(k.substr(1), d);
      }
    }
    if (left2.size === 0) {
      throw Error("Internal inconsistency. Left emtpy.");
    }
    if (right2.size === 0) {
      throw Error("Internal inconsistency. Right emtpy.");
    }
    return { left: left2, right: right2 };
  }
  function buildNode(src2) {
    if (src2.size === 0) {
      throw Error("Internal inconsistency");
    }
    if (src2.size === 1) {
      return { type: "leaf", value: Array.from(src2.values())[0] };
    }
    let { left: left2, right: right2 } = forkMap(src2);
    return {
      type: "fork",
      left: buildEdge(left2),
      right: buildEdge(right2)
    };
  }
  function buildEdge(src2) {
    if (src2.size === 0) {
      throw Error("Internal inconsistency");
    }
    const label = (0, findCommonPrefix_1.findCommonPrefix)(Array.from(src2.keys()));
    return { label, node: buildNode(removePrefixMap(src2, label.length)) };
  }
  function buildTree(src2, keyLength) {
    let converted = /* @__PURE__ */ new Map();
    for (let k of Array.from(src2.keys())) {
      const padded = pad(k.toString(2), keyLength);
      converted.set(padded, src2.get(k));
    }
    return buildEdge(converted);
  }
  serializeDict.buildTree = buildTree;
  function writeLabelShort(src2, to) {
    to.storeBit(0);
    for (let i = 0; i < src2.length; i++) {
      to.storeBit(1);
    }
    to.storeBit(0);
    for (let i = 0; i < src2.length; i++) {
      to.storeBit(src2[i] === "1");
    }
    return to;
  }
  serializeDict.writeLabelShort = writeLabelShort;
  function labelShortLength(src2) {
    return 1 + src2.length + 1 + src2.length;
  }
  function writeLabelLong(src2, keyLength, to) {
    to.storeBit(1);
    to.storeBit(0);
    let length = Math.ceil(Math.log2(keyLength + 1));
    to.storeUint(src2.length, length);
    for (let i = 0; i < src2.length; i++) {
      to.storeBit(src2[i] === "1");
    }
    return to;
  }
  serializeDict.writeLabelLong = writeLabelLong;
  function labelLongLength(src2, keyLength) {
    return 1 + 1 + Math.ceil(Math.log2(keyLength + 1)) + src2.length;
  }
  function writeLabelSame(value, length, keyLength, to) {
    to.storeBit(1);
    to.storeBit(1);
    to.storeBit(value);
    let lenLen = Math.ceil(Math.log2(keyLength + 1));
    to.storeUint(length, lenLen);
  }
  serializeDict.writeLabelSame = writeLabelSame;
  function labelSameLength(keyLength) {
    return 1 + 1 + 1 + Math.ceil(Math.log2(keyLength + 1));
  }
  function isSame(src2) {
    if (src2.length === 0 || src2.length === 1) {
      return true;
    }
    for (let i = 1; i < src2.length; i++) {
      if (src2[i] !== src2[0]) {
        return false;
      }
    }
    return true;
  }
  function detectLabelType(src2, keyLength) {
    let kind = "short";
    let kindLength = labelShortLength(src2);
    let longLength = labelLongLength(src2, keyLength);
    if (longLength < kindLength) {
      kindLength = longLength;
      kind = "long";
    }
    if (isSame(src2)) {
      let sameLength = labelSameLength(keyLength);
      if (sameLength < kindLength) {
        kindLength = sameLength;
        kind = "same";
      }
    }
    return kind;
  }
  serializeDict.detectLabelType = detectLabelType;
  function writeLabel(src2, keyLength, to) {
    let type2 = detectLabelType(src2, keyLength);
    if (type2 === "short") {
      writeLabelShort(src2, to);
    }
    if (type2 === "long") {
      writeLabelLong(src2, keyLength, to);
    }
    if (type2 === "same") {
      writeLabelSame(src2[0] === "1", src2.length, keyLength, to);
    }
  }
  function writeNode(src2, keyLength, serializer, to) {
    if (src2.type === "leaf") {
      serializer(src2.value, to);
    }
    if (src2.type === "fork") {
      const leftCell = (0, Builder_12.beginCell)();
      const rightCell = (0, Builder_12.beginCell)();
      writeEdge(src2.left, keyLength - 1, serializer, leftCell);
      writeEdge(src2.right, keyLength - 1, serializer, rightCell);
      to.storeRef(leftCell);
      to.storeRef(rightCell);
    }
  }
  function writeEdge(src2, keyLength, serializer, to) {
    writeLabel(src2.label, keyLength, to);
    writeNode(src2.node, keyLength - src2.label.length, serializer, to);
  }
  function serializeDict$1(src2, keyLength, serializer, to) {
    const tree = buildTree(src2, keyLength);
    writeEdge(tree, keyLength, serializer, to);
  }
  serializeDict.serializeDict = serializeDict$1;
  return serializeDict;
}
var internalKeySerializer = {};
Object.defineProperty(internalKeySerializer, "__esModule", { value: true });
internalKeySerializer.deserializeInternalKey = internalKeySerializer.serializeInternalKey = void 0;
const Address_1$4 = Address$1;
function serializeInternalKey(value) {
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value)) {
      throw Error("Invalid key type: not a safe integer: " + value);
    }
    return "n:" + value.toString(10);
  } else if (typeof value === "bigint") {
    return "b:" + value.toString(10);
  } else if (Address_1$4.Address.isAddress(value)) {
    return "a:" + value.toString();
  } else if (Buffer.isBuffer(value)) {
    return "f:" + value.toString("hex");
  } else {
    throw Error("Invalid key type");
  }
}
internalKeySerializer.serializeInternalKey = serializeInternalKey;
function deserializeInternalKey(value) {
  let k = value.slice(0, 2);
  let v = value.slice(2);
  if (k === "n:") {
    return parseInt(v, 10);
  } else if (k === "b:") {
    return BigInt(v);
  } else if (k === "a:") {
    return Address_1$4.Address.parse(v);
  } else if (k === "f:") {
    return Buffer.from(v, "hex");
  }
  throw Error("Invalid key type: " + k);
}
internalKeySerializer.deserializeInternalKey = deserializeInternalKey;
var hasRequiredDictionary;
function requireDictionary() {
  if (hasRequiredDictionary)
    return Dictionary$1;
  hasRequiredDictionary = 1;
  Object.defineProperty(Dictionary$1, "__esModule", { value: true });
  Dictionary$1.Dictionary = void 0;
  const Address_12 = Address$1;
  const Builder_12 = requireBuilder();
  const Cell_12 = requireCell();
  const parseDict_1 = parseDict$1;
  const serializeDict_1 = requireSerializeDict();
  const internalKeySerializer_1 = internalKeySerializer;
  class Dictionary2 {
    /**
     * Create an empty map
     * @param key key type
     * @param value value type
     * @returns Dictionary<K, V>
     */
    static empty(key, value) {
      if (key && value) {
        return new Dictionary2(/* @__PURE__ */ new Map(), key, value);
      } else {
        return new Dictionary2(/* @__PURE__ */ new Map(), null, null);
      }
    }
    /**
     * Load dictionary from slice
     * @param key key description
     * @param value value description
     * @param src slice
     * @returns Dictionary<K, V>
     */
    static load(key, value, sc) {
      let slice;
      if (sc instanceof Cell_12.Cell) {
        if (sc.isExotic) {
          return Dictionary2.empty(key, value);
        }
        slice = sc.beginParse();
      } else {
        slice = sc;
      }
      let cell = slice.loadMaybeRef();
      if (cell && !cell.isExotic) {
        return Dictionary2.loadDirect(key, value, cell.beginParse());
      } else {
        return Dictionary2.empty(key, value);
      }
    }
    /**
     * Low level method for rare dictionaries from system contracts.
     * Loads dictionary from slice directly without going to the ref.
     *
     * @param key key description
     * @param value value description
     * @param sc slice
     * @returns Dictionary<K, V>
     */
    static loadDirect(key, value, sc) {
      if (!sc) {
        return Dictionary2.empty(key, value);
      }
      let slice;
      if (sc instanceof Cell_12.Cell) {
        slice = sc.beginParse();
      } else {
        slice = sc;
      }
      let values = (0, parseDict_1.parseDict)(slice, key.bits, value.parse);
      let prepare = /* @__PURE__ */ new Map();
      for (let [k, v] of values) {
        prepare.set((0, internalKeySerializer_1.serializeInternalKey)(key.parse(k)), v);
      }
      return new Dictionary2(prepare, key, value);
    }
    constructor(values, key, value) {
      this._key = key;
      this._value = value;
      this._map = values;
    }
    get size() {
      return this._map.size;
    }
    get(key) {
      return this._map.get((0, internalKeySerializer_1.serializeInternalKey)(key));
    }
    has(key) {
      return this._map.has((0, internalKeySerializer_1.serializeInternalKey)(key));
    }
    set(key, value) {
      this._map.set((0, internalKeySerializer_1.serializeInternalKey)(key), value);
      return this;
    }
    delete(key) {
      const k = (0, internalKeySerializer_1.serializeInternalKey)(key);
      return this._map.delete(k);
    }
    clear() {
      this._map.clear();
    }
    *[Symbol.iterator]() {
      for (const [k, v] of this._map) {
        const key = (0, internalKeySerializer_1.deserializeInternalKey)(k);
        yield [key, v];
      }
    }
    keys() {
      return Array.from(this._map.keys()).map((v) => (0, internalKeySerializer_1.deserializeInternalKey)(v));
    }
    values() {
      return Array.from(this._map.values());
    }
    store(builder2, key, value) {
      if (this._map.size === 0) {
        builder2.storeBit(0);
      } else {
        let resolvedKey = this._key;
        if (key !== null && key !== void 0) {
          resolvedKey = key;
        }
        let resolvedValue = this._value;
        if (value !== null && value !== void 0) {
          resolvedValue = value;
        }
        if (!resolvedKey) {
          throw Error("Key serializer is not defined");
        }
        if (!resolvedValue) {
          throw Error("Value serializer is not defined");
        }
        let prepared = /* @__PURE__ */ new Map();
        for (const [k, v] of this._map) {
          prepared.set(resolvedKey.serialize((0, internalKeySerializer_1.deserializeInternalKey)(k)), v);
        }
        builder2.storeBit(1);
        let dd = (0, Builder_12.beginCell)();
        (0, serializeDict_1.serializeDict)(prepared, resolvedKey.bits, resolvedValue.serialize, dd);
        builder2.storeRef(dd.endCell());
      }
    }
    storeDirect(builder2, key, value) {
      if (this._map.size === 0) {
        throw Error("Cannot store empty dictionary directly");
      }
      let resolvedKey = this._key;
      if (key !== null && key !== void 0) {
        resolvedKey = key;
      }
      let resolvedValue = this._value;
      if (value !== null && value !== void 0) {
        resolvedValue = value;
      }
      if (!resolvedKey) {
        throw Error("Key serializer is not defined");
      }
      if (!resolvedValue) {
        throw Error("Value serializer is not defined");
      }
      let prepared = /* @__PURE__ */ new Map();
      for (const [k, v] of this._map) {
        prepared.set(resolvedKey.serialize((0, internalKeySerializer_1.deserializeInternalKey)(k)), v);
      }
      (0, serializeDict_1.serializeDict)(prepared, resolvedKey.bits, resolvedValue.serialize, builder2);
    }
  }
  Dictionary$1.Dictionary = Dictionary2;
  Dictionary2.Keys = {
    /**
     * Standard address key
     * @returns DictionaryKey<Address>
     */
    Address: () => {
      return createAddressKey();
    },
    /**
     * Create standard big integer key
     * @param bits number of bits
     * @returns DictionaryKey<bigint>
     */
    BigInt: (bits) => {
      return createBigIntKey(bits);
    },
    /**
     * Create integer key
     * @param bits bits of integer
     * @returns DictionaryKey<number>
     */
    Int: (bits) => {
      return createIntKey(bits);
    },
    /**
     * Create standard unsigned big integer key
     * @param bits number of bits
     * @returns DictionaryKey<bigint>
     */
    BigUint: (bits) => {
      return createBigUintKey(bits);
    },
    /**
     * Create standard unsigned integer key
     * @param bits number of bits
     * @returns DictionaryKey<number>
     */
    Uint: (bits) => {
      return createUintKey(bits);
    },
    /**
     * Create standard buffer key
     * @param bytes number of bytes of a buffer
     * @returns DictionaryKey<Buffer>
     */
    Buffer: (bytes) => {
      return createBufferKey(bytes);
    }
  };
  Dictionary2.Values = {
    /**
     * Create standard integer value
     * @returns DictionaryValue<bigint>
     */
    BigInt: (bits) => {
      return createBigIntValue(bits);
    },
    /**
     * Create standard integer value
     * @returns DictionaryValue<number>
     */
    Int: (bits) => {
      return createIntValue(bits);
    },
    /**
     * Create big var int
     * @param bits nubmer of header bits
     * @returns DictionaryValue<bigint>
     */
    BigVarInt: (bits) => {
      return createBigVarIntValue(bits);
    },
    /**
     * Create standard unsigned integer value
     * @param bits number of bits
     * @returns DictionaryValue<bigint>
     */
    BigUint: (bits) => {
      return createBigUintValue(bits);
    },
    /**
     * Create standard unsigned integer value
     * @param bits number of bits
     * @returns DictionaryValue<bigint>
     */
    Uint: (bits) => {
      return createUintValue(bits);
    },
    /**
     * Create big var int
     * @param bits nubmer of header bits
     * @returns DictionaryValue<bigint>
     */
    BigVarUint: (bits) => {
      return createBigVarUintValue(bits);
    },
    /**
     * Create standard boolean value
     * @returns DictionaryValue<boolean>
     */
    Bool: () => {
      return createBooleanValue();
    },
    /**
     * Create standard address value
     * @returns DictionaryValue<Address>
     */
    Address: () => {
      return createAddressValue();
    },
    /**
     * Create standard cell value
     * @returns DictionaryValue<Cell>
     */
    Cell: () => {
      return createCellValue();
    },
    /**
     * Create Builder value
     * @param bytes number of bytes of a buffer
     * @returns DictionaryValue<Builder>
     */
    Buffer: (bytes) => {
      return createBufferValue(bytes);
    },
    /**
     * Create dictionary value
     * @param key
     * @param value
     */
    Dictionary: (key, value) => {
      return createDictionaryValue(key, value);
    }
  };
  function createAddressKey() {
    return {
      bits: 267,
      serialize: (src2) => {
        if (!Address_12.Address.isAddress(src2)) {
          throw Error("Key is not an address");
        }
        return (0, Builder_12.beginCell)().storeAddress(src2).endCell().beginParse().preloadUintBig(267);
      },
      parse: (src2) => {
        return (0, Builder_12.beginCell)().storeUint(src2, 267).endCell().beginParse().loadAddress();
      }
    };
  }
  function createBigIntKey(bits) {
    return {
      bits,
      serialize: (src2) => {
        if (typeof src2 !== "bigint") {
          throw Error("Key is not a bigint");
        }
        return (0, Builder_12.beginCell)().storeInt(src2, bits).endCell().beginParse().loadUintBig(bits);
      },
      parse: (src2) => {
        return (0, Builder_12.beginCell)().storeUint(src2, bits).endCell().beginParse().loadIntBig(bits);
      }
    };
  }
  function createIntKey(bits) {
    return {
      bits,
      serialize: (src2) => {
        if (typeof src2 !== "number") {
          throw Error("Key is not a number");
        }
        if (!Number.isSafeInteger(src2)) {
          throw Error("Key is not a safe integer: " + src2);
        }
        return (0, Builder_12.beginCell)().storeInt(src2, bits).endCell().beginParse().loadUintBig(bits);
      },
      parse: (src2) => {
        return (0, Builder_12.beginCell)().storeUint(src2, bits).endCell().beginParse().loadInt(bits);
      }
    };
  }
  function createBigUintKey(bits) {
    return {
      bits,
      serialize: (src2) => {
        if (typeof src2 !== "bigint") {
          throw Error("Key is not a bigint");
        }
        if (src2 < 0) {
          throw Error("Key is negative: " + src2);
        }
        return (0, Builder_12.beginCell)().storeUint(src2, bits).endCell().beginParse().loadUintBig(bits);
      },
      parse: (src2) => {
        return (0, Builder_12.beginCell)().storeUint(src2, bits).endCell().beginParse().loadUintBig(bits);
      }
    };
  }
  function createUintKey(bits) {
    return {
      bits,
      serialize: (src2) => {
        if (typeof src2 !== "number") {
          throw Error("Key is not a number");
        }
        if (!Number.isSafeInteger(src2)) {
          throw Error("Key is not a safe integer: " + src2);
        }
        if (src2 < 0) {
          throw Error("Key is negative: " + src2);
        }
        return (0, Builder_12.beginCell)().storeUint(src2, bits).endCell().beginParse().loadUintBig(bits);
      },
      parse: (src2) => {
        return Number((0, Builder_12.beginCell)().storeUint(src2, bits).endCell().beginParse().loadUint(bits));
      }
    };
  }
  function createBufferKey(bytes) {
    return {
      bits: bytes * 8,
      serialize: (src2) => {
        if (!Buffer.isBuffer(src2)) {
          throw Error("Key is not a buffer");
        }
        return (0, Builder_12.beginCell)().storeBuffer(src2).endCell().beginParse().loadUintBig(bytes * 8);
      },
      parse: (src2) => {
        return (0, Builder_12.beginCell)().storeUint(src2, bytes * 8).endCell().beginParse().loadBuffer(bytes);
      }
    };
  }
  function createIntValue(bits) {
    return {
      serialize: (src2, buidler) => {
        buidler.storeInt(src2, bits);
      },
      parse: (src2) => {
        return src2.loadInt(bits);
      }
    };
  }
  function createBigIntValue(bits) {
    return {
      serialize: (src2, buidler) => {
        buidler.storeInt(src2, bits);
      },
      parse: (src2) => {
        return src2.loadIntBig(bits);
      }
    };
  }
  function createBigVarIntValue(bits) {
    return {
      serialize: (src2, buidler) => {
        buidler.storeVarInt(src2, bits);
      },
      parse: (src2) => {
        return src2.loadVarIntBig(bits);
      }
    };
  }
  function createBigVarUintValue(bits) {
    return {
      serialize: (src2, buidler) => {
        buidler.storeVarUint(src2, bits);
      },
      parse: (src2) => {
        return src2.loadVarUintBig(bits);
      }
    };
  }
  function createUintValue(bits) {
    return {
      serialize: (src2, buidler) => {
        buidler.storeUint(src2, bits);
      },
      parse: (src2) => {
        return src2.loadUint(bits);
      }
    };
  }
  function createBigUintValue(bits) {
    return {
      serialize: (src2, buidler) => {
        buidler.storeUint(src2, bits);
      },
      parse: (src2) => {
        return src2.loadUintBig(bits);
      }
    };
  }
  function createBooleanValue() {
    return {
      serialize: (src2, buidler) => {
        buidler.storeBit(src2);
      },
      parse: (src2) => {
        return src2.loadBit();
      }
    };
  }
  function createAddressValue() {
    return {
      serialize: (src2, buidler) => {
        buidler.storeAddress(src2);
      },
      parse: (src2) => {
        return src2.loadAddress();
      }
    };
  }
  function createCellValue() {
    return {
      serialize: (src2, buidler) => {
        buidler.storeRef(src2);
      },
      parse: (src2) => {
        return src2.loadRef();
      }
    };
  }
  function createDictionaryValue(key, value) {
    return {
      serialize: (src2, buidler) => {
        src2.store(buidler);
      },
      parse: (src2) => {
        return Dictionary2.load(key, value, src2);
      }
    };
  }
  function createBufferValue(size2) {
    return {
      serialize: (src2, buidler) => {
        if (src2.length !== size2) {
          throw Error("Invalid buffer size");
        }
        buidler.storeBuffer(src2);
      },
      parse: (src2) => {
        return src2.loadBuffer(size2);
      }
    };
  }
  return Dictionary$1;
}
var strings = {};
var hasRequiredStrings;
function requireStrings() {
  if (hasRequiredStrings)
    return strings;
  hasRequiredStrings = 1;
  Object.defineProperty(strings, "__esModule", { value: true });
  strings.writeString = strings.stringToCell = strings.readString = void 0;
  const Builder_12 = requireBuilder();
  function readBuffer(slice) {
    if (slice.remainingBits % 8 !== 0) {
      throw new Error(`Invalid string length: ${slice.remainingBits}`);
    }
    if (slice.remainingRefs !== 0 && slice.remainingRefs !== 1) {
      throw new Error(`invalid number of refs: ${slice.remainingRefs}`);
    }
    if (slice.remainingRefs === 1 && 1023 - slice.remainingBits > 7) {
      throw new Error(`invalid string length: ${slice.remainingBits / 8}`);
    }
    let res;
    if (slice.remainingBits === 0) {
      res = Buffer.alloc(0);
    } else {
      res = slice.loadBuffer(slice.remainingBits / 8);
    }
    if (slice.remainingRefs === 1) {
      res = Buffer.concat([res, readBuffer(slice.loadRef().beginParse())]);
    }
    return res;
  }
  function readString(slice) {
    return readBuffer(slice).toString();
  }
  strings.readString = readString;
  function writeBuffer(src2, builder2) {
    if (src2.length > 0) {
      let bytes = Math.floor(builder2.availableBits / 8);
      if (src2.length > bytes) {
        let a = src2.subarray(0, bytes);
        let t2 = src2.subarray(bytes);
        builder2 = builder2.storeBuffer(a);
        let bb = (0, Builder_12.beginCell)();
        writeBuffer(t2, bb);
        builder2 = builder2.storeRef(bb.endCell());
      } else {
        builder2 = builder2.storeBuffer(src2);
      }
    }
  }
  function stringToCell(src2) {
    let builder2 = (0, Builder_12.beginCell)();
    writeBuffer(Buffer.from(src2), builder2);
    return builder2.endCell();
  }
  strings.stringToCell = stringToCell;
  function writeString(src2, builder2) {
    writeBuffer(Buffer.from(src2), builder2);
  }
  strings.writeString = writeString;
  return strings;
}
var hasRequiredSlice;
function requireSlice() {
  if (hasRequiredSlice)
    return Slice;
  hasRequiredSlice = 1;
  var __importDefault2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  var _a2;
  Object.defineProperty(Slice, "__esModule", { value: true });
  Slice.Slice = void 0;
  const symbol_inspect_12 = __importDefault2(symbol_inspect);
  const Dictionary_12 = requireDictionary();
  const Builder_12 = requireBuilder();
  const strings_1 = requireStrings();
  let Slice$1 = class Slice {
    constructor(reader2, refs) {
      this[_a2] = () => this.toString();
      this._reader = reader2.clone();
      this._refs = [...refs];
    }
    /**
     * Get remaining bits
     */
    get remainingBits() {
      return this._reader.remaining;
    }
    /**
     * Get remaining refs
     */
    get remainingRefs() {
      return this._refs.length;
    }
    /**
     * Skip bits
     * @param bits
     */
    skip(bits) {
      this._reader.skip(bits);
      return this;
    }
    /**
     * Load a single bit
     * @returns true or false depending on the bit value
     */
    loadBit() {
      return this._reader.loadBit();
    }
    /**
     * Preload a signle bit
     * @returns true or false depending on the bit value
     */
    preloadBit() {
      return this._reader.preloadBit();
    }
    /**
     * Load a boolean
     * @returns true or false depending on the bit value
     */
    loadBoolean() {
      return this.loadBit();
    }
    /**
     * Load maybe boolean
     * @returns true or false depending on the bit value or null
     */
    loadMaybeBoolean() {
      if (this.loadBit()) {
        return this.loadBoolean();
      } else {
        return null;
      }
    }
    /**
     * Load bits as a new BitString
     * @param bits number of bits to read
     * @returns new BitString
     */
    loadBits(bits) {
      return this._reader.loadBits(bits);
    }
    /**
     * Preload bits as a new BitString
     * @param bits number of bits to read
     * @returns new BitString
     */
    preloadBits(bits) {
      return this._reader.preloadBits(bits);
    }
    /**
     * Load uint
     * @param bits number of bits to read
     * @returns uint value
     */
    loadUint(bits) {
      return this._reader.loadUint(bits);
    }
    /**
     * Load uint
     * @param bits number of bits to read
     * @returns uint value
     */
    loadUintBig(bits) {
      return this._reader.loadUintBig(bits);
    }
    /**
     * Preload uint
     * @param bits number of bits to read
     * @returns uint value
     */
    preloadUint(bits) {
      return this._reader.preloadUint(bits);
    }
    /**
     * Preload uint
     * @param bits number of bits to read
     * @returns uint value
     */
    preloadUintBig(bits) {
      return this._reader.preloadUintBig(bits);
    }
    /**
     * Load maybe uint
     * @param bits number of bits to read
     * @returns uint value or null
     */
    loadMaybeUint(bits) {
      if (this.loadBit()) {
        return this.loadUint(bits);
      } else {
        return null;
      }
    }
    /**
     * Load maybe uint
     * @param bits number of bits to read
     * @returns uint value or null
     */
    loadMaybeUintBig(bits) {
      if (this.loadBit()) {
        return this.loadUintBig(bits);
      } else {
        return null;
      }
    }
    /**
     * Load int
     * @param bits number of bits to read
     * @returns int value
     */
    loadInt(bits) {
      return this._reader.loadInt(bits);
    }
    /**
     * Load int
     * @param bits number of bits to read
     * @returns int value
     */
    loadIntBig(bits) {
      return this._reader.loadIntBig(bits);
    }
    /**
     * Preload int
     * @param bits number of bits to read
     * @returns int value
     */
    preloadInt(bits) {
      return this._reader.preloadInt(bits);
    }
    /**
     * Preload int
     * @param bits number of bits to read
     * @returns int value
     */
    preloadIntBig(bits) {
      return this._reader.preloadIntBig(bits);
    }
    /**
     * Load maybe uint
     * @param bits number of bits to read
     * @returns uint value or null
     */
    loadMaybeInt(bits) {
      if (this.loadBit()) {
        return this.loadInt(bits);
      } else {
        return null;
      }
    }
    /**
     * Load maybe uint
     * @param bits number of bits to read
     * @returns uint value or null
     */
    loadMaybeIntBig(bits) {
      if (this.loadBit()) {
        return this.loadIntBig(bits);
      } else {
        return null;
      }
    }
    /**
     * Load varuint
     * @param bits number of bits to read in header
     * @returns varuint value
     */
    loadVarUint(bits) {
      return this._reader.loadVarUint(bits);
    }
    /**
     * Load varuint
     * @param bits number of bits to read in header
     * @returns varuint value
     */
    loadVarUintBig(bits) {
      return this._reader.loadVarUintBig(bits);
    }
    /**
     * Preload varuint
     * @param bits number of bits to read in header
     * @returns varuint value
     */
    preloadVarUint(bits) {
      return this._reader.preloadVarUint(bits);
    }
    /**
     * Preload varuint
     * @param bits number of bits to read in header
     * @returns varuint value
     */
    preloadVarUintBig(bits) {
      return this._reader.preloadVarUintBig(bits);
    }
    /**
     * Load varint
     * @param bits number of bits to read in header
     * @returns varint value
     */
    loadVarInt(bits) {
      return this._reader.loadVarInt(bits);
    }
    /**
     * Load varint
     * @param bits number of bits to read in header
     * @returns varint value
     */
    loadVarIntBig(bits) {
      return this._reader.loadVarIntBig(bits);
    }
    /**
     * Preload varint
     * @param bits number of bits to read in header
     * @returns varint value
     */
    preloadVarInt(bits) {
      return this._reader.preloadVarInt(bits);
    }
    /**
     * Preload varint
     * @param bits number of bits to read in header
     * @returns varint value
     */
    preloadVarIntBig(bits) {
      return this._reader.preloadVarIntBig(bits);
    }
    /**
     * Load coins
     * @returns coins value
     */
    loadCoins() {
      return this._reader.loadCoins();
    }
    /**
     * Preload coins
     * @returns coins value
     */
    preloadCoins() {
      return this._reader.preloadCoins();
    }
    /**
     * Load maybe coins
     * @returns coins value or null
     */
    loadMaybeCoins() {
      if (this._reader.loadBit()) {
        return this._reader.loadCoins();
      } else {
        return null;
      }
    }
    /**
     * Load internal Address
     * @returns Address
     */
    loadAddress() {
      return this._reader.loadAddress();
    }
    /**
     * Load optional internal Address
     * @returns Address or null
     */
    loadMaybeAddress() {
      return this._reader.loadMaybeAddress();
    }
    /**
     * Load external address
     * @returns ExternalAddress
     */
    loadExternalAddress() {
      return this._reader.loadExternalAddress();
    }
    /**
     * Load optional external address
     * @returns ExternalAddress or null
     */
    loadMaybeExternalAddress() {
      return this._reader.loadMaybeExternalAddress();
    }
    /**
     * Load address
     * @returns Address, ExternalAddress or null
     */
    loadAddressAny() {
      return this._reader.loadAddressAny();
    }
    /**
     * Load reference
     * @returns Cell
     */
    loadRef() {
      if (this._refs.length === 0) {
        throw new Error("No more references");
      }
      return this._refs.shift();
    }
    /**
     * Preload reference
     * @returns Cell
     */
    preloadRef() {
      if (this._refs.length === 0) {
        throw new Error("No more references");
      }
      return this._refs[0];
    }
    /**
     * Load optional reference
     * @returns Cell or null
     */
    loadMaybeRef() {
      if (this.loadBit()) {
        return this.loadRef();
      } else {
        return null;
      }
    }
    /**
     * Preload optional reference
     * @returns Cell or null
     */
    preloadMaybeRef() {
      if (this.preloadBit()) {
        return this.preloadRef();
      } else {
        return null;
      }
    }
    /**
     * Load byte buffer
     * @param bytes number of bytes to load
     * @returns Buffer
     */
    loadBuffer(bytes) {
      return this._reader.loadBuffer(bytes);
    }
    /**
     * Load byte buffer
     * @param bytes number of bytes to load
     * @returns Buffer
     */
    preloadBuffer(bytes) {
      return this._reader.preloadBuffer(bytes);
    }
    /**
     * Load string tail
     */
    loadStringTail() {
      return (0, strings_1.readString)(this);
    }
    /**
     * Load maybe string tail
     * @returns string or null
     */
    loadMaybeStringTail() {
      if (this.loadBit()) {
        return (0, strings_1.readString)(this);
      } else {
        return null;
      }
    }
    /**
     * Load string tail from ref
     * @returns string
     */
    loadStringRefTail() {
      return (0, strings_1.readString)(this.loadRef().beginParse());
    }
    /**
     * Load maybe string tail from ref
     * @returns string or null
     */
    loadMaybeStringRefTail() {
      const ref = this.loadMaybeRef();
      if (ref) {
        return (0, strings_1.readString)(ref.beginParse());
      } else {
        return null;
      }
    }
    /**
     * Loads dictionary
     * @param key key description
     * @param value value description
     * @returns Dictionary<K, V>
     */
    loadDict(key, value) {
      return Dictionary_12.Dictionary.load(key, value, this);
    }
    /**
     * Loads dictionary directly from current slice
     * @param key key description
     * @param value value description
     * @returns Dictionary<K, V>
     */
    loadDictDirect(key, value) {
      return Dictionary_12.Dictionary.loadDirect(key, value, this);
    }
    /**
     * Checks if slice is empty
     */
    endParse() {
      if (this.remainingBits > 0 || this.remainingRefs > 0) {
        throw new Error("Slice is not empty");
      }
    }
    /**
     * Convert slice to cell
     */
    asCell() {
      return (0, Builder_12.beginCell)().storeSlice(this).endCell();
    }
    /**
     *
     * @returns
     */
    asBuilder() {
      return (0, Builder_12.beginCell)().storeSlice(this);
    }
    /**
     * Clone slice
     * @returns cloned slice
     */
    clone() {
      return new Slice$1(this._reader, this._refs);
    }
    /**
     * Print slice as string by converting it to cell
     * @returns string
     */
    toString() {
      return this.asCell().toString();
    }
  };
  Slice.Slice = Slice$1;
  _a2 = symbol_inspect_12.default;
  return Slice;
}
var resolveExotic$1 = {};
var BitReader$1 = {};
Object.defineProperty(BitReader$1, "__esModule", { value: true });
BitReader$1.BitReader = void 0;
const Address_1$3 = Address$1;
const ExternalAddress_1 = ExternalAddress$1;
class BitReader {
  constructor(bits, offset = 0) {
    this._checkpoints = [];
    this._bits = bits;
    this._offset = offset;
  }
  /**
   * Number of bits remaining
   */
  get remaining() {
    return this._bits.length - this._offset;
  }
  /**
   * Skip bits
   * @param bits number of bits to skip
   */
  skip(bits) {
    if (bits < 0 || this._offset + bits > this._bits.length) {
      throw new Error(`Index ${this._offset + bits} is out of bounds`);
    }
    this._offset += bits;
  }
  /**
   * Reset to the beginning or latest checkpoint
   */
  reset() {
    if (this._checkpoints.length > 0) {
      this._offset = this._checkpoints.pop();
    } else {
      this._offset = 0;
    }
  }
  /**
   * Save checkpoint
   */
  save() {
    this._checkpoints.push(this._offset);
  }
  /**
   * Load a single bit
   * @returns true if the bit is set, false otherwise
   */
  loadBit() {
    let r = this._bits.at(this._offset);
    this._offset++;
    return r;
  }
  /**
   * Preload bit
   * @returns true if the bit is set, false otherwise
   */
  preloadBit() {
    return this._bits.at(this._offset);
  }
  /**
   * Load bit string
   * @param bits number of bits to read
   * @returns new bitstring
   */
  loadBits(bits) {
    let r = this._bits.substring(this._offset, bits);
    this._offset += bits;
    return r;
  }
  /**
   * Preload bit string
   * @param bits number of bits to read
   * @returns new bitstring
   */
  preloadBits(bits) {
    return this._bits.substring(this._offset, bits);
  }
  /**
   * Load buffer
   * @param bytes number of bytes
   * @returns new buffer
   */
  loadBuffer(bytes) {
    let buf = this._preloadBuffer(bytes, this._offset);
    this._offset += bytes * 8;
    return buf;
  }
  /**
   * Preload buffer
   * @param bytes number of bytes
   * @returns new buffer
   */
  preloadBuffer(bytes) {
    return this._preloadBuffer(bytes, this._offset);
  }
  /**
   * Load uint value
   * @param bits uint bits
   * @returns read value as number
   */
  loadUint(bits) {
    return Number(this.loadUintBig(bits));
  }
  /**
   * Load uint value as bigint
   * @param bits uint bits
   * @returns read value as bigint
   */
  loadUintBig(bits) {
    let loaded = this.preloadUintBig(bits);
    this._offset += bits;
    return loaded;
  }
  /**
   * Preload uint value
   * @param bits uint bits
   * @returns read value as number
   */
  preloadUint(bits) {
    return Number(this._preloadUint(bits, this._offset));
  }
  /**
   * Preload uint value as bigint
   * @param bits uint bits
   * @returns read value as bigint
   */
  preloadUintBig(bits) {
    return this._preloadUint(bits, this._offset);
  }
  /**
   * Load int value
   * @param bits int bits
   * @returns read value as bigint
   */
  loadInt(bits) {
    let res = this._preloadInt(bits, this._offset);
    this._offset += bits;
    return Number(res);
  }
  /**
   * Load int value as bigint
   * @param bits int bits
   * @returns read value as bigint
   */
  loadIntBig(bits) {
    let res = this._preloadInt(bits, this._offset);
    this._offset += bits;
    return res;
  }
  /**
   * Preload int value
   * @param bits int bits
   * @returns read value as bigint
   */
  preloadInt(bits) {
    return Number(this._preloadInt(bits, this._offset));
  }
  /**
   * Preload int value
   * @param bits int bits
   * @returns read value as bigint
   */
  preloadIntBig(bits) {
    return this._preloadInt(bits, this._offset);
  }
  /**
   * Load varuint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  loadVarUint(bits) {
    let size2 = Number(this.loadUint(bits));
    return Number(this.loadUintBig(size2 * 8));
  }
  /**
   * Load varuint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  loadVarUintBig(bits) {
    let size2 = Number(this.loadUint(bits));
    return this.loadUintBig(size2 * 8);
  }
  /**
   * Preload varuint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  preloadVarUint(bits) {
    let size2 = Number(this._preloadUint(bits, this._offset));
    return Number(this._preloadUint(size2 * 8, this._offset + bits));
  }
  /**
   * Preload varuint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  preloadVarUintBig(bits) {
    let size2 = Number(this._preloadUint(bits, this._offset));
    return this._preloadUint(size2 * 8, this._offset + bits);
  }
  /**
   * Load varint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  loadVarInt(bits) {
    let size2 = Number(this.loadUint(bits));
    return Number(this.loadIntBig(size2 * 8));
  }
  /**
   * Load varint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  loadVarIntBig(bits) {
    let size2 = Number(this.loadUint(bits));
    return this.loadIntBig(size2 * 8);
  }
  /**
   * Preload varint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  preloadVarInt(bits) {
    let size2 = Number(this._preloadUint(bits, this._offset));
    return Number(this._preloadInt(size2 * 8, this._offset + bits));
  }
  /**
   * Preload varint value
   * @param bits number of bits to read the size
   * @returns read value as bigint
   */
  preloadVarIntBig(bits) {
    let size2 = Number(this._preloadUint(bits, this._offset));
    return this._preloadInt(size2 * 8, this._offset + bits);
  }
  /**
   * Load coins value
   * @returns read value as bigint
   */
  loadCoins() {
    return this.loadVarUintBig(4);
  }
  /**
   * Preload coins value
   * @returns read value as bigint
   */
  preloadCoins() {
    return this.preloadVarUintBig(4);
  }
  /**
   * Load Address
   * @returns Address
   */
  loadAddress() {
    let type2 = Number(this._preloadUint(2, this._offset));
    if (type2 === 2) {
      return this._loadInternalAddress();
    } else {
      throw new Error("Invalid address: " + type2);
    }
  }
  /**
   * Load internal address
   * @returns Address or null
   */
  loadMaybeAddress() {
    let type2 = Number(this._preloadUint(2, this._offset));
    if (type2 === 0) {
      this._offset += 2;
      return null;
    } else if (type2 === 2) {
      return this._loadInternalAddress();
    } else {
      throw new Error("Invalid address");
    }
  }
  /**
   * Load external address
   * @returns ExternalAddress
   */
  loadExternalAddress() {
    let type2 = Number(this._preloadUint(2, this._offset));
    if (type2 === 1) {
      return this._loadExternalAddress();
    } else {
      throw new Error("Invalid address");
    }
  }
  /**
   * Load external address
   * @returns ExternalAddress or null
   */
  loadMaybeExternalAddress() {
    let type2 = Number(this._preloadUint(2, this._offset));
    if (type2 === 0) {
      this._offset += 2;
      return null;
    } else if (type2 === 1) {
      return this._loadExternalAddress();
    } else {
      throw new Error("Invalid address");
    }
  }
  /**
   * Read address of any type
   * @returns Address or ExternalAddress or null
   */
  loadAddressAny() {
    let type2 = Number(this._preloadUint(2, this._offset));
    if (type2 === 0) {
      this._offset += 2;
      return null;
    } else if (type2 === 2) {
      return this._loadInternalAddress();
    } else if (type2 === 1) {
      return this._loadExternalAddress();
    } else if (type2 === 3) {
      throw Error("Unsupported");
    } else {
      throw Error("Unreachable");
    }
  }
  /**
   * Load bit string that was padded to make it byte alligned. Used in BOC serialization
   * @param bytes number of bytes to read
   */
  loadPaddedBits(bits) {
    if (bits % 8 !== 0) {
      throw new Error("Invalid number of bits");
    }
    let length = bits;
    while (true) {
      if (this._bits.at(this._offset + length - 1)) {
        length--;
        break;
      } else {
        length--;
      }
    }
    let r = this._bits.substring(this._offset, length);
    this._offset += bits;
    return r;
  }
  /**
   * Clone BitReader
   */
  clone() {
    return new BitReader(this._bits, this._offset);
  }
  /**
   * Preload int from specific offset
   * @param bits bits to preload
   * @param offset offset to start from
   * @returns read value as bigint
   */
  _preloadInt(bits, offset) {
    if (bits == 0) {
      return 0n;
    }
    let sign2 = this._bits.at(offset);
    let res = 0n;
    for (let i = 0; i < bits - 1; i++) {
      if (this._bits.at(offset + 1 + i)) {
        res += 1n << BigInt(bits - i - 1 - 1);
      }
    }
    if (sign2) {
      res = res - (1n << BigInt(bits - 1));
    }
    return res;
  }
  /**
   * Preload uint from specific offset
   * @param bits bits to preload
   * @param offset offset to start from
   * @returns read value as bigint
   */
  _preloadUint(bits, offset) {
    if (bits == 0) {
      return 0n;
    }
    let res = 0n;
    for (let i = 0; i < bits; i++) {
      if (this._bits.at(offset + i)) {
        res += 1n << BigInt(bits - i - 1);
      }
    }
    return res;
  }
  _preloadBuffer(bytes, offset) {
    let fastBuffer = this._bits.subbuffer(offset, bytes * 8);
    if (fastBuffer) {
      return fastBuffer;
    }
    let buf = Buffer.alloc(bytes);
    for (let i = 0; i < bytes; i++) {
      buf[i] = Number(this._preloadUint(8, offset + i * 8));
    }
    return buf;
  }
  _loadInternalAddress() {
    let type2 = Number(this._preloadUint(2, this._offset));
    if (type2 !== 2) {
      throw Error("Invalid address");
    }
    if (this._preloadUint(1, this._offset + 2) !== 0n) {
      throw Error("Invalid address");
    }
    let wc = Number(this._preloadInt(8, this._offset + 3));
    let hash = this._preloadBuffer(32, this._offset + 11);
    this._offset += 267;
    return new Address_1$3.Address(wc, hash);
  }
  _loadExternalAddress() {
    let type2 = Number(this._preloadUint(2, this._offset));
    if (type2 !== 1) {
      throw Error("Invalid address");
    }
    let bits = Number(this._preloadUint(9, this._offset + 2));
    let value = this._preloadUint(bits, this._offset + 11);
    this._offset += 11 + bits;
    return new ExternalAddress_1.ExternalAddress(value, bits);
  }
}
BitReader$1.BitReader = BitReader;
var exoticMerkleProof$1 = {};
Object.defineProperty(exoticMerkleProof$1, "__esModule", { value: true });
exoticMerkleProof$1.exoticMerkleProof = void 0;
const BitReader_1$3 = BitReader$1;
function exoticMerkleProof(bits, refs) {
  const reader2 = new BitReader_1$3.BitReader(bits);
  const size2 = 8 + 256 + 16;
  if (bits.length !== size2) {
    throw new Error(`Merkle Proof cell must have exactly (8 + 256 + 16) bits, got "${bits.length}"`);
  }
  if (refs.length !== 1) {
    throw new Error(`Merkle Proof cell must have exactly 1 ref, got "${refs.length}"`);
  }
  let type2 = reader2.loadUint(8);
  if (type2 !== 3) {
    throw new Error(`Merkle Proof cell must have type 3, got "${type2}"`);
  }
  const proofHash = reader2.loadBuffer(32);
  const proofDepth = reader2.loadUint(16);
  const refHash = refs[0].hash(0);
  const refDepth = refs[0].depth(0);
  if (proofDepth !== refDepth) {
    throw new Error(`Merkle Proof cell ref depth must be exactly "${proofDepth}", got "${refDepth}"`);
  }
  if (!proofHash.equals(refHash)) {
    throw new Error(`Merkle Proof cell ref hash must be exactly "${proofHash.toString("hex")}", got "${refHash.toString("hex")}"`);
  }
  return {
    proofDepth,
    proofHash
  };
}
exoticMerkleProof$1.exoticMerkleProof = exoticMerkleProof;
var exoticMerkleUpdate$1 = {};
Object.defineProperty(exoticMerkleUpdate$1, "__esModule", { value: true });
exoticMerkleUpdate$1.exoticMerkleUpdate = void 0;
const BitReader_1$2 = BitReader$1;
function exoticMerkleUpdate(bits, refs) {
  const reader2 = new BitReader_1$2.BitReader(bits);
  const size2 = 8 + 2 * (256 + 16);
  if (bits.length !== size2) {
    throw new Error(`Merkle Update cell must have exactly (8 + (2 * (256 + 16))) bits, got "${bits.length}"`);
  }
  if (refs.length !== 2) {
    throw new Error(`Merkle Update cell must have exactly 2 refs, got "${refs.length}"`);
  }
  let type2 = reader2.loadUint(8);
  if (type2 !== 4) {
    throw new Error(`Merkle Update cell type must be exactly 4, got "${type2}"`);
  }
  const proofHash1 = reader2.loadBuffer(32);
  const proofHash2 = reader2.loadBuffer(32);
  const proofDepth1 = reader2.loadUint(16);
  const proofDepth2 = reader2.loadUint(16);
  if (proofDepth1 !== refs[0].depth(0)) {
    throw new Error(`Merkle Update cell ref depth must be exactly "${proofDepth1}", got "${refs[0].depth(0)}"`);
  }
  if (!proofHash1.equals(refs[0].hash(0))) {
    throw new Error(`Merkle Update cell ref hash must be exactly "${proofHash1.toString("hex")}", got "${refs[0].hash(0).toString("hex")}"`);
  }
  if (proofDepth2 !== refs[1].depth(0)) {
    throw new Error(`Merkle Update cell ref depth must be exactly "${proofDepth2}", got "${refs[1].depth(0)}"`);
  }
  if (!proofHash2.equals(refs[1].hash(0))) {
    throw new Error(`Merkle Update cell ref hash must be exactly "${proofHash2.toString("hex")}", got "${refs[1].hash(0).toString("hex")}"`);
  }
  return {
    proofDepth1,
    proofDepth2,
    proofHash1,
    proofHash2
  };
}
exoticMerkleUpdate$1.exoticMerkleUpdate = exoticMerkleUpdate;
var exoticPruned$1 = {};
var LevelMask$1 = {};
Object.defineProperty(LevelMask$1, "__esModule", { value: true });
LevelMask$1.LevelMask = void 0;
class LevelMask {
  constructor(mask = 0) {
    this._mask = 0;
    this._mask = mask;
    this._hashIndex = countSetBits(this._mask);
    this._hashCount = this._hashIndex + 1;
  }
  get value() {
    return this._mask;
  }
  get level() {
    return 32 - Math.clz32(this._mask);
  }
  get hashIndex() {
    return this._hashIndex;
  }
  get hashCount() {
    return this._hashCount;
  }
  apply(level) {
    return new LevelMask(this._mask & (1 << level) - 1);
  }
  isSignificant(level) {
    let res = level === 0 || (this._mask >> level - 1) % 2 !== 0;
    return res;
  }
}
LevelMask$1.LevelMask = LevelMask;
function countSetBits(n) {
  n = n - (n >> 1 & 1431655765);
  n = (n & 858993459) + (n >> 2 & 858993459);
  return (n + (n >> 4) & 252645135) * 16843009 >> 24;
}
Object.defineProperty(exoticPruned$1, "__esModule", { value: true });
exoticPruned$1.exoticPruned = void 0;
const BitReader_1$1 = BitReader$1;
const LevelMask_1$2 = LevelMask$1;
function exoticPruned(bits, refs) {
  let reader2 = new BitReader_1$1.BitReader(bits);
  let type2 = reader2.loadUint(8);
  if (type2 !== 1) {
    throw new Error(`Pruned branch cell must have type 1, got "${type2}"`);
  }
  if (refs.length !== 0) {
    throw new Error(`Pruned Branch cell can't has refs, got "${refs.length}"`);
  }
  let mask;
  if (bits.length === 280) {
    mask = new LevelMask_1$2.LevelMask(1);
  } else {
    mask = new LevelMask_1$2.LevelMask(reader2.loadUint(8));
    if (mask.level < 1 || mask.level > 3) {
      throw new Error(`Pruned Branch cell level must be >= 1 and <= 3, got "${mask.level}/${mask.value}"`);
    }
    const size2 = 8 + 8 + mask.apply(mask.level - 1).hashCount * (256 + 16);
    if (bits.length !== size2) {
      throw new Error(`Pruned branch cell must have exactly ${size2} bits, got "${bits.length}"`);
    }
  }
  let pruned = [];
  let hashes = [];
  let depths = [];
  for (let i = 0; i < mask.level; i++) {
    hashes.push(reader2.loadBuffer(32));
  }
  for (let i = 0; i < mask.level; i++) {
    depths.push(reader2.loadUint(16));
  }
  for (let i = 0; i < mask.level; i++) {
    pruned.push({
      depth: depths[i],
      hash: hashes[i]
    });
  }
  return {
    mask: mask.value,
    pruned
  };
}
exoticPruned$1.exoticPruned = exoticPruned;
Object.defineProperty(resolveExotic$1, "__esModule", { value: true });
resolveExotic$1.resolveExotic = void 0;
const BitReader_1 = BitReader$1;
const CellType_1$2 = CellType;
const exoticMerkleProof_1$1 = exoticMerkleProof$1;
const exoticMerkleUpdate_1$1 = exoticMerkleUpdate$1;
const exoticPruned_1$1 = exoticPruned$1;
const LevelMask_1$1 = LevelMask$1;
function resolvePruned(bits, refs) {
  let pruned = (0, exoticPruned_1$1.exoticPruned)(bits, refs);
  let depths = [];
  let hashes = [];
  let mask = new LevelMask_1$1.LevelMask(pruned.mask);
  for (let i = 0; i < pruned.pruned.length; i++) {
    depths.push(pruned.pruned[i].depth);
    hashes.push(pruned.pruned[i].hash);
  }
  return {
    type: CellType_1$2.CellType.PrunedBranch,
    depths,
    hashes,
    mask
  };
}
function resolveMerkleProof(bits, refs) {
  (0, exoticMerkleProof_1$1.exoticMerkleProof)(bits, refs);
  let depths = [];
  let hashes = [];
  let mask = new LevelMask_1$1.LevelMask(refs[0].level() >> 1);
  return {
    type: CellType_1$2.CellType.MerkleProof,
    depths,
    hashes,
    mask
  };
}
function resolveMerkleUpdate(bits, refs) {
  (0, exoticMerkleUpdate_1$1.exoticMerkleUpdate)(bits, refs);
  let depths = [];
  let hashes = [];
  let mask = new LevelMask_1$1.LevelMask((refs[0].level() | refs[1].level()) >> 1);
  return {
    type: CellType_1$2.CellType.MerkleUpdate,
    depths,
    hashes,
    mask
  };
}
function resolveExotic(bits, refs) {
  let reader2 = new BitReader_1.BitReader(bits);
  let type2 = reader2.preloadUint(8);
  if (type2 === 1) {
    return resolvePruned(bits, refs);
  }
  if (type2 === 2) {
    throw new Error("Library cell must be loaded automatically");
  }
  if (type2 === 3) {
    return resolveMerkleProof(bits, refs);
  }
  if (type2 === 4) {
    return resolveMerkleUpdate(bits, refs);
  }
  throw Error("Invalid exotic cell type: " + type2);
}
resolveExotic$1.resolveExotic = resolveExotic;
var wonderCalculator$1 = {};
var descriptor = {};
Object.defineProperty(descriptor, "__esModule", { value: true });
descriptor.getRepr = descriptor.getBitsDescriptor = descriptor.getRefsDescriptor = void 0;
const CellType_1$1 = CellType;
const paddedBits_1 = requirePaddedBits();
function getRefsDescriptor(refs, level, type2) {
  return refs.length + (type2 !== CellType_1$1.CellType.Ordinary ? 1 : 0) * 8 + level * 32;
}
descriptor.getRefsDescriptor = getRefsDescriptor;
function getBitsDescriptor(bits) {
  let len = bits.length;
  return Math.ceil(len / 8) + Math.floor(len / 8);
}
descriptor.getBitsDescriptor = getBitsDescriptor;
function getRepr(bits, refs, level, type2) {
  const bitsLen = Math.ceil(bits.length / 8);
  const repr = Buffer.alloc(2 + bitsLen + (2 + 32) * refs.length);
  let reprCursor = 0;
  repr[reprCursor++] = getRefsDescriptor(refs, level, type2);
  repr[reprCursor++] = getBitsDescriptor(bits);
  (0, paddedBits_1.bitsToPaddedBuffer)(bits).copy(repr, reprCursor);
  reprCursor += bitsLen;
  for (const c of refs) {
    let childDepth;
    if (type2 == CellType_1$1.CellType.MerkleProof || type2 == CellType_1$1.CellType.MerkleUpdate) {
      childDepth = c.depth(level + 1);
    } else {
      childDepth = c.depth(level);
    }
    repr[reprCursor++] = Math.floor(childDepth / 256);
    repr[reprCursor++] = childDepth % 256;
  }
  for (const c of refs) {
    let childHash;
    if (type2 == CellType_1$1.CellType.MerkleProof || type2 == CellType_1$1.CellType.MerkleUpdate) {
      childHash = c.hash(level + 1);
    } else {
      childHash = c.hash(level);
    }
    childHash.copy(repr, reprCursor);
    reprCursor += 32;
  }
  return repr;
}
descriptor.getRepr = getRepr;
var dist = {};
var sha256$3 = {};
var shaExports = {};
var sha = {
  get exports() {
    return shaExports;
  },
  set exports(v) {
    shaExports = v;
  }
};
(function(module, exports) {
  !function(n, r) {
    module.exports = r();
  }(commonjsGlobal, function() {
    var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function r(n2, r2, t3, e2) {
      var i2, o2, u2, f2 = r2 || [0], w2 = (t3 = t3 || 0) >>> 3, s2 = -1 === e2 ? 3 : 0;
      for (i2 = 0; i2 < n2.length; i2 += 1)
        o2 = (u2 = i2 + w2) >>> 2, f2.length <= o2 && f2.push(0), f2[o2] |= n2[i2] << 8 * (s2 + e2 * (u2 % 4));
      return { value: f2, binLen: 8 * n2.length + t3 };
    }
    function t2(t3, e2, i2) {
      switch (e2) {
        case "UTF8":
        case "UTF16BE":
        case "UTF16LE":
          break;
        default:
          throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE");
      }
      switch (t3) {
        case "HEX":
          return function(n2, r2, t4) {
            return function(n3, r3, t5, e3) {
              var i3, o2, u2, f2;
              if (0 != n3.length % 2)
                throw new Error("String of HEX type must be in byte increments");
              var w2 = r3 || [0], s2 = (t5 = t5 || 0) >>> 3, a2 = -1 === e3 ? 3 : 0;
              for (i3 = 0; i3 < n3.length; i3 += 2) {
                if (o2 = parseInt(n3.substr(i3, 2), 16), isNaN(o2))
                  throw new Error("String of HEX type contains invalid characters");
                for (u2 = (f2 = (i3 >>> 1) + s2) >>> 2; w2.length <= u2; )
                  w2.push(0);
                w2[u2] |= o2 << 8 * (a2 + e3 * (f2 % 4));
              }
              return { value: w2, binLen: 4 * n3.length + t5 };
            }(n2, r2, t4, i2);
          };
        case "TEXT":
          return function(n2, r2, t4) {
            return function(n3, r3, t5, e3, i3) {
              var o2, u2, f2, w2, s2, a2, h2, c2, v2 = 0, A2 = t5 || [0], E2 = (e3 = e3 || 0) >>> 3;
              if ("UTF8" === r3)
                for (h2 = -1 === i3 ? 3 : 0, f2 = 0; f2 < n3.length; f2 += 1)
                  for (u2 = [], 128 > (o2 = n3.charCodeAt(f2)) ? u2.push(o2) : 2048 > o2 ? (u2.push(192 | o2 >>> 6), u2.push(128 | 63 & o2)) : 55296 > o2 || 57344 <= o2 ? u2.push(224 | o2 >>> 12, 128 | o2 >>> 6 & 63, 128 | 63 & o2) : (f2 += 1, o2 = 65536 + ((1023 & o2) << 10 | 1023 & n3.charCodeAt(f2)), u2.push(240 | o2 >>> 18, 128 | o2 >>> 12 & 63, 128 | o2 >>> 6 & 63, 128 | 63 & o2)), w2 = 0; w2 < u2.length; w2 += 1) {
                    for (s2 = (a2 = v2 + E2) >>> 2; A2.length <= s2; )
                      A2.push(0);
                    A2[s2] |= u2[w2] << 8 * (h2 + i3 * (a2 % 4)), v2 += 1;
                  }
              else
                for (h2 = -1 === i3 ? 2 : 0, c2 = "UTF16LE" === r3 && 1 !== i3 || "UTF16LE" !== r3 && 1 === i3, f2 = 0; f2 < n3.length; f2 += 1) {
                  for (o2 = n3.charCodeAt(f2), true === c2 && (o2 = (w2 = 255 & o2) << 8 | o2 >>> 8), s2 = (a2 = v2 + E2) >>> 2; A2.length <= s2; )
                    A2.push(0);
                  A2[s2] |= o2 << 8 * (h2 + i3 * (a2 % 4)), v2 += 2;
                }
              return { value: A2, binLen: 8 * v2 + e3 };
            }(n2, e2, r2, t4, i2);
          };
        case "B64":
          return function(r2, t4, e3) {
            return function(r3, t5, e4, i3) {
              var o2, u2, f2, w2, s2, a2, h2 = 0, c2 = t5 || [0], v2 = (e4 = e4 || 0) >>> 3, A2 = -1 === i3 ? 3 : 0, E2 = r3.indexOf("=");
              if (-1 === r3.search(/^[a-zA-Z0-9=+/]+$/))
                throw new Error("Invalid character in base-64 string");
              if (r3 = r3.replace(/=/g, ""), -1 !== E2 && E2 < r3.length)
                throw new Error("Invalid '=' found in base-64 string");
              for (o2 = 0; o2 < r3.length; o2 += 4) {
                for (w2 = r3.substr(o2, 4), f2 = 0, u2 = 0; u2 < w2.length; u2 += 1)
                  f2 |= n.indexOf(w2.charAt(u2)) << 18 - 6 * u2;
                for (u2 = 0; u2 < w2.length - 1; u2 += 1) {
                  for (s2 = (a2 = h2 + v2) >>> 2; c2.length <= s2; )
                    c2.push(0);
                  c2[s2] |= (f2 >>> 16 - 8 * u2 & 255) << 8 * (A2 + i3 * (a2 % 4)), h2 += 1;
                }
              }
              return { value: c2, binLen: 8 * h2 + e4 };
            }(r2, t4, e3, i2);
          };
        case "BYTES":
          return function(n2, r2, t4) {
            return function(n3, r3, t5, e3) {
              var i3, o2, u2, f2, w2 = r3 || [0], s2 = (t5 = t5 || 0) >>> 3, a2 = -1 === e3 ? 3 : 0;
              for (o2 = 0; o2 < n3.length; o2 += 1)
                i3 = n3.charCodeAt(o2), u2 = (f2 = o2 + s2) >>> 2, w2.length <= u2 && w2.push(0), w2[u2] |= i3 << 8 * (a2 + e3 * (f2 % 4));
              return { value: w2, binLen: 8 * n3.length + t5 };
            }(n2, r2, t4, i2);
          };
        case "ARRAYBUFFER":
          try {
            new ArrayBuffer(0);
          } catch (n2) {
            throw new Error("ARRAYBUFFER not supported by this environment");
          }
          return function(n2, t4, e3) {
            return function(n3, t5, e4, i3) {
              return r(new Uint8Array(n3), t5, e4, i3);
            }(n2, t4, e3, i2);
          };
        case "UINT8ARRAY":
          try {
            new Uint8Array(0);
          } catch (n2) {
            throw new Error("UINT8ARRAY not supported by this environment");
          }
          return function(n2, t4, e3) {
            return r(n2, t4, e3, i2);
          };
        default:
          throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
      }
    }
    function e(r2, t3, e2, i2) {
      switch (r2) {
        case "HEX":
          return function(n2) {
            return function(n3, r3, t4, e3) {
              var i3, o2, u2 = "", f2 = r3 / 8, w2 = -1 === t4 ? 3 : 0;
              for (i3 = 0; i3 < f2; i3 += 1)
                o2 = n3[i3 >>> 2] >>> 8 * (w2 + t4 * (i3 % 4)), u2 += "0123456789abcdef".charAt(o2 >>> 4 & 15) + "0123456789abcdef".charAt(15 & o2);
              return e3.outputUpper ? u2.toUpperCase() : u2;
            }(n2, t3, e2, i2);
          };
        case "B64":
          return function(r3) {
            return function(r4, t4, e3, i3) {
              var o2, u2, f2, w2, s2, a2 = "", h2 = t4 / 8, c2 = -1 === e3 ? 3 : 0;
              for (o2 = 0; o2 < h2; o2 += 3)
                for (w2 = o2 + 1 < h2 ? r4[o2 + 1 >>> 2] : 0, s2 = o2 + 2 < h2 ? r4[o2 + 2 >>> 2] : 0, f2 = (r4[o2 >>> 2] >>> 8 * (c2 + e3 * (o2 % 4)) & 255) << 16 | (w2 >>> 8 * (c2 + e3 * ((o2 + 1) % 4)) & 255) << 8 | s2 >>> 8 * (c2 + e3 * ((o2 + 2) % 4)) & 255, u2 = 0; u2 < 4; u2 += 1)
                  a2 += 8 * o2 + 6 * u2 <= t4 ? n.charAt(f2 >>> 6 * (3 - u2) & 63) : i3.b64Pad;
              return a2;
            }(r3, t3, e2, i2);
          };
        case "BYTES":
          return function(n2) {
            return function(n3, r3, t4) {
              var e3, i3, o2 = "", u2 = r3 / 8, f2 = -1 === t4 ? 3 : 0;
              for (e3 = 0; e3 < u2; e3 += 1)
                i3 = n3[e3 >>> 2] >>> 8 * (f2 + t4 * (e3 % 4)) & 255, o2 += String.fromCharCode(i3);
              return o2;
            }(n2, t3, e2);
          };
        case "ARRAYBUFFER":
          try {
            new ArrayBuffer(0);
          } catch (n2) {
            throw new Error("ARRAYBUFFER not supported by this environment");
          }
          return function(n2) {
            return function(n3, r3, t4) {
              var e3, i3 = r3 / 8, o2 = new ArrayBuffer(i3), u2 = new Uint8Array(o2), f2 = -1 === t4 ? 3 : 0;
              for (e3 = 0; e3 < i3; e3 += 1)
                u2[e3] = n3[e3 >>> 2] >>> 8 * (f2 + t4 * (e3 % 4)) & 255;
              return o2;
            }(n2, t3, e2);
          };
        case "UINT8ARRAY":
          try {
            new Uint8Array(0);
          } catch (n2) {
            throw new Error("UINT8ARRAY not supported by this environment");
          }
          return function(n2) {
            return function(n3, r3, t4) {
              var e3, i3 = r3 / 8, o2 = -1 === t4 ? 3 : 0, u2 = new Uint8Array(i3);
              for (e3 = 0; e3 < i3; e3 += 1)
                u2[e3] = n3[e3 >>> 2] >>> 8 * (o2 + t4 * (e3 % 4)) & 255;
              return u2;
            }(n2, t3, e2);
          };
        default:
          throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
      }
    }
    var i = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], o = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], u = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], f = "Chosen SHA variant is not supported";
    function w(n2, r2) {
      var t3, e2, i2 = n2.binLen >>> 3, o2 = r2.binLen >>> 3, u2 = i2 << 3, f2 = 4 - i2 << 3;
      if (i2 % 4 != 0) {
        for (t3 = 0; t3 < o2; t3 += 4)
          e2 = i2 + t3 >>> 2, n2.value[e2] |= r2.value[t3 >>> 2] << u2, n2.value.push(0), n2.value[e2 + 1] |= r2.value[t3 >>> 2] >>> f2;
        return (n2.value.length << 2) - 4 >= o2 + i2 && n2.value.pop(), { value: n2.value, binLen: n2.binLen + r2.binLen };
      }
      return { value: n2.value.concat(r2.value), binLen: n2.binLen + r2.binLen };
    }
    function s(n2) {
      var r2 = { outputUpper: false, b64Pad: "=", outputLen: -1 }, t3 = n2 || {}, e2 = "Output length must be a multiple of 8";
      if (r2.outputUpper = t3.outputUpper || false, t3.b64Pad && (r2.b64Pad = t3.b64Pad), t3.outputLen) {
        if (t3.outputLen % 8 != 0)
          throw new Error(e2);
        r2.outputLen = t3.outputLen;
      } else if (t3.shakeLen) {
        if (t3.shakeLen % 8 != 0)
          throw new Error(e2);
        r2.outputLen = t3.shakeLen;
      }
      if ("boolean" != typeof r2.outputUpper)
        throw new Error("Invalid outputUpper formatting option");
      if ("string" != typeof r2.b64Pad)
        throw new Error("Invalid b64Pad formatting option");
      return r2;
    }
    function a(n2, r2, e2, i2) {
      var o2 = n2 + " must include a value and format";
      if (!r2) {
        if (!i2)
          throw new Error(o2);
        return i2;
      }
      if (void 0 === r2.value || !r2.format)
        throw new Error(o2);
      return t2(r2.format, r2.encoding || "UTF8", e2)(r2.value);
    }
    var h = function() {
      function n2(n3, r2, t3) {
        var e2 = t3 || {};
        if (this.t = r2, this.i = e2.encoding || "UTF8", this.numRounds = e2.numRounds || 1, isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds)
          throw new Error("numRounds must a integer >= 1");
        this.o = n3, this.u = [], this.s = 0, this.h = false, this.v = 0, this.A = false, this.l = [], this.H = [];
      }
      return n2.prototype.update = function(n3) {
        var r2, t3 = 0, e2 = this.S >>> 5, i2 = this.p(n3, this.u, this.s), o2 = i2.binLen, u2 = i2.value, f2 = o2 >>> 5;
        for (r2 = 0; r2 < f2; r2 += e2)
          t3 + this.S <= o2 && (this.m = this.R(u2.slice(r2, r2 + e2), this.m), t3 += this.S);
        this.v += t3, this.u = u2.slice(t3 >>> 5), this.s = o2 % this.S, this.h = true;
      }, n2.prototype.getHash = function(n3, r2) {
        var t3, i2, o2 = this.U, u2 = s(r2);
        if (this.T) {
          if (-1 === u2.outputLen)
            throw new Error("Output length must be specified in options");
          o2 = u2.outputLen;
        }
        var f2 = e(n3, o2, this.C, u2);
        if (this.A && this.F)
          return f2(this.F(u2));
        for (i2 = this.K(this.u.slice(), this.s, this.v, this.B(this.m), o2), t3 = 1; t3 < this.numRounds; t3 += 1)
          this.T && o2 % 32 != 0 && (i2[i2.length - 1] &= 16777215 >>> 24 - o2 % 32), i2 = this.K(i2, o2, 0, this.L(this.o), o2);
        return f2(i2);
      }, n2.prototype.setHMACKey = function(n3, r2, e2) {
        if (!this.g)
          throw new Error("Variant does not support HMAC");
        if (this.h)
          throw new Error("Cannot set MAC key after calling update");
        var i2 = t2(r2, (e2 || {}).encoding || "UTF8", this.C);
        this.k(i2(n3));
      }, n2.prototype.k = function(n3) {
        var r2, t3 = this.S >>> 3, e2 = t3 / 4 - 1;
        if (1 !== this.numRounds)
          throw new Error("Cannot set numRounds with MAC");
        if (this.A)
          throw new Error("MAC key already set");
        for (t3 < n3.binLen / 8 && (n3.value = this.K(n3.value, n3.binLen, 0, this.L(this.o), this.U)); n3.value.length <= e2; )
          n3.value.push(0);
        for (r2 = 0; r2 <= e2; r2 += 1)
          this.l[r2] = 909522486 ^ n3.value[r2], this.H[r2] = 1549556828 ^ n3.value[r2];
        this.m = this.R(this.l, this.m), this.v = this.S, this.A = true;
      }, n2.prototype.getHMAC = function(n3, r2) {
        var t3 = s(r2);
        return e(n3, this.U, this.C, t3)(this.Y());
      }, n2.prototype.Y = function() {
        var n3;
        if (!this.A)
          throw new Error("Cannot call getHMAC without first setting MAC key");
        var r2 = this.K(this.u.slice(), this.s, this.v, this.B(this.m), this.U);
        return n3 = this.R(this.H, this.L(this.o)), n3 = this.K(r2, this.U, this.S, n3, this.U);
      }, n2;
    }(), c = function(n2, r2) {
      return (c = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n3, r3) {
        n3.__proto__ = r3;
      } || function(n3, r3) {
        for (var t3 in r3)
          Object.prototype.hasOwnProperty.call(r3, t3) && (n3[t3] = r3[t3]);
      })(n2, r2);
    };
    function v(n2, r2) {
      function t3() {
        this.constructor = n2;
      }
      c(n2, r2), n2.prototype = null === r2 ? Object.create(r2) : (t3.prototype = r2.prototype, new t3());
    }
    function A(n2, r2) {
      return n2 << r2 | n2 >>> 32 - r2;
    }
    function E(n2, r2) {
      return n2 >>> r2 | n2 << 32 - r2;
    }
    function l(n2, r2) {
      return n2 >>> r2;
    }
    function b(n2, r2, t3) {
      return n2 ^ r2 ^ t3;
    }
    function H(n2, r2, t3) {
      return n2 & r2 ^ ~n2 & t3;
    }
    function d(n2, r2, t3) {
      return n2 & r2 ^ n2 & t3 ^ r2 & t3;
    }
    function S(n2) {
      return E(n2, 2) ^ E(n2, 13) ^ E(n2, 22);
    }
    function p(n2, r2) {
      var t3 = (65535 & n2) + (65535 & r2);
      return (65535 & (n2 >>> 16) + (r2 >>> 16) + (t3 >>> 16)) << 16 | 65535 & t3;
    }
    function m(n2, r2, t3, e2) {
      var i2 = (65535 & n2) + (65535 & r2) + (65535 & t3) + (65535 & e2);
      return (65535 & (n2 >>> 16) + (r2 >>> 16) + (t3 >>> 16) + (e2 >>> 16) + (i2 >>> 16)) << 16 | 65535 & i2;
    }
    function y(n2, r2, t3, e2, i2) {
      var o2 = (65535 & n2) + (65535 & r2) + (65535 & t3) + (65535 & e2) + (65535 & i2);
      return (65535 & (n2 >>> 16) + (r2 >>> 16) + (t3 >>> 16) + (e2 >>> 16) + (i2 >>> 16) + (o2 >>> 16)) << 16 | 65535 & o2;
    }
    function R(n2) {
      return E(n2, 7) ^ E(n2, 18) ^ l(n2, 3);
    }
    function U(n2) {
      return E(n2, 6) ^ E(n2, 11) ^ E(n2, 25);
    }
    function T(n2) {
      return [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
    }
    function C(n2, r2) {
      var t3, e2, i2, o2, u2, f2, w2, s2 = [];
      for (t3 = r2[0], e2 = r2[1], i2 = r2[2], o2 = r2[3], u2 = r2[4], w2 = 0; w2 < 80; w2 += 1)
        s2[w2] = w2 < 16 ? n2[w2] : A(s2[w2 - 3] ^ s2[w2 - 8] ^ s2[w2 - 14] ^ s2[w2 - 16], 1), f2 = w2 < 20 ? y(A(t3, 5), H(e2, i2, o2), u2, 1518500249, s2[w2]) : w2 < 40 ? y(A(t3, 5), b(e2, i2, o2), u2, 1859775393, s2[w2]) : w2 < 60 ? y(A(t3, 5), d(e2, i2, o2), u2, 2400959708, s2[w2]) : y(A(t3, 5), b(e2, i2, o2), u2, 3395469782, s2[w2]), u2 = o2, o2 = i2, i2 = A(e2, 30), e2 = t3, t3 = f2;
      return r2[0] = p(t3, r2[0]), r2[1] = p(e2, r2[1]), r2[2] = p(i2, r2[2]), r2[3] = p(o2, r2[3]), r2[4] = p(u2, r2[4]), r2;
    }
    function F(n2, r2, t3, e2) {
      for (var i2, o2 = 15 + (r2 + 65 >>> 9 << 4), u2 = r2 + t3; n2.length <= o2; )
        n2.push(0);
      for (n2[r2 >>> 5] |= 128 << 24 - r2 % 32, n2[o2] = 4294967295 & u2, n2[o2 - 1] = u2 / 4294967296 | 0, i2 = 0; i2 < n2.length; i2 += 16)
        e2 = C(n2.slice(i2, i2 + 16), e2);
      return e2;
    }
    var K = function(n2) {
      function r2(r3, e2, i2) {
        var o2 = this;
        if ("SHA-1" !== r3)
          throw new Error(f);
        var u2 = i2 || {};
        return (o2 = n2.call(this, r3, e2, i2) || this).g = true, o2.F = o2.Y, o2.C = -1, o2.p = t2(o2.t, o2.i, o2.C), o2.R = C, o2.B = function(n3) {
          return n3.slice();
        }, o2.L = T, o2.K = F, o2.m = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], o2.S = 512, o2.U = 160, o2.T = false, u2.hmacKey && o2.k(a("hmacKey", u2.hmacKey, o2.C)), o2;
      }
      return v(r2, n2), r2;
    }(h);
    function B(n2) {
      return "SHA-224" == n2 ? o.slice() : u.slice();
    }
    function L(n2, r2) {
      var t3, e2, o2, u2, f2, w2, s2, a2, h2, c2, v2, A2, b2 = [];
      for (t3 = r2[0], e2 = r2[1], o2 = r2[2], u2 = r2[3], f2 = r2[4], w2 = r2[5], s2 = r2[6], a2 = r2[7], v2 = 0; v2 < 64; v2 += 1)
        b2[v2] = v2 < 16 ? n2[v2] : m(E(A2 = b2[v2 - 2], 17) ^ E(A2, 19) ^ l(A2, 10), b2[v2 - 7], R(b2[v2 - 15]), b2[v2 - 16]), h2 = y(a2, U(f2), H(f2, w2, s2), i[v2], b2[v2]), c2 = p(S(t3), d(t3, e2, o2)), a2 = s2, s2 = w2, w2 = f2, f2 = p(u2, h2), u2 = o2, o2 = e2, e2 = t3, t3 = p(h2, c2);
      return r2[0] = p(t3, r2[0]), r2[1] = p(e2, r2[1]), r2[2] = p(o2, r2[2]), r2[3] = p(u2, r2[3]), r2[4] = p(f2, r2[4]), r2[5] = p(w2, r2[5]), r2[6] = p(s2, r2[6]), r2[7] = p(a2, r2[7]), r2;
    }
    var g = function(n2) {
      function r2(r3, e2, i2) {
        var o2 = this;
        if ("SHA-224" !== r3 && "SHA-256" !== r3)
          throw new Error(f);
        var u2 = i2 || {};
        return (o2 = n2.call(this, r3, e2, i2) || this).F = o2.Y, o2.g = true, o2.C = -1, o2.p = t2(o2.t, o2.i, o2.C), o2.R = L, o2.B = function(n3) {
          return n3.slice();
        }, o2.L = B, o2.K = function(n3, t3, e3, i3) {
          return function(n4, r4, t4, e4, i4) {
            for (var o3, u3 = 15 + (r4 + 65 >>> 9 << 4), f2 = r4 + t4; n4.length <= u3; )
              n4.push(0);
            for (n4[r4 >>> 5] |= 128 << 24 - r4 % 32, n4[u3] = 4294967295 & f2, n4[u3 - 1] = f2 / 4294967296 | 0, o3 = 0; o3 < n4.length; o3 += 16)
              e4 = L(n4.slice(o3, o3 + 16), e4);
            return "SHA-224" === i4 ? [e4[0], e4[1], e4[2], e4[3], e4[4], e4[5], e4[6]] : e4;
          }(n3, t3, e3, i3, r3);
        }, o2.m = B(r3), o2.S = 512, o2.U = "SHA-224" === r3 ? 224 : 256, o2.T = false, u2.hmacKey && o2.k(a("hmacKey", u2.hmacKey, o2.C)), o2;
      }
      return v(r2, n2), r2;
    }(h), k = function(n2, r2) {
      this.N = n2, this.I = r2;
    };
    function Y(n2, r2) {
      var t3;
      return r2 > 32 ? (t3 = 64 - r2, new k(n2.I << r2 | n2.N >>> t3, n2.N << r2 | n2.I >>> t3)) : 0 !== r2 ? (t3 = 32 - r2, new k(n2.N << r2 | n2.I >>> t3, n2.I << r2 | n2.N >>> t3)) : n2;
    }
    function N(n2, r2) {
      var t3;
      return r2 < 32 ? (t3 = 32 - r2, new k(n2.N >>> r2 | n2.I << t3, n2.I >>> r2 | n2.N << t3)) : (t3 = 64 - r2, new k(n2.I >>> r2 | n2.N << t3, n2.N >>> r2 | n2.I << t3));
    }
    function I(n2, r2) {
      return new k(n2.N >>> r2, n2.I >>> r2 | n2.N << 32 - r2);
    }
    function M(n2, r2, t3) {
      return new k(n2.N & r2.N ^ ~n2.N & t3.N, n2.I & r2.I ^ ~n2.I & t3.I);
    }
    function X(n2, r2, t3) {
      return new k(n2.N & r2.N ^ n2.N & t3.N ^ r2.N & t3.N, n2.I & r2.I ^ n2.I & t3.I ^ r2.I & t3.I);
    }
    function z(n2) {
      var r2 = N(n2, 28), t3 = N(n2, 34), e2 = N(n2, 39);
      return new k(r2.N ^ t3.N ^ e2.N, r2.I ^ t3.I ^ e2.I);
    }
    function O(n2, r2) {
      var t3, e2;
      t3 = (65535 & n2.I) + (65535 & r2.I);
      var i2 = (65535 & (e2 = (n2.I >>> 16) + (r2.I >>> 16) + (t3 >>> 16))) << 16 | 65535 & t3;
      return t3 = (65535 & n2.N) + (65535 & r2.N) + (e2 >>> 16), e2 = (n2.N >>> 16) + (r2.N >>> 16) + (t3 >>> 16), new k((65535 & e2) << 16 | 65535 & t3, i2);
    }
    function j(n2, r2, t3, e2) {
      var i2, o2;
      i2 = (65535 & n2.I) + (65535 & r2.I) + (65535 & t3.I) + (65535 & e2.I);
      var u2 = (65535 & (o2 = (n2.I >>> 16) + (r2.I >>> 16) + (t3.I >>> 16) + (e2.I >>> 16) + (i2 >>> 16))) << 16 | 65535 & i2;
      return i2 = (65535 & n2.N) + (65535 & r2.N) + (65535 & t3.N) + (65535 & e2.N) + (o2 >>> 16), o2 = (n2.N >>> 16) + (r2.N >>> 16) + (t3.N >>> 16) + (e2.N >>> 16) + (i2 >>> 16), new k((65535 & o2) << 16 | 65535 & i2, u2);
    }
    function _2(n2, r2, t3, e2, i2) {
      var o2, u2;
      o2 = (65535 & n2.I) + (65535 & r2.I) + (65535 & t3.I) + (65535 & e2.I) + (65535 & i2.I);
      var f2 = (65535 & (u2 = (n2.I >>> 16) + (r2.I >>> 16) + (t3.I >>> 16) + (e2.I >>> 16) + (i2.I >>> 16) + (o2 >>> 16))) << 16 | 65535 & o2;
      return o2 = (65535 & n2.N) + (65535 & r2.N) + (65535 & t3.N) + (65535 & e2.N) + (65535 & i2.N) + (u2 >>> 16), u2 = (n2.N >>> 16) + (r2.N >>> 16) + (t3.N >>> 16) + (e2.N >>> 16) + (i2.N >>> 16) + (o2 >>> 16), new k((65535 & u2) << 16 | 65535 & o2, f2);
    }
    function P(n2, r2) {
      return new k(n2.N ^ r2.N, n2.I ^ r2.I);
    }
    function x(n2) {
      var r2 = N(n2, 1), t3 = N(n2, 8), e2 = I(n2, 7);
      return new k(r2.N ^ t3.N ^ e2.N, r2.I ^ t3.I ^ e2.I);
    }
    function V(n2) {
      var r2 = N(n2, 14), t3 = N(n2, 18), e2 = N(n2, 41);
      return new k(r2.N ^ t3.N ^ e2.N, r2.I ^ t3.I ^ e2.I);
    }
    var Z = [new k(i[0], 3609767458), new k(i[1], 602891725), new k(i[2], 3964484399), new k(i[3], 2173295548), new k(i[4], 4081628472), new k(i[5], 3053834265), new k(i[6], 2937671579), new k(i[7], 3664609560), new k(i[8], 2734883394), new k(i[9], 1164996542), new k(i[10], 1323610764), new k(i[11], 3590304994), new k(i[12], 4068182383), new k(i[13], 991336113), new k(i[14], 633803317), new k(i[15], 3479774868), new k(i[16], 2666613458), new k(i[17], 944711139), new k(i[18], 2341262773), new k(i[19], 2007800933), new k(i[20], 1495990901), new k(i[21], 1856431235), new k(i[22], 3175218132), new k(i[23], 2198950837), new k(i[24], 3999719339), new k(i[25], 766784016), new k(i[26], 2566594879), new k(i[27], 3203337956), new k(i[28], 1034457026), new k(i[29], 2466948901), new k(i[30], 3758326383), new k(i[31], 168717936), new k(i[32], 1188179964), new k(i[33], 1546045734), new k(i[34], 1522805485), new k(i[35], 2643833823), new k(i[36], 2343527390), new k(i[37], 1014477480), new k(i[38], 1206759142), new k(i[39], 344077627), new k(i[40], 1290863460), new k(i[41], 3158454273), new k(i[42], 3505952657), new k(i[43], 106217008), new k(i[44], 3606008344), new k(i[45], 1432725776), new k(i[46], 1467031594), new k(i[47], 851169720), new k(i[48], 3100823752), new k(i[49], 1363258195), new k(i[50], 3750685593), new k(i[51], 3785050280), new k(i[52], 3318307427), new k(i[53], 3812723403), new k(i[54], 2003034995), new k(i[55], 3602036899), new k(i[56], 1575990012), new k(i[57], 1125592928), new k(i[58], 2716904306), new k(i[59], 442776044), new k(i[60], 593698344), new k(i[61], 3733110249), new k(i[62], 2999351573), new k(i[63], 3815920427), new k(3391569614, 3928383900), new k(3515267271, 566280711), new k(3940187606, 3454069534), new k(4118630271, 4000239992), new k(116418474, 1914138554), new k(174292421, 2731055270), new k(289380356, 3203993006), new k(460393269, 320620315), new k(685471733, 587496836), new k(852142971, 1086792851), new k(1017036298, 365543100), new k(1126000580, 2618297676), new k(1288033470, 3409855158), new k(1501505948, 4234509866), new k(1607167915, 987167468), new k(1816402316, 1246189591)];
    function q(n2) {
      return "SHA-384" === n2 ? [new k(3418070365, o[0]), new k(1654270250, o[1]), new k(2438529370, o[2]), new k(355462360, o[3]), new k(1731405415, o[4]), new k(41048885895, o[5]), new k(3675008525, o[6]), new k(1203062813, o[7])] : [new k(u[0], 4089235720), new k(u[1], 2227873595), new k(u[2], 4271175723), new k(u[3], 1595750129), new k(u[4], 2917565137), new k(u[5], 725511199), new k(u[6], 4215389547), new k(u[7], 327033209)];
    }
    function D(n2, r2) {
      var t3, e2, i2, o2, u2, f2, w2, s2, a2, h2, c2, v2, A2, E2, l2, b2, H2 = [];
      for (t3 = r2[0], e2 = r2[1], i2 = r2[2], o2 = r2[3], u2 = r2[4], f2 = r2[5], w2 = r2[6], s2 = r2[7], c2 = 0; c2 < 80; c2 += 1)
        c2 < 16 ? (v2 = 2 * c2, H2[c2] = new k(n2[v2], n2[v2 + 1])) : H2[c2] = j((A2 = H2[c2 - 2], E2 = void 0, l2 = void 0, b2 = void 0, E2 = N(A2, 19), l2 = N(A2, 61), b2 = I(A2, 6), new k(E2.N ^ l2.N ^ b2.N, E2.I ^ l2.I ^ b2.I)), H2[c2 - 7], x(H2[c2 - 15]), H2[c2 - 16]), a2 = _2(s2, V(u2), M(u2, f2, w2), Z[c2], H2[c2]), h2 = O(z(t3), X(t3, e2, i2)), s2 = w2, w2 = f2, f2 = u2, u2 = O(o2, a2), o2 = i2, i2 = e2, e2 = t3, t3 = O(a2, h2);
      return r2[0] = O(t3, r2[0]), r2[1] = O(e2, r2[1]), r2[2] = O(i2, r2[2]), r2[3] = O(o2, r2[3]), r2[4] = O(u2, r2[4]), r2[5] = O(f2, r2[5]), r2[6] = O(w2, r2[6]), r2[7] = O(s2, r2[7]), r2;
    }
    var G = function(n2) {
      function r2(r3, e2, i2) {
        var o2 = this;
        if ("SHA-384" !== r3 && "SHA-512" !== r3)
          throw new Error(f);
        var u2 = i2 || {};
        return (o2 = n2.call(this, r3, e2, i2) || this).F = o2.Y, o2.g = true, o2.C = -1, o2.p = t2(o2.t, o2.i, o2.C), o2.R = D, o2.B = function(n3) {
          return n3.slice();
        }, o2.L = q, o2.K = function(n3, t3, e3, i3) {
          return function(n4, r4, t4, e4, i4) {
            for (var o3, u3 = 31 + (r4 + 129 >>> 10 << 5), f2 = r4 + t4; n4.length <= u3; )
              n4.push(0);
            for (n4[r4 >>> 5] |= 128 << 24 - r4 % 32, n4[u3] = 4294967295 & f2, n4[u3 - 1] = f2 / 4294967296 | 0, o3 = 0; o3 < n4.length; o3 += 32)
              e4 = D(n4.slice(o3, o3 + 32), e4);
            return "SHA-384" === i4 ? [(e4 = e4)[0].N, e4[0].I, e4[1].N, e4[1].I, e4[2].N, e4[2].I, e4[3].N, e4[3].I, e4[4].N, e4[4].I, e4[5].N, e4[5].I] : [e4[0].N, e4[0].I, e4[1].N, e4[1].I, e4[2].N, e4[2].I, e4[3].N, e4[3].I, e4[4].N, e4[4].I, e4[5].N, e4[5].I, e4[6].N, e4[6].I, e4[7].N, e4[7].I];
          }(n3, t3, e3, i3, r3);
        }, o2.m = q(r3), o2.S = 1024, o2.U = "SHA-384" === r3 ? 384 : 512, o2.T = false, u2.hmacKey && o2.k(a("hmacKey", u2.hmacKey, o2.C)), o2;
      }
      return v(r2, n2), r2;
    }(h), J = [new k(0, 1), new k(0, 32898), new k(2147483648, 32906), new k(2147483648, 2147516416), new k(0, 32907), new k(0, 2147483649), new k(2147483648, 2147516545), new k(2147483648, 32777), new k(0, 138), new k(0, 136), new k(0, 2147516425), new k(0, 2147483658), new k(0, 2147516555), new k(2147483648, 139), new k(2147483648, 32905), new k(2147483648, 32771), new k(2147483648, 32770), new k(2147483648, 128), new k(0, 32778), new k(2147483648, 2147483658), new k(2147483648, 2147516545), new k(2147483648, 32896), new k(0, 2147483649), new k(2147483648, 2147516424)], Q = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]];
    function W(n2) {
      var r2, t3 = [];
      for (r2 = 0; r2 < 5; r2 += 1)
        t3[r2] = [new k(0, 0), new k(0, 0), new k(0, 0), new k(0, 0), new k(0, 0)];
      return t3;
    }
    function $(n2) {
      var r2, t3 = [];
      for (r2 = 0; r2 < 5; r2 += 1)
        t3[r2] = n2[r2].slice();
      return t3;
    }
    function nn(n2, r2) {
      var t3, e2, i2, o2, u2, f2, w2, s2, a2, h2 = [], c2 = [];
      if (null !== n2)
        for (e2 = 0; e2 < n2.length; e2 += 2)
          r2[(e2 >>> 1) % 5][(e2 >>> 1) / 5 | 0] = P(r2[(e2 >>> 1) % 5][(e2 >>> 1) / 5 | 0], new k(n2[e2 + 1], n2[e2]));
      for (t3 = 0; t3 < 24; t3 += 1) {
        for (o2 = W(), e2 = 0; e2 < 5; e2 += 1)
          h2[e2] = (u2 = r2[e2][0], f2 = r2[e2][1], w2 = r2[e2][2], s2 = r2[e2][3], a2 = r2[e2][4], new k(u2.N ^ f2.N ^ w2.N ^ s2.N ^ a2.N, u2.I ^ f2.I ^ w2.I ^ s2.I ^ a2.I));
        for (e2 = 0; e2 < 5; e2 += 1)
          c2[e2] = P(h2[(e2 + 4) % 5], Y(h2[(e2 + 1) % 5], 1));
        for (e2 = 0; e2 < 5; e2 += 1)
          for (i2 = 0; i2 < 5; i2 += 1)
            r2[e2][i2] = P(r2[e2][i2], c2[e2]);
        for (e2 = 0; e2 < 5; e2 += 1)
          for (i2 = 0; i2 < 5; i2 += 1)
            o2[i2][(2 * e2 + 3 * i2) % 5] = Y(r2[e2][i2], Q[e2][i2]);
        for (e2 = 0; e2 < 5; e2 += 1)
          for (i2 = 0; i2 < 5; i2 += 1)
            r2[e2][i2] = P(o2[e2][i2], new k(~o2[(e2 + 1) % 5][i2].N & o2[(e2 + 2) % 5][i2].N, ~o2[(e2 + 1) % 5][i2].I & o2[(e2 + 2) % 5][i2].I));
        r2[0][0] = P(r2[0][0], J[t3]);
      }
      return r2;
    }
    function rn(n2) {
      var r2, t3, e2 = 0, i2 = [0, 0], o2 = [4294967295 & n2, n2 / 4294967296 & 2097151];
      for (r2 = 6; r2 >= 0; r2--)
        0 === (t3 = o2[r2 >> 2] >>> 8 * r2 & 255) && 0 === e2 || (i2[e2 + 1 >> 2] |= t3 << 8 * (e2 + 1), e2 += 1);
      return e2 = 0 !== e2 ? e2 : 1, i2[0] |= e2, { value: e2 + 1 > 4 ? i2 : [i2[0]], binLen: 8 + 8 * e2 };
    }
    function tn(n2) {
      return w(rn(n2.binLen), n2);
    }
    function en(n2, r2) {
      var t3, e2 = rn(r2), i2 = r2 >>> 2, o2 = (i2 - (e2 = w(e2, n2)).value.length % i2) % i2;
      for (t3 = 0; t3 < o2; t3++)
        e2.value.push(0);
      return e2.value;
    }
    var on = function(n2) {
      function r2(r3, e2, i2) {
        var o2 = this, u2 = 6, w2 = 0, s2 = i2 || {};
        if (1 !== (o2 = n2.call(this, r3, e2, i2) || this).numRounds) {
          if (s2.kmacKey || s2.hmacKey)
            throw new Error("Cannot set numRounds with MAC");
          if ("CSHAKE128" === o2.o || "CSHAKE256" === o2.o)
            throw new Error("Cannot set numRounds for CSHAKE variants");
        }
        switch (o2.C = 1, o2.p = t2(o2.t, o2.i, o2.C), o2.R = nn, o2.B = $, o2.L = W, o2.m = W(), o2.T = false, r3) {
          case "SHA3-224":
            o2.S = w2 = 1152, o2.U = 224, o2.g = true, o2.F = o2.Y;
            break;
          case "SHA3-256":
            o2.S = w2 = 1088, o2.U = 256, o2.g = true, o2.F = o2.Y;
            break;
          case "SHA3-384":
            o2.S = w2 = 832, o2.U = 384, o2.g = true, o2.F = o2.Y;
            break;
          case "SHA3-512":
            o2.S = w2 = 576, o2.U = 512, o2.g = true, o2.F = o2.Y;
            break;
          case "SHAKE128":
            u2 = 31, o2.S = w2 = 1344, o2.U = -1, o2.T = true, o2.g = false, o2.F = null;
            break;
          case "SHAKE256":
            u2 = 31, o2.S = w2 = 1088, o2.U = -1, o2.T = true, o2.g = false, o2.F = null;
            break;
          case "KMAC128":
            u2 = 4, o2.S = w2 = 1344, o2.M(i2), o2.U = -1, o2.T = true, o2.g = false, o2.F = o2.X;
            break;
          case "KMAC256":
            u2 = 4, o2.S = w2 = 1088, o2.M(i2), o2.U = -1, o2.T = true, o2.g = false, o2.F = o2.X;
            break;
          case "CSHAKE128":
            o2.S = w2 = 1344, u2 = o2.O(i2), o2.U = -1, o2.T = true, o2.g = false, o2.F = null;
            break;
          case "CSHAKE256":
            o2.S = w2 = 1088, u2 = o2.O(i2), o2.U = -1, o2.T = true, o2.g = false, o2.F = null;
            break;
          default:
            throw new Error(f);
        }
        return o2.K = function(n3, r4, t3, e3, i3) {
          return function(n4, r5, t4, e4, i4, o3, u3) {
            var f2, w3, s3 = 0, a2 = [], h2 = i4 >>> 5, c2 = r5 >>> 5;
            for (f2 = 0; f2 < c2 && r5 >= i4; f2 += h2)
              e4 = nn(n4.slice(f2, f2 + h2), e4), r5 -= i4;
            for (n4 = n4.slice(f2), r5 %= i4; n4.length < h2; )
              n4.push(0);
            for (n4[(f2 = r5 >>> 3) >> 2] ^= o3 << f2 % 4 * 8, n4[h2 - 1] ^= 2147483648, e4 = nn(n4, e4); 32 * a2.length < u3 && (w3 = e4[s3 % 5][s3 / 5 | 0], a2.push(w3.I), !(32 * a2.length >= u3)); )
              a2.push(w3.N), 0 == 64 * (s3 += 1) % i4 && (nn(null, e4), s3 = 0);
            return a2;
          }(n3, r4, 0, e3, w2, u2, i3);
        }, s2.hmacKey && o2.k(a("hmacKey", s2.hmacKey, o2.C)), o2;
      }
      return v(r2, n2), r2.prototype.O = function(n3, r3) {
        var t3 = function(n4) {
          var r4 = n4 || {};
          return { funcName: a("funcName", r4.funcName, 1, { value: [], binLen: 0 }), customization: a("Customization", r4.customization, 1, { value: [], binLen: 0 }) };
        }(n3 || {});
        r3 && (t3.funcName = r3);
        var e2 = w(tn(t3.funcName), tn(t3.customization));
        if (0 !== t3.customization.binLen || 0 !== t3.funcName.binLen) {
          for (var i2 = en(e2, this.S >>> 3), o2 = 0; o2 < i2.length; o2 += this.S >>> 5)
            this.m = this.R(i2.slice(o2, o2 + (this.S >>> 5)), this.m), this.v += this.S;
          return 4;
        }
        return 31;
      }, r2.prototype.M = function(n3) {
        var r3 = function(n4) {
          var r4 = n4 || {};
          return { kmacKey: a("kmacKey", r4.kmacKey, 1), funcName: { value: [1128353099], binLen: 32 }, customization: a("Customization", r4.customization, 1, { value: [], binLen: 0 }) };
        }(n3 || {});
        this.O(n3, r3.funcName);
        for (var t3 = en(tn(r3.kmacKey), this.S >>> 3), e2 = 0; e2 < t3.length; e2 += this.S >>> 5)
          this.m = this.R(t3.slice(e2, e2 + (this.S >>> 5)), this.m), this.v += this.S;
        this.A = true;
      }, r2.prototype.X = function(n3) {
        var r3 = w({ value: this.u.slice(), binLen: this.s }, function(n4) {
          var r4, t3, e2 = 0, i2 = [0, 0], o2 = [4294967295 & n4, n4 / 4294967296 & 2097151];
          for (r4 = 6; r4 >= 0; r4--)
            0 == (t3 = o2[r4 >> 2] >>> 8 * r4 & 255) && 0 === e2 || (i2[e2 >> 2] |= t3 << 8 * e2, e2 += 1);
          return i2[(e2 = 0 !== e2 ? e2 : 1) >> 2] |= e2 << 8 * e2, { value: e2 + 1 > 4 ? i2 : [i2[0]], binLen: 8 + 8 * e2 };
        }(n3.outputLen));
        return this.K(r3.value, r3.binLen, this.v, this.B(this.m), n3.outputLen);
      }, r2;
    }(h);
    return function() {
      function n2(n3, r2, t3) {
        if ("SHA-1" == n3)
          this.j = new K(n3, r2, t3);
        else if ("SHA-224" == n3 || "SHA-256" == n3)
          this.j = new g(n3, r2, t3);
        else if ("SHA-384" == n3 || "SHA-512" == n3)
          this.j = new G(n3, r2, t3);
        else {
          if ("SHA3-224" != n3 && "SHA3-256" != n3 && "SHA3-384" != n3 && "SHA3-512" != n3 && "SHAKE128" != n3 && "SHAKE256" != n3 && "CSHAKE128" != n3 && "CSHAKE256" != n3 && "KMAC128" != n3 && "KMAC256" != n3)
            throw new Error(f);
          this.j = new on(n3, r2, t3);
        }
      }
      return n2.prototype.update = function(n3) {
        this.j.update(n3);
      }, n2.prototype.getHash = function(n3, r2) {
        return this.j.getHash(n3, r2);
      }, n2.prototype.setHMACKey = function(n3, r2, t3) {
        this.j.setHMACKey(n3, r2, t3);
      }, n2.prototype.getHMAC = function(n3, r2) {
        return this.j.getHMAC(n3, r2);
      }, n2;
    }();
  });
})(sha);
var browser = {};
var getSecureRandom$1 = {};
Object.defineProperty(getSecureRandom$1, "__esModule", { value: true });
getSecureRandom$1.getSecureRandomWords = getSecureRandom$1.getSecureRandomBytes = void 0;
function getSecureRandomBytes$1(size2) {
  return Buffer.from(window.crypto.getRandomValues(new Uint8Array(size2)));
}
getSecureRandom$1.getSecureRandomBytes = getSecureRandomBytes$1;
function getSecureRandomWords$1(size2) {
  return window.crypto.getRandomValues(new Uint16Array(size2));
}
getSecureRandom$1.getSecureRandomWords = getSecureRandomWords$1;
var hmac_sha512$3 = {};
Object.defineProperty(hmac_sha512$3, "__esModule", { value: true });
hmac_sha512$3.hmac_sha512 = void 0;
async function hmac_sha512$2(key, data2) {
  let keyBuffer = typeof key === "string" ? Buffer.from(key, "utf-8") : key;
  let dataBuffer = typeof data2 === "string" ? Buffer.from(data2, "utf-8") : data2;
  const hmacAlgo = { name: "HMAC", hash: "SHA-512" };
  const hmacKey = await window.crypto.subtle.importKey("raw", keyBuffer, hmacAlgo, false, ["sign"]);
  return Buffer.from(await crypto.subtle.sign(hmacAlgo, hmacKey, dataBuffer));
}
hmac_sha512$3.hmac_sha512 = hmac_sha512$2;
var pbkdf2_sha512$3 = {};
Object.defineProperty(pbkdf2_sha512$3, "__esModule", { value: true });
pbkdf2_sha512$3.pbkdf2_sha512 = void 0;
async function pbkdf2_sha512$2(key, salt, iterations, keyLen) {
  const keyBuffer = typeof key === "string" ? Buffer.from(key, "utf-8") : key;
  const saltBuffer = typeof salt === "string" ? Buffer.from(salt, "utf-8") : salt;
  const pbkdf2_key = await window.crypto.subtle.importKey("raw", keyBuffer, { name: "PBKDF2" }, false, ["deriveBits"]);
  const derivedBits = await window.crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-512", salt: saltBuffer, iterations }, pbkdf2_key, keyLen * 8);
  return Buffer.from(derivedBits);
}
pbkdf2_sha512$3.pbkdf2_sha512 = pbkdf2_sha512$2;
var sha256$2 = {};
Object.defineProperty(sha256$2, "__esModule", { value: true });
sha256$2.sha256 = void 0;
async function sha256$1(source) {
  if (typeof source === "string") {
    return Buffer.from(await crypto.subtle.digest("SHA-256", Buffer.from(source, "utf-8")));
  }
  return Buffer.from(await crypto.subtle.digest("SHA-256", source));
}
sha256$2.sha256 = sha256$1;
var sha512$3 = {};
Object.defineProperty(sha512$3, "__esModule", { value: true });
sha512$3.sha512 = void 0;
async function sha512$2(source) {
  if (typeof source === "string") {
    return Buffer.from(await crypto.subtle.digest("SHA-512", Buffer.from(source, "utf-8")));
  }
  return Buffer.from(await crypto.subtle.digest("SHA-512", source));
}
sha512$3.sha512 = sha512$2;
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.sha512 = exports.sha256 = exports.pbkdf2_sha512 = exports.hmac_sha512 = exports.getSecureRandomWords = exports.getSecureRandomBytes = void 0;
  var getSecureRandom_12 = getSecureRandom$1;
  Object.defineProperty(exports, "getSecureRandomBytes", { enumerable: true, get: function() {
    return getSecureRandom_12.getSecureRandomBytes;
  } });
  Object.defineProperty(exports, "getSecureRandomWords", { enumerable: true, get: function() {
    return getSecureRandom_12.getSecureRandomWords;
  } });
  var hmac_sha512_12 = hmac_sha512$3;
  Object.defineProperty(exports, "hmac_sha512", { enumerable: true, get: function() {
    return hmac_sha512_12.hmac_sha512;
  } });
  var pbkdf2_sha512_12 = pbkdf2_sha512$3;
  Object.defineProperty(exports, "pbkdf2_sha512", { enumerable: true, get: function() {
    return pbkdf2_sha512_12.pbkdf2_sha512;
  } });
  var sha256_1 = sha256$2;
  Object.defineProperty(exports, "sha256", { enumerable: true, get: function() {
    return sha256_1.sha256;
  } });
  var sha512_1 = sha512$3;
  Object.defineProperty(exports, "sha512", { enumerable: true, get: function() {
    return sha512_1.sha512;
  } });
})(browser);
var __importDefault$6 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(sha256$3, "__esModule", { value: true });
sha256$3.sha256 = sha256$3.sha256_fallback = sha256$3.sha256_sync = void 0;
const jssha_1$2 = __importDefault$6(shaExports);
const ton_crypto_primitives_1$4 = browser;
function sha256_sync(source) {
  let src2;
  if (typeof source === "string") {
    src2 = Buffer.from(source, "utf-8").toString("hex");
  } else {
    src2 = source.toString("hex");
  }
  let hasher = new jssha_1$2.default("SHA-256", "HEX");
  hasher.update(src2);
  let res = hasher.getHash("HEX");
  return Buffer.from(res, "hex");
}
sha256$3.sha256_sync = sha256_sync;
async function sha256_fallback(source) {
  return sha256_sync(source);
}
sha256$3.sha256_fallback = sha256_fallback;
function sha256(source) {
  return (0, ton_crypto_primitives_1$4.sha256)(source);
}
sha256$3.sha256 = sha256;
var sha512$1 = {};
var __importDefault$5 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(sha512$1, "__esModule", { value: true });
sha512$1.sha512 = sha512$1.sha512_fallback = sha512$1.sha512_sync = void 0;
const jssha_1$1 = __importDefault$5(shaExports);
const ton_crypto_primitives_1$3 = browser;
function sha512_sync(source) {
  let src2;
  if (typeof source === "string") {
    src2 = Buffer.from(source, "utf-8").toString("hex");
  } else {
    src2 = source.toString("hex");
  }
  let hasher = new jssha_1$1.default("SHA-512", "HEX");
  hasher.update(src2);
  let res = hasher.getHash("HEX");
  return Buffer.from(res, "hex");
}
sha512$1.sha512_sync = sha512_sync;
async function sha512_fallback(source) {
  return sha512_sync(source);
}
sha512$1.sha512_fallback = sha512_fallback;
async function sha512(source) {
  return (0, ton_crypto_primitives_1$3.sha512)(source);
}
sha512$1.sha512 = sha512;
var pbkdf2_sha512$1 = {};
Object.defineProperty(pbkdf2_sha512$1, "__esModule", { value: true });
pbkdf2_sha512$1.pbkdf2_sha512 = void 0;
const ton_crypto_primitives_1$2 = browser;
function pbkdf2_sha512(key, salt, iterations, keyLen) {
  return (0, ton_crypto_primitives_1$2.pbkdf2_sha512)(key, salt, iterations, keyLen);
}
pbkdf2_sha512$1.pbkdf2_sha512 = pbkdf2_sha512;
var hmac_sha512$1 = {};
var __importDefault$4 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(hmac_sha512$1, "__esModule", { value: true });
hmac_sha512$1.hmac_sha512 = hmac_sha512$1.hmac_sha512_fallback = void 0;
const jssha_1 = __importDefault$4(shaExports);
const ton_crypto_primitives_1$1 = browser;
async function hmac_sha512_fallback(key, data2) {
  let keyBuffer = typeof key === "string" ? Buffer.from(key, "utf-8") : key;
  let dataBuffer = typeof data2 === "string" ? Buffer.from(data2, "utf-8") : data2;
  const shaObj = new jssha_1.default("SHA-512", "HEX", {
    hmacKey: { value: keyBuffer.toString("hex"), format: "HEX" }
  });
  shaObj.update(dataBuffer.toString("hex"));
  const hmac = shaObj.getHash("HEX");
  return Buffer.from(hmac, "hex");
}
hmac_sha512$1.hmac_sha512_fallback = hmac_sha512_fallback;
function hmac_sha512(key, data2) {
  return (0, ton_crypto_primitives_1$1.hmac_sha512)(key, data2);
}
hmac_sha512$1.hmac_sha512 = hmac_sha512;
var getSecureRandom = {};
Object.defineProperty(getSecureRandom, "__esModule", { value: true });
getSecureRandom.getSecureRandomNumber = getSecureRandom.getSecureRandomWords = getSecureRandom.getSecureRandomBytes = void 0;
const ton_crypto_primitives_1 = browser;
async function getSecureRandomBytes(size2) {
  return (0, ton_crypto_primitives_1.getSecureRandomBytes)(size2);
}
getSecureRandom.getSecureRandomBytes = getSecureRandomBytes;
async function getSecureRandomWords(size2) {
  return getSecureRandomWords();
}
getSecureRandom.getSecureRandomWords = getSecureRandomWords;
async function getSecureRandomNumber(min2, max2) {
  let range2 = max2 - min2;
  var bitsNeeded = Math.ceil(Math.log2(range2));
  if (bitsNeeded > 53) {
    throw new Error("Range is too large");
  }
  var bytesNeeded = Math.ceil(bitsNeeded / 8);
  var mask = Math.pow(2, bitsNeeded) - 1;
  while (true) {
    let res = await getSecureRandomBytes(bitsNeeded);
    let power = (bytesNeeded - 1) * 8;
    let numberValue = 0;
    for (var i = 0; i < bytesNeeded; i++) {
      numberValue += res[i] * Math.pow(2, power);
      power -= 8;
    }
    numberValue = numberValue & mask;
    if (numberValue >= range2) {
      continue;
    }
    return min2 + numberValue;
  }
}
getSecureRandom.getSecureRandomNumber = getSecureRandomNumber;
var newSecureWords$1 = {};
var wordlist$1 = {};
Object.defineProperty(wordlist$1, "__esModule", { value: true });
wordlist$1.wordlist = void 0;
wordlist$1.wordlist = [
  "abacus",
  "abdomen",
  "abdominal",
  "abide",
  "abiding",
  "ability",
  "ablaze",
  "able",
  "abnormal",
  "abrasion",
  "abrasive",
  "abreast",
  "abridge",
  "abroad",
  "abruptly",
  "absence",
  "absentee",
  "absently",
  "absinthe",
  "absolute",
  "absolve",
  "abstain",
  "abstract",
  "absurd",
  "accent",
  "acclaim",
  "acclimate",
  "accompany",
  "account",
  "accuracy",
  "accurate",
  "accustom",
  "acetone",
  "achiness",
  "aching",
  "acid",
  "acorn",
  "acquaint",
  "acquire",
  "acre",
  "acrobat",
  "acronym",
  "acting",
  "action",
  "activate",
  "activator",
  "active",
  "activism",
  "activist",
  "activity",
  "actress",
  "acts",
  "acutely",
  "acuteness",
  "aeration",
  "aerobics",
  "aerosol",
  "aerospace",
  "afar",
  "affair",
  "affected",
  "affecting",
  "affection",
  "affidavit",
  "affiliate",
  "affirm",
  "affix",
  "afflicted",
  "affluent",
  "afford",
  "affront",
  "aflame",
  "afloat",
  "aflutter",
  "afoot",
  "afraid",
  "afterglow",
  "afterlife",
  "aftermath",
  "aftermost",
  "afternoon",
  "aged",
  "ageless",
  "agency",
  "agenda",
  "agent",
  "aggregate",
  "aghast",
  "agile",
  "agility",
  "aging",
  "agnostic",
  "agonize",
  "agonizing",
  "agony",
  "agreeable",
  "agreeably",
  "agreed",
  "agreeing",
  "agreement",
  "aground",
  "ahead",
  "ahoy",
  "aide",
  "aids",
  "aim",
  "ajar",
  "alabaster",
  "alarm",
  "albatross",
  "album",
  "alfalfa",
  "algebra",
  "algorithm",
  "alias",
  "alibi",
  "alienable",
  "alienate",
  "aliens",
  "alike",
  "alive",
  "alkaline",
  "alkalize",
  "almanac",
  "almighty",
  "almost",
  "aloe",
  "aloft",
  "aloha",
  "alone",
  "alongside",
  "aloof",
  "alphabet",
  "alright",
  "although",
  "altitude",
  "alto",
  "aluminum",
  "alumni",
  "always",
  "amaretto",
  "amaze",
  "amazingly",
  "amber",
  "ambiance",
  "ambiguity",
  "ambiguous",
  "ambition",
  "ambitious",
  "ambulance",
  "ambush",
  "amendable",
  "amendment",
  "amends",
  "amenity",
  "amiable",
  "amicably",
  "amid",
  "amigo",
  "amino",
  "amiss",
  "ammonia",
  "ammonium",
  "amnesty",
  "amniotic",
  "among",
  "amount",
  "amperage",
  "ample",
  "amplifier",
  "amplify",
  "amply",
  "amuck",
  "amulet",
  "amusable",
  "amused",
  "amusement",
  "amuser",
  "amusing",
  "anaconda",
  "anaerobic",
  "anagram",
  "anatomist",
  "anatomy",
  "anchor",
  "anchovy",
  "ancient",
  "android",
  "anemia",
  "anemic",
  "aneurism",
  "anew",
  "angelfish",
  "angelic",
  "anger",
  "angled",
  "angler",
  "angles",
  "angling",
  "angrily",
  "angriness",
  "anguished",
  "angular",
  "animal",
  "animate",
  "animating",
  "animation",
  "animator",
  "anime",
  "animosity",
  "ankle",
  "annex",
  "annotate",
  "announcer",
  "annoying",
  "annually",
  "annuity",
  "anointer",
  "another",
  "answering",
  "antacid",
  "antarctic",
  "anteater",
  "antelope",
  "antennae",
  "anthem",
  "anthill",
  "anthology",
  "antibody",
  "antics",
  "antidote",
  "antihero",
  "antiquely",
  "antiques",
  "antiquity",
  "antirust",
  "antitoxic",
  "antitrust",
  "antiviral",
  "antivirus",
  "antler",
  "antonym",
  "antsy",
  "anvil",
  "anybody",
  "anyhow",
  "anymore",
  "anyone",
  "anyplace",
  "anything",
  "anytime",
  "anyway",
  "anywhere",
  "aorta",
  "apache",
  "apostle",
  "appealing",
  "appear",
  "appease",
  "appeasing",
  "appendage",
  "appendix",
  "appetite",
  "appetizer",
  "applaud",
  "applause",
  "apple",
  "appliance",
  "applicant",
  "applied",
  "apply",
  "appointee",
  "appraisal",
  "appraiser",
  "apprehend",
  "approach",
  "approval",
  "approve",
  "apricot",
  "april",
  "apron",
  "aptitude",
  "aptly",
  "aqua",
  "aqueduct",
  "arbitrary",
  "arbitrate",
  "ardently",
  "area",
  "arena",
  "arguable",
  "arguably",
  "argue",
  "arise",
  "armadillo",
  "armband",
  "armchair",
  "armed",
  "armful",
  "armhole",
  "arming",
  "armless",
  "armoire",
  "armored",
  "armory",
  "armrest",
  "army",
  "aroma",
  "arose",
  "around",
  "arousal",
  "arrange",
  "array",
  "arrest",
  "arrival",
  "arrive",
  "arrogance",
  "arrogant",
  "arson",
  "art",
  "ascend",
  "ascension",
  "ascent",
  "ascertain",
  "ashamed",
  "ashen",
  "ashes",
  "ashy",
  "aside",
  "askew",
  "asleep",
  "asparagus",
  "aspect",
  "aspirate",
  "aspire",
  "aspirin",
  "astonish",
  "astound",
  "astride",
  "astrology",
  "astronaut",
  "astronomy",
  "astute",
  "atlantic",
  "atlas",
  "atom",
  "atonable",
  "atop",
  "atrium",
  "atrocious",
  "atrophy",
  "attach",
  "attain",
  "attempt",
  "attendant",
  "attendee",
  "attention",
  "attentive",
  "attest",
  "attic",
  "attire",
  "attitude",
  "attractor",
  "attribute",
  "atypical",
  "auction",
  "audacious",
  "audacity",
  "audible",
  "audibly",
  "audience",
  "audio",
  "audition",
  "augmented",
  "august",
  "authentic",
  "author",
  "autism",
  "autistic",
  "autograph",
  "automaker",
  "automated",
  "automatic",
  "autopilot",
  "available",
  "avalanche",
  "avatar",
  "avenge",
  "avenging",
  "avenue",
  "average",
  "aversion",
  "avert",
  "aviation",
  "aviator",
  "avid",
  "avoid",
  "await",
  "awaken",
  "award",
  "aware",
  "awhile",
  "awkward",
  "awning",
  "awoke",
  "awry",
  "axis",
  "babble",
  "babbling",
  "babied",
  "baboon",
  "backache",
  "backboard",
  "backboned",
  "backdrop",
  "backed",
  "backer",
  "backfield",
  "backfire",
  "backhand",
  "backing",
  "backlands",
  "backlash",
  "backless",
  "backlight",
  "backlit",
  "backlog",
  "backpack",
  "backpedal",
  "backrest",
  "backroom",
  "backshift",
  "backside",
  "backslid",
  "backspace",
  "backspin",
  "backstab",
  "backstage",
  "backtalk",
  "backtrack",
  "backup",
  "backward",
  "backwash",
  "backwater",
  "backyard",
  "bacon",
  "bacteria",
  "bacterium",
  "badass",
  "badge",
  "badland",
  "badly",
  "badness",
  "baffle",
  "baffling",
  "bagel",
  "bagful",
  "baggage",
  "bagged",
  "baggie",
  "bagginess",
  "bagging",
  "baggy",
  "bagpipe",
  "baguette",
  "baked",
  "bakery",
  "bakeshop",
  "baking",
  "balance",
  "balancing",
  "balcony",
  "balmy",
  "balsamic",
  "bamboo",
  "banana",
  "banish",
  "banister",
  "banjo",
  "bankable",
  "bankbook",
  "banked",
  "banker",
  "banking",
  "banknote",
  "bankroll",
  "banner",
  "bannister",
  "banshee",
  "banter",
  "barbecue",
  "barbed",
  "barbell",
  "barber",
  "barcode",
  "barge",
  "bargraph",
  "barista",
  "baritone",
  "barley",
  "barmaid",
  "barman",
  "barn",
  "barometer",
  "barrack",
  "barracuda",
  "barrel",
  "barrette",
  "barricade",
  "barrier",
  "barstool",
  "bartender",
  "barterer",
  "bash",
  "basically",
  "basics",
  "basil",
  "basin",
  "basis",
  "basket",
  "batboy",
  "batch",
  "bath",
  "baton",
  "bats",
  "battalion",
  "battered",
  "battering",
  "battery",
  "batting",
  "battle",
  "bauble",
  "bazooka",
  "blabber",
  "bladder",
  "blade",
  "blah",
  "blame",
  "blaming",
  "blanching",
  "blandness",
  "blank",
  "blaspheme",
  "blasphemy",
  "blast",
  "blatancy",
  "blatantly",
  "blazer",
  "blazing",
  "bleach",
  "bleak",
  "bleep",
  "blemish",
  "blend",
  "bless",
  "blighted",
  "blimp",
  "bling",
  "blinked",
  "blinker",
  "blinking",
  "blinks",
  "blip",
  "blissful",
  "blitz",
  "blizzard",
  "bloated",
  "bloating",
  "blob",
  "blog",
  "bloomers",
  "blooming",
  "blooper",
  "blot",
  "blouse",
  "blubber",
  "bluff",
  "bluish",
  "blunderer",
  "blunt",
  "blurb",
  "blurred",
  "blurry",
  "blurt",
  "blush",
  "blustery",
  "boaster",
  "boastful",
  "boasting",
  "boat",
  "bobbed",
  "bobbing",
  "bobble",
  "bobcat",
  "bobsled",
  "bobtail",
  "bodacious",
  "body",
  "bogged",
  "boggle",
  "bogus",
  "boil",
  "bok",
  "bolster",
  "bolt",
  "bonanza",
  "bonded",
  "bonding",
  "bondless",
  "boned",
  "bonehead",
  "boneless",
  "bonelike",
  "boney",
  "bonfire",
  "bonnet",
  "bonsai",
  "bonus",
  "bony",
  "boogeyman",
  "boogieman",
  "book",
  "boondocks",
  "booted",
  "booth",
  "bootie",
  "booting",
  "bootlace",
  "bootleg",
  "boots",
  "boozy",
  "borax",
  "boring",
  "borough",
  "borrower",
  "borrowing",
  "boss",
  "botanical",
  "botanist",
  "botany",
  "botch",
  "both",
  "bottle",
  "bottling",
  "bottom",
  "bounce",
  "bouncing",
  "bouncy",
  "bounding",
  "boundless",
  "bountiful",
  "bovine",
  "boxcar",
  "boxer",
  "boxing",
  "boxlike",
  "boxy",
  "breach",
  "breath",
  "breeches",
  "breeching",
  "breeder",
  "breeding",
  "breeze",
  "breezy",
  "brethren",
  "brewery",
  "brewing",
  "briar",
  "bribe",
  "brick",
  "bride",
  "bridged",
  "brigade",
  "bright",
  "brilliant",
  "brim",
  "bring",
  "brink",
  "brisket",
  "briskly",
  "briskness",
  "bristle",
  "brittle",
  "broadband",
  "broadcast",
  "broaden",
  "broadly",
  "broadness",
  "broadside",
  "broadways",
  "broiler",
  "broiling",
  "broken",
  "broker",
  "bronchial",
  "bronco",
  "bronze",
  "bronzing",
  "brook",
  "broom",
  "brought",
  "browbeat",
  "brownnose",
  "browse",
  "browsing",
  "bruising",
  "brunch",
  "brunette",
  "brunt",
  "brush",
  "brussels",
  "brute",
  "brutishly",
  "bubble",
  "bubbling",
  "bubbly",
  "buccaneer",
  "bucked",
  "bucket",
  "buckle",
  "buckshot",
  "buckskin",
  "bucktooth",
  "buckwheat",
  "buddhism",
  "buddhist",
  "budding",
  "buddy",
  "budget",
  "buffalo",
  "buffed",
  "buffer",
  "buffing",
  "buffoon",
  "buggy",
  "bulb",
  "bulge",
  "bulginess",
  "bulgur",
  "bulk",
  "bulldog",
  "bulldozer",
  "bullfight",
  "bullfrog",
  "bullhorn",
  "bullion",
  "bullish",
  "bullpen",
  "bullring",
  "bullseye",
  "bullwhip",
  "bully",
  "bunch",
  "bundle",
  "bungee",
  "bunion",
  "bunkbed",
  "bunkhouse",
  "bunkmate",
  "bunny",
  "bunt",
  "busboy",
  "bush",
  "busily",
  "busload",
  "bust",
  "busybody",
  "buzz",
  "cabana",
  "cabbage",
  "cabbie",
  "cabdriver",
  "cable",
  "caboose",
  "cache",
  "cackle",
  "cacti",
  "cactus",
  "caddie",
  "caddy",
  "cadet",
  "cadillac",
  "cadmium",
  "cage",
  "cahoots",
  "cake",
  "calamari",
  "calamity",
  "calcium",
  "calculate",
  "calculus",
  "caliber",
  "calibrate",
  "calm",
  "caloric",
  "calorie",
  "calzone",
  "camcorder",
  "cameo",
  "camera",
  "camisole",
  "camper",
  "campfire",
  "camping",
  "campsite",
  "campus",
  "canal",
  "canary",
  "cancel",
  "candied",
  "candle",
  "candy",
  "cane",
  "canine",
  "canister",
  "cannabis",
  "canned",
  "canning",
  "cannon",
  "cannot",
  "canola",
  "canon",
  "canopener",
  "canopy",
  "canteen",
  "canyon",
  "capable",
  "capably",
  "capacity",
  "cape",
  "capillary",
  "capital",
  "capitol",
  "capped",
  "capricorn",
  "capsize",
  "capsule",
  "caption",
  "captivate",
  "captive",
  "captivity",
  "capture",
  "caramel",
  "carat",
  "caravan",
  "carbon",
  "cardboard",
  "carded",
  "cardiac",
  "cardigan",
  "cardinal",
  "cardstock",
  "carefully",
  "caregiver",
  "careless",
  "caress",
  "caretaker",
  "cargo",
  "caring",
  "carless",
  "carload",
  "carmaker",
  "carnage",
  "carnation",
  "carnival",
  "carnivore",
  "carol",
  "carpenter",
  "carpentry",
  "carpool",
  "carport",
  "carried",
  "carrot",
  "carrousel",
  "carry",
  "cartel",
  "cartload",
  "carton",
  "cartoon",
  "cartridge",
  "cartwheel",
  "carve",
  "carving",
  "carwash",
  "cascade",
  "case",
  "cash",
  "casing",
  "casino",
  "casket",
  "cassette",
  "casually",
  "casualty",
  "catacomb",
  "catalog",
  "catalyst",
  "catalyze",
  "catapult",
  "cataract",
  "catatonic",
  "catcall",
  "catchable",
  "catcher",
  "catching",
  "catchy",
  "caterer",
  "catering",
  "catfight",
  "catfish",
  "cathedral",
  "cathouse",
  "catlike",
  "catnap",
  "catnip",
  "catsup",
  "cattail",
  "cattishly",
  "cattle",
  "catty",
  "catwalk",
  "caucasian",
  "caucus",
  "causal",
  "causation",
  "cause",
  "causing",
  "cauterize",
  "caution",
  "cautious",
  "cavalier",
  "cavalry",
  "caviar",
  "cavity",
  "cedar",
  "celery",
  "celestial",
  "celibacy",
  "celibate",
  "celtic",
  "cement",
  "census",
  "ceramics",
  "ceremony",
  "certainly",
  "certainty",
  "certified",
  "certify",
  "cesarean",
  "cesspool",
  "chafe",
  "chaffing",
  "chain",
  "chair",
  "chalice",
  "challenge",
  "chamber",
  "chamomile",
  "champion",
  "chance",
  "change",
  "channel",
  "chant",
  "chaos",
  "chaperone",
  "chaplain",
  "chapped",
  "chaps",
  "chapter",
  "character",
  "charbroil",
  "charcoal",
  "charger",
  "charging",
  "chariot",
  "charity",
  "charm",
  "charred",
  "charter",
  "charting",
  "chase",
  "chasing",
  "chaste",
  "chastise",
  "chastity",
  "chatroom",
  "chatter",
  "chatting",
  "chatty",
  "cheating",
  "cheddar",
  "cheek",
  "cheer",
  "cheese",
  "cheesy",
  "chef",
  "chemicals",
  "chemist",
  "chemo",
  "cherisher",
  "cherub",
  "chess",
  "chest",
  "chevron",
  "chevy",
  "chewable",
  "chewer",
  "chewing",
  "chewy",
  "chief",
  "chihuahua",
  "childcare",
  "childhood",
  "childish",
  "childless",
  "childlike",
  "chili",
  "chill",
  "chimp",
  "chip",
  "chirping",
  "chirpy",
  "chitchat",
  "chivalry",
  "chive",
  "chloride",
  "chlorine",
  "choice",
  "chokehold",
  "choking",
  "chomp",
  "chooser",
  "choosing",
  "choosy",
  "chop",
  "chosen",
  "chowder",
  "chowtime",
  "chrome",
  "chubby",
  "chuck",
  "chug",
  "chummy",
  "chump",
  "chunk",
  "churn",
  "chute",
  "cider",
  "cilantro",
  "cinch",
  "cinema",
  "cinnamon",
  "circle",
  "circling",
  "circular",
  "circulate",
  "circus",
  "citable",
  "citadel",
  "citation",
  "citizen",
  "citric",
  "citrus",
  "city",
  "civic",
  "civil",
  "clad",
  "claim",
  "clambake",
  "clammy",
  "clamor",
  "clamp",
  "clamshell",
  "clang",
  "clanking",
  "clapped",
  "clapper",
  "clapping",
  "clarify",
  "clarinet",
  "clarity",
  "clash",
  "clasp",
  "class",
  "clatter",
  "clause",
  "clavicle",
  "claw",
  "clay",
  "clean",
  "clear",
  "cleat",
  "cleaver",
  "cleft",
  "clench",
  "clergyman",
  "clerical",
  "clerk",
  "clever",
  "clicker",
  "client",
  "climate",
  "climatic",
  "cling",
  "clinic",
  "clinking",
  "clip",
  "clique",
  "cloak",
  "clobber",
  "clock",
  "clone",
  "cloning",
  "closable",
  "closure",
  "clothes",
  "clothing",
  "cloud",
  "clover",
  "clubbed",
  "clubbing",
  "clubhouse",
  "clump",
  "clumsily",
  "clumsy",
  "clunky",
  "clustered",
  "clutch",
  "clutter",
  "coach",
  "coagulant",
  "coastal",
  "coaster",
  "coasting",
  "coastland",
  "coastline",
  "coat",
  "coauthor",
  "cobalt",
  "cobbler",
  "cobweb",
  "cocoa",
  "coconut",
  "cod",
  "coeditor",
  "coerce",
  "coexist",
  "coffee",
  "cofounder",
  "cognition",
  "cognitive",
  "cogwheel",
  "coherence",
  "coherent",
  "cohesive",
  "coil",
  "coke",
  "cola",
  "cold",
  "coleslaw",
  "coliseum",
  "collage",
  "collapse",
  "collar",
  "collected",
  "collector",
  "collide",
  "collie",
  "collision",
  "colonial",
  "colonist",
  "colonize",
  "colony",
  "colossal",
  "colt",
  "coma",
  "come",
  "comfort",
  "comfy",
  "comic",
  "coming",
  "comma",
  "commence",
  "commend",
  "comment",
  "commerce",
  "commode",
  "commodity",
  "commodore",
  "common",
  "commotion",
  "commute",
  "commuting",
  "compacted",
  "compacter",
  "compactly",
  "compactor",
  "companion",
  "company",
  "compare",
  "compel",
  "compile",
  "comply",
  "component",
  "composed",
  "composer",
  "composite",
  "compost",
  "composure",
  "compound",
  "compress",
  "comprised",
  "computer",
  "computing",
  "comrade",
  "concave",
  "conceal",
  "conceded",
  "concept",
  "concerned",
  "concert",
  "conch",
  "concierge",
  "concise",
  "conclude",
  "concrete",
  "concur",
  "condense",
  "condiment",
  "condition",
  "condone",
  "conducive",
  "conductor",
  "conduit",
  "cone",
  "confess",
  "confetti",
  "confidant",
  "confident",
  "confider",
  "confiding",
  "configure",
  "confined",
  "confining",
  "confirm",
  "conflict",
  "conform",
  "confound",
  "confront",
  "confused",
  "confusing",
  "confusion",
  "congenial",
  "congested",
  "congrats",
  "congress",
  "conical",
  "conjoined",
  "conjure",
  "conjuror",
  "connected",
  "connector",
  "consensus",
  "consent",
  "console",
  "consoling",
  "consonant",
  "constable",
  "constant",
  "constrain",
  "constrict",
  "construct",
  "consult",
  "consumer",
  "consuming",
  "contact",
  "container",
  "contempt",
  "contend",
  "contented",
  "contently",
  "contents",
  "contest",
  "context",
  "contort",
  "contour",
  "contrite",
  "control",
  "contusion",
  "convene",
  "convent",
  "copartner",
  "cope",
  "copied",
  "copier",
  "copilot",
  "coping",
  "copious",
  "copper",
  "copy",
  "coral",
  "cork",
  "cornball",
  "cornbread",
  "corncob",
  "cornea",
  "corned",
  "corner",
  "cornfield",
  "cornflake",
  "cornhusk",
  "cornmeal",
  "cornstalk",
  "corny",
  "coronary",
  "coroner",
  "corporal",
  "corporate",
  "corral",
  "correct",
  "corridor",
  "corrode",
  "corroding",
  "corrosive",
  "corsage",
  "corset",
  "cortex",
  "cosigner",
  "cosmetics",
  "cosmic",
  "cosmos",
  "cosponsor",
  "cost",
  "cottage",
  "cotton",
  "couch",
  "cough",
  "could",
  "countable",
  "countdown",
  "counting",
  "countless",
  "country",
  "county",
  "courier",
  "covenant",
  "cover",
  "coveted",
  "coveting",
  "coyness",
  "cozily",
  "coziness",
  "cozy",
  "crabbing",
  "crabgrass",
  "crablike",
  "crabmeat",
  "cradle",
  "cradling",
  "crafter",
  "craftily",
  "craftsman",
  "craftwork",
  "crafty",
  "cramp",
  "cranberry",
  "crane",
  "cranial",
  "cranium",
  "crank",
  "crate",
  "crave",
  "craving",
  "crawfish",
  "crawlers",
  "crawling",
  "crayfish",
  "crayon",
  "crazed",
  "crazily",
  "craziness",
  "crazy",
  "creamed",
  "creamer",
  "creamlike",
  "crease",
  "creasing",
  "creatable",
  "create",
  "creation",
  "creative",
  "creature",
  "credible",
  "credibly",
  "credit",
  "creed",
  "creme",
  "creole",
  "crepe",
  "crept",
  "crescent",
  "crested",
  "cresting",
  "crestless",
  "crevice",
  "crewless",
  "crewman",
  "crewmate",
  "crib",
  "cricket",
  "cried",
  "crier",
  "crimp",
  "crimson",
  "cringe",
  "cringing",
  "crinkle",
  "crinkly",
  "crisped",
  "crisping",
  "crisply",
  "crispness",
  "crispy",
  "criteria",
  "critter",
  "croak",
  "crock",
  "crook",
  "croon",
  "crop",
  "cross",
  "crouch",
  "crouton",
  "crowbar",
  "crowd",
  "crown",
  "crucial",
  "crudely",
  "crudeness",
  "cruelly",
  "cruelness",
  "cruelty",
  "crumb",
  "crummiest",
  "crummy",
  "crumpet",
  "crumpled",
  "cruncher",
  "crunching",
  "crunchy",
  "crusader",
  "crushable",
  "crushed",
  "crusher",
  "crushing",
  "crust",
  "crux",
  "crying",
  "cryptic",
  "crystal",
  "cubbyhole",
  "cube",
  "cubical",
  "cubicle",
  "cucumber",
  "cuddle",
  "cuddly",
  "cufflink",
  "culinary",
  "culminate",
  "culpable",
  "culprit",
  "cultivate",
  "cultural",
  "culture",
  "cupbearer",
  "cupcake",
  "cupid",
  "cupped",
  "cupping",
  "curable",
  "curator",
  "curdle",
  "cure",
  "curfew",
  "curing",
  "curled",
  "curler",
  "curliness",
  "curling",
  "curly",
  "curry",
  "curse",
  "cursive",
  "cursor",
  "curtain",
  "curtly",
  "curtsy",
  "curvature",
  "curve",
  "curvy",
  "cushy",
  "cusp",
  "cussed",
  "custard",
  "custodian",
  "custody",
  "customary",
  "customer",
  "customize",
  "customs",
  "cut",
  "cycle",
  "cyclic",
  "cycling",
  "cyclist",
  "cylinder",
  "cymbal",
  "cytoplasm",
  "cytoplast",
  "dab",
  "dad",
  "daffodil",
  "dagger",
  "daily",
  "daintily",
  "dainty",
  "dairy",
  "daisy",
  "dallying",
  "dance",
  "dancing",
  "dandelion",
  "dander",
  "dandruff",
  "dandy",
  "danger",
  "dangle",
  "dangling",
  "daredevil",
  "dares",
  "daringly",
  "darkened",
  "darkening",
  "darkish",
  "darkness",
  "darkroom",
  "darling",
  "darn",
  "dart",
  "darwinism",
  "dash",
  "dastardly",
  "data",
  "datebook",
  "dating",
  "daughter",
  "daunting",
  "dawdler",
  "dawn",
  "daybed",
  "daybreak",
  "daycare",
  "daydream",
  "daylight",
  "daylong",
  "dayroom",
  "daytime",
  "dazzler",
  "dazzling",
  "deacon",
  "deafening",
  "deafness",
  "dealer",
  "dealing",
  "dealmaker",
  "dealt",
  "dean",
  "debatable",
  "debate",
  "debating",
  "debit",
  "debrief",
  "debtless",
  "debtor",
  "debug",
  "debunk",
  "decade",
  "decaf",
  "decal",
  "decathlon",
  "decay",
  "deceased",
  "deceit",
  "deceiver",
  "deceiving",
  "december",
  "decency",
  "decent",
  "deception",
  "deceptive",
  "decibel",
  "decidable",
  "decimal",
  "decimeter",
  "decipher",
  "deck",
  "declared",
  "decline",
  "decode",
  "decompose",
  "decorated",
  "decorator",
  "decoy",
  "decrease",
  "decree",
  "dedicate",
  "dedicator",
  "deduce",
  "deduct",
  "deed",
  "deem",
  "deepen",
  "deeply",
  "deepness",
  "deface",
  "defacing",
  "defame",
  "default",
  "defeat",
  "defection",
  "defective",
  "defendant",
  "defender",
  "defense",
  "defensive",
  "deferral",
  "deferred",
  "defiance",
  "defiant",
  "defile",
  "defiling",
  "define",
  "definite",
  "deflate",
  "deflation",
  "deflator",
  "deflected",
  "deflector",
  "defog",
  "deforest",
  "defraud",
  "defrost",
  "deftly",
  "defuse",
  "defy",
  "degraded",
  "degrading",
  "degrease",
  "degree",
  "dehydrate",
  "deity",
  "dejected",
  "delay",
  "delegate",
  "delegator",
  "delete",
  "deletion",
  "delicacy",
  "delicate",
  "delicious",
  "delighted",
  "delirious",
  "delirium",
  "deliverer",
  "delivery",
  "delouse",
  "delta",
  "deluge",
  "delusion",
  "deluxe",
  "demanding",
  "demeaning",
  "demeanor",
  "demise",
  "democracy",
  "democrat",
  "demote",
  "demotion",
  "demystify",
  "denatured",
  "deniable",
  "denial",
  "denim",
  "denote",
  "dense",
  "density",
  "dental",
  "dentist",
  "denture",
  "deny",
  "deodorant",
  "deodorize",
  "departed",
  "departure",
  "depict",
  "deplete",
  "depletion",
  "deplored",
  "deploy",
  "deport",
  "depose",
  "depraved",
  "depravity",
  "deprecate",
  "depress",
  "deprive",
  "depth",
  "deputize",
  "deputy",
  "derail",
  "deranged",
  "derby",
  "derived",
  "desecrate",
  "deserve",
  "deserving",
  "designate",
  "designed",
  "designer",
  "designing",
  "deskbound",
  "desktop",
  "deskwork",
  "desolate",
  "despair",
  "despise",
  "despite",
  "destiny",
  "destitute",
  "destruct",
  "detached",
  "detail",
  "detection",
  "detective",
  "detector",
  "detention",
  "detergent",
  "detest",
  "detonate",
  "detonator",
  "detoxify",
  "detract",
  "deuce",
  "devalue",
  "deviancy",
  "deviant",
  "deviate",
  "deviation",
  "deviator",
  "device",
  "devious",
  "devotedly",
  "devotee",
  "devotion",
  "devourer",
  "devouring",
  "devoutly",
  "dexterity",
  "dexterous",
  "diabetes",
  "diabetic",
  "diabolic",
  "diagnoses",
  "diagnosis",
  "diagram",
  "dial",
  "diameter",
  "diaper",
  "diaphragm",
  "diary",
  "dice",
  "dicing",
  "dictate",
  "dictation",
  "dictator",
  "difficult",
  "diffused",
  "diffuser",
  "diffusion",
  "diffusive",
  "dig",
  "dilation",
  "diligence",
  "diligent",
  "dill",
  "dilute",
  "dime",
  "diminish",
  "dimly",
  "dimmed",
  "dimmer",
  "dimness",
  "dimple",
  "diner",
  "dingbat",
  "dinghy",
  "dinginess",
  "dingo",
  "dingy",
  "dining",
  "dinner",
  "diocese",
  "dioxide",
  "diploma",
  "dipped",
  "dipper",
  "dipping",
  "directed",
  "direction",
  "directive",
  "directly",
  "directory",
  "direness",
  "dirtiness",
  "disabled",
  "disagree",
  "disallow",
  "disarm",
  "disarray",
  "disaster",
  "disband",
  "disbelief",
  "disburse",
  "discard",
  "discern",
  "discharge",
  "disclose",
  "discolor",
  "discount",
  "discourse",
  "discover",
  "discuss",
  "disdain",
  "disengage",
  "disfigure",
  "disgrace",
  "dish",
  "disinfect",
  "disjoin",
  "disk",
  "dislike",
  "disliking",
  "dislocate",
  "dislodge",
  "disloyal",
  "dismantle",
  "dismay",
  "dismiss",
  "dismount",
  "disobey",
  "disorder",
  "disown",
  "disparate",
  "disparity",
  "dispatch",
  "dispense",
  "dispersal",
  "dispersed",
  "disperser",
  "displace",
  "display",
  "displease",
  "disposal",
  "dispose",
  "disprove",
  "dispute",
  "disregard",
  "disrupt",
  "dissuade",
  "distance",
  "distant",
  "distaste",
  "distill",
  "distinct",
  "distort",
  "distract",
  "distress",
  "district",
  "distrust",
  "ditch",
  "ditto",
  "ditzy",
  "dividable",
  "divided",
  "dividend",
  "dividers",
  "dividing",
  "divinely",
  "diving",
  "divinity",
  "divisible",
  "divisibly",
  "division",
  "divisive",
  "divorcee",
  "dizziness",
  "dizzy",
  "doable",
  "docile",
  "dock",
  "doctrine",
  "document",
  "dodge",
  "dodgy",
  "doily",
  "doing",
  "dole",
  "dollar",
  "dollhouse",
  "dollop",
  "dolly",
  "dolphin",
  "domain",
  "domelike",
  "domestic",
  "dominion",
  "dominoes",
  "donated",
  "donation",
  "donator",
  "donor",
  "donut",
  "doodle",
  "doorbell",
  "doorframe",
  "doorknob",
  "doorman",
  "doormat",
  "doornail",
  "doorpost",
  "doorstep",
  "doorstop",
  "doorway",
  "doozy",
  "dork",
  "dormitory",
  "dorsal",
  "dosage",
  "dose",
  "dotted",
  "doubling",
  "douche",
  "dove",
  "down",
  "dowry",
  "doze",
  "drab",
  "dragging",
  "dragonfly",
  "dragonish",
  "dragster",
  "drainable",
  "drainage",
  "drained",
  "drainer",
  "drainpipe",
  "dramatic",
  "dramatize",
  "drank",
  "drapery",
  "drastic",
  "draw",
  "dreaded",
  "dreadful",
  "dreadlock",
  "dreamboat",
  "dreamily",
  "dreamland",
  "dreamless",
  "dreamlike",
  "dreamt",
  "dreamy",
  "drearily",
  "dreary",
  "drench",
  "dress",
  "drew",
  "dribble",
  "dried",
  "drier",
  "drift",
  "driller",
  "drilling",
  "drinkable",
  "drinking",
  "dripping",
  "drippy",
  "drivable",
  "driven",
  "driver",
  "driveway",
  "driving",
  "drizzle",
  "drizzly",
  "drone",
  "drool",
  "droop",
  "drop-down",
  "dropbox",
  "dropkick",
  "droplet",
  "dropout",
  "dropper",
  "drove",
  "drown",
  "drowsily",
  "drudge",
  "drum",
  "dry",
  "dubbed",
  "dubiously",
  "duchess",
  "duckbill",
  "ducking",
  "duckling",
  "ducktail",
  "ducky",
  "duct",
  "dude",
  "duffel",
  "dugout",
  "duh",
  "duke",
  "duller",
  "dullness",
  "duly",
  "dumping",
  "dumpling",
  "dumpster",
  "duo",
  "dupe",
  "duplex",
  "duplicate",
  "duplicity",
  "durable",
  "durably",
  "duration",
  "duress",
  "during",
  "dusk",
  "dust",
  "dutiful",
  "duty",
  "duvet",
  "dwarf",
  "dweeb",
  "dwelled",
  "dweller",
  "dwelling",
  "dwindle",
  "dwindling",
  "dynamic",
  "dynamite",
  "dynasty",
  "dyslexia",
  "dyslexic",
  "each",
  "eagle",
  "earache",
  "eardrum",
  "earflap",
  "earful",
  "earlobe",
  "early",
  "earmark",
  "earmuff",
  "earphone",
  "earpiece",
  "earplugs",
  "earring",
  "earshot",
  "earthen",
  "earthlike",
  "earthling",
  "earthly",
  "earthworm",
  "earthy",
  "earwig",
  "easeful",
  "easel",
  "easiest",
  "easily",
  "easiness",
  "easing",
  "eastbound",
  "eastcoast",
  "easter",
  "eastward",
  "eatable",
  "eaten",
  "eatery",
  "eating",
  "eats",
  "ebay",
  "ebony",
  "ebook",
  "ecard",
  "eccentric",
  "echo",
  "eclair",
  "eclipse",
  "ecologist",
  "ecology",
  "economic",
  "economist",
  "economy",
  "ecosphere",
  "ecosystem",
  "edge",
  "edginess",
  "edging",
  "edgy",
  "edition",
  "editor",
  "educated",
  "education",
  "educator",
  "eel",
  "effective",
  "effects",
  "efficient",
  "effort",
  "eggbeater",
  "egging",
  "eggnog",
  "eggplant",
  "eggshell",
  "egomaniac",
  "egotism",
  "egotistic",
  "either",
  "eject",
  "elaborate",
  "elastic",
  "elated",
  "elbow",
  "eldercare",
  "elderly",
  "eldest",
  "electable",
  "election",
  "elective",
  "elephant",
  "elevate",
  "elevating",
  "elevation",
  "elevator",
  "eleven",
  "elf",
  "eligible",
  "eligibly",
  "eliminate",
  "elite",
  "elitism",
  "elixir",
  "elk",
  "ellipse",
  "elliptic",
  "elm",
  "elongated",
  "elope",
  "eloquence",
  "eloquent",
  "elsewhere",
  "elude",
  "elusive",
  "elves",
  "email",
  "embargo",
  "embark",
  "embassy",
  "embattled",
  "embellish",
  "ember",
  "embezzle",
  "emblaze",
  "emblem",
  "embody",
  "embolism",
  "emboss",
  "embroider",
  "emcee",
  "emerald",
  "emergency",
  "emission",
  "emit",
  "emote",
  "emoticon",
  "emotion",
  "empathic",
  "empathy",
  "emperor",
  "emphases",
  "emphasis",
  "emphasize",
  "emphatic",
  "empirical",
  "employed",
  "employee",
  "employer",
  "emporium",
  "empower",
  "emptier",
  "emptiness",
  "empty",
  "emu",
  "enable",
  "enactment",
  "enamel",
  "enchanted",
  "enchilada",
  "encircle",
  "enclose",
  "enclosure",
  "encode",
  "encore",
  "encounter",
  "encourage",
  "encroach",
  "encrust",
  "encrypt",
  "endanger",
  "endeared",
  "endearing",
  "ended",
  "ending",
  "endless",
  "endnote",
  "endocrine",
  "endorphin",
  "endorse",
  "endowment",
  "endpoint",
  "endurable",
  "endurance",
  "enduring",
  "energetic",
  "energize",
  "energy",
  "enforced",
  "enforcer",
  "engaged",
  "engaging",
  "engine",
  "engorge",
  "engraved",
  "engraver",
  "engraving",
  "engross",
  "engulf",
  "enhance",
  "enigmatic",
  "enjoyable",
  "enjoyably",
  "enjoyer",
  "enjoying",
  "enjoyment",
  "enlarged",
  "enlarging",
  "enlighten",
  "enlisted",
  "enquirer",
  "enrage",
  "enrich",
  "enroll",
  "enslave",
  "ensnare",
  "ensure",
  "entail",
  "entangled",
  "entering",
  "entertain",
  "enticing",
  "entire",
  "entitle",
  "entity",
  "entomb",
  "entourage",
  "entrap",
  "entree",
  "entrench",
  "entrust",
  "entryway",
  "entwine",
  "enunciate",
  "envelope",
  "enviable",
  "enviably",
  "envious",
  "envision",
  "envoy",
  "envy",
  "enzyme",
  "epic",
  "epidemic",
  "epidermal",
  "epidermis",
  "epidural",
  "epilepsy",
  "epileptic",
  "epilogue",
  "epiphany",
  "episode",
  "equal",
  "equate",
  "equation",
  "equator",
  "equinox",
  "equipment",
  "equity",
  "equivocal",
  "eradicate",
  "erasable",
  "erased",
  "eraser",
  "erasure",
  "ergonomic",
  "errand",
  "errant",
  "erratic",
  "error",
  "erupt",
  "escalate",
  "escalator",
  "escapable",
  "escapade",
  "escapist",
  "escargot",
  "eskimo",
  "esophagus",
  "espionage",
  "espresso",
  "esquire",
  "essay",
  "essence",
  "essential",
  "establish",
  "estate",
  "esteemed",
  "estimate",
  "estimator",
  "estranged",
  "estrogen",
  "etching",
  "eternal",
  "eternity",
  "ethanol",
  "ether",
  "ethically",
  "ethics",
  "euphemism",
  "evacuate",
  "evacuee",
  "evade",
  "evaluate",
  "evaluator",
  "evaporate",
  "evasion",
  "evasive",
  "even",
  "everglade",
  "evergreen",
  "everybody",
  "everyday",
  "everyone",
  "evict",
  "evidence",
  "evident",
  "evil",
  "evoke",
  "evolution",
  "evolve",
  "exact",
  "exalted",
  "example",
  "excavate",
  "excavator",
  "exceeding",
  "exception",
  "excess",
  "exchange",
  "excitable",
  "exciting",
  "exclaim",
  "exclude",
  "excluding",
  "exclusion",
  "exclusive",
  "excretion",
  "excretory",
  "excursion",
  "excusable",
  "excusably",
  "excuse",
  "exemplary",
  "exemplify",
  "exemption",
  "exerciser",
  "exert",
  "exes",
  "exfoliate",
  "exhale",
  "exhaust",
  "exhume",
  "exile",
  "existing",
  "exit",
  "exodus",
  "exonerate",
  "exorcism",
  "exorcist",
  "expand",
  "expanse",
  "expansion",
  "expansive",
  "expectant",
  "expedited",
  "expediter",
  "expel",
  "expend",
  "expenses",
  "expensive",
  "expert",
  "expire",
  "expiring",
  "explain",
  "expletive",
  "explicit",
  "explode",
  "exploit",
  "explore",
  "exploring",
  "exponent",
  "exporter",
  "exposable",
  "expose",
  "exposure",
  "express",
  "expulsion",
  "exquisite",
  "extended",
  "extending",
  "extent",
  "extenuate",
  "exterior",
  "external",
  "extinct",
  "extortion",
  "extradite",
  "extras",
  "extrovert",
  "extrude",
  "extruding",
  "exuberant",
  "fable",
  "fabric",
  "fabulous",
  "facebook",
  "facecloth",
  "facedown",
  "faceless",
  "facelift",
  "faceplate",
  "faceted",
  "facial",
  "facility",
  "facing",
  "facsimile",
  "faction",
  "factoid",
  "factor",
  "factsheet",
  "factual",
  "faculty",
  "fade",
  "fading",
  "failing",
  "falcon",
  "fall",
  "false",
  "falsify",
  "fame",
  "familiar",
  "family",
  "famine",
  "famished",
  "fanatic",
  "fancied",
  "fanciness",
  "fancy",
  "fanfare",
  "fang",
  "fanning",
  "fantasize",
  "fantastic",
  "fantasy",
  "fascism",
  "fastball",
  "faster",
  "fasting",
  "fastness",
  "faucet",
  "favorable",
  "favorably",
  "favored",
  "favoring",
  "favorite",
  "fax",
  "feast",
  "federal",
  "fedora",
  "feeble",
  "feed",
  "feel",
  "feisty",
  "feline",
  "felt-tip",
  "feminine",
  "feminism",
  "feminist",
  "feminize",
  "femur",
  "fence",
  "fencing",
  "fender",
  "ferment",
  "fernlike",
  "ferocious",
  "ferocity",
  "ferret",
  "ferris",
  "ferry",
  "fervor",
  "fester",
  "festival",
  "festive",
  "festivity",
  "fetal",
  "fetch",
  "fever",
  "fiber",
  "fiction",
  "fiddle",
  "fiddling",
  "fidelity",
  "fidgeting",
  "fidgety",
  "fifteen",
  "fifth",
  "fiftieth",
  "fifty",
  "figment",
  "figure",
  "figurine",
  "filing",
  "filled",
  "filler",
  "filling",
  "film",
  "filter",
  "filth",
  "filtrate",
  "finale",
  "finalist",
  "finalize",
  "finally",
  "finance",
  "financial",
  "finch",
  "fineness",
  "finer",
  "finicky",
  "finished",
  "finisher",
  "finishing",
  "finite",
  "finless",
  "finlike",
  "fiscally",
  "fit",
  "five",
  "flaccid",
  "flagman",
  "flagpole",
  "flagship",
  "flagstick",
  "flagstone",
  "flail",
  "flakily",
  "flaky",
  "flame",
  "flammable",
  "flanked",
  "flanking",
  "flannels",
  "flap",
  "flaring",
  "flashback",
  "flashbulb",
  "flashcard",
  "flashily",
  "flashing",
  "flashy",
  "flask",
  "flatbed",
  "flatfoot",
  "flatly",
  "flatness",
  "flatten",
  "flattered",
  "flatterer",
  "flattery",
  "flattop",
  "flatware",
  "flatworm",
  "flavored",
  "flavorful",
  "flavoring",
  "flaxseed",
  "fled",
  "fleshed",
  "fleshy",
  "flick",
  "flier",
  "flight",
  "flinch",
  "fling",
  "flint",
  "flip",
  "flirt",
  "float",
  "flock",
  "flogging",
  "flop",
  "floral",
  "florist",
  "floss",
  "flounder",
  "flyable",
  "flyaway",
  "flyer",
  "flying",
  "flyover",
  "flypaper",
  "foam",
  "foe",
  "fog",
  "foil",
  "folic",
  "folk",
  "follicle",
  "follow",
  "fondling",
  "fondly",
  "fondness",
  "fondue",
  "font",
  "food",
  "fool",
  "footage",
  "football",
  "footbath",
  "footboard",
  "footer",
  "footgear",
  "foothill",
  "foothold",
  "footing",
  "footless",
  "footman",
  "footnote",
  "footpad",
  "footpath",
  "footprint",
  "footrest",
  "footsie",
  "footsore",
  "footwear",
  "footwork",
  "fossil",
  "foster",
  "founder",
  "founding",
  "fountain",
  "fox",
  "foyer",
  "fraction",
  "fracture",
  "fragile",
  "fragility",
  "fragment",
  "fragrance",
  "fragrant",
  "frail",
  "frame",
  "framing",
  "frantic",
  "fraternal",
  "frayed",
  "fraying",
  "frays",
  "freckled",
  "freckles",
  "freebase",
  "freebee",
  "freebie",
  "freedom",
  "freefall",
  "freehand",
  "freeing",
  "freeload",
  "freely",
  "freemason",
  "freeness",
  "freestyle",
  "freeware",
  "freeway",
  "freewill",
  "freezable",
  "freezing",
  "freight",
  "french",
  "frenzied",
  "frenzy",
  "frequency",
  "frequent",
  "fresh",
  "fretful",
  "fretted",
  "friction",
  "friday",
  "fridge",
  "fried",
  "friend",
  "frighten",
  "frightful",
  "frigidity",
  "frigidly",
  "frill",
  "fringe",
  "frisbee",
  "frisk",
  "fritter",
  "frivolous",
  "frolic",
  "from",
  "front",
  "frostbite",
  "frosted",
  "frostily",
  "frosting",
  "frostlike",
  "frosty",
  "froth",
  "frown",
  "frozen",
  "fructose",
  "frugality",
  "frugally",
  "fruit",
  "frustrate",
  "frying",
  "gab",
  "gaffe",
  "gag",
  "gainfully",
  "gaining",
  "gains",
  "gala",
  "gallantly",
  "galleria",
  "gallery",
  "galley",
  "gallon",
  "gallows",
  "gallstone",
  "galore",
  "galvanize",
  "gambling",
  "game",
  "gaming",
  "gamma",
  "gander",
  "gangly",
  "gangrene",
  "gangway",
  "gap",
  "garage",
  "garbage",
  "garden",
  "gargle",
  "garland",
  "garlic",
  "garment",
  "garnet",
  "garnish",
  "garter",
  "gas",
  "gatherer",
  "gathering",
  "gating",
  "gauging",
  "gauntlet",
  "gauze",
  "gave",
  "gawk",
  "gazing",
  "gear",
  "gecko",
  "geek",
  "geiger",
  "gem",
  "gender",
  "generic",
  "generous",
  "genetics",
  "genre",
  "gentile",
  "gentleman",
  "gently",
  "gents",
  "geography",
  "geologic",
  "geologist",
  "geology",
  "geometric",
  "geometry",
  "geranium",
  "gerbil",
  "geriatric",
  "germicide",
  "germinate",
  "germless",
  "germproof",
  "gestate",
  "gestation",
  "gesture",
  "getaway",
  "getting",
  "getup",
  "giant",
  "gibberish",
  "giblet",
  "giddily",
  "giddiness",
  "giddy",
  "gift",
  "gigabyte",
  "gigahertz",
  "gigantic",
  "giggle",
  "giggling",
  "giggly",
  "gigolo",
  "gilled",
  "gills",
  "gimmick",
  "girdle",
  "giveaway",
  "given",
  "giver",
  "giving",
  "gizmo",
  "gizzard",
  "glacial",
  "glacier",
  "glade",
  "gladiator",
  "gladly",
  "glamorous",
  "glamour",
  "glance",
  "glancing",
  "glandular",
  "glare",
  "glaring",
  "glass",
  "glaucoma",
  "glazing",
  "gleaming",
  "gleeful",
  "glider",
  "gliding",
  "glimmer",
  "glimpse",
  "glisten",
  "glitch",
  "glitter",
  "glitzy",
  "gloater",
  "gloating",
  "gloomily",
  "gloomy",
  "glorified",
  "glorifier",
  "glorify",
  "glorious",
  "glory",
  "gloss",
  "glove",
  "glowing",
  "glowworm",
  "glucose",
  "glue",
  "gluten",
  "glutinous",
  "glutton",
  "gnarly",
  "gnat",
  "goal",
  "goatskin",
  "goes",
  "goggles",
  "going",
  "goldfish",
  "goldmine",
  "goldsmith",
  "golf",
  "goliath",
  "gonad",
  "gondola",
  "gone",
  "gong",
  "good",
  "gooey",
  "goofball",
  "goofiness",
  "goofy",
  "google",
  "goon",
  "gopher",
  "gore",
  "gorged",
  "gorgeous",
  "gory",
  "gosling",
  "gossip",
  "gothic",
  "gotten",
  "gout",
  "gown",
  "grab",
  "graceful",
  "graceless",
  "gracious",
  "gradation",
  "graded",
  "grader",
  "gradient",
  "grading",
  "gradually",
  "graduate",
  "graffiti",
  "grafted",
  "grafting",
  "grain",
  "granddad",
  "grandkid",
  "grandly",
  "grandma",
  "grandpa",
  "grandson",
  "granite",
  "granny",
  "granola",
  "grant",
  "granular",
  "grape",
  "graph",
  "grapple",
  "grappling",
  "grasp",
  "grass",
  "gratified",
  "gratify",
  "grating",
  "gratitude",
  "gratuity",
  "gravel",
  "graveness",
  "graves",
  "graveyard",
  "gravitate",
  "gravity",
  "gravy",
  "gray",
  "grazing",
  "greasily",
  "greedily",
  "greedless",
  "greedy",
  "green",
  "greeter",
  "greeting",
  "grew",
  "greyhound",
  "grid",
  "grief",
  "grievance",
  "grieving",
  "grievous",
  "grill",
  "grimace",
  "grimacing",
  "grime",
  "griminess",
  "grimy",
  "grinch",
  "grinning",
  "grip",
  "gristle",
  "grit",
  "groggily",
  "groggy",
  "groin",
  "groom",
  "groove",
  "grooving",
  "groovy",
  "grope",
  "ground",
  "grouped",
  "grout",
  "grove",
  "grower",
  "growing",
  "growl",
  "grub",
  "grudge",
  "grudging",
  "grueling",
  "gruffly",
  "grumble",
  "grumbling",
  "grumbly",
  "grumpily",
  "grunge",
  "grunt",
  "guacamole",
  "guidable",
  "guidance",
  "guide",
  "guiding",
  "guileless",
  "guise",
  "gulf",
  "gullible",
  "gully",
  "gulp",
  "gumball",
  "gumdrop",
  "gumminess",
  "gumming",
  "gummy",
  "gurgle",
  "gurgling",
  "guru",
  "gush",
  "gusto",
  "gusty",
  "gutless",
  "guts",
  "gutter",
  "guy",
  "guzzler",
  "gyration",
  "habitable",
  "habitant",
  "habitat",
  "habitual",
  "hacked",
  "hacker",
  "hacking",
  "hacksaw",
  "had",
  "haggler",
  "haiku",
  "half",
  "halogen",
  "halt",
  "halved",
  "halves",
  "hamburger",
  "hamlet",
  "hammock",
  "hamper",
  "hamster",
  "hamstring",
  "handbag",
  "handball",
  "handbook",
  "handbrake",
  "handcart",
  "handclap",
  "handclasp",
  "handcraft",
  "handcuff",
  "handed",
  "handful",
  "handgrip",
  "handgun",
  "handheld",
  "handiness",
  "handiwork",
  "handlebar",
  "handled",
  "handler",
  "handling",
  "handmade",
  "handoff",
  "handpick",
  "handprint",
  "handrail",
  "handsaw",
  "handset",
  "handsfree",
  "handshake",
  "handstand",
  "handwash",
  "handwork",
  "handwoven",
  "handwrite",
  "handyman",
  "hangnail",
  "hangout",
  "hangover",
  "hangup",
  "hankering",
  "hankie",
  "hanky",
  "haphazard",
  "happening",
  "happier",
  "happiest",
  "happily",
  "happiness",
  "happy",
  "harbor",
  "hardcopy",
  "hardcore",
  "hardcover",
  "harddisk",
  "hardened",
  "hardener",
  "hardening",
  "hardhat",
  "hardhead",
  "hardiness",
  "hardly",
  "hardness",
  "hardship",
  "hardware",
  "hardwired",
  "hardwood",
  "hardy",
  "harmful",
  "harmless",
  "harmonica",
  "harmonics",
  "harmonize",
  "harmony",
  "harness",
  "harpist",
  "harsh",
  "harvest",
  "hash",
  "hassle",
  "haste",
  "hastily",
  "hastiness",
  "hasty",
  "hatbox",
  "hatchback",
  "hatchery",
  "hatchet",
  "hatching",
  "hatchling",
  "hate",
  "hatless",
  "hatred",
  "haunt",
  "haven",
  "hazard",
  "hazelnut",
  "hazily",
  "haziness",
  "hazing",
  "hazy",
  "headache",
  "headband",
  "headboard",
  "headcount",
  "headdress",
  "headed",
  "header",
  "headfirst",
  "headgear",
  "heading",
  "headlamp",
  "headless",
  "headlock",
  "headphone",
  "headpiece",
  "headrest",
  "headroom",
  "headscarf",
  "headset",
  "headsman",
  "headstand",
  "headstone",
  "headway",
  "headwear",
  "heap",
  "heat",
  "heave",
  "heavily",
  "heaviness",
  "heaving",
  "hedge",
  "hedging",
  "heftiness",
  "hefty",
  "helium",
  "helmet",
  "helper",
  "helpful",
  "helping",
  "helpless",
  "helpline",
  "hemlock",
  "hemstitch",
  "hence",
  "henchman",
  "henna",
  "herald",
  "herbal",
  "herbicide",
  "herbs",
  "heritage",
  "hermit",
  "heroics",
  "heroism",
  "herring",
  "herself",
  "hertz",
  "hesitancy",
  "hesitant",
  "hesitate",
  "hexagon",
  "hexagram",
  "hubcap",
  "huddle",
  "huddling",
  "huff",
  "hug",
  "hula",
  "hulk",
  "hull",
  "human",
  "humble",
  "humbling",
  "humbly",
  "humid",
  "humiliate",
  "humility",
  "humming",
  "hummus",
  "humongous",
  "humorist",
  "humorless",
  "humorous",
  "humpback",
  "humped",
  "humvee",
  "hunchback",
  "hundredth",
  "hunger",
  "hungrily",
  "hungry",
  "hunk",
  "hunter",
  "hunting",
  "huntress",
  "huntsman",
  "hurdle",
  "hurled",
  "hurler",
  "hurling",
  "hurray",
  "hurricane",
  "hurried",
  "hurry",
  "hurt",
  "husband",
  "hush",
  "husked",
  "huskiness",
  "hut",
  "hybrid",
  "hydrant",
  "hydrated",
  "hydration",
  "hydrogen",
  "hydroxide",
  "hyperlink",
  "hypertext",
  "hyphen",
  "hypnoses",
  "hypnosis",
  "hypnotic",
  "hypnotism",
  "hypnotist",
  "hypnotize",
  "hypocrisy",
  "hypocrite",
  "ibuprofen",
  "ice",
  "iciness",
  "icing",
  "icky",
  "icon",
  "icy",
  "idealism",
  "idealist",
  "idealize",
  "ideally",
  "idealness",
  "identical",
  "identify",
  "identity",
  "ideology",
  "idiocy",
  "idiom",
  "idly",
  "igloo",
  "ignition",
  "ignore",
  "iguana",
  "illicitly",
  "illusion",
  "illusive",
  "image",
  "imaginary",
  "imagines",
  "imaging",
  "imbecile",
  "imitate",
  "imitation",
  "immature",
  "immerse",
  "immersion",
  "imminent",
  "immobile",
  "immodest",
  "immorally",
  "immortal",
  "immovable",
  "immovably",
  "immunity",
  "immunize",
  "impaired",
  "impale",
  "impart",
  "impatient",
  "impeach",
  "impeding",
  "impending",
  "imperfect",
  "imperial",
  "impish",
  "implant",
  "implement",
  "implicate",
  "implicit",
  "implode",
  "implosion",
  "implosive",
  "imply",
  "impolite",
  "important",
  "importer",
  "impose",
  "imposing",
  "impotence",
  "impotency",
  "impotent",
  "impound",
  "imprecise",
  "imprint",
  "imprison",
  "impromptu",
  "improper",
  "improve",
  "improving",
  "improvise",
  "imprudent",
  "impulse",
  "impulsive",
  "impure",
  "impurity",
  "iodine",
  "iodize",
  "ion",
  "ipad",
  "iphone",
  "ipod",
  "irate",
  "irk",
  "iron",
  "irregular",
  "irrigate",
  "irritable",
  "irritably",
  "irritant",
  "irritate",
  "islamic",
  "islamist",
  "isolated",
  "isolating",
  "isolation",
  "isotope",
  "issue",
  "issuing",
  "italicize",
  "italics",
  "item",
  "itinerary",
  "itunes",
  "ivory",
  "ivy",
  "jab",
  "jackal",
  "jacket",
  "jackknife",
  "jackpot",
  "jailbird",
  "jailbreak",
  "jailer",
  "jailhouse",
  "jalapeno",
  "jam",
  "janitor",
  "january",
  "jargon",
  "jarring",
  "jasmine",
  "jaundice",
  "jaunt",
  "java",
  "jawed",
  "jawless",
  "jawline",
  "jaws",
  "jaybird",
  "jaywalker",
  "jazz",
  "jeep",
  "jeeringly",
  "jellied",
  "jelly",
  "jersey",
  "jester",
  "jet",
  "jiffy",
  "jigsaw",
  "jimmy",
  "jingle",
  "jingling",
  "jinx",
  "jitters",
  "jittery",
  "job",
  "jockey",
  "jockstrap",
  "jogger",
  "jogging",
  "john",
  "joining",
  "jokester",
  "jokingly",
  "jolliness",
  "jolly",
  "jolt",
  "jot",
  "jovial",
  "joyfully",
  "joylessly",
  "joyous",
  "joyride",
  "joystick",
  "jubilance",
  "jubilant",
  "judge",
  "judgingly",
  "judicial",
  "judiciary",
  "judo",
  "juggle",
  "juggling",
  "jugular",
  "juice",
  "juiciness",
  "juicy",
  "jujitsu",
  "jukebox",
  "july",
  "jumble",
  "jumbo",
  "jump",
  "junction",
  "juncture",
  "june",
  "junior",
  "juniper",
  "junkie",
  "junkman",
  "junkyard",
  "jurist",
  "juror",
  "jury",
  "justice",
  "justifier",
  "justify",
  "justly",
  "justness",
  "juvenile",
  "kabob",
  "kangaroo",
  "karaoke",
  "karate",
  "karma",
  "kebab",
  "keenly",
  "keenness",
  "keep",
  "keg",
  "kelp",
  "kennel",
  "kept",
  "kerchief",
  "kerosene",
  "kettle",
  "kick",
  "kiln",
  "kilobyte",
  "kilogram",
  "kilometer",
  "kilowatt",
  "kilt",
  "kimono",
  "kindle",
  "kindling",
  "kindly",
  "kindness",
  "kindred",
  "kinetic",
  "kinfolk",
  "king",
  "kinship",
  "kinsman",
  "kinswoman",
  "kissable",
  "kisser",
  "kissing",
  "kitchen",
  "kite",
  "kitten",
  "kitty",
  "kiwi",
  "kleenex",
  "knapsack",
  "knee",
  "knelt",
  "knickers",
  "knoll",
  "koala",
  "kooky",
  "kosher",
  "krypton",
  "kudos",
  "kung",
  "labored",
  "laborer",
  "laboring",
  "laborious",
  "labrador",
  "ladder",
  "ladies",
  "ladle",
  "ladybug",
  "ladylike",
  "lagged",
  "lagging",
  "lagoon",
  "lair",
  "lake",
  "lance",
  "landed",
  "landfall",
  "landfill",
  "landing",
  "landlady",
  "landless",
  "landline",
  "landlord",
  "landmark",
  "landmass",
  "landmine",
  "landowner",
  "landscape",
  "landside",
  "landslide",
  "language",
  "lankiness",
  "lanky",
  "lantern",
  "lapdog",
  "lapel",
  "lapped",
  "lapping",
  "laptop",
  "lard",
  "large",
  "lark",
  "lash",
  "lasso",
  "last",
  "latch",
  "late",
  "lather",
  "latitude",
  "latrine",
  "latter",
  "latticed",
  "launch",
  "launder",
  "laundry",
  "laurel",
  "lavender",
  "lavish",
  "laxative",
  "lazily",
  "laziness",
  "lazy",
  "lecturer",
  "left",
  "legacy",
  "legal",
  "legend",
  "legged",
  "leggings",
  "legible",
  "legibly",
  "legislate",
  "lego",
  "legroom",
  "legume",
  "legwarmer",
  "legwork",
  "lemon",
  "lend",
  "length",
  "lens",
  "lent",
  "leotard",
  "lesser",
  "letdown",
  "lethargic",
  "lethargy",
  "letter",
  "lettuce",
  "level",
  "leverage",
  "levers",
  "levitate",
  "levitator",
  "liability",
  "liable",
  "liberty",
  "librarian",
  "library",
  "licking",
  "licorice",
  "lid",
  "life",
  "lifter",
  "lifting",
  "liftoff",
  "ligament",
  "likely",
  "likeness",
  "likewise",
  "liking",
  "lilac",
  "lilly",
  "lily",
  "limb",
  "limeade",
  "limelight",
  "limes",
  "limit",
  "limping",
  "limpness",
  "line",
  "lingo",
  "linguini",
  "linguist",
  "lining",
  "linked",
  "linoleum",
  "linseed",
  "lint",
  "lion",
  "lip",
  "liquefy",
  "liqueur",
  "liquid",
  "lisp",
  "list",
  "litigate",
  "litigator",
  "litmus",
  "litter",
  "little",
  "livable",
  "lived",
  "lively",
  "liver",
  "livestock",
  "lividly",
  "living",
  "lizard",
  "lubricant",
  "lubricate",
  "lucid",
  "luckily",
  "luckiness",
  "luckless",
  "lucrative",
  "ludicrous",
  "lugged",
  "lukewarm",
  "lullaby",
  "lumber",
  "luminance",
  "luminous",
  "lumpiness",
  "lumping",
  "lumpish",
  "lunacy",
  "lunar",
  "lunchbox",
  "luncheon",
  "lunchroom",
  "lunchtime",
  "lung",
  "lurch",
  "lure",
  "luridness",
  "lurk",
  "lushly",
  "lushness",
  "luster",
  "lustfully",
  "lustily",
  "lustiness",
  "lustrous",
  "lusty",
  "luxurious",
  "luxury",
  "lying",
  "lyrically",
  "lyricism",
  "lyricist",
  "lyrics",
  "macarena",
  "macaroni",
  "macaw",
  "mace",
  "machine",
  "machinist",
  "magazine",
  "magenta",
  "maggot",
  "magical",
  "magician",
  "magma",
  "magnesium",
  "magnetic",
  "magnetism",
  "magnetize",
  "magnifier",
  "magnify",
  "magnitude",
  "magnolia",
  "mahogany",
  "maimed",
  "majestic",
  "majesty",
  "majorette",
  "majority",
  "makeover",
  "maker",
  "makeshift",
  "making",
  "malformed",
  "malt",
  "mama",
  "mammal",
  "mammary",
  "mammogram",
  "manager",
  "managing",
  "manatee",
  "mandarin",
  "mandate",
  "mandatory",
  "mandolin",
  "manger",
  "mangle",
  "mango",
  "mangy",
  "manhandle",
  "manhole",
  "manhood",
  "manhunt",
  "manicotti",
  "manicure",
  "manifesto",
  "manila",
  "mankind",
  "manlike",
  "manliness",
  "manly",
  "manmade",
  "manned",
  "mannish",
  "manor",
  "manpower",
  "mantis",
  "mantra",
  "manual",
  "many",
  "map",
  "marathon",
  "marauding",
  "marbled",
  "marbles",
  "marbling",
  "march",
  "mardi",
  "margarine",
  "margarita",
  "margin",
  "marigold",
  "marina",
  "marine",
  "marital",
  "maritime",
  "marlin",
  "marmalade",
  "maroon",
  "married",
  "marrow",
  "marry",
  "marshland",
  "marshy",
  "marsupial",
  "marvelous",
  "marxism",
  "mascot",
  "masculine",
  "mashed",
  "mashing",
  "massager",
  "masses",
  "massive",
  "mastiff",
  "matador",
  "matchbook",
  "matchbox",
  "matcher",
  "matching",
  "matchless",
  "material",
  "maternal",
  "maternity",
  "math",
  "mating",
  "matriarch",
  "matrimony",
  "matrix",
  "matron",
  "matted",
  "matter",
  "maturely",
  "maturing",
  "maturity",
  "mauve",
  "maverick",
  "maximize",
  "maximum",
  "maybe",
  "mayday",
  "mayflower",
  "moaner",
  "moaning",
  "mobile",
  "mobility",
  "mobilize",
  "mobster",
  "mocha",
  "mocker",
  "mockup",
  "modified",
  "modify",
  "modular",
  "modulator",
  "module",
  "moisten",
  "moistness",
  "moisture",
  "molar",
  "molasses",
  "mold",
  "molecular",
  "molecule",
  "molehill",
  "mollusk",
  "mom",
  "monastery",
  "monday",
  "monetary",
  "monetize",
  "moneybags",
  "moneyless",
  "moneywise",
  "mongoose",
  "mongrel",
  "monitor",
  "monkhood",
  "monogamy",
  "monogram",
  "monologue",
  "monopoly",
  "monorail",
  "monotone",
  "monotype",
  "monoxide",
  "monsieur",
  "monsoon",
  "monstrous",
  "monthly",
  "monument",
  "moocher",
  "moodiness",
  "moody",
  "mooing",
  "moonbeam",
  "mooned",
  "moonlight",
  "moonlike",
  "moonlit",
  "moonrise",
  "moonscape",
  "moonshine",
  "moonstone",
  "moonwalk",
  "mop",
  "morale",
  "morality",
  "morally",
  "morbidity",
  "morbidly",
  "morphine",
  "morphing",
  "morse",
  "mortality",
  "mortally",
  "mortician",
  "mortified",
  "mortify",
  "mortuary",
  "mosaic",
  "mossy",
  "most",
  "mothball",
  "mothproof",
  "motion",
  "motivate",
  "motivator",
  "motive",
  "motocross",
  "motor",
  "motto",
  "mountable",
  "mountain",
  "mounted",
  "mounting",
  "mourner",
  "mournful",
  "mouse",
  "mousiness",
  "moustache",
  "mousy",
  "mouth",
  "movable",
  "move",
  "movie",
  "moving",
  "mower",
  "mowing",
  "much",
  "muck",
  "mud",
  "mug",
  "mulberry",
  "mulch",
  "mule",
  "mulled",
  "mullets",
  "multiple",
  "multiply",
  "multitask",
  "multitude",
  "mumble",
  "mumbling",
  "mumbo",
  "mummified",
  "mummify",
  "mummy",
  "mumps",
  "munchkin",
  "mundane",
  "municipal",
  "muppet",
  "mural",
  "murkiness",
  "murky",
  "murmuring",
  "muscular",
  "museum",
  "mushily",
  "mushiness",
  "mushroom",
  "mushy",
  "music",
  "musket",
  "muskiness",
  "musky",
  "mustang",
  "mustard",
  "muster",
  "mustiness",
  "musty",
  "mutable",
  "mutate",
  "mutation",
  "mute",
  "mutilated",
  "mutilator",
  "mutiny",
  "mutt",
  "mutual",
  "muzzle",
  "myself",
  "myspace",
  "mystified",
  "mystify",
  "myth",
  "nacho",
  "nag",
  "nail",
  "name",
  "naming",
  "nanny",
  "nanometer",
  "nape",
  "napkin",
  "napped",
  "napping",
  "nappy",
  "narrow",
  "nastily",
  "nastiness",
  "national",
  "native",
  "nativity",
  "natural",
  "nature",
  "naturist",
  "nautical",
  "navigate",
  "navigator",
  "navy",
  "nearby",
  "nearest",
  "nearly",
  "nearness",
  "neatly",
  "neatness",
  "nebula",
  "nebulizer",
  "nectar",
  "negate",
  "negation",
  "negative",
  "neglector",
  "negligee",
  "negligent",
  "negotiate",
  "nemeses",
  "nemesis",
  "neon",
  "nephew",
  "nerd",
  "nervous",
  "nervy",
  "nest",
  "net",
  "neurology",
  "neuron",
  "neurosis",
  "neurotic",
  "neuter",
  "neutron",
  "never",
  "next",
  "nibble",
  "nickname",
  "nicotine",
  "niece",
  "nifty",
  "nimble",
  "nimbly",
  "nineteen",
  "ninetieth",
  "ninja",
  "nintendo",
  "ninth",
  "nuclear",
  "nuclei",
  "nucleus",
  "nugget",
  "nullify",
  "number",
  "numbing",
  "numbly",
  "numbness",
  "numeral",
  "numerate",
  "numerator",
  "numeric",
  "numerous",
  "nuptials",
  "nursery",
  "nursing",
  "nurture",
  "nutcase",
  "nutlike",
  "nutmeg",
  "nutrient",
  "nutshell",
  "nuttiness",
  "nutty",
  "nuzzle",
  "nylon",
  "oaf",
  "oak",
  "oasis",
  "oat",
  "obedience",
  "obedient",
  "obituary",
  "object",
  "obligate",
  "obliged",
  "oblivion",
  "oblivious",
  "oblong",
  "obnoxious",
  "oboe",
  "obscure",
  "obscurity",
  "observant",
  "observer",
  "observing",
  "obsessed",
  "obsession",
  "obsessive",
  "obsolete",
  "obstacle",
  "obstinate",
  "obstruct",
  "obtain",
  "obtrusive",
  "obtuse",
  "obvious",
  "occultist",
  "occupancy",
  "occupant",
  "occupier",
  "occupy",
  "ocean",
  "ocelot",
  "octagon",
  "octane",
  "october",
  "octopus",
  "ogle",
  "oil",
  "oink",
  "ointment",
  "okay",
  "old",
  "olive",
  "olympics",
  "omega",
  "omen",
  "ominous",
  "omission",
  "omit",
  "omnivore",
  "onboard",
  "oncoming",
  "ongoing",
  "onion",
  "online",
  "onlooker",
  "only",
  "onscreen",
  "onset",
  "onshore",
  "onslaught",
  "onstage",
  "onto",
  "onward",
  "onyx",
  "oops",
  "ooze",
  "oozy",
  "opacity",
  "opal",
  "open",
  "operable",
  "operate",
  "operating",
  "operation",
  "operative",
  "operator",
  "opium",
  "opossum",
  "opponent",
  "oppose",
  "opposing",
  "opposite",
  "oppressed",
  "oppressor",
  "opt",
  "opulently",
  "osmosis",
  "other",
  "otter",
  "ouch",
  "ought",
  "ounce",
  "outage",
  "outback",
  "outbid",
  "outboard",
  "outbound",
  "outbreak",
  "outburst",
  "outcast",
  "outclass",
  "outcome",
  "outdated",
  "outdoors",
  "outer",
  "outfield",
  "outfit",
  "outflank",
  "outgoing",
  "outgrow",
  "outhouse",
  "outing",
  "outlast",
  "outlet",
  "outline",
  "outlook",
  "outlying",
  "outmatch",
  "outmost",
  "outnumber",
  "outplayed",
  "outpost",
  "outpour",
  "output",
  "outrage",
  "outrank",
  "outreach",
  "outright",
  "outscore",
  "outsell",
  "outshine",
  "outshoot",
  "outsider",
  "outskirts",
  "outsmart",
  "outsource",
  "outspoken",
  "outtakes",
  "outthink",
  "outward",
  "outweigh",
  "outwit",
  "oval",
  "ovary",
  "oven",
  "overact",
  "overall",
  "overarch",
  "overbid",
  "overbill",
  "overbite",
  "overblown",
  "overboard",
  "overbook",
  "overbuilt",
  "overcast",
  "overcoat",
  "overcome",
  "overcook",
  "overcrowd",
  "overdraft",
  "overdrawn",
  "overdress",
  "overdrive",
  "overdue",
  "overeager",
  "overeater",
  "overexert",
  "overfed",
  "overfeed",
  "overfill",
  "overflow",
  "overfull",
  "overgrown",
  "overhand",
  "overhang",
  "overhaul",
  "overhead",
  "overhear",
  "overheat",
  "overhung",
  "overjoyed",
  "overkill",
  "overlabor",
  "overlaid",
  "overlap",
  "overlay",
  "overload",
  "overlook",
  "overlord",
  "overlying",
  "overnight",
  "overpass",
  "overpay",
  "overplant",
  "overplay",
  "overpower",
  "overprice",
  "overrate",
  "overreach",
  "overreact",
  "override",
  "overripe",
  "overrule",
  "overrun",
  "overshoot",
  "overshot",
  "oversight",
  "oversized",
  "oversleep",
  "oversold",
  "overspend",
  "overstate",
  "overstay",
  "overstep",
  "overstock",
  "overstuff",
  "oversweet",
  "overtake",
  "overthrow",
  "overtime",
  "overtly",
  "overtone",
  "overture",
  "overturn",
  "overuse",
  "overvalue",
  "overview",
  "overwrite",
  "owl",
  "oxford",
  "oxidant",
  "oxidation",
  "oxidize",
  "oxidizing",
  "oxygen",
  "oxymoron",
  "oyster",
  "ozone",
  "paced",
  "pacemaker",
  "pacific",
  "pacifier",
  "pacifism",
  "pacifist",
  "pacify",
  "padded",
  "padding",
  "paddle",
  "paddling",
  "padlock",
  "pagan",
  "pager",
  "paging",
  "pajamas",
  "palace",
  "palatable",
  "palm",
  "palpable",
  "palpitate",
  "paltry",
  "pampered",
  "pamperer",
  "pampers",
  "pamphlet",
  "panama",
  "pancake",
  "pancreas",
  "panda",
  "pandemic",
  "pang",
  "panhandle",
  "panic",
  "panning",
  "panorama",
  "panoramic",
  "panther",
  "pantomime",
  "pantry",
  "pants",
  "pantyhose",
  "paparazzi",
  "papaya",
  "paper",
  "paprika",
  "papyrus",
  "parabola",
  "parachute",
  "parade",
  "paradox",
  "paragraph",
  "parakeet",
  "paralegal",
  "paralyses",
  "paralysis",
  "paralyze",
  "paramedic",
  "parameter",
  "paramount",
  "parasail",
  "parasite",
  "parasitic",
  "parcel",
  "parched",
  "parchment",
  "pardon",
  "parish",
  "parka",
  "parking",
  "parkway",
  "parlor",
  "parmesan",
  "parole",
  "parrot",
  "parsley",
  "parsnip",
  "partake",
  "parted",
  "parting",
  "partition",
  "partly",
  "partner",
  "partridge",
  "party",
  "passable",
  "passably",
  "passage",
  "passcode",
  "passenger",
  "passerby",
  "passing",
  "passion",
  "passive",
  "passivism",
  "passover",
  "passport",
  "password",
  "pasta",
  "pasted",
  "pastel",
  "pastime",
  "pastor",
  "pastrami",
  "pasture",
  "pasty",
  "patchwork",
  "patchy",
  "paternal",
  "paternity",
  "path",
  "patience",
  "patient",
  "patio",
  "patriarch",
  "patriot",
  "patrol",
  "patronage",
  "patronize",
  "pauper",
  "pavement",
  "paver",
  "pavestone",
  "pavilion",
  "paving",
  "pawing",
  "payable",
  "payback",
  "paycheck",
  "payday",
  "payee",
  "payer",
  "paying",
  "payment",
  "payphone",
  "payroll",
  "pebble",
  "pebbly",
  "pecan",
  "pectin",
  "peculiar",
  "peddling",
  "pediatric",
  "pedicure",
  "pedigree",
  "pedometer",
  "pegboard",
  "pelican",
  "pellet",
  "pelt",
  "pelvis",
  "penalize",
  "penalty",
  "pencil",
  "pendant",
  "pending",
  "penholder",
  "penknife",
  "pennant",
  "penniless",
  "penny",
  "penpal",
  "pension",
  "pentagon",
  "pentagram",
  "pep",
  "perceive",
  "percent",
  "perch",
  "percolate",
  "perennial",
  "perfected",
  "perfectly",
  "perfume",
  "periscope",
  "perish",
  "perjurer",
  "perjury",
  "perkiness",
  "perky",
  "perm",
  "peroxide",
  "perpetual",
  "perplexed",
  "persecute",
  "persevere",
  "persuaded",
  "persuader",
  "pesky",
  "peso",
  "pessimism",
  "pessimist",
  "pester",
  "pesticide",
  "petal",
  "petite",
  "petition",
  "petri",
  "petroleum",
  "petted",
  "petticoat",
  "pettiness",
  "petty",
  "petunia",
  "phantom",
  "phobia",
  "phoenix",
  "phonebook",
  "phoney",
  "phonics",
  "phoniness",
  "phony",
  "phosphate",
  "photo",
  "phrase",
  "phrasing",
  "placard",
  "placate",
  "placidly",
  "plank",
  "planner",
  "plant",
  "plasma",
  "plaster",
  "plastic",
  "plated",
  "platform",
  "plating",
  "platinum",
  "platonic",
  "platter",
  "platypus",
  "plausible",
  "plausibly",
  "playable",
  "playback",
  "player",
  "playful",
  "playgroup",
  "playhouse",
  "playing",
  "playlist",
  "playmaker",
  "playmate",
  "playoff",
  "playpen",
  "playroom",
  "playset",
  "plaything",
  "playtime",
  "plaza",
  "pleading",
  "pleat",
  "pledge",
  "plentiful",
  "plenty",
  "plethora",
  "plexiglas",
  "pliable",
  "plod",
  "plop",
  "plot",
  "plow",
  "ploy",
  "pluck",
  "plug",
  "plunder",
  "plunging",
  "plural",
  "plus",
  "plutonium",
  "plywood",
  "poach",
  "pod",
  "poem",
  "poet",
  "pogo",
  "pointed",
  "pointer",
  "pointing",
  "pointless",
  "pointy",
  "poise",
  "poison",
  "poker",
  "poking",
  "polar",
  "police",
  "policy",
  "polio",
  "polish",
  "politely",
  "polka",
  "polo",
  "polyester",
  "polygon",
  "polygraph",
  "polymer",
  "poncho",
  "pond",
  "pony",
  "popcorn",
  "pope",
  "poplar",
  "popper",
  "poppy",
  "popsicle",
  "populace",
  "popular",
  "populate",
  "porcupine",
  "pork",
  "porous",
  "porridge",
  "portable",
  "portal",
  "portfolio",
  "porthole",
  "portion",
  "portly",
  "portside",
  "poser",
  "posh",
  "posing",
  "possible",
  "possibly",
  "possum",
  "postage",
  "postal",
  "postbox",
  "postcard",
  "posted",
  "poster",
  "posting",
  "postnasal",
  "posture",
  "postwar",
  "pouch",
  "pounce",
  "pouncing",
  "pound",
  "pouring",
  "pout",
  "powdered",
  "powdering",
  "powdery",
  "power",
  "powwow",
  "pox",
  "praising",
  "prance",
  "prancing",
  "pranker",
  "prankish",
  "prankster",
  "prayer",
  "praying",
  "preacher",
  "preaching",
  "preachy",
  "preamble",
  "precinct",
  "precise",
  "precision",
  "precook",
  "precut",
  "predator",
  "predefine",
  "predict",
  "preface",
  "prefix",
  "preflight",
  "preformed",
  "pregame",
  "pregnancy",
  "pregnant",
  "preheated",
  "prelaunch",
  "prelaw",
  "prelude",
  "premiere",
  "premises",
  "premium",
  "prenatal",
  "preoccupy",
  "preorder",
  "prepaid",
  "prepay",
  "preplan",
  "preppy",
  "preschool",
  "prescribe",
  "preseason",
  "preset",
  "preshow",
  "president",
  "presoak",
  "press",
  "presume",
  "presuming",
  "preteen",
  "pretended",
  "pretender",
  "pretense",
  "pretext",
  "pretty",
  "pretzel",
  "prevail",
  "prevalent",
  "prevent",
  "preview",
  "previous",
  "prewar",
  "prewashed",
  "prideful",
  "pried",
  "primal",
  "primarily",
  "primary",
  "primate",
  "primer",
  "primp",
  "princess",
  "print",
  "prior",
  "prism",
  "prison",
  "prissy",
  "pristine",
  "privacy",
  "private",
  "privatize",
  "prize",
  "proactive",
  "probable",
  "probably",
  "probation",
  "probe",
  "probing",
  "probiotic",
  "problem",
  "procedure",
  "process",
  "proclaim",
  "procreate",
  "procurer",
  "prodigal",
  "prodigy",
  "produce",
  "product",
  "profane",
  "profanity",
  "professed",
  "professor",
  "profile",
  "profound",
  "profusely",
  "progeny",
  "prognosis",
  "program",
  "progress",
  "projector",
  "prologue",
  "prolonged",
  "promenade",
  "prominent",
  "promoter",
  "promotion",
  "prompter",
  "promptly",
  "prone",
  "prong",
  "pronounce",
  "pronto",
  "proofing",
  "proofread",
  "proofs",
  "propeller",
  "properly",
  "property",
  "proponent",
  "proposal",
  "propose",
  "props",
  "prorate",
  "protector",
  "protegee",
  "proton",
  "prototype",
  "protozoan",
  "protract",
  "protrude",
  "proud",
  "provable",
  "proved",
  "proven",
  "provided",
  "provider",
  "providing",
  "province",
  "proving",
  "provoke",
  "provoking",
  "provolone",
  "prowess",
  "prowler",
  "prowling",
  "proximity",
  "proxy",
  "prozac",
  "prude",
  "prudishly",
  "prune",
  "pruning",
  "pry",
  "psychic",
  "public",
  "publisher",
  "pucker",
  "pueblo",
  "pug",
  "pull",
  "pulmonary",
  "pulp",
  "pulsate",
  "pulse",
  "pulverize",
  "puma",
  "pumice",
  "pummel",
  "punch",
  "punctual",
  "punctuate",
  "punctured",
  "pungent",
  "punisher",
  "punk",
  "pupil",
  "puppet",
  "puppy",
  "purchase",
  "pureblood",
  "purebred",
  "purely",
  "pureness",
  "purgatory",
  "purge",
  "purging",
  "purifier",
  "purify",
  "purist",
  "puritan",
  "purity",
  "purple",
  "purplish",
  "purposely",
  "purr",
  "purse",
  "pursuable",
  "pursuant",
  "pursuit",
  "purveyor",
  "pushcart",
  "pushchair",
  "pusher",
  "pushiness",
  "pushing",
  "pushover",
  "pushpin",
  "pushup",
  "pushy",
  "putdown",
  "putt",
  "puzzle",
  "puzzling",
  "pyramid",
  "pyromania",
  "python",
  "quack",
  "quadrant",
  "quail",
  "quaintly",
  "quake",
  "quaking",
  "qualified",
  "qualifier",
  "qualify",
  "quality",
  "qualm",
  "quantum",
  "quarrel",
  "quarry",
  "quartered",
  "quarterly",
  "quarters",
  "quartet",
  "quench",
  "query",
  "quicken",
  "quickly",
  "quickness",
  "quicksand",
  "quickstep",
  "quiet",
  "quill",
  "quilt",
  "quintet",
  "quintuple",
  "quirk",
  "quit",
  "quiver",
  "quizzical",
  "quotable",
  "quotation",
  "quote",
  "rabid",
  "race",
  "racing",
  "racism",
  "rack",
  "racoon",
  "radar",
  "radial",
  "radiance",
  "radiantly",
  "radiated",
  "radiation",
  "radiator",
  "radio",
  "radish",
  "raffle",
  "raft",
  "rage",
  "ragged",
  "raging",
  "ragweed",
  "raider",
  "railcar",
  "railing",
  "railroad",
  "railway",
  "raisin",
  "rake",
  "raking",
  "rally",
  "ramble",
  "rambling",
  "ramp",
  "ramrod",
  "ranch",
  "rancidity",
  "random",
  "ranged",
  "ranger",
  "ranging",
  "ranked",
  "ranking",
  "ransack",
  "ranting",
  "rants",
  "rare",
  "rarity",
  "rascal",
  "rash",
  "rasping",
  "ravage",
  "raven",
  "ravine",
  "raving",
  "ravioli",
  "ravishing",
  "reabsorb",
  "reach",
  "reacquire",
  "reaction",
  "reactive",
  "reactor",
  "reaffirm",
  "ream",
  "reanalyze",
  "reappear",
  "reapply",
  "reappoint",
  "reapprove",
  "rearrange",
  "rearview",
  "reason",
  "reassign",
  "reassure",
  "reattach",
  "reawake",
  "rebalance",
  "rebate",
  "rebel",
  "rebirth",
  "reboot",
  "reborn",
  "rebound",
  "rebuff",
  "rebuild",
  "rebuilt",
  "reburial",
  "rebuttal",
  "recall",
  "recant",
  "recapture",
  "recast",
  "recede",
  "recent",
  "recess",
  "recharger",
  "recipient",
  "recital",
  "recite",
  "reckless",
  "reclaim",
  "recliner",
  "reclining",
  "recluse",
  "reclusive",
  "recognize",
  "recoil",
  "recollect",
  "recolor",
  "reconcile",
  "reconfirm",
  "reconvene",
  "recopy",
  "record",
  "recount",
  "recoup",
  "recovery",
  "recreate",
  "rectal",
  "rectangle",
  "rectified",
  "rectify",
  "recycled",
  "recycler",
  "recycling",
  "reemerge",
  "reenact",
  "reenter",
  "reentry",
  "reexamine",
  "referable",
  "referee",
  "reference",
  "refill",
  "refinance",
  "refined",
  "refinery",
  "refining",
  "refinish",
  "reflected",
  "reflector",
  "reflex",
  "reflux",
  "refocus",
  "refold",
  "reforest",
  "reformat",
  "reformed",
  "reformer",
  "reformist",
  "refract",
  "refrain",
  "refreeze",
  "refresh",
  "refried",
  "refueling",
  "refund",
  "refurbish",
  "refurnish",
  "refusal",
  "refuse",
  "refusing",
  "refutable",
  "refute",
  "regain",
  "regalia",
  "regally",
  "reggae",
  "regime",
  "region",
  "register",
  "registrar",
  "registry",
  "regress",
  "regretful",
  "regroup",
  "regular",
  "regulate",
  "regulator",
  "rehab",
  "reheat",
  "rehire",
  "rehydrate",
  "reimburse",
  "reissue",
  "reiterate",
  "rejoice",
  "rejoicing",
  "rejoin",
  "rekindle",
  "relapse",
  "relapsing",
  "relatable",
  "related",
  "relation",
  "relative",
  "relax",
  "relay",
  "relearn",
  "release",
  "relenting",
  "reliable",
  "reliably",
  "reliance",
  "reliant",
  "relic",
  "relieve",
  "relieving",
  "relight",
  "relish",
  "relive",
  "reload",
  "relocate",
  "relock",
  "reluctant",
  "rely",
  "remake",
  "remark",
  "remarry",
  "rematch",
  "remedial",
  "remedy",
  "remember",
  "reminder",
  "remindful",
  "remission",
  "remix",
  "remnant",
  "remodeler",
  "remold",
  "remorse",
  "remote",
  "removable",
  "removal",
  "removed",
  "remover",
  "removing",
  "rename",
  "renderer",
  "rendering",
  "rendition",
  "renegade",
  "renewable",
  "renewably",
  "renewal",
  "renewed",
  "renounce",
  "renovate",
  "renovator",
  "rentable",
  "rental",
  "rented",
  "renter",
  "reoccupy",
  "reoccur",
  "reopen",
  "reorder",
  "repackage",
  "repacking",
  "repaint",
  "repair",
  "repave",
  "repaying",
  "repayment",
  "repeal",
  "repeated",
  "repeater",
  "repent",
  "rephrase",
  "replace",
  "replay",
  "replica",
  "reply",
  "reporter",
  "repose",
  "repossess",
  "repost",
  "repressed",
  "reprimand",
  "reprint",
  "reprise",
  "reproach",
  "reprocess",
  "reproduce",
  "reprogram",
  "reps",
  "reptile",
  "reptilian",
  "repugnant",
  "repulsion",
  "repulsive",
  "repurpose",
  "reputable",
  "reputably",
  "request",
  "require",
  "requisite",
  "reroute",
  "rerun",
  "resale",
  "resample",
  "rescuer",
  "reseal",
  "research",
  "reselect",
  "reseller",
  "resemble",
  "resend",
  "resent",
  "reset",
  "reshape",
  "reshoot",
  "reshuffle",
  "residence",
  "residency",
  "resident",
  "residual",
  "residue",
  "resigned",
  "resilient",
  "resistant",
  "resisting",
  "resize",
  "resolute",
  "resolved",
  "resonant",
  "resonate",
  "resort",
  "resource",
  "respect",
  "resubmit",
  "result",
  "resume",
  "resupply",
  "resurface",
  "resurrect",
  "retail",
  "retainer",
  "retaining",
  "retake",
  "retaliate",
  "retention",
  "rethink",
  "retinal",
  "retired",
  "retiree",
  "retiring",
  "retold",
  "retool",
  "retorted",
  "retouch",
  "retrace",
  "retract",
  "retrain",
  "retread",
  "retreat",
  "retrial",
  "retrieval",
  "retriever",
  "retry",
  "return",
  "retying",
  "retype",
  "reunion",
  "reunite",
  "reusable",
  "reuse",
  "reveal",
  "reveler",
  "revenge",
  "revenue",
  "reverb",
  "revered",
  "reverence",
  "reverend",
  "reversal",
  "reverse",
  "reversing",
  "reversion",
  "revert",
  "revisable",
  "revise",
  "revision",
  "revisit",
  "revivable",
  "revival",
  "reviver",
  "reviving",
  "revocable",
  "revoke",
  "revolt",
  "revolver",
  "revolving",
  "reward",
  "rewash",
  "rewind",
  "rewire",
  "reword",
  "rework",
  "rewrap",
  "rewrite",
  "rhyme",
  "ribbon",
  "ribcage",
  "rice",
  "riches",
  "richly",
  "richness",
  "rickety",
  "ricotta",
  "riddance",
  "ridden",
  "ride",
  "riding",
  "rifling",
  "rift",
  "rigging",
  "rigid",
  "rigor",
  "rimless",
  "rimmed",
  "rind",
  "rink",
  "rinse",
  "rinsing",
  "riot",
  "ripcord",
  "ripeness",
  "ripening",
  "ripping",
  "ripple",
  "rippling",
  "riptide",
  "rise",
  "rising",
  "risk",
  "risotto",
  "ritalin",
  "ritzy",
  "rival",
  "riverbank",
  "riverbed",
  "riverboat",
  "riverside",
  "riveter",
  "riveting",
  "roamer",
  "roaming",
  "roast",
  "robbing",
  "robe",
  "robin",
  "robotics",
  "robust",
  "rockband",
  "rocker",
  "rocket",
  "rockfish",
  "rockiness",
  "rocking",
  "rocklike",
  "rockslide",
  "rockstar",
  "rocky",
  "rogue",
  "roman",
  "romp",
  "rope",
  "roping",
  "roster",
  "rosy",
  "rotten",
  "rotting",
  "rotunda",
  "roulette",
  "rounding",
  "roundish",
  "roundness",
  "roundup",
  "roundworm",
  "routine",
  "routing",
  "rover",
  "roving",
  "royal",
  "rubbed",
  "rubber",
  "rubbing",
  "rubble",
  "rubdown",
  "ruby",
  "ruckus",
  "rudder",
  "rug",
  "ruined",
  "rule",
  "rumble",
  "rumbling",
  "rummage",
  "rumor",
  "runaround",
  "rundown",
  "runner",
  "running",
  "runny",
  "runt",
  "runway",
  "rupture",
  "rural",
  "ruse",
  "rush",
  "rust",
  "rut",
  "sabbath",
  "sabotage",
  "sacrament",
  "sacred",
  "sacrifice",
  "sadden",
  "saddlebag",
  "saddled",
  "saddling",
  "sadly",
  "sadness",
  "safari",
  "safeguard",
  "safehouse",
  "safely",
  "safeness",
  "saffron",
  "saga",
  "sage",
  "sagging",
  "saggy",
  "said",
  "saint",
  "sake",
  "salad",
  "salami",
  "salaried",
  "salary",
  "saline",
  "salon",
  "saloon",
  "salsa",
  "salt",
  "salutary",
  "salute",
  "salvage",
  "salvaging",
  "salvation",
  "same",
  "sample",
  "sampling",
  "sanction",
  "sanctity",
  "sanctuary",
  "sandal",
  "sandbag",
  "sandbank",
  "sandbar",
  "sandblast",
  "sandbox",
  "sanded",
  "sandfish",
  "sanding",
  "sandlot",
  "sandpaper",
  "sandpit",
  "sandstone",
  "sandstorm",
  "sandworm",
  "sandy",
  "sanitary",
  "sanitizer",
  "sank",
  "santa",
  "sapling",
  "sappiness",
  "sappy",
  "sarcasm",
  "sarcastic",
  "sardine",
  "sash",
  "sasquatch",
  "sassy",
  "satchel",
  "satiable",
  "satin",
  "satirical",
  "satisfied",
  "satisfy",
  "saturate",
  "saturday",
  "sauciness",
  "saucy",
  "sauna",
  "savage",
  "savanna",
  "saved",
  "savings",
  "savior",
  "savor",
  "saxophone",
  "say",
  "scabbed",
  "scabby",
  "scalded",
  "scalding",
  "scale",
  "scaling",
  "scallion",
  "scallop",
  "scalping",
  "scam",
  "scandal",
  "scanner",
  "scanning",
  "scant",
  "scapegoat",
  "scarce",
  "scarcity",
  "scarecrow",
  "scared",
  "scarf",
  "scarily",
  "scariness",
  "scarring",
  "scary",
  "scavenger",
  "scenic",
  "schedule",
  "schematic",
  "scheme",
  "scheming",
  "schilling",
  "schnapps",
  "scholar",
  "science",
  "scientist",
  "scion",
  "scoff",
  "scolding",
  "scone",
  "scoop",
  "scooter",
  "scope",
  "scorch",
  "scorebook",
  "scorecard",
  "scored",
  "scoreless",
  "scorer",
  "scoring",
  "scorn",
  "scorpion",
  "scotch",
  "scoundrel",
  "scoured",
  "scouring",
  "scouting",
  "scouts",
  "scowling",
  "scrabble",
  "scraggly",
  "scrambled",
  "scrambler",
  "scrap",
  "scratch",
  "scrawny",
  "screen",
  "scribble",
  "scribe",
  "scribing",
  "scrimmage",
  "script",
  "scroll",
  "scrooge",
  "scrounger",
  "scrubbed",
  "scrubber",
  "scruffy",
  "scrunch",
  "scrutiny",
  "scuba",
  "scuff",
  "sculptor",
  "sculpture",
  "scurvy",
  "scuttle",
  "secluded",
  "secluding",
  "seclusion",
  "second",
  "secrecy",
  "secret",
  "sectional",
  "sector",
  "secular",
  "securely",
  "security",
  "sedan",
  "sedate",
  "sedation",
  "sedative",
  "sediment",
  "seduce",
  "seducing",
  "segment",
  "seismic",
  "seizing",
  "seldom",
  "selected",
  "selection",
  "selective",
  "selector",
  "self",
  "seltzer",
  "semantic",
  "semester",
  "semicolon",
  "semifinal",
  "seminar",
  "semisoft",
  "semisweet",
  "senate",
  "senator",
  "send",
  "senior",
  "senorita",
  "sensation",
  "sensitive",
  "sensitize",
  "sensually",
  "sensuous",
  "sepia",
  "september",
  "septic",
  "septum",
  "sequel",
  "sequence",
  "sequester",
  "series",
  "sermon",
  "serotonin",
  "serpent",
  "serrated",
  "serve",
  "service",
  "serving",
  "sesame",
  "sessions",
  "setback",
  "setting",
  "settle",
  "settling",
  "setup",
  "sevenfold",
  "seventeen",
  "seventh",
  "seventy",
  "severity",
  "shabby",
  "shack",
  "shaded",
  "shadily",
  "shadiness",
  "shading",
  "shadow",
  "shady",
  "shaft",
  "shakable",
  "shakily",
  "shakiness",
  "shaking",
  "shaky",
  "shale",
  "shallot",
  "shallow",
  "shame",
  "shampoo",
  "shamrock",
  "shank",
  "shanty",
  "shape",
  "shaping",
  "share",
  "sharpener",
  "sharper",
  "sharpie",
  "sharply",
  "sharpness",
  "shawl",
  "sheath",
  "shed",
  "sheep",
  "sheet",
  "shelf",
  "shell",
  "shelter",
  "shelve",
  "shelving",
  "sherry",
  "shield",
  "shifter",
  "shifting",
  "shiftless",
  "shifty",
  "shimmer",
  "shimmy",
  "shindig",
  "shine",
  "shingle",
  "shininess",
  "shining",
  "shiny",
  "ship",
  "shirt",
  "shivering",
  "shock",
  "shone",
  "shoplift",
  "shopper",
  "shopping",
  "shoptalk",
  "shore",
  "shortage",
  "shortcake",
  "shortcut",
  "shorten",
  "shorter",
  "shorthand",
  "shortlist",
  "shortly",
  "shortness",
  "shorts",
  "shortwave",
  "shorty",
  "shout",
  "shove",
  "showbiz",
  "showcase",
  "showdown",
  "shower",
  "showgirl",
  "showing",
  "showman",
  "shown",
  "showoff",
  "showpiece",
  "showplace",
  "showroom",
  "showy",
  "shrank",
  "shrapnel",
  "shredder",
  "shredding",
  "shrewdly",
  "shriek",
  "shrill",
  "shrimp",
  "shrine",
  "shrink",
  "shrivel",
  "shrouded",
  "shrubbery",
  "shrubs",
  "shrug",
  "shrunk",
  "shucking",
  "shudder",
  "shuffle",
  "shuffling",
  "shun",
  "shush",
  "shut",
  "shy",
  "siamese",
  "siberian",
  "sibling",
  "siding",
  "sierra",
  "siesta",
  "sift",
  "sighing",
  "silenced",
  "silencer",
  "silent",
  "silica",
  "silicon",
  "silk",
  "silliness",
  "silly",
  "silo",
  "silt",
  "silver",
  "similarly",
  "simile",
  "simmering",
  "simple",
  "simplify",
  "simply",
  "sincere",
  "sincerity",
  "singer",
  "singing",
  "single",
  "singular",
  "sinister",
  "sinless",
  "sinner",
  "sinuous",
  "sip",
  "siren",
  "sister",
  "sitcom",
  "sitter",
  "sitting",
  "situated",
  "situation",
  "sixfold",
  "sixteen",
  "sixth",
  "sixties",
  "sixtieth",
  "sixtyfold",
  "sizable",
  "sizably",
  "size",
  "sizing",
  "sizzle",
  "sizzling",
  "skater",
  "skating",
  "skedaddle",
  "skeletal",
  "skeleton",
  "skeptic",
  "sketch",
  "skewed",
  "skewer",
  "skid",
  "skied",
  "skier",
  "skies",
  "skiing",
  "skilled",
  "skillet",
  "skillful",
  "skimmed",
  "skimmer",
  "skimming",
  "skimpily",
  "skincare",
  "skinhead",
  "skinless",
  "skinning",
  "skinny",
  "skintight",
  "skipper",
  "skipping",
  "skirmish",
  "skirt",
  "skittle",
  "skydiver",
  "skylight",
  "skyline",
  "skype",
  "skyrocket",
  "skyward",
  "slab",
  "slacked",
  "slacker",
  "slacking",
  "slackness",
  "slacks",
  "slain",
  "slam",
  "slander",
  "slang",
  "slapping",
  "slapstick",
  "slashed",
  "slashing",
  "slate",
  "slather",
  "slaw",
  "sled",
  "sleek",
  "sleep",
  "sleet",
  "sleeve",
  "slept",
  "sliceable",
  "sliced",
  "slicer",
  "slicing",
  "slick",
  "slider",
  "slideshow",
  "sliding",
  "slighted",
  "slighting",
  "slightly",
  "slimness",
  "slimy",
  "slinging",
  "slingshot",
  "slinky",
  "slip",
  "slit",
  "sliver",
  "slobbery",
  "slogan",
  "sloped",
  "sloping",
  "sloppily",
  "sloppy",
  "slot",
  "slouching",
  "slouchy",
  "sludge",
  "slug",
  "slum",
  "slurp",
  "slush",
  "sly",
  "small",
  "smartly",
  "smartness",
  "smasher",
  "smashing",
  "smashup",
  "smell",
  "smelting",
  "smile",
  "smilingly",
  "smirk",
  "smite",
  "smith",
  "smitten",
  "smock",
  "smog",
  "smoked",
  "smokeless",
  "smokiness",
  "smoking",
  "smoky",
  "smolder",
  "smooth",
  "smother",
  "smudge",
  "smudgy",
  "smuggler",
  "smuggling",
  "smugly",
  "smugness",
  "snack",
  "snagged",
  "snaking",
  "snap",
  "snare",
  "snarl",
  "snazzy",
  "sneak",
  "sneer",
  "sneeze",
  "sneezing",
  "snide",
  "sniff",
  "snippet",
  "snipping",
  "snitch",
  "snooper",
  "snooze",
  "snore",
  "snoring",
  "snorkel",
  "snort",
  "snout",
  "snowbird",
  "snowboard",
  "snowbound",
  "snowcap",
  "snowdrift",
  "snowdrop",
  "snowfall",
  "snowfield",
  "snowflake",
  "snowiness",
  "snowless",
  "snowman",
  "snowplow",
  "snowshoe",
  "snowstorm",
  "snowsuit",
  "snowy",
  "snub",
  "snuff",
  "snuggle",
  "snugly",
  "snugness",
  "speak",
  "spearfish",
  "spearhead",
  "spearman",
  "spearmint",
  "species",
  "specimen",
  "specked",
  "speckled",
  "specks",
  "spectacle",
  "spectator",
  "spectrum",
  "speculate",
  "speech",
  "speed",
  "spellbind",
  "speller",
  "spelling",
  "spendable",
  "spender",
  "spending",
  "spent",
  "spew",
  "sphere",
  "spherical",
  "sphinx",
  "spider",
  "spied",
  "spiffy",
  "spill",
  "spilt",
  "spinach",
  "spinal",
  "spindle",
  "spinner",
  "spinning",
  "spinout",
  "spinster",
  "spiny",
  "spiral",
  "spirited",
  "spiritism",
  "spirits",
  "spiritual",
  "splashed",
  "splashing",
  "splashy",
  "splatter",
  "spleen",
  "splendid",
  "splendor",
  "splice",
  "splicing",
  "splinter",
  "splotchy",
  "splurge",
  "spoilage",
  "spoiled",
  "spoiler",
  "spoiling",
  "spoils",
  "spoken",
  "spokesman",
  "sponge",
  "spongy",
  "sponsor",
  "spoof",
  "spookily",
  "spooky",
  "spool",
  "spoon",
  "spore",
  "sporting",
  "sports",
  "sporty",
  "spotless",
  "spotlight",
  "spotted",
  "spotter",
  "spotting",
  "spotty",
  "spousal",
  "spouse",
  "spout",
  "sprain",
  "sprang",
  "sprawl",
  "spray",
  "spree",
  "sprig",
  "spring",
  "sprinkled",
  "sprinkler",
  "sprint",
  "sprite",
  "sprout",
  "spruce",
  "sprung",
  "spry",
  "spud",
  "spur",
  "sputter",
  "spyglass",
  "squabble",
  "squad",
  "squall",
  "squander",
  "squash",
  "squatted",
  "squatter",
  "squatting",
  "squeak",
  "squealer",
  "squealing",
  "squeamish",
  "squeegee",
  "squeeze",
  "squeezing",
  "squid",
  "squiggle",
  "squiggly",
  "squint",
  "squire",
  "squirt",
  "squishier",
  "squishy",
  "stability",
  "stabilize",
  "stable",
  "stack",
  "stadium",
  "staff",
  "stage",
  "staging",
  "stagnant",
  "stagnate",
  "stainable",
  "stained",
  "staining",
  "stainless",
  "stalemate",
  "staleness",
  "stalling",
  "stallion",
  "stamina",
  "stammer",
  "stamp",
  "stand",
  "stank",
  "staple",
  "stapling",
  "starboard",
  "starch",
  "stardom",
  "stardust",
  "starfish",
  "stargazer",
  "staring",
  "stark",
  "starless",
  "starlet",
  "starlight",
  "starlit",
  "starring",
  "starry",
  "starship",
  "starter",
  "starting",
  "startle",
  "startling",
  "startup",
  "starved",
  "starving",
  "stash",
  "state",
  "static",
  "statistic",
  "statue",
  "stature",
  "status",
  "statute",
  "statutory",
  "staunch",
  "stays",
  "steadfast",
  "steadier",
  "steadily",
  "steadying",
  "steam",
  "steed",
  "steep",
  "steerable",
  "steering",
  "steersman",
  "stegosaur",
  "stellar",
  "stem",
  "stench",
  "stencil",
  "step",
  "stereo",
  "sterile",
  "sterility",
  "sterilize",
  "sterling",
  "sternness",
  "sternum",
  "stew",
  "stick",
  "stiffen",
  "stiffly",
  "stiffness",
  "stifle",
  "stifling",
  "stillness",
  "stilt",
  "stimulant",
  "stimulate",
  "stimuli",
  "stimulus",
  "stinger",
  "stingily",
  "stinging",
  "stingray",
  "stingy",
  "stinking",
  "stinky",
  "stipend",
  "stipulate",
  "stir",
  "stitch",
  "stock",
  "stoic",
  "stoke",
  "stole",
  "stomp",
  "stonewall",
  "stoneware",
  "stonework",
  "stoning",
  "stony",
  "stood",
  "stooge",
  "stool",
  "stoop",
  "stoplight",
  "stoppable",
  "stoppage",
  "stopped",
  "stopper",
  "stopping",
  "stopwatch",
  "storable",
  "storage",
  "storeroom",
  "storewide",
  "storm",
  "stout",
  "stove",
  "stowaway",
  "stowing",
  "straddle",
  "straggler",
  "strained",
  "strainer",
  "straining",
  "strangely",
  "stranger",
  "strangle",
  "strategic",
  "strategy",
  "stratus",
  "straw",
  "stray",
  "streak",
  "stream",
  "street",
  "strength",
  "strenuous",
  "strep",
  "stress",
  "stretch",
  "strewn",
  "stricken",
  "strict",
  "stride",
  "strife",
  "strike",
  "striking",
  "strive",
  "striving",
  "strobe",
  "strode",
  "stroller",
  "strongbox",
  "strongly",
  "strongman",
  "struck",
  "structure",
  "strudel",
  "struggle",
  "strum",
  "strung",
  "strut",
  "stubbed",
  "stubble",
  "stubbly",
  "stubborn",
  "stucco",
  "stuck",
  "student",
  "studied",
  "studio",
  "study",
  "stuffed",
  "stuffing",
  "stuffy",
  "stumble",
  "stumbling",
  "stump",
  "stung",
  "stunned",
  "stunner",
  "stunning",
  "stunt",
  "stupor",
  "sturdily",
  "sturdy",
  "styling",
  "stylishly",
  "stylist",
  "stylized",
  "stylus",
  "suave",
  "subarctic",
  "subatomic",
  "subdivide",
  "subdued",
  "subduing",
  "subfloor",
  "subgroup",
  "subheader",
  "subject",
  "sublease",
  "sublet",
  "sublevel",
  "sublime",
  "submarine",
  "submerge",
  "submersed",
  "submitter",
  "subpanel",
  "subpar",
  "subplot",
  "subprime",
  "subscribe",
  "subscript",
  "subsector",
  "subside",
  "subsiding",
  "subsidize",
  "subsidy",
  "subsoil",
  "subsonic",
  "substance",
  "subsystem",
  "subtext",
  "subtitle",
  "subtly",
  "subtotal",
  "subtract",
  "subtype",
  "suburb",
  "subway",
  "subwoofer",
  "subzero",
  "succulent",
  "such",
  "suction",
  "sudden",
  "sudoku",
  "suds",
  "sufferer",
  "suffering",
  "suffice",
  "suffix",
  "suffocate",
  "suffrage",
  "sugar",
  "suggest",
  "suing",
  "suitable",
  "suitably",
  "suitcase",
  "suitor",
  "sulfate",
  "sulfide",
  "sulfite",
  "sulfur",
  "sulk",
  "sullen",
  "sulphate",
  "sulphuric",
  "sultry",
  "superbowl",
  "superglue",
  "superhero",
  "superior",
  "superjet",
  "superman",
  "supermom",
  "supernova",
  "supervise",
  "supper",
  "supplier",
  "supply",
  "support",
  "supremacy",
  "supreme",
  "surcharge",
  "surely",
  "sureness",
  "surface",
  "surfacing",
  "surfboard",
  "surfer",
  "surgery",
  "surgical",
  "surging",
  "surname",
  "surpass",
  "surplus",
  "surprise",
  "surreal",
  "surrender",
  "surrogate",
  "surround",
  "survey",
  "survival",
  "survive",
  "surviving",
  "survivor",
  "sushi",
  "suspect",
  "suspend",
  "suspense",
  "sustained",
  "sustainer",
  "swab",
  "swaddling",
  "swagger",
  "swampland",
  "swan",
  "swapping",
  "swarm",
  "sway",
  "swear",
  "sweat",
  "sweep",
  "swell",
  "swept",
  "swerve",
  "swifter",
  "swiftly",
  "swiftness",
  "swimmable",
  "swimmer",
  "swimming",
  "swimsuit",
  "swimwear",
  "swinger",
  "swinging",
  "swipe",
  "swirl",
  "switch",
  "swivel",
  "swizzle",
  "swooned",
  "swoop",
  "swoosh",
  "swore",
  "sworn",
  "swung",
  "sycamore",
  "sympathy",
  "symphonic",
  "symphony",
  "symptom",
  "synapse",
  "syndrome",
  "synergy",
  "synopses",
  "synopsis",
  "synthesis",
  "synthetic",
  "syrup",
  "system",
  "t-shirt",
  "tabasco",
  "tabby",
  "tableful",
  "tables",
  "tablet",
  "tableware",
  "tabloid",
  "tackiness",
  "tacking",
  "tackle",
  "tackling",
  "tacky",
  "taco",
  "tactful",
  "tactical",
  "tactics",
  "tactile",
  "tactless",
  "tadpole",
  "taekwondo",
  "tag",
  "tainted",
  "take",
  "taking",
  "talcum",
  "talisman",
  "tall",
  "talon",
  "tamale",
  "tameness",
  "tamer",
  "tamper",
  "tank",
  "tanned",
  "tannery",
  "tanning",
  "tantrum",
  "tapeless",
  "tapered",
  "tapering",
  "tapestry",
  "tapioca",
  "tapping",
  "taps",
  "tarantula",
  "target",
  "tarmac",
  "tarnish",
  "tarot",
  "tartar",
  "tartly",
  "tartness",
  "task",
  "tassel",
  "taste",
  "tastiness",
  "tasting",
  "tasty",
  "tattered",
  "tattle",
  "tattling",
  "tattoo",
  "taunt",
  "tavern",
  "thank",
  "that",
  "thaw",
  "theater",
  "theatrics",
  "thee",
  "theft",
  "theme",
  "theology",
  "theorize",
  "thermal",
  "thermos",
  "thesaurus",
  "these",
  "thesis",
  "thespian",
  "thicken",
  "thicket",
  "thickness",
  "thieving",
  "thievish",
  "thigh",
  "thimble",
  "thing",
  "think",
  "thinly",
  "thinner",
  "thinness",
  "thinning",
  "thirstily",
  "thirsting",
  "thirsty",
  "thirteen",
  "thirty",
  "thong",
  "thorn",
  "those",
  "thousand",
  "thrash",
  "thread",
  "threaten",
  "threefold",
  "thrift",
  "thrill",
  "thrive",
  "thriving",
  "throat",
  "throbbing",
  "throng",
  "throttle",
  "throwaway",
  "throwback",
  "thrower",
  "throwing",
  "thud",
  "thumb",
  "thumping",
  "thursday",
  "thus",
  "thwarting",
  "thyself",
  "tiara",
  "tibia",
  "tidal",
  "tidbit",
  "tidiness",
  "tidings",
  "tidy",
  "tiger",
  "tighten",
  "tightly",
  "tightness",
  "tightrope",
  "tightwad",
  "tigress",
  "tile",
  "tiling",
  "till",
  "tilt",
  "timid",
  "timing",
  "timothy",
  "tinderbox",
  "tinfoil",
  "tingle",
  "tingling",
  "tingly",
  "tinker",
  "tinkling",
  "tinsel",
  "tinsmith",
  "tint",
  "tinwork",
  "tiny",
  "tipoff",
  "tipped",
  "tipper",
  "tipping",
  "tiptoeing",
  "tiptop",
  "tiring",
  "tissue",
  "trace",
  "tracing",
  "track",
  "traction",
  "tractor",
  "trade",
  "trading",
  "tradition",
  "traffic",
  "tragedy",
  "trailing",
  "trailside",
  "train",
  "traitor",
  "trance",
  "tranquil",
  "transfer",
  "transform",
  "translate",
  "transpire",
  "transport",
  "transpose",
  "trapdoor",
  "trapeze",
  "trapezoid",
  "trapped",
  "trapper",
  "trapping",
  "traps",
  "trash",
  "travel",
  "traverse",
  "travesty",
  "tray",
  "treachery",
  "treading",
  "treadmill",
  "treason",
  "treat",
  "treble",
  "tree",
  "trekker",
  "tremble",
  "trembling",
  "tremor",
  "trench",
  "trend",
  "trespass",
  "triage",
  "trial",
  "triangle",
  "tribesman",
  "tribunal",
  "tribune",
  "tributary",
  "tribute",
  "triceps",
  "trickery",
  "trickily",
  "tricking",
  "trickle",
  "trickster",
  "tricky",
  "tricolor",
  "tricycle",
  "trident",
  "tried",
  "trifle",
  "trifocals",
  "trillion",
  "trilogy",
  "trimester",
  "trimmer",
  "trimming",
  "trimness",
  "trinity",
  "trio",
  "tripod",
  "tripping",
  "triumph",
  "trivial",
  "trodden",
  "trolling",
  "trombone",
  "trophy",
  "tropical",
  "tropics",
  "trouble",
  "troubling",
  "trough",
  "trousers",
  "trout",
  "trowel",
  "truce",
  "truck",
  "truffle",
  "trump",
  "trunks",
  "trustable",
  "trustee",
  "trustful",
  "trusting",
  "trustless",
  "truth",
  "try",
  "tubby",
  "tubeless",
  "tubular",
  "tucking",
  "tuesday",
  "tug",
  "tuition",
  "tulip",
  "tumble",
  "tumbling",
  "tummy",
  "turban",
  "turbine",
  "turbofan",
  "turbojet",
  "turbulent",
  "turf",
  "turkey",
  "turmoil",
  "turret",
  "turtle",
  "tusk",
  "tutor",
  "tutu",
  "tux",
  "tweak",
  "tweed",
  "tweet",
  "tweezers",
  "twelve",
  "twentieth",
  "twenty",
  "twerp",
  "twice",
  "twiddle",
  "twiddling",
  "twig",
  "twilight",
  "twine",
  "twins",
  "twirl",
  "twistable",
  "twisted",
  "twister",
  "twisting",
  "twisty",
  "twitch",
  "twitter",
  "tycoon",
  "tying",
  "tyke",
  "udder",
  "ultimate",
  "ultimatum",
  "ultra",
  "umbilical",
  "umbrella",
  "umpire",
  "unabashed",
  "unable",
  "unadorned",
  "unadvised",
  "unafraid",
  "unaired",
  "unaligned",
  "unaltered",
  "unarmored",
  "unashamed",
  "unaudited",
  "unawake",
  "unaware",
  "unbaked",
  "unbalance",
  "unbeaten",
  "unbend",
  "unbent",
  "unbiased",
  "unbitten",
  "unblended",
  "unblessed",
  "unblock",
  "unbolted",
  "unbounded",
  "unboxed",
  "unbraided",
  "unbridle",
  "unbroken",
  "unbuckled",
  "unbundle",
  "unburned",
  "unbutton",
  "uncanny",
  "uncapped",
  "uncaring",
  "uncertain",
  "unchain",
  "unchanged",
  "uncharted",
  "uncheck",
  "uncivil",
  "unclad",
  "unclaimed",
  "unclamped",
  "unclasp",
  "uncle",
  "unclip",
  "uncloak",
  "unclog",
  "unclothed",
  "uncoated",
  "uncoiled",
  "uncolored",
  "uncombed",
  "uncommon",
  "uncooked",
  "uncork",
  "uncorrupt",
  "uncounted",
  "uncouple",
  "uncouth",
  "uncover",
  "uncross",
  "uncrown",
  "uncrushed",
  "uncured",
  "uncurious",
  "uncurled",
  "uncut",
  "undamaged",
  "undated",
  "undaunted",
  "undead",
  "undecided",
  "undefined",
  "underage",
  "underarm",
  "undercoat",
  "undercook",
  "undercut",
  "underdog",
  "underdone",
  "underfed",
  "underfeed",
  "underfoot",
  "undergo",
  "undergrad",
  "underhand",
  "underline",
  "underling",
  "undermine",
  "undermost",
  "underpaid",
  "underpass",
  "underpay",
  "underrate",
  "undertake",
  "undertone",
  "undertook",
  "undertow",
  "underuse",
  "underwear",
  "underwent",
  "underwire",
  "undesired",
  "undiluted",
  "undivided",
  "undocked",
  "undoing",
  "undone",
  "undrafted",
  "undress",
  "undrilled",
  "undusted",
  "undying",
  "unearned",
  "unearth",
  "unease",
  "uneasily",
  "uneasy",
  "uneatable",
  "uneaten",
  "unedited",
  "unelected",
  "unending",
  "unengaged",
  "unenvied",
  "unequal",
  "unethical",
  "uneven",
  "unexpired",
  "unexposed",
  "unfailing",
  "unfair",
  "unfasten",
  "unfazed",
  "unfeeling",
  "unfiled",
  "unfilled",
  "unfitted",
  "unfitting",
  "unfixable",
  "unfixed",
  "unflawed",
  "unfocused",
  "unfold",
  "unfounded",
  "unframed",
  "unfreeze",
  "unfrosted",
  "unfrozen",
  "unfunded",
  "unglazed",
  "ungloved",
  "unglue",
  "ungodly",
  "ungraded",
  "ungreased",
  "unguarded",
  "unguided",
  "unhappily",
  "unhappy",
  "unharmed",
  "unhealthy",
  "unheard",
  "unhearing",
  "unheated",
  "unhelpful",
  "unhidden",
  "unhinge",
  "unhitched",
  "unholy",
  "unhook",
  "unicorn",
  "unicycle",
  "unified",
  "unifier",
  "uniformed",
  "uniformly",
  "unify",
  "unimpeded",
  "uninjured",
  "uninstall",
  "uninsured",
  "uninvited",
  "union",
  "uniquely",
  "unisexual",
  "unison",
  "unissued",
  "unit",
  "universal",
  "universe",
  "unjustly",
  "unkempt",
  "unkind",
  "unknotted",
  "unknowing",
  "unknown",
  "unlaced",
  "unlatch",
  "unlawful",
  "unleaded",
  "unlearned",
  "unleash",
  "unless",
  "unleveled",
  "unlighted",
  "unlikable",
  "unlimited",
  "unlined",
  "unlinked",
  "unlisted",
  "unlit",
  "unlivable",
  "unloaded",
  "unloader",
  "unlocked",
  "unlocking",
  "unlovable",
  "unloved",
  "unlovely",
  "unloving",
  "unluckily",
  "unlucky",
  "unmade",
  "unmanaged",
  "unmanned",
  "unmapped",
  "unmarked",
  "unmasked",
  "unmasking",
  "unmatched",
  "unmindful",
  "unmixable",
  "unmixed",
  "unmolded",
  "unmoral",
  "unmovable",
  "unmoved",
  "unmoving",
  "unnamable",
  "unnamed",
  "unnatural",
  "unneeded",
  "unnerve",
  "unnerving",
  "unnoticed",
  "unopened",
  "unopposed",
  "unpack",
  "unpadded",
  "unpaid",
  "unpainted",
  "unpaired",
  "unpaved",
  "unpeeled",
  "unpicked",
  "unpiloted",
  "unpinned",
  "unplanned",
  "unplanted",
  "unpleased",
  "unpledged",
  "unplowed",
  "unplug",
  "unpopular",
  "unproven",
  "unquote",
  "unranked",
  "unrated",
  "unraveled",
  "unreached",
  "unread",
  "unreal",
  "unreeling",
  "unrefined",
  "unrelated",
  "unrented",
  "unrest",
  "unretired",
  "unrevised",
  "unrigged",
  "unripe",
  "unrivaled",
  "unroasted",
  "unrobed",
  "unroll",
  "unruffled",
  "unruly",
  "unrushed",
  "unsaddle",
  "unsafe",
  "unsaid",
  "unsalted",
  "unsaved",
  "unsavory",
  "unscathed",
  "unscented",
  "unscrew",
  "unsealed",
  "unseated",
  "unsecured",
  "unseeing",
  "unseemly",
  "unseen",
  "unselect",
  "unselfish",
  "unsent",
  "unsettled",
  "unshackle",
  "unshaken",
  "unshaved",
  "unshaven",
  "unsheathe",
  "unshipped",
  "unsightly",
  "unsigned",
  "unskilled",
  "unsliced",
  "unsmooth",
  "unsnap",
  "unsocial",
  "unsoiled",
  "unsold",
  "unsolved",
  "unsorted",
  "unspoiled",
  "unspoken",
  "unstable",
  "unstaffed",
  "unstamped",
  "unsteady",
  "unsterile",
  "unstirred",
  "unstitch",
  "unstopped",
  "unstuck",
  "unstuffed",
  "unstylish",
  "unsubtle",
  "unsubtly",
  "unsuited",
  "unsure",
  "unsworn",
  "untagged",
  "untainted",
  "untaken",
  "untamed",
  "untangled",
  "untapped",
  "untaxed",
  "unthawed",
  "unthread",
  "untidy",
  "untie",
  "until",
  "untimed",
  "untimely",
  "untitled",
  "untoasted",
  "untold",
  "untouched",
  "untracked",
  "untrained",
  "untreated",
  "untried",
  "untrimmed",
  "untrue",
  "untruth",
  "unturned",
  "untwist",
  "untying",
  "unusable",
  "unused",
  "unusual",
  "unvalued",
  "unvaried",
  "unvarying",
  "unveiled",
  "unveiling",
  "unvented",
  "unviable",
  "unvisited",
  "unvocal",
  "unwanted",
  "unwarlike",
  "unwary",
  "unwashed",
  "unwatched",
  "unweave",
  "unwed",
  "unwelcome",
  "unwell",
  "unwieldy",
  "unwilling",
  "unwind",
  "unwired",
  "unwitting",
  "unwomanly",
  "unworldly",
  "unworn",
  "unworried",
  "unworthy",
  "unwound",
  "unwoven",
  "unwrapped",
  "unwritten",
  "unzip",
  "upbeat",
  "upchuck",
  "upcoming",
  "upcountry",
  "update",
  "upfront",
  "upgrade",
  "upheaval",
  "upheld",
  "uphill",
  "uphold",
  "uplifted",
  "uplifting",
  "upload",
  "upon",
  "upper",
  "upright",
  "uprising",
  "upriver",
  "uproar",
  "uproot",
  "upscale",
  "upside",
  "upstage",
  "upstairs",
  "upstart",
  "upstate",
  "upstream",
  "upstroke",
  "upswing",
  "uptake",
  "uptight",
  "uptown",
  "upturned",
  "upward",
  "upwind",
  "uranium",
  "urban",
  "urchin",
  "urethane",
  "urgency",
  "urgent",
  "urging",
  "urologist",
  "urology",
  "usable",
  "usage",
  "useable",
  "used",
  "uselessly",
  "user",
  "usher",
  "usual",
  "utensil",
  "utility",
  "utilize",
  "utmost",
  "utopia",
  "utter",
  "vacancy",
  "vacant",
  "vacate",
  "vacation",
  "vagabond",
  "vagrancy",
  "vagrantly",
  "vaguely",
  "vagueness",
  "valiant",
  "valid",
  "valium",
  "valley",
  "valuables",
  "value",
  "vanilla",
  "vanish",
  "vanity",
  "vanquish",
  "vantage",
  "vaporizer",
  "variable",
  "variably",
  "varied",
  "variety",
  "various",
  "varmint",
  "varnish",
  "varsity",
  "varying",
  "vascular",
  "vaseline",
  "vastly",
  "vastness",
  "veal",
  "vegan",
  "veggie",
  "vehicular",
  "velcro",
  "velocity",
  "velvet",
  "vendetta",
  "vending",
  "vendor",
  "veneering",
  "vengeful",
  "venomous",
  "ventricle",
  "venture",
  "venue",
  "venus",
  "verbalize",
  "verbally",
  "verbose",
  "verdict",
  "verify",
  "verse",
  "version",
  "versus",
  "vertebrae",
  "vertical",
  "vertigo",
  "very",
  "vessel",
  "vest",
  "veteran",
  "veto",
  "vexingly",
  "viability",
  "viable",
  "vibes",
  "vice",
  "vicinity",
  "victory",
  "video",
  "viewable",
  "viewer",
  "viewing",
  "viewless",
  "viewpoint",
  "vigorous",
  "village",
  "villain",
  "vindicate",
  "vineyard",
  "vintage",
  "violate",
  "violation",
  "violator",
  "violet",
  "violin",
  "viper",
  "viral",
  "virtual",
  "virtuous",
  "virus",
  "visa",
  "viscosity",
  "viscous",
  "viselike",
  "visible",
  "visibly",
  "vision",
  "visiting",
  "visitor",
  "visor",
  "vista",
  "vitality",
  "vitalize",
  "vitally",
  "vitamins",
  "vivacious",
  "vividly",
  "vividness",
  "vixen",
  "vocalist",
  "vocalize",
  "vocally",
  "vocation",
  "voice",
  "voicing",
  "void",
  "volatile",
  "volley",
  "voltage",
  "volumes",
  "voter",
  "voting",
  "voucher",
  "vowed",
  "vowel",
  "voyage",
  "wackiness",
  "wad",
  "wafer",
  "waffle",
  "waged",
  "wager",
  "wages",
  "waggle",
  "wagon",
  "wake",
  "waking",
  "walk",
  "walmart",
  "walnut",
  "walrus",
  "waltz",
  "wand",
  "wannabe",
  "wanted",
  "wanting",
  "wasabi",
  "washable",
  "washbasin",
  "washboard",
  "washbowl",
  "washcloth",
  "washday",
  "washed",
  "washer",
  "washhouse",
  "washing",
  "washout",
  "washroom",
  "washstand",
  "washtub",
  "wasp",
  "wasting",
  "watch",
  "water",
  "waviness",
  "waving",
  "wavy",
  "whacking",
  "whacky",
  "wham",
  "wharf",
  "wheat",
  "whenever",
  "whiff",
  "whimsical",
  "whinny",
  "whiny",
  "whisking",
  "whoever",
  "whole",
  "whomever",
  "whoopee",
  "whooping",
  "whoops",
  "why",
  "wick",
  "widely",
  "widen",
  "widget",
  "widow",
  "width",
  "wieldable",
  "wielder",
  "wife",
  "wifi",
  "wikipedia",
  "wildcard",
  "wildcat",
  "wilder",
  "wildfire",
  "wildfowl",
  "wildland",
  "wildlife",
  "wildly",
  "wildness",
  "willed",
  "willfully",
  "willing",
  "willow",
  "willpower",
  "wilt",
  "wimp",
  "wince",
  "wincing",
  "wind",
  "wing",
  "winking",
  "winner",
  "winnings",
  "winter",
  "wipe",
  "wired",
  "wireless",
  "wiring",
  "wiry",
  "wisdom",
  "wise",
  "wish",
  "wisplike",
  "wispy",
  "wistful",
  "wizard",
  "wobble",
  "wobbling",
  "wobbly",
  "wok",
  "wolf",
  "wolverine",
  "womanhood",
  "womankind",
  "womanless",
  "womanlike",
  "womanly",
  "womb",
  "woof",
  "wooing",
  "wool",
  "woozy",
  "word",
  "work",
  "worried",
  "worrier",
  "worrisome",
  "worry",
  "worsening",
  "worshiper",
  "worst",
  "wound",
  "woven",
  "wow",
  "wrangle",
  "wrath",
  "wreath",
  "wreckage",
  "wrecker",
  "wrecking",
  "wrench",
  "wriggle",
  "wriggly",
  "wrinkle",
  "wrinkly",
  "wrist",
  "writing",
  "written",
  "wrongdoer",
  "wronged",
  "wrongful",
  "wrongly",
  "wrongness",
  "wrought",
  "xbox",
  "xerox",
  "yahoo",
  "yam",
  "yanking",
  "yapping",
  "yard",
  "yarn",
  "yeah",
  "yearbook",
  "yearling",
  "yearly",
  "yearning",
  "yeast",
  "yelling",
  "yelp",
  "yen",
  "yesterday",
  "yiddish",
  "yield",
  "yin",
  "yippee",
  "yo-yo",
  "yodel",
  "yoga",
  "yogurt",
  "yonder",
  "yoyo",
  "yummy",
  "zap",
  "zealous",
  "zebra",
  "zen",
  "zeppelin",
  "zero",
  "zestfully",
  "zesty",
  "zigzagged",
  "zipfile",
  "zipping",
  "zippy",
  "zips",
  "zit",
  "zodiac",
  "zombie",
  "zone",
  "zoning",
  "zookeeper",
  "zoologist",
  "zoology",
  "zoom"
];
Object.defineProperty(newSecureWords$1, "__esModule", { value: true });
newSecureWords$1.newSecureWords = void 0;
const getSecureRandom_1$1 = getSecureRandom;
const wordlist_1$1 = wordlist$1;
async function newSecureWords(size2 = 6) {
  let words = [];
  for (let i = 0; i < size2; i++) {
    words.push(wordlist_1$1.wordlist[await (0, getSecureRandom_1$1.getSecureRandomNumber)(0, wordlist_1$1.wordlist.length)]);
  }
  return words;
}
newSecureWords$1.newSecureWords = newSecureWords;
var newSecurePassphrase = {};
var hasRequiredNewSecurePassphrase;
function requireNewSecurePassphrase() {
  if (hasRequiredNewSecurePassphrase)
    return newSecurePassphrase;
  hasRequiredNewSecurePassphrase = 1;
  Object.defineProperty(newSecurePassphrase, "__esModule", { value: true });
  newSecurePassphrase.newSecurePassphrase = void 0;
  const __1 = requireDist();
  async function newSecurePassphrase$1(size2 = 6) {
    return (await (0, __1.newSecureWords)(size2)).join("-");
  }
  newSecurePassphrase.newSecurePassphrase = newSecurePassphrase$1;
  return newSecurePassphrase;
}
var mnemonic = {};
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var naclFastExports = {};
var naclFast = {
  get exports() {
    return naclFastExports;
  },
  set exports(v) {
    naclFastExports = v;
  }
};
const __viteBrowserExternal = {};
const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal
}, Symbol.toStringTag, { value: "Module" }));
const require$$0$1 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
(function(module) {
  (function(nacl2) {
    var gf = function(init2) {
      var i, r = new Float64Array(16);
      if (init2)
        for (i = 0; i < init2.length; i++)
          r[i] = init2[i];
      return r;
    };
    var randombytes = function() {
      throw new Error("no PRNG");
    };
    var _0 = new Uint8Array(16);
    var _9 = new Uint8Array(32);
    _9[0] = 9;
    var gf0 = gf(), gf1 = gf([1]), _121665 = gf([56129, 1]), D = gf([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), D2 = gf([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), X = gf([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), Y = gf([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), I = gf([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
    function ts64(x, i, h, l) {
      x[i] = h >> 24 & 255;
      x[i + 1] = h >> 16 & 255;
      x[i + 2] = h >> 8 & 255;
      x[i + 3] = h & 255;
      x[i + 4] = l >> 24 & 255;
      x[i + 5] = l >> 16 & 255;
      x[i + 6] = l >> 8 & 255;
      x[i + 7] = l & 255;
    }
    function vn(x, xi, y, yi, n) {
      var i, d = 0;
      for (i = 0; i < n; i++)
        d |= x[xi + i] ^ y[yi + i];
      return (1 & d - 1 >>> 8) - 1;
    }
    function crypto_verify_16(x, xi, y, yi) {
      return vn(x, xi, y, yi, 16);
    }
    function crypto_verify_32(x, xi, y, yi) {
      return vn(x, xi, y, yi, 32);
    }
    function core_salsa20(o, p, k, c) {
      var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
      var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
      for (var i = 0; i < 20; i += 2) {
        u = x0 + x12 | 0;
        x4 ^= u << 7 | u >>> 32 - 7;
        u = x4 + x0 | 0;
        x8 ^= u << 9 | u >>> 32 - 9;
        u = x8 + x4 | 0;
        x12 ^= u << 13 | u >>> 32 - 13;
        u = x12 + x8 | 0;
        x0 ^= u << 18 | u >>> 32 - 18;
        u = x5 + x1 | 0;
        x9 ^= u << 7 | u >>> 32 - 7;
        u = x9 + x5 | 0;
        x13 ^= u << 9 | u >>> 32 - 9;
        u = x13 + x9 | 0;
        x1 ^= u << 13 | u >>> 32 - 13;
        u = x1 + x13 | 0;
        x5 ^= u << 18 | u >>> 32 - 18;
        u = x10 + x6 | 0;
        x14 ^= u << 7 | u >>> 32 - 7;
        u = x14 + x10 | 0;
        x2 ^= u << 9 | u >>> 32 - 9;
        u = x2 + x14 | 0;
        x6 ^= u << 13 | u >>> 32 - 13;
        u = x6 + x2 | 0;
        x10 ^= u << 18 | u >>> 32 - 18;
        u = x15 + x11 | 0;
        x3 ^= u << 7 | u >>> 32 - 7;
        u = x3 + x15 | 0;
        x7 ^= u << 9 | u >>> 32 - 9;
        u = x7 + x3 | 0;
        x11 ^= u << 13 | u >>> 32 - 13;
        u = x11 + x7 | 0;
        x15 ^= u << 18 | u >>> 32 - 18;
        u = x0 + x3 | 0;
        x1 ^= u << 7 | u >>> 32 - 7;
        u = x1 + x0 | 0;
        x2 ^= u << 9 | u >>> 32 - 9;
        u = x2 + x1 | 0;
        x3 ^= u << 13 | u >>> 32 - 13;
        u = x3 + x2 | 0;
        x0 ^= u << 18 | u >>> 32 - 18;
        u = x5 + x4 | 0;
        x6 ^= u << 7 | u >>> 32 - 7;
        u = x6 + x5 | 0;
        x7 ^= u << 9 | u >>> 32 - 9;
        u = x7 + x6 | 0;
        x4 ^= u << 13 | u >>> 32 - 13;
        u = x4 + x7 | 0;
        x5 ^= u << 18 | u >>> 32 - 18;
        u = x10 + x9 | 0;
        x11 ^= u << 7 | u >>> 32 - 7;
        u = x11 + x10 | 0;
        x8 ^= u << 9 | u >>> 32 - 9;
        u = x8 + x11 | 0;
        x9 ^= u << 13 | u >>> 32 - 13;
        u = x9 + x8 | 0;
        x10 ^= u << 18 | u >>> 32 - 18;
        u = x15 + x14 | 0;
        x12 ^= u << 7 | u >>> 32 - 7;
        u = x12 + x15 | 0;
        x13 ^= u << 9 | u >>> 32 - 9;
        u = x13 + x12 | 0;
        x14 ^= u << 13 | u >>> 32 - 13;
        u = x14 + x13 | 0;
        x15 ^= u << 18 | u >>> 32 - 18;
      }
      x0 = x0 + j0 | 0;
      x1 = x1 + j1 | 0;
      x2 = x2 + j2 | 0;
      x3 = x3 + j3 | 0;
      x4 = x4 + j4 | 0;
      x5 = x5 + j5 | 0;
      x6 = x6 + j6 | 0;
      x7 = x7 + j7 | 0;
      x8 = x8 + j8 | 0;
      x9 = x9 + j9 | 0;
      x10 = x10 + j10 | 0;
      x11 = x11 + j11 | 0;
      x12 = x12 + j12 | 0;
      x13 = x13 + j13 | 0;
      x14 = x14 + j14 | 0;
      x15 = x15 + j15 | 0;
      o[0] = x0 >>> 0 & 255;
      o[1] = x0 >>> 8 & 255;
      o[2] = x0 >>> 16 & 255;
      o[3] = x0 >>> 24 & 255;
      o[4] = x1 >>> 0 & 255;
      o[5] = x1 >>> 8 & 255;
      o[6] = x1 >>> 16 & 255;
      o[7] = x1 >>> 24 & 255;
      o[8] = x2 >>> 0 & 255;
      o[9] = x2 >>> 8 & 255;
      o[10] = x2 >>> 16 & 255;
      o[11] = x2 >>> 24 & 255;
      o[12] = x3 >>> 0 & 255;
      o[13] = x3 >>> 8 & 255;
      o[14] = x3 >>> 16 & 255;
      o[15] = x3 >>> 24 & 255;
      o[16] = x4 >>> 0 & 255;
      o[17] = x4 >>> 8 & 255;
      o[18] = x4 >>> 16 & 255;
      o[19] = x4 >>> 24 & 255;
      o[20] = x5 >>> 0 & 255;
      o[21] = x5 >>> 8 & 255;
      o[22] = x5 >>> 16 & 255;
      o[23] = x5 >>> 24 & 255;
      o[24] = x6 >>> 0 & 255;
      o[25] = x6 >>> 8 & 255;
      o[26] = x6 >>> 16 & 255;
      o[27] = x6 >>> 24 & 255;
      o[28] = x7 >>> 0 & 255;
      o[29] = x7 >>> 8 & 255;
      o[30] = x7 >>> 16 & 255;
      o[31] = x7 >>> 24 & 255;
      o[32] = x8 >>> 0 & 255;
      o[33] = x8 >>> 8 & 255;
      o[34] = x8 >>> 16 & 255;
      o[35] = x8 >>> 24 & 255;
      o[36] = x9 >>> 0 & 255;
      o[37] = x9 >>> 8 & 255;
      o[38] = x9 >>> 16 & 255;
      o[39] = x9 >>> 24 & 255;
      o[40] = x10 >>> 0 & 255;
      o[41] = x10 >>> 8 & 255;
      o[42] = x10 >>> 16 & 255;
      o[43] = x10 >>> 24 & 255;
      o[44] = x11 >>> 0 & 255;
      o[45] = x11 >>> 8 & 255;
      o[46] = x11 >>> 16 & 255;
      o[47] = x11 >>> 24 & 255;
      o[48] = x12 >>> 0 & 255;
      o[49] = x12 >>> 8 & 255;
      o[50] = x12 >>> 16 & 255;
      o[51] = x12 >>> 24 & 255;
      o[52] = x13 >>> 0 & 255;
      o[53] = x13 >>> 8 & 255;
      o[54] = x13 >>> 16 & 255;
      o[55] = x13 >>> 24 & 255;
      o[56] = x14 >>> 0 & 255;
      o[57] = x14 >>> 8 & 255;
      o[58] = x14 >>> 16 & 255;
      o[59] = x14 >>> 24 & 255;
      o[60] = x15 >>> 0 & 255;
      o[61] = x15 >>> 8 & 255;
      o[62] = x15 >>> 16 & 255;
      o[63] = x15 >>> 24 & 255;
    }
    function core_hsalsa20(o, p, k, c) {
      var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
      var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
      for (var i = 0; i < 20; i += 2) {
        u = x0 + x12 | 0;
        x4 ^= u << 7 | u >>> 32 - 7;
        u = x4 + x0 | 0;
        x8 ^= u << 9 | u >>> 32 - 9;
        u = x8 + x4 | 0;
        x12 ^= u << 13 | u >>> 32 - 13;
        u = x12 + x8 | 0;
        x0 ^= u << 18 | u >>> 32 - 18;
        u = x5 + x1 | 0;
        x9 ^= u << 7 | u >>> 32 - 7;
        u = x9 + x5 | 0;
        x13 ^= u << 9 | u >>> 32 - 9;
        u = x13 + x9 | 0;
        x1 ^= u << 13 | u >>> 32 - 13;
        u = x1 + x13 | 0;
        x5 ^= u << 18 | u >>> 32 - 18;
        u = x10 + x6 | 0;
        x14 ^= u << 7 | u >>> 32 - 7;
        u = x14 + x10 | 0;
        x2 ^= u << 9 | u >>> 32 - 9;
        u = x2 + x14 | 0;
        x6 ^= u << 13 | u >>> 32 - 13;
        u = x6 + x2 | 0;
        x10 ^= u << 18 | u >>> 32 - 18;
        u = x15 + x11 | 0;
        x3 ^= u << 7 | u >>> 32 - 7;
        u = x3 + x15 | 0;
        x7 ^= u << 9 | u >>> 32 - 9;
        u = x7 + x3 | 0;
        x11 ^= u << 13 | u >>> 32 - 13;
        u = x11 + x7 | 0;
        x15 ^= u << 18 | u >>> 32 - 18;
        u = x0 + x3 | 0;
        x1 ^= u << 7 | u >>> 32 - 7;
        u = x1 + x0 | 0;
        x2 ^= u << 9 | u >>> 32 - 9;
        u = x2 + x1 | 0;
        x3 ^= u << 13 | u >>> 32 - 13;
        u = x3 + x2 | 0;
        x0 ^= u << 18 | u >>> 32 - 18;
        u = x5 + x4 | 0;
        x6 ^= u << 7 | u >>> 32 - 7;
        u = x6 + x5 | 0;
        x7 ^= u << 9 | u >>> 32 - 9;
        u = x7 + x6 | 0;
        x4 ^= u << 13 | u >>> 32 - 13;
        u = x4 + x7 | 0;
        x5 ^= u << 18 | u >>> 32 - 18;
        u = x10 + x9 | 0;
        x11 ^= u << 7 | u >>> 32 - 7;
        u = x11 + x10 | 0;
        x8 ^= u << 9 | u >>> 32 - 9;
        u = x8 + x11 | 0;
        x9 ^= u << 13 | u >>> 32 - 13;
        u = x9 + x8 | 0;
        x10 ^= u << 18 | u >>> 32 - 18;
        u = x15 + x14 | 0;
        x12 ^= u << 7 | u >>> 32 - 7;
        u = x12 + x15 | 0;
        x13 ^= u << 9 | u >>> 32 - 9;
        u = x13 + x12 | 0;
        x14 ^= u << 13 | u >>> 32 - 13;
        u = x14 + x13 | 0;
        x15 ^= u << 18 | u >>> 32 - 18;
      }
      o[0] = x0 >>> 0 & 255;
      o[1] = x0 >>> 8 & 255;
      o[2] = x0 >>> 16 & 255;
      o[3] = x0 >>> 24 & 255;
      o[4] = x5 >>> 0 & 255;
      o[5] = x5 >>> 8 & 255;
      o[6] = x5 >>> 16 & 255;
      o[7] = x5 >>> 24 & 255;
      o[8] = x10 >>> 0 & 255;
      o[9] = x10 >>> 8 & 255;
      o[10] = x10 >>> 16 & 255;
      o[11] = x10 >>> 24 & 255;
      o[12] = x15 >>> 0 & 255;
      o[13] = x15 >>> 8 & 255;
      o[14] = x15 >>> 16 & 255;
      o[15] = x15 >>> 24 & 255;
      o[16] = x6 >>> 0 & 255;
      o[17] = x6 >>> 8 & 255;
      o[18] = x6 >>> 16 & 255;
      o[19] = x6 >>> 24 & 255;
      o[20] = x7 >>> 0 & 255;
      o[21] = x7 >>> 8 & 255;
      o[22] = x7 >>> 16 & 255;
      o[23] = x7 >>> 24 & 255;
      o[24] = x8 >>> 0 & 255;
      o[25] = x8 >>> 8 & 255;
      o[26] = x8 >>> 16 & 255;
      o[27] = x8 >>> 24 & 255;
      o[28] = x9 >>> 0 & 255;
      o[29] = x9 >>> 8 & 255;
      o[30] = x9 >>> 16 & 255;
      o[31] = x9 >>> 24 & 255;
    }
    function crypto_core_salsa20(out, inp, k, c) {
      core_salsa20(out, inp, k, c);
    }
    function crypto_core_hsalsa20(out, inp, k, c) {
      core_hsalsa20(out, inp, k, c);
    }
    var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
    function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
      var z = new Uint8Array(16), x = new Uint8Array(64);
      var u, i;
      for (i = 0; i < 16; i++)
        z[i] = 0;
      for (i = 0; i < 8; i++)
        z[i] = n[i];
      while (b >= 64) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < 64; i++)
          c[cpos + i] = m[mpos + i] ^ x[i];
        u = 1;
        for (i = 8; i < 16; i++) {
          u = u + (z[i] & 255) | 0;
          z[i] = u & 255;
          u >>>= 8;
        }
        b -= 64;
        cpos += 64;
        mpos += 64;
      }
      if (b > 0) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < b; i++)
          c[cpos + i] = m[mpos + i] ^ x[i];
      }
      return 0;
    }
    function crypto_stream_salsa20(c, cpos, b, n, k) {
      var z = new Uint8Array(16), x = new Uint8Array(64);
      var u, i;
      for (i = 0; i < 16; i++)
        z[i] = 0;
      for (i = 0; i < 8; i++)
        z[i] = n[i];
      while (b >= 64) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < 64; i++)
          c[cpos + i] = x[i];
        u = 1;
        for (i = 8; i < 16; i++) {
          u = u + (z[i] & 255) | 0;
          z[i] = u & 255;
          u >>>= 8;
        }
        b -= 64;
        cpos += 64;
      }
      if (b > 0) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < b; i++)
          c[cpos + i] = x[i];
      }
      return 0;
    }
    function crypto_stream(c, cpos, d, n, k) {
      var s = new Uint8Array(32);
      crypto_core_hsalsa20(s, n, k, sigma);
      var sn = new Uint8Array(8);
      for (var i = 0; i < 8; i++)
        sn[i] = n[i + 16];
      return crypto_stream_salsa20(c, cpos, d, sn, s);
    }
    function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
      var s = new Uint8Array(32);
      crypto_core_hsalsa20(s, n, k, sigma);
      var sn = new Uint8Array(8);
      for (var i = 0; i < 8; i++)
        sn[i] = n[i + 16];
      return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, sn, s);
    }
    var poly1305 = function(key) {
      this.buffer = new Uint8Array(16);
      this.r = new Uint16Array(10);
      this.h = new Uint16Array(10);
      this.pad = new Uint16Array(8);
      this.leftover = 0;
      this.fin = 0;
      var t0, t1, t2, t3, t4, t5, t6, t7;
      t0 = key[0] & 255 | (key[1] & 255) << 8;
      this.r[0] = t0 & 8191;
      t1 = key[2] & 255 | (key[3] & 255) << 8;
      this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
      t2 = key[4] & 255 | (key[5] & 255) << 8;
      this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
      t3 = key[6] & 255 | (key[7] & 255) << 8;
      this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
      t4 = key[8] & 255 | (key[9] & 255) << 8;
      this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
      this.r[5] = t4 >>> 1 & 8190;
      t5 = key[10] & 255 | (key[11] & 255) << 8;
      this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
      t6 = key[12] & 255 | (key[13] & 255) << 8;
      this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
      t7 = key[14] & 255 | (key[15] & 255) << 8;
      this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
      this.r[9] = t7 >>> 5 & 127;
      this.pad[0] = key[16] & 255 | (key[17] & 255) << 8;
      this.pad[1] = key[18] & 255 | (key[19] & 255) << 8;
      this.pad[2] = key[20] & 255 | (key[21] & 255) << 8;
      this.pad[3] = key[22] & 255 | (key[23] & 255) << 8;
      this.pad[4] = key[24] & 255 | (key[25] & 255) << 8;
      this.pad[5] = key[26] & 255 | (key[27] & 255) << 8;
      this.pad[6] = key[28] & 255 | (key[29] & 255) << 8;
      this.pad[7] = key[30] & 255 | (key[31] & 255) << 8;
    };
    poly1305.prototype.blocks = function(m, mpos, bytes) {
      var hibit = this.fin ? 0 : 1 << 11;
      var t0, t1, t2, t3, t4, t5, t6, t7, c;
      var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
      var h0 = this.h[0], h1 = this.h[1], h2 = this.h[2], h3 = this.h[3], h4 = this.h[4], h5 = this.h[5], h6 = this.h[6], h7 = this.h[7], h8 = this.h[8], h9 = this.h[9];
      var r0 = this.r[0], r1 = this.r[1], r2 = this.r[2], r3 = this.r[3], r4 = this.r[4], r5 = this.r[5], r6 = this.r[6], r7 = this.r[7], r8 = this.r[8], r9 = this.r[9];
      while (bytes >= 16) {
        t0 = m[mpos + 0] & 255 | (m[mpos + 1] & 255) << 8;
        h0 += t0 & 8191;
        t1 = m[mpos + 2] & 255 | (m[mpos + 3] & 255) << 8;
        h1 += (t0 >>> 13 | t1 << 3) & 8191;
        t2 = m[mpos + 4] & 255 | (m[mpos + 5] & 255) << 8;
        h2 += (t1 >>> 10 | t2 << 6) & 8191;
        t3 = m[mpos + 6] & 255 | (m[mpos + 7] & 255) << 8;
        h3 += (t2 >>> 7 | t3 << 9) & 8191;
        t4 = m[mpos + 8] & 255 | (m[mpos + 9] & 255) << 8;
        h4 += (t3 >>> 4 | t4 << 12) & 8191;
        h5 += t4 >>> 1 & 8191;
        t5 = m[mpos + 10] & 255 | (m[mpos + 11] & 255) << 8;
        h6 += (t4 >>> 14 | t5 << 2) & 8191;
        t6 = m[mpos + 12] & 255 | (m[mpos + 13] & 255) << 8;
        h7 += (t5 >>> 11 | t6 << 5) & 8191;
        t7 = m[mpos + 14] & 255 | (m[mpos + 15] & 255) << 8;
        h8 += (t6 >>> 8 | t7 << 8) & 8191;
        h9 += t7 >>> 5 | hibit;
        c = 0;
        d0 = c;
        d0 += h0 * r0;
        d0 += h1 * (5 * r9);
        d0 += h2 * (5 * r8);
        d0 += h3 * (5 * r7);
        d0 += h4 * (5 * r6);
        c = d0 >>> 13;
        d0 &= 8191;
        d0 += h5 * (5 * r5);
        d0 += h6 * (5 * r4);
        d0 += h7 * (5 * r3);
        d0 += h8 * (5 * r2);
        d0 += h9 * (5 * r1);
        c += d0 >>> 13;
        d0 &= 8191;
        d1 = c;
        d1 += h0 * r1;
        d1 += h1 * r0;
        d1 += h2 * (5 * r9);
        d1 += h3 * (5 * r8);
        d1 += h4 * (5 * r7);
        c = d1 >>> 13;
        d1 &= 8191;
        d1 += h5 * (5 * r6);
        d1 += h6 * (5 * r5);
        d1 += h7 * (5 * r4);
        d1 += h8 * (5 * r3);
        d1 += h9 * (5 * r2);
        c += d1 >>> 13;
        d1 &= 8191;
        d2 = c;
        d2 += h0 * r2;
        d2 += h1 * r1;
        d2 += h2 * r0;
        d2 += h3 * (5 * r9);
        d2 += h4 * (5 * r8);
        c = d2 >>> 13;
        d2 &= 8191;
        d2 += h5 * (5 * r7);
        d2 += h6 * (5 * r6);
        d2 += h7 * (5 * r5);
        d2 += h8 * (5 * r4);
        d2 += h9 * (5 * r3);
        c += d2 >>> 13;
        d2 &= 8191;
        d3 = c;
        d3 += h0 * r3;
        d3 += h1 * r2;
        d3 += h2 * r1;
        d3 += h3 * r0;
        d3 += h4 * (5 * r9);
        c = d3 >>> 13;
        d3 &= 8191;
        d3 += h5 * (5 * r8);
        d3 += h6 * (5 * r7);
        d3 += h7 * (5 * r6);
        d3 += h8 * (5 * r5);
        d3 += h9 * (5 * r4);
        c += d3 >>> 13;
        d3 &= 8191;
        d4 = c;
        d4 += h0 * r4;
        d4 += h1 * r3;
        d4 += h2 * r2;
        d4 += h3 * r1;
        d4 += h4 * r0;
        c = d4 >>> 13;
        d4 &= 8191;
        d4 += h5 * (5 * r9);
        d4 += h6 * (5 * r8);
        d4 += h7 * (5 * r7);
        d4 += h8 * (5 * r6);
        d4 += h9 * (5 * r5);
        c += d4 >>> 13;
        d4 &= 8191;
        d5 = c;
        d5 += h0 * r5;
        d5 += h1 * r4;
        d5 += h2 * r3;
        d5 += h3 * r2;
        d5 += h4 * r1;
        c = d5 >>> 13;
        d5 &= 8191;
        d5 += h5 * r0;
        d5 += h6 * (5 * r9);
        d5 += h7 * (5 * r8);
        d5 += h8 * (5 * r7);
        d5 += h9 * (5 * r6);
        c += d5 >>> 13;
        d5 &= 8191;
        d6 = c;
        d6 += h0 * r6;
        d6 += h1 * r5;
        d6 += h2 * r4;
        d6 += h3 * r3;
        d6 += h4 * r2;
        c = d6 >>> 13;
        d6 &= 8191;
        d6 += h5 * r1;
        d6 += h6 * r0;
        d6 += h7 * (5 * r9);
        d6 += h8 * (5 * r8);
        d6 += h9 * (5 * r7);
        c += d6 >>> 13;
        d6 &= 8191;
        d7 = c;
        d7 += h0 * r7;
        d7 += h1 * r6;
        d7 += h2 * r5;
        d7 += h3 * r4;
        d7 += h4 * r3;
        c = d7 >>> 13;
        d7 &= 8191;
        d7 += h5 * r2;
        d7 += h6 * r1;
        d7 += h7 * r0;
        d7 += h8 * (5 * r9);
        d7 += h9 * (5 * r8);
        c += d7 >>> 13;
        d7 &= 8191;
        d8 = c;
        d8 += h0 * r8;
        d8 += h1 * r7;
        d8 += h2 * r6;
        d8 += h3 * r5;
        d8 += h4 * r4;
        c = d8 >>> 13;
        d8 &= 8191;
        d8 += h5 * r3;
        d8 += h6 * r2;
        d8 += h7 * r1;
        d8 += h8 * r0;
        d8 += h9 * (5 * r9);
        c += d8 >>> 13;
        d8 &= 8191;
        d9 = c;
        d9 += h0 * r9;
        d9 += h1 * r8;
        d9 += h2 * r7;
        d9 += h3 * r6;
        d9 += h4 * r5;
        c = d9 >>> 13;
        d9 &= 8191;
        d9 += h5 * r4;
        d9 += h6 * r3;
        d9 += h7 * r2;
        d9 += h8 * r1;
        d9 += h9 * r0;
        c += d9 >>> 13;
        d9 &= 8191;
        c = (c << 2) + c | 0;
        c = c + d0 | 0;
        d0 = c & 8191;
        c = c >>> 13;
        d1 += c;
        h0 = d0;
        h1 = d1;
        h2 = d2;
        h3 = d3;
        h4 = d4;
        h5 = d5;
        h6 = d6;
        h7 = d7;
        h8 = d8;
        h9 = d9;
        mpos += 16;
        bytes -= 16;
      }
      this.h[0] = h0;
      this.h[1] = h1;
      this.h[2] = h2;
      this.h[3] = h3;
      this.h[4] = h4;
      this.h[5] = h5;
      this.h[6] = h6;
      this.h[7] = h7;
      this.h[8] = h8;
      this.h[9] = h9;
    };
    poly1305.prototype.finish = function(mac, macpos) {
      var g = new Uint16Array(10);
      var c, mask, f, i;
      if (this.leftover) {
        i = this.leftover;
        this.buffer[i++] = 1;
        for (; i < 16; i++)
          this.buffer[i] = 0;
        this.fin = 1;
        this.blocks(this.buffer, 0, 16);
      }
      c = this.h[1] >>> 13;
      this.h[1] &= 8191;
      for (i = 2; i < 10; i++) {
        this.h[i] += c;
        c = this.h[i] >>> 13;
        this.h[i] &= 8191;
      }
      this.h[0] += c * 5;
      c = this.h[0] >>> 13;
      this.h[0] &= 8191;
      this.h[1] += c;
      c = this.h[1] >>> 13;
      this.h[1] &= 8191;
      this.h[2] += c;
      g[0] = this.h[0] + 5;
      c = g[0] >>> 13;
      g[0] &= 8191;
      for (i = 1; i < 10; i++) {
        g[i] = this.h[i] + c;
        c = g[i] >>> 13;
        g[i] &= 8191;
      }
      g[9] -= 1 << 13;
      mask = (c ^ 1) - 1;
      for (i = 0; i < 10; i++)
        g[i] &= mask;
      mask = ~mask;
      for (i = 0; i < 10; i++)
        this.h[i] = this.h[i] & mask | g[i];
      this.h[0] = (this.h[0] | this.h[1] << 13) & 65535;
      this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535;
      this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535;
      this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535;
      this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535;
      this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535;
      this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535;
      this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535;
      f = this.h[0] + this.pad[0];
      this.h[0] = f & 65535;
      for (i = 1; i < 8; i++) {
        f = (this.h[i] + this.pad[i] | 0) + (f >>> 16) | 0;
        this.h[i] = f & 65535;
      }
      mac[macpos + 0] = this.h[0] >>> 0 & 255;
      mac[macpos + 1] = this.h[0] >>> 8 & 255;
      mac[macpos + 2] = this.h[1] >>> 0 & 255;
      mac[macpos + 3] = this.h[1] >>> 8 & 255;
      mac[macpos + 4] = this.h[2] >>> 0 & 255;
      mac[macpos + 5] = this.h[2] >>> 8 & 255;
      mac[macpos + 6] = this.h[3] >>> 0 & 255;
      mac[macpos + 7] = this.h[3] >>> 8 & 255;
      mac[macpos + 8] = this.h[4] >>> 0 & 255;
      mac[macpos + 9] = this.h[4] >>> 8 & 255;
      mac[macpos + 10] = this.h[5] >>> 0 & 255;
      mac[macpos + 11] = this.h[5] >>> 8 & 255;
      mac[macpos + 12] = this.h[6] >>> 0 & 255;
      mac[macpos + 13] = this.h[6] >>> 8 & 255;
      mac[macpos + 14] = this.h[7] >>> 0 & 255;
      mac[macpos + 15] = this.h[7] >>> 8 & 255;
    };
    poly1305.prototype.update = function(m, mpos, bytes) {
      var i, want;
      if (this.leftover) {
        want = 16 - this.leftover;
        if (want > bytes)
          want = bytes;
        for (i = 0; i < want; i++)
          this.buffer[this.leftover + i] = m[mpos + i];
        bytes -= want;
        mpos += want;
        this.leftover += want;
        if (this.leftover < 16)
          return;
        this.blocks(this.buffer, 0, 16);
        this.leftover = 0;
      }
      if (bytes >= 16) {
        want = bytes - bytes % 16;
        this.blocks(m, mpos, want);
        mpos += want;
        bytes -= want;
      }
      if (bytes) {
        for (i = 0; i < bytes; i++)
          this.buffer[this.leftover + i] = m[mpos + i];
        this.leftover += bytes;
      }
    };
    function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
      var s = new poly1305(k);
      s.update(m, mpos, n);
      s.finish(out, outpos);
      return 0;
    }
    function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
      var x = new Uint8Array(16);
      crypto_onetimeauth(x, 0, m, mpos, n, k);
      return crypto_verify_16(h, hpos, x, 0);
    }
    function crypto_secretbox(c, m, d, n, k) {
      var i;
      if (d < 32)
        return -1;
      crypto_stream_xor(c, 0, m, 0, d, n, k);
      crypto_onetimeauth(c, 16, c, 32, d - 32, c);
      for (i = 0; i < 16; i++)
        c[i] = 0;
      return 0;
    }
    function crypto_secretbox_open(m, c, d, n, k) {
      var i;
      var x = new Uint8Array(32);
      if (d < 32)
        return -1;
      crypto_stream(x, 0, 32, n, k);
      if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0)
        return -1;
      crypto_stream_xor(m, 0, c, 0, d, n, k);
      for (i = 0; i < 32; i++)
        m[i] = 0;
      return 0;
    }
    function set25519(r, a) {
      var i;
      for (i = 0; i < 16; i++)
        r[i] = a[i] | 0;
    }
    function car25519(o) {
      var i, v, c = 1;
      for (i = 0; i < 16; i++) {
        v = o[i] + c + 65535;
        c = Math.floor(v / 65536);
        o[i] = v - c * 65536;
      }
      o[0] += c - 1 + 37 * (c - 1);
    }
    function sel25519(p, q, b) {
      var t2, c = ~(b - 1);
      for (var i = 0; i < 16; i++) {
        t2 = c & (p[i] ^ q[i]);
        p[i] ^= t2;
        q[i] ^= t2;
      }
    }
    function pack25519(o, n) {
      var i, j, b;
      var m = gf(), t2 = gf();
      for (i = 0; i < 16; i++)
        t2[i] = n[i];
      car25519(t2);
      car25519(t2);
      car25519(t2);
      for (j = 0; j < 2; j++) {
        m[0] = t2[0] - 65517;
        for (i = 1; i < 15; i++) {
          m[i] = t2[i] - 65535 - (m[i - 1] >> 16 & 1);
          m[i - 1] &= 65535;
        }
        m[15] = t2[15] - 32767 - (m[14] >> 16 & 1);
        b = m[15] >> 16 & 1;
        m[14] &= 65535;
        sel25519(t2, m, 1 - b);
      }
      for (i = 0; i < 16; i++) {
        o[2 * i] = t2[i] & 255;
        o[2 * i + 1] = t2[i] >> 8;
      }
    }
    function neq25519(a, b) {
      var c = new Uint8Array(32), d = new Uint8Array(32);
      pack25519(c, a);
      pack25519(d, b);
      return crypto_verify_32(c, 0, d, 0);
    }
    function par25519(a) {
      var d = new Uint8Array(32);
      pack25519(d, a);
      return d[0] & 1;
    }
    function unpack25519(o, n) {
      var i;
      for (i = 0; i < 16; i++)
        o[i] = n[2 * i] + (n[2 * i + 1] << 8);
      o[15] &= 32767;
    }
    function A(o, a, b) {
      for (var i = 0; i < 16; i++)
        o[i] = a[i] + b[i];
    }
    function Z(o, a, b) {
      for (var i = 0; i < 16; i++)
        o[i] = a[i] - b[i];
    }
    function M(o, a, b) {
      var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
      v = a[0];
      t0 += v * b0;
      t1 += v * b1;
      t2 += v * b2;
      t3 += v * b3;
      t4 += v * b4;
      t5 += v * b5;
      t6 += v * b6;
      t7 += v * b7;
      t8 += v * b8;
      t9 += v * b9;
      t10 += v * b10;
      t11 += v * b11;
      t12 += v * b12;
      t13 += v * b13;
      t14 += v * b14;
      t15 += v * b15;
      v = a[1];
      t1 += v * b0;
      t2 += v * b1;
      t3 += v * b2;
      t4 += v * b3;
      t5 += v * b4;
      t6 += v * b5;
      t7 += v * b6;
      t8 += v * b7;
      t9 += v * b8;
      t10 += v * b9;
      t11 += v * b10;
      t12 += v * b11;
      t13 += v * b12;
      t14 += v * b13;
      t15 += v * b14;
      t16 += v * b15;
      v = a[2];
      t2 += v * b0;
      t3 += v * b1;
      t4 += v * b2;
      t5 += v * b3;
      t6 += v * b4;
      t7 += v * b5;
      t8 += v * b6;
      t9 += v * b7;
      t10 += v * b8;
      t11 += v * b9;
      t12 += v * b10;
      t13 += v * b11;
      t14 += v * b12;
      t15 += v * b13;
      t16 += v * b14;
      t17 += v * b15;
      v = a[3];
      t3 += v * b0;
      t4 += v * b1;
      t5 += v * b2;
      t6 += v * b3;
      t7 += v * b4;
      t8 += v * b5;
      t9 += v * b6;
      t10 += v * b7;
      t11 += v * b8;
      t12 += v * b9;
      t13 += v * b10;
      t14 += v * b11;
      t15 += v * b12;
      t16 += v * b13;
      t17 += v * b14;
      t18 += v * b15;
      v = a[4];
      t4 += v * b0;
      t5 += v * b1;
      t6 += v * b2;
      t7 += v * b3;
      t8 += v * b4;
      t9 += v * b5;
      t10 += v * b6;
      t11 += v * b7;
      t12 += v * b8;
      t13 += v * b9;
      t14 += v * b10;
      t15 += v * b11;
      t16 += v * b12;
      t17 += v * b13;
      t18 += v * b14;
      t19 += v * b15;
      v = a[5];
      t5 += v * b0;
      t6 += v * b1;
      t7 += v * b2;
      t8 += v * b3;
      t9 += v * b4;
      t10 += v * b5;
      t11 += v * b6;
      t12 += v * b7;
      t13 += v * b8;
      t14 += v * b9;
      t15 += v * b10;
      t16 += v * b11;
      t17 += v * b12;
      t18 += v * b13;
      t19 += v * b14;
      t20 += v * b15;
      v = a[6];
      t6 += v * b0;
      t7 += v * b1;
      t8 += v * b2;
      t9 += v * b3;
      t10 += v * b4;
      t11 += v * b5;
      t12 += v * b6;
      t13 += v * b7;
      t14 += v * b8;
      t15 += v * b9;
      t16 += v * b10;
      t17 += v * b11;
      t18 += v * b12;
      t19 += v * b13;
      t20 += v * b14;
      t21 += v * b15;
      v = a[7];
      t7 += v * b0;
      t8 += v * b1;
      t9 += v * b2;
      t10 += v * b3;
      t11 += v * b4;
      t12 += v * b5;
      t13 += v * b6;
      t14 += v * b7;
      t15 += v * b8;
      t16 += v * b9;
      t17 += v * b10;
      t18 += v * b11;
      t19 += v * b12;
      t20 += v * b13;
      t21 += v * b14;
      t22 += v * b15;
      v = a[8];
      t8 += v * b0;
      t9 += v * b1;
      t10 += v * b2;
      t11 += v * b3;
      t12 += v * b4;
      t13 += v * b5;
      t14 += v * b6;
      t15 += v * b7;
      t16 += v * b8;
      t17 += v * b9;
      t18 += v * b10;
      t19 += v * b11;
      t20 += v * b12;
      t21 += v * b13;
      t22 += v * b14;
      t23 += v * b15;
      v = a[9];
      t9 += v * b0;
      t10 += v * b1;
      t11 += v * b2;
      t12 += v * b3;
      t13 += v * b4;
      t14 += v * b5;
      t15 += v * b6;
      t16 += v * b7;
      t17 += v * b8;
      t18 += v * b9;
      t19 += v * b10;
      t20 += v * b11;
      t21 += v * b12;
      t22 += v * b13;
      t23 += v * b14;
      t24 += v * b15;
      v = a[10];
      t10 += v * b0;
      t11 += v * b1;
      t12 += v * b2;
      t13 += v * b3;
      t14 += v * b4;
      t15 += v * b5;
      t16 += v * b6;
      t17 += v * b7;
      t18 += v * b8;
      t19 += v * b9;
      t20 += v * b10;
      t21 += v * b11;
      t22 += v * b12;
      t23 += v * b13;
      t24 += v * b14;
      t25 += v * b15;
      v = a[11];
      t11 += v * b0;
      t12 += v * b1;
      t13 += v * b2;
      t14 += v * b3;
      t15 += v * b4;
      t16 += v * b5;
      t17 += v * b6;
      t18 += v * b7;
      t19 += v * b8;
      t20 += v * b9;
      t21 += v * b10;
      t22 += v * b11;
      t23 += v * b12;
      t24 += v * b13;
      t25 += v * b14;
      t26 += v * b15;
      v = a[12];
      t12 += v * b0;
      t13 += v * b1;
      t14 += v * b2;
      t15 += v * b3;
      t16 += v * b4;
      t17 += v * b5;
      t18 += v * b6;
      t19 += v * b7;
      t20 += v * b8;
      t21 += v * b9;
      t22 += v * b10;
      t23 += v * b11;
      t24 += v * b12;
      t25 += v * b13;
      t26 += v * b14;
      t27 += v * b15;
      v = a[13];
      t13 += v * b0;
      t14 += v * b1;
      t15 += v * b2;
      t16 += v * b3;
      t17 += v * b4;
      t18 += v * b5;
      t19 += v * b6;
      t20 += v * b7;
      t21 += v * b8;
      t22 += v * b9;
      t23 += v * b10;
      t24 += v * b11;
      t25 += v * b12;
      t26 += v * b13;
      t27 += v * b14;
      t28 += v * b15;
      v = a[14];
      t14 += v * b0;
      t15 += v * b1;
      t16 += v * b2;
      t17 += v * b3;
      t18 += v * b4;
      t19 += v * b5;
      t20 += v * b6;
      t21 += v * b7;
      t22 += v * b8;
      t23 += v * b9;
      t24 += v * b10;
      t25 += v * b11;
      t26 += v * b12;
      t27 += v * b13;
      t28 += v * b14;
      t29 += v * b15;
      v = a[15];
      t15 += v * b0;
      t16 += v * b1;
      t17 += v * b2;
      t18 += v * b3;
      t19 += v * b4;
      t20 += v * b5;
      t21 += v * b6;
      t22 += v * b7;
      t23 += v * b8;
      t24 += v * b9;
      t25 += v * b10;
      t26 += v * b11;
      t27 += v * b12;
      t28 += v * b13;
      t29 += v * b14;
      t30 += v * b15;
      t0 += 38 * t16;
      t1 += 38 * t17;
      t2 += 38 * t18;
      t3 += 38 * t19;
      t4 += 38 * t20;
      t5 += 38 * t21;
      t6 += 38 * t22;
      t7 += 38 * t23;
      t8 += 38 * t24;
      t9 += 38 * t25;
      t10 += 38 * t26;
      t11 += 38 * t27;
      t12 += 38 * t28;
      t13 += 38 * t29;
      t14 += 38 * t30;
      c = 1;
      v = t0 + c + 65535;
      c = Math.floor(v / 65536);
      t0 = v - c * 65536;
      v = t1 + c + 65535;
      c = Math.floor(v / 65536);
      t1 = v - c * 65536;
      v = t2 + c + 65535;
      c = Math.floor(v / 65536);
      t2 = v - c * 65536;
      v = t3 + c + 65535;
      c = Math.floor(v / 65536);
      t3 = v - c * 65536;
      v = t4 + c + 65535;
      c = Math.floor(v / 65536);
      t4 = v - c * 65536;
      v = t5 + c + 65535;
      c = Math.floor(v / 65536);
      t5 = v - c * 65536;
      v = t6 + c + 65535;
      c = Math.floor(v / 65536);
      t6 = v - c * 65536;
      v = t7 + c + 65535;
      c = Math.floor(v / 65536);
      t7 = v - c * 65536;
      v = t8 + c + 65535;
      c = Math.floor(v / 65536);
      t8 = v - c * 65536;
      v = t9 + c + 65535;
      c = Math.floor(v / 65536);
      t9 = v - c * 65536;
      v = t10 + c + 65535;
      c = Math.floor(v / 65536);
      t10 = v - c * 65536;
      v = t11 + c + 65535;
      c = Math.floor(v / 65536);
      t11 = v - c * 65536;
      v = t12 + c + 65535;
      c = Math.floor(v / 65536);
      t12 = v - c * 65536;
      v = t13 + c + 65535;
      c = Math.floor(v / 65536);
      t13 = v - c * 65536;
      v = t14 + c + 65535;
      c = Math.floor(v / 65536);
      t14 = v - c * 65536;
      v = t15 + c + 65535;
      c = Math.floor(v / 65536);
      t15 = v - c * 65536;
      t0 += c - 1 + 37 * (c - 1);
      c = 1;
      v = t0 + c + 65535;
      c = Math.floor(v / 65536);
      t0 = v - c * 65536;
      v = t1 + c + 65535;
      c = Math.floor(v / 65536);
      t1 = v - c * 65536;
      v = t2 + c + 65535;
      c = Math.floor(v / 65536);
      t2 = v - c * 65536;
      v = t3 + c + 65535;
      c = Math.floor(v / 65536);
      t3 = v - c * 65536;
      v = t4 + c + 65535;
      c = Math.floor(v / 65536);
      t4 = v - c * 65536;
      v = t5 + c + 65535;
      c = Math.floor(v / 65536);
      t5 = v - c * 65536;
      v = t6 + c + 65535;
      c = Math.floor(v / 65536);
      t6 = v - c * 65536;
      v = t7 + c + 65535;
      c = Math.floor(v / 65536);
      t7 = v - c * 65536;
      v = t8 + c + 65535;
      c = Math.floor(v / 65536);
      t8 = v - c * 65536;
      v = t9 + c + 65535;
      c = Math.floor(v / 65536);
      t9 = v - c * 65536;
      v = t10 + c + 65535;
      c = Math.floor(v / 65536);
      t10 = v - c * 65536;
      v = t11 + c + 65535;
      c = Math.floor(v / 65536);
      t11 = v - c * 65536;
      v = t12 + c + 65535;
      c = Math.floor(v / 65536);
      t12 = v - c * 65536;
      v = t13 + c + 65535;
      c = Math.floor(v / 65536);
      t13 = v - c * 65536;
      v = t14 + c + 65535;
      c = Math.floor(v / 65536);
      t14 = v - c * 65536;
      v = t15 + c + 65535;
      c = Math.floor(v / 65536);
      t15 = v - c * 65536;
      t0 += c - 1 + 37 * (c - 1);
      o[0] = t0;
      o[1] = t1;
      o[2] = t2;
      o[3] = t3;
      o[4] = t4;
      o[5] = t5;
      o[6] = t6;
      o[7] = t7;
      o[8] = t8;
      o[9] = t9;
      o[10] = t10;
      o[11] = t11;
      o[12] = t12;
      o[13] = t13;
      o[14] = t14;
      o[15] = t15;
    }
    function S(o, a) {
      M(o, a, a);
    }
    function inv25519(o, i) {
      var c = gf();
      var a;
      for (a = 0; a < 16; a++)
        c[a] = i[a];
      for (a = 253; a >= 0; a--) {
        S(c, c);
        if (a !== 2 && a !== 4)
          M(c, c, i);
      }
      for (a = 0; a < 16; a++)
        o[a] = c[a];
    }
    function pow2523(o, i) {
      var c = gf();
      var a;
      for (a = 0; a < 16; a++)
        c[a] = i[a];
      for (a = 250; a >= 0; a--) {
        S(c, c);
        if (a !== 1)
          M(c, c, i);
      }
      for (a = 0; a < 16; a++)
        o[a] = c[a];
    }
    function crypto_scalarmult(q, n, p) {
      var z = new Uint8Array(32);
      var x = new Float64Array(80), r, i;
      var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf();
      for (i = 0; i < 31; i++)
        z[i] = n[i];
      z[31] = n[31] & 127 | 64;
      z[0] &= 248;
      unpack25519(x, p);
      for (i = 0; i < 16; i++) {
        b[i] = x[i];
        d[i] = a[i] = c[i] = 0;
      }
      a[0] = d[0] = 1;
      for (i = 254; i >= 0; --i) {
        r = z[i >>> 3] >>> (i & 7) & 1;
        sel25519(a, b, r);
        sel25519(c, d, r);
        A(e, a, c);
        Z(a, a, c);
        A(c, b, d);
        Z(b, b, d);
        S(d, e);
        S(f, a);
        M(a, c, a);
        M(c, b, e);
        A(e, a, c);
        Z(a, a, c);
        S(b, a);
        Z(c, d, f);
        M(a, c, _121665);
        A(a, a, d);
        M(c, c, a);
        M(a, d, f);
        M(d, b, x);
        S(b, e);
        sel25519(a, b, r);
        sel25519(c, d, r);
      }
      for (i = 0; i < 16; i++) {
        x[i + 16] = a[i];
        x[i + 32] = c[i];
        x[i + 48] = b[i];
        x[i + 64] = d[i];
      }
      var x32 = x.subarray(32);
      var x16 = x.subarray(16);
      inv25519(x32, x32);
      M(x16, x16, x32);
      pack25519(q, x16);
      return 0;
    }
    function crypto_scalarmult_base(q, n) {
      return crypto_scalarmult(q, n, _9);
    }
    function crypto_box_keypair(y, x) {
      randombytes(x, 32);
      return crypto_scalarmult_base(y, x);
    }
    function crypto_box_beforenm(k, y, x) {
      var s = new Uint8Array(32);
      crypto_scalarmult(s, x, y);
      return crypto_core_hsalsa20(k, _0, s, sigma);
    }
    var crypto_box_afternm = crypto_secretbox;
    var crypto_box_open_afternm = crypto_secretbox_open;
    function crypto_box(c, m, d, n, y, x) {
      var k = new Uint8Array(32);
      crypto_box_beforenm(k, y, x);
      return crypto_box_afternm(c, m, d, n, k);
    }
    function crypto_box_open(m, c, d, n, y, x) {
      var k = new Uint8Array(32);
      crypto_box_beforenm(k, y, x);
      return crypto_box_open_afternm(m, c, d, n, k);
    }
    var K = [
      1116352408,
      3609767458,
      1899447441,
      602891725,
      3049323471,
      3964484399,
      3921009573,
      2173295548,
      961987163,
      4081628472,
      1508970993,
      3053834265,
      2453635748,
      2937671579,
      2870763221,
      3664609560,
      3624381080,
      2734883394,
      310598401,
      1164996542,
      607225278,
      1323610764,
      1426881987,
      3590304994,
      1925078388,
      4068182383,
      2162078206,
      991336113,
      2614888103,
      633803317,
      3248222580,
      3479774868,
      3835390401,
      2666613458,
      4022224774,
      944711139,
      264347078,
      2341262773,
      604807628,
      2007800933,
      770255983,
      1495990901,
      1249150122,
      1856431235,
      1555081692,
      3175218132,
      1996064986,
      2198950837,
      2554220882,
      3999719339,
      2821834349,
      766784016,
      2952996808,
      2566594879,
      3210313671,
      3203337956,
      3336571891,
      1034457026,
      3584528711,
      2466948901,
      113926993,
      3758326383,
      338241895,
      168717936,
      666307205,
      1188179964,
      773529912,
      1546045734,
      1294757372,
      1522805485,
      1396182291,
      2643833823,
      1695183700,
      2343527390,
      1986661051,
      1014477480,
      2177026350,
      1206759142,
      2456956037,
      344077627,
      2730485921,
      1290863460,
      2820302411,
      3158454273,
      3259730800,
      3505952657,
      3345764771,
      106217008,
      3516065817,
      3606008344,
      3600352804,
      1432725776,
      4094571909,
      1467031594,
      275423344,
      851169720,
      430227734,
      3100823752,
      506948616,
      1363258195,
      659060556,
      3750685593,
      883997877,
      3785050280,
      958139571,
      3318307427,
      1322822218,
      3812723403,
      1537002063,
      2003034995,
      1747873779,
      3602036899,
      1955562222,
      1575990012,
      2024104815,
      1125592928,
      2227730452,
      2716904306,
      2361852424,
      442776044,
      2428436474,
      593698344,
      2756734187,
      3733110249,
      3204031479,
      2999351573,
      3329325298,
      3815920427,
      3391569614,
      3928383900,
      3515267271,
      566280711,
      3940187606,
      3454069534,
      4118630271,
      4000239992,
      116418474,
      1914138554,
      174292421,
      2731055270,
      289380356,
      3203993006,
      460393269,
      320620315,
      685471733,
      587496836,
      852142971,
      1086792851,
      1017036298,
      365543100,
      1126000580,
      2618297676,
      1288033470,
      3409855158,
      1501505948,
      4234509866,
      1607167915,
      987167468,
      1816402316,
      1246189591
    ];
    function crypto_hashblocks_hl(hh, hl, m, n) {
      var wh = new Int32Array(16), wl = new Int32Array(16), bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i, j, h, l, a, b, c, d;
      var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
      var pos = 0;
      while (n >= 128) {
        for (i = 0; i < 16; i++) {
          j = 8 * i + pos;
          wh[i] = m[j + 0] << 24 | m[j + 1] << 16 | m[j + 2] << 8 | m[j + 3];
          wl[i] = m[j + 4] << 24 | m[j + 5] << 16 | m[j + 6] << 8 | m[j + 7];
        }
        for (i = 0; i < 80; i++) {
          bh0 = ah0;
          bh1 = ah1;
          bh2 = ah2;
          bh3 = ah3;
          bh4 = ah4;
          bh5 = ah5;
          bh6 = ah6;
          bh7 = ah7;
          bl0 = al0;
          bl1 = al1;
          bl2 = al2;
          bl3 = al3;
          bl4 = al4;
          bl5 = al5;
          bl6 = al6;
          bl7 = al7;
          h = ah7;
          l = al7;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
          l = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          h = ah4 & ah5 ^ ~ah4 & ah6;
          l = al4 & al5 ^ ~al4 & al6;
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          h = K[i * 2];
          l = K[i * 2 + 1];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          h = wh[i % 16];
          l = wl[i % 16];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          th = c & 65535 | d << 16;
          tl = a & 65535 | b << 16;
          h = th;
          l = tl;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
          l = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
          l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          bh7 = c & 65535 | d << 16;
          bl7 = a & 65535 | b << 16;
          h = bh3;
          l = bl3;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = th;
          l = tl;
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          bh3 = c & 65535 | d << 16;
          bl3 = a & 65535 | b << 16;
          ah1 = bh0;
          ah2 = bh1;
          ah3 = bh2;
          ah4 = bh3;
          ah5 = bh4;
          ah6 = bh5;
          ah7 = bh6;
          ah0 = bh7;
          al1 = bl0;
          al2 = bl1;
          al3 = bl2;
          al4 = bl3;
          al5 = bl4;
          al6 = bl5;
          al7 = bl6;
          al0 = bl7;
          if (i % 16 === 15) {
            for (j = 0; j < 16; j++) {
              h = wh[j];
              l = wl[j];
              a = l & 65535;
              b = l >>> 16;
              c = h & 65535;
              d = h >>> 16;
              h = wh[(j + 9) % 16];
              l = wl[(j + 9) % 16];
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              th = wh[(j + 1) % 16];
              tl = wl[(j + 1) % 16];
              h = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
              l = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              th = wh[(j + 14) % 16];
              tl = wl[(j + 14) % 16];
              h = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
              l = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              b += a >>> 16;
              c += b >>> 16;
              d += c >>> 16;
              wh[j] = c & 65535 | d << 16;
              wl[j] = a & 65535 | b << 16;
            }
          }
        }
        h = ah0;
        l = al0;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[0];
        l = hl[0];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[0] = ah0 = c & 65535 | d << 16;
        hl[0] = al0 = a & 65535 | b << 16;
        h = ah1;
        l = al1;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[1];
        l = hl[1];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[1] = ah1 = c & 65535 | d << 16;
        hl[1] = al1 = a & 65535 | b << 16;
        h = ah2;
        l = al2;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[2];
        l = hl[2];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[2] = ah2 = c & 65535 | d << 16;
        hl[2] = al2 = a & 65535 | b << 16;
        h = ah3;
        l = al3;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[3];
        l = hl[3];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[3] = ah3 = c & 65535 | d << 16;
        hl[3] = al3 = a & 65535 | b << 16;
        h = ah4;
        l = al4;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[4];
        l = hl[4];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[4] = ah4 = c & 65535 | d << 16;
        hl[4] = al4 = a & 65535 | b << 16;
        h = ah5;
        l = al5;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[5];
        l = hl[5];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[5] = ah5 = c & 65535 | d << 16;
        hl[5] = al5 = a & 65535 | b << 16;
        h = ah6;
        l = al6;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[6];
        l = hl[6];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[6] = ah6 = c & 65535 | d << 16;
        hl[6] = al6 = a & 65535 | b << 16;
        h = ah7;
        l = al7;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[7];
        l = hl[7];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[7] = ah7 = c & 65535 | d << 16;
        hl[7] = al7 = a & 65535 | b << 16;
        pos += 128;
        n -= 128;
      }
      return n;
    }
    function crypto_hash(out, m, n) {
      var hh = new Int32Array(8), hl = new Int32Array(8), x = new Uint8Array(256), i, b = n;
      hh[0] = 1779033703;
      hh[1] = 3144134277;
      hh[2] = 1013904242;
      hh[3] = 2773480762;
      hh[4] = 1359893119;
      hh[5] = 2600822924;
      hh[6] = 528734635;
      hh[7] = 1541459225;
      hl[0] = 4089235720;
      hl[1] = 2227873595;
      hl[2] = 4271175723;
      hl[3] = 1595750129;
      hl[4] = 2917565137;
      hl[5] = 725511199;
      hl[6] = 4215389547;
      hl[7] = 327033209;
      crypto_hashblocks_hl(hh, hl, m, n);
      n %= 128;
      for (i = 0; i < n; i++)
        x[i] = m[b - n + i];
      x[n] = 128;
      n = 256 - 128 * (n < 112 ? 1 : 0);
      x[n - 9] = 0;
      ts64(x, n - 8, b / 536870912 | 0, b << 3);
      crypto_hashblocks_hl(hh, hl, x, n);
      for (i = 0; i < 8; i++)
        ts64(out, 8 * i, hh[i], hl[i]);
      return 0;
    }
    function add(p, q) {
      var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t2 = gf();
      Z(a, p[1], p[0]);
      Z(t2, q[1], q[0]);
      M(a, a, t2);
      A(b, p[0], p[1]);
      A(t2, q[0], q[1]);
      M(b, b, t2);
      M(c, p[3], q[3]);
      M(c, c, D2);
      M(d, p[2], q[2]);
      A(d, d, d);
      Z(e, b, a);
      Z(f, d, c);
      A(g, d, c);
      A(h, b, a);
      M(p[0], e, f);
      M(p[1], h, g);
      M(p[2], g, f);
      M(p[3], e, h);
    }
    function cswap(p, q, b) {
      var i;
      for (i = 0; i < 4; i++) {
        sel25519(p[i], q[i], b);
      }
    }
    function pack(r, p) {
      var tx = gf(), ty = gf(), zi = gf();
      inv25519(zi, p[2]);
      M(tx, p[0], zi);
      M(ty, p[1], zi);
      pack25519(r, ty);
      r[31] ^= par25519(tx) << 7;
    }
    function scalarmult(p, q, s) {
      var b, i;
      set25519(p[0], gf0);
      set25519(p[1], gf1);
      set25519(p[2], gf1);
      set25519(p[3], gf0);
      for (i = 255; i >= 0; --i) {
        b = s[i / 8 | 0] >> (i & 7) & 1;
        cswap(p, q, b);
        add(q, p);
        add(p, p);
        cswap(p, q, b);
      }
    }
    function scalarbase(p, s) {
      var q = [gf(), gf(), gf(), gf()];
      set25519(q[0], X);
      set25519(q[1], Y);
      set25519(q[2], gf1);
      M(q[3], X, Y);
      scalarmult(p, q, s);
    }
    function crypto_sign_keypair(pk, sk, seeded) {
      var d = new Uint8Array(64);
      var p = [gf(), gf(), gf(), gf()];
      var i;
      if (!seeded)
        randombytes(sk, 32);
      crypto_hash(d, sk, 32);
      d[0] &= 248;
      d[31] &= 127;
      d[31] |= 64;
      scalarbase(p, d);
      pack(pk, p);
      for (i = 0; i < 32; i++)
        sk[i + 32] = pk[i];
      return 0;
    }
    var L = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
    function modL(r, x) {
      var carry, i, j, k;
      for (i = 63; i >= 32; --i) {
        carry = 0;
        for (j = i - 32, k = i - 12; j < k; ++j) {
          x[j] += carry - 16 * x[i] * L[j - (i - 32)];
          carry = Math.floor((x[j] + 128) / 256);
          x[j] -= carry * 256;
        }
        x[j] += carry;
        x[i] = 0;
      }
      carry = 0;
      for (j = 0; j < 32; j++) {
        x[j] += carry - (x[31] >> 4) * L[j];
        carry = x[j] >> 8;
        x[j] &= 255;
      }
      for (j = 0; j < 32; j++)
        x[j] -= carry * L[j];
      for (i = 0; i < 32; i++) {
        x[i + 1] += x[i] >> 8;
        r[i] = x[i] & 255;
      }
    }
    function reduce2(r) {
      var x = new Float64Array(64), i;
      for (i = 0; i < 64; i++)
        x[i] = r[i];
      for (i = 0; i < 64; i++)
        r[i] = 0;
      modL(r, x);
    }
    function crypto_sign(sm, m, n, sk) {
      var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
      var i, j, x = new Float64Array(64);
      var p = [gf(), gf(), gf(), gf()];
      crypto_hash(d, sk, 32);
      d[0] &= 248;
      d[31] &= 127;
      d[31] |= 64;
      var smlen = n + 64;
      for (i = 0; i < n; i++)
        sm[64 + i] = m[i];
      for (i = 0; i < 32; i++)
        sm[32 + i] = d[32 + i];
      crypto_hash(r, sm.subarray(32), n + 32);
      reduce2(r);
      scalarbase(p, r);
      pack(sm, p);
      for (i = 32; i < 64; i++)
        sm[i] = sk[i];
      crypto_hash(h, sm, n + 64);
      reduce2(h);
      for (i = 0; i < 64; i++)
        x[i] = 0;
      for (i = 0; i < 32; i++)
        x[i] = r[i];
      for (i = 0; i < 32; i++) {
        for (j = 0; j < 32; j++) {
          x[i + j] += h[i] * d[j];
        }
      }
      modL(sm.subarray(32), x);
      return smlen;
    }
    function unpackneg(r, p) {
      var t2 = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
      set25519(r[2], gf1);
      unpack25519(r[1], p);
      S(num, r[1]);
      M(den, num, D);
      Z(num, num, r[2]);
      A(den, r[2], den);
      S(den2, den);
      S(den4, den2);
      M(den6, den4, den2);
      M(t2, den6, num);
      M(t2, t2, den);
      pow2523(t2, t2);
      M(t2, t2, num);
      M(t2, t2, den);
      M(t2, t2, den);
      M(r[0], t2, den);
      S(chk, r[0]);
      M(chk, chk, den);
      if (neq25519(chk, num))
        M(r[0], r[0], I);
      S(chk, r[0]);
      M(chk, chk, den);
      if (neq25519(chk, num))
        return -1;
      if (par25519(r[0]) === p[31] >> 7)
        Z(r[0], gf0, r[0]);
      M(r[3], r[0], r[1]);
      return 0;
    }
    function crypto_sign_open(m, sm, n, pk) {
      var i;
      var t2 = new Uint8Array(32), h = new Uint8Array(64);
      var p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()];
      if (n < 64)
        return -1;
      if (unpackneg(q, pk))
        return -1;
      for (i = 0; i < n; i++)
        m[i] = sm[i];
      for (i = 0; i < 32; i++)
        m[i + 32] = pk[i];
      crypto_hash(h, m, n);
      reduce2(h);
      scalarmult(p, q, h);
      scalarbase(q, sm.subarray(32));
      add(p, q);
      pack(t2, p);
      n -= 64;
      if (crypto_verify_32(sm, 0, t2, 0)) {
        for (i = 0; i < n; i++)
          m[i] = 0;
        return -1;
      }
      for (i = 0; i < n; i++)
        m[i] = sm[i + 64];
      return n;
    }
    var crypto_secretbox_KEYBYTES = 32, crypto_secretbox_NONCEBYTES = 24, crypto_secretbox_ZEROBYTES = 32, crypto_secretbox_BOXZEROBYTES = 16, crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_box_PUBLICKEYBYTES = 32, crypto_box_SECRETKEYBYTES = 32, crypto_box_BEFORENMBYTES = 32, crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES, crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES, crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
    nacl2.lowlevel = {
      crypto_core_hsalsa20,
      crypto_stream_xor,
      crypto_stream,
      crypto_stream_salsa20_xor,
      crypto_stream_salsa20,
      crypto_onetimeauth,
      crypto_onetimeauth_verify,
      crypto_verify_16,
      crypto_verify_32,
      crypto_secretbox,
      crypto_secretbox_open,
      crypto_scalarmult,
      crypto_scalarmult_base,
      crypto_box_beforenm,
      crypto_box_afternm,
      crypto_box,
      crypto_box_open,
      crypto_box_keypair,
      crypto_hash,
      crypto_sign,
      crypto_sign_keypair,
      crypto_sign_open,
      crypto_secretbox_KEYBYTES,
      crypto_secretbox_NONCEBYTES,
      crypto_secretbox_ZEROBYTES,
      crypto_secretbox_BOXZEROBYTES,
      crypto_scalarmult_BYTES,
      crypto_scalarmult_SCALARBYTES,
      crypto_box_PUBLICKEYBYTES,
      crypto_box_SECRETKEYBYTES,
      crypto_box_BEFORENMBYTES,
      crypto_box_NONCEBYTES,
      crypto_box_ZEROBYTES,
      crypto_box_BOXZEROBYTES,
      crypto_sign_BYTES,
      crypto_sign_PUBLICKEYBYTES,
      crypto_sign_SECRETKEYBYTES,
      crypto_sign_SEEDBYTES,
      crypto_hash_BYTES,
      gf,
      D,
      L,
      pack25519,
      unpack25519,
      M,
      A,
      S,
      Z,
      pow2523,
      add,
      set25519,
      modL,
      scalarmult,
      scalarbase
    };
    function checkLengths(k, n) {
      if (k.length !== crypto_secretbox_KEYBYTES)
        throw new Error("bad key size");
      if (n.length !== crypto_secretbox_NONCEBYTES)
        throw new Error("bad nonce size");
    }
    function checkBoxLengths(pk, sk) {
      if (pk.length !== crypto_box_PUBLICKEYBYTES)
        throw new Error("bad public key size");
      if (sk.length !== crypto_box_SECRETKEYBYTES)
        throw new Error("bad secret key size");
    }
    function checkArrayTypes() {
      for (var i = 0; i < arguments.length; i++) {
        if (!(arguments[i] instanceof Uint8Array))
          throw new TypeError("unexpected type, use Uint8Array");
      }
    }
    function cleanup(arr) {
      for (var i = 0; i < arr.length; i++)
        arr[i] = 0;
    }
    nacl2.randomBytes = function(n) {
      var b = new Uint8Array(n);
      randombytes(b, n);
      return b;
    };
    nacl2.secretbox = function(msg, nonce, key) {
      checkArrayTypes(msg, nonce, key);
      checkLengths(key, nonce);
      var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
      var c = new Uint8Array(m.length);
      for (var i = 0; i < msg.length; i++)
        m[i + crypto_secretbox_ZEROBYTES] = msg[i];
      crypto_secretbox(c, m, m.length, nonce, key);
      return c.subarray(crypto_secretbox_BOXZEROBYTES);
    };
    nacl2.secretbox.open = function(box, nonce, key) {
      checkArrayTypes(box, nonce, key);
      checkLengths(key, nonce);
      var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
      var m = new Uint8Array(c.length);
      for (var i = 0; i < box.length; i++)
        c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
      if (c.length < 32)
        return null;
      if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0)
        return null;
      return m.subarray(crypto_secretbox_ZEROBYTES);
    };
    nacl2.secretbox.keyLength = crypto_secretbox_KEYBYTES;
    nacl2.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
    nacl2.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
    nacl2.scalarMult = function(n, p) {
      checkArrayTypes(n, p);
      if (n.length !== crypto_scalarmult_SCALARBYTES)
        throw new Error("bad n size");
      if (p.length !== crypto_scalarmult_BYTES)
        throw new Error("bad p size");
      var q = new Uint8Array(crypto_scalarmult_BYTES);
      crypto_scalarmult(q, n, p);
      return q;
    };
    nacl2.scalarMult.base = function(n) {
      checkArrayTypes(n);
      if (n.length !== crypto_scalarmult_SCALARBYTES)
        throw new Error("bad n size");
      var q = new Uint8Array(crypto_scalarmult_BYTES);
      crypto_scalarmult_base(q, n);
      return q;
    };
    nacl2.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
    nacl2.scalarMult.groupElementLength = crypto_scalarmult_BYTES;
    nacl2.box = function(msg, nonce, publicKey, secretKey) {
      var k = nacl2.box.before(publicKey, secretKey);
      return nacl2.secretbox(msg, nonce, k);
    };
    nacl2.box.before = function(publicKey, secretKey) {
      checkArrayTypes(publicKey, secretKey);
      checkBoxLengths(publicKey, secretKey);
      var k = new Uint8Array(crypto_box_BEFORENMBYTES);
      crypto_box_beforenm(k, publicKey, secretKey);
      return k;
    };
    nacl2.box.after = nacl2.secretbox;
    nacl2.box.open = function(msg, nonce, publicKey, secretKey) {
      var k = nacl2.box.before(publicKey, secretKey);
      return nacl2.secretbox.open(msg, nonce, k);
    };
    nacl2.box.open.after = nacl2.secretbox.open;
    nacl2.box.keyPair = function() {
      var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
      var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
      crypto_box_keypair(pk, sk);
      return { publicKey: pk, secretKey: sk };
    };
    nacl2.box.keyPair.fromSecretKey = function(secretKey) {
      checkArrayTypes(secretKey);
      if (secretKey.length !== crypto_box_SECRETKEYBYTES)
        throw new Error("bad secret key size");
      var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
      crypto_scalarmult_base(pk, secretKey);
      return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
    };
    nacl2.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
    nacl2.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
    nacl2.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
    nacl2.box.nonceLength = crypto_box_NONCEBYTES;
    nacl2.box.overheadLength = nacl2.secretbox.overheadLength;
    nacl2.sign = function(msg, secretKey) {
      checkArrayTypes(msg, secretKey);
      if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
        throw new Error("bad secret key size");
      var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
      crypto_sign(signedMsg, msg, msg.length, secretKey);
      return signedMsg;
    };
    nacl2.sign.open = function(signedMsg, publicKey) {
      checkArrayTypes(signedMsg, publicKey);
      if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
        throw new Error("bad public key size");
      var tmp = new Uint8Array(signedMsg.length);
      var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
      if (mlen < 0)
        return null;
      var m = new Uint8Array(mlen);
      for (var i = 0; i < m.length; i++)
        m[i] = tmp[i];
      return m;
    };
    nacl2.sign.detached = function(msg, secretKey) {
      var signedMsg = nacl2.sign(msg, secretKey);
      var sig = new Uint8Array(crypto_sign_BYTES);
      for (var i = 0; i < sig.length; i++)
        sig[i] = signedMsg[i];
      return sig;
    };
    nacl2.sign.detached.verify = function(msg, sig, publicKey) {
      checkArrayTypes(msg, sig, publicKey);
      if (sig.length !== crypto_sign_BYTES)
        throw new Error("bad signature size");
      if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
        throw new Error("bad public key size");
      var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
      var m = new Uint8Array(crypto_sign_BYTES + msg.length);
      var i;
      for (i = 0; i < crypto_sign_BYTES; i++)
        sm[i] = sig[i];
      for (i = 0; i < msg.length; i++)
        sm[i + crypto_sign_BYTES] = msg[i];
      return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
    };
    nacl2.sign.keyPair = function() {
      var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
      var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
      crypto_sign_keypair(pk, sk);
      return { publicKey: pk, secretKey: sk };
    };
    nacl2.sign.keyPair.fromSecretKey = function(secretKey) {
      checkArrayTypes(secretKey);
      if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
        throw new Error("bad secret key size");
      var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
      for (var i = 0; i < pk.length; i++)
        pk[i] = secretKey[32 + i];
      return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
    };
    nacl2.sign.keyPair.fromSeed = function(seed) {
      checkArrayTypes(seed);
      if (seed.length !== crypto_sign_SEEDBYTES)
        throw new Error("bad seed size");
      var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
      var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
      for (var i = 0; i < 32; i++)
        sk[i] = seed[i];
      crypto_sign_keypair(pk, sk, true);
      return { publicKey: pk, secretKey: sk };
    };
    nacl2.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
    nacl2.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
    nacl2.sign.seedLength = crypto_sign_SEEDBYTES;
    nacl2.sign.signatureLength = crypto_sign_BYTES;
    nacl2.hash = function(msg) {
      checkArrayTypes(msg);
      var h = new Uint8Array(crypto_hash_BYTES);
      crypto_hash(h, msg, msg.length);
      return h;
    };
    nacl2.hash.hashLength = crypto_hash_BYTES;
    nacl2.verify = function(x, y) {
      checkArrayTypes(x, y);
      if (x.length === 0 || y.length === 0)
        return false;
      if (x.length !== y.length)
        return false;
      return vn(x, 0, y, 0, x.length) === 0 ? true : false;
    };
    nacl2.setPRNG = function(fn) {
      randombytes = fn;
    };
    (function() {
      var crypto2 = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
      if (crypto2 && crypto2.getRandomValues) {
        var QUOTA = 65536;
        nacl2.setPRNG(function(x, n) {
          var i, v = new Uint8Array(n);
          for (i = 0; i < n; i += QUOTA) {
            crypto2.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
          }
          for (i = 0; i < n; i++)
            x[i] = v[i];
          cleanup(v);
        });
      } else if (typeof commonjsRequire !== "undefined") {
        crypto2 = require$$0$1;
        if (crypto2 && crypto2.randomBytes) {
          nacl2.setPRNG(function(x, n) {
            var i, v = crypto2.randomBytes(n);
            for (i = 0; i < n; i++)
              x[i] = v[i];
            cleanup(v);
          });
        }
      }
    })();
  })(module.exports ? module.exports : self.nacl = self.nacl || {});
})(naclFast);
var binary = {};
Object.defineProperty(binary, "__esModule", { value: true });
binary.bitsToBytes = binary.bytesToBits = binary.lpad = void 0;
function lpad(str, padString, length) {
  while (str.length < length) {
    str = padString + str;
  }
  return str;
}
binary.lpad = lpad;
function bytesToBits(bytes) {
  let res = "";
  for (let i = 0; i < bytes.length; i++) {
    let x = bytes.at(i);
    res += lpad(x.toString(2), "0", 8);
  }
  return res;
}
binary.bytesToBits = bytesToBits;
function bitsToBytes(src2) {
  if (src2.length % 8 !== 0) {
    throw Error("Uneven bits");
  }
  let res = [];
  while (src2.length > 0) {
    res.push(parseInt(src2.slice(0, 8), 2));
    src2 = src2.slice(8);
  }
  return Buffer.from(res);
}
binary.bitsToBytes = bitsToBytes;
var wordlist = {};
Object.defineProperty(wordlist, "__esModule", { value: true });
wordlist.wordlist = void 0;
const EN = [
  "abandon",
  "ability",
  "able",
  "about",
  "above",
  "absent",
  "absorb",
  "abstract",
  "absurd",
  "abuse",
  "access",
  "accident",
  "account",
  "accuse",
  "achieve",
  "acid",
  "acoustic",
  "acquire",
  "across",
  "act",
  "action",
  "actor",
  "actress",
  "actual",
  "adapt",
  "add",
  "addict",
  "address",
  "adjust",
  "admit",
  "adult",
  "advance",
  "advice",
  "aerobic",
  "affair",
  "afford",
  "afraid",
  "again",
  "age",
  "agent",
  "agree",
  "ahead",
  "aim",
  "air",
  "airport",
  "aisle",
  "alarm",
  "album",
  "alcohol",
  "alert",
  "alien",
  "all",
  "alley",
  "allow",
  "almost",
  "alone",
  "alpha",
  "already",
  "also",
  "alter",
  "always",
  "amateur",
  "amazing",
  "among",
  "amount",
  "amused",
  "analyst",
  "anchor",
  "ancient",
  "anger",
  "angle",
  "angry",
  "animal",
  "ankle",
  "announce",
  "annual",
  "another",
  "answer",
  "antenna",
  "antique",
  "anxiety",
  "any",
  "apart",
  "apology",
  "appear",
  "apple",
  "approve",
  "april",
  "arch",
  "arctic",
  "area",
  "arena",
  "argue",
  "arm",
  "armed",
  "armor",
  "army",
  "around",
  "arrange",
  "arrest",
  "arrive",
  "arrow",
  "art",
  "artefact",
  "artist",
  "artwork",
  "ask",
  "aspect",
  "assault",
  "asset",
  "assist",
  "assume",
  "asthma",
  "athlete",
  "atom",
  "attack",
  "attend",
  "attitude",
  "attract",
  "auction",
  "audit",
  "august",
  "aunt",
  "author",
  "auto",
  "autumn",
  "average",
  "avocado",
  "avoid",
  "awake",
  "aware",
  "away",
  "awesome",
  "awful",
  "awkward",
  "axis",
  "baby",
  "bachelor",
  "bacon",
  "badge",
  "bag",
  "balance",
  "balcony",
  "ball",
  "bamboo",
  "banana",
  "banner",
  "bar",
  "barely",
  "bargain",
  "barrel",
  "base",
  "basic",
  "basket",
  "battle",
  "beach",
  "bean",
  "beauty",
  "because",
  "become",
  "beef",
  "before",
  "begin",
  "behave",
  "behind",
  "believe",
  "below",
  "belt",
  "bench",
  "benefit",
  "best",
  "betray",
  "better",
  "between",
  "beyond",
  "bicycle",
  "bid",
  "bike",
  "bind",
  "biology",
  "bird",
  "birth",
  "bitter",
  "black",
  "blade",
  "blame",
  "blanket",
  "blast",
  "bleak",
  "bless",
  "blind",
  "blood",
  "blossom",
  "blouse",
  "blue",
  "blur",
  "blush",
  "board",
  "boat",
  "body",
  "boil",
  "bomb",
  "bone",
  "bonus",
  "book",
  "boost",
  "border",
  "boring",
  "borrow",
  "boss",
  "bottom",
  "bounce",
  "box",
  "boy",
  "bracket",
  "brain",
  "brand",
  "brass",
  "brave",
  "bread",
  "breeze",
  "brick",
  "bridge",
  "brief",
  "bright",
  "bring",
  "brisk",
  "broccoli",
  "broken",
  "bronze",
  "broom",
  "brother",
  "brown",
  "brush",
  "bubble",
  "buddy",
  "budget",
  "buffalo",
  "build",
  "bulb",
  "bulk",
  "bullet",
  "bundle",
  "bunker",
  "burden",
  "burger",
  "burst",
  "bus",
  "business",
  "busy",
  "butter",
  "buyer",
  "buzz",
  "cabbage",
  "cabin",
  "cable",
  "cactus",
  "cage",
  "cake",
  "call",
  "calm",
  "camera",
  "camp",
  "can",
  "canal",
  "cancel",
  "candy",
  "cannon",
  "canoe",
  "canvas",
  "canyon",
  "capable",
  "capital",
  "captain",
  "car",
  "carbon",
  "card",
  "cargo",
  "carpet",
  "carry",
  "cart",
  "case",
  "cash",
  "casino",
  "castle",
  "casual",
  "cat",
  "catalog",
  "catch",
  "category",
  "cattle",
  "caught",
  "cause",
  "caution",
  "cave",
  "ceiling",
  "celery",
  "cement",
  "census",
  "century",
  "cereal",
  "certain",
  "chair",
  "chalk",
  "champion",
  "change",
  "chaos",
  "chapter",
  "charge",
  "chase",
  "chat",
  "cheap",
  "check",
  "cheese",
  "chef",
  "cherry",
  "chest",
  "chicken",
  "chief",
  "child",
  "chimney",
  "choice",
  "choose",
  "chronic",
  "chuckle",
  "chunk",
  "churn",
  "cigar",
  "cinnamon",
  "circle",
  "citizen",
  "city",
  "civil",
  "claim",
  "clap",
  "clarify",
  "claw",
  "clay",
  "clean",
  "clerk",
  "clever",
  "click",
  "client",
  "cliff",
  "climb",
  "clinic",
  "clip",
  "clock",
  "clog",
  "close",
  "cloth",
  "cloud",
  "clown",
  "club",
  "clump",
  "cluster",
  "clutch",
  "coach",
  "coast",
  "coconut",
  "code",
  "coffee",
  "coil",
  "coin",
  "collect",
  "color",
  "column",
  "combine",
  "come",
  "comfort",
  "comic",
  "common",
  "company",
  "concert",
  "conduct",
  "confirm",
  "congress",
  "connect",
  "consider",
  "control",
  "convince",
  "cook",
  "cool",
  "copper",
  "copy",
  "coral",
  "core",
  "corn",
  "correct",
  "cost",
  "cotton",
  "couch",
  "country",
  "couple",
  "course",
  "cousin",
  "cover",
  "coyote",
  "crack",
  "cradle",
  "craft",
  "cram",
  "crane",
  "crash",
  "crater",
  "crawl",
  "crazy",
  "cream",
  "credit",
  "creek",
  "crew",
  "cricket",
  "crime",
  "crisp",
  "critic",
  "crop",
  "cross",
  "crouch",
  "crowd",
  "crucial",
  "cruel",
  "cruise",
  "crumble",
  "crunch",
  "crush",
  "cry",
  "crystal",
  "cube",
  "culture",
  "cup",
  "cupboard",
  "curious",
  "current",
  "curtain",
  "curve",
  "cushion",
  "custom",
  "cute",
  "cycle",
  "dad",
  "damage",
  "damp",
  "dance",
  "danger",
  "daring",
  "dash",
  "daughter",
  "dawn",
  "day",
  "deal",
  "debate",
  "debris",
  "decade",
  "december",
  "decide",
  "decline",
  "decorate",
  "decrease",
  "deer",
  "defense",
  "define",
  "defy",
  "degree",
  "delay",
  "deliver",
  "demand",
  "demise",
  "denial",
  "dentist",
  "deny",
  "depart",
  "depend",
  "deposit",
  "depth",
  "deputy",
  "derive",
  "describe",
  "desert",
  "design",
  "desk",
  "despair",
  "destroy",
  "detail",
  "detect",
  "develop",
  "device",
  "devote",
  "diagram",
  "dial",
  "diamond",
  "diary",
  "dice",
  "diesel",
  "diet",
  "differ",
  "digital",
  "dignity",
  "dilemma",
  "dinner",
  "dinosaur",
  "direct",
  "dirt",
  "disagree",
  "discover",
  "disease",
  "dish",
  "dismiss",
  "disorder",
  "display",
  "distance",
  "divert",
  "divide",
  "divorce",
  "dizzy",
  "doctor",
  "document",
  "dog",
  "doll",
  "dolphin",
  "domain",
  "donate",
  "donkey",
  "donor",
  "door",
  "dose",
  "double",
  "dove",
  "draft",
  "dragon",
  "drama",
  "drastic",
  "draw",
  "dream",
  "dress",
  "drift",
  "drill",
  "drink",
  "drip",
  "drive",
  "drop",
  "drum",
  "dry",
  "duck",
  "dumb",
  "dune",
  "during",
  "dust",
  "dutch",
  "duty",
  "dwarf",
  "dynamic",
  "eager",
  "eagle",
  "early",
  "earn",
  "earth",
  "easily",
  "east",
  "easy",
  "echo",
  "ecology",
  "economy",
  "edge",
  "edit",
  "educate",
  "effort",
  "egg",
  "eight",
  "either",
  "elbow",
  "elder",
  "electric",
  "elegant",
  "element",
  "elephant",
  "elevator",
  "elite",
  "else",
  "embark",
  "embody",
  "embrace",
  "emerge",
  "emotion",
  "employ",
  "empower",
  "empty",
  "enable",
  "enact",
  "end",
  "endless",
  "endorse",
  "enemy",
  "energy",
  "enforce",
  "engage",
  "engine",
  "enhance",
  "enjoy",
  "enlist",
  "enough",
  "enrich",
  "enroll",
  "ensure",
  "enter",
  "entire",
  "entry",
  "envelope",
  "episode",
  "equal",
  "equip",
  "era",
  "erase",
  "erode",
  "erosion",
  "error",
  "erupt",
  "escape",
  "essay",
  "essence",
  "estate",
  "eternal",
  "ethics",
  "evidence",
  "evil",
  "evoke",
  "evolve",
  "exact",
  "example",
  "excess",
  "exchange",
  "excite",
  "exclude",
  "excuse",
  "execute",
  "exercise",
  "exhaust",
  "exhibit",
  "exile",
  "exist",
  "exit",
  "exotic",
  "expand",
  "expect",
  "expire",
  "explain",
  "expose",
  "express",
  "extend",
  "extra",
  "eye",
  "eyebrow",
  "fabric",
  "face",
  "faculty",
  "fade",
  "faint",
  "faith",
  "fall",
  "false",
  "fame",
  "family",
  "famous",
  "fan",
  "fancy",
  "fantasy",
  "farm",
  "fashion",
  "fat",
  "fatal",
  "father",
  "fatigue",
  "fault",
  "favorite",
  "feature",
  "february",
  "federal",
  "fee",
  "feed",
  "feel",
  "female",
  "fence",
  "festival",
  "fetch",
  "fever",
  "few",
  "fiber",
  "fiction",
  "field",
  "figure",
  "file",
  "film",
  "filter",
  "final",
  "find",
  "fine",
  "finger",
  "finish",
  "fire",
  "firm",
  "first",
  "fiscal",
  "fish",
  "fit",
  "fitness",
  "fix",
  "flag",
  "flame",
  "flash",
  "flat",
  "flavor",
  "flee",
  "flight",
  "flip",
  "float",
  "flock",
  "floor",
  "flower",
  "fluid",
  "flush",
  "fly",
  "foam",
  "focus",
  "fog",
  "foil",
  "fold",
  "follow",
  "food",
  "foot",
  "force",
  "forest",
  "forget",
  "fork",
  "fortune",
  "forum",
  "forward",
  "fossil",
  "foster",
  "found",
  "fox",
  "fragile",
  "frame",
  "frequent",
  "fresh",
  "friend",
  "fringe",
  "frog",
  "front",
  "frost",
  "frown",
  "frozen",
  "fruit",
  "fuel",
  "fun",
  "funny",
  "furnace",
  "fury",
  "future",
  "gadget",
  "gain",
  "galaxy",
  "gallery",
  "game",
  "gap",
  "garage",
  "garbage",
  "garden",
  "garlic",
  "garment",
  "gas",
  "gasp",
  "gate",
  "gather",
  "gauge",
  "gaze",
  "general",
  "genius",
  "genre",
  "gentle",
  "genuine",
  "gesture",
  "ghost",
  "giant",
  "gift",
  "giggle",
  "ginger",
  "giraffe",
  "girl",
  "give",
  "glad",
  "glance",
  "glare",
  "glass",
  "glide",
  "glimpse",
  "globe",
  "gloom",
  "glory",
  "glove",
  "glow",
  "glue",
  "goat",
  "goddess",
  "gold",
  "good",
  "goose",
  "gorilla",
  "gospel",
  "gossip",
  "govern",
  "gown",
  "grab",
  "grace",
  "grain",
  "grant",
  "grape",
  "grass",
  "gravity",
  "great",
  "green",
  "grid",
  "grief",
  "grit",
  "grocery",
  "group",
  "grow",
  "grunt",
  "guard",
  "guess",
  "guide",
  "guilt",
  "guitar",
  "gun",
  "gym",
  "habit",
  "hair",
  "half",
  "hammer",
  "hamster",
  "hand",
  "happy",
  "harbor",
  "hard",
  "harsh",
  "harvest",
  "hat",
  "have",
  "hawk",
  "hazard",
  "head",
  "health",
  "heart",
  "heavy",
  "hedgehog",
  "height",
  "hello",
  "helmet",
  "help",
  "hen",
  "hero",
  "hidden",
  "high",
  "hill",
  "hint",
  "hip",
  "hire",
  "history",
  "hobby",
  "hockey",
  "hold",
  "hole",
  "holiday",
  "hollow",
  "home",
  "honey",
  "hood",
  "hope",
  "horn",
  "horror",
  "horse",
  "hospital",
  "host",
  "hotel",
  "hour",
  "hover",
  "hub",
  "huge",
  "human",
  "humble",
  "humor",
  "hundred",
  "hungry",
  "hunt",
  "hurdle",
  "hurry",
  "hurt",
  "husband",
  "hybrid",
  "ice",
  "icon",
  "idea",
  "identify",
  "idle",
  "ignore",
  "ill",
  "illegal",
  "illness",
  "image",
  "imitate",
  "immense",
  "immune",
  "impact",
  "impose",
  "improve",
  "impulse",
  "inch",
  "include",
  "income",
  "increase",
  "index",
  "indicate",
  "indoor",
  "industry",
  "infant",
  "inflict",
  "inform",
  "inhale",
  "inherit",
  "initial",
  "inject",
  "injury",
  "inmate",
  "inner",
  "innocent",
  "input",
  "inquiry",
  "insane",
  "insect",
  "inside",
  "inspire",
  "install",
  "intact",
  "interest",
  "into",
  "invest",
  "invite",
  "involve",
  "iron",
  "island",
  "isolate",
  "issue",
  "item",
  "ivory",
  "jacket",
  "jaguar",
  "jar",
  "jazz",
  "jealous",
  "jeans",
  "jelly",
  "jewel",
  "job",
  "join",
  "joke",
  "journey",
  "joy",
  "judge",
  "juice",
  "jump",
  "jungle",
  "junior",
  "junk",
  "just",
  "kangaroo",
  "keen",
  "keep",
  "ketchup",
  "key",
  "kick",
  "kid",
  "kidney",
  "kind",
  "kingdom",
  "kiss",
  "kit",
  "kitchen",
  "kite",
  "kitten",
  "kiwi",
  "knee",
  "knife",
  "knock",
  "know",
  "lab",
  "label",
  "labor",
  "ladder",
  "lady",
  "lake",
  "lamp",
  "language",
  "laptop",
  "large",
  "later",
  "latin",
  "laugh",
  "laundry",
  "lava",
  "law",
  "lawn",
  "lawsuit",
  "layer",
  "lazy",
  "leader",
  "leaf",
  "learn",
  "leave",
  "lecture",
  "left",
  "leg",
  "legal",
  "legend",
  "leisure",
  "lemon",
  "lend",
  "length",
  "lens",
  "leopard",
  "lesson",
  "letter",
  "level",
  "liar",
  "liberty",
  "library",
  "license",
  "life",
  "lift",
  "light",
  "like",
  "limb",
  "limit",
  "link",
  "lion",
  "liquid",
  "list",
  "little",
  "live",
  "lizard",
  "load",
  "loan",
  "lobster",
  "local",
  "lock",
  "logic",
  "lonely",
  "long",
  "loop",
  "lottery",
  "loud",
  "lounge",
  "love",
  "loyal",
  "lucky",
  "luggage",
  "lumber",
  "lunar",
  "lunch",
  "luxury",
  "lyrics",
  "machine",
  "mad",
  "magic",
  "magnet",
  "maid",
  "mail",
  "main",
  "major",
  "make",
  "mammal",
  "man",
  "manage",
  "mandate",
  "mango",
  "mansion",
  "manual",
  "maple",
  "marble",
  "march",
  "margin",
  "marine",
  "market",
  "marriage",
  "mask",
  "mass",
  "master",
  "match",
  "material",
  "math",
  "matrix",
  "matter",
  "maximum",
  "maze",
  "meadow",
  "mean",
  "measure",
  "meat",
  "mechanic",
  "medal",
  "media",
  "melody",
  "melt",
  "member",
  "memory",
  "mention",
  "menu",
  "mercy",
  "merge",
  "merit",
  "merry",
  "mesh",
  "message",
  "metal",
  "method",
  "middle",
  "midnight",
  "milk",
  "million",
  "mimic",
  "mind",
  "minimum",
  "minor",
  "minute",
  "miracle",
  "mirror",
  "misery",
  "miss",
  "mistake",
  "mix",
  "mixed",
  "mixture",
  "mobile",
  "model",
  "modify",
  "mom",
  "moment",
  "monitor",
  "monkey",
  "monster",
  "month",
  "moon",
  "moral",
  "more",
  "morning",
  "mosquito",
  "mother",
  "motion",
  "motor",
  "mountain",
  "mouse",
  "move",
  "movie",
  "much",
  "muffin",
  "mule",
  "multiply",
  "muscle",
  "museum",
  "mushroom",
  "music",
  "must",
  "mutual",
  "myself",
  "mystery",
  "myth",
  "naive",
  "name",
  "napkin",
  "narrow",
  "nasty",
  "nation",
  "nature",
  "near",
  "neck",
  "need",
  "negative",
  "neglect",
  "neither",
  "nephew",
  "nerve",
  "nest",
  "net",
  "network",
  "neutral",
  "never",
  "news",
  "next",
  "nice",
  "night",
  "noble",
  "noise",
  "nominee",
  "noodle",
  "normal",
  "north",
  "nose",
  "notable",
  "note",
  "nothing",
  "notice",
  "novel",
  "now",
  "nuclear",
  "number",
  "nurse",
  "nut",
  "oak",
  "obey",
  "object",
  "oblige",
  "obscure",
  "observe",
  "obtain",
  "obvious",
  "occur",
  "ocean",
  "october",
  "odor",
  "off",
  "offer",
  "office",
  "often",
  "oil",
  "okay",
  "old",
  "olive",
  "olympic",
  "omit",
  "once",
  "one",
  "onion",
  "online",
  "only",
  "open",
  "opera",
  "opinion",
  "oppose",
  "option",
  "orange",
  "orbit",
  "orchard",
  "order",
  "ordinary",
  "organ",
  "orient",
  "original",
  "orphan",
  "ostrich",
  "other",
  "outdoor",
  "outer",
  "output",
  "outside",
  "oval",
  "oven",
  "over",
  "own",
  "owner",
  "oxygen",
  "oyster",
  "ozone",
  "pact",
  "paddle",
  "page",
  "pair",
  "palace",
  "palm",
  "panda",
  "panel",
  "panic",
  "panther",
  "paper",
  "parade",
  "parent",
  "park",
  "parrot",
  "party",
  "pass",
  "patch",
  "path",
  "patient",
  "patrol",
  "pattern",
  "pause",
  "pave",
  "payment",
  "peace",
  "peanut",
  "pear",
  "peasant",
  "pelican",
  "pen",
  "penalty",
  "pencil",
  "people",
  "pepper",
  "perfect",
  "permit",
  "person",
  "pet",
  "phone",
  "photo",
  "phrase",
  "physical",
  "piano",
  "picnic",
  "picture",
  "piece",
  "pig",
  "pigeon",
  "pill",
  "pilot",
  "pink",
  "pioneer",
  "pipe",
  "pistol",
  "pitch",
  "pizza",
  "place",
  "planet",
  "plastic",
  "plate",
  "play",
  "please",
  "pledge",
  "pluck",
  "plug",
  "plunge",
  "poem",
  "poet",
  "point",
  "polar",
  "pole",
  "police",
  "pond",
  "pony",
  "pool",
  "popular",
  "portion",
  "position",
  "possible",
  "post",
  "potato",
  "pottery",
  "poverty",
  "powder",
  "power",
  "practice",
  "praise",
  "predict",
  "prefer",
  "prepare",
  "present",
  "pretty",
  "prevent",
  "price",
  "pride",
  "primary",
  "print",
  "priority",
  "prison",
  "private",
  "prize",
  "problem",
  "process",
  "produce",
  "profit",
  "program",
  "project",
  "promote",
  "proof",
  "property",
  "prosper",
  "protect",
  "proud",
  "provide",
  "public",
  "pudding",
  "pull",
  "pulp",
  "pulse",
  "pumpkin",
  "punch",
  "pupil",
  "puppy",
  "purchase",
  "purity",
  "purpose",
  "purse",
  "push",
  "put",
  "puzzle",
  "pyramid",
  "quality",
  "quantum",
  "quarter",
  "question",
  "quick",
  "quit",
  "quiz",
  "quote",
  "rabbit",
  "raccoon",
  "race",
  "rack",
  "radar",
  "radio",
  "rail",
  "rain",
  "raise",
  "rally",
  "ramp",
  "ranch",
  "random",
  "range",
  "rapid",
  "rare",
  "rate",
  "rather",
  "raven",
  "raw",
  "razor",
  "ready",
  "real",
  "reason",
  "rebel",
  "rebuild",
  "recall",
  "receive",
  "recipe",
  "record",
  "recycle",
  "reduce",
  "reflect",
  "reform",
  "refuse",
  "region",
  "regret",
  "regular",
  "reject",
  "relax",
  "release",
  "relief",
  "rely",
  "remain",
  "remember",
  "remind",
  "remove",
  "render",
  "renew",
  "rent",
  "reopen",
  "repair",
  "repeat",
  "replace",
  "report",
  "require",
  "rescue",
  "resemble",
  "resist",
  "resource",
  "response",
  "result",
  "retire",
  "retreat",
  "return",
  "reunion",
  "reveal",
  "review",
  "reward",
  "rhythm",
  "rib",
  "ribbon",
  "rice",
  "rich",
  "ride",
  "ridge",
  "rifle",
  "right",
  "rigid",
  "ring",
  "riot",
  "ripple",
  "risk",
  "ritual",
  "rival",
  "river",
  "road",
  "roast",
  "robot",
  "robust",
  "rocket",
  "romance",
  "roof",
  "rookie",
  "room",
  "rose",
  "rotate",
  "rough",
  "round",
  "route",
  "royal",
  "rubber",
  "rude",
  "rug",
  "rule",
  "run",
  "runway",
  "rural",
  "sad",
  "saddle",
  "sadness",
  "safe",
  "sail",
  "salad",
  "salmon",
  "salon",
  "salt",
  "salute",
  "same",
  "sample",
  "sand",
  "satisfy",
  "satoshi",
  "sauce",
  "sausage",
  "save",
  "say",
  "scale",
  "scan",
  "scare",
  "scatter",
  "scene",
  "scheme",
  "school",
  "science",
  "scissors",
  "scorpion",
  "scout",
  "scrap",
  "screen",
  "script",
  "scrub",
  "sea",
  "search",
  "season",
  "seat",
  "second",
  "secret",
  "section",
  "security",
  "seed",
  "seek",
  "segment",
  "select",
  "sell",
  "seminar",
  "senior",
  "sense",
  "sentence",
  "series",
  "service",
  "session",
  "settle",
  "setup",
  "seven",
  "shadow",
  "shaft",
  "shallow",
  "share",
  "shed",
  "shell",
  "sheriff",
  "shield",
  "shift",
  "shine",
  "ship",
  "shiver",
  "shock",
  "shoe",
  "shoot",
  "shop",
  "short",
  "shoulder",
  "shove",
  "shrimp",
  "shrug",
  "shuffle",
  "shy",
  "sibling",
  "sick",
  "side",
  "siege",
  "sight",
  "sign",
  "silent",
  "silk",
  "silly",
  "silver",
  "similar",
  "simple",
  "since",
  "sing",
  "siren",
  "sister",
  "situate",
  "six",
  "size",
  "skate",
  "sketch",
  "ski",
  "skill",
  "skin",
  "skirt",
  "skull",
  "slab",
  "slam",
  "sleep",
  "slender",
  "slice",
  "slide",
  "slight",
  "slim",
  "slogan",
  "slot",
  "slow",
  "slush",
  "small",
  "smart",
  "smile",
  "smoke",
  "smooth",
  "snack",
  "snake",
  "snap",
  "sniff",
  "snow",
  "soap",
  "soccer",
  "social",
  "sock",
  "soda",
  "soft",
  "solar",
  "soldier",
  "solid",
  "solution",
  "solve",
  "someone",
  "song",
  "soon",
  "sorry",
  "sort",
  "soul",
  "sound",
  "soup",
  "source",
  "south",
  "space",
  "spare",
  "spatial",
  "spawn",
  "speak",
  "special",
  "speed",
  "spell",
  "spend",
  "sphere",
  "spice",
  "spider",
  "spike",
  "spin",
  "spirit",
  "split",
  "spoil",
  "sponsor",
  "spoon",
  "sport",
  "spot",
  "spray",
  "spread",
  "spring",
  "spy",
  "square",
  "squeeze",
  "squirrel",
  "stable",
  "stadium",
  "staff",
  "stage",
  "stairs",
  "stamp",
  "stand",
  "start",
  "state",
  "stay",
  "steak",
  "steel",
  "stem",
  "step",
  "stereo",
  "stick",
  "still",
  "sting",
  "stock",
  "stomach",
  "stone",
  "stool",
  "story",
  "stove",
  "strategy",
  "street",
  "strike",
  "strong",
  "struggle",
  "student",
  "stuff",
  "stumble",
  "style",
  "subject",
  "submit",
  "subway",
  "success",
  "such",
  "sudden",
  "suffer",
  "sugar",
  "suggest",
  "suit",
  "summer",
  "sun",
  "sunny",
  "sunset",
  "super",
  "supply",
  "supreme",
  "sure",
  "surface",
  "surge",
  "surprise",
  "surround",
  "survey",
  "suspect",
  "sustain",
  "swallow",
  "swamp",
  "swap",
  "swarm",
  "swear",
  "sweet",
  "swift",
  "swim",
  "swing",
  "switch",
  "sword",
  "symbol",
  "symptom",
  "syrup",
  "system",
  "table",
  "tackle",
  "tag",
  "tail",
  "talent",
  "talk",
  "tank",
  "tape",
  "target",
  "task",
  "taste",
  "tattoo",
  "taxi",
  "teach",
  "team",
  "tell",
  "ten",
  "tenant",
  "tennis",
  "tent",
  "term",
  "test",
  "text",
  "thank",
  "that",
  "theme",
  "then",
  "theory",
  "there",
  "they",
  "thing",
  "this",
  "thought",
  "three",
  "thrive",
  "throw",
  "thumb",
  "thunder",
  "ticket",
  "tide",
  "tiger",
  "tilt",
  "timber",
  "time",
  "tiny",
  "tip",
  "tired",
  "tissue",
  "title",
  "toast",
  "tobacco",
  "today",
  "toddler",
  "toe",
  "together",
  "toilet",
  "token",
  "tomato",
  "tomorrow",
  "tone",
  "tongue",
  "tonight",
  "tool",
  "tooth",
  "top",
  "topic",
  "topple",
  "torch",
  "tornado",
  "tortoise",
  "toss",
  "total",
  "tourist",
  "toward",
  "tower",
  "town",
  "toy",
  "track",
  "trade",
  "traffic",
  "tragic",
  "train",
  "transfer",
  "trap",
  "trash",
  "travel",
  "tray",
  "treat",
  "tree",
  "trend",
  "trial",
  "tribe",
  "trick",
  "trigger",
  "trim",
  "trip",
  "trophy",
  "trouble",
  "truck",
  "true",
  "truly",
  "trumpet",
  "trust",
  "truth",
  "try",
  "tube",
  "tuition",
  "tumble",
  "tuna",
  "tunnel",
  "turkey",
  "turn",
  "turtle",
  "twelve",
  "twenty",
  "twice",
  "twin",
  "twist",
  "two",
  "type",
  "typical",
  "ugly",
  "umbrella",
  "unable",
  "unaware",
  "uncle",
  "uncover",
  "under",
  "undo",
  "unfair",
  "unfold",
  "unhappy",
  "uniform",
  "unique",
  "unit",
  "universe",
  "unknown",
  "unlock",
  "until",
  "unusual",
  "unveil",
  "update",
  "upgrade",
  "uphold",
  "upon",
  "upper",
  "upset",
  "urban",
  "urge",
  "usage",
  "use",
  "used",
  "useful",
  "useless",
  "usual",
  "utility",
  "vacant",
  "vacuum",
  "vague",
  "valid",
  "valley",
  "valve",
  "van",
  "vanish",
  "vapor",
  "various",
  "vast",
  "vault",
  "vehicle",
  "velvet",
  "vendor",
  "venture",
  "venue",
  "verb",
  "verify",
  "version",
  "very",
  "vessel",
  "veteran",
  "viable",
  "vibrant",
  "vicious",
  "victory",
  "video",
  "view",
  "village",
  "vintage",
  "violin",
  "virtual",
  "virus",
  "visa",
  "visit",
  "visual",
  "vital",
  "vivid",
  "vocal",
  "voice",
  "void",
  "volcano",
  "volume",
  "vote",
  "voyage",
  "wage",
  "wagon",
  "wait",
  "walk",
  "wall",
  "walnut",
  "want",
  "warfare",
  "warm",
  "warrior",
  "wash",
  "wasp",
  "waste",
  "water",
  "wave",
  "way",
  "wealth",
  "weapon",
  "wear",
  "weasel",
  "weather",
  "web",
  "wedding",
  "weekend",
  "weird",
  "welcome",
  "west",
  "wet",
  "whale",
  "what",
  "wheat",
  "wheel",
  "when",
  "where",
  "whip",
  "whisper",
  "wide",
  "width",
  "wife",
  "wild",
  "will",
  "win",
  "window",
  "wine",
  "wing",
  "wink",
  "winner",
  "winter",
  "wire",
  "wisdom",
  "wise",
  "wish",
  "witness",
  "wolf",
  "woman",
  "wonder",
  "wood",
  "wool",
  "word",
  "work",
  "world",
  "worry",
  "worth",
  "wrap",
  "wreck",
  "wrestle",
  "wrist",
  "write",
  "wrong",
  "yard",
  "year",
  "yellow",
  "you",
  "young",
  "youth",
  "zebra",
  "zero",
  "zone",
  "zoo"
];
wordlist.wordlist = EN;
var __importDefault$3 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(mnemonic, "__esModule", { value: true });
mnemonic.mnemonicFromRandomSeed = mnemonic.mnemonicIndexesToBytes = mnemonic.bytesToMnemonics = mnemonic.bytesToMnemonicIndexes = mnemonic.mnemonicNew = mnemonic.mnemonicValidate = mnemonic.mnemonicToHDSeed = mnemonic.mnemonicToWalletKey = mnemonic.mnemonicToPrivateKey = mnemonic.mnemonicToSeed = mnemonic.mnemonicToEntropy = void 0;
const tweetnacl_1$1 = __importDefault$3(naclFastExports);
const getSecureRandom_1 = getSecureRandom;
const hmac_sha512_1$3 = hmac_sha512$1;
const pbkdf2_sha512_1 = pbkdf2_sha512$1;
const binary_1 = binary;
const wordlist_1 = wordlist;
const PBKDF_ITERATIONS = 1e5;
async function isPasswordNeeded(mnemonicArray) {
  const passlessEntropy = await mnemonicToEntropy(mnemonicArray);
  return await isPasswordSeed(passlessEntropy) && !await isBasicSeed(passlessEntropy);
}
function normalizeMnemonic(src2) {
  return src2.map((v) => v.toLowerCase().trim());
}
async function isBasicSeed(entropy) {
  const seed = await (0, pbkdf2_sha512_1.pbkdf2_sha512)(entropy, "TON seed version", Math.max(1, Math.floor(PBKDF_ITERATIONS / 256)), 64);
  return seed[0] == 0;
}
async function isPasswordSeed(entropy) {
  const seed = await (0, pbkdf2_sha512_1.pbkdf2_sha512)(entropy, "TON fast seed version", 1, 64);
  return seed[0] == 1;
}
async function mnemonicToEntropy(mnemonicArray, password) {
  return await (0, hmac_sha512_1$3.hmac_sha512)(mnemonicArray.join(" "), password && password.length > 0 ? password : "");
}
mnemonic.mnemonicToEntropy = mnemonicToEntropy;
async function mnemonicToSeed(mnemonicArray, seed, password) {
  const entropy = await mnemonicToEntropy(mnemonicArray, password);
  return await (0, pbkdf2_sha512_1.pbkdf2_sha512)(entropy, seed, PBKDF_ITERATIONS, 64);
}
mnemonic.mnemonicToSeed = mnemonicToSeed;
async function mnemonicToPrivateKey(mnemonicArray, password) {
  mnemonicArray = normalizeMnemonic(mnemonicArray);
  const seed = await mnemonicToSeed(mnemonicArray, "TON default seed", password);
  let keyPair = tweetnacl_1$1.default.sign.keyPair.fromSeed(seed.slice(0, 32));
  return {
    publicKey: Buffer.from(keyPair.publicKey),
    secretKey: Buffer.from(keyPair.secretKey)
  };
}
mnemonic.mnemonicToPrivateKey = mnemonicToPrivateKey;
async function mnemonicToWalletKey(mnemonicArray, password) {
  let seedPk = await mnemonicToPrivateKey(mnemonicArray, password);
  let seedSecret = seedPk.secretKey.slice(0, 32);
  const keyPair = tweetnacl_1$1.default.sign.keyPair.fromSeed(seedSecret);
  return {
    publicKey: Buffer.from(keyPair.publicKey),
    secretKey: Buffer.from(keyPair.secretKey)
  };
}
mnemonic.mnemonicToWalletKey = mnemonicToWalletKey;
async function mnemonicToHDSeed(mnemonicArray, password) {
  mnemonicArray = normalizeMnemonic(mnemonicArray);
  return await mnemonicToSeed(mnemonicArray, "TON HD Keys seed", password);
}
mnemonic.mnemonicToHDSeed = mnemonicToHDSeed;
async function mnemonicValidate(mnemonicArray, password) {
  mnemonicArray = normalizeMnemonic(mnemonicArray);
  for (let word of mnemonicArray) {
    if (wordlist_1.wordlist.indexOf(word) < 0) {
      return false;
    }
  }
  if (password && password.length > 0) {
    if (!await isPasswordNeeded(mnemonicArray)) {
      return false;
    }
  }
  return await isBasicSeed(await mnemonicToEntropy(mnemonicArray, password));
}
mnemonic.mnemonicValidate = mnemonicValidate;
async function mnemonicNew(wordsCount = 24, password) {
  let mnemonicArray = [];
  while (true) {
    mnemonicArray = [];
    for (let i = 0; i < wordsCount; i++) {
      let ind = await (0, getSecureRandom_1.getSecureRandomNumber)(0, wordlist_1.wordlist.length);
      mnemonicArray.push(wordlist_1.wordlist[ind]);
    }
    if (password && password.length > 0) {
      if (!await isPasswordNeeded(mnemonicArray)) {
        continue;
      }
    }
    if (!await isBasicSeed(await mnemonicToEntropy(mnemonicArray, password))) {
      continue;
    }
    break;
  }
  return mnemonicArray;
}
mnemonic.mnemonicNew = mnemonicNew;
function bytesToMnemonicIndexes(src2, wordsCount) {
  let bits = (0, binary_1.bytesToBits)(src2);
  let indexes = [];
  for (let i = 0; i < wordsCount; i++) {
    let sl = bits.slice(i * 11, i * 11 + 11);
    indexes.push(parseInt(sl, 2));
  }
  return indexes;
}
mnemonic.bytesToMnemonicIndexes = bytesToMnemonicIndexes;
function bytesToMnemonics(src2, wordsCount) {
  let mnemonics2 = bytesToMnemonicIndexes(src2, wordsCount);
  let res = [];
  for (let m of mnemonics2) {
    res.push(wordlist_1.wordlist[m]);
  }
  return res;
}
mnemonic.bytesToMnemonics = bytesToMnemonics;
function mnemonicIndexesToBytes(src2) {
  let res = "";
  for (let s of src2) {
    if (!Number.isSafeInteger(s)) {
      throw Error("Invalid input");
    }
    if (s < 0 || s >= 2028) {
      throw Error("Invalid input");
    }
    res += (0, binary_1.lpad)(s.toString(2), "0", 11);
  }
  while (res.length % 8 !== 0) {
    res = res + "0";
  }
  return (0, binary_1.bitsToBytes)(res);
}
mnemonic.mnemonicIndexesToBytes = mnemonicIndexesToBytes;
async function mnemonicFromRandomSeed(seed, wordsCount = 24, password) {
  const bytesLength = Math.ceil(wordsCount * 11 / 8);
  let currentSeed = seed;
  while (true) {
    let entropy = await (0, pbkdf2_sha512_1.pbkdf2_sha512)(currentSeed, "TON mnemonic seed", Math.max(1, Math.floor(PBKDF_ITERATIONS / 256)), bytesLength);
    let mnemonics2 = bytesToMnemonics(entropy, wordsCount);
    if (await mnemonicValidate(mnemonics2, password)) {
      return mnemonics2;
    }
    currentSeed = entropy;
  }
}
mnemonic.mnemonicFromRandomSeed = mnemonicFromRandomSeed;
var nacl = {};
var __importDefault$2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(nacl, "__esModule", { value: true });
nacl.openBox = nacl.sealBox = nacl.signVerify = nacl.sign = nacl.keyPairFromSeed = nacl.keyPairFromSecretKey = void 0;
const tweetnacl_1 = __importDefault$2(naclFastExports);
function keyPairFromSecretKey(secretKey) {
  let res = tweetnacl_1.default.sign.keyPair.fromSecretKey(new Uint8Array(secretKey));
  return {
    publicKey: Buffer.from(res.publicKey),
    secretKey: Buffer.from(res.secretKey)
  };
}
nacl.keyPairFromSecretKey = keyPairFromSecretKey;
function keyPairFromSeed(secretKey) {
  let res = tweetnacl_1.default.sign.keyPair.fromSeed(new Uint8Array(secretKey));
  return {
    publicKey: Buffer.from(res.publicKey),
    secretKey: Buffer.from(res.secretKey)
  };
}
nacl.keyPairFromSeed = keyPairFromSeed;
function sign(data2, secretKey) {
  return Buffer.from(tweetnacl_1.default.sign.detached(new Uint8Array(data2), new Uint8Array(secretKey)));
}
nacl.sign = sign;
function signVerify(data2, signature, publicKey) {
  return tweetnacl_1.default.sign.detached.verify(new Uint8Array(data2), new Uint8Array(signature), new Uint8Array(publicKey));
}
nacl.signVerify = signVerify;
function sealBox(data2, nonce, key) {
  return Buffer.from(tweetnacl_1.default.secretbox(data2, nonce, key));
}
nacl.sealBox = sealBox;
function openBox(data2, nonce, key) {
  let res = tweetnacl_1.default.secretbox.open(data2, nonce, key);
  if (!res) {
    return null;
  }
  return Buffer.from(res);
}
nacl.openBox = openBox;
var ed25519 = {};
Object.defineProperty(ed25519, "__esModule", { value: true });
ed25519.deriveEd25519Path = ed25519.deriveED25519HardenedKey = ed25519.getED25519MasterKeyFromSeed = void 0;
const hmac_sha512_1$2 = hmac_sha512$1;
const ED25519_CURVE = "ed25519 seed";
const HARDENED_OFFSET$1 = 2147483648;
async function getED25519MasterKeyFromSeed(seed) {
  const I = await (0, hmac_sha512_1$2.hmac_sha512)(ED25519_CURVE, seed);
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR
  };
}
ed25519.getED25519MasterKeyFromSeed = getED25519MasterKeyFromSeed;
async function deriveED25519HardenedKey(parent, index) {
  if (index >= HARDENED_OFFSET$1) {
    throw Error("Key index must be less than offset");
  }
  const indexBuffer = Buffer.alloc(4);
  indexBuffer.writeUInt32BE(index + HARDENED_OFFSET$1, 0);
  const data2 = Buffer.concat([Buffer.alloc(1, 0), parent.key, indexBuffer]);
  const I = await (0, hmac_sha512_1$2.hmac_sha512)(parent.chainCode, data2);
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR
  };
}
ed25519.deriveED25519HardenedKey = deriveED25519HardenedKey;
async function deriveEd25519Path(seed, path) {
  let state = await getED25519MasterKeyFromSeed(seed);
  let remaining = [...path];
  while (remaining.length > 0) {
    let index = remaining[0];
    remaining = remaining.slice(1);
    state = await deriveED25519HardenedKey(state, index);
  }
  return state.key;
}
ed25519.deriveEd25519Path = deriveEd25519Path;
var symmetric = {};
Object.defineProperty(symmetric, "__esModule", { value: true });
symmetric.deriveSymmetricPath = symmetric.deriveSymmetricHardenedKey = symmetric.getSymmetricMasterKeyFromSeed = void 0;
const hmac_sha512_1$1 = hmac_sha512$1;
const SYMMETRIC_SEED = "Symmetric key seed";
async function getSymmetricMasterKeyFromSeed(seed) {
  const I = await (0, hmac_sha512_1$1.hmac_sha512)(SYMMETRIC_SEED, seed);
  const IL = I.slice(32);
  const IR = I.slice(0, 32);
  return {
    key: IL,
    chainCode: IR
  };
}
symmetric.getSymmetricMasterKeyFromSeed = getSymmetricMasterKeyFromSeed;
async function deriveSymmetricHardenedKey(parent, offset) {
  const data2 = Buffer.concat([Buffer.alloc(1, 0), Buffer.from(offset)]);
  const I = await (0, hmac_sha512_1$1.hmac_sha512)(parent.chainCode, data2);
  const IL = I.slice(32);
  const IR = I.slice(0, 32);
  return {
    key: IL,
    chainCode: IR
  };
}
symmetric.deriveSymmetricHardenedKey = deriveSymmetricHardenedKey;
async function deriveSymmetricPath(seed, path) {
  let state = await getSymmetricMasterKeyFromSeed(seed);
  let remaining = [...path];
  while (remaining.length > 0) {
    let index = remaining[0];
    remaining = remaining.slice(1);
    state = await deriveSymmetricHardenedKey(state, index);
  }
  return state.key;
}
symmetric.deriveSymmetricPath = deriveSymmetricPath;
var mnemonics = {};
Object.defineProperty(mnemonics, "__esModule", { value: true });
mnemonics.deriveMnemonicsPath = mnemonics.deriveMnemonicHardenedKey = mnemonics.getMnemonicsMasterKeyFromSeed = void 0;
const mnemonic_1 = mnemonic;
const hmac_sha512_1 = hmac_sha512$1;
const HARDENED_OFFSET = 2147483648;
const MNEMONICS_SEED = "TON Mnemonics HD seed";
async function getMnemonicsMasterKeyFromSeed(seed) {
  const I = await (0, hmac_sha512_1.hmac_sha512)(MNEMONICS_SEED, seed);
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR
  };
}
mnemonics.getMnemonicsMasterKeyFromSeed = getMnemonicsMasterKeyFromSeed;
async function deriveMnemonicHardenedKey(parent, index) {
  if (index >= HARDENED_OFFSET) {
    throw Error("Key index must be less than offset");
  }
  const indexBuffer = Buffer.alloc(4);
  indexBuffer.writeUInt32BE(index + HARDENED_OFFSET, 0);
  const data2 = Buffer.concat([Buffer.alloc(1, 0), parent.key, indexBuffer]);
  const I = await (0, hmac_sha512_1.hmac_sha512)(parent.chainCode, data2);
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR
  };
}
mnemonics.deriveMnemonicHardenedKey = deriveMnemonicHardenedKey;
async function deriveMnemonicsPath(seed, path, wordsCount = 24, password) {
  let state = await getMnemonicsMasterKeyFromSeed(seed);
  let remaining = [...path];
  while (remaining.length > 0) {
    let index = remaining[0];
    remaining = remaining.slice(1);
    state = await deriveMnemonicHardenedKey(state, index);
  }
  return await (0, mnemonic_1.mnemonicFromRandomSeed)(state.key, wordsCount, password);
}
mnemonics.deriveMnemonicsPath = deriveMnemonicsPath;
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist)
    return dist;
  hasRequiredDist = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getMnemonicsMasterKeyFromSeed = exports.deriveMnemonicHardenedKey = exports.deriveMnemonicsPath = exports.deriveSymmetricPath = exports.deriveSymmetricHardenedKey = exports.getSymmetricMasterKeyFromSeed = exports.deriveEd25519Path = exports.deriveED25519HardenedKey = exports.getED25519MasterKeyFromSeed = exports.signVerify = exports.sign = exports.keyPairFromSecretKey = exports.keyPairFromSeed = exports.openBox = exports.sealBox = exports.mnemonicWordList = exports.mnemonicToHDSeed = exports.mnemonicToSeed = exports.mnemonicToWalletKey = exports.mnemonicToPrivateKey = exports.mnemonicValidate = exports.mnemonicNew = exports.newSecurePassphrase = exports.newSecureWords = exports.getSecureRandomNumber = exports.getSecureRandomWords = exports.getSecureRandomBytes = exports.hmac_sha512 = exports.pbkdf2_sha512 = exports.sha512_sync = exports.sha512 = exports.sha256_sync = exports.sha256 = void 0;
    var sha256_1 = sha256$3;
    Object.defineProperty(exports, "sha256", { enumerable: true, get: function() {
      return sha256_1.sha256;
    } });
    Object.defineProperty(exports, "sha256_sync", { enumerable: true, get: function() {
      return sha256_1.sha256_sync;
    } });
    var sha512_1 = sha512$1;
    Object.defineProperty(exports, "sha512", { enumerable: true, get: function() {
      return sha512_1.sha512;
    } });
    Object.defineProperty(exports, "sha512_sync", { enumerable: true, get: function() {
      return sha512_1.sha512_sync;
    } });
    var pbkdf2_sha512_12 = pbkdf2_sha512$1;
    Object.defineProperty(exports, "pbkdf2_sha512", { enumerable: true, get: function() {
      return pbkdf2_sha512_12.pbkdf2_sha512;
    } });
    var hmac_sha512_12 = hmac_sha512$1;
    Object.defineProperty(exports, "hmac_sha512", { enumerable: true, get: function() {
      return hmac_sha512_12.hmac_sha512;
    } });
    var getSecureRandom_12 = getSecureRandom;
    Object.defineProperty(exports, "getSecureRandomBytes", { enumerable: true, get: function() {
      return getSecureRandom_12.getSecureRandomBytes;
    } });
    Object.defineProperty(exports, "getSecureRandomWords", { enumerable: true, get: function() {
      return getSecureRandom_12.getSecureRandomWords;
    } });
    Object.defineProperty(exports, "getSecureRandomNumber", { enumerable: true, get: function() {
      return getSecureRandom_12.getSecureRandomNumber;
    } });
    var newSecureWords_1 = newSecureWords$1;
    Object.defineProperty(exports, "newSecureWords", { enumerable: true, get: function() {
      return newSecureWords_1.newSecureWords;
    } });
    var newSecurePassphrase_1 = requireNewSecurePassphrase();
    Object.defineProperty(exports, "newSecurePassphrase", { enumerable: true, get: function() {
      return newSecurePassphrase_1.newSecurePassphrase;
    } });
    var mnemonic_12 = mnemonic;
    Object.defineProperty(exports, "mnemonicNew", { enumerable: true, get: function() {
      return mnemonic_12.mnemonicNew;
    } });
    Object.defineProperty(exports, "mnemonicValidate", { enumerable: true, get: function() {
      return mnemonic_12.mnemonicValidate;
    } });
    Object.defineProperty(exports, "mnemonicToPrivateKey", { enumerable: true, get: function() {
      return mnemonic_12.mnemonicToPrivateKey;
    } });
    Object.defineProperty(exports, "mnemonicToWalletKey", { enumerable: true, get: function() {
      return mnemonic_12.mnemonicToWalletKey;
    } });
    Object.defineProperty(exports, "mnemonicToSeed", { enumerable: true, get: function() {
      return mnemonic_12.mnemonicToSeed;
    } });
    Object.defineProperty(exports, "mnemonicToHDSeed", { enumerable: true, get: function() {
      return mnemonic_12.mnemonicToHDSeed;
    } });
    var wordlist_12 = wordlist;
    Object.defineProperty(exports, "mnemonicWordList", { enumerable: true, get: function() {
      return wordlist_12.wordlist;
    } });
    var nacl_1 = nacl;
    Object.defineProperty(exports, "sealBox", { enumerable: true, get: function() {
      return nacl_1.sealBox;
    } });
    Object.defineProperty(exports, "openBox", { enumerable: true, get: function() {
      return nacl_1.openBox;
    } });
    var nacl_2 = nacl;
    Object.defineProperty(exports, "keyPairFromSeed", { enumerable: true, get: function() {
      return nacl_2.keyPairFromSeed;
    } });
    Object.defineProperty(exports, "keyPairFromSecretKey", { enumerable: true, get: function() {
      return nacl_2.keyPairFromSecretKey;
    } });
    Object.defineProperty(exports, "sign", { enumerable: true, get: function() {
      return nacl_2.sign;
    } });
    Object.defineProperty(exports, "signVerify", { enumerable: true, get: function() {
      return nacl_2.signVerify;
    } });
    var ed25519_1 = ed25519;
    Object.defineProperty(exports, "getED25519MasterKeyFromSeed", { enumerable: true, get: function() {
      return ed25519_1.getED25519MasterKeyFromSeed;
    } });
    Object.defineProperty(exports, "deriveED25519HardenedKey", { enumerable: true, get: function() {
      return ed25519_1.deriveED25519HardenedKey;
    } });
    Object.defineProperty(exports, "deriveEd25519Path", { enumerable: true, get: function() {
      return ed25519_1.deriveEd25519Path;
    } });
    var symmetric_1 = symmetric;
    Object.defineProperty(exports, "getSymmetricMasterKeyFromSeed", { enumerable: true, get: function() {
      return symmetric_1.getSymmetricMasterKeyFromSeed;
    } });
    Object.defineProperty(exports, "deriveSymmetricHardenedKey", { enumerable: true, get: function() {
      return symmetric_1.deriveSymmetricHardenedKey;
    } });
    Object.defineProperty(exports, "deriveSymmetricPath", { enumerable: true, get: function() {
      return symmetric_1.deriveSymmetricPath;
    } });
    var mnemonics_1 = mnemonics;
    Object.defineProperty(exports, "deriveMnemonicsPath", { enumerable: true, get: function() {
      return mnemonics_1.deriveMnemonicsPath;
    } });
    Object.defineProperty(exports, "deriveMnemonicHardenedKey", { enumerable: true, get: function() {
      return mnemonics_1.deriveMnemonicHardenedKey;
    } });
    Object.defineProperty(exports, "getMnemonicsMasterKeyFromSeed", { enumerable: true, get: function() {
      return mnemonics_1.getMnemonicsMasterKeyFromSeed;
    } });
  })(dist);
  return dist;
}
Object.defineProperty(wonderCalculator$1, "__esModule", { value: true });
wonderCalculator$1.wonderCalculator = void 0;
const BitString_1 = requireBitString();
const CellType_1 = CellType;
const LevelMask_1 = LevelMask$1;
const exoticPruned_1 = exoticPruned$1;
const exoticMerkleProof_1 = exoticMerkleProof$1;
const descriptor_1 = descriptor;
const ton_crypto_1$2 = requireDist();
const exoticMerkleUpdate_1 = exoticMerkleUpdate$1;
function wonderCalculator(type2, bits, refs) {
  let levelMask;
  let pruned = null;
  if (type2 === CellType_1.CellType.Ordinary) {
    let mask = 0;
    for (let r of refs) {
      mask = mask | r.mask.value;
    }
    levelMask = new LevelMask_1.LevelMask(mask);
  } else if (type2 === CellType_1.CellType.PrunedBranch) {
    pruned = (0, exoticPruned_1.exoticPruned)(bits, refs);
    levelMask = new LevelMask_1.LevelMask(pruned.mask);
  } else if (type2 === CellType_1.CellType.MerkleProof) {
    (0, exoticMerkleProof_1.exoticMerkleProof)(bits, refs);
    levelMask = new LevelMask_1.LevelMask(refs[0].mask.value >> 1);
  } else if (type2 === CellType_1.CellType.MerkleUpdate) {
    (0, exoticMerkleUpdate_1.exoticMerkleUpdate)(bits, refs);
    levelMask = new LevelMask_1.LevelMask((refs[0].mask.value | refs[1].mask.value) >> 1);
  } else {
    throw new Error("Unsupported exotic type");
  }
  let depths = [];
  let hashes = [];
  let hashCount = type2 === CellType_1.CellType.PrunedBranch ? 1 : levelMask.hashCount;
  let totalHashCount = levelMask.hashCount;
  let hashIOffset = totalHashCount - hashCount;
  for (let levelI = 0, hashI = 0; levelI <= levelMask.level; levelI++) {
    if (!levelMask.isSignificant(levelI)) {
      continue;
    }
    if (hashI < hashIOffset) {
      hashI++;
      continue;
    }
    let currentBits;
    if (hashI === hashIOffset) {
      if (!(levelI === 0 || type2 === CellType_1.CellType.PrunedBranch)) {
        throw Error("Invalid");
      }
      currentBits = bits;
    } else {
      if (!(levelI !== 0 && type2 !== CellType_1.CellType.PrunedBranch)) {
        throw Error("Invalid: " + levelI + ", " + type2);
      }
      currentBits = new BitString_1.BitString(hashes[hashI - hashIOffset - 1], 0, 256);
    }
    let currentDepth = 0;
    for (let c of refs) {
      let childDepth;
      if (type2 == CellType_1.CellType.MerkleProof || type2 == CellType_1.CellType.MerkleUpdate) {
        childDepth = c.depth(levelI + 1);
      } else {
        childDepth = c.depth(levelI);
      }
      currentDepth = Math.max(currentDepth, childDepth);
    }
    if (refs.length > 0) {
      currentDepth++;
    }
    let repr = (0, descriptor_1.getRepr)(currentBits, refs, levelI, type2);
    let hash = (0, ton_crypto_1$2.sha256_sync)(repr);
    let destI = hashI - hashIOffset;
    depths[destI] = currentDepth;
    hashes[destI] = hash;
    hashI++;
  }
  let resolvedHashes = [];
  let resolvedDepths = [];
  if (pruned) {
    for (let i = 0; i < 4; i++) {
      const { hashIndex } = levelMask.apply(i);
      const { hashIndex: thisHashIndex } = levelMask;
      if (hashIndex !== thisHashIndex) {
        resolvedHashes.push(pruned.pruned[hashIndex].hash);
        resolvedDepths.push(pruned.pruned[hashIndex].depth);
      } else {
        resolvedHashes.push(hashes[0]);
        resolvedDepths.push(depths[0]);
      }
    }
  } else {
    for (let i = 0; i < 4; i++) {
      resolvedHashes.push(hashes[levelMask.apply(i).hashIndex]);
      resolvedDepths.push(depths[levelMask.apply(i).hashIndex]);
    }
  }
  return {
    mask: levelMask,
    hashes: resolvedHashes,
    depths: resolvedDepths
  };
}
wonderCalculator$1.wonderCalculator = wonderCalculator;
var serialization = {};
var topologicalSort$1 = {};
Object.defineProperty(topologicalSort$1, "__esModule", { value: true });
topologicalSort$1.topologicalSort = void 0;
function topologicalSort(src2) {
  let pending = [src2];
  let allCells = /* @__PURE__ */ new Map();
  let notPermCells = /* @__PURE__ */ new Set();
  let sorted = [];
  while (pending.length > 0) {
    const cells = [...pending];
    pending = [];
    for (let cell of cells) {
      const hash = cell.hash().toString("hex");
      if (allCells.has(hash)) {
        continue;
      }
      notPermCells.add(hash);
      allCells.set(hash, { cell, refs: cell.refs.map((v) => v.hash().toString("hex")) });
      for (let r of cell.refs) {
        pending.push(r);
      }
    }
  }
  let tempMark = /* @__PURE__ */ new Set();
  function visit(hash) {
    if (!notPermCells.has(hash)) {
      return;
    }
    if (tempMark.has(hash)) {
      throw Error("Not a DAG");
    }
    tempMark.add(hash);
    for (let c of allCells.get(hash).refs) {
      visit(c);
    }
    sorted.unshift(hash);
    tempMark.delete(hash);
    notPermCells.delete(hash);
  }
  while (notPermCells.size > 0) {
    const id = Array.from(notPermCells)[0];
    visit(id);
  }
  let indexes = /* @__PURE__ */ new Map();
  for (let i = 0; i < sorted.length; i++) {
    indexes.set(sorted[i], i);
  }
  let result = [];
  for (let ent of sorted) {
    const rrr = allCells.get(ent);
    result.push({ cell: rrr.cell, refs: rrr.refs.map((v) => indexes.get(v)) });
  }
  return result;
}
topologicalSort$1.topologicalSort = topologicalSort;
var bitsForNumber$1 = {};
Object.defineProperty(bitsForNumber$1, "__esModule", { value: true });
bitsForNumber$1.bitsForNumber = void 0;
function bitsForNumber(src2, mode) {
  let v = BigInt(src2);
  if (mode === "int") {
    if (v === 0n || v === -1n) {
      return 1;
    }
    let v2 = v > 0 ? v : -v;
    return v2.toString(2).length + 1;
  } else if (mode === "uint") {
    if (v < 0) {
      throw Error(`value is negative. Got ${src2}`);
    }
    return v.toString(2).length;
  } else {
    throw Error(`invalid mode. Got ${mode}`);
  }
}
bitsForNumber$1.bitsForNumber = bitsForNumber;
var crc32c$1 = {};
Object.defineProperty(crc32c$1, "__esModule", { value: true });
crc32c$1.crc32c = void 0;
const POLY = 2197175160;
function crc32c(source) {
  let crc = 0 ^ 4294967295;
  for (let n = 0; n < source.length; n++) {
    crc ^= source[n];
    crc = crc & 1 ? crc >>> 1 ^ POLY : crc >>> 1;
    crc = crc & 1 ? crc >>> 1 ^ POLY : crc >>> 1;
    crc = crc & 1 ? crc >>> 1 ^ POLY : crc >>> 1;
    crc = crc & 1 ? crc >>> 1 ^ POLY : crc >>> 1;
    crc = crc & 1 ? crc >>> 1 ^ POLY : crc >>> 1;
    crc = crc & 1 ? crc >>> 1 ^ POLY : crc >>> 1;
    crc = crc & 1 ? crc >>> 1 ^ POLY : crc >>> 1;
    crc = crc & 1 ? crc >>> 1 ^ POLY : crc >>> 1;
  }
  crc = crc ^ 4294967295;
  let res = Buffer.alloc(4);
  res.writeInt32LE(crc);
  return res;
}
crc32c$1.crc32c = crc32c;
var hasRequiredSerialization;
function requireSerialization() {
  if (hasRequiredSerialization)
    return serialization;
  hasRequiredSerialization = 1;
  Object.defineProperty(serialization, "__esModule", { value: true });
  serialization.serializeBoc = serialization.deserializeBoc = serialization.parseBoc = void 0;
  const BitReader_12 = BitReader$1;
  const BitString_12 = requireBitString();
  const Cell_12 = requireCell();
  const topologicalSort_1 = topologicalSort$1;
  const bitsForNumber_1 = bitsForNumber$1;
  const BitBuilder_1 = requireBitBuilder();
  const descriptor_12 = descriptor;
  const paddedBits_12 = requirePaddedBits();
  const crc32c_1 = crc32c$1;
  function readCell(reader2, sizeBytes) {
    const d1 = reader2.loadUint(8);
    const refsCount = d1 % 8;
    const exotic = !!(d1 & 8);
    const d2 = reader2.loadUint(8);
    const dataBytesize = Math.ceil(d2 / 2);
    const paddingAdded = !!(d2 % 2);
    let bits = BitString_12.BitString.EMPTY;
    if (dataBytesize > 0) {
      if (paddingAdded) {
        bits = reader2.loadPaddedBits(dataBytesize * 8);
      } else {
        bits = reader2.loadBits(dataBytesize * 8);
      }
    }
    let refs = [];
    for (let i = 0; i < refsCount; i++) {
      refs.push(reader2.loadUint(sizeBytes * 8));
    }
    return {
      bits,
      refs,
      exotic
    };
  }
  function calcCellSize(cell, sizeBytes) {
    return 2 + Math.ceil(cell.bits.length / 8) + cell.refs.length * sizeBytes;
  }
  function parseBoc(src2) {
    let reader2 = new BitReader_12.BitReader(new BitString_12.BitString(src2, 0, src2.length * 8));
    let magic = reader2.loadUint(32);
    if (magic === 1761568243) {
      let size2 = reader2.loadUint(8);
      let offBytes = reader2.loadUint(8);
      let cells = reader2.loadUint(size2 * 8);
      let roots = reader2.loadUint(size2 * 8);
      let absent = reader2.loadUint(size2 * 8);
      let totalCellSize = reader2.loadUint(offBytes * 8);
      let index = reader2.loadBuffer(cells * offBytes);
      let cellData = reader2.loadBuffer(totalCellSize);
      return {
        size: size2,
        offBytes,
        cells,
        roots,
        absent,
        totalCellSize,
        index,
        cellData,
        root: [0]
      };
    } else if (magic === 2898503464) {
      let size2 = reader2.loadUint(8);
      let offBytes = reader2.loadUint(8);
      let cells = reader2.loadUint(size2 * 8);
      let roots = reader2.loadUint(size2 * 8);
      let absent = reader2.loadUint(size2 * 8);
      let totalCellSize = reader2.loadUint(offBytes * 8);
      let index = reader2.loadBuffer(cells * offBytes);
      let cellData = reader2.loadBuffer(totalCellSize);
      let crc32 = reader2.loadBuffer(4);
      if (!(0, crc32c_1.crc32c)(src2.subarray(0, src2.length - 4)).equals(crc32)) {
        throw Error("Invalid CRC32C");
      }
      return {
        size: size2,
        offBytes,
        cells,
        roots,
        absent,
        totalCellSize,
        index,
        cellData,
        root: [0]
      };
    } else if (magic === 3052313714) {
      let hasIdx = reader2.loadUint(1);
      let hasCrc32c = reader2.loadUint(1);
      reader2.loadUint(1);
      reader2.loadUint(2);
      let size2 = reader2.loadUint(3);
      let offBytes = reader2.loadUint(8);
      let cells = reader2.loadUint(size2 * 8);
      let roots = reader2.loadUint(size2 * 8);
      let absent = reader2.loadUint(size2 * 8);
      let totalCellSize = reader2.loadUint(offBytes * 8);
      let root = [];
      for (let i = 0; i < roots; i++) {
        root.push(reader2.loadUint(size2 * 8));
      }
      let index = null;
      if (hasIdx) {
        index = reader2.loadBuffer(cells * offBytes);
      }
      let cellData = reader2.loadBuffer(totalCellSize);
      if (hasCrc32c) {
        let crc32 = reader2.loadBuffer(4);
        if (!(0, crc32c_1.crc32c)(src2.subarray(0, src2.length - 4)).equals(crc32)) {
          throw Error("Invalid CRC32C");
        }
      }
      return {
        size: size2,
        offBytes,
        cells,
        roots,
        absent,
        totalCellSize,
        index,
        cellData,
        root
      };
    } else {
      throw Error("Invalid magic");
    }
  }
  serialization.parseBoc = parseBoc;
  function deserializeBoc(src2) {
    let boc = parseBoc(src2);
    let reader2 = new BitReader_12.BitReader(new BitString_12.BitString(boc.cellData, 0, boc.cellData.length * 8));
    let cells = [];
    for (let i = 0; i < boc.cells; i++) {
      let cll = readCell(reader2, boc.size);
      cells.push({ ...cll, result: null });
    }
    for (let i = cells.length - 1; i >= 0; i--) {
      if (cells[i].result) {
        throw Error("Impossible");
      }
      let refs = [];
      for (let r of cells[i].refs) {
        if (!cells[r].result) {
          throw Error("Invalid BOC file");
        }
        refs.push(cells[r].result);
      }
      cells[i].result = new Cell_12.Cell({ bits: cells[i].bits, refs, exotic: cells[i].exotic });
    }
    let roots = [];
    for (let i = 0; i < boc.root.length; i++) {
      roots.push(cells[boc.root[i]].result);
    }
    return roots;
  }
  serialization.deserializeBoc = deserializeBoc;
  function writeCellToBuilder(cell, refs, sizeBytes, to) {
    let d1 = (0, descriptor_12.getRefsDescriptor)(cell.refs, cell.level(), cell.type);
    let d2 = (0, descriptor_12.getBitsDescriptor)(cell.bits);
    to.writeUint(d1, 8);
    to.writeUint(d2, 8);
    to.writeBuffer((0, paddedBits_12.bitsToPaddedBuffer)(cell.bits));
    for (let r of refs) {
      to.writeUint(r, sizeBytes * 8);
    }
  }
  function serializeBoc(root, opts) {
    let allCells = (0, topologicalSort_1.topologicalSort)(root);
    let cellsNum = allCells.length;
    let has_idx = opts.idx;
    let has_crc32c = opts.crc32;
    let has_cache_bits = false;
    let flags = 0;
    let sizeBytes = Math.max(Math.ceil((0, bitsForNumber_1.bitsForNumber)(cellsNum, "uint") / 8), 1);
    let totalCellSize = 0;
    let index = [];
    for (let c of allCells) {
      let sz = calcCellSize(c.cell, sizeBytes);
      index.push(totalCellSize);
      totalCellSize += sz;
    }
    let offsetBytes = Math.max(Math.ceil((0, bitsForNumber_1.bitsForNumber)(totalCellSize, "uint") / 8), 1);
    let totalSize = (4 + // magic
    1 + // flags and s_bytes
    1 + // offset_bytes
    3 * sizeBytes + // cells_num, roots, complete
    offsetBytes + // full_size
    1 * sizeBytes + (has_idx ? cellsNum * offsetBytes : 0) + totalCellSize + (has_crc32c ? 4 : 0)) * 8;
    let builder2 = new BitBuilder_1.BitBuilder(totalSize);
    builder2.writeUint(3052313714, 32);
    builder2.writeBit(has_idx);
    builder2.writeBit(has_crc32c);
    builder2.writeBit(has_cache_bits);
    builder2.writeUint(flags, 2);
    builder2.writeUint(sizeBytes, 3);
    builder2.writeUint(offsetBytes, 8);
    builder2.writeUint(cellsNum, sizeBytes * 8);
    builder2.writeUint(1, sizeBytes * 8);
    builder2.writeUint(0, sizeBytes * 8);
    builder2.writeUint(totalCellSize, offsetBytes * 8);
    builder2.writeUint(0, sizeBytes * 8);
    if (has_idx) {
      for (let i = 0; i < cellsNum; i++) {
        builder2.writeUint(index[i], offsetBytes * 8);
      }
    }
    for (let i = 0; i < cellsNum; i++) {
      writeCellToBuilder(allCells[i].cell, allCells[i].refs, sizeBytes, builder2);
    }
    if (has_crc32c) {
      let crc32 = (0, crc32c_1.crc32c)(builder2.buffer());
      builder2.writeBuffer(crc32);
    }
    let res = builder2.buffer();
    if (res.length !== totalSize / 8) {
      throw Error("Internal error");
    }
    return res;
  }
  serialization.serializeBoc = serializeBoc;
  return serialization;
}
var hasRequiredCell;
function requireCell() {
  if (hasRequiredCell)
    return Cell;
  hasRequiredCell = 1;
  var __importDefault2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  var _a2;
  Object.defineProperty(Cell, "__esModule", { value: true });
  Cell.Cell = void 0;
  const symbol_inspect_12 = __importDefault2(symbol_inspect);
  const BitString_12 = requireBitString();
  const CellType_12 = CellType;
  const Slice_12 = requireSlice();
  const resolveExotic_1 = resolveExotic$1;
  const wonderCalculator_1 = wonderCalculator$1;
  const serialization_1 = requireSerialization();
  const BitReader_12 = BitReader$1;
  const Builder_12 = requireBuilder();
  let Cell$1 = class Cell {
    /**
     * Deserialize cells from BOC
     * @param src source buffer
     * @returns array of cells
     */
    static fromBoc(src2) {
      return (0, serialization_1.deserializeBoc)(src2);
    }
    /**
     * Helper class that deserializes a single cell from BOC in base64
     * @param src source string
     */
    static fromBase64(src2) {
      let parsed = Cell$1.fromBoc(Buffer.from(src2, "base64"));
      if (parsed.length !== 1) {
        throw new Error("Deserialized more than one cell");
      }
      return parsed[0];
    }
    constructor(opts) {
      this._hashes = [];
      this._depths = [];
      this.beginParse = (allowExotic = false) => {
        if (this.isExotic && !allowExotic) {
          throw new Error("Exotic cells cannot be parsed");
        }
        return new Slice_12.Slice(new BitReader_12.BitReader(this.bits), this.refs);
      };
      this.hash = (level = 3) => {
        return this._hashes[Math.min(this._hashes.length - 1, level)];
      };
      this.depth = (level = 3) => {
        return this._depths[Math.min(this._depths.length - 1, level)];
      };
      this.level = () => {
        return this.mask.level;
      };
      this.equals = (other) => {
        return this.hash().equals(other.hash());
      };
      this[_a2] = () => this.toString();
      let bits = BitString_12.BitString.EMPTY;
      if (opts && opts.bits) {
        bits = opts.bits;
      }
      let refs = [];
      if (opts && opts.refs) {
        refs = [...opts.refs];
      }
      let hashes;
      let depths;
      let mask;
      let type2 = CellType_12.CellType.Ordinary;
      if (opts && opts.exotic) {
        let resolved = (0, resolveExotic_1.resolveExotic)(bits, refs);
        let wonders = (0, wonderCalculator_1.wonderCalculator)(resolved.type, bits, refs);
        mask = wonders.mask;
        depths = wonders.depths;
        hashes = wonders.hashes;
        type2 = resolved.type;
      } else {
        if (refs.length > 4) {
          throw new Error("Invalid number of references");
        }
        if (bits.length > 1023) {
          throw new Error(`Bits overflow: ${bits.length} > 1023`);
        }
        let wonders = (0, wonderCalculator_1.wonderCalculator)(CellType_12.CellType.Ordinary, bits, refs);
        mask = wonders.mask;
        depths = wonders.depths;
        hashes = wonders.hashes;
        type2 = CellType_12.CellType.Ordinary;
      }
      this.type = type2;
      this.bits = bits;
      this.refs = refs;
      this.mask = mask;
      this._depths = depths;
      this._hashes = hashes;
      Object.freeze(this);
      Object.freeze(this.refs);
      Object.freeze(this.bits);
      Object.freeze(this.mask);
      Object.freeze(this._depths);
      Object.freeze(this._hashes);
    }
    /**
     * Check if cell is exotic
     */
    get isExotic() {
      return this.type !== CellType_12.CellType.Ordinary;
    }
    /**
     * Serializes cell to BOC
     * @param opts options
     */
    toBoc(opts) {
      let idx = opts && opts.idx !== null && opts.idx !== void 0 ? opts.idx : false;
      let crc32 = opts && opts.crc32 !== null && opts.crc32 !== void 0 ? opts.crc32 : true;
      return (0, serialization_1.serializeBoc)(this, { idx, crc32 });
    }
    /**
     * Format cell to string
     * @param indent indentation
     * @returns string representation
     */
    toString(indent) {
      let id = indent || "";
      let t2 = "x";
      if (this.isExotic) {
        if (this.type === CellType_12.CellType.MerkleProof) {
          t2 = "p";
        } else if (this.type === CellType_12.CellType.MerkleUpdate) {
          t2 = "u";
        } else if (this.type === CellType_12.CellType.PrunedBranch) {
          t2 = "p";
        }
      }
      let s = id + (this.isExotic ? t2 : "x") + "{" + this.bits.toString() + "}";
      for (let k in this.refs) {
        const i = this.refs[k];
        s += "\n" + i.toString(id + " ");
      }
      return s;
    }
    /**
     * Covnert cell to slice
     * @returns slice
     */
    asSlice() {
      return this.beginParse();
    }
    /**
     * Convert cell to a builder that has this cell stored
     * @returns builder
     */
    asBuilder() {
      return (0, Builder_12.beginCell)().storeSlice(this.asSlice());
    }
  };
  Cell.Cell = Cell$1;
  _a2 = symbol_inspect_12.default;
  Cell$1.EMPTY = new Cell$1();
  return Cell;
}
var hasRequiredBuilder;
function requireBuilder() {
  if (hasRequiredBuilder)
    return Builder;
  hasRequiredBuilder = 1;
  Object.defineProperty(Builder, "__esModule", { value: true });
  Builder.Builder = Builder.beginCell = void 0;
  const BitBuilder_1 = requireBitBuilder();
  const Cell_12 = requireCell();
  const strings_1 = requireStrings();
  function beginCell() {
    return new Builder$1();
  }
  Builder.beginCell = beginCell;
  let Builder$1 = class Builder {
    constructor() {
      this._bits = new BitBuilder_1.BitBuilder();
      this._refs = [];
    }
    /**
     * Bits written so far
     */
    get bits() {
      return this._bits.length;
    }
    /**
     * References written so far
     */
    get refs() {
      return this._refs.length;
    }
    /**
     * Available bits
     */
    get availableBits() {
      return 1023 - this.bits;
    }
    /**
     * Available references
     */
    get availableRefs() {
      return 4 - this.refs;
    }
    /**
     * Write a single bit
     * @param value bit to write, true or positive number for 1, false or zero or negative for 0
     * @returns this builder
     */
    storeBit(value) {
      this._bits.writeBit(value);
      return this;
    }
    /**
     * Write bits from BitString
     * @param src source bits
     * @returns this builder
     */
    storeBits(src2) {
      this._bits.writeBits(src2);
      return this;
    }
    /**
     * Store Buffer
     * @param src source buffer
     * @param bytes optional number of bytes to write
     * @returns this builder
     */
    storeBuffer(src2, bytes) {
      if (bytes !== void 0 && bytes !== null) {
        if (src2.length !== bytes) {
          throw Error(`Buffer length ${src2.length} is not equal to ${bytes}`);
        }
      }
      this._bits.writeBuffer(src2);
      return this;
    }
    /**
     * Store Maybe Buffer
     * @param src source buffer or null
     * @param bytes optional number of bytes to write
     * @returns this builder
     */
    storeMaybeBuffer(src2, bytes) {
      if (src2 !== null) {
        this.storeBit(1);
        this.storeBuffer(src2, bytes);
      } else {
        this.storeBit(0);
      }
      return this;
    }
    /**
     * Store uint value
     * @param value value as bigint or number
     * @param bits number of bits to write
     * @returns this builder
     */
    storeUint(value, bits) {
      this._bits.writeUint(value, bits);
      return this;
    }
    /**
     * Store maybe uint value
     * @param value value as bigint or number, null or undefined
     * @param bits number of bits to write
     * @returns this builder
     */
    storeMaybeUint(value, bits) {
      if (value !== null && value !== void 0) {
        this.storeBit(1);
        this.storeUint(value, bits);
      } else {
        this.storeBit(0);
      }
      return this;
    }
    /**
     * Store int value
     * @param value value as bigint or number
     * @param bits number of bits to write
     * @returns this builder
     */
    storeInt(value, bits) {
      this._bits.writeInt(value, bits);
      return this;
    }
    /**
     * Store maybe int value
     * @param value value as bigint or number, null or undefined
     * @param bits number of bits to write
     * @returns this builder
     */
    storeMaybeInt(value, bits) {
      if (value !== null && value !== void 0) {
        this.storeBit(1);
        this.storeInt(value, bits);
      } else {
        this.storeBit(0);
      }
      return this;
    }
    /**
     * Store varuint value
     * @param value value as bigint or number
     * @param bits number of bits to write to header
     * @returns this builder
     */
    storeVarUint(value, bits) {
      this._bits.writeVarUint(value, bits);
      return this;
    }
    /**
     * Store maybe varuint value
     * @param value value as bigint or number, null or undefined
     * @param bits number of bits to write to header
     * @returns this builder
     */
    storeMaybeVarUint(value, bits) {
      if (value !== null && value !== void 0) {
        this.storeBit(1);
        this.storeVarUint(value, bits);
      } else {
        this.storeBit(0);
      }
      return this;
    }
    /**
     * Store varint value
     * @param value value as bigint or number
     * @param bits number of bits to write to header
     * @returns this builder
     */
    storeVarInt(value, bits) {
      this._bits.writeVarInt(value, bits);
      return this;
    }
    /**
     * Store maybe varint value
     * @param value value as bigint or number, null or undefined
     * @param bits number of bits to write to header
     * @returns this builder
     */
    storeMaybeVarInt(value, bits) {
      if (value !== null && value !== void 0) {
        this.storeBit(1);
        this.storeVarInt(value, bits);
      } else {
        this.storeBit(0);
      }
      return this;
    }
    /**
     * Store coins value
     * @param amount amount of coins
     * @returns this builder
     */
    storeCoins(amount) {
      this._bits.writeCoins(amount);
      return this;
    }
    /**
     * Store maybe coins value
     * @param amount amount of coins, null or undefined
     * @returns this builder
     */
    storeMaybeCoins(amount) {
      if (amount !== null && amount !== void 0) {
        this.storeBit(1);
        this.storeCoins(amount);
      } else {
        this.storeBit(0);
      }
      return this;
    }
    /**
     * Store address
     * @param addres address to store
     * @returns this builder
     */
    storeAddress(address) {
      this._bits.writeAddress(address);
      return this;
    }
    /**
     * Store reference
     * @param cell cell or builder to store
     * @returns this builder
     */
    storeRef(cell) {
      if (this._refs.length >= 4) {
        throw new Error("Too many references");
      }
      if (cell instanceof Cell_12.Cell) {
        this._refs.push(cell);
      } else if (cell instanceof Builder$1) {
        this._refs.push(cell.endCell());
      } else {
        throw new Error("Invalid argument");
      }
      return this;
    }
    /**
     * Store reference if not null
     * @param cell cell or builder to store
     * @returns this builder
     */
    storeMaybeRef(cell) {
      if (cell) {
        this.storeBit(1);
        this.storeRef(cell);
      } else {
        this.storeBit(0);
      }
      return this;
    }
    /**
     * Store slice it in this builder
     * @param src source slice
     */
    storeSlice(src2) {
      let c = src2.clone();
      if (c.remainingBits > 0) {
        this.storeBits(c.loadBits(c.remainingBits));
      }
      while (c.remainingRefs > 0) {
        this.storeRef(c.loadRef());
      }
      return this;
    }
    /**
     * Store slice in this builder if not null
     * @param src source slice
     */
    storeMaybeSlice(src2) {
      if (src2) {
        this.storeBit(1);
        this.storeSlice(src2);
      } else {
        this.storeBit(0);
      }
      return this;
    }
    /**
     * Store builder
     * @param src builder to store
     * @returns this builder
     */
    storeBuilder(src2) {
      return this.storeSlice(src2.endCell().beginParse());
    }
    /**
     * Store builder if not null
     * @param src builder to store
     * @returns this builder
     */
    storeMaybeBuilder(src2) {
      if (src2) {
        this.storeBit(1);
        this.storeBuilder(src2);
      } else {
        this.storeBit(0);
      }
      return this;
    }
    /**
     * Store writer or builder
     * @param writer writer or builder to store
     * @returns this builder
     */
    storeWritable(writer) {
      if (typeof writer === "object") {
        writer.writeTo(this);
      } else {
        writer(this);
      }
      return this;
    }
    /**
     * Store writer or builder if not null
     * @param writer writer or builder to store
     * @returns this builder
     */
    storeMaybeWritable(writer) {
      if (writer) {
        this.storeBit(1);
        this.storeWritable(writer);
      } else {
        this.storeBit(0);
      }
      return this;
    }
    /**
     * Store object in this builder
     * @param writer Writable or writer functuin
     */
    store(writer) {
      this.storeWritable(writer);
      return this;
    }
    /**
     * Store string tail
     * @param src source string
     * @returns this builder
     */
    storeStringTail(src2) {
      (0, strings_1.writeString)(src2, this);
      return this;
    }
    /**
     * Store string tail
     * @param src source string
     * @returns this builder
     */
    storeMaybeStringTail(src2) {
      if (src2 !== null && src2 !== void 0) {
        this.storeBit(1);
        (0, strings_1.writeString)(src2, this);
      } else {
        this.storeBit(0);
      }
      return this;
    }
    /**
     * Store string tail in ref
     * @param src source string
     * @returns this builder
     */
    storeStringRefTail(src2) {
      this.storeRef(beginCell().storeStringTail(src2));
      return this;
    }
    /**
     * Store maybe string tail in ref
     * @param src source string
     * @returns this builder
     */
    storeMaybeStringRefTail(src2) {
      if (src2 !== null && src2 !== void 0) {
        this.storeBit(1);
        this.storeStringRefTail(src2);
      } else {
        this.storeBit(0);
      }
      return this;
    }
    /**
     * Store dictionary in this builder
     * @param dict dictionary to store
     * @returns this builder
     */
    storeDict(dict, key, value) {
      if (dict) {
        dict.store(this, key, value);
      } else {
        this.storeBit(0);
      }
      return this;
    }
    /**
     * Store dictionary in this builder directly
     * @param dict dictionary to store
     * @returns this builder
     */
    storeDictDirect(dict, key, value) {
      dict.storeDirect(this, key, value);
      return this;
    }
    /**
     * Complete cell
     * @returns cell
     */
    endCell() {
      return new Cell_12.Cell({
        bits: this._bits.build(),
        refs: this._refs
      });
    }
    /**
     * Convert to cell
     * @returns cell
     */
    asCell() {
      return this.endCell();
    }
    /**
     * Convert to slice
     * @returns slice
     */
    asSlice() {
      return this.endCell().beginParse();
    }
  };
  Builder.Builder = Builder$1;
  return Builder;
}
var StateInit = {};
var SimpleLibrary = {};
Object.defineProperty(SimpleLibrary, "__esModule", { value: true });
SimpleLibrary.SimpleLibraryValue = SimpleLibrary.storeSimpleLibrary = SimpleLibrary.loadSimpleLibrary = void 0;
function loadSimpleLibrary(slice) {
  return {
    public: slice.loadBit(),
    root: slice.loadRef()
  };
}
SimpleLibrary.loadSimpleLibrary = loadSimpleLibrary;
function storeSimpleLibrary(src2) {
  return (builder2) => {
    builder2.storeBit(src2.public);
    builder2.storeRef(src2.root);
  };
}
SimpleLibrary.storeSimpleLibrary = storeSimpleLibrary;
SimpleLibrary.SimpleLibraryValue = {
  serialize(src2, builder2) {
    storeSimpleLibrary(src2)(builder2);
  },
  parse(src2) {
    return loadSimpleLibrary(src2);
  }
};
var TickTock = {};
Object.defineProperty(TickTock, "__esModule", { value: true });
TickTock.storeTickTock = TickTock.loadTickTock = void 0;
function loadTickTock(slice) {
  return {
    tick: slice.loadBit(),
    tock: slice.loadBit()
  };
}
TickTock.loadTickTock = loadTickTock;
function storeTickTock(src2) {
  return (builder2) => {
    builder2.storeBit(src2.tick);
    builder2.storeBit(src2.tock);
  };
}
TickTock.storeTickTock = storeTickTock;
Object.defineProperty(StateInit, "__esModule", { value: true });
StateInit.storeStateInit = StateInit.loadStateInit = void 0;
const Dictionary_1$2 = requireDictionary();
const SimpleLibrary_1 = SimpleLibrary;
const TickTock_1 = TickTock;
function loadStateInit(slice) {
  let splitDepth;
  if (slice.loadBit()) {
    splitDepth = slice.loadUint(5);
  }
  let special;
  if (slice.loadBit()) {
    special = (0, TickTock_1.loadTickTock)(slice);
  }
  let code = slice.loadMaybeRef();
  let data2 = slice.loadMaybeRef();
  let libraries = slice.loadDict(Dictionary_1$2.Dictionary.Keys.BigUint(256), SimpleLibrary_1.SimpleLibraryValue);
  if (libraries.size === 0) {
    libraries = void 0;
  }
  return {
    splitDepth,
    special,
    code,
    data: data2,
    libraries
  };
}
StateInit.loadStateInit = loadStateInit;
function storeStateInit(src2) {
  return (builder2) => {
    if (src2.splitDepth !== null && src2.splitDepth !== void 0) {
      builder2.storeBit(true);
      builder2.storeUint(src2.splitDepth, 5);
    } else {
      builder2.storeBit(false);
    }
    if (src2.special !== null && src2.special !== void 0) {
      builder2.storeBit(true);
      builder2.store((0, TickTock_1.storeTickTock)(src2.special));
    } else {
      builder2.storeBit(false);
    }
    builder2.storeMaybeRef(src2.code);
    builder2.storeMaybeRef(src2.data);
    builder2.storeDict(src2.libraries);
  };
}
StateInit.storeStateInit = storeStateInit;
Object.defineProperty(contractAddress$1, "__esModule", { value: true });
contractAddress$1.contractAddress = void 0;
const Builder_1$7 = requireBuilder();
const StateInit_1$3 = StateInit;
const Address_1$2 = Address$1;
function contractAddress(workchain, init2) {
  let hash = (0, Builder_1$7.beginCell)().store((0, StateInit_1$3.storeStateInit)(init2)).endCell().hash();
  return new Address_1$2.Address(workchain, hash);
}
contractAddress$1.contractAddress = contractAddress;
var tuple$1 = {};
Object.defineProperty(tuple$1, "__esModule", { value: true });
tuple$1.parseTuple = tuple$1.serializeTuple = void 0;
const Builder_1$6 = requireBuilder();
const INT64_MIN = BigInt("-9223372036854775808");
const INT64_MAX = BigInt("9223372036854775807");
function serializeTupleItem(src2, builder2) {
  if (src2.type === "null") {
    builder2.storeUint(0, 8);
  } else if (src2.type === "int") {
    if (src2.value <= INT64_MAX && src2.value >= INT64_MIN) {
      builder2.storeUint(1, 8);
      builder2.storeInt(src2.value, 64);
    } else {
      builder2.storeUint(256, 15);
      builder2.storeInt(src2.value, 257);
    }
  } else if (src2.type === "nan") {
    builder2.storeInt(767, 16);
  } else if (src2.type === "cell") {
    builder2.storeUint(3, 8);
    builder2.storeRef(src2.cell);
  } else if (src2.type === "slice") {
    builder2.storeUint(4, 8);
    builder2.storeUint(0, 10);
    builder2.storeUint(src2.cell.bits.length, 10);
    builder2.storeUint(0, 3);
    builder2.storeUint(src2.cell.refs.length, 3);
    builder2.storeRef(src2.cell);
  } else if (src2.type === "builder") {
    builder2.storeUint(5, 8);
    builder2.storeRef(src2.cell);
  } else if (src2.type === "tuple") {
    let head2 = null;
    let tail2 = null;
    for (let i = 0; i < src2.items.length; i++) {
      let s = head2;
      head2 = tail2;
      tail2 = s;
      if (i > 1) {
        head2 = (0, Builder_1$6.beginCell)().storeRef(tail2).storeRef(head2).endCell();
      }
      let bc = (0, Builder_1$6.beginCell)();
      serializeTupleItem(src2.items[i], bc);
      tail2 = bc.endCell();
    }
    builder2.storeUint(7, 8);
    builder2.storeUint(src2.items.length, 16);
    if (head2) {
      builder2.storeRef(head2);
    }
    if (tail2) {
      builder2.storeRef(tail2);
    }
  } else {
    throw Error("Invalid value");
  }
}
function parseStackItem(cs) {
  let kind = cs.loadUint(8);
  if (kind === 0) {
    return { type: "null" };
  } else if (kind === 1) {
    return { type: "int", value: cs.loadIntBig(64) };
  } else if (kind === 2) {
    if (cs.loadUint(7) === 0) {
      return { type: "int", value: cs.loadIntBig(257) };
    } else {
      cs.loadBit();
      return { type: "nan" };
    }
  } else if (kind === 3) {
    return { type: "cell", cell: cs.loadRef() };
  } else if (kind === 4) {
    let startBits = cs.loadUint(10);
    let endBits = cs.loadUint(10);
    let startRefs = cs.loadUint(3);
    let endRefs = cs.loadUint(3);
    let rs = cs.loadRef().beginParse();
    rs.skip(startBits);
    let dt = rs.loadBits(endBits - startBits);
    let builder2 = (0, Builder_1$6.beginCell)().storeBits(dt);
    if (startRefs < endRefs) {
      for (let i = 0; i < startRefs; i++) {
        rs.loadRef();
      }
      for (let i = 0; i < endRefs - startRefs; i++) {
        builder2.storeRef(rs.loadRef());
      }
    }
    return { type: "slice", cell: builder2.endCell() };
  } else if (kind === 5) {
    return { type: "builder", cell: cs.loadRef() };
  } else if (kind === 7) {
    let length = cs.loadUint(16);
    let items = [];
    if (length > 1) {
      let head2 = cs.loadRef().beginParse();
      let tail2 = cs.loadRef().beginParse();
      items.unshift(parseStackItem(tail2));
      for (let i = 0; i < length - 2; i++) {
        let ohead = head2;
        head2 = ohead.loadRef().beginParse();
        tail2 = ohead.loadRef().beginParse();
        items.unshift(parseStackItem(tail2));
      }
      items.unshift(parseStackItem(head2));
    } else if (length === 1) {
      items.push(parseStackItem(cs.loadRef().beginParse()));
    }
    return { type: "tuple", items };
  } else {
    throw Error("Unsupported stack item");
  }
}
function serializeTupleTail(src2, builder2) {
  if (src2.length > 0) {
    let tail2 = (0, Builder_1$6.beginCell)();
    serializeTupleTail(src2.slice(0, src2.length - 1), tail2);
    builder2.storeRef(tail2.endCell());
    serializeTupleItem(src2[src2.length - 1], builder2);
  }
}
function serializeTuple(src2) {
  let builder2 = (0, Builder_1$6.beginCell)();
  builder2.storeUint(src2.length, 24);
  let r = [...src2];
  serializeTupleTail(r, builder2);
  return builder2.endCell();
}
tuple$1.serializeTuple = serializeTuple;
function parseTuple(src2) {
  let res = [];
  let cs = src2.beginParse();
  let size2 = cs.loadUint(24);
  for (let i = 0; i < size2; i++) {
    let next = cs.loadRef();
    res.unshift(parseStackItem(cs));
    cs = next.beginParse();
  }
  return res;
}
tuple$1.parseTuple = parseTuple;
var reader = {};
Object.defineProperty(reader, "__esModule", { value: true });
reader.TupleReader = void 0;
class TupleReader {
  constructor(items) {
    this.items = [...items];
  }
  get remaining() {
    return this.items.length;
  }
  peek() {
    if (this.items.length === 0) {
      throw Error("EOF");
    }
    return this.items[0];
  }
  pop() {
    if (this.items.length === 0) {
      throw Error("EOF");
    }
    let res = this.items[0];
    this.items.splice(0, 1);
    return res;
  }
  skip(num = 1) {
    for (let i = 0; i < num; i++) {
      this.pop();
    }
    return this;
  }
  readBigNumber() {
    let popped = this.pop();
    if (popped.type !== "int") {
      throw Error("Not a number");
    }
    return popped.value;
  }
  readBigNumberOpt() {
    let popped = this.pop();
    if (popped.type === "null") {
      return null;
    }
    if (popped.type !== "int") {
      throw Error("Not a number");
    }
    return popped.value;
  }
  readNumber() {
    return Number(this.readBigNumber());
  }
  readNumberOpt() {
    let r = this.readBigNumberOpt();
    if (r !== null) {
      return Number(r);
    } else {
      return null;
    }
  }
  readBoolean() {
    let res = this.readNumber();
    return res === 0 ? false : true;
  }
  readBooleanOpt() {
    let res = this.readNumberOpt();
    if (res !== null) {
      return res === 0 ? false : true;
    } else {
      return null;
    }
  }
  readAddress() {
    let r = this.readCell().beginParse().loadAddress();
    if (r !== null) {
      return r;
    } else {
      throw Error("Not an address");
    }
  }
  readAddressOpt() {
    let r = this.readCellOpt();
    if (r !== null) {
      return r.beginParse().loadMaybeAddress();
    } else {
      return null;
    }
  }
  readCell() {
    let popped = this.pop();
    if (popped.type !== "cell" && popped.type !== "slice" && popped.type !== "builder") {
      throw Error("Not a cell: " + popped.type);
    }
    return popped.cell;
  }
  readCellOpt() {
    let popped = this.pop();
    if (popped.type === "null") {
      return null;
    }
    if (popped.type !== "cell" && popped.type !== "slice" && popped.type !== "builder") {
      throw Error("Not a cell");
    }
    return popped.cell;
  }
  readTuple() {
    let popped = this.pop();
    if (popped.type !== "tuple") {
      throw Error("Not a number");
    }
    return new TupleReader(popped.items);
  }
  readTupleOpt() {
    let popped = this.pop();
    if (popped.type === "null") {
      return null;
    }
    if (popped.type !== "tuple") {
      throw Error("Not a number");
    }
    return new TupleReader(popped.items);
  }
  readBuffer() {
    let s = this.readCell().beginParse();
    if (s.remainingRefs !== 0) {
      throw Error("Not a buffer");
    }
    if (s.remainingBits % 8 !== 0) {
      throw Error("Not a buffer");
    }
    return s.loadBuffer(s.remainingBits / 8);
  }
  readBufferOpt() {
    let popped = this.peek();
    if (popped.type === "null") {
      return null;
    }
    let s = this.readCell().beginParse();
    if (s.remainingRefs !== 0) {
      throw Error("Not a buffer");
    }
    if (s.remainingBits % 8 !== 0) {
      throw Error("Not a buffer");
    }
    return s.loadBuffer(s.remainingBits / 8);
  }
  readString() {
    let s = this.readCell().beginParse();
    return s.loadStringTail();
  }
  readStringOpt() {
    let popped = this.peek();
    if (popped.type === "null") {
      return null;
    }
    let s = this.readCell().beginParse();
    return s.loadStringTail();
  }
}
reader.TupleReader = TupleReader;
var builder = {};
Object.defineProperty(builder, "__esModule", { value: true });
builder.TupleBuilder = void 0;
const Builder_1$5 = requireBuilder();
const Cell_1$2 = requireCell();
const Slice_1 = requireSlice();
class TupleBuilder {
  constructor() {
    this._tuple = [];
  }
  writeNumber(v) {
    if (v === null || v === void 0) {
      this._tuple.push({ type: "null" });
    } else {
      this._tuple.push({ type: "int", value: BigInt(v) });
    }
  }
  writeBoolean(v) {
    if (v === null || v === void 0) {
      this._tuple.push({ type: "null" });
    } else {
      this._tuple.push({ type: "int", value: v ? -1n : 0n });
    }
  }
  writeBuffer(v) {
    if (v === null || v === void 0) {
      this._tuple.push({ type: "null" });
    } else {
      this._tuple.push({ type: "slice", cell: (0, Builder_1$5.beginCell)().storeBuffer(v).endCell() });
    }
  }
  writeString(v) {
    if (v === null || v === void 0) {
      this._tuple.push({ type: "null" });
    } else {
      this._tuple.push({ type: "slice", cell: (0, Builder_1$5.beginCell)().storeStringTail(v).endCell() });
    }
  }
  writeCell(v) {
    if (v === null || v === void 0) {
      this._tuple.push({ type: "null" });
    } else {
      if (v instanceof Cell_1$2.Cell) {
        this._tuple.push({ type: "cell", cell: v });
      } else if (v instanceof Slice_1.Slice) {
        this._tuple.push({ type: "cell", cell: v.asCell() });
      }
    }
  }
  writeSlice(v) {
    if (v === null || v === void 0) {
      this._tuple.push({ type: "null" });
    } else {
      if (v instanceof Cell_1$2.Cell) {
        this._tuple.push({ type: "slice", cell: v });
      } else if (v instanceof Slice_1.Slice) {
        this._tuple.push({ type: "slice", cell: v.asCell() });
      }
    }
  }
  writeBuilder(v) {
    if (v === null || v === void 0) {
      this._tuple.push({ type: "null" });
    } else {
      if (v instanceof Cell_1$2.Cell) {
        this._tuple.push({ type: "builder", cell: v });
      } else if (v instanceof Slice_1.Slice) {
        this._tuple.push({ type: "builder", cell: v.asCell() });
      }
    }
  }
  writeTuple(v) {
    if (v === null || v === void 0) {
      this._tuple.push({ type: "null" });
    } else {
      this._tuple.push({ type: "tuple", items: v });
    }
  }
  writeAddress(v) {
    if (v === null || v === void 0) {
      this._tuple.push({ type: "null" });
    } else {
      this._tuple.push({ type: "slice", cell: (0, Builder_1$5.beginCell)().storeAddress(v).endCell() });
    }
  }
  build() {
    return [...this._tuple];
  }
}
builder.TupleBuilder = TupleBuilder;
var _export = {};
var _helpers = {};
var convert = {};
Object.defineProperty(convert, "__esModule", { value: true });
convert.fromNano = convert.toNano = void 0;
function toNano(src2) {
  if (typeof src2 === "bigint") {
    return src2 * 1000000000n;
  } else if (typeof src2 === "number") {
    return BigInt(src2) * 1000000000n;
  } else {
    let neg = false;
    while (src2.startsWith("-")) {
      neg = !neg;
      src2 = src2.slice(1);
    }
    if (src2 === ".") {
      throw Error("Invalid number");
    }
    let parts = src2.split(".");
    if (parts.length > 2) {
      throw Error("Invalid number");
    }
    let whole = parts[0];
    let frac = parts[1];
    if (!whole) {
      whole = "0";
    }
    if (!frac) {
      frac = "0";
    }
    if (frac.length > 9) {
      throw Error("Invalid number");
    }
    while (frac.length < 9) {
      frac += "0";
    }
    let r = BigInt(whole) * 1000000000n + BigInt(frac);
    if (neg) {
      r = -r;
    }
    return r;
  }
}
convert.toNano = toNano;
function fromNano(src2) {
  let v = BigInt(src2);
  let neg = false;
  if (v < 0) {
    neg = true;
    v = -v;
  }
  let frac = v % 1000000000n;
  let facStr = frac.toString();
  while (facStr.length < 9) {
    facStr = "0" + facStr;
  }
  facStr = facStr.match(/^([0-9]*[1-9]|0)(0*)/)[1];
  let whole = v / 1000000000n;
  let wholeStr = whole.toString();
  let value = `${wholeStr}${facStr === "0" ? "" : `.${facStr}`}`;
  if (neg) {
    value = "-" + value;
  }
  return value;
}
convert.fromNano = fromNano;
Object.defineProperty(_helpers, "__esModule", { value: true });
_helpers.comment = _helpers.external = _helpers.internal = void 0;
const Address_1$1 = Address$1;
const Cell_1$1 = requireCell();
const Builder_1$4 = requireBuilder();
const convert_1 = convert;
function internal$1(src2) {
  let bounce = true;
  if (src2.bounce !== null && src2.bounce !== void 0) {
    bounce = src2.bounce;
  }
  let to;
  if (typeof src2.to === "string") {
    to = Address_1$1.Address.parse(src2.to);
  } else if (Address_1$1.Address.isAddress(src2.to)) {
    to = src2.to;
  } else {
    throw new Error(`Invalid address ${src2.to}`);
  }
  let value;
  if (typeof src2.value === "string") {
    value = (0, convert_1.toNano)(src2.value);
  } else {
    value = src2.value;
  }
  let body = Cell_1$1.Cell.EMPTY;
  if (typeof src2.body === "string") {
    body = (0, Builder_1$4.beginCell)().storeUint(0, 32).storeStringTail(src2.body).endCell();
  } else if (src2.body) {
    body = src2.body;
  }
  return {
    info: {
      type: "internal",
      dest: to,
      value: { coins: value },
      bounce,
      ihrDisabled: true,
      bounced: false,
      ihrFee: 0n,
      forwardFee: 0n,
      createdAt: 0,
      createdLt: 0n
    },
    init: src2.init ? { code: src2.init.code, data: src2.init.data } : void 0,
    body
  };
}
_helpers.internal = internal$1;
function external(src2) {
  let to;
  if (typeof src2.to === "string") {
    to = Address_1$1.Address.parse(src2.to);
  } else if (Address_1$1.Address.isAddress(src2.to)) {
    to = src2.to;
  } else {
    throw new Error(`Invalid address ${src2.to}`);
  }
  return {
    info: {
      type: "external-in",
      dest: to,
      importFee: 0n
    },
    init: src2.init ? { code: src2.init.code, data: src2.init.data } : void 0,
    body: src2.body || Cell_1$1.Cell.EMPTY
  };
}
_helpers.external = external;
function comment(src2) {
  return (0, Builder_1$4.beginCell)().storeUint(0, 32).storeStringTail(src2).endCell();
}
_helpers.comment = comment;
var Account = {};
var AccountStorage = {};
var AccountState = {};
Object.defineProperty(AccountState, "__esModule", { value: true });
AccountState.storeAccountState = AccountState.loadAccountState = void 0;
const StateInit_1$2 = StateInit;
function loadAccountState(cs) {
  if (cs.loadBit()) {
    return { type: "active", state: (0, StateInit_1$2.loadStateInit)(cs) };
  } else if (cs.loadBit()) {
    return { type: "frozen", stateHash: cs.loadUintBig(256) };
  } else {
    return { type: "uninit" };
  }
}
AccountState.loadAccountState = loadAccountState;
function storeAccountState(src2) {
  return (builder2) => {
    if (src2.type === "active") {
      builder2.storeBit(true);
      builder2.store((0, StateInit_1$2.storeStateInit)(src2.state));
    } else if (src2.type === "frozen") {
      builder2.storeBit(false);
      builder2.storeBit(true);
      builder2.storeUint(src2.stateHash, 256);
    } else if (src2.type === "uninit") {
      builder2.storeBit(false);
      builder2.storeBit(false);
    }
  };
}
AccountState.storeAccountState = storeAccountState;
var CurrencyCollection = {};
Object.defineProperty(CurrencyCollection, "__esModule", { value: true });
CurrencyCollection.storeCurrencyCollection = CurrencyCollection.loadCurrencyCollection = void 0;
const Dictionary_1$1 = requireDictionary();
function loadCurrencyCollection(slice) {
  const coins = slice.loadCoins();
  const other = slice.loadDict(Dictionary_1$1.Dictionary.Keys.Uint(32), Dictionary_1$1.Dictionary.Values.BigVarUint(
    5
    /* log2(32) */
  ));
  if (other.size === 0) {
    return { coins };
  } else {
    return { other, coins };
  }
}
CurrencyCollection.loadCurrencyCollection = loadCurrencyCollection;
function storeCurrencyCollection(collection) {
  return (builder2) => {
    builder2.storeCoins(collection.coins);
    if (collection.other) {
      builder2.storeDict(collection.other);
    } else {
      builder2.storeBit(0);
    }
  };
}
CurrencyCollection.storeCurrencyCollection = storeCurrencyCollection;
Object.defineProperty(AccountStorage, "__esModule", { value: true });
AccountStorage.storeAccountStorage = AccountStorage.loadAccountStorage = void 0;
const AccountState_1 = AccountState;
const CurrencyCollection_1$5 = CurrencyCollection;
function loadAccountStorage(slice) {
  return {
    lastTransLt: slice.loadUintBig(64),
    balance: (0, CurrencyCollection_1$5.loadCurrencyCollection)(slice),
    state: (0, AccountState_1.loadAccountState)(slice)
  };
}
AccountStorage.loadAccountStorage = loadAccountStorage;
function storeAccountStorage(src2) {
  return (builder2) => {
    builder2.storeUint(src2.lastTransLt, 64);
    builder2.store((0, CurrencyCollection_1$5.storeCurrencyCollection)(src2.balance));
    builder2.store((0, AccountState_1.storeAccountState)(src2.state));
  };
}
AccountStorage.storeAccountStorage = storeAccountStorage;
var StorageInto = {};
var StorageUsed = {};
Object.defineProperty(StorageUsed, "__esModule", { value: true });
StorageUsed.storeStorageUsed = StorageUsed.loadStorageUsed = void 0;
function loadStorageUsed(cs) {
  return {
    cells: cs.loadVarUintBig(3),
    bits: cs.loadVarUintBig(3),
    publicCells: cs.loadVarUintBig(3)
  };
}
StorageUsed.loadStorageUsed = loadStorageUsed;
function storeStorageUsed(src2) {
  return (builder2) => {
    builder2.storeVarUint(src2.cells, 3);
    builder2.storeVarUint(src2.bits, 3);
    builder2.storeVarUint(src2.publicCells, 3);
  };
}
StorageUsed.storeStorageUsed = storeStorageUsed;
Object.defineProperty(StorageInto, "__esModule", { value: true });
StorageInto.storeStorageInfo = StorageInto.loadStorageInfo = void 0;
const StorageUsed_1 = StorageUsed;
function loadStorageInfo(slice) {
  return {
    used: (0, StorageUsed_1.loadStorageUsed)(slice),
    lastPaid: slice.loadUint(32),
    duePayment: slice.loadMaybeCoins()
  };
}
StorageInto.loadStorageInfo = loadStorageInfo;
function storeStorageInfo(src2) {
  return (builder2) => {
    builder2.store((0, StorageUsed_1.storeStorageUsed)(src2.used));
    builder2.storeUint(src2.lastPaid, 32);
    builder2.storeMaybeCoins(src2.duePayment);
  };
}
StorageInto.storeStorageInfo = storeStorageInfo;
Object.defineProperty(Account, "__esModule", { value: true });
Account.storeAccount = Account.loadAccount = void 0;
const AccountStorage_1 = AccountStorage;
const StorageInto_1 = StorageInto;
function loadAccount(slice) {
  return {
    addr: slice.loadAddress(),
    storageStats: (0, StorageInto_1.loadStorageInfo)(slice),
    storage: (0, AccountStorage_1.loadAccountStorage)(slice)
  };
}
Account.loadAccount = loadAccount;
function storeAccount(src2) {
  return (builder2) => {
    builder2.storeAddress(src2.addr);
    builder2.store((0, StorageInto_1.storeStorageInfo)(src2.storageStats));
    builder2.store((0, AccountStorage_1.storeAccountStorage)(src2.storage));
  };
}
Account.storeAccount = storeAccount;
var AccountStatus = {};
Object.defineProperty(AccountStatus, "__esModule", { value: true });
AccountStatus.storeAccountStatus = AccountStatus.loadAccountStatus = void 0;
function loadAccountStatus(slice) {
  const status = slice.loadUint(2);
  if (status === 0) {
    return "uninitialized";
  }
  if (status === 1) {
    return "frozen";
  }
  if (status === 2) {
    return "active";
  }
  if (status === 3) {
    return "non-existing";
  }
  throw Error("Invalid data");
}
AccountStatus.loadAccountStatus = loadAccountStatus;
function storeAccountStatus(src2) {
  return (builder2) => {
    if (src2 === "uninitialized") {
      builder2.storeUint(0, 2);
    } else if (src2 === "frozen") {
      builder2.storeUint(1, 2);
    } else if (src2 === "active") {
      builder2.storeUint(2, 2);
    } else if (src2 === "non-existing") {
      builder2.storeUint(3, 2);
    } else {
      throw Error("Invalid data");
    }
    return builder2;
  };
}
AccountStatus.storeAccountStatus = storeAccountStatus;
var AccountStatusChange = {};
Object.defineProperty(AccountStatusChange, "__esModule", { value: true });
AccountStatusChange.storeAccountStatusChange = AccountStatusChange.loadAccountStatusChange = void 0;
function loadAccountStatusChange(slice) {
  if (!slice.loadBit()) {
    return "unchanged";
  }
  if (slice.loadBit()) {
    return "frozen";
  } else {
    return "deleted";
  }
}
AccountStatusChange.loadAccountStatusChange = loadAccountStatusChange;
function storeAccountStatusChange(src2) {
  return (builder2) => {
    if (src2 == "unchanged") {
      builder2.storeBit(0);
    } else if (src2 === "frozen") {
      builder2.storeBit(1);
      builder2.storeBit(0);
    } else if (src2 === "deleted") {
      builder2.storeBit(1);
      builder2.storeBit(1);
    } else {
      throw Error("Invalid account status change");
    }
  };
}
AccountStatusChange.storeAccountStatusChange = storeAccountStatusChange;
var CommonMessageInfo = {};
Object.defineProperty(CommonMessageInfo, "__esModule", { value: true });
CommonMessageInfo.storeCommonMessageInfo = CommonMessageInfo.loadCommonMessageInfo = void 0;
const CurrencyCollection_1$4 = CurrencyCollection;
function loadCommonMessageInfo(slice) {
  if (!slice.loadBit()) {
    const ihrDisabled = slice.loadBit();
    const bounce = slice.loadBit();
    const bounced = slice.loadBit();
    const src3 = slice.loadAddress();
    const dest2 = slice.loadAddress();
    const value = (0, CurrencyCollection_1$4.loadCurrencyCollection)(slice);
    const ihrFee = slice.loadCoins();
    const forwardFee = slice.loadCoins();
    const createdLt2 = slice.loadUintBig(64);
    const createdAt2 = slice.loadUint(32);
    return {
      type: "internal",
      ihrDisabled,
      bounce,
      bounced,
      src: src3,
      dest: dest2,
      value,
      ihrFee,
      forwardFee,
      createdLt: createdLt2,
      createdAt: createdAt2
    };
  }
  if (!slice.loadBit()) {
    const src3 = slice.loadMaybeExternalAddress();
    const dest2 = slice.loadAddress();
    const importFee = slice.loadCoins();
    return {
      type: "external-in",
      src: src3,
      dest: dest2,
      importFee
    };
  }
  const src2 = slice.loadAddress();
  const dest = slice.loadMaybeExternalAddress();
  const createdLt = slice.loadUintBig(64);
  const createdAt = slice.loadUint(32);
  return {
    type: "external-out",
    src: src2,
    dest,
    createdLt,
    createdAt
  };
}
CommonMessageInfo.loadCommonMessageInfo = loadCommonMessageInfo;
function storeCommonMessageInfo(source) {
  return (builder2) => {
    if (source.type === "internal") {
      builder2.storeBit(0);
      builder2.storeBit(source.ihrDisabled);
      builder2.storeBit(source.bounce);
      builder2.storeBit(source.bounced);
      builder2.storeAddress(source.src);
      builder2.storeAddress(source.dest);
      builder2.store((0, CurrencyCollection_1$4.storeCurrencyCollection)(source.value));
      builder2.storeCoins(source.ihrFee);
      builder2.storeCoins(source.forwardFee);
      builder2.storeUint(source.createdLt, 64);
      builder2.storeUint(source.createdAt, 32);
    } else if (source.type === "external-in") {
      builder2.storeBit(1);
      builder2.storeBit(0);
      builder2.storeAddress(source.src);
      builder2.storeAddress(source.dest);
      builder2.storeCoins(source.importFee);
    } else if (source.type === "external-out") {
      builder2.storeBit(1);
      builder2.storeBit(1);
      builder2.storeAddress(source.src);
      builder2.storeAddress(source.dest);
      builder2.storeUint(source.createdLt, 64);
      builder2.storeUint(source.createdAt, 32);
    } else {
      throw new Error("Unknown CommonMessageInfo type");
    }
  };
}
CommonMessageInfo.storeCommonMessageInfo = storeCommonMessageInfo;
var CommonMessageInfoRelaxed = {};
Object.defineProperty(CommonMessageInfoRelaxed, "__esModule", { value: true });
CommonMessageInfoRelaxed.storeCommonMessageInfoRelaxed = CommonMessageInfoRelaxed.loadCommonMessageInfoRelaxed = void 0;
const CurrencyCollection_1$3 = CurrencyCollection;
function loadCommonMessageInfoRelaxed(slice) {
  if (!slice.loadBit()) {
    const ihrDisabled = slice.loadBit();
    const bounce = slice.loadBit();
    const bounced = slice.loadBit();
    const src3 = slice.loadMaybeAddress();
    const dest2 = slice.loadAddress();
    const value = (0, CurrencyCollection_1$3.loadCurrencyCollection)(slice);
    const ihrFee = slice.loadCoins();
    const forwardFee = slice.loadCoins();
    const createdLt2 = slice.loadUintBig(64);
    const createdAt2 = slice.loadUint(32);
    return {
      type: "internal",
      ihrDisabled,
      bounce,
      bounced,
      src: src3,
      dest: dest2,
      value,
      ihrFee,
      forwardFee,
      createdLt: createdLt2,
      createdAt: createdAt2
    };
  }
  if (!slice.loadBit()) {
    throw Error("External In message is not possible for CommonMessageInfoRelaxed");
  }
  const src2 = slice.loadMaybeAddress();
  const dest = slice.loadMaybeExternalAddress();
  const createdLt = slice.loadUintBig(64);
  const createdAt = slice.loadUint(32);
  return {
    type: "external-out",
    src: src2,
    dest,
    createdLt,
    createdAt
  };
}
CommonMessageInfoRelaxed.loadCommonMessageInfoRelaxed = loadCommonMessageInfoRelaxed;
function storeCommonMessageInfoRelaxed(source) {
  return (builder2) => {
    if (source.type === "internal") {
      builder2.storeBit(0);
      builder2.storeBit(source.ihrDisabled);
      builder2.storeBit(source.bounce);
      builder2.storeBit(source.bounced);
      builder2.storeAddress(source.src);
      builder2.storeAddress(source.dest);
      builder2.store((0, CurrencyCollection_1$3.storeCurrencyCollection)(source.value));
      builder2.storeCoins(source.ihrFee);
      builder2.storeCoins(source.forwardFee);
      builder2.storeUint(source.createdLt, 64);
      builder2.storeUint(source.createdAt, 32);
    } else if (source.type === "external-out") {
      builder2.storeBit(1);
      builder2.storeBit(1);
      builder2.storeAddress(source.src);
      builder2.storeAddress(source.dest);
      builder2.storeUint(source.createdLt, 64);
      builder2.storeUint(source.createdAt, 32);
    } else {
      throw new Error("Unknown CommonMessageInfo type");
    }
  };
}
CommonMessageInfoRelaxed.storeCommonMessageInfoRelaxed = storeCommonMessageInfoRelaxed;
var ComputeSkipReason = {};
Object.defineProperty(ComputeSkipReason, "__esModule", { value: true });
ComputeSkipReason.storeComputeSkipReason = ComputeSkipReason.loadComputeSkipReason = void 0;
function loadComputeSkipReason(slice) {
  let reason = slice.loadUint(2);
  if (reason === 0) {
    return "no-state";
  } else if (reason === 1) {
    return "bad-state";
  } else if (reason === 2) {
    return "no-gas";
  }
  throw new Error(`Unknown ComputeSkipReason: ${reason}`);
}
ComputeSkipReason.loadComputeSkipReason = loadComputeSkipReason;
function storeComputeSkipReason(src2) {
  return (builder2) => {
    if (src2 === "no-state") {
      builder2.storeUint(0, 2);
    } else if (src2 === "bad-state") {
      builder2.storeUint(1, 2);
    } else if (src2 === "no-gas") {
      builder2.storeUint(2, 2);
    } else {
      throw new Error(`Unknown ComputeSkipReason: ${src2}`);
    }
  };
}
ComputeSkipReason.storeComputeSkipReason = storeComputeSkipReason;
var DepthBalanceInfo = {};
Object.defineProperty(DepthBalanceInfo, "__esModule", { value: true });
DepthBalanceInfo.storeDepthBalanceInfo = DepthBalanceInfo.loadDepthBalanceInfo = void 0;
const CurrencyCollection_1$2 = CurrencyCollection;
function loadDepthBalanceInfo(slice) {
  let splitDepth = slice.loadUint(5);
  return {
    splitDepth,
    balance: (0, CurrencyCollection_1$2.loadCurrencyCollection)(slice)
  };
}
DepthBalanceInfo.loadDepthBalanceInfo = loadDepthBalanceInfo;
function storeDepthBalanceInfo(src2) {
  return (builder2) => {
    builder2.storeUint(src2.splitDepth, 5);
    builder2.store((0, CurrencyCollection_1$2.storeCurrencyCollection)(src2.balance));
  };
}
DepthBalanceInfo.storeDepthBalanceInfo = storeDepthBalanceInfo;
var HashUpdate = {};
Object.defineProperty(HashUpdate, "__esModule", { value: true });
HashUpdate.storeHashUpdate = HashUpdate.loadHashUpdate = void 0;
function loadHashUpdate(slice) {
  if (slice.loadUint(8) !== 114) {
    throw Error("Invalid data");
  }
  const oldHash = slice.loadBuffer(32);
  const newHash = slice.loadBuffer(32);
  return { oldHash, newHash };
}
HashUpdate.loadHashUpdate = loadHashUpdate;
function storeHashUpdate(src2) {
  return (builder2) => {
    builder2.storeUint(114, 8);
    builder2.storeBuffer(src2.oldHash);
    builder2.storeBuffer(src2.newHash);
  };
}
HashUpdate.storeHashUpdate = storeHashUpdate;
var MasterchainStateExtra = {};
Object.defineProperty(MasterchainStateExtra, "__esModule", { value: true });
MasterchainStateExtra.loadMasterchainStateExtra = void 0;
const Dictionary_1 = requireDictionary();
const CurrencyCollection_1$1 = CurrencyCollection;
function loadMasterchainStateExtra(cs) {
  if (cs.loadUint(16) !== 52262) {
    throw Error("Invalid data");
  }
  if (cs.loadBit()) {
    cs.loadRef();
  }
  let configAddress = cs.loadUintBig(256);
  let config = Dictionary_1.Dictionary.load(Dictionary_1.Dictionary.Keys.Int(32), Dictionary_1.Dictionary.Values.Cell(), cs);
  const globalBalance = (0, CurrencyCollection_1$1.loadCurrencyCollection)(cs);
  return {
    config,
    configAddress,
    globalBalance
  };
}
MasterchainStateExtra.loadMasterchainStateExtra = loadMasterchainStateExtra;
var Message = {};
Object.defineProperty(Message, "__esModule", { value: true });
Message.MessageValue = Message.storeMessage = Message.loadMessage = void 0;
const Builder_1$3 = requireBuilder();
const CommonMessageInfo_1 = CommonMessageInfo;
const StateInit_1$1 = StateInit;
function loadMessage(slice) {
  const info = (0, CommonMessageInfo_1.loadCommonMessageInfo)(slice);
  let init2 = null;
  if (slice.loadBit()) {
    if (!slice.loadBit()) {
      init2 = (0, StateInit_1$1.loadStateInit)(slice);
    } else {
      init2 = (0, StateInit_1$1.loadStateInit)(slice.loadRef().beginParse());
    }
  }
  const body = slice.loadBit() ? slice.loadRef() : slice.asCell();
  return {
    info,
    init: init2,
    body
  };
}
Message.loadMessage = loadMessage;
function storeMessage(message2, opts) {
  return (builder2) => {
    builder2.store((0, CommonMessageInfo_1.storeCommonMessageInfo)(message2.info));
    if (message2.init) {
      builder2.storeBit(true);
      let initCell = (0, Builder_1$3.beginCell)().store((0, StateInit_1$1.storeStateInit)(message2.init));
      if (builder2.availableBits - 2 >= initCell.bits) {
        builder2.storeBit(false);
        builder2.storeBuilder(initCell);
      } else {
        builder2.storeBit(true);
        builder2.storeRef(initCell);
      }
    } else {
      builder2.storeBit(false);
    }
    let needRef = false;
    if (opts && opts.forceRef) {
      needRef = true;
    } else {
      if (builder2.availableBits - 1 >= message2.body.bits.length) {
        needRef = false;
      } else {
        needRef = true;
      }
    }
    if (needRef) {
      builder2.storeBit(true);
      builder2.storeRef(message2.body);
    } else {
      builder2.storeBit(false);
      builder2.storeBuilder(message2.body.asBuilder());
    }
  };
}
Message.storeMessage = storeMessage;
Message.MessageValue = {
  serialize(src2, builder2) {
    builder2.storeRef((0, Builder_1$3.beginCell)().store(storeMessage(src2)));
  },
  parse(slice) {
    return loadMessage(slice.loadRef().beginParse());
  }
};
var MessageRelaxed = {};
Object.defineProperty(MessageRelaxed, "__esModule", { value: true });
MessageRelaxed.storeMessageRelaxed = MessageRelaxed.loadMessageRelaxed = void 0;
const Builder_1$2 = requireBuilder();
const CommonMessageInfoRelaxed_1 = CommonMessageInfoRelaxed;
const StateInit_1 = StateInit;
function loadMessageRelaxed(slice) {
  const info = (0, CommonMessageInfoRelaxed_1.loadCommonMessageInfoRelaxed)(slice);
  let init2 = null;
  if (slice.loadBit()) {
    if (!slice.loadBit()) {
      init2 = (0, StateInit_1.loadStateInit)(slice);
    } else {
      init2 = (0, StateInit_1.loadStateInit)(slice.loadRef().beginParse());
    }
  }
  const body = slice.loadBit() ? slice.loadRef() : slice.asCell();
  return {
    info,
    init: init2,
    body
  };
}
MessageRelaxed.loadMessageRelaxed = loadMessageRelaxed;
function storeMessageRelaxed(message2, opts) {
  return (builder2) => {
    builder2.store((0, CommonMessageInfoRelaxed_1.storeCommonMessageInfoRelaxed)(message2.info));
    if (message2.init) {
      builder2.storeBit(true);
      let initCell = (0, Builder_1$2.beginCell)().store((0, StateInit_1.storeStateInit)(message2.init));
      if (builder2.availableBits - 2 >= initCell.bits) {
        builder2.storeBit(false);
        builder2.storeBuilder(initCell);
      } else {
        builder2.storeBit(true);
        builder2.storeRef(initCell);
      }
    } else {
      builder2.storeBit(false);
    }
    let needRef = false;
    if (opts && opts.forceRef) {
      needRef = true;
    } else {
      if (builder2.availableBits - 1 >= message2.body.bits.length) {
        needRef = false;
      } else {
        needRef = true;
      }
    }
    if (needRef) {
      builder2.storeBit(true);
      builder2.storeRef(message2.body);
    } else {
      builder2.storeBit(false);
      builder2.storeBuilder(message2.body.asBuilder());
    }
  };
}
MessageRelaxed.storeMessageRelaxed = storeMessageRelaxed;
var SendMode = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.SendMode = void 0;
  (function(SendMode2) {
    SendMode2[SendMode2["CARRRY_ALL_REMAINING_BALANCE"] = 128] = "CARRRY_ALL_REMAINING_BALANCE";
    SendMode2[SendMode2["CARRRY_ALL_REMAINING_INCOMING_VALUE"] = 64] = "CARRRY_ALL_REMAINING_INCOMING_VALUE";
    SendMode2[SendMode2["DESTROY_ACCOUNT_IF_ZERO"] = 32] = "DESTROY_ACCOUNT_IF_ZERO";
    SendMode2[SendMode2["PAY_GAS_SEPARATLY"] = 1] = "PAY_GAS_SEPARATLY";
    SendMode2[SendMode2["IGNORE_ERRORS"] = 2] = "IGNORE_ERRORS";
    SendMode2[SendMode2["NONE"] = 0] = "NONE";
  })(exports.SendMode || (exports.SendMode = {}));
})(SendMode);
var ShardAccount = {};
Object.defineProperty(ShardAccount, "__esModule", { value: true });
ShardAccount.storeShardAccount = ShardAccount.loadShardAccount = void 0;
const Builder_1$1 = requireBuilder();
const Account_1 = Account;
function loadShardAccount(slice) {
  let accountRef = slice.loadRef();
  let account = void 0;
  if (!accountRef.isExotic) {
    let accountSlice = accountRef.beginParse();
    if (accountSlice.loadBit()) {
      account = (0, Account_1.loadAccount)(accountSlice);
    }
  }
  return {
    account,
    lastTransactionHash: slice.loadUintBig(256),
    lastTransactionLt: slice.loadUintBig(64)
  };
}
ShardAccount.loadShardAccount = loadShardAccount;
function storeShardAccount(src2) {
  return (builder2) => {
    if (src2.account) {
      builder2.storeRef((0, Builder_1$1.beginCell)().storeBit(true).store((0, Account_1.storeAccount)(src2.account)));
    } else {
      builder2.storeRef((0, Builder_1$1.beginCell)().storeBit(false));
    }
    builder2.storeUint(src2.lastTransactionHash, 256);
    builder2.storeUint(src2.lastTransactionLt, 64);
  };
}
ShardAccount.storeShardAccount = storeShardAccount;
var ShardAccounts = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.storeShardAccounts = exports.loadShardAccounts = exports.ShardAccountRefValue = void 0;
  const Dictionary_12 = requireDictionary();
  const DepthBalanceInfo_1 = DepthBalanceInfo;
  const ShardAccount_1 = ShardAccount;
  exports.ShardAccountRefValue = {
    parse: (cs) => {
      let depthBalanceInfo = (0, DepthBalanceInfo_1.loadDepthBalanceInfo)(cs);
      let shardAccount = (0, ShardAccount_1.loadShardAccount)(cs);
      return {
        depthBalanceInfo,
        shardAccount
      };
    },
    serialize(src2, builder2) {
      builder2.store((0, DepthBalanceInfo_1.storeDepthBalanceInfo)(src2.depthBalanceInfo));
      builder2.store((0, ShardAccount_1.storeShardAccount)(src2.shardAccount));
    }
  };
  function loadShardAccounts(cs) {
    return Dictionary_12.Dictionary.load(Dictionary_12.Dictionary.Keys.BigUint(256), exports.ShardAccountRefValue, cs);
  }
  exports.loadShardAccounts = loadShardAccounts;
  function storeShardAccounts(src2) {
    return (Builder2) => {
      Builder2.storeDict(src2);
    };
  }
  exports.storeShardAccounts = storeShardAccounts;
})(ShardAccounts);
var ShardIdent = {};
Object.defineProperty(ShardIdent, "__esModule", { value: true });
ShardIdent.storeShardIdent = ShardIdent.loadShardIdent = void 0;
function loadShardIdent(slice) {
  if (slice.loadUint(2) !== 0) {
    throw Error("Invalid data");
  }
  return {
    shardPrefixBits: slice.loadUint(6),
    workchainId: slice.loadInt(32),
    shardPrefix: slice.loadUintBig(64)
  };
}
ShardIdent.loadShardIdent = loadShardIdent;
function storeShardIdent(src2) {
  return (builder2) => {
    builder2.storeUint(0, 2);
    builder2.storeUint(src2.shardPrefixBits, 6);
    builder2.storeInt(src2.workchainId, 32);
    builder2.storeUint(src2.shardPrefix, 64);
  };
}
ShardIdent.storeShardIdent = storeShardIdent;
var ShardStateUnsplit = {};
Object.defineProperty(ShardStateUnsplit, "__esModule", { value: true });
ShardStateUnsplit.loadShardStateUnsplit = void 0;
const MasterchainStateExtra_1 = MasterchainStateExtra;
const ShardAccounts_1 = ShardAccounts;
const ShardIdent_1 = ShardIdent;
function loadShardStateUnsplit(cs) {
  if (cs.loadUint(32) !== 2418257890) {
    throw Error("Invalid data");
  }
  let globalId = cs.loadInt(32);
  let shardId = (0, ShardIdent_1.loadShardIdent)(cs);
  let seqno = cs.loadUint(32);
  let vertSeqNo = cs.loadUint(32);
  let genUtime = cs.loadUint(32);
  let genLt = cs.loadUintBig(64);
  let minRefMcSeqno = cs.loadUint(32);
  cs.loadRef();
  let beforeSplit = cs.loadBit();
  let shardAccountsRef = cs.loadRef();
  let accounts = void 0;
  if (!shardAccountsRef.isExotic) {
    accounts = (0, ShardAccounts_1.loadShardAccounts)(shardAccountsRef.beginParse());
  }
  cs.loadRef();
  let mcStateExtra = cs.loadBit();
  let extras = null;
  if (mcStateExtra) {
    let cell = cs.loadRef();
    if (!cell.isExotic) {
      extras = (0, MasterchainStateExtra_1.loadMasterchainStateExtra)(cell.beginParse());
    }
  }
  return {
    globalId,
    shardId,
    seqno,
    vertSeqNo,
    genUtime,
    genLt,
    minRefMcSeqno,
    beforeSplit,
    accounts,
    extras
  };
}
ShardStateUnsplit.loadShardStateUnsplit = loadShardStateUnsplit;
var SplitMergeInfo = {};
Object.defineProperty(SplitMergeInfo, "__esModule", { value: true });
SplitMergeInfo.storeSplitMergeInfo = SplitMergeInfo.loadSplitMergeInfo = void 0;
function loadSplitMergeInfo(slice) {
  let currentShardPrefixLength = slice.loadUint(6);
  let accountSplitDepth = slice.loadUint(6);
  let thisAddress = slice.loadUintBig(256);
  let siblingAddress = slice.loadUintBig(256);
  return {
    currentShardPrefixLength,
    accountSplitDepth,
    thisAddress,
    siblingAddress
  };
}
SplitMergeInfo.loadSplitMergeInfo = loadSplitMergeInfo;
function storeSplitMergeInfo(src2) {
  return (builder2) => {
    builder2.storeUint(src2.currentShardPrefixLength, 6);
    builder2.storeUint(src2.accountSplitDepth, 6);
    builder2.storeUint(src2.thisAddress, 256);
    builder2.storeUint(src2.siblingAddress, 256);
  };
}
SplitMergeInfo.storeSplitMergeInfo = storeSplitMergeInfo;
var StorageUsedShort = {};
Object.defineProperty(StorageUsedShort, "__esModule", { value: true });
StorageUsedShort.storeStorageUsedShort = StorageUsedShort.loadStorageUsedShort = void 0;
function loadStorageUsedShort(slice) {
  let cells = slice.loadVarUintBig(3);
  let bits = slice.loadVarUintBig(3);
  return {
    cells,
    bits
  };
}
StorageUsedShort.loadStorageUsedShort = loadStorageUsedShort;
function storeStorageUsedShort(src2) {
  return (builder2) => {
    builder2.storeVarUint(src2.cells, 3);
    builder2.storeVarUint(src2.bits, 3);
  };
}
StorageUsedShort.storeStorageUsedShort = storeStorageUsedShort;
var Transaction = {};
var TransactionDescription = {};
var TransactionActionPhase = {};
Object.defineProperty(TransactionActionPhase, "__esModule", { value: true });
TransactionActionPhase.storeTransactionActionPhase = TransactionActionPhase.loadTransactionActionPhase = void 0;
const AccountStatusChange_1$1 = AccountStatusChange;
const StorageUsedShort_1$1 = StorageUsedShort;
function loadTransactionActionPhase(slice) {
  let success2 = slice.loadBit();
  let valid = slice.loadBit();
  let noFunds = slice.loadBit();
  let statusChange = (0, AccountStatusChange_1$1.loadAccountStatusChange)(slice);
  let totalFwdFees = slice.loadBit() ? slice.loadCoins() : void 0;
  let totalActionFees = slice.loadBit() ? slice.loadCoins() : void 0;
  let resultCode = slice.loadInt(32);
  let resultArg = slice.loadBit() ? slice.loadInt(32) : void 0;
  let totalActions = slice.loadUint(16);
  let specActions = slice.loadUint(16);
  let skippedActions = slice.loadUint(16);
  let messagesCreated = slice.loadUint(16);
  let actionListHash = slice.loadUintBig(256);
  let totalMessageSize = (0, StorageUsedShort_1$1.loadStorageUsedShort)(slice);
  return {
    success: success2,
    valid,
    noFunds,
    statusChange,
    totalFwdFees,
    totalActionFees,
    resultCode,
    resultArg,
    totalActions,
    specActions,
    skippedActions,
    messagesCreated,
    actionListHash,
    totalMessageSize
  };
}
TransactionActionPhase.loadTransactionActionPhase = loadTransactionActionPhase;
function storeTransactionActionPhase(src2) {
  return (builder2) => {
    builder2.storeBit(src2.success);
    builder2.storeBit(src2.valid);
    builder2.storeBit(src2.noFunds);
    builder2.store((0, AccountStatusChange_1$1.storeAccountStatusChange)(src2.statusChange));
    builder2.storeMaybeCoins(src2.totalFwdFees);
    builder2.storeMaybeCoins(src2.totalActionFees);
    builder2.storeInt(src2.resultCode, 32);
    builder2.storeMaybeInt(src2.resultArg, 32);
    builder2.storeUint(src2.totalActions, 16);
    builder2.storeUint(src2.specActions, 16);
    builder2.storeUint(src2.skippedActions, 16);
    builder2.storeUint(src2.messagesCreated, 16);
    builder2.storeUint(src2.actionListHash, 256);
    builder2.store((0, StorageUsedShort_1$1.storeStorageUsedShort)(src2.totalMessageSize));
  };
}
TransactionActionPhase.storeTransactionActionPhase = storeTransactionActionPhase;
var TransactionBouncePhase = {};
Object.defineProperty(TransactionBouncePhase, "__esModule", { value: true });
TransactionBouncePhase.storeTransactionBouncePhase = TransactionBouncePhase.loadTransactionBouncePhase = void 0;
const StorageUsedShort_1 = StorageUsedShort;
function loadTransactionBouncePhase(slice) {
  if (slice.loadBit()) {
    let messageSize = (0, StorageUsedShort_1.loadStorageUsedShort)(slice);
    let messageFees = slice.loadCoins();
    let forwardFees = slice.loadCoins();
    return {
      type: "ok",
      messageSize,
      messageFees,
      forwardFees
    };
  }
  if (slice.loadBit()) {
    let messageSize = (0, StorageUsedShort_1.loadStorageUsedShort)(slice);
    let requiredForwardFees = slice.loadCoins();
    return {
      type: "no-funds",
      messageSize,
      requiredForwardFees
    };
  }
  return {
    type: "negative-funds"
  };
}
TransactionBouncePhase.loadTransactionBouncePhase = loadTransactionBouncePhase;
function storeTransactionBouncePhase(src2) {
  return (builder2) => {
    if (src2.type === "ok") {
      builder2.storeBit(true);
      builder2.store((0, StorageUsedShort_1.storeStorageUsedShort)(src2.messageSize));
      builder2.storeCoins(src2.messageFees);
      builder2.storeCoins(src2.forwardFees);
    } else if (src2.type === "negative-funds") {
      builder2.storeBit(false);
      builder2.storeBit(false);
    } else if (src2.type === "no-funds") {
      builder2.storeBit(false);
      builder2.storeBit(true);
      builder2.store((0, StorageUsedShort_1.storeStorageUsedShort)(src2.messageSize));
      builder2.storeCoins(src2.requiredForwardFees);
    } else {
      throw new Error("Invalid TransactionBouncePhase type");
    }
  };
}
TransactionBouncePhase.storeTransactionBouncePhase = storeTransactionBouncePhase;
var TransactionComputePhase = {};
Object.defineProperty(TransactionComputePhase, "__esModule", { value: true });
TransactionComputePhase.storeTransactionComputePhase = TransactionComputePhase.loadTransactionComputePhase = void 0;
const Builder_1 = requireBuilder();
const ComputeSkipReason_1 = ComputeSkipReason;
function loadTransactionComputePhase(slice) {
  if (!slice.loadBit()) {
    let reason = (0, ComputeSkipReason_1.loadComputeSkipReason)(slice);
    return {
      type: "skipped",
      reason
    };
  }
  let success2 = slice.loadBit();
  let messageStateUsed = slice.loadBit();
  let accountActivated = slice.loadBit();
  let gasFees = slice.loadCoins();
  const vmState = slice.loadRef().beginParse();
  let gasUsed = vmState.loadVarUintBig(3);
  let gasLimit = vmState.loadVarUintBig(3);
  let gasCredit = vmState.loadBit() ? vmState.loadVarUintBig(2) : void 0;
  let mode = vmState.loadUint(8);
  let exitCode = vmState.loadUint(32);
  let exitArg = vmState.loadBit() ? vmState.loadInt(32) : void 0;
  let vmSteps = vmState.loadUint(32);
  let vmInitStateHash = vmState.loadUintBig(256);
  let vmFinalStateHash = vmState.loadUintBig(256);
  return {
    type: "vm",
    success: success2,
    messageStateUsed,
    accountActivated,
    gasFees,
    gasUsed,
    gasLimit,
    gasCredit,
    mode,
    exitCode,
    exitArg,
    vmSteps,
    vmInitStateHash,
    vmFinalStateHash
  };
}
TransactionComputePhase.loadTransactionComputePhase = loadTransactionComputePhase;
function storeTransactionComputePhase(src2) {
  return (builder2) => {
    if (src2.type === "skipped") {
      builder2.storeBit(0);
      builder2.store((0, ComputeSkipReason_1.storeComputeSkipReason)(src2.reason));
      return;
    }
    builder2.storeBit(1);
    builder2.storeBit(src2.success);
    builder2.storeBit(src2.messageStateUsed);
    builder2.storeBit(src2.accountActivated);
    builder2.storeCoins(src2.gasFees);
    builder2.storeRef((0, Builder_1.beginCell)().storeVarUint(src2.gasUsed, 3).storeVarUint(src2.gasLimit, 3).store((b) => src2.gasCredit !== void 0 && src2.gasCredit !== null ? b.storeBit(1).storeVarUint(src2.gasCredit, 2) : b.storeBit(0)).storeUint(src2.mode, 8).storeUint(src2.exitCode, 32).store((b) => src2.exitArg !== void 0 && src2.exitArg !== null ? b.storeBit(1).storeInt(src2.exitArg, 32) : b.storeBit(0)).storeUint(src2.vmSteps, 32).storeUint(src2.vmInitStateHash, 256).storeUint(src2.vmFinalStateHash, 256).endCell());
  };
}
TransactionComputePhase.storeTransactionComputePhase = storeTransactionComputePhase;
var TransactionCreditPhase = {};
Object.defineProperty(TransactionCreditPhase, "__esModule", { value: true });
TransactionCreditPhase.storeTransactionCreditPhase = TransactionCreditPhase.loadTransactionCreditPhase = void 0;
const CurrencyCollection_1 = CurrencyCollection;
function loadTransactionCreditPhase(slice) {
  const dueFeesColelcted = slice.loadBit() ? slice.loadCoins() : void 0;
  const credit = (0, CurrencyCollection_1.loadCurrencyCollection)(slice);
  return {
    dueFeesColelcted,
    credit
  };
}
TransactionCreditPhase.loadTransactionCreditPhase = loadTransactionCreditPhase;
function storeTransactionCreditPhase(src2) {
  return (builder2) => {
    if (src2.dueFeesColelcted === null || src2.dueFeesColelcted === void 0) {
      builder2.storeBit(false);
    } else {
      builder2.storeBit(true);
      builder2.storeCoins(src2.dueFeesColelcted);
    }
    builder2.store((0, CurrencyCollection_1.storeCurrencyCollection)(src2.credit));
  };
}
TransactionCreditPhase.storeTransactionCreditPhase = storeTransactionCreditPhase;
var TransactionStoragePhase = {};
Object.defineProperty(TransactionStoragePhase, "__esModule", { value: true });
TransactionStoragePhase.storeTransactionsStoragePhase = TransactionStoragePhase.loadTransactionStoragePhase = void 0;
const AccountStatusChange_1 = AccountStatusChange;
function loadTransactionStoragePhase(slice) {
  const storageFeesCollected = slice.loadCoins();
  let storageFeesDue = void 0;
  if (slice.loadBit()) {
    storageFeesDue = slice.loadCoins();
  }
  const statusChange = (0, AccountStatusChange_1.loadAccountStatusChange)(slice);
  return {
    storageFeesCollected,
    storageFeesDue,
    statusChange
  };
}
TransactionStoragePhase.loadTransactionStoragePhase = loadTransactionStoragePhase;
function storeTransactionsStoragePhase(src2) {
  return (builder2) => {
    builder2.storeCoins(src2.storageFeesCollected);
    if (src2.storageFeesDue === null || src2.storageFeesDue === void 0) {
      builder2.storeBit(false);
    } else {
      builder2.storeBit(true);
      builder2.storeCoins(src2.storageFeesDue);
    }
    builder2.store((0, AccountStatusChange_1.storeAccountStatusChange)(src2.statusChange));
  };
}
TransactionStoragePhase.storeTransactionsStoragePhase = storeTransactionsStoragePhase;
var hasRequiredTransactionDescription;
function requireTransactionDescription() {
  if (hasRequiredTransactionDescription)
    return TransactionDescription;
  hasRequiredTransactionDescription = 1;
  Object.defineProperty(TransactionDescription, "__esModule", { value: true });
  TransactionDescription.storeTransactionDescription = TransactionDescription.loadTransactionDescription = void 0;
  const Builder_12 = requireBuilder();
  const SplitMergeInfo_1 = SplitMergeInfo;
  const Transaction_1 = requireTransaction();
  const TransactionActionPhase_1 = TransactionActionPhase;
  const TransactionBouncePhase_1 = TransactionBouncePhase;
  const TransactionComputePhase_1 = TransactionComputePhase;
  const TransactionCreditPhase_1 = TransactionCreditPhase;
  const TransactionStoragePhase_1 = TransactionStoragePhase;
  function loadTransactionDescription(slice) {
    let type2 = slice.loadUint(4);
    if (type2 === 0) {
      const creditFirst = slice.loadBit();
      let storagePhase = void 0;
      if (slice.loadBit()) {
        storagePhase = (0, TransactionStoragePhase_1.loadTransactionStoragePhase)(slice);
      }
      let creditPhase = void 0;
      if (slice.loadBit()) {
        creditPhase = (0, TransactionCreditPhase_1.loadTransactionCreditPhase)(slice);
      }
      let computePhase = (0, TransactionComputePhase_1.loadTransactionComputePhase)(slice);
      let actionPhase = void 0;
      if (slice.loadBit()) {
        actionPhase = (0, TransactionActionPhase_1.loadTransactionActionPhase)(slice.loadRef().beginParse());
      }
      let aborted = slice.loadBit();
      let bouncePhase = void 0;
      if (slice.loadBit()) {
        bouncePhase = (0, TransactionBouncePhase_1.loadTransactionBouncePhase)(slice);
      }
      const destroyed = slice.loadBit();
      return {
        type: "generic",
        creditFirst,
        storagePhase,
        creditPhase,
        computePhase,
        actionPhase,
        bouncePhase,
        aborted,
        destroyed
      };
    }
    if (type2 === 1) {
      return {
        type: "storage",
        storagePhase: (0, TransactionStoragePhase_1.loadTransactionStoragePhase)(slice)
      };
    }
    if (type2 === 2 || type2 === 3) {
      const isTock = type2 === 3;
      let storagePhase = (0, TransactionStoragePhase_1.loadTransactionStoragePhase)(slice);
      let computePhase = (0, TransactionComputePhase_1.loadTransactionComputePhase)(slice);
      let actionPhase = void 0;
      if (slice.loadBit()) {
        actionPhase = (0, TransactionActionPhase_1.loadTransactionActionPhase)(slice.loadRef().beginParse());
      }
      const aborted = slice.loadBit();
      const destroyed = slice.loadBit();
      return {
        type: "tick-tock",
        isTock,
        storagePhase,
        computePhase,
        actionPhase,
        aborted,
        destroyed
      };
    }
    if (type2 === 4) {
      let splitInfo = (0, SplitMergeInfo_1.loadSplitMergeInfo)(slice);
      let storagePhase = void 0;
      if (slice.loadBit()) {
        storagePhase = (0, TransactionStoragePhase_1.loadTransactionStoragePhase)(slice);
      }
      let computePhase = (0, TransactionComputePhase_1.loadTransactionComputePhase)(slice);
      let actionPhase = void 0;
      if (slice.loadBit()) {
        actionPhase = (0, TransactionActionPhase_1.loadTransactionActionPhase)(slice.loadRef().beginParse());
      }
      const aborted = slice.loadBit();
      const destroyed = slice.loadBit();
      return {
        type: "split-prepare",
        splitInfo,
        storagePhase,
        computePhase,
        actionPhase,
        aborted,
        destroyed
      };
    }
    if (type2 === 5) {
      let splitInfo = (0, SplitMergeInfo_1.loadSplitMergeInfo)(slice);
      let prepareTransaction = (0, Transaction_1.loadTransaction)(slice.loadRef().beginParse());
      const installed = slice.loadBit();
      return {
        type: "split-install",
        splitInfo,
        prepareTransaction,
        installed
      };
    }
    throw Error(`Unsupported transaction description type ${type2}`);
  }
  TransactionDescription.loadTransactionDescription = loadTransactionDescription;
  function storeTransactionDescription(src2) {
    return (builder2) => {
      if (src2.type === "generic") {
        builder2.storeUint(0, 4);
        builder2.storeBit(src2.creditFirst);
        if (src2.storagePhase) {
          builder2.storeBit(true);
          builder2.store((0, TransactionStoragePhase_1.storeTransactionsStoragePhase)(src2.storagePhase));
        } else {
          builder2.storeBit(false);
        }
        if (src2.creditPhase) {
          builder2.storeBit(true);
          builder2.store((0, TransactionCreditPhase_1.storeTransactionCreditPhase)(src2.creditPhase));
        } else {
          builder2.storeBit(false);
        }
        builder2.store((0, TransactionComputePhase_1.storeTransactionComputePhase)(src2.computePhase));
        if (src2.actionPhase) {
          builder2.storeBit(true);
          builder2.storeRef((0, Builder_12.beginCell)().store((0, TransactionActionPhase_1.storeTransactionActionPhase)(src2.actionPhase)));
        } else {
          builder2.storeBit(false);
        }
        builder2.storeBit(src2.aborted);
        if (src2.bouncePhase) {
          builder2.storeBit(true);
          builder2.store((0, TransactionBouncePhase_1.storeTransactionBouncePhase)(src2.bouncePhase));
        } else {
          builder2.storeBit(false);
        }
        builder2.storeBit(src2.destroyed);
      } else if (src2.type === "storage") {
        builder2.storeUint(1, 4);
        builder2.store((0, TransactionStoragePhase_1.storeTransactionsStoragePhase)(src2.storagePhase));
      } else if (src2.type === "tick-tock") {
        builder2.storeUint(src2.isTock ? 3 : 2, 4);
        builder2.store((0, TransactionStoragePhase_1.storeTransactionsStoragePhase)(src2.storagePhase));
        builder2.store((0, TransactionComputePhase_1.storeTransactionComputePhase)(src2.computePhase));
        if (src2.actionPhase) {
          builder2.storeBit(true);
          builder2.storeRef((0, Builder_12.beginCell)().store((0, TransactionActionPhase_1.storeTransactionActionPhase)(src2.actionPhase)));
        } else {
          builder2.storeBit(false);
        }
        builder2.storeBit(src2.aborted);
        builder2.storeBit(src2.destroyed);
      } else if (src2.type === "split-prepare") {
        builder2.storeUint(4, 4);
        builder2.store((0, SplitMergeInfo_1.storeSplitMergeInfo)(src2.splitInfo));
        if (src2.storagePhase) {
          builder2.storeBit(true);
          builder2.store((0, TransactionStoragePhase_1.storeTransactionsStoragePhase)(src2.storagePhase));
        } else {
          builder2.storeBit(false);
        }
        builder2.store((0, TransactionComputePhase_1.storeTransactionComputePhase)(src2.computePhase));
        if (src2.actionPhase) {
          builder2.storeBit(true);
          builder2.store((0, TransactionActionPhase_1.storeTransactionActionPhase)(src2.actionPhase));
        } else {
          builder2.storeBit(false);
        }
        builder2.storeBit(src2.aborted);
        builder2.storeBit(src2.destroyed);
      } else if (src2.type === "split-install") {
        builder2.storeUint(5, 4);
        builder2.store((0, SplitMergeInfo_1.storeSplitMergeInfo)(src2.splitInfo));
        builder2.storeRef((0, Builder_12.beginCell)().store((0, Transaction_1.storeTransaction)(src2.prepareTransaction)));
        builder2.storeBit(src2.installed);
      } else {
        throw Error(`Unsupported transaction description type ${src2.type}`);
      }
    };
  }
  TransactionDescription.storeTransactionDescription = storeTransactionDescription;
  return TransactionDescription;
}
var hasRequiredTransaction;
function requireTransaction() {
  if (hasRequiredTransaction)
    return Transaction;
  hasRequiredTransaction = 1;
  Object.defineProperty(Transaction, "__esModule", { value: true });
  Transaction.storeTransaction = Transaction.loadTransaction = void 0;
  const Builder_12 = requireBuilder();
  const Dictionary_12 = requireDictionary();
  const AccountStatus_1 = AccountStatus;
  const CurrencyCollection_12 = CurrencyCollection;
  const HashUpdate_1 = HashUpdate;
  const Message_1 = Message;
  const TransactionDescription_1 = requireTransactionDescription();
  function loadTransaction(slice) {
    if (slice.loadUint(4) !== 7) {
      throw Error("Invalid data");
    }
    let address = slice.loadUintBig(256);
    let lt = slice.loadUintBig(64);
    let prevTransactionHash = slice.loadUintBig(256);
    let prevTransactionLt = slice.loadUintBig(64);
    let now = slice.loadUint(32);
    let outMessagesCount = slice.loadUint(15);
    let oldStatus = (0, AccountStatus_1.loadAccountStatus)(slice);
    let endStatus = (0, AccountStatus_1.loadAccountStatus)(slice);
    let msgRef = slice.loadRef();
    let msgSlice = msgRef.beginParse();
    let inMessage = msgSlice.loadBit() ? (0, Message_1.loadMessage)(msgSlice.loadRef().beginParse()) : void 0;
    let outMessages = msgSlice.loadDict(Dictionary_12.Dictionary.Keys.Uint(15), Message_1.MessageValue);
    msgSlice.endParse();
    let totalFees = (0, CurrencyCollection_12.loadCurrencyCollection)(slice);
    let stateUpdate = (0, HashUpdate_1.loadHashUpdate)(slice.loadRef().beginParse());
    let description = (0, TransactionDescription_1.loadTransactionDescription)(slice.loadRef().beginParse());
    return {
      address,
      lt,
      prevTransactionHash,
      prevTransactionLt,
      now,
      outMessagesCount,
      oldStatus,
      endStatus,
      inMessage,
      outMessages,
      totalFees,
      stateUpdate,
      description
    };
  }
  Transaction.loadTransaction = loadTransaction;
  function storeTransaction(src2) {
    return (builder2) => {
      builder2.storeUint(7, 4);
      builder2.storeUint(src2.address, 256);
      builder2.storeUint(src2.lt, 64);
      builder2.storeUint(src2.prevTransactionHash, 256);
      builder2.storeUint(src2.prevTransactionLt, 64);
      builder2.storeUint(src2.now, 32);
      builder2.storeUint(src2.outMessagesCount, 15);
      builder2.store((0, AccountStatus_1.storeAccountStatus)(src2.oldStatus));
      builder2.store((0, AccountStatus_1.storeAccountStatus)(src2.endStatus));
      let msgBuilder = (0, Builder_12.beginCell)();
      if (src2.inMessage) {
        msgBuilder.storeBit(true);
        msgBuilder.storeRef((0, Builder_12.beginCell)().store((0, Message_1.storeMessage)(src2.inMessage)));
      } else {
        msgBuilder.storeBit(false);
      }
      msgBuilder.storeDict(src2.outMessages);
      builder2.storeRef(msgBuilder);
      builder2.store((0, CurrencyCollection_12.storeCurrencyCollection)(src2.totalFees));
      builder2.storeRef((0, Builder_12.beginCell)().store((0, HashUpdate_1.storeHashUpdate)(src2.stateUpdate)));
      builder2.storeRef((0, Builder_12.beginCell)().store((0, TransactionDescription_1.storeTransactionDescription)(src2.description)));
    };
  }
  Transaction.storeTransaction = storeTransaction;
  return Transaction;
}
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.loadStorageUsedShort = exports.storeStorageUsed = exports.loadStorageUsed = exports.storeStorageInfo = exports.loadStorageInfo = exports.storeStateInit = exports.loadStateInit = exports.storeSplitMergeInfo = exports.loadSplitMergeInfo = exports.storeSimpleLibrary = exports.loadSimpleLibrary = exports.loadShardStateUnsplit = exports.storeShardIdent = exports.loadShardIdent = exports.storeShardAccounts = exports.loadShardAccounts = exports.ShardAccountRefValue = exports.storeShardAccount = exports.loadShardAccount = exports.SendMode = exports.storeMessageRelaxed = exports.loadMessageRelaxed = exports.storeMessage = exports.loadMessage = exports.loadMasterchainStateExtra = exports.storeHashUpdate = exports.loadHashUpdate = exports.storeDepthBalanceInfo = exports.loadDepthBalanceInfo = exports.storeCurrencyCollection = exports.loadCurrencyCollection = exports.storeComputeSkipReason = exports.loadComputeSkipReason = exports.storeCommonMessageInfoRelaxed = exports.loadCommonMessageInfoRelaxed = exports.storeCommonMessageInfo = exports.loadCommonMessageInfo = exports.storeAccountStorage = exports.loadAccountStorage = exports.storeAccountStatusChange = exports.loadAccountStatusChange = exports.storeAccountStatus = exports.loadAccountStatus = exports.storeAccountState = exports.loadAccountState = exports.storeAccount = exports.loadAccount = exports.comment = exports.external = exports.internal = void 0;
  exports.storeTransactionsStoragePhase = exports.loadTransactionStoragePhase = exports.storeTransactionDescription = exports.loadTransactionDescription = exports.storeTransactionCreditPhase = exports.loadTransactionCreditPhase = exports.storeTransactionComputePhase = exports.loadTransactionComputePhase = exports.storeTransactionBouncePhase = exports.loadTransactionBouncePhase = exports.storeTransactionActionPhase = exports.loadTransactionActionPhase = exports.storeTransaction = exports.loadTransaction = exports.storeTickTock = exports.loadTickTock = exports.storeStorageUsedShort = void 0;
  var _helpers_1 = _helpers;
  Object.defineProperty(exports, "internal", { enumerable: true, get: function() {
    return _helpers_1.internal;
  } });
  Object.defineProperty(exports, "external", { enumerable: true, get: function() {
    return _helpers_1.external;
  } });
  Object.defineProperty(exports, "comment", { enumerable: true, get: function() {
    return _helpers_1.comment;
  } });
  var Account_12 = Account;
  Object.defineProperty(exports, "loadAccount", { enumerable: true, get: function() {
    return Account_12.loadAccount;
  } });
  Object.defineProperty(exports, "storeAccount", { enumerable: true, get: function() {
    return Account_12.storeAccount;
  } });
  var AccountState_12 = AccountState;
  Object.defineProperty(exports, "loadAccountState", { enumerable: true, get: function() {
    return AccountState_12.loadAccountState;
  } });
  Object.defineProperty(exports, "storeAccountState", { enumerable: true, get: function() {
    return AccountState_12.storeAccountState;
  } });
  var AccountStatus_1 = AccountStatus;
  Object.defineProperty(exports, "loadAccountStatus", { enumerable: true, get: function() {
    return AccountStatus_1.loadAccountStatus;
  } });
  Object.defineProperty(exports, "storeAccountStatus", { enumerable: true, get: function() {
    return AccountStatus_1.storeAccountStatus;
  } });
  var AccountStatusChange_12 = AccountStatusChange;
  Object.defineProperty(exports, "loadAccountStatusChange", { enumerable: true, get: function() {
    return AccountStatusChange_12.loadAccountStatusChange;
  } });
  Object.defineProperty(exports, "storeAccountStatusChange", { enumerable: true, get: function() {
    return AccountStatusChange_12.storeAccountStatusChange;
  } });
  var AccountStorage_12 = AccountStorage;
  Object.defineProperty(exports, "loadAccountStorage", { enumerable: true, get: function() {
    return AccountStorage_12.loadAccountStorage;
  } });
  Object.defineProperty(exports, "storeAccountStorage", { enumerable: true, get: function() {
    return AccountStorage_12.storeAccountStorage;
  } });
  var CommonMessageInfo_12 = CommonMessageInfo;
  Object.defineProperty(exports, "loadCommonMessageInfo", { enumerable: true, get: function() {
    return CommonMessageInfo_12.loadCommonMessageInfo;
  } });
  Object.defineProperty(exports, "storeCommonMessageInfo", { enumerable: true, get: function() {
    return CommonMessageInfo_12.storeCommonMessageInfo;
  } });
  var CommonMessageInfoRelaxed_12 = CommonMessageInfoRelaxed;
  Object.defineProperty(exports, "loadCommonMessageInfoRelaxed", { enumerable: true, get: function() {
    return CommonMessageInfoRelaxed_12.loadCommonMessageInfoRelaxed;
  } });
  Object.defineProperty(exports, "storeCommonMessageInfoRelaxed", { enumerable: true, get: function() {
    return CommonMessageInfoRelaxed_12.storeCommonMessageInfoRelaxed;
  } });
  var ComputeSkipReason_12 = ComputeSkipReason;
  Object.defineProperty(exports, "loadComputeSkipReason", { enumerable: true, get: function() {
    return ComputeSkipReason_12.loadComputeSkipReason;
  } });
  Object.defineProperty(exports, "storeComputeSkipReason", { enumerable: true, get: function() {
    return ComputeSkipReason_12.storeComputeSkipReason;
  } });
  var CurrencyCollection_12 = CurrencyCollection;
  Object.defineProperty(exports, "loadCurrencyCollection", { enumerable: true, get: function() {
    return CurrencyCollection_12.loadCurrencyCollection;
  } });
  Object.defineProperty(exports, "storeCurrencyCollection", { enumerable: true, get: function() {
    return CurrencyCollection_12.storeCurrencyCollection;
  } });
  var DepthBalanceInfo_1 = DepthBalanceInfo;
  Object.defineProperty(exports, "loadDepthBalanceInfo", { enumerable: true, get: function() {
    return DepthBalanceInfo_1.loadDepthBalanceInfo;
  } });
  Object.defineProperty(exports, "storeDepthBalanceInfo", { enumerable: true, get: function() {
    return DepthBalanceInfo_1.storeDepthBalanceInfo;
  } });
  var HashUpdate_1 = HashUpdate;
  Object.defineProperty(exports, "loadHashUpdate", { enumerable: true, get: function() {
    return HashUpdate_1.loadHashUpdate;
  } });
  Object.defineProperty(exports, "storeHashUpdate", { enumerable: true, get: function() {
    return HashUpdate_1.storeHashUpdate;
  } });
  var MasterchainStateExtra_12 = MasterchainStateExtra;
  Object.defineProperty(exports, "loadMasterchainStateExtra", { enumerable: true, get: function() {
    return MasterchainStateExtra_12.loadMasterchainStateExtra;
  } });
  var Message_1 = Message;
  Object.defineProperty(exports, "loadMessage", { enumerable: true, get: function() {
    return Message_1.loadMessage;
  } });
  Object.defineProperty(exports, "storeMessage", { enumerable: true, get: function() {
    return Message_1.storeMessage;
  } });
  var MessageRelaxed_1 = MessageRelaxed;
  Object.defineProperty(exports, "loadMessageRelaxed", { enumerable: true, get: function() {
    return MessageRelaxed_1.loadMessageRelaxed;
  } });
  Object.defineProperty(exports, "storeMessageRelaxed", { enumerable: true, get: function() {
    return MessageRelaxed_1.storeMessageRelaxed;
  } });
  var SendMode_1 = SendMode;
  Object.defineProperty(exports, "SendMode", { enumerable: true, get: function() {
    return SendMode_1.SendMode;
  } });
  var ShardAccount_1 = ShardAccount;
  Object.defineProperty(exports, "loadShardAccount", { enumerable: true, get: function() {
    return ShardAccount_1.loadShardAccount;
  } });
  Object.defineProperty(exports, "storeShardAccount", { enumerable: true, get: function() {
    return ShardAccount_1.storeShardAccount;
  } });
  var ShardAccounts_12 = ShardAccounts;
  Object.defineProperty(exports, "ShardAccountRefValue", { enumerable: true, get: function() {
    return ShardAccounts_12.ShardAccountRefValue;
  } });
  Object.defineProperty(exports, "loadShardAccounts", { enumerable: true, get: function() {
    return ShardAccounts_12.loadShardAccounts;
  } });
  Object.defineProperty(exports, "storeShardAccounts", { enumerable: true, get: function() {
    return ShardAccounts_12.storeShardAccounts;
  } });
  var ShardIdent_12 = ShardIdent;
  Object.defineProperty(exports, "loadShardIdent", { enumerable: true, get: function() {
    return ShardIdent_12.loadShardIdent;
  } });
  Object.defineProperty(exports, "storeShardIdent", { enumerable: true, get: function() {
    return ShardIdent_12.storeShardIdent;
  } });
  var ShardStateUnsplit_1 = ShardStateUnsplit;
  Object.defineProperty(exports, "loadShardStateUnsplit", { enumerable: true, get: function() {
    return ShardStateUnsplit_1.loadShardStateUnsplit;
  } });
  var SimpleLibrary_12 = SimpleLibrary;
  Object.defineProperty(exports, "loadSimpleLibrary", { enumerable: true, get: function() {
    return SimpleLibrary_12.loadSimpleLibrary;
  } });
  Object.defineProperty(exports, "storeSimpleLibrary", { enumerable: true, get: function() {
    return SimpleLibrary_12.storeSimpleLibrary;
  } });
  var SplitMergeInfo_1 = SplitMergeInfo;
  Object.defineProperty(exports, "loadSplitMergeInfo", { enumerable: true, get: function() {
    return SplitMergeInfo_1.loadSplitMergeInfo;
  } });
  Object.defineProperty(exports, "storeSplitMergeInfo", { enumerable: true, get: function() {
    return SplitMergeInfo_1.storeSplitMergeInfo;
  } });
  var StateInit_12 = StateInit;
  Object.defineProperty(exports, "loadStateInit", { enumerable: true, get: function() {
    return StateInit_12.loadStateInit;
  } });
  Object.defineProperty(exports, "storeStateInit", { enumerable: true, get: function() {
    return StateInit_12.storeStateInit;
  } });
  var StorageInto_12 = StorageInto;
  Object.defineProperty(exports, "loadStorageInfo", { enumerable: true, get: function() {
    return StorageInto_12.loadStorageInfo;
  } });
  Object.defineProperty(exports, "storeStorageInfo", { enumerable: true, get: function() {
    return StorageInto_12.storeStorageInfo;
  } });
  var StorageUsed_12 = StorageUsed;
  Object.defineProperty(exports, "loadStorageUsed", { enumerable: true, get: function() {
    return StorageUsed_12.loadStorageUsed;
  } });
  Object.defineProperty(exports, "storeStorageUsed", { enumerable: true, get: function() {
    return StorageUsed_12.storeStorageUsed;
  } });
  var StorageUsedShort_12 = StorageUsedShort;
  Object.defineProperty(exports, "loadStorageUsedShort", { enumerable: true, get: function() {
    return StorageUsedShort_12.loadStorageUsedShort;
  } });
  Object.defineProperty(exports, "storeStorageUsedShort", { enumerable: true, get: function() {
    return StorageUsedShort_12.storeStorageUsedShort;
  } });
  var TickTock_12 = TickTock;
  Object.defineProperty(exports, "loadTickTock", { enumerable: true, get: function() {
    return TickTock_12.loadTickTock;
  } });
  Object.defineProperty(exports, "storeTickTock", { enumerable: true, get: function() {
    return TickTock_12.storeTickTock;
  } });
  var Transaction_1 = requireTransaction();
  Object.defineProperty(exports, "loadTransaction", { enumerable: true, get: function() {
    return Transaction_1.loadTransaction;
  } });
  Object.defineProperty(exports, "storeTransaction", { enumerable: true, get: function() {
    return Transaction_1.storeTransaction;
  } });
  var TransactionActionPhase_1 = TransactionActionPhase;
  Object.defineProperty(exports, "loadTransactionActionPhase", { enumerable: true, get: function() {
    return TransactionActionPhase_1.loadTransactionActionPhase;
  } });
  Object.defineProperty(exports, "storeTransactionActionPhase", { enumerable: true, get: function() {
    return TransactionActionPhase_1.storeTransactionActionPhase;
  } });
  var TransactionBouncePhase_1 = TransactionBouncePhase;
  Object.defineProperty(exports, "loadTransactionBouncePhase", { enumerable: true, get: function() {
    return TransactionBouncePhase_1.loadTransactionBouncePhase;
  } });
  Object.defineProperty(exports, "storeTransactionBouncePhase", { enumerable: true, get: function() {
    return TransactionBouncePhase_1.storeTransactionBouncePhase;
  } });
  var TransactionComputePhase_1 = TransactionComputePhase;
  Object.defineProperty(exports, "loadTransactionComputePhase", { enumerable: true, get: function() {
    return TransactionComputePhase_1.loadTransactionComputePhase;
  } });
  Object.defineProperty(exports, "storeTransactionComputePhase", { enumerable: true, get: function() {
    return TransactionComputePhase_1.storeTransactionComputePhase;
  } });
  var TransactionCreditPhase_1 = TransactionCreditPhase;
  Object.defineProperty(exports, "loadTransactionCreditPhase", { enumerable: true, get: function() {
    return TransactionCreditPhase_1.loadTransactionCreditPhase;
  } });
  Object.defineProperty(exports, "storeTransactionCreditPhase", { enumerable: true, get: function() {
    return TransactionCreditPhase_1.storeTransactionCreditPhase;
  } });
  var TransactionDescription_1 = requireTransactionDescription();
  Object.defineProperty(exports, "loadTransactionDescription", { enumerable: true, get: function() {
    return TransactionDescription_1.loadTransactionDescription;
  } });
  Object.defineProperty(exports, "storeTransactionDescription", { enumerable: true, get: function() {
    return TransactionDescription_1.storeTransactionDescription;
  } });
  var TransactionStoragePhase_1 = TransactionStoragePhase;
  Object.defineProperty(exports, "loadTransactionStoragePhase", { enumerable: true, get: function() {
    return TransactionStoragePhase_1.loadTransactionStoragePhase;
  } });
  Object.defineProperty(exports, "storeTransactionsStoragePhase", { enumerable: true, get: function() {
    return TransactionStoragePhase_1.storeTransactionsStoragePhase;
  } });
})(_export);
var openContract$1 = {};
Object.defineProperty(openContract$1, "__esModule", { value: true });
openContract$1.openContract = void 0;
const Address_1 = Address$1;
const Cell_1 = requireCell();
function openContract(src2, factory) {
  let address;
  let init2 = null;
  if (!Address_1.Address.isAddress(src2.address)) {
    throw Error("Invalid address");
  }
  address = src2.address;
  if (src2.init) {
    if (!(src2.init.code instanceof Cell_1.Cell)) {
      throw Error("Invalid init.code");
    }
    if (!(src2.init.data instanceof Cell_1.Cell)) {
      throw Error("Invalid init.data");
    }
    init2 = src2.init;
  }
  let executor = factory({ address, init: init2 });
  return new Proxy(src2, {
    get(target, prop) {
      const value = target[prop];
      if (typeof prop === "string" && (prop.startsWith("get") || prop.startsWith("send"))) {
        if (typeof value === "function") {
          return (...args) => value.apply(target, [executor, ...args]);
        }
      }
      return value;
    }
  });
}
openContract$1.openContract = openContract;
var ComputeError$1 = {};
Object.defineProperty(ComputeError$1, "__esModule", { value: true });
ComputeError$1.ComputeError = void 0;
class ComputeError extends Error {
  constructor(message2, exitCode, opts) {
    super(message2);
    this.exitCode = exitCode;
    this.debugLogs = opts && opts.debugLogs ? opts.debugLogs : null;
    this.logs = opts && opts.logs ? opts.logs : null;
    Object.setPrototypeOf(this, ComputeError.prototype);
  }
}
ComputeError$1.ComputeError = ComputeError;
var getMethodId$1 = {};
Object.defineProperty(getMethodId$1, "__esModule", { value: true });
getMethodId$1.getMethodId = void 0;
const TABLE = new Int16Array([
  0,
  4129,
  8258,
  12387,
  16516,
  20645,
  24774,
  28903,
  33032,
  37161,
  41290,
  45419,
  49548,
  53677,
  57806,
  61935,
  4657,
  528,
  12915,
  8786,
  21173,
  17044,
  29431,
  25302,
  37689,
  33560,
  45947,
  41818,
  54205,
  50076,
  62463,
  58334,
  9314,
  13379,
  1056,
  5121,
  25830,
  29895,
  17572,
  21637,
  42346,
  46411,
  34088,
  38153,
  58862,
  62927,
  50604,
  54669,
  13907,
  9842,
  5649,
  1584,
  30423,
  26358,
  22165,
  18100,
  46939,
  42874,
  38681,
  34616,
  63455,
  59390,
  55197,
  51132,
  18628,
  22757,
  26758,
  30887,
  2112,
  6241,
  10242,
  14371,
  51660,
  55789,
  59790,
  63919,
  35144,
  39273,
  43274,
  47403,
  23285,
  19156,
  31415,
  27286,
  6769,
  2640,
  14899,
  10770,
  56317,
  52188,
  64447,
  60318,
  39801,
  35672,
  47931,
  43802,
  27814,
  31879,
  19684,
  23749,
  11298,
  15363,
  3168,
  7233,
  60846,
  64911,
  52716,
  56781,
  44330,
  48395,
  36200,
  40265,
  32407,
  28342,
  24277,
  20212,
  15891,
  11826,
  7761,
  3696,
  65439,
  61374,
  57309,
  53244,
  48923,
  44858,
  40793,
  36728,
  37256,
  33193,
  45514,
  41451,
  53516,
  49453,
  61774,
  57711,
  4224,
  161,
  12482,
  8419,
  20484,
  16421,
  28742,
  24679,
  33721,
  37784,
  41979,
  46042,
  49981,
  54044,
  58239,
  62302,
  689,
  4752,
  8947,
  13010,
  16949,
  21012,
  25207,
  29270,
  46570,
  42443,
  38312,
  34185,
  62830,
  58703,
  54572,
  50445,
  13538,
  9411,
  5280,
  1153,
  29798,
  25671,
  21540,
  17413,
  42971,
  47098,
  34713,
  38840,
  59231,
  63358,
  50973,
  55100,
  9939,
  14066,
  1681,
  5808,
  26199,
  30326,
  17941,
  22068,
  55628,
  51565,
  63758,
  59695,
  39368,
  35305,
  47498,
  43435,
  22596,
  18533,
  30726,
  26663,
  6336,
  2273,
  14466,
  10403,
  52093,
  56156,
  60223,
  64286,
  35833,
  39896,
  43963,
  48026,
  19061,
  23124,
  27191,
  31254,
  2801,
  6864,
  10931,
  14994,
  64814,
  60687,
  56684,
  52557,
  48554,
  44427,
  40424,
  36297,
  31782,
  27655,
  23652,
  19525,
  15522,
  11395,
  7392,
  3265,
  61215,
  65342,
  53085,
  57212,
  44955,
  49082,
  36825,
  40952,
  28183,
  32310,
  20053,
  24180,
  11923,
  16050,
  3793,
  7920
]);
function crc16(data2) {
  if (!(data2 instanceof Buffer)) {
    data2 = Buffer.from(data2);
  }
  let crc = 0;
  for (let index = 0; index < data2.length; index++) {
    const byte = data2[index];
    crc = (TABLE[(crc >> 8 ^ byte) & 255] ^ crc << 8) & 65535;
  }
  return crc;
}
function getMethodId(name2) {
  return crc16(name2) & 65535 | 65536;
}
getMethodId$1.getMethodId = getMethodId;
var safeSign$1 = {};
Object.defineProperty(safeSign$1, "__esModule", { value: true });
safeSign$1.safeSignVerify = safeSign$1.safeSign = void 0;
const ton_crypto_1$1 = requireDist();
const MIN_SEED_LENGTH = 8;
const MAX_SEED_LENGTH = 64;
function createSafeSignHash(cell, seed) {
  let seedData = Buffer.from(seed);
  if (seedData.length > MAX_SEED_LENGTH) {
    throw Error("Seed can	 be longer than 64 bytes");
  }
  if (seedData.length < MIN_SEED_LENGTH) {
    throw Error("Seed must be at least 8 bytes");
  }
  return (0, ton_crypto_1$1.sha256_sync)(Buffer.concat([Buffer.from([255, 255]), seedData, cell.hash()]));
}
function safeSign(cell, secretKey, seed = "ton-safe-sign-magic") {
  return (0, ton_crypto_1$1.sign)(createSafeSignHash(cell, seed), secretKey);
}
safeSign$1.safeSign = safeSign;
function safeSignVerify(cell, signature, publicKey, seed = "ton-safe-sign-magic") {
  return (0, ton_crypto_1$1.signVerify)(createSafeSignHash(cell, seed), signature, publicKey);
}
safeSign$1.safeSignVerify = safeSignVerify;
(function(exports) {
  var __createBinding2 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding2(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.safeSignVerify = exports.safeSign = exports.getMethodId = exports.base32Encode = exports.base32Decode = exports.crc32c = exports.crc16 = exports.fromNano = exports.toNano = exports.ComputeError = exports.openContract = exports.TupleBuilder = exports.TupleReader = exports.serializeTuple = exports.parseTuple = exports.exoticPruned = exports.exoticMerkleUpdate = exports.exoticMerkleProof = exports.Dictionary = exports.Cell = exports.CellType = exports.Slice = exports.beginCell = exports.Builder = exports.BitBuilder = exports.BitReader = exports.BitString = exports.contractAddress = exports.ADNLAddress = exports.ExternalAddress = exports.Address = void 0;
  var Address_12 = Address$1;
  Object.defineProperty(exports, "Address", { enumerable: true, get: function() {
    return Address_12.Address;
  } });
  var ExternalAddress_12 = ExternalAddress$1;
  Object.defineProperty(exports, "ExternalAddress", { enumerable: true, get: function() {
    return ExternalAddress_12.ExternalAddress;
  } });
  var ADNLAddress_1 = ADNLAddress$1;
  Object.defineProperty(exports, "ADNLAddress", { enumerable: true, get: function() {
    return ADNLAddress_1.ADNLAddress;
  } });
  var contractAddress_1 = contractAddress$1;
  Object.defineProperty(exports, "contractAddress", { enumerable: true, get: function() {
    return contractAddress_1.contractAddress;
  } });
  var BitString_12 = requireBitString();
  Object.defineProperty(exports, "BitString", { enumerable: true, get: function() {
    return BitString_12.BitString;
  } });
  var BitReader_12 = BitReader$1;
  Object.defineProperty(exports, "BitReader", { enumerable: true, get: function() {
    return BitReader_12.BitReader;
  } });
  var BitBuilder_1 = requireBitBuilder();
  Object.defineProperty(exports, "BitBuilder", { enumerable: true, get: function() {
    return BitBuilder_1.BitBuilder;
  } });
  var Builder_12 = requireBuilder();
  Object.defineProperty(exports, "Builder", { enumerable: true, get: function() {
    return Builder_12.Builder;
  } });
  Object.defineProperty(exports, "beginCell", { enumerable: true, get: function() {
    return Builder_12.beginCell;
  } });
  var Slice_12 = requireSlice();
  Object.defineProperty(exports, "Slice", { enumerable: true, get: function() {
    return Slice_12.Slice;
  } });
  var CellType_12 = CellType;
  Object.defineProperty(exports, "CellType", { enumerable: true, get: function() {
    return CellType_12.CellType;
  } });
  var Cell_12 = requireCell();
  Object.defineProperty(exports, "Cell", { enumerable: true, get: function() {
    return Cell_12.Cell;
  } });
  var Dictionary_12 = requireDictionary();
  Object.defineProperty(exports, "Dictionary", { enumerable: true, get: function() {
    return Dictionary_12.Dictionary;
  } });
  var exoticMerkleProof_12 = exoticMerkleProof$1;
  Object.defineProperty(exports, "exoticMerkleProof", { enumerable: true, get: function() {
    return exoticMerkleProof_12.exoticMerkleProof;
  } });
  var exoticMerkleUpdate_12 = exoticMerkleUpdate$1;
  Object.defineProperty(exports, "exoticMerkleUpdate", { enumerable: true, get: function() {
    return exoticMerkleUpdate_12.exoticMerkleUpdate;
  } });
  var exoticPruned_12 = exoticPruned$1;
  Object.defineProperty(exports, "exoticPruned", { enumerable: true, get: function() {
    return exoticPruned_12.exoticPruned;
  } });
  var tuple_1 = tuple$1;
  Object.defineProperty(exports, "parseTuple", { enumerable: true, get: function() {
    return tuple_1.parseTuple;
  } });
  Object.defineProperty(exports, "serializeTuple", { enumerable: true, get: function() {
    return tuple_1.serializeTuple;
  } });
  var reader_1 = reader;
  Object.defineProperty(exports, "TupleReader", { enumerable: true, get: function() {
    return reader_1.TupleReader;
  } });
  var builder_1 = builder;
  Object.defineProperty(exports, "TupleBuilder", { enumerable: true, get: function() {
    return builder_1.TupleBuilder;
  } });
  __exportStar(_export, exports);
  var openContract_1 = openContract$1;
  Object.defineProperty(exports, "openContract", { enumerable: true, get: function() {
    return openContract_1.openContract;
  } });
  var ComputeError_1 = ComputeError$1;
  Object.defineProperty(exports, "ComputeError", { enumerable: true, get: function() {
    return ComputeError_1.ComputeError;
  } });
  var convert_12 = convert;
  Object.defineProperty(exports, "toNano", { enumerable: true, get: function() {
    return convert_12.toNano;
  } });
  Object.defineProperty(exports, "fromNano", { enumerable: true, get: function() {
    return convert_12.fromNano;
  } });
  var crc16_12 = crc16$2;
  Object.defineProperty(exports, "crc16", { enumerable: true, get: function() {
    return crc16_12.crc16;
  } });
  var crc32c_1 = crc32c$1;
  Object.defineProperty(exports, "crc32c", { enumerable: true, get: function() {
    return crc32c_1.crc32c;
  } });
  var base32_12 = base32;
  Object.defineProperty(exports, "base32Decode", { enumerable: true, get: function() {
    return base32_12.base32Decode;
  } });
  Object.defineProperty(exports, "base32Encode", { enumerable: true, get: function() {
    return base32_12.base32Encode;
  } });
  var getMethodId_1 = getMethodId$1;
  Object.defineProperty(exports, "getMethodId", { enumerable: true, get: function() {
    return getMethodId_1.getMethodId;
  } });
  var safeSign_1 = safeSign$1;
  Object.defineProperty(exports, "safeSign", { enumerable: true, get: function() {
    return safeSign_1.safeSign;
  } });
  Object.defineProperty(exports, "safeSignVerify", { enumerable: true, get: function() {
    return safeSign_1.safeSignVerify;
  } });
})(dist$1);
var HttpApi$1 = {};
function identity$1(a) {
  return a;
}
function constant(a) {
  return function() {
    return a;
  };
}
var constNull = /* @__PURE__ */ constant(null);
var constUndefined = /* @__PURE__ */ constant(void 0);
function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
  switch (arguments.length) {
    case 1:
      return ab;
    case 2:
      return function() {
        return bc(ab.apply(this, arguments));
      };
    case 3:
      return function() {
        return cd(bc(ab.apply(this, arguments)));
      };
    case 4:
      return function() {
        return de(cd(bc(ab.apply(this, arguments))));
      };
    case 5:
      return function() {
        return ef(de(cd(bc(ab.apply(this, arguments)))));
      };
    case 6:
      return function() {
        return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
      };
    case 7:
      return function() {
        return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
      };
    case 8:
      return function() {
        return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
      };
    case 9:
      return function() {
        return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
      };
  }
  return;
}
function pipe$1(a, ab, bc, cd, de, ef, fg, gh, hi) {
  switch (arguments.length) {
    case 1:
      return a;
    case 2:
      return ab(a);
    case 3:
      return bc(ab(a));
    case 4:
      return cd(bc(ab(a)));
    case 5:
      return de(cd(bc(ab(a))));
    case 6:
      return ef(de(cd(bc(ab(a)))));
    case 7:
      return fg(ef(de(cd(bc(ab(a))))));
    case 8:
      return gh(fg(ef(de(cd(bc(ab(a)))))));
    case 9:
      return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
    default: {
      var ret = arguments[0];
      for (var i = 1; i < arguments.length; i++) {
        ret = arguments[i](ret);
      }
      return ret;
    }
  }
}
var SK = function(_2, b) {
  return b;
};
var __spreadArray$5 = globalThis && globalThis.__spreadArray || function(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var isNone$2 = function(fa) {
  return fa._tag === "None";
};
var isSome$2 = function(fa) {
  return fa._tag === "Some";
};
var none$1 = { _tag: "None" };
var some$5 = function(a) {
  return { _tag: "Some", value: a };
};
var isLeft$2 = function(ma) {
  return ma._tag === "Left";
};
var isRight$2 = function(ma) {
  return ma._tag === "Right";
};
var left$2 = function(e) {
  return { _tag: "Left", left: e };
};
var right$2 = function(a) {
  return { _tag: "Right", right: a };
};
var isNonEmpty$6 = function(as) {
  return as.length > 0;
};
var head$5 = function(as) {
  return as[0];
};
var tail$4 = function(as) {
  return as.slice(1);
};
var emptyReadonlyArray = [];
var emptyRecord = {};
var has$2 = Object.prototype.hasOwnProperty;
var fromReadonlyNonEmptyArray$2 = function(as) {
  return __spreadArray$5([as[0]], as.slice(1), true);
};
function apFirst$5(A) {
  return function(second) {
    return function(first2) {
      return A.ap(A.map(first2, function(a) {
        return function() {
          return a;
        };
      }), second);
    };
  };
}
function apSecond$5(A) {
  return function(second) {
    return function(first2) {
      return A.ap(A.map(first2, function() {
        return function(b) {
          return b;
        };
      }), second);
    };
  };
}
function apS$5(F) {
  return function(name2, fb) {
    return function(fa) {
      return F.ap(F.map(fa, function(a) {
        return function(b) {
          var _a2;
          return Object.assign({}, a, (_a2 = {}, _a2[name2] = b, _a2));
        };
      }), fb);
    };
  };
}
function getApplySemigroup$3(F) {
  return function(S) {
    return {
      concat: function(first2, second) {
        return F.ap(F.map(first2, function(x) {
          return function(y) {
            return S.concat(x, y);
          };
        }), second);
      }
    };
  };
}
function flap$6(F) {
  return function(a) {
    return function(fab) {
      return F.map(fab, function(f) {
        return f(a);
      });
    };
  };
}
function bindTo$5(F) {
  return function(name2) {
    return function(fa) {
      return F.map(fa, function(a) {
        var _a2;
        return _a2 = {}, _a2[name2] = a, _a2;
      });
    };
  };
}
function let_$5(F) {
  return function(name2, f) {
    return function(fa) {
      return F.map(fa, function(a) {
        var _a2;
        return Object.assign({}, a, (_a2 = {}, _a2[name2] = f(a), _a2));
      });
    };
  };
}
function getApplicativeMonoid$1(F) {
  var f = getApplySemigroup$3(F);
  return function(M) {
    return {
      concat: f(M).concat,
      empty: F.of(M.empty)
    };
  };
}
function chainFirst$5(M) {
  return function(f) {
    return function(first2) {
      return M.chain(first2, function(a) {
        return M.map(f(a), function() {
          return a;
        });
      });
    };
  };
}
function bind$8(M) {
  return function(name2, f) {
    return function(ma) {
      return M.chain(ma, function(a) {
        return M.map(f(a), function(b) {
          var _a2;
          return Object.assign({}, a, (_a2 = {}, _a2[name2] = b, _a2));
        });
      });
    };
  };
}
var tailRec$1 = function(startWith, f) {
  var ab = f(startWith);
  while (ab._tag === "Left") {
    ab = f(ab.left);
  }
  return ab.right;
};
function fromOption$3(F) {
  return function(onNone) {
    return function(ma) {
      return F.fromEither(isNone$2(ma) ? left$2(onNone()) : right$2(ma.value));
    };
  };
}
function fromPredicate$4(F) {
  return function(predicate, onFalse) {
    return function(a) {
      return F.fromEither(predicate(a) ? right$2(a) : left$2(onFalse(a)));
    };
  };
}
function fromOptionK$3(F) {
  var fromOptionF = fromOption$3(F);
  return function(onNone) {
    var from = fromOptionF(onNone);
    return function(f) {
      return flow(f, from);
    };
  };
}
function chainOptionK$2(F, M) {
  var fromOptionKF = fromOptionK$3(F);
  return function(onNone) {
    var from = fromOptionKF(onNone);
    return function(f) {
      return function(ma) {
        return M.chain(ma, from(f));
      };
    };
  };
}
function fromEitherK$3(F) {
  return function(f) {
    return flow(f, F.fromEither);
  };
}
function chainEitherK$2(F, M) {
  var fromEitherKF = fromEitherK$3(F);
  return function(f) {
    return function(ma) {
      return M.chain(ma, fromEitherKF(f));
    };
  };
}
function chainFirstEitherK$2(F, M) {
  return flow(fromEitherK$3(F), chainFirst$5(M));
}
function filterOrElse$2(F, M) {
  return function(predicate, onFalse) {
    return function(ma) {
      return M.chain(ma, function(a) {
        return F.fromEither(predicate(a) ? right$2(a) : left$2(onFalse(a)));
      });
    };
  };
}
var separated = function(left2, right2) {
  return { left: left2, right: right2 };
};
function wiltDefault$1(T, C) {
  return function(F) {
    var traverseF = T.traverse(F);
    return function(wa, f) {
      return F.map(traverseF(wa, f), C.separate);
    };
  };
}
function witherDefault$1(T, C) {
  return function(F) {
    var traverseF = T.traverse(F);
    return function(wa, f) {
      return F.map(traverseF(wa, f), C.compact);
    };
  };
}
function filterE$2(W) {
  return function(F) {
    var witherF = W.wither(F);
    return function(predicate) {
      return function(ga) {
        return witherF(ga, function(a) {
          return F.map(predicate(a), function(b) {
            return b ? some$5(a) : none$1;
          });
        });
      };
    };
  };
}
var left$1 = left$2;
var right$1 = right$2;
var _map$5 = function(fa, f) {
  return pipe$1(fa, map$7(f));
};
var _ap$3 = function(fab, fa) {
  return pipe$1(fab, ap$5(fa));
};
var _chain$3 = function(ma, f) {
  return pipe$1(ma, chain$4(f));
};
var _reduce$5 = function(fa, b, f) {
  return pipe$1(fa, reduce$8(b, f));
};
var _foldMap$5 = function(M) {
  return function(fa, f) {
    var foldMapM = foldMap$8(M);
    return pipe$1(fa, foldMapM(f));
  };
};
var _reduceRight$5 = function(fa, b, f) {
  return pipe$1(fa, reduceRight$8(b, f));
};
var _traverse$5 = function(F) {
  var traverseF = traverse$5(F);
  return function(ta, f) {
    return pipe$1(ta, traverseF(f));
  };
};
var _bimap = function(fa, f, g) {
  return pipe$1(fa, bimap$1(f, g));
};
var _mapLeft = function(fa, f) {
  return pipe$1(fa, mapLeft$1(f));
};
var _alt$3 = function(fa, that) {
  return pipe$1(fa, alt$4(that));
};
var _extend$3 = function(wa, f) {
  return pipe$1(wa, extend$5(f));
};
var _chainRec = function(a, f) {
  return tailRec$1(f(a), function(e) {
    return isLeft$1(e) ? right$1(left$1(e.left)) : isLeft$1(e.right) ? left$1(f(e.right.left)) : right$1(right$1(e.right.right));
  });
};
var URI$4 = "Either";
var getShow$7 = function(SE, SA) {
  return {
    show: function(ma) {
      return isLeft$1(ma) ? "left(".concat(SE.show(ma.left), ")") : "right(".concat(SA.show(ma.right), ")");
    }
  };
};
var getEq$7 = function(EL, EA) {
  return {
    equals: function(x, y) {
      return x === y || (isLeft$1(x) ? isLeft$1(y) && EL.equals(x.left, y.left) : isRight$1(y) && EA.equals(x.right, y.right));
    }
  };
};
var getSemigroup$3 = function(S) {
  return {
    concat: function(x, y) {
      return isLeft$1(y) ? x : isLeft$1(x) ? y : right$1(S.concat(x.right, y.right));
    }
  };
};
var getCompactable = function(M) {
  var empty2 = left$1(M.empty);
  return {
    URI: URI$4,
    _E: void 0,
    compact: function(ma) {
      return isLeft$1(ma) ? ma : ma.right._tag === "None" ? empty2 : right$1(ma.right.value);
    },
    separate: function(ma) {
      return isLeft$1(ma) ? separated(ma, ma) : isLeft$1(ma.right) ? separated(right$1(ma.right.left), empty2) : separated(empty2, right$1(ma.right.right));
    }
  };
};
var getFilterable = function(M) {
  var empty2 = left$1(M.empty);
  var _a2 = getCompactable(M), compact2 = _a2.compact, separate2 = _a2.separate;
  var filter2 = function(ma, predicate) {
    return isLeft$1(ma) ? ma : predicate(ma.right) ? ma : empty2;
  };
  var partition2 = function(ma, p) {
    return isLeft$1(ma) ? separated(ma, ma) : p(ma.right) ? separated(empty2, right$1(ma.right)) : separated(right$1(ma.right), empty2);
  };
  return {
    URI: URI$4,
    _E: void 0,
    map: _map$5,
    compact: compact2,
    separate: separate2,
    filter: filter2,
    filterMap: function(ma, f) {
      if (isLeft$1(ma)) {
        return ma;
      }
      var ob = f(ma.right);
      return ob._tag === "None" ? empty2 : right$1(ob.value);
    },
    partition: partition2,
    partitionMap: function(ma, f) {
      if (isLeft$1(ma)) {
        return separated(ma, ma);
      }
      var e = f(ma.right);
      return isLeft$1(e) ? separated(right$1(e.left), empty2) : separated(empty2, right$1(e.right));
    }
  };
};
var getWitherable$1 = function(M) {
  var F_ = getFilterable(M);
  var C = getCompactable(M);
  return {
    URI: URI$4,
    _E: void 0,
    map: _map$5,
    compact: F_.compact,
    separate: F_.separate,
    filter: F_.filter,
    filterMap: F_.filterMap,
    partition: F_.partition,
    partitionMap: F_.partitionMap,
    traverse: _traverse$5,
    sequence: sequence$5,
    reduce: _reduce$5,
    foldMap: _foldMap$5,
    reduceRight: _reduceRight$5,
    wither: witherDefault$1(Traversable$4, C),
    wilt: wiltDefault$1(Traversable$4, C)
  };
};
var getApplicativeValidation = function(SE) {
  return {
    URI: URI$4,
    _E: void 0,
    map: _map$5,
    ap: function(fab, fa) {
      return isLeft$1(fab) ? isLeft$1(fa) ? left$1(SE.concat(fab.left, fa.left)) : fab : isLeft$1(fa) ? fa : right$1(fab.right(fa.right));
    },
    of: of$3
  };
};
var getAltValidation = function(SE) {
  return {
    URI: URI$4,
    _E: void 0,
    map: _map$5,
    alt: function(me, that) {
      if (isRight$1(me)) {
        return me;
      }
      var ea = that();
      return isLeft$1(ea) ? left$1(SE.concat(me.left, ea.left)) : ea;
    }
  };
};
var map$7 = function(f) {
  return function(fa) {
    return isLeft$1(fa) ? fa : right$1(f(fa.right));
  };
};
var Functor$5 = {
  URI: URI$4,
  map: _map$5
};
var of$3 = right$1;
var Pointed$3 = {
  URI: URI$4,
  of: of$3
};
var apW = function(fa) {
  return function(fab) {
    return isLeft$1(fab) ? fab : isLeft$1(fa) ? fa : right$1(fab.right(fa.right));
  };
};
var ap$5 = apW;
var Apply$4 = {
  URI: URI$4,
  map: _map$5,
  ap: _ap$3
};
var Applicative$4 = {
  URI: URI$4,
  map: _map$5,
  ap: _ap$3,
  of: of$3
};
var chainW = function(f) {
  return function(ma) {
    return isLeft$1(ma) ? ma : f(ma.right);
  };
};
var chain$4 = chainW;
var Chain$4 = {
  URI: URI$4,
  map: _map$5,
  ap: _ap$3,
  chain: _chain$3
};
var Monad$3 = {
  URI: URI$4,
  map: _map$5,
  ap: _ap$3,
  of: of$3,
  chain: _chain$3
};
var reduce$8 = function(b, f) {
  return function(fa) {
    return isLeft$1(fa) ? b : f(b, fa.right);
  };
};
var foldMap$8 = function(M) {
  return function(f) {
    return function(fa) {
      return isLeft$1(fa) ? M.empty : f(fa.right);
    };
  };
};
var reduceRight$8 = function(b, f) {
  return function(fa) {
    return isLeft$1(fa) ? b : f(fa.right, b);
  };
};
var Foldable$4 = {
  URI: URI$4,
  reduce: _reduce$5,
  foldMap: _foldMap$5,
  reduceRight: _reduceRight$5
};
var traverse$5 = function(F) {
  return function(f) {
    return function(ta) {
      return isLeft$1(ta) ? F.of(left$1(ta.left)) : F.map(f(ta.right), right$1);
    };
  };
};
var sequence$5 = function(F) {
  return function(ma) {
    return isLeft$1(ma) ? F.of(left$1(ma.left)) : F.map(ma.right, right$1);
  };
};
var Traversable$4 = {
  URI: URI$4,
  map: _map$5,
  reduce: _reduce$5,
  foldMap: _foldMap$5,
  reduceRight: _reduceRight$5,
  traverse: _traverse$5,
  sequence: sequence$5
};
var bimap$1 = function(f, g) {
  return function(fa) {
    return isLeft$1(fa) ? left$1(f(fa.left)) : right$1(g(fa.right));
  };
};
var mapLeft$1 = function(f) {
  return function(fa) {
    return isLeft$1(fa) ? left$1(f(fa.left)) : fa;
  };
};
var Bifunctor = {
  URI: URI$4,
  bimap: _bimap,
  mapLeft: _mapLeft
};
var altW$3 = function(that) {
  return function(fa) {
    return isLeft$1(fa) ? that() : fa;
  };
};
var alt$4 = altW$3;
var Alt$3 = {
  URI: URI$4,
  map: _map$5,
  alt: _alt$3
};
var extend$5 = function(f) {
  return function(wa) {
    return isLeft$1(wa) ? wa : right$1(f(wa));
  };
};
var Extend$2 = {
  URI: URI$4,
  map: _map$5,
  extend: _extend$3
};
var ChainRec$1 = {
  URI: URI$4,
  map: _map$5,
  ap: _ap$3,
  chain: _chain$3,
  chainRec: _chainRec
};
var throwError$1 = left$1;
var MonadThrow$1 = {
  URI: URI$4,
  map: _map$5,
  ap: _ap$3,
  of: of$3,
  chain: _chain$3,
  throwError: throwError$1
};
var FromEither$3 = {
  URI: URI$4,
  fromEither: identity$1
};
var fromPredicate$3 = /* @__PURE__ */ fromPredicate$4(FromEither$3);
var fromOption$2 = /* @__PURE__ */ fromOption$3(FromEither$3);
var isLeft$1 = isLeft$2;
var isRight$1 = isRight$2;
var matchW$3 = function(onLeft, onRight) {
  return function(ma) {
    return isLeft$1(ma) ? onLeft(ma.left) : onRight(ma.right);
  };
};
var foldW$1 = matchW$3;
var match$3 = matchW$3;
var fold$2 = match$3;
var getOrElseW$1 = function(onLeft) {
  return function(ma) {
    return isLeft$1(ma) ? onLeft(ma.left) : ma.right;
  };
};
var getOrElse$1 = getOrElseW$1;
var flap$5 = /* @__PURE__ */ flap$6(Functor$5);
var apFirst$4 = /* @__PURE__ */ apFirst$5(Apply$4);
var apFirstW = apFirst$4;
var apSecond$4 = /* @__PURE__ */ apSecond$5(Apply$4);
var apSecondW = apSecond$4;
var chainFirst$4 = /* @__PURE__ */ chainFirst$5(Chain$4);
var chainFirstW = chainFirst$4;
var flattenW = /* @__PURE__ */ chainW(identity$1);
var flatten$3 = flattenW;
var duplicate$3 = /* @__PURE__ */ extend$5(identity$1);
var fromOptionK$2 = /* @__PURE__ */ fromOptionK$3(FromEither$3);
var chainOptionK$1 = /* @__PURE__ */ chainOptionK$2(FromEither$3, Chain$4);
var filterOrElse$1 = /* @__PURE__ */ filterOrElse$2(FromEither$3, Chain$4);
var filterOrElseW = filterOrElse$1;
var swap = function(ma) {
  return isLeft$1(ma) ? right$1(ma.left) : left$1(ma.right);
};
var orElseW = function(onLeft) {
  return function(ma) {
    return isLeft$1(ma) ? onLeft(ma.left) : ma;
  };
};
var orElse = orElseW;
var fromNullable$1 = function(e) {
  return function(a) {
    return a == null ? left$1(e) : right$1(a);
  };
};
var tryCatch$1 = function(f, onThrow) {
  try {
    return right$1(f());
  } catch (e) {
    return left$1(onThrow(e));
  }
};
var tryCatchK$1 = function(f, onThrow) {
  return function() {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      a[_i] = arguments[_i];
    }
    return tryCatch$1(function() {
      return f.apply(void 0, a);
    }, onThrow);
  };
};
var fromNullableK$1 = function(e) {
  var from = fromNullable$1(e);
  return function(f) {
    return flow(f, from);
  };
};
var chainNullableK$1 = function(e) {
  var from = fromNullableK$1(e);
  return function(f) {
    return chain$4(from(f));
  };
};
var toUnion = /* @__PURE__ */ foldW$1(identity$1, identity$1);
function toError(e) {
  return e instanceof Error ? e : new Error(String(e));
}
function elem$5(E) {
  return function(a, ma) {
    if (ma === void 0) {
      var elemE_1 = elem$5(E);
      return function(ma2) {
        return elemE_1(a, ma2);
      };
    }
    return isLeft$1(ma) ? false : E.equals(a, ma.right);
  };
}
var exists$2 = function(predicate) {
  return function(ma) {
    return isLeft$1(ma) ? false : predicate(ma.right);
  };
};
var Do$3 = /* @__PURE__ */ of$3(emptyRecord);
var bindTo$4 = /* @__PURE__ */ bindTo$5(Functor$5);
var let_$4 = /* @__PURE__ */ let_$5(Functor$5);
var bind$7 = /* @__PURE__ */ bind$8(Chain$4);
var bindW = bind$7;
var apS$4 = /* @__PURE__ */ apS$5(Apply$4);
var apSW = apS$4;
var ApT$1 = /* @__PURE__ */ of$3(emptyReadonlyArray);
var traverseReadonlyNonEmptyArrayWithIndex$1 = function(f) {
  return function(as) {
    var e = f(0, head$5(as));
    if (isLeft$1(e)) {
      return e;
    }
    var out = [e.right];
    for (var i = 1; i < as.length; i++) {
      var e_1 = f(i, as[i]);
      if (isLeft$1(e_1)) {
        return e_1;
      }
      out.push(e_1.right);
    }
    return right$1(out);
  };
};
var traverseReadonlyArrayWithIndex$1 = function(f) {
  var g = traverseReadonlyNonEmptyArrayWithIndex$1(f);
  return function(as) {
    return isNonEmpty$6(as) ? g(as) : ApT$1;
  };
};
var traverseArrayWithIndex$1 = traverseReadonlyArrayWithIndex$1;
var traverseArray$1 = function(f) {
  return traverseReadonlyArrayWithIndex$1(function(_2, a) {
    return f(a);
  });
};
var sequenceArray$1 = /* @__PURE__ */ traverseArray$1(identity$1);
function parseJSON(s, onError) {
  return tryCatch$1(function() {
    return JSON.parse(s);
  }, onError);
}
var stringifyJSON = function(u, onError) {
  return tryCatch$1(function() {
    var s = JSON.stringify(u);
    if (typeof s !== "string") {
      throw new Error("Converting unsupported structure to JSON");
    }
    return s;
  }, onError);
};
var either = {
  URI: URI$4,
  map: _map$5,
  of: of$3,
  ap: _ap$3,
  chain: _chain$3,
  reduce: _reduce$5,
  foldMap: _foldMap$5,
  reduceRight: _reduceRight$5,
  traverse: _traverse$5,
  sequence: sequence$5,
  bimap: _bimap,
  mapLeft: _mapLeft,
  alt: _alt$3,
  extend: _extend$3,
  chainRec: _chainRec,
  throwError: throwError$1
};
var getApplySemigroup$2 = /* @__PURE__ */ getApplySemigroup$3(Apply$4);
var getApplyMonoid$1 = /* @__PURE__ */ getApplicativeMonoid$1(Applicative$4);
var getValidationSemigroup = function(SE, SA) {
  return getApplySemigroup$3(getApplicativeValidation(SE))(SA);
};
var getValidationMonoid = function(SE, MA) {
  return getApplicativeMonoid$1(getApplicativeValidation(SE))(MA);
};
function getValidation(SE) {
  var ap2 = getApplicativeValidation(SE).ap;
  var alt2 = getAltValidation(SE).alt;
  return {
    URI: URI$4,
    _E: void 0,
    map: _map$5,
    of: of$3,
    chain: _chain$3,
    bimap: _bimap,
    mapLeft: _mapLeft,
    reduce: _reduce$5,
    foldMap: _foldMap$5,
    reduceRight: _reduceRight$5,
    extend: _extend$3,
    traverse: _traverse$5,
    sequence: sequence$5,
    chainRec: _chainRec,
    throwError: throwError$1,
    ap: ap2,
    alt: alt2
  };
}
const Either$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Alt: Alt$3,
  ApT: ApT$1,
  Applicative: Applicative$4,
  Apply: Apply$4,
  Bifunctor,
  Chain: Chain$4,
  ChainRec: ChainRec$1,
  Do: Do$3,
  Extend: Extend$2,
  Foldable: Foldable$4,
  FromEither: FromEither$3,
  Functor: Functor$5,
  Monad: Monad$3,
  MonadThrow: MonadThrow$1,
  Pointed: Pointed$3,
  Traversable: Traversable$4,
  URI: URI$4,
  alt: alt$4,
  altW: altW$3,
  ap: ap$5,
  apFirst: apFirst$4,
  apFirstW,
  apS: apS$4,
  apSW,
  apSecond: apSecond$4,
  apSecondW,
  apW,
  bimap: bimap$1,
  bind: bind$7,
  bindTo: bindTo$4,
  bindW,
  chain: chain$4,
  chainFirst: chainFirst$4,
  chainFirstW,
  chainNullableK: chainNullableK$1,
  chainOptionK: chainOptionK$1,
  chainW,
  duplicate: duplicate$3,
  either,
  elem: elem$5,
  exists: exists$2,
  extend: extend$5,
  filterOrElse: filterOrElse$1,
  filterOrElseW,
  flap: flap$5,
  flatten: flatten$3,
  flattenW,
  fold: fold$2,
  foldMap: foldMap$8,
  foldW: foldW$1,
  fromNullable: fromNullable$1,
  fromNullableK: fromNullableK$1,
  fromOption: fromOption$2,
  fromOptionK: fromOptionK$2,
  fromPredicate: fromPredicate$3,
  getAltValidation,
  getApplicativeValidation,
  getApplyMonoid: getApplyMonoid$1,
  getApplySemigroup: getApplySemigroup$2,
  getCompactable,
  getEq: getEq$7,
  getFilterable,
  getOrElse: getOrElse$1,
  getOrElseW: getOrElseW$1,
  getSemigroup: getSemigroup$3,
  getShow: getShow$7,
  getValidation,
  getValidationMonoid,
  getValidationSemigroup,
  getWitherable: getWitherable$1,
  isLeft: isLeft$1,
  isRight: isRight$1,
  left: left$1,
  let: let_$4,
  map: map$7,
  mapLeft: mapLeft$1,
  match: match$3,
  matchW: matchW$3,
  of: of$3,
  orElse,
  orElseW,
  parseJSON,
  reduce: reduce$8,
  reduceRight: reduceRight$8,
  right: right$1,
  sequence: sequence$5,
  sequenceArray: sequenceArray$1,
  stringifyJSON,
  swap,
  throwError: throwError$1,
  toError,
  toUnion,
  traverse: traverse$5,
  traverseArray: traverseArray$1,
  traverseArrayWithIndex: traverseArrayWithIndex$1,
  traverseReadonlyArrayWithIndex: traverseReadonlyArrayWithIndex$1,
  traverseReadonlyNonEmptyArrayWithIndex: traverseReadonlyNonEmptyArrayWithIndex$1,
  tryCatch: tryCatch$1,
  tryCatchK: tryCatchK$1
}, Symbol.toStringTag, { value: "Module" }));
var __extends = globalThis && globalThis.__extends || function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __assign$1 = globalThis && globalThis.__assign || function() {
  __assign$1 = Object.assign || function(t2) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t2[p] = s[p];
    }
    return t2;
  };
  return __assign$1.apply(this, arguments);
};
var __spreadArray$4 = globalThis && globalThis.__spreadArray || function(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var failures = left$1;
var failure = function(value, context, message2) {
  return failures([{ value, context, message: message2 }]);
};
var success = right$1;
var Type = function() {
  function Type2(name2, is, validate, encode2) {
    this.name = name2;
    this.is = is;
    this.validate = validate;
    this.encode = encode2;
    this.decode = this.decode.bind(this);
  }
  Type2.prototype.pipe = function(ab, name2) {
    var _this = this;
    if (name2 === void 0) {
      name2 = "pipe(".concat(this.name, ", ").concat(ab.name, ")");
    }
    return new Type2(name2, ab.is, function(i, c) {
      var e = _this.validate(i, c);
      if (isLeft$1(e)) {
        return e;
      }
      return ab.validate(e.right, c);
    }, this.encode === identity && ab.encode === identity ? identity : function(b) {
      return _this.encode(ab.encode(b));
    });
  };
  Type2.prototype.asDecoder = function() {
    return this;
  };
  Type2.prototype.asEncoder = function() {
    return this;
  };
  Type2.prototype.decode = function(i) {
    return this.validate(i, [{ key: "", type: this, actual: i }]);
  };
  return Type2;
}();
var identity = function(a) {
  return a;
};
function getFunctionName(f) {
  return f.displayName || f.name || "<function".concat(f.length, ">");
}
function getContextEntry(key, decoder) {
  return { key, type: decoder };
}
function appendContext(c, key, decoder, actual) {
  var len = c.length;
  var r = Array(len + 1);
  for (var i = 0; i < len; i++) {
    r[i] = c[i];
  }
  r[len] = { key, type: decoder, actual };
  return r;
}
function pushAll(xs, ys) {
  var l = ys.length;
  for (var i = 0; i < l; i++) {
    xs.push(ys[i]);
  }
}
var hasOwnProperty$2 = Object.prototype.hasOwnProperty;
function getNameFromProps(props) {
  return Object.keys(props).map(function(k) {
    return "".concat(k, ": ").concat(props[k].name);
  }).join(", ");
}
function useIdentity(codecs) {
  for (var i = 0; i < codecs.length; i++) {
    if (codecs[i].encode !== identity) {
      return false;
    }
  }
  return true;
}
function getInterfaceTypeName(props) {
  return "{ ".concat(getNameFromProps(props), " }");
}
function getPartialTypeName(inner) {
  return "Partial<".concat(inner, ">");
}
function enumerableRecord(keys2, domain, codomain, name2) {
  if (name2 === void 0) {
    name2 = "{ [K in ".concat(domain.name, "]: ").concat(codomain.name, " }");
  }
  var len = keys2.length;
  return new DictionaryType(name2, function(u) {
    return UnknownRecord.is(u) && keys2.every(function(k) {
      return codomain.is(u[k]);
    });
  }, function(u, c) {
    var e = UnknownRecord.validate(u, c);
    if (isLeft$1(e)) {
      return e;
    }
    var o = e.right;
    var a = {};
    var errors = [];
    var changed = false;
    for (var i = 0; i < len; i++) {
      var k = keys2[i];
      var ok = o[k];
      var codomainResult = codomain.validate(ok, appendContext(c, k, codomain, ok));
      if (isLeft$1(codomainResult)) {
        pushAll(errors, codomainResult.left);
      } else {
        var vok = codomainResult.right;
        changed = changed || vok !== ok;
        a[k] = vok;
      }
    }
    return errors.length > 0 ? failures(errors) : success(changed || Object.keys(o).length !== len ? a : o);
  }, codomain.encode === identity ? identity : function(a) {
    var s = {};
    for (var i = 0; i < len; i++) {
      var k = keys2[i];
      s[k] = codomain.encode(a[k]);
    }
    return s;
  }, domain, codomain);
}
function getDomainKeys(domain) {
  var _a2;
  if (isLiteralC(domain)) {
    var literal_1 = domain.value;
    if (string.is(literal_1)) {
      return _a2 = {}, _a2[literal_1] = null, _a2;
    }
  } else if (isKeyofC(domain)) {
    return domain.keys;
  } else if (isUnionC(domain)) {
    var keys2 = domain.types.map(function(type2) {
      return getDomainKeys(type2);
    });
    return keys2.some(undefinedType.is) ? void 0 : Object.assign.apply(Object, __spreadArray$4([{}], keys2, false));
  }
  return void 0;
}
function nonEnumerableRecord(domain, codomain, name2) {
  if (name2 === void 0) {
    name2 = "{ [K in ".concat(domain.name, "]: ").concat(codomain.name, " }");
  }
  return new DictionaryType(name2, function(u) {
    if (UnknownRecord.is(u)) {
      return Object.keys(u).every(function(k) {
        return domain.is(k) && codomain.is(u[k]);
      });
    }
    return isAnyC(codomain) && Array.isArray(u);
  }, function(u, c) {
    if (UnknownRecord.is(u)) {
      var a = {};
      var errors = [];
      var keys2 = Object.keys(u);
      var len = keys2.length;
      var changed = false;
      for (var i = 0; i < len; i++) {
        var k = keys2[i];
        var ok = u[k];
        var domainResult = domain.validate(k, appendContext(c, k, domain, k));
        if (isLeft$1(domainResult)) {
          pushAll(errors, domainResult.left);
        } else {
          var vk = domainResult.right;
          changed = changed || vk !== k;
          k = vk;
          var codomainResult = codomain.validate(ok, appendContext(c, k, codomain, ok));
          if (isLeft$1(codomainResult)) {
            pushAll(errors, codomainResult.left);
          } else {
            var vok = codomainResult.right;
            changed = changed || vok !== ok;
            a[k] = vok;
          }
        }
      }
      return errors.length > 0 ? failures(errors) : success(changed ? a : u);
    }
    if (isAnyC(codomain) && Array.isArray(u)) {
      return success(u);
    }
    return failure(u, c);
  }, domain.encode === identity && codomain.encode === identity ? identity : function(a) {
    var s = {};
    var keys2 = Object.keys(a);
    var len = keys2.length;
    for (var i = 0; i < len; i++) {
      var k = keys2[i];
      s[String(domain.encode(k))] = codomain.encode(a[k]);
    }
    return s;
  }, domain, codomain);
}
function getUnionName(codecs) {
  return "(" + codecs.map(function(type2) {
    return type2.name;
  }).join(" | ") + ")";
}
function mergeAll(base, us) {
  var equal = true;
  var primitive = true;
  var baseIsNotADictionary = !UnknownRecord.is(base);
  for (var _i = 0, us_1 = us; _i < us_1.length; _i++) {
    var u = us_1[_i];
    if (u !== base) {
      equal = false;
    }
    if (UnknownRecord.is(u)) {
      primitive = false;
    }
  }
  if (equal) {
    return base;
  } else if (primitive) {
    return us[us.length - 1];
  }
  var r = {};
  for (var _a2 = 0, us_2 = us; _a2 < us_2.length; _a2++) {
    var u = us_2[_a2];
    for (var k in u) {
      if (!hasOwnProperty$2.call(r, k) || baseIsNotADictionary || u[k] !== base[k]) {
        r[k] = u[k];
      }
    }
  }
  return r;
}
function getProps(codec) {
  switch (codec._tag) {
    case "RefinementType":
    case "ReadonlyType":
      return getProps(codec.type);
    case "InterfaceType":
    case "StrictType":
    case "PartialType":
      return codec.props;
    case "IntersectionType":
      return codec.types.reduce(function(props, type2) {
        return Object.assign(props, getProps(type2));
      }, {});
  }
}
function stripKeys(o, props) {
  var keys2 = Object.getOwnPropertyNames(o);
  var shouldStrip = false;
  var r = {};
  for (var i = 0; i < keys2.length; i++) {
    var key = keys2[i];
    if (!hasOwnProperty$2.call(props, key)) {
      shouldStrip = true;
    } else {
      r[key] = o[key];
    }
  }
  return shouldStrip ? r : o;
}
function getExactTypeName(codec) {
  if (isTypeC(codec)) {
    return "{| ".concat(getNameFromProps(codec.props), " |}");
  } else if (isPartialC(codec)) {
    return getPartialTypeName("{| ".concat(getNameFromProps(codec.props), " |}"));
  }
  return "Exact<".concat(codec.name, ">");
}
function isNonEmpty$5(as) {
  return as.length > 0;
}
var emptyTags = {};
function intersect(a, b) {
  var r = [];
  for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
    var v = a_1[_i];
    if (b.indexOf(v) !== -1) {
      r.push(v);
    }
  }
  return r;
}
function mergeTags(a, b) {
  if (a === emptyTags) {
    return b;
  }
  if (b === emptyTags) {
    return a;
  }
  var r = Object.assign({}, a);
  for (var k in b) {
    if (hasOwnProperty$2.call(a, k)) {
      var intersection_1 = intersect(a[k], b[k]);
      if (isNonEmpty$5(intersection_1)) {
        r[k] = intersection_1;
      } else {
        r = emptyTags;
        break;
      }
    } else {
      r[k] = b[k];
    }
  }
  return r;
}
function intersectTags(a, b) {
  if (a === emptyTags || b === emptyTags) {
    return emptyTags;
  }
  var r = emptyTags;
  for (var k in a) {
    if (hasOwnProperty$2.call(b, k)) {
      var intersection_2 = intersect(a[k], b[k]);
      if (intersection_2.length === 0) {
        if (r === emptyTags) {
          r = {};
        }
        r[k] = a[k].concat(b[k]);
      }
    }
  }
  return r;
}
function isAnyC(codec) {
  return codec._tag === "AnyType";
}
function isLiteralC(codec) {
  return codec._tag === "LiteralType";
}
function isKeyofC(codec) {
  return codec._tag === "KeyofType";
}
function isTypeC(codec) {
  return codec._tag === "InterfaceType";
}
function isPartialC(codec) {
  return codec._tag === "PartialType";
}
function isStrictC(codec) {
  return codec._tag === "StrictType";
}
function isExactC(codec) {
  return codec._tag === "ExactType";
}
function isRefinementC(codec) {
  return codec._tag === "RefinementType";
}
function isIntersectionC(codec) {
  return codec._tag === "IntersectionType";
}
function isUnionC(codec) {
  return codec._tag === "UnionType";
}
function isRecursiveC(codec) {
  return codec._tag === "RecursiveType";
}
var lazyCodecs = [];
function getTags(codec) {
  if (lazyCodecs.indexOf(codec) !== -1) {
    return emptyTags;
  }
  if (isTypeC(codec) || isStrictC(codec)) {
    var index = emptyTags;
    for (var k in codec.props) {
      var prop = codec.props[k];
      if (isLiteralC(prop)) {
        if (index === emptyTags) {
          index = {};
        }
        index[k] = [prop.value];
      }
    }
    return index;
  } else if (isExactC(codec) || isRefinementC(codec)) {
    return getTags(codec.type);
  } else if (isIntersectionC(codec)) {
    return codec.types.reduce(function(tags2, codec2) {
      return mergeTags(tags2, getTags(codec2));
    }, emptyTags);
  } else if (isUnionC(codec)) {
    return codec.types.slice(1).reduce(function(tags2, codec2) {
      return intersectTags(tags2, getTags(codec2));
    }, getTags(codec.types[0]));
  } else if (isRecursiveC(codec)) {
    lazyCodecs.push(codec);
    var tags = getTags(codec.type);
    lazyCodecs.pop();
    return tags;
  }
  return emptyTags;
}
function getIndex(codecs) {
  var tags = getTags(codecs[0]);
  var keys2 = Object.keys(tags);
  var len = codecs.length;
  var _loop_1 = function(k2) {
    var all2 = tags[k2].slice();
    var index = [tags[k2]];
    for (var i = 1; i < len; i++) {
      var codec = codecs[i];
      var ctags = getTags(codec);
      var values = ctags[k2];
      if (values === void 0) {
        return "continue-keys";
      } else {
        if (values.some(function(v) {
          return all2.indexOf(v) !== -1;
        })) {
          return "continue-keys";
        } else {
          all2.push.apply(all2, values);
          index.push(values);
        }
      }
    }
    return { value: [k2, index] };
  };
  keys:
    for (var _i = 0, keys_1 = keys2; _i < keys_1.length; _i++) {
      var k = keys_1[_i];
      var state_1 = _loop_1(k);
      if (typeof state_1 === "object")
        return state_1.value;
      switch (state_1) {
        case "continue-keys":
          continue keys;
      }
    }
  return void 0;
}
var NullType = function(_super) {
  __extends(NullType2, _super);
  function NullType2() {
    var _this = _super.call(this, "null", function(u) {
      return u === null;
    }, function(u, c) {
      return _this.is(u) ? success(u) : failure(u, c);
    }, identity) || this;
    _this._tag = "NullType";
    return _this;
  }
  return NullType2;
}(Type);
var nullType = new NullType();
var UndefinedType = function(_super) {
  __extends(UndefinedType2, _super);
  function UndefinedType2() {
    var _this = _super.call(this, "undefined", function(u) {
      return u === void 0;
    }, function(u, c) {
      return _this.is(u) ? success(u) : failure(u, c);
    }, identity) || this;
    _this._tag = "UndefinedType";
    return _this;
  }
  return UndefinedType2;
}(Type);
var undefinedType = new UndefinedType();
var VoidType = function(_super) {
  __extends(VoidType2, _super);
  function VoidType2() {
    var _this = _super.call(this, "void", undefinedType.is, undefinedType.validate, identity) || this;
    _this._tag = "VoidType";
    return _this;
  }
  return VoidType2;
}(Type);
var voidType = new VoidType();
var UnknownType = function(_super) {
  __extends(UnknownType2, _super);
  function UnknownType2() {
    var _this = _super.call(this, "unknown", function(_2) {
      return true;
    }, success, identity) || this;
    _this._tag = "UnknownType";
    return _this;
  }
  return UnknownType2;
}(Type);
var unknown = new UnknownType();
var StringType = function(_super) {
  __extends(StringType2, _super);
  function StringType2() {
    var _this = _super.call(this, "string", function(u) {
      return typeof u === "string";
    }, function(u, c) {
      return _this.is(u) ? success(u) : failure(u, c);
    }, identity) || this;
    _this._tag = "StringType";
    return _this;
  }
  return StringType2;
}(Type);
var string = new StringType();
var NumberType = function(_super) {
  __extends(NumberType2, _super);
  function NumberType2() {
    var _this = _super.call(this, "number", function(u) {
      return typeof u === "number";
    }, function(u, c) {
      return _this.is(u) ? success(u) : failure(u, c);
    }, identity) || this;
    _this._tag = "NumberType";
    return _this;
  }
  return NumberType2;
}(Type);
var number = new NumberType();
var BigIntType = function(_super) {
  __extends(BigIntType2, _super);
  function BigIntType2() {
    var _this = _super.call(
      this,
      "bigint",
      // tslint:disable-next-line: valid-typeof
      function(u) {
        return typeof u === "bigint";
      },
      function(u, c) {
        return _this.is(u) ? success(u) : failure(u, c);
      },
      identity
    ) || this;
    _this._tag = "BigIntType";
    return _this;
  }
  return BigIntType2;
}(Type);
var bigint = new BigIntType();
var BooleanType = function(_super) {
  __extends(BooleanType2, _super);
  function BooleanType2() {
    var _this = _super.call(this, "boolean", function(u) {
      return typeof u === "boolean";
    }, function(u, c) {
      return _this.is(u) ? success(u) : failure(u, c);
    }, identity) || this;
    _this._tag = "BooleanType";
    return _this;
  }
  return BooleanType2;
}(Type);
var boolean = new BooleanType();
var AnyArrayType = function(_super) {
  __extends(AnyArrayType2, _super);
  function AnyArrayType2() {
    var _this = _super.call(this, "UnknownArray", Array.isArray, function(u, c) {
      return _this.is(u) ? success(u) : failure(u, c);
    }, identity) || this;
    _this._tag = "AnyArrayType";
    return _this;
  }
  return AnyArrayType2;
}(Type);
var UnknownArray = new AnyArrayType();
var AnyDictionaryType = function(_super) {
  __extends(AnyDictionaryType2, _super);
  function AnyDictionaryType2() {
    var _this = _super.call(this, "UnknownRecord", function(u) {
      return u !== null && typeof u === "object" && !Array.isArray(u);
    }, function(u, c) {
      return _this.is(u) ? success(u) : failure(u, c);
    }, identity) || this;
    _this._tag = "AnyDictionaryType";
    return _this;
  }
  return AnyDictionaryType2;
}(Type);
var UnknownRecord = new AnyDictionaryType();
var LiteralType = function(_super) {
  __extends(LiteralType2, _super);
  function LiteralType2(name2, is, validate, encode2, value) {
    var _this = _super.call(this, name2, is, validate, encode2) || this;
    _this.value = value;
    _this._tag = "LiteralType";
    return _this;
  }
  return LiteralType2;
}(Type);
function literal(value, name2) {
  if (name2 === void 0) {
    name2 = JSON.stringify(value);
  }
  var is = function(u) {
    return u === value;
  };
  return new LiteralType(name2, is, function(u, c) {
    return is(u) ? success(value) : failure(u, c);
  }, identity, value);
}
var KeyofType = function(_super) {
  __extends(KeyofType2, _super);
  function KeyofType2(name2, is, validate, encode2, keys2) {
    var _this = _super.call(this, name2, is, validate, encode2) || this;
    _this.keys = keys2;
    _this._tag = "KeyofType";
    return _this;
  }
  return KeyofType2;
}(Type);
function keyof(keys2, name2) {
  if (name2 === void 0) {
    name2 = Object.keys(keys2).map(function(k) {
      return JSON.stringify(k);
    }).join(" | ");
  }
  var is = function(u) {
    return string.is(u) && hasOwnProperty$2.call(keys2, u);
  };
  return new KeyofType(name2, is, function(u, c) {
    return is(u) ? success(u) : failure(u, c);
  }, identity, keys2);
}
var RefinementType = function(_super) {
  __extends(RefinementType2, _super);
  function RefinementType2(name2, is, validate, encode2, type2, predicate) {
    var _this = _super.call(this, name2, is, validate, encode2) || this;
    _this.type = type2;
    _this.predicate = predicate;
    _this._tag = "RefinementType";
    return _this;
  }
  return RefinementType2;
}(Type);
function brand(codec, predicate, name2) {
  return refinement(codec, predicate, name2);
}
var Int = brand(number, function(n) {
  return Number.isInteger(n);
}, "Int");
var RecursiveType = function(_super) {
  __extends(RecursiveType2, _super);
  function RecursiveType2(name2, is, validate, encode2, runDefinition) {
    var _this = _super.call(this, name2, is, validate, encode2) || this;
    _this.runDefinition = runDefinition;
    _this._tag = "RecursiveType";
    return _this;
  }
  return RecursiveType2;
}(Type);
Object.defineProperty(RecursiveType.prototype, "type", {
  get: function() {
    return this.runDefinition();
  },
  enumerable: true,
  configurable: true
});
function recursion(name2, definition) {
  var cache;
  var runDefinition = function() {
    if (!cache) {
      cache = definition(Self);
      cache.name = name2;
    }
    return cache;
  };
  var Self = new RecursiveType(name2, function(u) {
    return runDefinition().is(u);
  }, function(u, c) {
    return runDefinition().validate(u, c);
  }, function(a) {
    return runDefinition().encode(a);
  }, runDefinition);
  return Self;
}
var ArrayType = function(_super) {
  __extends(ArrayType2, _super);
  function ArrayType2(name2, is, validate, encode2, type2) {
    var _this = _super.call(this, name2, is, validate, encode2) || this;
    _this.type = type2;
    _this._tag = "ArrayType";
    return _this;
  }
  return ArrayType2;
}(Type);
function array$1(item, name2) {
  if (name2 === void 0) {
    name2 = "Array<".concat(item.name, ">");
  }
  return new ArrayType(name2, function(u) {
    return UnknownArray.is(u) && u.every(item.is);
  }, function(u, c) {
    var e = UnknownArray.validate(u, c);
    if (isLeft$1(e)) {
      return e;
    }
    var us = e.right;
    var len = us.length;
    var as = us;
    var errors = [];
    for (var i = 0; i < len; i++) {
      var ui = us[i];
      var result = item.validate(ui, appendContext(c, String(i), item, ui));
      if (isLeft$1(result)) {
        pushAll(errors, result.left);
      } else {
        var ai = result.right;
        if (ai !== ui) {
          if (as === us) {
            as = us.slice();
          }
          as[i] = ai;
        }
      }
    }
    return errors.length > 0 ? failures(errors) : success(as);
  }, item.encode === identity ? identity : function(a) {
    return a.map(item.encode);
  }, item);
}
var InterfaceType = function(_super) {
  __extends(InterfaceType2, _super);
  function InterfaceType2(name2, is, validate, encode2, props) {
    var _this = _super.call(this, name2, is, validate, encode2) || this;
    _this.props = props;
    _this._tag = "InterfaceType";
    return _this;
  }
  return InterfaceType2;
}(Type);
function type(props, name2) {
  if (name2 === void 0) {
    name2 = getInterfaceTypeName(props);
  }
  var keys2 = Object.keys(props);
  var types = keys2.map(function(key) {
    return props[key];
  });
  var len = keys2.length;
  return new InterfaceType(name2, function(u) {
    if (UnknownRecord.is(u)) {
      for (var i = 0; i < len; i++) {
        var k = keys2[i];
        var uk = u[k];
        if (uk === void 0 && !hasOwnProperty$2.call(u, k) || !types[i].is(uk)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }, function(u, c) {
    var e = UnknownRecord.validate(u, c);
    if (isLeft$1(e)) {
      return e;
    }
    var o = e.right;
    var a = o;
    var errors = [];
    for (var i = 0; i < len; i++) {
      var k = keys2[i];
      var ak = a[k];
      var type_1 = types[i];
      var result = type_1.validate(ak, appendContext(c, k, type_1, ak));
      if (isLeft$1(result)) {
        pushAll(errors, result.left);
      } else {
        var vak = result.right;
        if (vak !== ak || vak === void 0 && !hasOwnProperty$2.call(a, k)) {
          if (a === o) {
            a = __assign$1({}, o);
          }
          a[k] = vak;
        }
      }
    }
    return errors.length > 0 ? failures(errors) : success(a);
  }, useIdentity(types) ? identity : function(a) {
    var s = __assign$1({}, a);
    for (var i = 0; i < len; i++) {
      var k = keys2[i];
      var encode2 = types[i].encode;
      if (encode2 !== identity) {
        s[k] = encode2(a[k]);
      }
    }
    return s;
  }, props);
}
var PartialType = function(_super) {
  __extends(PartialType2, _super);
  function PartialType2(name2, is, validate, encode2, props) {
    var _this = _super.call(this, name2, is, validate, encode2) || this;
    _this.props = props;
    _this._tag = "PartialType";
    return _this;
  }
  return PartialType2;
}(Type);
function partial(props, name2) {
  if (name2 === void 0) {
    name2 = getPartialTypeName(getInterfaceTypeName(props));
  }
  var keys2 = Object.keys(props);
  var types = keys2.map(function(key) {
    return props[key];
  });
  var len = keys2.length;
  return new PartialType(name2, function(u) {
    if (UnknownRecord.is(u)) {
      for (var i = 0; i < len; i++) {
        var k = keys2[i];
        var uk = u[k];
        if (uk !== void 0 && !props[k].is(uk)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }, function(u, c) {
    var e = UnknownRecord.validate(u, c);
    if (isLeft$1(e)) {
      return e;
    }
    var o = e.right;
    var a = o;
    var errors = [];
    for (var i = 0; i < len; i++) {
      var k = keys2[i];
      var ak = a[k];
      var type_2 = props[k];
      var result = type_2.validate(ak, appendContext(c, k, type_2, ak));
      if (isLeft$1(result)) {
        if (ak !== void 0) {
          pushAll(errors, result.left);
        }
      } else {
        var vak = result.right;
        if (vak !== ak) {
          if (a === o) {
            a = __assign$1({}, o);
          }
          a[k] = vak;
        }
      }
    }
    return errors.length > 0 ? failures(errors) : success(a);
  }, useIdentity(types) ? identity : function(a) {
    var s = __assign$1({}, a);
    for (var i = 0; i < len; i++) {
      var k = keys2[i];
      var ak = a[k];
      if (ak !== void 0) {
        s[k] = types[i].encode(ak);
      }
    }
    return s;
  }, props);
}
var DictionaryType = function(_super) {
  __extends(DictionaryType2, _super);
  function DictionaryType2(name2, is, validate, encode2, domain, codomain) {
    var _this = _super.call(this, name2, is, validate, encode2) || this;
    _this.domain = domain;
    _this.codomain = codomain;
    _this._tag = "DictionaryType";
    return _this;
  }
  return DictionaryType2;
}(Type);
function record$1(domain, codomain, name2) {
  var keys2 = getDomainKeys(domain);
  return keys2 ? enumerableRecord(Object.keys(keys2), domain, codomain, name2) : nonEnumerableRecord(domain, codomain, name2);
}
var UnionType = function(_super) {
  __extends(UnionType2, _super);
  function UnionType2(name2, is, validate, encode2, types) {
    var _this = _super.call(this, name2, is, validate, encode2) || this;
    _this.types = types;
    _this._tag = "UnionType";
    return _this;
  }
  return UnionType2;
}(Type);
function union$4(codecs, name2) {
  if (name2 === void 0) {
    name2 = getUnionName(codecs);
  }
  var index = getIndex(codecs);
  if (index !== void 0 && codecs.length > 0) {
    var tag_1 = index[0], groups_1 = index[1];
    var len_1 = groups_1.length;
    var find_1 = function(value) {
      for (var i = 0; i < len_1; i++) {
        if (groups_1[i].indexOf(value) !== -1) {
          return i;
        }
      }
      return void 0;
    };
    return new TaggedUnionType(name2, function(u) {
      if (UnknownRecord.is(u)) {
        var i = find_1(u[tag_1]);
        return i !== void 0 ? codecs[i].is(u) : false;
      }
      return false;
    }, function(u, c) {
      var e = UnknownRecord.validate(u, c);
      if (isLeft$1(e)) {
        return e;
      }
      var r = e.right;
      var i = find_1(r[tag_1]);
      if (i === void 0) {
        return failure(u, c);
      }
      var codec = codecs[i];
      return codec.validate(r, appendContext(c, String(i), codec, r));
    }, useIdentity(codecs) ? identity : function(a) {
      var i = find_1(a[tag_1]);
      if (i === void 0) {
        throw new Error("no codec found to encode value in union codec ".concat(name2));
      } else {
        return codecs[i].encode(a);
      }
    }, codecs, tag_1);
  } else {
    return new UnionType(name2, function(u) {
      return codecs.some(function(type2) {
        return type2.is(u);
      });
    }, function(u, c) {
      var errors = [];
      for (var i = 0; i < codecs.length; i++) {
        var codec = codecs[i];
        var result = codec.validate(u, appendContext(c, String(i), codec, u));
        if (isLeft$1(result)) {
          pushAll(errors, result.left);
        } else {
          return success(result.right);
        }
      }
      return failures(errors);
    }, useIdentity(codecs) ? identity : function(a) {
      for (var _i = 0, codecs_1 = codecs; _i < codecs_1.length; _i++) {
        var codec = codecs_1[_i];
        if (codec.is(a)) {
          return codec.encode(a);
        }
      }
      throw new Error("no codec found to encode value in union type ".concat(name2));
    }, codecs);
  }
}
var IntersectionType = function(_super) {
  __extends(IntersectionType2, _super);
  function IntersectionType2(name2, is, validate, encode2, types) {
    var _this = _super.call(this, name2, is, validate, encode2) || this;
    _this.types = types;
    _this._tag = "IntersectionType";
    return _this;
  }
  return IntersectionType2;
}(Type);
function intersection$3(codecs, name2) {
  if (name2 === void 0) {
    name2 = "(".concat(codecs.map(function(type2) {
      return type2.name;
    }).join(" & "), ")");
  }
  var len = codecs.length;
  return new IntersectionType(name2, function(u) {
    return codecs.every(function(type2) {
      return type2.is(u);
    });
  }, codecs.length === 0 ? success : function(u, c) {
    var us = [];
    var errors = [];
    for (var i = 0; i < len; i++) {
      var codec = codecs[i];
      var result = codec.validate(u, appendContext(c, String(i), codec, u));
      if (isLeft$1(result)) {
        pushAll(errors, result.left);
      } else {
        us.push(result.right);
      }
    }
    return errors.length > 0 ? failures(errors) : success(mergeAll(u, us));
  }, codecs.length === 0 ? identity : function(a) {
    return mergeAll(a, codecs.map(function(codec) {
      return codec.encode(a);
    }));
  }, codecs);
}
var TupleType = function(_super) {
  __extends(TupleType2, _super);
  function TupleType2(name2, is, validate, encode2, types) {
    var _this = _super.call(this, name2, is, validate, encode2) || this;
    _this.types = types;
    _this._tag = "TupleType";
    return _this;
  }
  return TupleType2;
}(Type);
function tuple(codecs, name2) {
  if (name2 === void 0) {
    name2 = "[".concat(codecs.map(function(type2) {
      return type2.name;
    }).join(", "), "]");
  }
  var len = codecs.length;
  return new TupleType(name2, function(u) {
    return UnknownArray.is(u) && u.length === len && codecs.every(function(type2, i) {
      return type2.is(u[i]);
    });
  }, function(u, c) {
    var e = UnknownArray.validate(u, c);
    if (isLeft$1(e)) {
      return e;
    }
    var us = e.right;
    var as = us.length > len ? us.slice(0, len) : us;
    var errors = [];
    for (var i = 0; i < len; i++) {
      var a = us[i];
      var type_3 = codecs[i];
      var result = type_3.validate(a, appendContext(c, String(i), type_3, a));
      if (isLeft$1(result)) {
        pushAll(errors, result.left);
      } else {
        var va = result.right;
        if (va !== a) {
          if (as === us) {
            as = us.slice();
          }
          as[i] = va;
        }
      }
    }
    return errors.length > 0 ? failures(errors) : success(as);
  }, useIdentity(codecs) ? identity : function(a) {
    return codecs.map(function(type2, i) {
      return type2.encode(a[i]);
    });
  }, codecs);
}
var ReadonlyType = function(_super) {
  __extends(ReadonlyType2, _super);
  function ReadonlyType2(name2, is, validate, encode2, type2) {
    var _this = _super.call(this, name2, is, validate, encode2) || this;
    _this.type = type2;
    _this._tag = "ReadonlyType";
    return _this;
  }
  return ReadonlyType2;
}(Type);
function readonly(codec, name2) {
  if (name2 === void 0) {
    name2 = "Readonly<".concat(codec.name, ">");
  }
  return new ReadonlyType(name2, codec.is, codec.validate, codec.encode, codec);
}
var ReadonlyArrayType = function(_super) {
  __extends(ReadonlyArrayType2, _super);
  function ReadonlyArrayType2(name2, is, validate, encode2, type2) {
    var _this = _super.call(this, name2, is, validate, encode2) || this;
    _this.type = type2;
    _this._tag = "ReadonlyArrayType";
    return _this;
  }
  return ReadonlyArrayType2;
}(Type);
function readonlyArray(item, name2) {
  if (name2 === void 0) {
    name2 = "ReadonlyArray<".concat(item.name, ">");
  }
  var codec = array$1(item);
  return new ReadonlyArrayType(name2, codec.is, codec.validate, codec.encode, item);
}
var strict = function(props, name2) {
  return exact(type(props), name2);
};
var ExactType = function(_super) {
  __extends(ExactType2, _super);
  function ExactType2(name2, is, validate, encode2, type2) {
    var _this = _super.call(this, name2, is, validate, encode2) || this;
    _this.type = type2;
    _this._tag = "ExactType";
    return _this;
  }
  return ExactType2;
}(Type);
function exact(codec, name2) {
  if (name2 === void 0) {
    name2 = getExactTypeName(codec);
  }
  var props = getProps(codec);
  return new ExactType(name2, codec.is, function(u, c) {
    var e = UnknownRecord.validate(u, c);
    if (isLeft$1(e)) {
      return e;
    }
    var ce = codec.validate(u, c);
    if (isLeft$1(ce)) {
      return ce;
    }
    return right$1(stripKeys(ce.right, props));
  }, function(a) {
    return codec.encode(stripKeys(a, props));
  }, codec);
}
var FunctionType = function(_super) {
  __extends(FunctionType2, _super);
  function FunctionType2() {
    var _this = _super.call(
      this,
      "Function",
      // tslint:disable-next-line:strict-type-predicates
      function(u) {
        return typeof u === "function";
      },
      function(u, c) {
        return _this.is(u) ? success(u) : failure(u, c);
      },
      identity
    ) || this;
    _this._tag = "FunctionType";
    return _this;
  }
  return FunctionType2;
}(Type);
var Function$1 = new FunctionType();
var NeverType = function(_super) {
  __extends(NeverType2, _super);
  function NeverType2() {
    var _this = _super.call(
      this,
      "never",
      function(_2) {
        return false;
      },
      function(u, c) {
        return failure(u, c);
      },
      /* istanbul ignore next */
      function() {
        throw new Error("cannot encode never");
      }
    ) || this;
    _this._tag = "NeverType";
    return _this;
  }
  return NeverType2;
}(Type);
var never = new NeverType();
var AnyType = function(_super) {
  __extends(AnyType2, _super);
  function AnyType2() {
    var _this = _super.call(this, "any", function(_2) {
      return true;
    }, success, identity) || this;
    _this._tag = "AnyType";
    return _this;
  }
  return AnyType2;
}(Type);
var any = new AnyType();
function refinement(codec, predicate, name2) {
  if (name2 === void 0) {
    name2 = "(".concat(codec.name, " | ").concat(getFunctionName(predicate), ")");
  }
  return new RefinementType(name2, function(u) {
    return codec.is(u) && predicate(u);
  }, function(i, c) {
    var e = codec.validate(i, c);
    if (isLeft$1(e)) {
      return e;
    }
    var a = e.right;
    return predicate(a) ? success(a) : failure(a, c);
  }, codec.encode, codec, predicate);
}
var Integer = refinement(number, Number.isInteger, "Integer");
var TaggedUnionType = function(_super) {
  __extends(TaggedUnionType2, _super);
  function TaggedUnionType2(name2, is, validate, encode2, codecs, tag) {
    var _this = _super.call(this, name2, is, validate, encode2, codecs) || this;
    _this.tag = tag;
    return _this;
  }
  return TaggedUnionType2;
}(UnionType);
var taggedUnion = function(tag, codecs, name2) {
  if (name2 === void 0) {
    name2 = getUnionName(codecs);
  }
  var U = union$4(codecs, name2);
  if (U instanceof TaggedUnionType) {
    return U;
  } else {
    console.warn("[io-ts] Cannot build a tagged union for ".concat(name2, ", returning a de-optimized union"));
    return new TaggedUnionType(name2, U.is, U.validate, U.encode, codecs, tag);
  }
};
var getValidationError = function(value, context) {
  return {
    value,
    context
  };
};
var getDefaultContext = function(decoder) {
  return [
    { key: "", type: decoder }
  ];
};
var Dictionary = UnknownRecord;
var ObjectType = function(_super) {
  __extends(ObjectType2, _super);
  function ObjectType2() {
    var _this = _super.call(this, "object", function(u) {
      return u !== null && typeof u === "object";
    }, function(u, c) {
      return _this.is(u) ? success(u) : failure(u, c);
    }, identity) || this;
    _this._tag = "ObjectType";
    return _this;
  }
  return ObjectType2;
}(Type);
var object = new ObjectType();
var dictionary = record$1;
var StrictType = function(_super) {
  __extends(StrictType2, _super);
  function StrictType2(name2, is, validate, encode2, props) {
    var _this = _super.call(this, name2, is, validate, encode2) || this;
    _this.props = props;
    _this._tag = "StrictType";
    return _this;
  }
  return StrictType2;
}(Type);
function clean(codec) {
  return codec;
}
function alias(codec) {
  return function() {
    return codec;
  };
}
const es6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnyArrayType,
  AnyDictionaryType,
  AnyType,
  Array: UnknownArray,
  ArrayType,
  BigIntType,
  BooleanType,
  Dictionary,
  DictionaryType,
  ExactType,
  Function: Function$1,
  FunctionType,
  Int,
  Integer,
  InterfaceType,
  IntersectionType,
  KeyofType,
  LiteralType,
  NeverType,
  NullType,
  NumberType,
  ObjectType,
  PartialType,
  ReadonlyArrayType,
  ReadonlyType,
  RecursiveType,
  RefinementType,
  StrictType,
  StringType,
  TaggedUnionType,
  TupleType,
  Type,
  UndefinedType,
  UnionType,
  UnknownArray,
  UnknownRecord,
  UnknownType,
  VoidType,
  alias,
  any,
  appendContext,
  array: array$1,
  bigint,
  boolean,
  brand,
  clean,
  dictionary,
  emptyTags,
  exact,
  failure,
  failures,
  getContextEntry,
  getDefaultContext,
  getDomainKeys,
  getFunctionName,
  getIndex,
  getTags,
  getValidationError,
  identity,
  interface: type,
  intersection: intersection$3,
  keyof,
  literal,
  mergeAll,
  never,
  null: nullType,
  nullType,
  number,
  object,
  partial,
  readonly,
  readonlyArray,
  record: record$1,
  recursion,
  refinement,
  strict,
  string,
  success,
  taggedUnion,
  tuple,
  type,
  undefined: undefinedType,
  union: union$4,
  unknown,
  void: voidType,
  voidType
}, Symbol.toStringTag, { value: "Module" }));
const require$$1$1 = /* @__PURE__ */ getAugmentedNamespace(es6);
var Either = {};
var Applicative$3 = {};
var Apply$3 = {};
var _function = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.getEndomorphismMonoid = exports.not = exports.SK = exports.hole = exports.pipe = exports.untupled = exports.tupled = exports.absurd = exports.decrement = exports.increment = exports.tuple = exports.flow = exports.flip = exports.constVoid = exports.constUndefined = exports.constNull = exports.constFalse = exports.constTrue = exports.constant = exports.unsafeCoerce = exports.identity = exports.apply = exports.getRing = exports.getSemiring = exports.getMonoid = exports.getSemigroup = exports.getBooleanAlgebra = void 0;
  var getBooleanAlgebra = function(B) {
    return function() {
      return {
        meet: function(x, y) {
          return function(a) {
            return B.meet(x(a), y(a));
          };
        },
        join: function(x, y) {
          return function(a) {
            return B.join(x(a), y(a));
          };
        },
        zero: function() {
          return B.zero;
        },
        one: function() {
          return B.one;
        },
        implies: function(x, y) {
          return function(a) {
            return B.implies(x(a), y(a));
          };
        },
        not: function(x) {
          return function(a) {
            return B.not(x(a));
          };
        }
      };
    };
  };
  exports.getBooleanAlgebra = getBooleanAlgebra;
  var getSemigroup2 = function(S) {
    return function() {
      return {
        concat: function(f, g) {
          return function(a) {
            return S.concat(f(a), g(a));
          };
        }
      };
    };
  };
  exports.getSemigroup = getSemigroup2;
  var getMonoid2 = function(M) {
    var getSemigroupM = (0, exports.getSemigroup)(M);
    return function() {
      return {
        concat: getSemigroupM().concat,
        empty: function() {
          return M.empty;
        }
      };
    };
  };
  exports.getMonoid = getMonoid2;
  var getSemiring = function(S) {
    return {
      add: function(f, g) {
        return function(x) {
          return S.add(f(x), g(x));
        };
      },
      zero: function() {
        return S.zero;
      },
      mul: function(f, g) {
        return function(x) {
          return S.mul(f(x), g(x));
        };
      },
      one: function() {
        return S.one;
      }
    };
  };
  exports.getSemiring = getSemiring;
  var getRing = function(R) {
    var S = (0, exports.getSemiring)(R);
    return {
      add: S.add,
      mul: S.mul,
      one: S.one,
      zero: S.zero,
      sub: function(f, g) {
        return function(x) {
          return R.sub(f(x), g(x));
        };
      }
    };
  };
  exports.getRing = getRing;
  var apply = function(a) {
    return function(f) {
      return f(a);
    };
  };
  exports.apply = apply;
  function identity2(a) {
    return a;
  }
  exports.identity = identity2;
  exports.unsafeCoerce = identity2;
  function constant2(a) {
    return function() {
      return a;
    };
  }
  exports.constant = constant2;
  exports.constTrue = constant2(true);
  exports.constFalse = constant2(false);
  exports.constNull = constant2(null);
  exports.constUndefined = constant2(void 0);
  exports.constVoid = exports.constUndefined;
  function flip(f) {
    return function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (args.length > 1) {
        return f(args[1], args[0]);
      }
      return function(a) {
        return f(a)(args[0]);
      };
    };
  }
  exports.flip = flip;
  function flow2(ab, bc, cd, de, ef, fg, gh, hi, ij) {
    switch (arguments.length) {
      case 1:
        return ab;
      case 2:
        return function() {
          return bc(ab.apply(this, arguments));
        };
      case 3:
        return function() {
          return cd(bc(ab.apply(this, arguments)));
        };
      case 4:
        return function() {
          return de(cd(bc(ab.apply(this, arguments))));
        };
      case 5:
        return function() {
          return ef(de(cd(bc(ab.apply(this, arguments)))));
        };
      case 6:
        return function() {
          return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
        };
      case 7:
        return function() {
          return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
        };
      case 8:
        return function() {
          return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
        };
      case 9:
        return function() {
          return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
        };
    }
    return;
  }
  exports.flow = flow2;
  function tuple2() {
    var t2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      t2[_i] = arguments[_i];
    }
    return t2;
  }
  exports.tuple = tuple2;
  function increment(n) {
    return n + 1;
  }
  exports.increment = increment;
  function decrement(n) {
    return n - 1;
  }
  exports.decrement = decrement;
  function absurd(_2) {
    throw new Error("Called `absurd` function which should be uncallable");
  }
  exports.absurd = absurd;
  function tupled(f) {
    return function(a) {
      return f.apply(void 0, a);
    };
  }
  exports.tupled = tupled;
  function untupled(f) {
    return function() {
      var a = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
      }
      return f(a);
    };
  }
  exports.untupled = untupled;
  function pipe2(a, ab, bc, cd, de, ef, fg, gh, hi) {
    switch (arguments.length) {
      case 1:
        return a;
      case 2:
        return ab(a);
      case 3:
        return bc(ab(a));
      case 4:
        return cd(bc(ab(a)));
      case 5:
        return de(cd(bc(ab(a))));
      case 6:
        return ef(de(cd(bc(ab(a)))));
      case 7:
        return fg(ef(de(cd(bc(ab(a))))));
      case 8:
        return gh(fg(ef(de(cd(bc(ab(a)))))));
      case 9:
        return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
      default: {
        var ret = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
          ret = arguments[i](ret);
        }
        return ret;
      }
    }
  }
  exports.pipe = pipe2;
  exports.hole = absurd;
  var SK2 = function(_2, b) {
    return b;
  };
  exports.SK = SK2;
  function not2(predicate) {
    return function(a) {
      return !predicate(a);
    };
  }
  exports.not = not2;
  var getEndomorphismMonoid = function() {
    return {
      concat: function(first2, second) {
        return flow2(first2, second);
      },
      empty: identity2
    };
  };
  exports.getEndomorphismMonoid = getEndomorphismMonoid;
})(_function);
var internal = {};
var __spreadArray$3 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(internal, "__esModule", { value: true });
internal.fromReadonlyNonEmptyArray = internal.has = internal.emptyRecord = internal.emptyReadonlyArray = internal.tail = internal.head = internal.isNonEmpty = internal.singleton = internal.right = internal.left = internal.isRight = internal.isLeft = internal.some = internal.none = internal.isSome = internal.isNone = void 0;
var isNone$1 = function(fa) {
  return fa._tag === "None";
};
internal.isNone = isNone$1;
var isSome$1 = function(fa) {
  return fa._tag === "Some";
};
internal.isSome = isSome$1;
internal.none = { _tag: "None" };
var some$4 = function(a) {
  return { _tag: "Some", value: a };
};
internal.some = some$4;
var isLeft = function(ma) {
  return ma._tag === "Left";
};
internal.isLeft = isLeft;
var isRight = function(ma) {
  return ma._tag === "Right";
};
internal.isRight = isRight;
var left = function(e) {
  return { _tag: "Left", left: e };
};
internal.left = left;
var right = function(a) {
  return { _tag: "Right", right: a };
};
internal.right = right;
var singleton$2 = function(a) {
  return [a];
};
internal.singleton = singleton$2;
var isNonEmpty$4 = function(as) {
  return as.length > 0;
};
internal.isNonEmpty = isNonEmpty$4;
var head$4 = function(as) {
  return as[0];
};
internal.head = head$4;
var tail$3 = function(as) {
  return as.slice(1);
};
internal.tail = tail$3;
internal.emptyReadonlyArray = [];
internal.emptyRecord = {};
internal.has = Object.prototype.hasOwnProperty;
var fromReadonlyNonEmptyArray$1 = function(as) {
  return __spreadArray$3([as[0]], as.slice(1), true);
};
internal.fromReadonlyNonEmptyArray = fromReadonlyNonEmptyArray$1;
var __createBinding$4 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: function() {
      return m[k];
    } };
  }
  Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault$4 = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function(o, v) {
  o["default"] = v;
});
var __importStar$4 = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod)
      if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
        __createBinding$4(result, mod, k);
  }
  __setModuleDefault$4(result, mod);
  return result;
};
Object.defineProperty(Apply$3, "__esModule", { value: true });
Apply$3.sequenceS = Apply$3.sequenceT = Apply$3.getApplySemigroup = Apply$3.apS = Apply$3.apSecond = Apply$3.apFirst = Apply$3.ap = void 0;
var function_1$3 = _function;
var _$2 = __importStar$4(internal);
function ap$4(F, G) {
  return function(fa) {
    return function(fab) {
      return F.ap(F.map(fab, function(gab) {
        return function(ga) {
          return G.ap(gab, ga);
        };
      }), fa);
    };
  };
}
Apply$3.ap = ap$4;
function apFirst$3(A) {
  return function(second) {
    return function(first2) {
      return A.ap(A.map(first2, function(a) {
        return function() {
          return a;
        };
      }), second);
    };
  };
}
Apply$3.apFirst = apFirst$3;
function apSecond$3(A) {
  return function(second) {
    return function(first2) {
      return A.ap(A.map(first2, function() {
        return function(b) {
          return b;
        };
      }), second);
    };
  };
}
Apply$3.apSecond = apSecond$3;
function apS$3(F) {
  return function(name2, fb) {
    return function(fa) {
      return F.ap(F.map(fa, function(a) {
        return function(b) {
          var _a2;
          return Object.assign({}, a, (_a2 = {}, _a2[name2] = b, _a2));
        };
      }), fb);
    };
  };
}
Apply$3.apS = apS$3;
function getApplySemigroup$1(F) {
  return function(S) {
    return {
      concat: function(first2, second) {
        return F.ap(F.map(first2, function(x) {
          return function(y) {
            return S.concat(x, y);
          };
        }), second);
      }
    };
  };
}
Apply$3.getApplySemigroup = getApplySemigroup$1;
function curried(f, n, acc) {
  return function(x) {
    var combined = Array(acc.length + 1);
    for (var i = 0; i < acc.length; i++) {
      combined[i] = acc[i];
    }
    combined[acc.length] = x;
    return n === 0 ? f.apply(null, combined) : curried(f, n - 1, combined);
  };
}
var tupleConstructors = {
  1: function(a) {
    return [a];
  },
  2: function(a) {
    return function(b) {
      return [a, b];
    };
  },
  3: function(a) {
    return function(b) {
      return function(c) {
        return [a, b, c];
      };
    };
  },
  4: function(a) {
    return function(b) {
      return function(c) {
        return function(d) {
          return [a, b, c, d];
        };
      };
    };
  },
  5: function(a) {
    return function(b) {
      return function(c) {
        return function(d) {
          return function(e) {
            return [a, b, c, d, e];
          };
        };
      };
    };
  }
};
function getTupleConstructor(len) {
  if (!_$2.has.call(tupleConstructors, len)) {
    tupleConstructors[len] = curried(function_1$3.tuple, len - 1, []);
  }
  return tupleConstructors[len];
}
function sequenceT(F) {
  return function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var len = args.length;
    var f = getTupleConstructor(len);
    var fas = F.map(args[0], f);
    for (var i = 1; i < len; i++) {
      fas = F.ap(fas, args[i]);
    }
    return fas;
  };
}
Apply$3.sequenceT = sequenceT;
function getRecordConstructor(keys2) {
  var len = keys2.length;
  switch (len) {
    case 1:
      return function(a) {
        var _a2;
        return _a2 = {}, _a2[keys2[0]] = a, _a2;
      };
    case 2:
      return function(a) {
        return function(b) {
          var _a2;
          return _a2 = {}, _a2[keys2[0]] = a, _a2[keys2[1]] = b, _a2;
        };
      };
    case 3:
      return function(a) {
        return function(b) {
          return function(c) {
            var _a2;
            return _a2 = {}, _a2[keys2[0]] = a, _a2[keys2[1]] = b, _a2[keys2[2]] = c, _a2;
          };
        };
      };
    case 4:
      return function(a) {
        return function(b) {
          return function(c) {
            return function(d) {
              var _a2;
              return _a2 = {}, _a2[keys2[0]] = a, _a2[keys2[1]] = b, _a2[keys2[2]] = c, _a2[keys2[3]] = d, _a2;
            };
          };
        };
      };
    case 5:
      return function(a) {
        return function(b) {
          return function(c) {
            return function(d) {
              return function(e) {
                var _a2;
                return _a2 = {}, _a2[keys2[0]] = a, _a2[keys2[1]] = b, _a2[keys2[2]] = c, _a2[keys2[3]] = d, _a2[keys2[4]] = e, _a2;
              };
            };
          };
        };
      };
    default:
      return curried(function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        var r = {};
        for (var i = 0; i < len; i++) {
          r[keys2[i]] = args[i];
        }
        return r;
      }, len - 1, []);
  }
}
function sequenceS(F) {
  return function(r) {
    var keys2 = Object.keys(r);
    var len = keys2.length;
    var f = getRecordConstructor(keys2);
    var fr = F.map(r[keys2[0]], f);
    for (var i = 1; i < len; i++) {
      fr = F.ap(fr, r[keys2[i]]);
    }
    return fr;
  };
}
Apply$3.sequenceS = sequenceS;
var Functor$4 = {};
Object.defineProperty(Functor$4, "__esModule", { value: true });
Functor$4.getFunctorComposition = Functor$4.let = Functor$4.bindTo = Functor$4.flap = Functor$4.map = void 0;
var function_1$2 = _function;
function map$6(F, G) {
  return function(f) {
    return function(fa) {
      return F.map(fa, function(ga) {
        return G.map(ga, f);
      });
    };
  };
}
Functor$4.map = map$6;
function flap$4(F) {
  return function(a) {
    return function(fab) {
      return F.map(fab, function(f) {
        return f(a);
      });
    };
  };
}
Functor$4.flap = flap$4;
function bindTo$3(F) {
  return function(name2) {
    return function(fa) {
      return F.map(fa, function(a) {
        var _a2;
        return _a2 = {}, _a2[name2] = a, _a2;
      });
    };
  };
}
Functor$4.bindTo = bindTo$3;
function let_$3(F) {
  return function(name2, f) {
    return function(fa) {
      return F.map(fa, function(a) {
        var _a2;
        return Object.assign({}, a, (_a2 = {}, _a2[name2] = f(a), _a2));
      });
    };
  };
}
Functor$4.let = let_$3;
function getFunctorComposition(F, G) {
  var _map2 = map$6(F, G);
  return {
    map: function(fga, f) {
      return (0, function_1$2.pipe)(fga, _map2(f));
    }
  };
}
Functor$4.getFunctorComposition = getFunctorComposition;
Object.defineProperty(Applicative$3, "__esModule", { value: true });
Applicative$3.getApplicativeComposition = Applicative$3.getApplicativeMonoid = void 0;
var Apply_1 = Apply$3;
var function_1$1 = _function;
var Functor_1 = Functor$4;
function getApplicativeMonoid(F) {
  var f = (0, Apply_1.getApplySemigroup)(F);
  return function(M) {
    return {
      concat: f(M).concat,
      empty: F.of(M.empty)
    };
  };
}
Applicative$3.getApplicativeMonoid = getApplicativeMonoid;
function getApplicativeComposition(F, G) {
  var map2 = (0, Functor_1.getFunctorComposition)(F, G).map;
  var _ap2 = (0, Apply_1.ap)(F, G);
  return {
    map: map2,
    of: function(a) {
      return F.of(G.of(a));
    },
    ap: function(fgab, fga) {
      return (0, function_1$1.pipe)(fgab, _ap2(fga));
    }
  };
}
Applicative$3.getApplicativeComposition = getApplicativeComposition;
var Chain$3 = {};
Object.defineProperty(Chain$3, "__esModule", { value: true });
Chain$3.bind = Chain$3.chainFirst = void 0;
function chainFirst$3(M) {
  return function(f) {
    return function(first2) {
      return M.chain(first2, function(a) {
        return M.map(f(a), function() {
          return a;
        });
      });
    };
  };
}
Chain$3.chainFirst = chainFirst$3;
function bind$6(M) {
  return function(name2, f) {
    return function(ma) {
      return M.chain(ma, function(a) {
        return M.map(f(a), function(b) {
          var _a2;
          return Object.assign({}, a, (_a2 = {}, _a2[name2] = b, _a2));
        });
      });
    };
  };
}
Chain$3.bind = bind$6;
var ChainRec = {};
Object.defineProperty(ChainRec, "__esModule", { value: true });
ChainRec.tailRec = void 0;
var tailRec = function(startWith, f) {
  var ab = f(startWith);
  while (ab._tag === "Left") {
    ab = f(ab.left);
  }
  return ab.right;
};
ChainRec.tailRec = tailRec;
var FromEither$2 = {};
var __createBinding$3 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: function() {
      return m[k];
    } };
  }
  Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault$3 = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function(o, v) {
  o["default"] = v;
});
var __importStar$3 = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod)
      if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
        __createBinding$3(result, mod, k);
  }
  __setModuleDefault$3(result, mod);
  return result;
};
Object.defineProperty(FromEither$2, "__esModule", { value: true });
FromEither$2.filterOrElse = FromEither$2.chainFirstEitherK = FromEither$2.chainEitherK = FromEither$2.fromEitherK = FromEither$2.chainOptionK = FromEither$2.fromOptionK = FromEither$2.fromPredicate = FromEither$2.fromOption = void 0;
var Chain_1 = Chain$3;
var function_1 = _function;
var _$1 = __importStar$3(internal);
function fromOption$1(F) {
  return function(onNone) {
    return function(ma) {
      return F.fromEither(_$1.isNone(ma) ? _$1.left(onNone()) : _$1.right(ma.value));
    };
  };
}
FromEither$2.fromOption = fromOption$1;
function fromPredicate$2(F) {
  return function(predicate, onFalse) {
    return function(a) {
      return F.fromEither(predicate(a) ? _$1.right(a) : _$1.left(onFalse(a)));
    };
  };
}
FromEither$2.fromPredicate = fromPredicate$2;
function fromOptionK$1(F) {
  var fromOptionF = fromOption$1(F);
  return function(onNone) {
    var from = fromOptionF(onNone);
    return function(f) {
      return (0, function_1.flow)(f, from);
    };
  };
}
FromEither$2.fromOptionK = fromOptionK$1;
function chainOptionK(F, M) {
  var fromOptionKF = fromOptionK$1(F);
  return function(onNone) {
    var from = fromOptionKF(onNone);
    return function(f) {
      return function(ma) {
        return M.chain(ma, from(f));
      };
    };
  };
}
FromEither$2.chainOptionK = chainOptionK;
function fromEitherK$2(F) {
  return function(f) {
    return (0, function_1.flow)(f, F.fromEither);
  };
}
FromEither$2.fromEitherK = fromEitherK$2;
function chainEitherK$1(F, M) {
  var fromEitherKF = fromEitherK$2(F);
  return function(f) {
    return function(ma) {
      return M.chain(ma, fromEitherKF(f));
    };
  };
}
FromEither$2.chainEitherK = chainEitherK$1;
function chainFirstEitherK$1(F, M) {
  return (0, function_1.flow)(fromEitherK$2(F), (0, Chain_1.chainFirst)(M));
}
FromEither$2.chainFirstEitherK = chainFirstEitherK$1;
function filterOrElse(F, M) {
  return function(predicate, onFalse) {
    return function(ma) {
      return M.chain(ma, function(a) {
        return F.fromEither(predicate(a) ? _$1.right(a) : _$1.left(onFalse(a)));
      });
    };
  };
}
FromEither$2.filterOrElse = filterOrElse;
var Separated = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.right = exports.left = exports.flap = exports.Functor = exports.Bifunctor = exports.URI = exports.bimap = exports.mapLeft = exports.map = exports.separated = void 0;
  var function_12 = _function;
  var Functor_12 = Functor$4;
  var separated2 = function(left3, right3) {
    return { left: left3, right: right3 };
  };
  exports.separated = separated2;
  var _map2 = function(fa, f) {
    return (0, function_12.pipe)(fa, (0, exports.map)(f));
  };
  var _mapLeft2 = function(fa, f) {
    return (0, function_12.pipe)(fa, (0, exports.mapLeft)(f));
  };
  var _bimap2 = function(fa, g, f) {
    return (0, function_12.pipe)(fa, (0, exports.bimap)(g, f));
  };
  var map2 = function(f) {
    return function(fa) {
      return (0, exports.separated)((0, exports.left)(fa), f((0, exports.right)(fa)));
    };
  };
  exports.map = map2;
  var mapLeft2 = function(f) {
    return function(fa) {
      return (0, exports.separated)(f((0, exports.left)(fa)), (0, exports.right)(fa));
    };
  };
  exports.mapLeft = mapLeft2;
  var bimap2 = function(f, g) {
    return function(fa) {
      return (0, exports.separated)(f((0, exports.left)(fa)), g((0, exports.right)(fa)));
    };
  };
  exports.bimap = bimap2;
  exports.URI = "Separated";
  exports.Bifunctor = {
    URI: exports.URI,
    mapLeft: _mapLeft2,
    bimap: _bimap2
  };
  exports.Functor = {
    URI: exports.URI,
    map: _map2
  };
  exports.flap = (0, Functor_12.flap)(exports.Functor);
  var left2 = function(s) {
    return s.left;
  };
  exports.left = left2;
  var right2 = function(s) {
    return s.right;
  };
  exports.right = right2;
})(Separated);
var Witherable$3 = {};
var __createBinding$2 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: function() {
      return m[k];
    } };
  }
  Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault$2 = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function(o, v) {
  o["default"] = v;
});
var __importStar$2 = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod)
      if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
        __createBinding$2(result, mod, k);
  }
  __setModuleDefault$2(result, mod);
  return result;
};
Object.defineProperty(Witherable$3, "__esModule", { value: true });
Witherable$3.filterE = Witherable$3.witherDefault = Witherable$3.wiltDefault = void 0;
var _ = __importStar$2(internal);
function wiltDefault(T, C) {
  return function(F) {
    var traverseF = T.traverse(F);
    return function(wa, f) {
      return F.map(traverseF(wa, f), C.separate);
    };
  };
}
Witherable$3.wiltDefault = wiltDefault;
function witherDefault(T, C) {
  return function(F) {
    var traverseF = T.traverse(F);
    return function(wa, f) {
      return F.map(traverseF(wa, f), C.compact);
    };
  };
}
Witherable$3.witherDefault = witherDefault;
function filterE$1(W) {
  return function(F) {
    var witherF = W.wither(F);
    return function(predicate) {
      return function(ga) {
        return witherF(ga, function(a) {
          return F.map(predicate(a), function(b) {
            return b ? _.some(a) : _.none;
          });
        });
      };
    };
  };
}
Witherable$3.filterE = filterE$1;
(function(exports) {
  var __createBinding2 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault2 = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar2 = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding2(result, mod, k);
    }
    __setModuleDefault2(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.fold = exports.match = exports.foldW = exports.matchW = exports.isRight = exports.isLeft = exports.fromOption = exports.fromPredicate = exports.FromEither = exports.MonadThrow = exports.throwError = exports.ChainRec = exports.Extend = exports.extend = exports.Alt = exports.alt = exports.altW = exports.Bifunctor = exports.mapLeft = exports.bimap = exports.Traversable = exports.sequence = exports.traverse = exports.Foldable = exports.reduceRight = exports.foldMap = exports.reduce = exports.Monad = exports.Chain = exports.chain = exports.chainW = exports.Applicative = exports.Apply = exports.ap = exports.apW = exports.Pointed = exports.of = exports.Functor = exports.map = exports.getAltValidation = exports.getApplicativeValidation = exports.getWitherable = exports.getFilterable = exports.getCompactable = exports.getSemigroup = exports.getEq = exports.getShow = exports.URI = exports.right = exports.left = void 0;
  exports.getValidation = exports.getValidationMonoid = exports.getValidationSemigroup = exports.getApplyMonoid = exports.getApplySemigroup = exports.either = exports.stringifyJSON = exports.parseJSON = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apSW = exports.apS = exports.bindW = exports.bind = exports.let = exports.bindTo = exports.Do = exports.exists = exports.elem = exports.toError = exports.toUnion = exports.chainNullableK = exports.fromNullableK = exports.tryCatchK = exports.tryCatch = exports.fromNullable = exports.orElse = exports.orElseW = exports.swap = exports.filterOrElseW = exports.filterOrElse = exports.chainOptionK = exports.fromOptionK = exports.duplicate = exports.flatten = exports.flattenW = exports.chainFirstW = exports.chainFirst = exports.apSecondW = exports.apSecond = exports.apFirstW = exports.apFirst = exports.flap = exports.getOrElse = exports.getOrElseW = void 0;
  var Applicative_1 = Applicative$3;
  var Apply_12 = Apply$3;
  var Chain_12 = Chain$3;
  var ChainRec_1 = ChainRec;
  var FromEither_1 = FromEither$2;
  var function_12 = _function;
  var Functor_12 = Functor$4;
  var _2 = __importStar2(internal);
  var Separated_1 = Separated;
  var Witherable_1 = Witherable$3;
  exports.left = _2.left;
  exports.right = _2.right;
  var _map2 = function(fa, f) {
    return (0, function_12.pipe)(fa, (0, exports.map)(f));
  };
  var _ap2 = function(fab, fa) {
    return (0, function_12.pipe)(fab, (0, exports.ap)(fa));
  };
  var _chain2 = function(ma, f) {
    return (0, function_12.pipe)(ma, (0, exports.chain)(f));
  };
  var _reduce2 = function(fa, b, f) {
    return (0, function_12.pipe)(fa, (0, exports.reduce)(b, f));
  };
  var _foldMap2 = function(M) {
    return function(fa, f) {
      var foldMapM = (0, exports.foldMap)(M);
      return (0, function_12.pipe)(fa, foldMapM(f));
    };
  };
  var _reduceRight2 = function(fa, b, f) {
    return (0, function_12.pipe)(fa, (0, exports.reduceRight)(b, f));
  };
  var _traverse2 = function(F) {
    var traverseF = (0, exports.traverse)(F);
    return function(ta, f) {
      return (0, function_12.pipe)(ta, traverseF(f));
    };
  };
  var _bimap2 = function(fa, f, g) {
    return (0, function_12.pipe)(fa, (0, exports.bimap)(f, g));
  };
  var _mapLeft2 = function(fa, f) {
    return (0, function_12.pipe)(fa, (0, exports.mapLeft)(f));
  };
  var _alt2 = function(fa, that) {
    return (0, function_12.pipe)(fa, (0, exports.alt)(that));
  };
  var _extend2 = function(wa, f) {
    return (0, function_12.pipe)(wa, (0, exports.extend)(f));
  };
  var _chainRec2 = function(a, f) {
    return (0, ChainRec_1.tailRec)(f(a), function(e) {
      return (0, exports.isLeft)(e) ? (0, exports.right)((0, exports.left)(e.left)) : (0, exports.isLeft)(e.right) ? (0, exports.left)(f(e.right.left)) : (0, exports.right)((0, exports.right)(e.right.right));
    });
  };
  exports.URI = "Either";
  var getShow2 = function(SE, SA) {
    return {
      show: function(ma) {
        return (0, exports.isLeft)(ma) ? "left(".concat(SE.show(ma.left), ")") : "right(".concat(SA.show(ma.right), ")");
      }
    };
  };
  exports.getShow = getShow2;
  var getEq2 = function(EL, EA) {
    return {
      equals: function(x, y) {
        return x === y || ((0, exports.isLeft)(x) ? (0, exports.isLeft)(y) && EL.equals(x.left, y.left) : (0, exports.isRight)(y) && EA.equals(x.right, y.right));
      }
    };
  };
  exports.getEq = getEq2;
  var getSemigroup2 = function(S) {
    return {
      concat: function(x, y) {
        return (0, exports.isLeft)(y) ? x : (0, exports.isLeft)(x) ? y : (0, exports.right)(S.concat(x.right, y.right));
      }
    };
  };
  exports.getSemigroup = getSemigroup2;
  var getCompactable2 = function(M) {
    var empty2 = (0, exports.left)(M.empty);
    return {
      URI: exports.URI,
      _E: void 0,
      compact: function(ma) {
        return (0, exports.isLeft)(ma) ? ma : ma.right._tag === "None" ? empty2 : (0, exports.right)(ma.right.value);
      },
      separate: function(ma) {
        return (0, exports.isLeft)(ma) ? (0, Separated_1.separated)(ma, ma) : (0, exports.isLeft)(ma.right) ? (0, Separated_1.separated)((0, exports.right)(ma.right.left), empty2) : (0, Separated_1.separated)(empty2, (0, exports.right)(ma.right.right));
      }
    };
  };
  exports.getCompactable = getCompactable2;
  var getFilterable2 = function(M) {
    var empty2 = (0, exports.left)(M.empty);
    var _a2 = (0, exports.getCompactable)(M), compact2 = _a2.compact, separate2 = _a2.separate;
    var filter2 = function(ma, predicate) {
      return (0, exports.isLeft)(ma) ? ma : predicate(ma.right) ? ma : empty2;
    };
    var partition2 = function(ma, p) {
      return (0, exports.isLeft)(ma) ? (0, Separated_1.separated)(ma, ma) : p(ma.right) ? (0, Separated_1.separated)(empty2, (0, exports.right)(ma.right)) : (0, Separated_1.separated)((0, exports.right)(ma.right), empty2);
    };
    return {
      URI: exports.URI,
      _E: void 0,
      map: _map2,
      compact: compact2,
      separate: separate2,
      filter: filter2,
      filterMap: function(ma, f) {
        if ((0, exports.isLeft)(ma)) {
          return ma;
        }
        var ob = f(ma.right);
        return ob._tag === "None" ? empty2 : (0, exports.right)(ob.value);
      },
      partition: partition2,
      partitionMap: function(ma, f) {
        if ((0, exports.isLeft)(ma)) {
          return (0, Separated_1.separated)(ma, ma);
        }
        var e = f(ma.right);
        return (0, exports.isLeft)(e) ? (0, Separated_1.separated)((0, exports.right)(e.left), empty2) : (0, Separated_1.separated)(empty2, (0, exports.right)(e.right));
      }
    };
  };
  exports.getFilterable = getFilterable2;
  var getWitherable2 = function(M) {
    var F_ = (0, exports.getFilterable)(M);
    var C = (0, exports.getCompactable)(M);
    return {
      URI: exports.URI,
      _E: void 0,
      map: _map2,
      compact: F_.compact,
      separate: F_.separate,
      filter: F_.filter,
      filterMap: F_.filterMap,
      partition: F_.partition,
      partitionMap: F_.partitionMap,
      traverse: _traverse2,
      sequence: exports.sequence,
      reduce: _reduce2,
      foldMap: _foldMap2,
      reduceRight: _reduceRight2,
      wither: (0, Witherable_1.witherDefault)(exports.Traversable, C),
      wilt: (0, Witherable_1.wiltDefault)(exports.Traversable, C)
    };
  };
  exports.getWitherable = getWitherable2;
  var getApplicativeValidation2 = function(SE) {
    return {
      URI: exports.URI,
      _E: void 0,
      map: _map2,
      ap: function(fab, fa) {
        return (0, exports.isLeft)(fab) ? (0, exports.isLeft)(fa) ? (0, exports.left)(SE.concat(fab.left, fa.left)) : fab : (0, exports.isLeft)(fa) ? fa : (0, exports.right)(fab.right(fa.right));
      },
      of: exports.of
    };
  };
  exports.getApplicativeValidation = getApplicativeValidation2;
  var getAltValidation2 = function(SE) {
    return {
      URI: exports.URI,
      _E: void 0,
      map: _map2,
      alt: function(me, that) {
        if ((0, exports.isRight)(me)) {
          return me;
        }
        var ea = that();
        return (0, exports.isLeft)(ea) ? (0, exports.left)(SE.concat(me.left, ea.left)) : ea;
      }
    };
  };
  exports.getAltValidation = getAltValidation2;
  var map2 = function(f) {
    return function(fa) {
      return (0, exports.isLeft)(fa) ? fa : (0, exports.right)(f(fa.right));
    };
  };
  exports.map = map2;
  exports.Functor = {
    URI: exports.URI,
    map: _map2
  };
  exports.of = exports.right;
  exports.Pointed = {
    URI: exports.URI,
    of: exports.of
  };
  var apW2 = function(fa) {
    return function(fab) {
      return (0, exports.isLeft)(fab) ? fab : (0, exports.isLeft)(fa) ? fa : (0, exports.right)(fab.right(fa.right));
    };
  };
  exports.apW = apW2;
  exports.ap = exports.apW;
  exports.Apply = {
    URI: exports.URI,
    map: _map2,
    ap: _ap2
  };
  exports.Applicative = {
    URI: exports.URI,
    map: _map2,
    ap: _ap2,
    of: exports.of
  };
  var chainW2 = function(f) {
    return function(ma) {
      return (0, exports.isLeft)(ma) ? ma : f(ma.right);
    };
  };
  exports.chainW = chainW2;
  exports.chain = exports.chainW;
  exports.Chain = {
    URI: exports.URI,
    map: _map2,
    ap: _ap2,
    chain: _chain2
  };
  exports.Monad = {
    URI: exports.URI,
    map: _map2,
    ap: _ap2,
    of: exports.of,
    chain: _chain2
  };
  var reduce2 = function(b, f) {
    return function(fa) {
      return (0, exports.isLeft)(fa) ? b : f(b, fa.right);
    };
  };
  exports.reduce = reduce2;
  var foldMap2 = function(M) {
    return function(f) {
      return function(fa) {
        return (0, exports.isLeft)(fa) ? M.empty : f(fa.right);
      };
    };
  };
  exports.foldMap = foldMap2;
  var reduceRight2 = function(b, f) {
    return function(fa) {
      return (0, exports.isLeft)(fa) ? b : f(fa.right, b);
    };
  };
  exports.reduceRight = reduceRight2;
  exports.Foldable = {
    URI: exports.URI,
    reduce: _reduce2,
    foldMap: _foldMap2,
    reduceRight: _reduceRight2
  };
  var traverse2 = function(F) {
    return function(f) {
      return function(ta) {
        return (0, exports.isLeft)(ta) ? F.of((0, exports.left)(ta.left)) : F.map(f(ta.right), exports.right);
      };
    };
  };
  exports.traverse = traverse2;
  var sequence2 = function(F) {
    return function(ma) {
      return (0, exports.isLeft)(ma) ? F.of((0, exports.left)(ma.left)) : F.map(ma.right, exports.right);
    };
  };
  exports.sequence = sequence2;
  exports.Traversable = {
    URI: exports.URI,
    map: _map2,
    reduce: _reduce2,
    foldMap: _foldMap2,
    reduceRight: _reduceRight2,
    traverse: _traverse2,
    sequence: exports.sequence
  };
  var bimap2 = function(f, g) {
    return function(fa) {
      return (0, exports.isLeft)(fa) ? (0, exports.left)(f(fa.left)) : (0, exports.right)(g(fa.right));
    };
  };
  exports.bimap = bimap2;
  var mapLeft2 = function(f) {
    return function(fa) {
      return (0, exports.isLeft)(fa) ? (0, exports.left)(f(fa.left)) : fa;
    };
  };
  exports.mapLeft = mapLeft2;
  exports.Bifunctor = {
    URI: exports.URI,
    bimap: _bimap2,
    mapLeft: _mapLeft2
  };
  var altW2 = function(that) {
    return function(fa) {
      return (0, exports.isLeft)(fa) ? that() : fa;
    };
  };
  exports.altW = altW2;
  exports.alt = exports.altW;
  exports.Alt = {
    URI: exports.URI,
    map: _map2,
    alt: _alt2
  };
  var extend2 = function(f) {
    return function(wa) {
      return (0, exports.isLeft)(wa) ? wa : (0, exports.right)(f(wa));
    };
  };
  exports.extend = extend2;
  exports.Extend = {
    URI: exports.URI,
    map: _map2,
    extend: _extend2
  };
  exports.ChainRec = {
    URI: exports.URI,
    map: _map2,
    ap: _ap2,
    chain: _chain2,
    chainRec: _chainRec2
  };
  exports.throwError = exports.left;
  exports.MonadThrow = {
    URI: exports.URI,
    map: _map2,
    ap: _ap2,
    of: exports.of,
    chain: _chain2,
    throwError: exports.throwError
  };
  exports.FromEither = {
    URI: exports.URI,
    fromEither: function_12.identity
  };
  exports.fromPredicate = (0, FromEither_1.fromPredicate)(exports.FromEither);
  exports.fromOption = /* @__PURE__ */ (0, FromEither_1.fromOption)(exports.FromEither);
  exports.isLeft = _2.isLeft;
  exports.isRight = _2.isRight;
  var matchW2 = function(onLeft, onRight) {
    return function(ma) {
      return (0, exports.isLeft)(ma) ? onLeft(ma.left) : onRight(ma.right);
    };
  };
  exports.matchW = matchW2;
  exports.foldW = exports.matchW;
  exports.match = exports.matchW;
  exports.fold = exports.match;
  var getOrElseW2 = function(onLeft) {
    return function(ma) {
      return (0, exports.isLeft)(ma) ? onLeft(ma.left) : ma.right;
    };
  };
  exports.getOrElseW = getOrElseW2;
  exports.getOrElse = exports.getOrElseW;
  exports.flap = (0, Functor_12.flap)(exports.Functor);
  exports.apFirst = (0, Apply_12.apFirst)(exports.Apply);
  exports.apFirstW = exports.apFirst;
  exports.apSecond = (0, Apply_12.apSecond)(exports.Apply);
  exports.apSecondW = exports.apSecond;
  exports.chainFirst = /* @__PURE__ */ (0, Chain_12.chainFirst)(exports.Chain);
  exports.chainFirstW = exports.chainFirst;
  exports.flattenW = /* @__PURE__ */ (0, exports.chainW)(function_12.identity);
  exports.flatten = exports.flattenW;
  exports.duplicate = (0, exports.extend)(function_12.identity);
  exports.fromOptionK = /* @__PURE__ */ (0, FromEither_1.fromOptionK)(exports.FromEither);
  exports.chainOptionK = (0, FromEither_1.chainOptionK)(exports.FromEither, exports.Chain);
  exports.filterOrElse = (0, FromEither_1.filterOrElse)(exports.FromEither, exports.Chain);
  exports.filterOrElseW = exports.filterOrElse;
  var swap2 = function(ma) {
    return (0, exports.isLeft)(ma) ? (0, exports.right)(ma.left) : (0, exports.left)(ma.right);
  };
  exports.swap = swap2;
  var orElseW2 = function(onLeft) {
    return function(ma) {
      return (0, exports.isLeft)(ma) ? onLeft(ma.left) : ma;
    };
  };
  exports.orElseW = orElseW2;
  exports.orElse = exports.orElseW;
  var fromNullable2 = function(e) {
    return function(a) {
      return a == null ? (0, exports.left)(e) : (0, exports.right)(a);
    };
  };
  exports.fromNullable = fromNullable2;
  var tryCatch2 = function(f, onThrow) {
    try {
      return (0, exports.right)(f());
    } catch (e) {
      return (0, exports.left)(onThrow(e));
    }
  };
  exports.tryCatch = tryCatch2;
  var tryCatchK2 = function(f, onThrow) {
    return function() {
      var a = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
      }
      return (0, exports.tryCatch)(function() {
        return f.apply(void 0, a);
      }, onThrow);
    };
  };
  exports.tryCatchK = tryCatchK2;
  var fromNullableK2 = function(e) {
    var from = (0, exports.fromNullable)(e);
    return function(f) {
      return (0, function_12.flow)(f, from);
    };
  };
  exports.fromNullableK = fromNullableK2;
  var chainNullableK2 = function(e) {
    var from = (0, exports.fromNullableK)(e);
    return function(f) {
      return (0, exports.chain)(from(f));
    };
  };
  exports.chainNullableK = chainNullableK2;
  exports.toUnion = (0, exports.foldW)(function_12.identity, function_12.identity);
  function toError2(e) {
    return e instanceof Error ? e : new Error(String(e));
  }
  exports.toError = toError2;
  function elem2(E) {
    return function(a, ma) {
      if (ma === void 0) {
        var elemE_1 = elem2(E);
        return function(ma2) {
          return elemE_1(a, ma2);
        };
      }
      return (0, exports.isLeft)(ma) ? false : E.equals(a, ma.right);
    };
  }
  exports.elem = elem2;
  var exists2 = function(predicate) {
    return function(ma) {
      return (0, exports.isLeft)(ma) ? false : predicate(ma.right);
    };
  };
  exports.exists = exists2;
  exports.Do = (0, exports.of)(_2.emptyRecord);
  exports.bindTo = (0, Functor_12.bindTo)(exports.Functor);
  var let_2 = /* @__PURE__ */ (0, Functor_12.let)(exports.Functor);
  exports.let = let_2;
  exports.bind = (0, Chain_12.bind)(exports.Chain);
  exports.bindW = exports.bind;
  exports.apS = (0, Apply_12.apS)(exports.Apply);
  exports.apSW = exports.apS;
  exports.ApT = (0, exports.of)(_2.emptyReadonlyArray);
  var traverseReadonlyNonEmptyArrayWithIndex2 = function(f) {
    return function(as) {
      var e = f(0, _2.head(as));
      if ((0, exports.isLeft)(e)) {
        return e;
      }
      var out = [e.right];
      for (var i = 1; i < as.length; i++) {
        var e_1 = f(i, as[i]);
        if ((0, exports.isLeft)(e_1)) {
          return e_1;
        }
        out.push(e_1.right);
      }
      return (0, exports.right)(out);
    };
  };
  exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex2;
  var traverseReadonlyArrayWithIndex2 = function(f) {
    var g = (0, exports.traverseReadonlyNonEmptyArrayWithIndex)(f);
    return function(as) {
      return _2.isNonEmpty(as) ? g(as) : exports.ApT;
    };
  };
  exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex2;
  exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex;
  var traverseArray2 = function(f) {
    return (0, exports.traverseReadonlyArrayWithIndex)(function(_3, a) {
      return f(a);
    });
  };
  exports.traverseArray = traverseArray2;
  exports.sequenceArray = /* @__PURE__ */ (0, exports.traverseArray)(function_12.identity);
  function parseJSON2(s, onError) {
    return (0, exports.tryCatch)(function() {
      return JSON.parse(s);
    }, onError);
  }
  exports.parseJSON = parseJSON2;
  var stringifyJSON2 = function(u, onError) {
    return (0, exports.tryCatch)(function() {
      var s = JSON.stringify(u);
      if (typeof s !== "string") {
        throw new Error("Converting unsupported structure to JSON");
      }
      return s;
    }, onError);
  };
  exports.stringifyJSON = stringifyJSON2;
  exports.either = {
    URI: exports.URI,
    map: _map2,
    of: exports.of,
    ap: _ap2,
    chain: _chain2,
    reduce: _reduce2,
    foldMap: _foldMap2,
    reduceRight: _reduceRight2,
    traverse: _traverse2,
    sequence: exports.sequence,
    bimap: _bimap2,
    mapLeft: _mapLeft2,
    alt: _alt2,
    extend: _extend2,
    chainRec: _chainRec2,
    throwError: exports.throwError
  };
  exports.getApplySemigroup = /* @__PURE__ */ (0, Apply_12.getApplySemigroup)(exports.Apply);
  exports.getApplyMonoid = /* @__PURE__ */ (0, Applicative_1.getApplicativeMonoid)(exports.Applicative);
  var getValidationSemigroup2 = function(SE, SA) {
    return (0, Apply_12.getApplySemigroup)((0, exports.getApplicativeValidation)(SE))(SA);
  };
  exports.getValidationSemigroup = getValidationSemigroup2;
  var getValidationMonoid2 = function(SE, MA) {
    return (0, Applicative_1.getApplicativeMonoid)((0, exports.getApplicativeValidation)(SE))(MA);
  };
  exports.getValidationMonoid = getValidationMonoid2;
  function getValidation2(SE) {
    var ap2 = (0, exports.getApplicativeValidation)(SE).ap;
    var alt2 = (0, exports.getAltValidation)(SE).alt;
    return {
      URI: exports.URI,
      _E: void 0,
      map: _map2,
      of: exports.of,
      chain: _chain2,
      bimap: _bimap2,
      mapLeft: _mapLeft2,
      reduce: _reduce2,
      foldMap: _foldMap2,
      reduceRight: _reduceRight2,
      extend: _extend2,
      traverse: _traverse2,
      sequence: exports.sequence,
      chainRec: _chainRec2,
      throwError: exports.throwError,
      ap: ap2,
      alt: alt2
    };
  }
  exports.getValidation = getValidation2;
})(Either);
var src = {};
var fromEquals = function(equals) {
  return {
    equals: function(x, y) {
      return x === y || equals(x, y);
    }
  };
};
var eqStrict = {
  equals: function(a, b) {
    return a === b;
  }
};
var equalsDefault = function(compare2) {
  return function(first2, second) {
    return first2 === second || compare2(first2, second) === 0;
  };
};
var fromCompare = function(compare2) {
  return {
    equals: equalsDefault(compare2),
    compare: function(first2, second) {
      return first2 === second ? 0 : compare2(first2, second);
    }
  };
};
var getSemigroup$2 = function() {
  return {
    concat: function(first2, second) {
      return fromCompare(function(a, b) {
        var ox = first2.compare(a, b);
        return ox !== 0 ? ox : second.compare(a, b);
      });
    }
  };
};
var getMonoid$4 = function() {
  return {
    concat: getSemigroup$2().concat,
    empty: fromCompare(function() {
      return 0;
    })
  };
};
var min$3 = function(O) {
  return function(first2, second) {
    return first2 === second || O.compare(first2, second) < 1 ? first2 : second;
  };
};
var max$3 = function(O) {
  return function(first2, second) {
    return first2 === second || O.compare(first2, second) > -1 ? first2 : second;
  };
};
function compare$1(first2, second) {
  return first2 < second ? -1 : first2 > second ? 1 : 0;
}
({
  equals: eqStrict.equals,
  compare: compare$1
});
var min$2 = function(O) {
  return {
    concat: min$3(O)
  };
};
var max$2 = function(O) {
  return {
    concat: max$3(O)
  };
};
var first = function() {
  return { concat: identity$1 };
};
var last$4 = function() {
  return { concat: function(_2, y) {
    return y;
  } };
};
var __spreadArray$2 = globalThis && globalThis.__spreadArray || function(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var isNonEmpty$3 = isNonEmpty$6;
var isOutOfBound$3 = function(i, as) {
  return i < 0 || i >= as.length;
};
var prependW$2 = function(head2) {
  return function(tail2) {
    return __spreadArray$2([head2], tail2, true);
  };
};
var prepend$2 = prependW$2;
var prependAll$2 = function(middle) {
  return function(as) {
    var out = [middle, as[0]];
    for (var i = 1; i < as.length; i++) {
      out.push(middle, as[i]);
    }
    return out;
  };
};
var intersperse$2 = function(middle) {
  return function(as) {
    var rest = tail$2(as);
    return isNonEmpty$3(rest) ? pipe$1(rest, prependAll$2(middle), prepend$2(head$3(as))) : as;
  };
};
var reduce$7 = function(b, f) {
  return reduceWithIndex$6(b, function(_2, b2, a) {
    return f(b2, a);
  });
};
var foldMap$7 = function(S) {
  return function(f) {
    return function(as) {
      return as.slice(1).reduce(function(s, a) {
        return S.concat(s, f(a));
      }, f(as[0]));
    };
  };
};
var reduceRight$7 = function(b, f) {
  return reduceRightWithIndex$6(b, function(_2, b2, a) {
    return f(b2, a);
  });
};
var reduceWithIndex$6 = function(b, f) {
  return function(as) {
    return as.reduce(function(b2, a, i) {
      return f(i, b2, a);
    }, b);
  };
};
var foldMapWithIndex$6 = function(S) {
  return function(f) {
    return function(as) {
      return as.slice(1).reduce(function(s, a, i) {
        return S.concat(s, f(i + 1, a));
      }, f(0, as[0]));
    };
  };
};
var reduceRightWithIndex$6 = function(b, f) {
  return function(as) {
    return as.reduceRight(function(b2, a, i) {
      return f(i, a, b2);
    }, b);
  };
};
var extract$1 = head$5;
var getShow$6 = function(S) {
  return {
    show: function(as) {
      return "[".concat(as.map(S.show).join(", "), "]");
    }
  };
};
var getEq$6 = function(E) {
  return fromEquals(function(xs, ys) {
    return xs.length === ys.length && xs.every(function(x, i) {
      return E.equals(x, ys[i]);
    });
  });
};
var head$3 = extract$1;
var tail$2 = tail$4;
var last$3 = function(as) {
  return as[as.length - 1];
};
var min$1 = function(O) {
  var S = min$2(O);
  return function(as) {
    return as.reduce(S.concat);
  };
};
var max$1 = function(O) {
  var S = max$2(O);
  return function(as) {
    return as.reduce(S.concat);
  };
};
var concatAll$1 = function(S) {
  return function(as) {
    return as.reduce(S.concat);
  };
};
var intercalate$3 = function(S) {
  var concatAllS = concatAll$1(S);
  return function(middle) {
    return flow(intersperse$2(middle), concatAllS);
  };
};
var __spreadArray$1 = globalThis && globalThis.__spreadArray || function(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var isNonEmpty$2 = function(as) {
  return as.length > 0;
};
var isOutOfBound$2 = function(i, as) {
  return i < 0 || i >= as.length;
};
var prependW$1 = function(head2) {
  return function(tail2) {
    return __spreadArray$1([head2], tail2, true);
  };
};
var prepend$1 = prependW$1;
var appendW$1 = function(end) {
  return function(init2) {
    return __spreadArray$1(__spreadArray$1([], init2, true), [end], false);
  };
};
var append$1 = appendW$1;
var unsafeInsertAt$1 = function(i, a, as) {
  if (isNonEmpty$2(as)) {
    var xs = fromReadonlyNonEmptyArray(as);
    xs.splice(i, 0, a);
    return xs;
  }
  return [a];
};
var unsafeUpdateAt$1 = function(i, a, as) {
  var xs = fromReadonlyNonEmptyArray(as);
  xs[i] = a;
  return xs;
};
var uniq$1 = function(E) {
  return function(as) {
    if (as.length === 1) {
      return copy$1(as);
    }
    var out = [head$2(as)];
    var rest = tail$1(as);
    var _loop_1 = function(a2) {
      if (out.every(function(o) {
        return !E.equals(o, a2);
      })) {
        out.push(a2);
      }
    };
    for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
      var a = rest_1[_i];
      _loop_1(a);
    }
    return out;
  };
};
var sortBy$1 = function(ords) {
  if (isNonEmpty$2(ords)) {
    var M = getMonoid$4();
    return sort$1(ords.reduce(M.concat, M.empty));
  }
  return copy$1;
};
var union$3 = function(E) {
  var uniqE = uniq$1(E);
  return function(second) {
    return function(first2) {
      return uniqE(pipe$1(first2, concat$1(second)));
    };
  };
};
var rotate$1 = function(n) {
  return function(as) {
    var len = as.length;
    var m = Math.round(n) % len;
    if (isOutOfBound$2(Math.abs(m), as) || m === 0) {
      return copy$1(as);
    }
    if (m < 0) {
      var _a2 = splitAt$1(-m)(as), f = _a2[0], s = _a2[1];
      return pipe$1(s, concat$1(f));
    } else {
      return rotate$1(m - len)(as);
    }
  };
};
var fromReadonlyNonEmptyArray = fromReadonlyNonEmptyArray$2;
var fromArray = function(as) {
  return isNonEmpty$2(as) ? some$5(as) : none$1;
};
var makeBy$1 = function(f) {
  return function(n) {
    var j = Math.max(0, Math.floor(n));
    var out = [f(0)];
    for (var i = 1; i < j; i++) {
      out.push(f(i));
    }
    return out;
  };
};
var replicate$1 = function(a) {
  return makeBy$1(function() {
    return a;
  });
};
var range$1 = function(start, end) {
  return start <= end ? makeBy$1(function(i) {
    return start + i;
  })(end - start + 1) : [start];
};
var unprepend = function(as) {
  return [head$2(as), tail$1(as)];
};
var unappend = function(as) {
  return [init$1(as), last$2(as)];
};
function concatW$1(second) {
  return function(first2) {
    return first2.concat(second);
  };
}
function concat$1(x, y) {
  return y ? x.concat(y) : function(y2) {
    return y2.concat(x);
  };
}
var reverse$1 = function(as) {
  return __spreadArray$1([last$2(as)], as.slice(0, -1).reverse(), true);
};
function group(E) {
  return function(as) {
    var len = as.length;
    if (len === 0) {
      return [];
    }
    var out = [];
    var head2 = as[0];
    var nea = [head2];
    for (var i = 1; i < len; i++) {
      var a = as[i];
      if (E.equals(a, head2)) {
        nea.push(a);
      } else {
        out.push(nea);
        head2 = a;
        nea = [head2];
      }
    }
    out.push(nea);
    return out;
  };
}
var groupBy = function(f) {
  return function(as) {
    var out = {};
    for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
      var a = as_1[_i];
      var k = f(a);
      if (has$2.call(out, k)) {
        out[k].push(a);
      } else {
        out[k] = [a];
      }
    }
    return out;
  };
};
var sort$1 = function(O) {
  return function(as) {
    return as.slice().sort(O.compare);
  };
};
var insertAt$2 = function(i, a) {
  return function(as) {
    return i < 0 || i > as.length ? none$1 : some$5(unsafeInsertAt$1(i, a, as));
  };
};
var updateAt$2 = function(i, a) {
  return modifyAt$2(i, function() {
    return a;
  });
};
var modifyAt$2 = function(i, f) {
  return function(as) {
    return isOutOfBound$2(i, as) ? none$1 : some$5(unsafeUpdateAt$1(i, f(as[i]), as));
  };
};
var copy$1 = fromReadonlyNonEmptyArray;
var of$2 = function(a) {
  return [a];
};
var zipWith$1 = function(as, bs, f) {
  var cs = [f(as[0], bs[0])];
  var len = Math.min(as.length, bs.length);
  for (var i = 1; i < len; i++) {
    cs[i] = f(as[i], bs[i]);
  }
  return cs;
};
function zip$1(as, bs) {
  if (bs === void 0) {
    return function(bs2) {
      return zip$1(bs2, as);
    };
  }
  return zipWith$1(as, bs, function(a, b) {
    return [a, b];
  });
}
var unzip$1 = function(abs) {
  var fa = [abs[0][0]];
  var fb = [abs[0][1]];
  for (var i = 1; i < abs.length; i++) {
    fa[i] = abs[i][0];
    fb[i] = abs[i][1];
  }
  return [fa, fb];
};
var prependAll$1 = function(middle) {
  return function(as) {
    var out = [middle, as[0]];
    for (var i = 1; i < as.length; i++) {
      out.push(middle, as[i]);
    }
    return out;
  };
};
var intersperse$1 = function(middle) {
  return function(as) {
    var rest = tail$1(as);
    return isNonEmpty$2(rest) ? pipe$1(rest, prependAll$1(middle), prepend$1(head$2(as))) : copy$1(as);
  };
};
var foldMapWithIndex$5 = foldMapWithIndex$6;
var foldMap$6 = foldMap$7;
var chainWithIndex$1 = function(f) {
  return function(as) {
    var out = fromReadonlyNonEmptyArray(f(0, head$2(as)));
    for (var i = 1; i < as.length; i++) {
      out.push.apply(out, f(i, as[i]));
    }
    return out;
  };
};
var chop$1 = function(f) {
  return function(as) {
    var _a2 = f(as), b = _a2[0], rest = _a2[1];
    var out = [b];
    var next = rest;
    while (isNonEmpty$2(next)) {
      var _b = f(next), b_1 = _b[0], rest_2 = _b[1];
      out.push(b_1);
      next = rest_2;
    }
    return out;
  };
};
var splitAt$1 = function(n) {
  return function(as) {
    var m = Math.max(1, n);
    return m >= as.length ? [copy$1(as), []] : [pipe$1(as.slice(1, m), prepend$1(head$2(as))), as.slice(m)];
  };
};
var chunksOf$1 = function(n) {
  return chop$1(splitAt$1(n));
};
var _map$4 = function(fa, f) {
  return pipe$1(fa, map$5(f));
};
var _mapWithIndex$3 = function(fa, f) {
  return pipe$1(fa, mapWithIndex$4(f));
};
var _ap$2 = function(fab, fa) {
  return pipe$1(fab, ap$3(fa));
};
var _chain$2 = function(ma, f) {
  return pipe$1(ma, chain$3(f));
};
var _extend$2 = function(wa, f) {
  return pipe$1(wa, extend$4(f));
};
var _reduce$4 = function(fa, b, f) {
  return pipe$1(fa, reduce$6(b, f));
};
var _foldMap$4 = function(M) {
  var foldMapM = foldMap$6(M);
  return function(fa, f) {
    return pipe$1(fa, foldMapM(f));
  };
};
var _reduceRight$4 = function(fa, b, f) {
  return pipe$1(fa, reduceRight$6(b, f));
};
var _traverse$4 = function(F) {
  var traverseF = traverse$4(F);
  return function(ta, f) {
    return pipe$1(ta, traverseF(f));
  };
};
var _alt$2 = function(fa, that) {
  return pipe$1(fa, alt$3(that));
};
var _reduceWithIndex$3 = function(fa, b, f) {
  return pipe$1(fa, reduceWithIndex$5(b, f));
};
var _foldMapWithIndex$3 = function(M) {
  var foldMapWithIndexM = foldMapWithIndex$5(M);
  return function(fa, f) {
    return pipe$1(fa, foldMapWithIndexM(f));
  };
};
var _reduceRightWithIndex$3 = function(fa, b, f) {
  return pipe$1(fa, reduceRightWithIndex$5(b, f));
};
var _traverseWithIndex$3 = function(F) {
  var traverseWithIndexF = traverseWithIndex$3(F);
  return function(ta, f) {
    return pipe$1(ta, traverseWithIndexF(f));
  };
};
var altW$2 = function(that) {
  return function(as) {
    return pipe$1(as, concatW$1(that()));
  };
};
var alt$3 = altW$2;
var ap$3 = function(as) {
  return chain$3(function(f) {
    return pipe$1(as, map$5(f));
  });
};
var chain$3 = function(f) {
  return chainWithIndex$1(function(_2, a) {
    return f(a);
  });
};
var extend$4 = function(f) {
  return function(as) {
    var next = tail$1(as);
    var out = [f(as)];
    while (isNonEmpty$2(next)) {
      out.push(f(next));
      next = tail$1(next);
    }
    return out;
  };
};
var duplicate$2 = /* @__PURE__ */ extend$4(identity$1);
var flatten$2 = /* @__PURE__ */ chain$3(identity$1);
var map$5 = function(f) {
  return mapWithIndex$4(function(_2, a) {
    return f(a);
  });
};
var mapWithIndex$4 = function(f) {
  return function(as) {
    var out = [f(0, head$2(as))];
    for (var i = 1; i < as.length; i++) {
      out.push(f(i, as[i]));
    }
    return out;
  };
};
var reduce$6 = reduce$7;
var reduceWithIndex$5 = reduceWithIndex$6;
var reduceRight$6 = reduceRight$7;
var reduceRightWithIndex$5 = reduceRightWithIndex$6;
var traverse$4 = function(F) {
  var traverseWithIndexF = traverseWithIndex$3(F);
  return function(f) {
    return traverseWithIndexF(function(_2, a) {
      return f(a);
    });
  };
};
var sequence$4 = function(F) {
  return traverseWithIndex$3(F)(function(_2, a) {
    return a;
  });
};
var traverseWithIndex$3 = function(F) {
  return function(f) {
    return function(as) {
      var out = F.map(f(0, head$2(as)), of$2);
      for (var i = 1; i < as.length; i++) {
        out = F.ap(F.map(out, function(bs) {
          return function(b) {
            return pipe$1(bs, append$1(b));
          };
        }), f(i, as[i]));
      }
      return out;
    };
  };
};
var extract = head$3;
var URI$3 = "NonEmptyArray";
var getShow$5 = getShow$6;
var getSemigroup$1 = function() {
  return {
    concat: concat$1
  };
};
var getEq$5 = getEq$6;
var getUnionSemigroup$2 = function(E) {
  var unionE = union$3(E);
  return {
    concat: function(first2, second) {
      return unionE(second)(first2);
    }
  };
};
var Functor$3 = {
  URI: URI$3,
  map: _map$4
};
var flap$3 = /* @__PURE__ */ flap$6(Functor$3);
var Pointed$2 = {
  URI: URI$3,
  of: of$2
};
var FunctorWithIndex$2 = {
  URI: URI$3,
  map: _map$4,
  mapWithIndex: _mapWithIndex$3
};
var Apply$2 = {
  URI: URI$3,
  map: _map$4,
  ap: _ap$2
};
var apFirst$2 = /* @__PURE__ */ apFirst$5(Apply$2);
var apSecond$2 = /* @__PURE__ */ apSecond$5(Apply$2);
var Applicative$2 = {
  URI: URI$3,
  map: _map$4,
  ap: _ap$2,
  of: of$2
};
var Chain$2 = {
  URI: URI$3,
  map: _map$4,
  ap: _ap$2,
  chain: _chain$2
};
var chainFirst$2 = /* @__PURE__ */ chainFirst$5(Chain$2);
var Monad$2 = {
  URI: URI$3,
  map: _map$4,
  ap: _ap$2,
  of: of$2,
  chain: _chain$2
};
var Foldable$3 = {
  URI: URI$3,
  reduce: _reduce$4,
  foldMap: _foldMap$4,
  reduceRight: _reduceRight$4
};
var FoldableWithIndex$2 = {
  URI: URI$3,
  reduce: _reduce$4,
  foldMap: _foldMap$4,
  reduceRight: _reduceRight$4,
  reduceWithIndex: _reduceWithIndex$3,
  foldMapWithIndex: _foldMapWithIndex$3,
  reduceRightWithIndex: _reduceRightWithIndex$3
};
var Traversable$3 = {
  URI: URI$3,
  map: _map$4,
  reduce: _reduce$4,
  foldMap: _foldMap$4,
  reduceRight: _reduceRight$4,
  traverse: _traverse$4,
  sequence: sequence$4
};
var TraversableWithIndex$2 = {
  URI: URI$3,
  map: _map$4,
  mapWithIndex: _mapWithIndex$3,
  reduce: _reduce$4,
  foldMap: _foldMap$4,
  reduceRight: _reduceRight$4,
  traverse: _traverse$4,
  sequence: sequence$4,
  reduceWithIndex: _reduceWithIndex$3,
  foldMapWithIndex: _foldMapWithIndex$3,
  reduceRightWithIndex: _reduceRightWithIndex$3,
  traverseWithIndex: _traverseWithIndex$3
};
var Alt$2 = {
  URI: URI$3,
  map: _map$4,
  alt: _alt$2
};
var Comonad = {
  URI: URI$3,
  map: _map$4,
  extend: _extend$2,
  extract
};
var Do$2 = /* @__PURE__ */ of$2(emptyRecord);
var bindTo$2 = /* @__PURE__ */ bindTo$5(Functor$3);
var let_$2 = /* @__PURE__ */ let_$5(Functor$3);
var bind$5 = /* @__PURE__ */ bind$8(Chain$2);
var apS$2 = /* @__PURE__ */ apS$5(Apply$2);
var head$2 = head$3;
var tail$1 = function(as) {
  return as.slice(1);
};
var last$2 = last$3;
var init$1 = function(as) {
  return as.slice(0, -1);
};
var min = min$1;
var max = max$1;
var concatAll = function(S) {
  return function(as) {
    return as.reduce(S.concat);
  };
};
var matchLeft$1 = function(f) {
  return function(as) {
    return f(head$2(as), tail$1(as));
  };
};
var matchRight$1 = function(f) {
  return function(as) {
    return f(init$1(as), last$2(as));
  };
};
var modifyHead = function(f) {
  return function(as) {
    return __spreadArray$1([f(head$2(as))], tail$1(as), true);
  };
};
var updateHead = function(a) {
  return modifyHead(function() {
    return a;
  });
};
var modifyLast = function(f) {
  return function(as) {
    return pipe$1(init$1(as), append$1(f(last$2(as))));
  };
};
var updateLast = function(a) {
  return modifyLast(function() {
    return a;
  });
};
var intercalate$2 = intercalate$3;
function groupSort(O) {
  var sortO = sort$1(O);
  var groupO = group(O);
  return function(as) {
    return isNonEmpty$2(as) ? groupO(sortO(as)) : [];
  };
}
function filter$5(predicate) {
  return filterWithIndex$4(function(_2, a) {
    return predicate(a);
  });
}
var filterWithIndex$4 = function(predicate) {
  return function(as) {
    return fromArray(as.filter(function(a, i) {
      return predicate(i, a);
    }));
  };
};
var uncons = unprepend;
var unsnoc = unappend;
function cons$1(head2, tail2) {
  return tail2 === void 0 ? prepend$1(head2) : pipe$1(tail2, prepend$1(head2));
}
var snoc$1 = function(init2, end) {
  return pipe$1(init2, append$1(end));
};
var prependToAll$1 = prependAll$1;
var fold$1 = concatAll$1;
var nonEmptyArray = {
  URI: URI$3,
  of: of$2,
  map: _map$4,
  mapWithIndex: _mapWithIndex$3,
  ap: _ap$2,
  chain: _chain$2,
  extend: _extend$2,
  extract,
  reduce: _reduce$4,
  foldMap: _foldMap$4,
  reduceRight: _reduceRight$4,
  traverse: _traverse$4,
  sequence: sequence$4,
  reduceWithIndex: _reduceWithIndex$3,
  foldMapWithIndex: _foldMapWithIndex$3,
  reduceRightWithIndex: _reduceRightWithIndex$3,
  traverseWithIndex: _traverseWithIndex$3,
  alt: _alt$2
};
const NonEmptyArray = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Alt: Alt$2,
  Applicative: Applicative$2,
  Apply: Apply$2,
  Chain: Chain$2,
  Comonad,
  Do: Do$2,
  Foldable: Foldable$3,
  FoldableWithIndex: FoldableWithIndex$2,
  Functor: Functor$3,
  FunctorWithIndex: FunctorWithIndex$2,
  Monad: Monad$2,
  Pointed: Pointed$2,
  Traversable: Traversable$3,
  TraversableWithIndex: TraversableWithIndex$2,
  URI: URI$3,
  alt: alt$3,
  altW: altW$2,
  ap: ap$3,
  apFirst: apFirst$2,
  apS: apS$2,
  apSecond: apSecond$2,
  append: append$1,
  appendW: appendW$1,
  bind: bind$5,
  bindTo: bindTo$2,
  chain: chain$3,
  chainFirst: chainFirst$2,
  chainWithIndex: chainWithIndex$1,
  chop: chop$1,
  chunksOf: chunksOf$1,
  concat: concat$1,
  concatAll,
  concatW: concatW$1,
  cons: cons$1,
  copy: copy$1,
  duplicate: duplicate$2,
  extend: extend$4,
  extract,
  filter: filter$5,
  filterWithIndex: filterWithIndex$4,
  flap: flap$3,
  flatten: flatten$2,
  fold: fold$1,
  foldMap: foldMap$6,
  foldMapWithIndex: foldMapWithIndex$5,
  fromArray,
  fromReadonlyNonEmptyArray,
  getEq: getEq$5,
  getSemigroup: getSemigroup$1,
  getShow: getShow$5,
  getUnionSemigroup: getUnionSemigroup$2,
  group,
  groupBy,
  groupSort,
  head: head$2,
  init: init$1,
  insertAt: insertAt$2,
  intercalate: intercalate$2,
  intersperse: intersperse$1,
  isNonEmpty: isNonEmpty$2,
  isOutOfBound: isOutOfBound$2,
  last: last$2,
  let: let_$2,
  makeBy: makeBy$1,
  map: map$5,
  mapWithIndex: mapWithIndex$4,
  matchLeft: matchLeft$1,
  matchRight: matchRight$1,
  max,
  min,
  modifyAt: modifyAt$2,
  modifyHead,
  modifyLast,
  nonEmptyArray,
  of: of$2,
  prepend: prepend$1,
  prependAll: prependAll$1,
  prependToAll: prependToAll$1,
  prependW: prependW$1,
  range: range$1,
  reduce: reduce$6,
  reduceRight: reduceRight$6,
  reduceRightWithIndex: reduceRightWithIndex$5,
  reduceWithIndex: reduceWithIndex$5,
  replicate: replicate$1,
  reverse: reverse$1,
  rotate: rotate$1,
  sequence: sequence$4,
  snoc: snoc$1,
  sort: sort$1,
  sortBy: sortBy$1,
  splitAt: splitAt$1,
  tail: tail$1,
  traverse: traverse$4,
  traverseWithIndex: traverseWithIndex$3,
  unappend,
  uncons,
  union: union$3,
  uniq: uniq$1,
  unprepend,
  unsafeInsertAt: unsafeInsertAt$1,
  unsafeUpdateAt: unsafeUpdateAt$1,
  unsnoc,
  unzip: unzip$1,
  updateAt: updateAt$2,
  updateHead,
  updateLast,
  zip: zip$1,
  zipWith: zipWith$1
}, Symbol.toStringTag, { value: "Module" }));
var Eq$1 = {
  equals: function(first2, second) {
    return first2 === second;
  }
};
var Ord$1 = {
  equals: Eq$1.equals,
  compare: function(first2, second) {
    return first2 < second ? -1 : first2 > second ? 1 : 0;
  }
};
function guard$2(F, P) {
  return function(b) {
    return b ? P.of(void 0) : F.zero();
  };
}
var __spreadArray = globalThis && globalThis.__spreadArray || function(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var isNonEmpty$1 = isNonEmpty$3;
var matchW$2 = function(onEmpty, onNonEmpty) {
  return function(as) {
    return isNonEmpty$1(as) ? onNonEmpty(as) : onEmpty();
  };
};
var match$2 = matchW$2;
var isOutOfBound$1 = isOutOfBound$3;
function lookup$3(i, as) {
  return as === void 0 ? function(as2) {
    return lookup$3(i, as2);
  } : isOutOfBound$1(i, as) ? none$1 : some$5(as[i]);
}
var head$1 = function(as) {
  return isNonEmpty$1(as) ? some$5(head$3(as)) : none$1;
};
var last$1 = function(as) {
  return isNonEmpty$1(as) ? some$5(last$3(as)) : none$1;
};
var findIndex$1 = function(predicate) {
  return function(as) {
    for (var i = 0; i < as.length; i++) {
      if (predicate(as[i])) {
        return some$5(i);
      }
    }
    return none$1;
  };
};
function findFirst$1(predicate) {
  return function(as) {
    for (var i = 0; i < as.length; i++) {
      if (predicate(as[i])) {
        return some$5(as[i]);
      }
    }
    return none$1;
  };
}
var findFirstMap$1 = function(f) {
  return function(as) {
    for (var i = 0; i < as.length; i++) {
      var out = f(as[i]);
      if (isSome$2(out)) {
        return out;
      }
    }
    return none$1;
  };
};
function findLast$1(predicate) {
  return function(as) {
    for (var i = as.length - 1; i >= 0; i--) {
      if (predicate(as[i])) {
        return some$5(as[i]);
      }
    }
    return none$1;
  };
}
var findLastMap$1 = function(f) {
  return function(as) {
    for (var i = as.length - 1; i >= 0; i--) {
      var out = f(as[i]);
      if (isSome$2(out)) {
        return out;
      }
    }
    return none$1;
  };
};
var findLastIndex$1 = function(predicate) {
  return function(as) {
    for (var i = as.length - 1; i >= 0; i--) {
      if (predicate(as[i])) {
        return some$5(i);
      }
    }
    return none$1;
  };
};
function elem$4(E) {
  return function(a, as) {
    if (as === void 0) {
      var elemE_1 = elem$4(E);
      return function(as2) {
        return elemE_1(a, as2);
      };
    }
    var predicate = function(element) {
      return E.equals(element, a);
    };
    var i = 0;
    for (; i < as.length; i++) {
      if (predicate(as[i])) {
        return true;
      }
    }
    return false;
  };
}
var _chainRecDepthFirst$1 = function(a, f) {
  return pipe$1(a, chainRecDepthFirst$1(f));
};
var _chainRecBreadthFirst$1 = function(a, f) {
  return pipe$1(a, chainRecBreadthFirst$1(f));
};
var foldMapWithIndex$4 = function(M) {
  return function(f) {
    return function(fa) {
      return fa.reduce(function(b, a, i) {
        return M.concat(b, f(i, a));
      }, M.empty);
    };
  };
};
var reduce$5 = function(b, f) {
  return reduceWithIndex$4(b, function(_2, b2, a) {
    return f(b2, a);
  });
};
var foldMap$5 = function(M) {
  var foldMapWithIndexM = foldMapWithIndex$4(M);
  return function(f) {
    return foldMapWithIndexM(function(_2, a) {
      return f(a);
    });
  };
};
var reduceWithIndex$4 = function(b, f) {
  return function(fa) {
    var len = fa.length;
    var out = b;
    for (var i = 0; i < len; i++) {
      out = f(i, out, fa[i]);
    }
    return out;
  };
};
var reduceRight$5 = function(b, f) {
  return reduceRightWithIndex$4(b, function(_2, a, b2) {
    return f(a, b2);
  });
};
var reduceRightWithIndex$4 = function(b, f) {
  return function(fa) {
    return fa.reduceRight(function(b2, a, i) {
      return f(i, a, b2);
    }, b);
  };
};
var getShow$4 = function(S) {
  return {
    show: function(as) {
      return "[".concat(as.map(S.show).join(", "), "]");
    }
  };
};
var getEq$4 = function(E) {
  return fromEquals(function(xs, ys) {
    return xs.length === ys.length && xs.every(function(x, i) {
      return E.equals(x, ys[i]);
    });
  });
};
var getOrd$2 = function(O) {
  return fromCompare(function(a, b) {
    var aLen = a.length;
    var bLen = b.length;
    var len = Math.min(aLen, bLen);
    for (var i = 0; i < len; i++) {
      var ordering = O.compare(a[i], b[i]);
      if (ordering !== 0) {
        return ordering;
      }
    }
    return Ord$1.compare(aLen, bLen);
  });
};
var chainRecDepthFirst$1 = function(f) {
  return function(a) {
    var todo = __spreadArray([], f(a), true);
    var out = [];
    while (todo.length > 0) {
      var e = todo.shift();
      if (isLeft$2(e)) {
        todo.unshift.apply(todo, f(e.left));
      } else {
        out.push(e.right);
      }
    }
    return out;
  };
};
var chainRecBreadthFirst$1 = function(f) {
  return function(a) {
    var initial = f(a);
    var todo = [];
    var out = [];
    function go(e2) {
      if (isLeft$2(e2)) {
        f(e2.left).forEach(function(v) {
          return todo.push(v);
        });
      } else {
        out.push(e2.right);
      }
    }
    for (var _i = 0, initial_1 = initial; _i < initial_1.length; _i++) {
      var e = initial_1[_i];
      go(e);
    }
    while (todo.length > 0) {
      go(todo.shift());
    }
    return out;
  };
};
function every$3(predicate) {
  return function(as) {
    return as.every(predicate);
  };
}
var intercalate$1 = function(M) {
  var intercalateM = intercalate$3(M);
  return function(middle) {
    return match$2(function() {
      return M.empty;
    }, intercalateM(middle));
  };
};
var isEmpty$2 = function(as) {
  return as.length === 0;
};
var isNonEmpty = isNonEmpty$2;
var prepend = prepend$1;
var prependW = prependW$1;
var append = append$1;
var appendW = appendW$1;
var makeBy = function(n, f) {
  return n <= 0 ? [] : makeBy$1(f)(n);
};
var replicate = function(n, a) {
  return makeBy(n, function() {
    return a;
  });
};
function fromPredicate$1(predicate) {
  return function(a) {
    return predicate(a) ? [a] : [];
  };
}
var fromOption = function(ma) {
  return isNone$2(ma) ? [] : [ma.value];
};
var fromEither$1 = function(e) {
  return isLeft$2(e) ? [] : [e.right];
};
var matchW$1 = function(onEmpty, onNonEmpty) {
  return function(as) {
    return isNonEmpty(as) ? onNonEmpty(as) : onEmpty();
  };
};
var match$1 = matchW$1;
var matchLeftW = function(onEmpty, onNonEmpty) {
  return function(as) {
    return isNonEmpty(as) ? onNonEmpty(head$2(as), tail$1(as)) : onEmpty();
  };
};
var matchLeft = matchLeftW;
var foldLeft = matchLeft;
var matchRightW = function(onEmpty, onNonEmpty) {
  return function(as) {
    return isNonEmpty(as) ? onNonEmpty(init$1(as), last$2(as)) : onEmpty();
  };
};
var matchRight = matchRightW;
var foldRight = matchRight;
var chainWithIndex = function(f) {
  return function(as) {
    var out = [];
    for (var i = 0; i < as.length; i++) {
      out.push.apply(out, f(i, as[i]));
    }
    return out;
  };
};
var scanLeft = function(b, f) {
  return function(as) {
    var len = as.length;
    var out = new Array(len + 1);
    out[0] = b;
    for (var i = 0; i < len; i++) {
      out[i + 1] = f(out[i], as[i]);
    }
    return out;
  };
};
var scanRight = function(b, f) {
  return function(as) {
    var len = as.length;
    var out = new Array(len + 1);
    out[len] = b;
    for (var i = len - 1; i >= 0; i--) {
      out[i] = f(as[i], out[i + 1]);
    }
    return out;
  };
};
var size$2 = function(as) {
  return as.length;
};
var isOutOfBound = isOutOfBound$2;
var lookup$2 = lookup$3;
var head = head$1;
var last = last$1;
var tail = function(as) {
  return isNonEmpty(as) ? some$5(tail$1(as)) : none$1;
};
var init = function(as) {
  return isNonEmpty(as) ? some$5(init$1(as)) : none$1;
};
var takeLeft = function(n) {
  return function(as) {
    return isOutOfBound(n, as) ? copy(as) : as.slice(0, n);
  };
};
var takeRight = function(n) {
  return function(as) {
    return isOutOfBound(n, as) ? copy(as) : n === 0 ? [] : as.slice(-n);
  };
};
function takeLeftWhile(predicate) {
  return function(as) {
    var out = [];
    for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
      var a = as_1[_i];
      if (!predicate(a)) {
        break;
      }
      out.push(a);
    }
    return out;
  };
}
var spanLeftIndex = function(as, predicate) {
  var l = as.length;
  var i = 0;
  for (; i < l; i++) {
    if (!predicate(as[i])) {
      break;
    }
  }
  return i;
};
function spanLeft(predicate) {
  return function(as) {
    var _a2 = splitAt(spanLeftIndex(as, predicate))(as), init2 = _a2[0], rest = _a2[1];
    return { init: init2, rest };
  };
}
var dropLeft = function(n) {
  return function(as) {
    return n <= 0 || isEmpty$2(as) ? copy(as) : n >= as.length ? [] : as.slice(n, as.length);
  };
};
var dropRight = function(n) {
  return function(as) {
    return n <= 0 || isEmpty$2(as) ? copy(as) : n >= as.length ? [] : as.slice(0, as.length - n);
  };
};
function dropLeftWhile(predicate) {
  return function(as) {
    return as.slice(spanLeftIndex(as, predicate));
  };
}
var findIndex = findIndex$1;
function findFirst(predicate) {
  return findFirst$1(predicate);
}
var findFirstMap = findFirstMap$1;
function findLast(predicate) {
  return findLast$1(predicate);
}
var findLastMap = findLastMap$1;
var findLastIndex = findLastIndex$1;
var copy = function(as) {
  return as.slice();
};
var insertAt$1 = function(i, a) {
  return function(as) {
    return i < 0 || i > as.length ? none$1 : some$5(unsafeInsertAt(i, a, as));
  };
};
var updateAt$1 = function(i, a) {
  return modifyAt$1(i, function() {
    return a;
  });
};
var deleteAt$1 = function(i) {
  return function(as) {
    return isOutOfBound(i, as) ? none$1 : some$5(unsafeDeleteAt(i, as));
  };
};
var modifyAt$1 = function(i, f) {
  return function(as) {
    return isOutOfBound(i, as) ? none$1 : some$5(unsafeUpdateAt(i, f(as[i]), as));
  };
};
var reverse = function(as) {
  return isEmpty$2(as) ? [] : as.slice().reverse();
};
var rights = function(as) {
  var r = [];
  for (var i = 0; i < as.length; i++) {
    var a = as[i];
    if (a._tag === "Right") {
      r.push(a.right);
    }
  }
  return r;
};
var lefts = function(as) {
  var r = [];
  for (var i = 0; i < as.length; i++) {
    var a = as[i];
    if (a._tag === "Left") {
      r.push(a.left);
    }
  }
  return r;
};
var sort = function(O) {
  return function(as) {
    return as.length <= 1 ? copy(as) : as.slice().sort(O.compare);
  };
};
var zipWith = function(fa, fb, f) {
  var fc = [];
  var len = Math.min(fa.length, fb.length);
  for (var i = 0; i < len; i++) {
    fc[i] = f(fa[i], fb[i]);
  }
  return fc;
};
function zip(as, bs) {
  if (bs === void 0) {
    return function(bs2) {
      return zip(bs2, as);
    };
  }
  return zipWith(as, bs, function(a, b) {
    return [a, b];
  });
}
var unzip = function(as) {
  var fa = [];
  var fb = [];
  for (var i = 0; i < as.length; i++) {
    fa[i] = as[i][0];
    fb[i] = as[i][1];
  }
  return [fa, fb];
};
var prependAll = function(middle) {
  var f = prependAll$1(middle);
  return function(as) {
    return isNonEmpty(as) ? f(as) : [];
  };
};
var intersperse = function(middle) {
  var f = intersperse$1(middle);
  return function(as) {
    return isNonEmpty(as) ? f(as) : copy(as);
  };
};
var rotate = function(n) {
  var f = rotate$1(n);
  return function(as) {
    return isNonEmpty(as) ? f(as) : copy(as);
  };
};
var elem$3 = elem$4;
var uniq = function(E) {
  var f = uniq$1(E);
  return function(as) {
    return isNonEmpty(as) ? f(as) : copy(as);
  };
};
var sortBy = function(ords) {
  var f = sortBy$1(ords);
  return function(as) {
    return isNonEmpty(as) ? f(as) : copy(as);
  };
};
var chop = function(f) {
  var g = chop$1(f);
  return function(as) {
    return isNonEmpty(as) ? g(as) : [];
  };
};
var splitAt = function(n) {
  return function(as) {
    return n >= 1 && isNonEmpty(as) ? splitAt$1(n)(as) : isEmpty$2(as) ? [copy(as), []] : [[], copy(as)];
  };
};
var chunksOf = function(n) {
  var f = chunksOf$1(n);
  return function(as) {
    return isNonEmpty(as) ? f(as) : [];
  };
};
var fromOptionK = function(f) {
  return function() {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      a[_i] = arguments[_i];
    }
    return fromOption(f.apply(void 0, a));
  };
};
function comprehension(input, f, g) {
  if (g === void 0) {
    g = function() {
      return true;
    };
  }
  var go = function(scope, input2) {
    return isNonEmpty(input2) ? pipe$1(head$2(input2), chain$2(function(x) {
      return go(pipe$1(scope, append(x)), tail$1(input2));
    })) : g.apply(void 0, scope) ? [f.apply(void 0, scope)] : [];
  };
  return go([], input);
}
var concatW = function(second) {
  return function(first2) {
    return isEmpty$2(first2) ? copy(second) : isEmpty$2(second) ? copy(first2) : first2.concat(second);
  };
};
var concat = concatW;
function union$2(E) {
  var unionE = union$3(E);
  return function(first2, second) {
    if (second === void 0) {
      var unionE_1 = union$2(E);
      return function(second2) {
        return unionE_1(second2, first2);
      };
    }
    return isNonEmpty(first2) && isNonEmpty(second) ? unionE(second)(first2) : isNonEmpty(first2) ? copy(first2) : copy(second);
  };
}
function intersection$2(E) {
  var elemE = elem$3(E);
  return function(xs, ys) {
    if (ys === void 0) {
      var intersectionE_1 = intersection$2(E);
      return function(ys2) {
        return intersectionE_1(ys2, xs);
      };
    }
    return xs.filter(function(a) {
      return elemE(a, ys);
    });
  };
}
function difference$2(E) {
  var elemE = elem$3(E);
  return function(xs, ys) {
    if (ys === void 0) {
      var differenceE_1 = difference$2(E);
      return function(ys2) {
        return differenceE_1(ys2, xs);
      };
    }
    return xs.filter(function(a) {
      return !elemE(a, ys);
    });
  };
}
var _map$3 = function(fa, f) {
  return pipe$1(fa, map$4(f));
};
var _mapWithIndex$2 = function(fa, f) {
  return pipe$1(fa, mapWithIndex$3(f));
};
var _ap$1 = function(fab, fa) {
  return pipe$1(fab, ap$2(fa));
};
var _chain$1 = function(ma, f) {
  return pipe$1(ma, chain$2(f));
};
var _filter$3 = function(fa, predicate) {
  return pipe$1(fa, filter$4(predicate));
};
var _filterMap$3 = function(fa, f) {
  return pipe$1(fa, filterMap$4(f));
};
var _partition$3 = function(fa, predicate) {
  return pipe$1(fa, partition$4(predicate));
};
var _partitionMap$3 = function(fa, f) {
  return pipe$1(fa, partitionMap$4(f));
};
var _partitionWithIndex$2 = function(fa, predicateWithIndex) {
  return pipe$1(fa, partitionWithIndex$3(predicateWithIndex));
};
var _partitionMapWithIndex$2 = function(fa, f) {
  return pipe$1(fa, partitionMapWithIndex$3(f));
};
var _alt$1 = function(fa, that) {
  return pipe$1(fa, alt$2(that));
};
var _reduce$3 = function(fa, b, f) {
  return pipe$1(fa, reduce$4(b, f));
};
var _foldMap$3 = function(M) {
  var foldMapM = foldMap$4(M);
  return function(fa, f) {
    return pipe$1(fa, foldMapM(f));
  };
};
var _reduceRight$3 = function(fa, b, f) {
  return pipe$1(fa, reduceRight$4(b, f));
};
var _reduceWithIndex$2 = function(fa, b, f) {
  return pipe$1(fa, reduceWithIndex$3(b, f));
};
var _foldMapWithIndex$2 = function(M) {
  var foldMapWithIndexM = foldMapWithIndex$3(M);
  return function(fa, f) {
    return pipe$1(fa, foldMapWithIndexM(f));
  };
};
var _reduceRightWithIndex$2 = function(fa, b, f) {
  return pipe$1(fa, reduceRightWithIndex$3(b, f));
};
var _filterMapWithIndex$2 = function(fa, f) {
  return pipe$1(fa, filterMapWithIndex$3(f));
};
var _filterWithIndex$2 = function(fa, predicateWithIndex) {
  return pipe$1(fa, filterWithIndex$3(predicateWithIndex));
};
var _extend$1 = function(fa, f) {
  return pipe$1(fa, extend$3(f));
};
var _traverse$3 = function(F) {
  var traverseF = traverse$3(F);
  return function(ta, f) {
    return pipe$1(ta, traverseF(f));
  };
};
var _traverseWithIndex$2 = function(F) {
  var traverseWithIndexF = traverseWithIndex$2(F);
  return function(ta, f) {
    return pipe$1(ta, traverseWithIndexF(f));
  };
};
var _chainRecDepthFirst = _chainRecDepthFirst$1;
var _chainRecBreadthFirst = _chainRecBreadthFirst$1;
var of$1 = of$2;
var zero$1 = function() {
  return [];
};
var map$4 = function(f) {
  return function(fa) {
    return fa.map(function(a) {
      return f(a);
    });
  };
};
var ap$2 = function(fa) {
  return chain$2(function(f) {
    return pipe$1(fa, map$4(f));
  });
};
var chain$2 = function(f) {
  return function(ma) {
    return pipe$1(ma, chainWithIndex(function(_2, a) {
      return f(a);
    }));
  };
};
var flatten$1 = /* @__PURE__ */ chain$2(identity$1);
var mapWithIndex$3 = function(f) {
  return function(fa) {
    return fa.map(function(a, i) {
      return f(i, a);
    });
  };
};
var filterMapWithIndex$3 = function(f) {
  return function(fa) {
    var out = [];
    for (var i = 0; i < fa.length; i++) {
      var optionB = f(i, fa[i]);
      if (isSome$2(optionB)) {
        out.push(optionB.value);
      }
    }
    return out;
  };
};
var filterMap$4 = function(f) {
  return filterMapWithIndex$3(function(_2, a) {
    return f(a);
  });
};
var compact$3 = /* @__PURE__ */ filterMap$4(identity$1);
var separate$3 = function(fa) {
  var left2 = [];
  var right2 = [];
  for (var _i = 0, fa_1 = fa; _i < fa_1.length; _i++) {
    var e = fa_1[_i];
    if (e._tag === "Left") {
      left2.push(e.left);
    } else {
      right2.push(e.right);
    }
  }
  return separated(left2, right2);
};
var filter$4 = function(predicate) {
  return function(as) {
    return as.filter(predicate);
  };
};
var partition$4 = function(predicate) {
  return partitionWithIndex$3(function(_2, a) {
    return predicate(a);
  });
};
var partitionWithIndex$3 = function(predicateWithIndex) {
  return function(as) {
    var left2 = [];
    var right2 = [];
    for (var i = 0; i < as.length; i++) {
      var b = as[i];
      if (predicateWithIndex(i, b)) {
        right2.push(b);
      } else {
        left2.push(b);
      }
    }
    return separated(left2, right2);
  };
};
var partitionMap$4 = function(f) {
  return partitionMapWithIndex$3(function(_2, a) {
    return f(a);
  });
};
var partitionMapWithIndex$3 = function(f) {
  return function(fa) {
    var left2 = [];
    var right2 = [];
    for (var i = 0; i < fa.length; i++) {
      var e = f(i, fa[i]);
      if (e._tag === "Left") {
        left2.push(e.left);
      } else {
        right2.push(e.right);
      }
    }
    return separated(left2, right2);
  };
};
var altW$1 = function(that) {
  return function(fa) {
    return fa.concat(that());
  };
};
var alt$2 = altW$1;
var filterWithIndex$3 = function(predicateWithIndex) {
  return function(as) {
    return as.filter(function(b, i) {
      return predicateWithIndex(i, b);
    });
  };
};
var extend$3 = function(f) {
  return function(wa) {
    return wa.map(function(_2, i) {
      return f(wa.slice(i));
    });
  };
};
var duplicate$1 = /* @__PURE__ */ extend$3(identity$1);
var foldMap$4 = foldMap$5;
var foldMapWithIndex$3 = foldMapWithIndex$4;
var reduce$4 = reduce$5;
var reduceWithIndex$3 = reduceWithIndex$4;
var reduceRight$4 = reduceRight$5;
var reduceRightWithIndex$3 = reduceRightWithIndex$4;
var traverse$3 = function(F) {
  var traverseWithIndexF = traverseWithIndex$2(F);
  return function(f) {
    return traverseWithIndexF(function(_2, a) {
      return f(a);
    });
  };
};
var sequence$3 = function(F) {
  return function(ta) {
    return _reduce$3(ta, F.of(zero$1()), function(fas, fa) {
      return F.ap(F.map(fas, function(as) {
        return function(a) {
          return pipe$1(as, append(a));
        };
      }), fa);
    });
  };
};
var traverseWithIndex$2 = function(F) {
  return function(f) {
    return reduceWithIndex$3(F.of(zero$1()), function(i, fbs, a) {
      return F.ap(F.map(fbs, function(bs) {
        return function(b) {
          return pipe$1(bs, append(b));
        };
      }), f(i, a));
    });
  };
};
var wither$2 = function(F) {
  var _witherF = _wither$2(F);
  return function(f) {
    return function(fa) {
      return _witherF(fa, f);
    };
  };
};
var wilt$2 = function(F) {
  var _wiltF = _wilt$2(F);
  return function(f) {
    return function(fa) {
      return _wiltF(fa, f);
    };
  };
};
var unfold = function(b, f) {
  var out = [];
  var bb = b;
  while (true) {
    var mt = f(bb);
    if (isSome$2(mt)) {
      var _a2 = mt.value, a = _a2[0], b_1 = _a2[1];
      out.push(a);
      bb = b_1;
    } else {
      break;
    }
  }
  return out;
};
var URI$2 = "Array";
var getShow$3 = getShow$4;
var getSemigroup = function() {
  return {
    concat: function(first2, second) {
      return first2.concat(second);
    }
  };
};
var getMonoid$3 = function() {
  return {
    concat: getSemigroup().concat,
    empty: []
  };
};
var getEq$3 = getEq$4;
var getOrd$1 = getOrd$2;
var getUnionSemigroup$1 = function(E) {
  var unionE = union$2(E);
  return {
    concat: function(first2, second) {
      return unionE(second)(first2);
    }
  };
};
var getUnionMonoid$1 = function(E) {
  return {
    concat: getUnionSemigroup$1(E).concat,
    empty: []
  };
};
var getIntersectionSemigroup$1 = function(E) {
  var intersectionE = intersection$2(E);
  return {
    concat: function(first2, second) {
      return intersectionE(second)(first2);
    }
  };
};
var getDifferenceMagma$1 = function(E) {
  var differenceE = difference$2(E);
  return {
    concat: function(first2, second) {
      return differenceE(second)(first2);
    }
  };
};
var Functor$2 = {
  URI: URI$2,
  map: _map$3
};
var flap$2 = /* @__PURE__ */ flap$6(Functor$2);
var Pointed$1 = {
  URI: URI$2,
  of: of$1
};
var FunctorWithIndex$1 = {
  URI: URI$2,
  map: _map$3,
  mapWithIndex: _mapWithIndex$2
};
var Apply$1 = {
  URI: URI$2,
  map: _map$3,
  ap: _ap$1
};
var apFirst$1 = /* @__PURE__ */ apFirst$5(Apply$1);
var apSecond$1 = /* @__PURE__ */ apSecond$5(Apply$1);
var Applicative$1 = {
  URI: URI$2,
  map: _map$3,
  ap: _ap$1,
  of: of$1
};
var Chain$1 = {
  URI: URI$2,
  map: _map$3,
  ap: _ap$1,
  chain: _chain$1
};
var chainFirst$1 = /* @__PURE__ */ chainFirst$5(Chain$1);
var Monad$1 = {
  URI: URI$2,
  map: _map$3,
  ap: _ap$1,
  of: of$1,
  chain: _chain$1
};
var Unfoldable = {
  URI: URI$2,
  unfold
};
var Alt$1 = {
  URI: URI$2,
  map: _map$3,
  alt: _alt$1
};
var Zero$1 = {
  URI: URI$2,
  zero: zero$1
};
var guard$1 = /* @__PURE__ */ guard$2(Zero$1, Pointed$1);
var Alternative$1 = {
  URI: URI$2,
  map: _map$3,
  ap: _ap$1,
  of: of$1,
  alt: _alt$1,
  zero: zero$1
};
var Extend$1 = {
  URI: URI$2,
  map: _map$3,
  extend: _extend$1
};
var Compactable$2 = {
  URI: URI$2,
  compact: compact$3,
  separate: separate$3
};
var Filterable$2 = {
  URI: URI$2,
  map: _map$3,
  compact: compact$3,
  separate: separate$3,
  filter: _filter$3,
  filterMap: _filterMap$3,
  partition: _partition$3,
  partitionMap: _partitionMap$3
};
var FilterableWithIndex$1 = {
  URI: URI$2,
  map: _map$3,
  mapWithIndex: _mapWithIndex$2,
  compact: compact$3,
  separate: separate$3,
  filter: _filter$3,
  filterMap: _filterMap$3,
  partition: _partition$3,
  partitionMap: _partitionMap$3,
  partitionMapWithIndex: _partitionMapWithIndex$2,
  partitionWithIndex: _partitionWithIndex$2,
  filterMapWithIndex: _filterMapWithIndex$2,
  filterWithIndex: _filterWithIndex$2
};
var Foldable$2 = {
  URI: URI$2,
  reduce: _reduce$3,
  foldMap: _foldMap$3,
  reduceRight: _reduceRight$3
};
var FoldableWithIndex$1 = {
  URI: URI$2,
  reduce: _reduce$3,
  foldMap: _foldMap$3,
  reduceRight: _reduceRight$3,
  reduceWithIndex: _reduceWithIndex$2,
  foldMapWithIndex: _foldMapWithIndex$2,
  reduceRightWithIndex: _reduceRightWithIndex$2
};
var Traversable$2 = {
  URI: URI$2,
  map: _map$3,
  reduce: _reduce$3,
  foldMap: _foldMap$3,
  reduceRight: _reduceRight$3,
  traverse: _traverse$3,
  sequence: sequence$3
};
var TraversableWithIndex$1 = {
  URI: URI$2,
  map: _map$3,
  mapWithIndex: _mapWithIndex$2,
  reduce: _reduce$3,
  foldMap: _foldMap$3,
  reduceRight: _reduceRight$3,
  reduceWithIndex: _reduceWithIndex$2,
  foldMapWithIndex: _foldMapWithIndex$2,
  reduceRightWithIndex: _reduceRightWithIndex$2,
  traverse: _traverse$3,
  sequence: sequence$3,
  traverseWithIndex: _traverseWithIndex$2
};
var _wither$2 = /* @__PURE__ */ witherDefault$1(Traversable$2, Compactable$2);
var _wilt$2 = /* @__PURE__ */ wiltDefault$1(Traversable$2, Compactable$2);
var Witherable$2 = {
  URI: URI$2,
  map: _map$3,
  compact: compact$3,
  separate: separate$3,
  filter: _filter$3,
  filterMap: _filterMap$3,
  partition: _partition$3,
  partitionMap: _partitionMap$3,
  reduce: _reduce$3,
  foldMap: _foldMap$3,
  reduceRight: _reduceRight$3,
  traverse: _traverse$3,
  sequence: sequence$3,
  wither: _wither$2,
  wilt: _wilt$2
};
var chainRecDepthFirst = chainRecDepthFirst$1;
var ChainRecDepthFirst = {
  URI: URI$2,
  map: _map$3,
  ap: _ap$1,
  chain: _chain$1,
  chainRec: _chainRecDepthFirst
};
var chainRecBreadthFirst = chainRecBreadthFirst$1;
var ChainRecBreadthFirst = {
  URI: URI$2,
  map: _map$3,
  ap: _ap$1,
  chain: _chain$1,
  chainRec: _chainRecBreadthFirst
};
var filterE = /* @__PURE__ */ filterE$2(Witherable$2);
var FromEither$1 = {
  URI: URI$2,
  fromEither: fromEither$1
};
var fromEitherK$1 = /* @__PURE__ */ fromEitherK$3(FromEither$1);
var unsafeInsertAt = unsafeInsertAt$1;
var unsafeUpdateAt = function(i, a, as) {
  return isNonEmpty(as) ? unsafeUpdateAt$1(i, a, as) : [];
};
var unsafeDeleteAt = function(i, as) {
  var xs = as.slice();
  xs.splice(i, 1);
  return xs;
};
var every$2 = every$3;
var some$3 = function(predicate) {
  return function(as) {
    return as.some(predicate);
  };
};
var exists$1 = some$3;
var intercalate = intercalate$1;
var Do$1 = /* @__PURE__ */ of$1(emptyRecord);
var bindTo$1 = /* @__PURE__ */ bindTo$5(Functor$2);
var let_$1 = /* @__PURE__ */ let_$5(Functor$2);
var bind$4 = /* @__PURE__ */ bind$8(Chain$1);
var apS$1 = /* @__PURE__ */ apS$5(Apply$1);
var range = range$1;
var empty$2 = [];
var cons = cons$1;
var snoc = snoc$1;
var prependToAll = prependAll;
var array = {
  URI: URI$2,
  compact: compact$3,
  separate: separate$3,
  map: _map$3,
  ap: _ap$1,
  of: of$1,
  chain: _chain$1,
  filter: _filter$3,
  filterMap: _filterMap$3,
  partition: _partition$3,
  partitionMap: _partitionMap$3,
  mapWithIndex: _mapWithIndex$2,
  partitionMapWithIndex: _partitionMapWithIndex$2,
  partitionWithIndex: _partitionWithIndex$2,
  filterMapWithIndex: _filterMapWithIndex$2,
  filterWithIndex: _filterWithIndex$2,
  alt: _alt$1,
  zero: zero$1,
  unfold,
  reduce: _reduce$3,
  foldMap: _foldMap$3,
  reduceRight: _reduceRight$3,
  traverse: _traverse$3,
  sequence: sequence$3,
  reduceWithIndex: _reduceWithIndex$2,
  foldMapWithIndex: _foldMapWithIndex$2,
  reduceRightWithIndex: _reduceRightWithIndex$2,
  traverseWithIndex: _traverseWithIndex$2,
  extend: _extend$1,
  wither: _wither$2,
  wilt: _wilt$2
};
const _Array = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Alt: Alt$1,
  Alternative: Alternative$1,
  Applicative: Applicative$1,
  Apply: Apply$1,
  Chain: Chain$1,
  ChainRecBreadthFirst,
  ChainRecDepthFirst,
  Compactable: Compactable$2,
  Do: Do$1,
  Extend: Extend$1,
  Filterable: Filterable$2,
  FilterableWithIndex: FilterableWithIndex$1,
  Foldable: Foldable$2,
  FoldableWithIndex: FoldableWithIndex$1,
  FromEither: FromEither$1,
  Functor: Functor$2,
  FunctorWithIndex: FunctorWithIndex$1,
  Monad: Monad$1,
  Pointed: Pointed$1,
  Traversable: Traversable$2,
  TraversableWithIndex: TraversableWithIndex$1,
  URI: URI$2,
  Unfoldable,
  Witherable: Witherable$2,
  Zero: Zero$1,
  alt: alt$2,
  altW: altW$1,
  ap: ap$2,
  apFirst: apFirst$1,
  apS: apS$1,
  apSecond: apSecond$1,
  append,
  appendW,
  array,
  bind: bind$4,
  bindTo: bindTo$1,
  chain: chain$2,
  chainFirst: chainFirst$1,
  chainRecBreadthFirst,
  chainRecDepthFirst,
  chainWithIndex,
  chop,
  chunksOf,
  compact: compact$3,
  comprehension,
  concat,
  concatW,
  cons,
  copy,
  deleteAt: deleteAt$1,
  difference: difference$2,
  dropLeft,
  dropLeftWhile,
  dropRight,
  duplicate: duplicate$1,
  elem: elem$3,
  empty: empty$2,
  every: every$2,
  exists: exists$1,
  extend: extend$3,
  filter: filter$4,
  filterE,
  filterMap: filterMap$4,
  filterMapWithIndex: filterMapWithIndex$3,
  filterWithIndex: filterWithIndex$3,
  findFirst,
  findFirstMap,
  findIndex,
  findLast,
  findLastIndex,
  findLastMap,
  flap: flap$2,
  flatten: flatten$1,
  foldLeft,
  foldMap: foldMap$4,
  foldMapWithIndex: foldMapWithIndex$3,
  foldRight,
  fromEither: fromEither$1,
  fromEitherK: fromEitherK$1,
  fromOption,
  fromOptionK,
  fromPredicate: fromPredicate$1,
  getDifferenceMagma: getDifferenceMagma$1,
  getEq: getEq$3,
  getIntersectionSemigroup: getIntersectionSemigroup$1,
  getMonoid: getMonoid$3,
  getOrd: getOrd$1,
  getSemigroup,
  getShow: getShow$3,
  getUnionMonoid: getUnionMonoid$1,
  getUnionSemigroup: getUnionSemigroup$1,
  guard: guard$1,
  head,
  init,
  insertAt: insertAt$1,
  intercalate,
  intersection: intersection$2,
  intersperse,
  isEmpty: isEmpty$2,
  isNonEmpty,
  isOutOfBound,
  last,
  lefts,
  let: let_$1,
  lookup: lookup$2,
  makeBy,
  map: map$4,
  mapWithIndex: mapWithIndex$3,
  match: match$1,
  matchLeft,
  matchLeftW,
  matchRight,
  matchRightW,
  matchW: matchW$1,
  modifyAt: modifyAt$1,
  of: of$1,
  partition: partition$4,
  partitionMap: partitionMap$4,
  partitionMapWithIndex: partitionMapWithIndex$3,
  partitionWithIndex: partitionWithIndex$3,
  prepend,
  prependAll,
  prependToAll,
  prependW,
  range,
  reduce: reduce$4,
  reduceRight: reduceRight$4,
  reduceRightWithIndex: reduceRightWithIndex$3,
  reduceWithIndex: reduceWithIndex$3,
  replicate,
  reverse,
  rights,
  rotate,
  scanLeft,
  scanRight,
  separate: separate$3,
  sequence: sequence$3,
  size: size$2,
  snoc,
  some: some$3,
  sort,
  sortBy,
  spanLeft,
  splitAt,
  tail,
  takeLeft,
  takeLeftWhile,
  takeRight,
  traverse: traverse$3,
  traverseWithIndex: traverseWithIndex$2,
  unfold,
  union: union$2,
  uniq,
  unsafeDeleteAt,
  unsafeInsertAt,
  unsafeUpdateAt,
  unzip,
  updateAt: updateAt$1,
  wilt: wilt$2,
  wither: wither$2,
  zero: zero$1,
  zip,
  zipWith
}, Symbol.toStringTag, { value: "Module" }));
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(_Array);
const require$$1 = /* @__PURE__ */ getAugmentedNamespace(Either$1);
const require$$2 = /* @__PURE__ */ getAugmentedNamespace(NonEmptyArray);
var not = function(predicate) {
  return function(a) {
    return !predicate(a);
  };
};
var none = none$1;
var some$2 = some$5;
function fromPredicate(predicate) {
  return function(a) {
    return predicate(a) ? some$2(a) : none;
  };
}
var getLeft = function(ma) {
  return ma._tag === "Right" ? none : some$2(ma.left);
};
var getRight = function(ma) {
  return ma._tag === "Left" ? none : some$2(ma.right);
};
var _map$2 = function(fa, f) {
  return pipe$1(fa, map$3(f));
};
var _ap = function(fab, fa) {
  return pipe$1(fab, ap$1(fa));
};
var _chain = function(ma, f) {
  return pipe$1(ma, chain$1(f));
};
var _reduce$2 = function(fa, b, f) {
  return pipe$1(fa, reduce$3(b, f));
};
var _foldMap$2 = function(M) {
  var foldMapM = foldMap$3(M);
  return function(fa, f) {
    return pipe$1(fa, foldMapM(f));
  };
};
var _reduceRight$2 = function(fa, b, f) {
  return pipe$1(fa, reduceRight$3(b, f));
};
var _traverse$2 = function(F) {
  var traverseF = traverse$2(F);
  return function(ta, f) {
    return pipe$1(ta, traverseF(f));
  };
};
var _alt = function(fa, that) {
  return pipe$1(fa, alt$1(that));
};
var _filter$2 = function(fa, predicate) {
  return pipe$1(fa, filter$3(predicate));
};
var _filterMap$2 = function(fa, f) {
  return pipe$1(fa, filterMap$3(f));
};
var _extend = function(wa, f) {
  return pipe$1(wa, extend$2(f));
};
var _partition$2 = function(fa, predicate) {
  return pipe$1(fa, partition$3(predicate));
};
var _partitionMap$2 = function(fa, f) {
  return pipe$1(fa, partitionMap$3(f));
};
var URI$1 = "Option";
var getShow$2 = function(S) {
  return {
    show: function(ma) {
      return isNone(ma) ? "none" : "some(".concat(S.show(ma.value), ")");
    }
  };
};
var getEq$2 = function(E) {
  return {
    equals: function(x, y) {
      return x === y || (isNone(x) ? isNone(y) : isNone(y) ? false : E.equals(x.value, y.value));
    }
  };
};
var getOrd = function(O) {
  return {
    equals: getEq$2(O).equals,
    compare: function(x, y) {
      return x === y ? 0 : isSome(x) ? isSome(y) ? O.compare(x.value, y.value) : 1 : -1;
    }
  };
};
var getMonoid$2 = function(S) {
  return {
    concat: function(x, y) {
      return isNone(x) ? y : isNone(y) ? x : some$2(S.concat(x.value, y.value));
    },
    empty: none
  };
};
var map$3 = function(f) {
  return function(fa) {
    return isNone(fa) ? none : some$2(f(fa.value));
  };
};
var Functor$1 = {
  URI: URI$1,
  map: _map$2
};
var of = some$2;
var Pointed = {
  URI: URI$1,
  of
};
var ap$1 = function(fa) {
  return function(fab) {
    return isNone(fab) ? none : isNone(fa) ? none : some$2(fab.value(fa.value));
  };
};
var Apply = {
  URI: URI$1,
  map: _map$2,
  ap: _ap
};
var Applicative = {
  URI: URI$1,
  map: _map$2,
  ap: _ap,
  of
};
var chain$1 = function(f) {
  return function(ma) {
    return isNone(ma) ? none : f(ma.value);
  };
};
var Chain = {
  URI: URI$1,
  map: _map$2,
  ap: _ap,
  chain: _chain
};
var Monad = {
  URI: URI$1,
  map: _map$2,
  ap: _ap,
  of,
  chain: _chain
};
var reduce$3 = function(b, f) {
  return function(fa) {
    return isNone(fa) ? b : f(b, fa.value);
  };
};
var foldMap$3 = function(M) {
  return function(f) {
    return function(fa) {
      return isNone(fa) ? M.empty : f(fa.value);
    };
  };
};
var reduceRight$3 = function(b, f) {
  return function(fa) {
    return isNone(fa) ? b : f(fa.value, b);
  };
};
var Foldable$1 = {
  URI: URI$1,
  reduce: _reduce$2,
  foldMap: _foldMap$2,
  reduceRight: _reduceRight$2
};
var altW = function(that) {
  return function(fa) {
    return isNone(fa) ? that() : fa;
  };
};
var alt$1 = altW;
var Alt = {
  URI: URI$1,
  map: _map$2,
  alt: _alt
};
var zero = function() {
  return none;
};
var Zero = {
  URI: URI$1,
  zero
};
var guard = /* @__PURE__ */ guard$2(Zero, Pointed);
var Alternative = {
  URI: URI$1,
  map: _map$2,
  ap: _ap,
  of,
  alt: _alt,
  zero
};
var extend$2 = function(f) {
  return function(wa) {
    return isNone(wa) ? none : some$2(f(wa));
  };
};
var Extend = {
  URI: URI$1,
  map: _map$2,
  extend: _extend
};
var compact$2 = /* @__PURE__ */ chain$1(identity$1);
var defaultSeparated = /* @__PURE__ */ separated(none, none);
var separate$2 = function(ma) {
  return isNone(ma) ? defaultSeparated : separated(getLeft(ma.value), getRight(ma.value));
};
var Compactable$1 = {
  URI: URI$1,
  compact: compact$2,
  separate: separate$2
};
var filter$3 = function(predicate) {
  return function(fa) {
    return isNone(fa) ? none : predicate(fa.value) ? fa : none;
  };
};
var filterMap$3 = function(f) {
  return function(fa) {
    return isNone(fa) ? none : f(fa.value);
  };
};
var partition$3 = function(predicate) {
  return function(fa) {
    return separated(_filter$2(fa, not(predicate)), _filter$2(fa, predicate));
  };
};
var partitionMap$3 = function(f) {
  return flow(map$3(f), separate$2);
};
var Filterable$1 = {
  URI: URI$1,
  map: _map$2,
  compact: compact$2,
  separate: separate$2,
  filter: _filter$2,
  filterMap: _filterMap$2,
  partition: _partition$2,
  partitionMap: _partitionMap$2
};
var traverse$2 = function(F) {
  return function(f) {
    return function(ta) {
      return isNone(ta) ? F.of(none) : F.map(f(ta.value), some$2);
    };
  };
};
var sequence$2 = function(F) {
  return function(ta) {
    return isNone(ta) ? F.of(none) : F.map(ta.value, some$2);
  };
};
var Traversable$1 = {
  URI: URI$1,
  map: _map$2,
  reduce: _reduce$2,
  foldMap: _foldMap$2,
  reduceRight: _reduceRight$2,
  traverse: _traverse$2,
  sequence: sequence$2
};
var _wither$1 = /* @__PURE__ */ witherDefault$1(Traversable$1, Compactable$1);
var _wilt$1 = /* @__PURE__ */ wiltDefault$1(Traversable$1, Compactable$1);
var wither$1 = function(F) {
  var _witherF = _wither$1(F);
  return function(f) {
    return function(fa) {
      return _witherF(fa, f);
    };
  };
};
var wilt$1 = function(F) {
  var _wiltF = _wilt$1(F);
  return function(f) {
    return function(fa) {
      return _wiltF(fa, f);
    };
  };
};
var Witherable$1 = {
  URI: URI$1,
  map: _map$2,
  reduce: _reduce$2,
  foldMap: _foldMap$2,
  reduceRight: _reduceRight$2,
  traverse: _traverse$2,
  sequence: sequence$2,
  compact: compact$2,
  separate: separate$2,
  filter: _filter$2,
  filterMap: _filterMap$2,
  partition: _partition$2,
  partitionMap: _partitionMap$2,
  wither: _wither$1,
  wilt: _wilt$1
};
var throwError = function() {
  return none;
};
var MonadThrow = {
  URI: URI$1,
  map: _map$2,
  ap: _ap,
  of,
  chain: _chain,
  throwError
};
var fromEither = getRight;
var FromEither = {
  URI: URI$1,
  fromEither
};
var isSome = isSome$2;
var isNone = function(fa) {
  return fa._tag === "None";
};
var matchW = function(onNone, onSome) {
  return function(ma) {
    return isNone(ma) ? onNone() : onSome(ma.value);
  };
};
var foldW = matchW;
var match = matchW;
var fold = match;
var getOrElseW = function(onNone) {
  return function(ma) {
    return isNone(ma) ? onNone() : ma.value;
  };
};
var getOrElse = getOrElseW;
var flap$1 = /* @__PURE__ */ flap$6(Functor$1);
var apFirst = /* @__PURE__ */ apFirst$5(Apply);
var apSecond = /* @__PURE__ */ apSecond$5(Apply);
var flatten = compact$2;
var chainFirst = /* @__PURE__ */ chainFirst$5(Chain);
var duplicate = /* @__PURE__ */ extend$2(identity$1);
var fromEitherK = /* @__PURE__ */ fromEitherK$3(FromEither);
var chainEitherK = /* @__PURE__ */ chainEitherK$2(FromEither, Chain);
var chainFirstEitherK = /* @__PURE__ */ chainFirstEitherK$2(FromEither, Chain);
var fromNullable = function(a) {
  return a == null ? none : some$2(a);
};
var tryCatch = function(f) {
  try {
    return some$2(f());
  } catch (e) {
    return none;
  }
};
var tryCatchK = function(f) {
  return function() {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      a[_i] = arguments[_i];
    }
    return tryCatch(function() {
      return f.apply(void 0, a);
    });
  };
};
var fromNullableK = function(f) {
  return flow(f, fromNullable);
};
var chainNullableK = function(f) {
  return function(ma) {
    return isNone(ma) ? none : fromNullable(f(ma.value));
  };
};
var toNullable = /* @__PURE__ */ match(constNull, identity$1);
var toUndefined = /* @__PURE__ */ match(constUndefined, identity$1);
function elem$2(E) {
  return function(a, ma) {
    if (ma === void 0) {
      var elemE_1 = elem$2(E);
      return function(ma2) {
        return elemE_1(a, ma2);
      };
    }
    return isNone(ma) ? false : E.equals(a, ma.value);
  };
}
var exists = function(predicate) {
  return function(ma) {
    return isNone(ma) ? false : predicate(ma.value);
  };
};
var Do = /* @__PURE__ */ of(emptyRecord);
var bindTo = /* @__PURE__ */ bindTo$5(Functor$1);
var let_ = /* @__PURE__ */ let_$5(Functor$1);
var bind$3 = /* @__PURE__ */ bind$8(Chain);
var apS = /* @__PURE__ */ apS$5(Apply);
var ApT = /* @__PURE__ */ of(emptyReadonlyArray);
var traverseReadonlyNonEmptyArrayWithIndex = function(f) {
  return function(as) {
    var o = f(0, head$5(as));
    if (isNone(o)) {
      return none;
    }
    var out = [o.value];
    for (var i = 1; i < as.length; i++) {
      var o_1 = f(i, as[i]);
      if (isNone(o_1)) {
        return none;
      }
      out.push(o_1.value);
    }
    return some$2(out);
  };
};
var traverseReadonlyArrayWithIndex = function(f) {
  var g = traverseReadonlyNonEmptyArrayWithIndex(f);
  return function(as) {
    return isNonEmpty$6(as) ? g(as) : ApT;
  };
};
var traverseArrayWithIndex = traverseReadonlyArrayWithIndex;
var traverseArray = function(f) {
  return traverseReadonlyArrayWithIndex(function(_2, a) {
    return f(a);
  });
};
var sequenceArray = /* @__PURE__ */ traverseArray(identity$1);
function getRefinement(getOption) {
  return function(a) {
    return isSome(getOption(a));
  };
}
var mapNullable = chainNullableK;
var option = {
  URI: URI$1,
  map: _map$2,
  of,
  ap: _ap,
  chain: _chain,
  reduce: _reduce$2,
  foldMap: _foldMap$2,
  reduceRight: _reduceRight$2,
  traverse: _traverse$2,
  sequence: sequence$2,
  zero,
  alt: _alt,
  extend: _extend,
  compact: compact$2,
  separate: separate$2,
  filter: _filter$2,
  filterMap: _filterMap$2,
  partition: _partition$2,
  partitionMap: _partitionMap$2,
  wither: _wither$1,
  wilt: _wilt$1,
  throwError
};
var getApplySemigroup = /* @__PURE__ */ getApplySemigroup$3(Apply);
var getApplyMonoid = /* @__PURE__ */ getApplicativeMonoid$1(Applicative);
var getFirstMonoid = function() {
  return getMonoid$2(first());
};
var getLastMonoid = function() {
  return getMonoid$2(last$4());
};
const Option = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Alt,
  Alternative,
  ApT,
  Applicative,
  Apply,
  Chain,
  Compactable: Compactable$1,
  Do,
  Extend,
  Filterable: Filterable$1,
  Foldable: Foldable$1,
  FromEither,
  Functor: Functor$1,
  Monad,
  MonadThrow,
  Pointed,
  Traversable: Traversable$1,
  URI: URI$1,
  Witherable: Witherable$1,
  Zero,
  alt: alt$1,
  altW,
  ap: ap$1,
  apFirst,
  apS,
  apSecond,
  bind: bind$3,
  bindTo,
  chain: chain$1,
  chainEitherK,
  chainFirst,
  chainFirstEitherK,
  chainNullableK,
  compact: compact$2,
  duplicate,
  elem: elem$2,
  exists,
  extend: extend$2,
  filter: filter$3,
  filterMap: filterMap$3,
  flap: flap$1,
  flatten,
  fold,
  foldMap: foldMap$3,
  foldW,
  fromEither,
  fromEitherK,
  fromNullable,
  fromNullableK,
  fromPredicate,
  getApplyMonoid,
  getApplySemigroup,
  getEq: getEq$2,
  getFirstMonoid,
  getLastMonoid,
  getLeft,
  getMonoid: getMonoid$2,
  getOrElse,
  getOrElseW,
  getOrd,
  getRefinement,
  getRight,
  getShow: getShow$2,
  guard,
  isNone,
  isSome,
  let: let_,
  map: map$3,
  mapNullable,
  match,
  matchW,
  none,
  of,
  option,
  partition: partition$3,
  partitionMap: partitionMap$3,
  reduce: reduce$3,
  reduceRight: reduceRight$3,
  separate: separate$2,
  sequence: sequence$2,
  sequenceArray,
  some: some$2,
  throwError,
  toNullable,
  toUndefined,
  traverse: traverse$2,
  traverseArray,
  traverseArrayWithIndex,
  traverseReadonlyArrayWithIndex,
  traverseReadonlyNonEmptyArrayWithIndex,
  tryCatch,
  tryCatchK,
  wilt: wilt$1,
  wither: wither$1,
  zero
}, Symbol.toStringTag, { value: "Module" }));
const require$$3 = /* @__PURE__ */ getAugmentedNamespace(Option);
var Eq = {
  equals: function(first2, second) {
    return first2 === second;
  }
};
var Ord = {
  equals: Eq.equals,
  compare: function(first2, second) {
    return first2 < second ? -1 : first2 > second ? 1 : 0;
  }
};
var size$1 = function(r) {
  return Object.keys(r).length;
};
var isEmpty$1 = function(r) {
  for (var k in r) {
    if (has$2.call(r, k)) {
      return false;
    }
  }
  return true;
};
var keys_$1 = function(O) {
  return function(r) {
    return Object.keys(r).sort(O.compare);
  };
};
function collect$1(O) {
  if (typeof O === "function") {
    return collect$1(Ord)(O);
  }
  var keysO = keys_$1(O);
  return function(f) {
    return function(r) {
      var out = [];
      for (var _i = 0, _a2 = keysO(r); _i < _a2.length; _i++) {
        var key = _a2[_i];
        out.push(f(key, r[key]));
      }
      return out;
    };
  };
}
var upsertAt$1 = function(k, a) {
  return function(r) {
    if (has$2.call(r, k) && r[k] === a) {
      return r;
    }
    var out = Object.assign({}, r);
    out[k] = a;
    return out;
  };
};
var has$1 = function(k, r) {
  return has$2.call(r, k);
};
function isSubrecord$1(E) {
  return function(me, that) {
    if (that === void 0) {
      var isSubrecordE_1 = isSubrecord$1(E);
      return function(that2) {
        return isSubrecordE_1(that2, me);
      };
    }
    for (var k in me) {
      if (!has$2.call(that, k) || !E.equals(me[k], that[k])) {
        return false;
      }
    }
    return true;
  };
}
function lookup$1(k, r) {
  if (r === void 0) {
    return function(r2) {
      return lookup$1(k, r2);
    };
  }
  return has$2.call(r, k) ? some$5(r[k]) : none$1;
}
var empty$1 = {};
function mapWithIndex$2(f) {
  return function(r) {
    var out = {};
    for (var k in r) {
      if (has$2.call(r, k)) {
        out[k] = f(k, r[k]);
      }
    }
    return out;
  };
}
function map$2(f) {
  return mapWithIndex$2(function(_2, a) {
    return f(a);
  });
}
function reduceWithIndex$2() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  if (args.length === 2) {
    return reduceWithIndex$2(Ord).apply(void 0, args);
  }
  var keysO = keys_$1(args[0]);
  return function(b, f) {
    return function(fa) {
      var out = b;
      var ks = keysO(fa);
      var len = ks.length;
      for (var i = 0; i < len; i++) {
        var k = ks[i];
        out = f(k, out, fa[k]);
      }
      return out;
    };
  };
}
function foldMapWithIndex$2(O) {
  if ("compare" in O) {
    var keysO_1 = keys_$1(O);
    return function(M) {
      return function(f) {
        return function(fa) {
          var out = M.empty;
          var ks = keysO_1(fa);
          var len = ks.length;
          for (var i = 0; i < len; i++) {
            var k = ks[i];
            out = M.concat(out, f(k, fa[k]));
          }
          return out;
        };
      };
    };
  }
  return foldMapWithIndex$2(Ord)(O);
}
function reduceRightWithIndex$2() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  if (args.length === 2) {
    return reduceRightWithIndex$2(Ord).apply(void 0, args);
  }
  var keysO = keys_$1(args[0]);
  return function(b, f) {
    return function(fa) {
      var out = b;
      var ks = keysO(fa);
      var len = ks.length;
      for (var i = len - 1; i >= 0; i--) {
        var k = ks[i];
        out = f(k, fa[k], out);
      }
      return out;
    };
  };
}
var singleton$1 = function(k, a) {
  var _a2;
  return _a2 = {}, _a2[k] = a, _a2;
};
function traverseWithIndex$1(F) {
  var traverseWithIndexOF = _traverseWithIndex$1(Ord)(F);
  return function(f) {
    return function(ta) {
      return traverseWithIndexOF(ta, f);
    };
  };
}
function traverse$1(F) {
  var traverseOF = _traverse$1(Ord)(F);
  return function(f) {
    return function(ta) {
      return traverseOF(ta, f);
    };
  };
}
function sequence$1(F) {
  return _sequence$1(Ord)(F);
}
function partitionMapWithIndex$2(f) {
  return function(r) {
    var left2 = {};
    var right2 = {};
    for (var k in r) {
      if (has$2.call(r, k)) {
        var e = f(k, r[k]);
        switch (e._tag) {
          case "Left":
            left2[k] = e.left;
            break;
          case "Right":
            right2[k] = e.right;
            break;
        }
      }
    }
    return separated(left2, right2);
  };
}
function partitionWithIndex$2(predicateWithIndex) {
  return function(r) {
    var left2 = {};
    var right2 = {};
    for (var k in r) {
      if (has$2.call(r, k)) {
        var a = r[k];
        if (predicateWithIndex(k, a)) {
          right2[k] = a;
        } else {
          left2[k] = a;
        }
      }
    }
    return separated(left2, right2);
  };
}
function filterMapWithIndex$2(f) {
  return function(r) {
    var out = {};
    for (var k in r) {
      if (has$2.call(r, k)) {
        var ob = f(k, r[k]);
        if (isSome$2(ob)) {
          out[k] = ob.value;
        }
      }
    }
    return out;
  };
}
function filterWithIndex$2(predicateWithIndex) {
  return function(fa) {
    var out = {};
    var changed = false;
    for (var key in fa) {
      if (has$2.call(fa, key)) {
        var a = fa[key];
        if (predicateWithIndex(key, a)) {
          out[key] = a;
        } else {
          changed = true;
        }
      }
    }
    return changed ? out : fa;
  };
}
function fromFoldable$1(M, F) {
  var fromFoldableMapM = fromFoldableMap$1(M, F);
  return function(fka) {
    return fromFoldableMapM(fka, identity$1);
  };
}
function fromFoldableMap$1(M, F) {
  return function(ta, f) {
    return F.reduce(ta, {}, function(r, a) {
      var _a2 = f(a), k = _a2[0], b = _a2[1];
      r[k] = has$2.call(r, k) ? M.concat(r[k], b) : b;
      return r;
    });
  };
}
function every$1(predicate) {
  return function(r) {
    for (var k in r) {
      if (!predicate(r[k])) {
        return false;
      }
    }
    return true;
  };
}
function some$1(predicate) {
  return function(r) {
    for (var k in r) {
      if (predicate(r[k])) {
        return true;
      }
    }
    return false;
  };
}
function elem$1(E) {
  return function(a, fa) {
    if (fa === void 0) {
      var elemE_1 = elem$1(E);
      return function(fa2) {
        return elemE_1(a, fa2);
      };
    }
    for (var k in fa) {
      if (E.equals(fa[k], a)) {
        return true;
      }
    }
    return false;
  };
}
var union$1 = function(M) {
  return function(second) {
    return function(first2) {
      if (isEmpty$1(first2)) {
        return second;
      }
      if (isEmpty$1(second)) {
        return first2;
      }
      var out = {};
      for (var k in first2) {
        if (has$1(k, second)) {
          out[k] = M.concat(first2[k], second[k]);
        } else {
          out[k] = first2[k];
        }
      }
      for (var k in second) {
        if (!has$1(k, out)) {
          out[k] = second[k];
        }
      }
      return out;
    };
  };
};
var intersection$1 = function(M) {
  return function(second) {
    return function(first2) {
      if (isEmpty$1(first2) || isEmpty$1(second)) {
        return empty$1;
      }
      var out = {};
      for (var k in first2) {
        if (has$1(k, second)) {
          out[k] = M.concat(first2[k], second[k]);
        }
      }
      return out;
    };
  };
};
var difference$1 = function(second) {
  return function(first2) {
    if (isEmpty$1(first2)) {
      return second;
    }
    if (isEmpty$1(second)) {
      return first2;
    }
    var out = {};
    for (var k in first2) {
      if (!has$1(k, second)) {
        out[k] = first2[k];
      }
    }
    for (var k in second) {
      if (!has$1(k, first2)) {
        out[k] = second[k];
      }
    }
    return out;
  };
};
var _map$1 = function(fa, f) {
  return pipe$1(fa, map$2(f));
};
var _mapWithIndex$1 = function(fa, f) {
  return pipe$1(fa, mapWithIndex$2(f));
};
var _reduce$1 = function(O) {
  var reduceO = reduce$2(O);
  return function(fa, b, f) {
    return pipe$1(fa, reduceO(b, f));
  };
};
var _foldMap$1 = function(O) {
  return function(M) {
    var foldMapM = foldMap$2(O)(M);
    return function(fa, f) {
      return pipe$1(fa, foldMapM(f));
    };
  };
};
var _reduceRight$1 = function(O) {
  var reduceRightO = reduceRight$2(O);
  return function(fa, b, f) {
    return pipe$1(fa, reduceRightO(b, f));
  };
};
var _filter$1 = function(fa, predicate) {
  return pipe$1(fa, filter$2(predicate));
};
var _filterMap$1 = function(fa, f) {
  return pipe$1(fa, filterMap$2(f));
};
var _partition$1 = function(fa, predicate) {
  return pipe$1(fa, partition$2(predicate));
};
var _partitionMap$1 = function(fa, f) {
  return pipe$1(fa, partitionMap$2(f));
};
var _reduceWithIndex$1 = function(O) {
  var reduceWithIndexO = reduceWithIndex$2(O);
  return function(fa, b, f) {
    return pipe$1(fa, reduceWithIndexO(b, f));
  };
};
var _foldMapWithIndex$1 = function(O) {
  var foldMapWithIndexO = foldMapWithIndex$2(O);
  return function(M) {
    var foldMapWithIndexM = foldMapWithIndexO(M);
    return function(fa, f) {
      return pipe$1(fa, foldMapWithIndexM(f));
    };
  };
};
var _reduceRightWithIndex$1 = function(O) {
  var reduceRightWithIndexO = reduceRightWithIndex$2(O);
  return function(fa, b, f) {
    return pipe$1(fa, reduceRightWithIndexO(b, f));
  };
};
var _partitionMapWithIndex$1 = function(fa, f) {
  return pipe$1(fa, partitionMapWithIndex$2(f));
};
var _partitionWithIndex$1 = function(fa, predicateWithIndex) {
  return pipe$1(fa, partitionWithIndex$2(predicateWithIndex));
};
var _filterMapWithIndex$1 = function(fa, f) {
  return pipe$1(fa, filterMapWithIndex$2(f));
};
var _filterWithIndex$1 = function(fa, predicateWithIndex) {
  return pipe$1(fa, filterWithIndex$2(predicateWithIndex));
};
var _traverse$1 = function(O) {
  var traverseWithIndexO = _traverseWithIndex$1(O);
  return function(F) {
    var traverseWithIndexOF = traverseWithIndexO(F);
    return function(ta, f) {
      return traverseWithIndexOF(ta, flow(SK, f));
    };
  };
};
var _sequence$1 = function(O) {
  var traverseO = _traverse$1(O);
  return function(F) {
    var traverseOF = traverseO(F);
    return function(ta) {
      return traverseOF(ta, identity$1);
    };
  };
};
var _traverseWithIndex$1 = function(O) {
  return function(F) {
    var keysO = keys_$1(O);
    return function(ta, f) {
      var ks = keysO(ta);
      if (ks.length === 0) {
        return F.of(empty$1);
      }
      var fr = F.of({});
      var _loop_1 = function(key2) {
        fr = F.ap(F.map(fr, function(r) {
          return function(b) {
            var _a2;
            return Object.assign({}, r, (_a2 = {}, _a2[key2] = b, _a2));
          };
        }), f(key2, ta[key2]));
      };
      for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
        var key = ks_1[_i];
        _loop_1(key);
      }
      return fr;
    };
  };
};
var filter$2 = function(predicate) {
  return filterWithIndex$2(function(_2, a) {
    return predicate(a);
  });
};
var filterMap$2 = function(f) {
  return filterMapWithIndex$2(function(_2, a) {
    return f(a);
  });
};
var partition$2 = function(predicate) {
  return partitionWithIndex$2(function(_2, a) {
    return predicate(a);
  });
};
var partitionMap$2 = function(f) {
  return partitionMapWithIndex$2(function(_2, a) {
    return f(a);
  });
};
function reduce$2() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  if (args.length === 1) {
    var reduceWithIndexO_1 = reduceWithIndex$2(args[0]);
    return function(b, f) {
      return reduceWithIndexO_1(b, function(_2, b2, a) {
        return f(b2, a);
      });
    };
  }
  return reduce$2(Ord).apply(void 0, args);
}
function foldMap$2(O) {
  if ("compare" in O) {
    var foldMapWithIndexO_1 = foldMapWithIndex$2(O);
    return function(M) {
      var foldMapWithIndexM = foldMapWithIndexO_1(M);
      return function(f) {
        return foldMapWithIndexM(function(_2, a) {
          return f(a);
        });
      };
    };
  }
  return foldMap$2(Ord)(O);
}
function reduceRight$2() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  if (args.length === 1) {
    var reduceRightWithIndexO_1 = reduceRightWithIndex$2(args[0]);
    return function(b, f) {
      return reduceRightWithIndexO_1(b, function(_2, b2, a) {
        return f(b2, a);
      });
    };
  }
  return reduceRight$2(Ord).apply(void 0, args);
}
var compact$1 = function(r) {
  var out = {};
  for (var k in r) {
    if (has$2.call(r, k)) {
      var oa = r[k];
      if (isSome$2(oa)) {
        out[k] = oa.value;
      }
    }
  }
  return out;
};
var separate$1 = function(r) {
  var left2 = {};
  var right2 = {};
  for (var k in r) {
    if (has$2.call(r, k)) {
      var e = r[k];
      if (isLeft$2(e)) {
        left2[k] = e.left;
      } else {
        right2[k] = e.right;
      }
    }
  }
  return separated(left2, right2);
};
function getShow$1(O) {
  if ("compare" in O) {
    return function(S) {
      return {
        show: function(r) {
          var elements = collect$1(O)(function(k, a) {
            return "".concat(JSON.stringify(k), ": ").concat(S.show(a));
          })(r).join(", ");
          return elements === "" ? "{}" : "{ ".concat(elements, " }");
        }
      };
    };
  }
  return getShow$1(Ord)(O);
}
function getEq$1(E) {
  var isSubrecordE = isSubrecord$1(E);
  return fromEquals(function(x, y) {
    return isSubrecordE(x)(y) && isSubrecordE(y)(x);
  });
}
function getMonoid$1(S) {
  return {
    concat: function(first2, second) {
      if (isEmpty$1(first2)) {
        return second;
      }
      if (isEmpty$1(second)) {
        return first2;
      }
      var r = Object.assign({}, first2);
      for (var k in second) {
        if (has$2.call(second, k)) {
          r[k] = has$2.call(first2, k) ? S.concat(first2[k], second[k]) : second[k];
        }
      }
      return r;
    },
    empty: empty$1
  };
}
function hasOwnProperty$1(k, r) {
  return has$2.call(r === void 0 ? this : r, k);
}
var __assign = globalThis && globalThis.__assign || function() {
  __assign = Object.assign || function(t2) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t2[p] = s[p];
    }
    return t2;
  };
  return __assign.apply(this, arguments);
};
var size = size$1;
var isEmpty = isEmpty$1;
var keys_ = function(O) {
  return function(r) {
    return Object.keys(r).sort(O.compare);
  };
};
var keys = /* @__PURE__ */ keys_(Ord);
function collect(O) {
  if (typeof O === "function") {
    return collect(Ord)(O);
  }
  var keysO = keys_(O);
  return function(f) {
    return function(r) {
      var out = [];
      for (var _i = 0, _a2 = keysO(r); _i < _a2.length; _i++) {
        var key = _a2[_i];
        out.push(f(key, r[key]));
      }
      return out;
    };
  };
}
var toArray = /* @__PURE__ */ collect(Ord)(function(k, a) {
  return [
    k,
    a
  ];
});
function toUnfoldable(U) {
  return function(r) {
    var sas = toArray(r);
    var len = sas.length;
    return U.unfold(0, function(b) {
      return b < len ? some$5([sas[b], b + 1]) : none$1;
    });
  };
}
var upsertAt = upsertAt$1;
var has = has$1;
function deleteAt(k) {
  return function(r) {
    if (!has$2.call(r, k)) {
      return r;
    }
    var out = Object.assign({}, r);
    delete out[k];
    return out;
  };
}
var updateAt = function(k, a) {
  return modifyAt(k, function() {
    return a;
  });
};
var modifyAt = function(k, f) {
  return function(r) {
    if (!has(k, r)) {
      return none$1;
    }
    var out = Object.assign({}, r);
    out[k] = f(r[k]);
    return some$5(out);
  };
};
function pop(k) {
  var deleteAtk = deleteAt(k);
  return function(r) {
    var oa = lookup(k, r);
    return isNone$2(oa) ? none$1 : some$5([oa.value, deleteAtk(r)]);
  };
}
var isSubrecord = isSubrecord$1;
var lookup = lookup$1;
var mapWithIndex$1 = mapWithIndex$2;
var map$1 = map$2;
function reduceWithIndex$1() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return args.length === 1 ? reduceWithIndex$2(args[0]) : reduceWithIndex$2(Ord).apply(void 0, args);
}
function foldMapWithIndex$1(O) {
  return "compare" in O ? foldMapWithIndex$2(O) : foldMapWithIndex$2(Ord)(O);
}
function reduceRightWithIndex$1() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return args.length === 1 ? reduceRightWithIndex$2(args[0]) : reduceRightWithIndex$2(Ord).apply(void 0, args);
}
var singleton = singleton$1;
function traverseWithIndex(F) {
  return traverseWithIndex$1(F);
}
function traverse(F) {
  return traverse$1(F);
}
function sequence(F) {
  return sequence$1(F);
}
var wither = function(F) {
  var traverseF = traverse(F);
  return function(f) {
    return function(fa) {
      return F.map(pipe$1(fa, traverseF(f)), compact);
    };
  };
};
var wilt = function(F) {
  var traverseF = traverse(F);
  return function(f) {
    return function(fa) {
      return F.map(pipe$1(fa, traverseF(f)), separate);
    };
  };
};
var partitionMapWithIndex$1 = partitionMapWithIndex$2;
function partitionWithIndex$1(predicateWithIndex) {
  return partitionWithIndex$2(predicateWithIndex);
}
var filterMapWithIndex$1 = filterMapWithIndex$2;
function filterWithIndex$1(predicateWithIndex) {
  return filterWithIndex$2(predicateWithIndex);
}
function fromFoldable(M, F) {
  return fromFoldable$1(M, F);
}
var toEntries = toArray;
var fromEntries = function(fa) {
  return fromFoldable(last$4(), Foldable$2)(fa);
};
function fromFoldableMap(M, F) {
  return fromFoldableMap$1(M, F);
}
var every = every$1;
var some = some$1;
var elem = elem$1;
var union = function(M) {
  var unionM = union$1(M);
  return function(second) {
    return function(first2) {
      if (isEmpty(first2)) {
        return __assign({}, second);
      }
      if (isEmpty(second)) {
        return __assign({}, first2);
      }
      return unionM(second)(first2);
    };
  };
};
var intersection = function(M) {
  return function(second) {
    return function(first2) {
      if (isEmpty(first2) || isEmpty(second)) {
        return {};
      }
      return intersection$1(M)(second)(first2);
    };
  };
};
var difference = function(second) {
  return function(first2) {
    if (isEmpty(first2)) {
      return __assign({}, second);
    }
    if (isEmpty(second)) {
      return __assign({}, first2);
    }
    return difference$1(second)(first2);
  };
};
var _map = _map$1;
var _mapWithIndex = _mapWithIndex$1;
var _reduce = _reduce$1;
var _foldMap = _foldMap$1;
var _reduceRight = _reduceRight$1;
var _filter = _filter$1;
var _filterMap = _filterMap$1;
var _partition = _partition$1;
var _partitionMap = _partitionMap$1;
var _reduceWithIndex = _reduceWithIndex$1;
var _foldMapWithIndex = _foldMapWithIndex$1;
var _reduceRightWithIndex = _reduceRightWithIndex$1;
var _partitionMapWithIndex = _partitionMapWithIndex$1;
var _partitionWithIndex = _partitionWithIndex$1;
var _filterMapWithIndex = _filterMapWithIndex$1;
var _filterWithIndex = _filterWithIndex$1;
var _traverse = _traverse$1;
var _sequence = _sequence$1;
var _traverseWithIndex = function(O) {
  return function(F) {
    var keysO = keys_(O);
    return function(ta, f) {
      var ks = keysO(ta);
      if (ks.length === 0) {
        return F.of({});
      }
      var fr = F.of({});
      var _loop_1 = function(key2) {
        fr = F.ap(F.map(fr, function(r) {
          return function(b) {
            r[key2] = b;
            return r;
          };
        }), f(key2, ta[key2]));
      };
      for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
        var key = ks_1[_i];
        _loop_1(key);
      }
      return fr;
    };
  };
};
var filter$1 = filter$2;
var filterMap$1 = filterMap$2;
var partition$1 = partition$2;
var partitionMap$1 = partitionMap$2;
function reduce$1() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return args.length === 1 ? reduce$2(args[0]) : reduce$2(Ord).apply(void 0, args);
}
function foldMap$1(O) {
  return "compare" in O ? foldMap$2(O) : foldMap$2(Ord)(O);
}
function reduceRight$1() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return args.length === 1 ? reduceRight$2(args[0]) : reduceRight$2(Ord).apply(void 0, args);
}
var compact = compact$1;
var separate = separate$1;
var URI = "Record";
function getShow(O) {
  return "compare" in O ? getShow$1(O) : getShow$1(Ord)(O);
}
var getEq = getEq$1;
var getMonoid = getMonoid$1;
var Functor = {
  URI,
  map: _map
};
var flap = /* @__PURE__ */ flap$6(Functor);
var FunctorWithIndex = {
  URI,
  map: _map,
  mapWithIndex: _mapWithIndex
};
var getFoldable = function(O) {
  return {
    URI,
    reduce: _reduce(O),
    foldMap: _foldMap(O),
    reduceRight: _reduceRight(O)
  };
};
var getFoldableWithIndex = function(O) {
  return {
    URI,
    reduce: _reduce(O),
    foldMap: _foldMap(O),
    reduceRight: _reduceRight(O),
    reduceWithIndex: _reduceWithIndex(O),
    foldMapWithIndex: _foldMapWithIndex(O),
    reduceRightWithIndex: _reduceRightWithIndex(O)
  };
};
var Compactable = {
  URI,
  compact,
  separate
};
var Filterable = {
  URI,
  map: _map,
  compact,
  separate,
  filter: _filter,
  filterMap: _filterMap,
  partition: _partition,
  partitionMap: _partitionMap
};
var FilterableWithIndex = {
  URI,
  map: _map,
  mapWithIndex: _mapWithIndex,
  compact,
  separate,
  filter: _filter,
  filterMap: _filterMap,
  partition: _partition,
  partitionMap: _partitionMap,
  filterMapWithIndex: _filterMapWithIndex,
  filterWithIndex: _filterWithIndex,
  partitionMapWithIndex: _partitionMapWithIndex,
  partitionWithIndex: _partitionWithIndex
};
var getTraversable = function(O) {
  return {
    URI,
    map: _map,
    reduce: _reduce(O),
    foldMap: _foldMap(O),
    reduceRight: _reduceRight(O),
    traverse: _traverse(O),
    sequence: _sequence(O)
  };
};
var getTraversableWithIndex = function(O) {
  return {
    URI,
    map: _map,
    mapWithIndex: _mapWithIndex,
    reduce: _reduce(O),
    foldMap: _foldMap(O),
    reduceRight: _reduceRight(O),
    reduceWithIndex: _reduceWithIndex(O),
    foldMapWithIndex: _foldMapWithIndex(O),
    reduceRightWithIndex: _reduceRightWithIndex(O),
    traverse: _traverse(O),
    sequence: _sequence(O),
    traverseWithIndex: _traverseWithIndex(O)
  };
};
var getWitherable = function(O) {
  var T = getTraversable(O);
  return {
    URI,
    map: _map,
    reduce: _reduce(O),
    foldMap: _foldMap(O),
    reduceRight: _reduceRight(O),
    traverse: T.traverse,
    sequence: T.sequence,
    compact,
    separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    wither: witherDefault$1(T, Compactable),
    wilt: wiltDefault$1(T, Compactable)
  };
};
var getUnionSemigroup = function(S) {
  var unionS = union(S);
  return {
    concat: function(first2, second) {
      return unionS(second)(first2);
    }
  };
};
var getUnionMonoid = function(S) {
  return {
    concat: getUnionSemigroup(S).concat,
    empty: {}
  };
};
var getIntersectionSemigroup = function(S) {
  var intersectionS = intersection(S);
  return {
    concat: function(first2, second) {
      return intersectionS(second)(first2);
    }
  };
};
var getDifferenceMagma = function() {
  return {
    concat: function(first2, second) {
      return difference(second)(first2);
    }
  };
};
var Foldable = {
  URI,
  reduce: /* @__PURE__ */ _reduce(Ord),
  foldMap: /* @__PURE__ */ _foldMap(Ord),
  reduceRight: /* @__PURE__ */ _reduceRight(Ord)
};
var FoldableWithIndex = {
  URI,
  reduce: /* @__PURE__ */ _reduce(Ord),
  foldMap: /* @__PURE__ */ _foldMap(Ord),
  reduceRight: /* @__PURE__ */ _reduceRight(Ord),
  reduceWithIndex: /* @__PURE__ */ _reduceWithIndex(Ord),
  foldMapWithIndex: /* @__PURE__ */ _foldMapWithIndex(Ord),
  reduceRightWithIndex: /* @__PURE__ */ _reduceRightWithIndex(Ord)
};
var Traversable = {
  URI,
  map: _map,
  reduce: /* @__PURE__ */ _reduce(Ord),
  foldMap: /* @__PURE__ */ _foldMap(Ord),
  reduceRight: /* @__PURE__ */ _reduceRight(Ord),
  traverse: /* @__PURE__ */ _traverse(Ord),
  sequence
};
var TraversableWithIndex = {
  URI,
  map: _map,
  mapWithIndex: _mapWithIndex,
  reduce: /* @__PURE__ */ _reduce(Ord),
  foldMap: /* @__PURE__ */ _foldMap(Ord),
  reduceRight: /* @__PURE__ */ _reduceRight(Ord),
  reduceWithIndex: /* @__PURE__ */ _reduceWithIndex(Ord),
  foldMapWithIndex: /* @__PURE__ */ _foldMapWithIndex(Ord),
  reduceRightWithIndex: /* @__PURE__ */ _reduceRightWithIndex(Ord),
  traverse: /* @__PURE__ */ _traverse(Ord),
  sequence,
  traverseWithIndex: /* @__PURE__ */ _traverseWithIndex(Ord)
};
var _wither = /* @__PURE__ */ witherDefault$1(Traversable, Compactable);
var _wilt = /* @__PURE__ */ wiltDefault$1(Traversable, Compactable);
var Witherable = {
  URI,
  map: _map,
  reduce: /* @__PURE__ */ _reduce(Ord),
  foldMap: /* @__PURE__ */ _foldMap(Ord),
  reduceRight: /* @__PURE__ */ _reduceRight(Ord),
  traverse: /* @__PURE__ */ _traverse(Ord),
  sequence,
  compact,
  separate,
  filter: _filter,
  filterMap: _filterMap,
  partition: _partition,
  partitionMap: _partitionMap,
  wither: _wither,
  wilt: _wilt
};
var empty = {};
var insertAt = upsertAt;
var hasOwnProperty = hasOwnProperty$1;
var record = {
  URI,
  map: _map,
  reduce: /* @__PURE__ */ _reduce(Ord),
  foldMap: /* @__PURE__ */ _foldMap(Ord),
  reduceRight: /* @__PURE__ */ _reduceRight(Ord),
  traverse: /* @__PURE__ */ _traverse(Ord),
  sequence,
  compact,
  separate,
  filter: _filter,
  filterMap: _filterMap,
  partition: _partition,
  partitionMap: _partitionMap,
  mapWithIndex: _mapWithIndex,
  reduceWithIndex: /* @__PURE__ */ _reduceWithIndex(Ord),
  foldMapWithIndex: /* @__PURE__ */ _foldMapWithIndex(Ord),
  reduceRightWithIndex: /* @__PURE__ */ _reduceRightWithIndex(Ord),
  filterMapWithIndex: _filterMapWithIndex,
  filterWithIndex: _filterWithIndex,
  partitionMapWithIndex: _partitionMapWithIndex,
  partitionWithIndex: _partitionWithIndex,
  traverseWithIndex: /* @__PURE__ */ _traverseWithIndex(Ord),
  wither: _wither,
  wilt: _wilt
};
const Record = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Compactable,
  Filterable,
  FilterableWithIndex,
  Foldable,
  FoldableWithIndex,
  Functor,
  FunctorWithIndex,
  Traversable,
  TraversableWithIndex,
  URI,
  Witherable,
  collect,
  compact,
  deleteAt,
  difference,
  elem,
  empty,
  every,
  filter: filter$1,
  filterMap: filterMap$1,
  filterMapWithIndex: filterMapWithIndex$1,
  filterWithIndex: filterWithIndex$1,
  flap,
  foldMap: foldMap$1,
  foldMapWithIndex: foldMapWithIndex$1,
  fromEntries,
  fromFoldable,
  fromFoldableMap,
  getDifferenceMagma,
  getEq,
  getFoldable,
  getFoldableWithIndex,
  getIntersectionSemigroup,
  getMonoid,
  getShow,
  getTraversable,
  getTraversableWithIndex,
  getUnionMonoid,
  getUnionSemigroup,
  getWitherable,
  has,
  hasOwnProperty,
  insertAt,
  intersection,
  isEmpty,
  isSubrecord,
  keys,
  lookup,
  map: map$1,
  mapWithIndex: mapWithIndex$1,
  modifyAt,
  partition: partition$1,
  partitionMap: partitionMap$1,
  partitionMapWithIndex: partitionMapWithIndex$1,
  partitionWithIndex: partitionWithIndex$1,
  pop,
  record,
  reduce: reduce$1,
  reduceRight: reduceRight$1,
  reduceRightWithIndex: reduceRightWithIndex$1,
  reduceWithIndex: reduceWithIndex$1,
  separate,
  sequence,
  singleton,
  size,
  some,
  toArray,
  toEntries,
  toUnfoldable,
  traverse,
  traverseWithIndex,
  union,
  updateAt,
  upsertAt,
  wilt,
  wither
}, Symbol.toStringTag, { value: "Module" }));
const require$$4 = /* @__PURE__ */ getAugmentedNamespace(Record);
function map(F) {
  return function(f) {
    return function(fa) {
      return F.map(fa, f);
    };
  };
}
function contramap(F) {
  return function(f) {
    return function(fa) {
      return F.contramap(fa, f);
    };
  };
}
function mapWithIndex(F) {
  return function(f) {
    return function(fa) {
      return F.mapWithIndex(fa, f);
    };
  };
}
function ap(F) {
  return function(fa) {
    return function(fab) {
      return F.ap(fab, fa);
    };
  };
}
function chain(F) {
  return function(f) {
    return function(fa) {
      return F.chain(fa, f);
    };
  };
}
function bimap(F) {
  return function(f, g) {
    return function(fea) {
      return F.bimap(fea, f, g);
    };
  };
}
function mapLeft(F) {
  return function(f) {
    return function(fea) {
      return F.mapLeft(fea, f);
    };
  };
}
function extend$1(F) {
  return function(f) {
    return function(wa) {
      return F.extend(wa, f);
    };
  };
}
function reduce(F) {
  return function(b, f) {
    return function(fa) {
      return F.reduce(fa, b, f);
    };
  };
}
function foldMap(F) {
  return function(M) {
    var foldMapM = F.foldMap(M);
    return function(f) {
      return function(fa) {
        return foldMapM(fa, f);
      };
    };
  };
}
function reduceRight(F) {
  return function(b, f) {
    return function(fa) {
      return F.reduceRight(fa, b, f);
    };
  };
}
function reduceWithIndex(F) {
  return function(b, f) {
    return function(fa) {
      return F.reduceWithIndex(fa, b, f);
    };
  };
}
function foldMapWithIndex(F) {
  return function(M) {
    var foldMapWithIndexM = F.foldMapWithIndex(M);
    return function(f) {
      return function(fa) {
        return foldMapWithIndexM(fa, f);
      };
    };
  };
}
function reduceRightWithIndex(F) {
  return function(b, f) {
    return function(fa) {
      return F.reduceRightWithIndex(fa, b, f);
    };
  };
}
function alt(F) {
  return function(that) {
    return function(fa) {
      return F.alt(fa, that);
    };
  };
}
function filter(F) {
  return function(predicate) {
    return function(fa) {
      return F.filter(fa, predicate);
    };
  };
}
function filterMap(F) {
  return function(f) {
    return function(fa) {
      return F.filterMap(fa, f);
    };
  };
}
function partition(F) {
  return function(f) {
    return function(fa) {
      return F.partition(fa, f);
    };
  };
}
function partitionMap(F) {
  return function(f) {
    return function(fa) {
      return F.partitionMap(fa, f);
    };
  };
}
function filterWithIndex(F) {
  return function(predicate) {
    return function(fa) {
      return F.filterWithIndex(fa, predicate);
    };
  };
}
function filterMapWithIndex(F) {
  return function(f) {
    return function(fa) {
      return F.filterMapWithIndex(fa, f);
    };
  };
}
function partitionWithIndex(F) {
  return function(f) {
    return function(fa) {
      return F.partitionWithIndex(fa, f);
    };
  };
}
function partitionMapWithIndex(F) {
  return function(f) {
    return function(fa) {
      return F.partitionMapWithIndex(fa, f);
    };
  };
}
function promap(F) {
  return function(f, g) {
    return function(fbc) {
      return F.promap(fbc, f, g);
    };
  };
}
function compose(F) {
  return function(ea) {
    return function(ab) {
      return F.compose(ab, ea);
    };
  };
}
var isFunctor = function(I) {
  return typeof I.map === "function";
};
var isContravariant = function(I) {
  return typeof I.contramap === "function";
};
var isFunctorWithIndex = function(I) {
  return typeof I.mapWithIndex === "function";
};
var isApply = function(I) {
  return typeof I.ap === "function";
};
var isChain = function(I) {
  return typeof I.chain === "function";
};
var isBifunctor = function(I) {
  return typeof I.bimap === "function";
};
var isExtend = function(I) {
  return typeof I.extend === "function";
};
var isFoldable = function(I) {
  return typeof I.reduce === "function";
};
var isFoldableWithIndex = function(I) {
  return typeof I.reduceWithIndex === "function";
};
var isAlt = function(I) {
  return typeof I.alt === "function";
};
var isCompactable = function(I) {
  return typeof I.compact === "function";
};
var isFilterable = function(I) {
  return typeof I.filter === "function";
};
var isFilterableWithIndex = function(I) {
  return typeof I.filterWithIndex === "function";
};
var isProfunctor = function(I) {
  return typeof I.promap === "function";
};
var isSemigroupoid = function(I) {
  return typeof I.compose === "function";
};
var isMonadThrow = function(I) {
  return typeof I.throwError === "function";
};
function pipeable(I) {
  var r = {};
  if (isFunctor(I)) {
    r.map = map(I);
  }
  if (isContravariant(I)) {
    r.contramap = contramap(I);
  }
  if (isFunctorWithIndex(I)) {
    r.mapWithIndex = mapWithIndex(I);
  }
  if (isApply(I)) {
    r.ap = ap(I);
    r.apFirst = apFirst$5(I);
    r.apSecond = apSecond$5(I);
  }
  if (isChain(I)) {
    r.chain = chain(I);
    r.chainFirst = chainFirst$5(I);
    r.flatten = r.chain(identity$1);
  }
  if (isBifunctor(I)) {
    r.bimap = bimap(I);
    r.mapLeft = mapLeft(I);
  }
  if (isExtend(I)) {
    r.extend = extend$1(I);
    r.duplicate = r.extend(identity$1);
  }
  if (isFoldable(I)) {
    r.reduce = reduce(I);
    r.foldMap = foldMap(I);
    r.reduceRight = reduceRight(I);
  }
  if (isFoldableWithIndex(I)) {
    r.reduceWithIndex = reduceWithIndex(I);
    r.foldMapWithIndex = foldMapWithIndex(I);
    r.reduceRightWithIndex = reduceRightWithIndex(I);
  }
  if (isAlt(I)) {
    r.alt = alt(I);
  }
  if (isCompactable(I)) {
    r.compact = I.compact;
    r.separate = I.separate;
  }
  if (isFilterable(I)) {
    r.filter = filter(I);
    r.filterMap = filterMap(I);
    r.partition = partition(I);
    r.partitionMap = partitionMap(I);
  }
  if (isFilterableWithIndex(I)) {
    r.filterWithIndex = filterWithIndex(I);
    r.filterMapWithIndex = filterMapWithIndex(I);
    r.partitionWithIndex = partitionWithIndex(I);
    r.partitionMapWithIndex = partitionMapWithIndex(I);
  }
  if (isProfunctor(I)) {
    r.promap = promap(I);
  }
  if (isSemigroupoid(I)) {
    r.compose = compose(I);
  }
  if (isMonadThrow(I)) {
    var fromOption2 = function(onNone) {
      return function(ma) {
        return ma._tag === "None" ? I.throwError(onNone()) : I.of(ma.value);
      };
    };
    var fromEither2 = function(ma) {
      return ma._tag === "Left" ? I.throwError(ma.left) : I.of(ma.right);
    };
    var fromPredicate2 = function(predicate, onFalse) {
      return function(a) {
        return predicate(a) ? I.of(a) : I.throwError(onFalse(a));
      };
    };
    var filterOrElse2 = function(predicate, onFalse) {
      return function(ma) {
        return I.chain(ma, function(a) {
          return predicate(a) ? I.of(a) : I.throwError(onFalse(a));
        });
      };
    };
    r.fromOption = fromOption2;
    r.fromEither = fromEither2;
    r.fromPredicate = fromPredicate2;
    r.filterOrElse = filterOrElse2;
  }
  return r;
}
var pipe = pipe$1;
const pipeable$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  alt,
  ap,
  bimap,
  chain,
  compose,
  contramap,
  extend: extend$1,
  filter,
  filterMap,
  filterMapWithIndex,
  filterWithIndex,
  foldMap,
  foldMapWithIndex,
  map,
  mapLeft,
  mapWithIndex,
  partition,
  partitionMap,
  partitionMapWithIndex,
  partitionWithIndex,
  pipe,
  pipeable,
  promap,
  reduce,
  reduceRight,
  reduceRightWithIndex,
  reduceWithIndex
}, Symbol.toStringTag, { value: "Module" }));
const require$$5 = /* @__PURE__ */ getAugmentedNamespace(pipeable$1);
var utils$9 = {};
Object.defineProperty(utils$9, "__esModule", { value: true });
utils$9.takeUntil = void 0;
var takeUntil = function(predicate) {
  return function(as) {
    var init2 = [];
    for (var i = 0; i < as.length; i++) {
      init2[i] = as[i];
      if (predicate(as[i])) {
        return init2;
      }
    }
    return init2;
  };
};
utils$9.takeUntil = takeUntil;
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.reporter = exports.formatValidationErrors = exports.formatValidationError = exports.TYPE_MAX_LEN = void 0;
  var A = require$$0;
  var E = require$$1;
  var NEA = require$$2;
  var O = require$$3;
  var R = require$$4;
  var pipeable_1 = require$$5;
  var t2 = require$$1$1;
  var utils_1 = utils$9;
  var isUnionType = function(_a2) {
    var type2 = _a2.type;
    return type2 instanceof t2.UnionType;
  };
  var jsToString = function(value) {
    return value === void 0 ? "undefined" : JSON.stringify(value);
  };
  var keyPath = function(ctx) {
    return ctx.map(function(c) {
      return c.key;
    }).filter(Boolean).join(".");
  };
  var getErrorFromCtx = function(validation) {
    return A.last(validation.context);
  };
  var getValidationContext = function(validation) {
    return validation.context;
  };
  exports.TYPE_MAX_LEN = 160;
  var truncateType = function(type2, options) {
    if (options === void 0) {
      options = {};
    }
    var _a2 = options.truncateLongTypes, truncateLongTypes = _a2 === void 0 ? true : _a2;
    if (truncateLongTypes && type2.length > exports.TYPE_MAX_LEN) {
      return type2.slice(0, exports.TYPE_MAX_LEN - 3) + "...";
    }
    return type2;
  };
  var errorMessageSimple = function(expectedType, path, error, options) {
    return [
      "Expecting " + truncateType(expectedType, options),
      path === "" ? "" : "at " + path,
      "but instead got: " + jsToString(error.value),
      error.message ? "(" + error.message + ")" : ""
    ].filter(Boolean).join(" ");
  };
  var errorMessageUnion = function(expectedTypes, path, value, options) {
    return [
      "Expecting one of:\n",
      expectedTypes.map(function(type2) {
        return "    " + truncateType(type2, options);
      }).join("\n"),
      path === "" ? "\n" : "\nat " + path + " ",
      "but instead got: " + jsToString(value)
    ].filter(Boolean).join("");
  };
  var findExpectedType = function(ctx) {
    return pipeable_1.pipe(ctx, A.findIndex(isUnionType), O.chain(function(n) {
      return A.lookup(n + 1, ctx);
    }));
  };
  var formatValidationErrorOfUnion = function(path, errors, options) {
    var expectedTypes = pipeable_1.pipe(errors, A.map(getValidationContext), A.map(findExpectedType), A.compact);
    var value = pipeable_1.pipe(expectedTypes, A.head, O.map(function(v) {
      return v.actual;
    }), O.getOrElse(function() {
      return void 0;
    }));
    var expected = expectedTypes.map(function(_a2) {
      var type2 = _a2.type;
      return type2.name;
    });
    return expected.length > 0 ? O.some(errorMessageUnion(expected, path, value, options)) : O.none;
  };
  var formatValidationCommonError = function(path, error, options) {
    return pipeable_1.pipe(error, getErrorFromCtx, O.map(function(errorContext) {
      return errorMessageSimple(errorContext.type.name, path, error, options);
    }));
  };
  var groupByKey = NEA.groupBy(function(error) {
    return pipeable_1.pipe(error.context, utils_1.takeUntil(isUnionType), keyPath);
  });
  var format = function(path, errors, options) {
    return NEA.tail(errors).length > 0 ? formatValidationErrorOfUnion(path, errors, options) : formatValidationCommonError(path, NEA.head(errors), options);
  };
  var formatValidationError = function(error, options) {
    return formatValidationCommonError(keyPath(error.context), error, options);
  };
  exports.formatValidationError = formatValidationError;
  var formatValidationErrors = function(errors, options) {
    return pipeable_1.pipe(errors, groupByKey, R.mapWithIndex(function(path, errors2) {
      return format(path, errors2, options);
    }), R.compact, R.toArray, A.map(function(_a2) {
      _a2[0];
      var error = _a2[1];
      return error;
    }));
  };
  exports.formatValidationErrors = formatValidationErrors;
  var reporter = function(validation, options) {
    return pipeable_1.pipe(validation, E.mapLeft(function(errors) {
      return exports.formatValidationErrors(errors, options);
    }), E.fold(function(errors) {
      return errors;
    }, function() {
      return [];
    }));
  };
  exports.reporter = reporter;
  var prettyReporter = { report: exports.reporter };
  exports.default = prettyReporter;
})(src);
var TonCache = {};
Object.defineProperty(TonCache, "__esModule", { value: true });
TonCache.InMemoryCache = void 0;
class InMemoryCache {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
    this.set = async (namespace, key, value) => {
      if (value !== null) {
        this.cache.set(namespace + "$$" + key, value);
      } else {
        this.cache.delete(namespace + "$$" + key);
      }
    };
    this.get = async (namespace, key) => {
      let res = this.cache.get(namespace + "$$" + key);
      if (res !== void 0) {
        return res;
      } else {
        return null;
      }
    };
  }
}
TonCache.InMemoryCache = InMemoryCache;
var DataLoader = /* @__PURE__ */ function() {
  function DataLoader2(batchLoadFn, options) {
    if (typeof batchLoadFn !== "function") {
      throw new TypeError("DataLoader must be constructed with a function which accepts " + ("Array<key> and returns Promise<Array<value>>, but got: " + batchLoadFn + "."));
    }
    this._batchLoadFn = batchLoadFn;
    this._maxBatchSize = getValidMaxBatchSize(options);
    this._batchScheduleFn = getValidBatchScheduleFn(options);
    this._cacheKeyFn = getValidCacheKeyFn(options);
    this._cacheMap = getValidCacheMap(options);
    this._batch = null;
  }
  var _proto = DataLoader2.prototype;
  _proto.load = function load(key) {
    if (key === null || key === void 0) {
      throw new TypeError("The loader.load() function must be called with a value, " + ("but got: " + String(key) + "."));
    }
    var batch = getCurrentBatch(this);
    var cacheMap = this._cacheMap;
    var cacheKey = this._cacheKeyFn(key);
    if (cacheMap) {
      var cachedPromise = cacheMap.get(cacheKey);
      if (cachedPromise) {
        var cacheHits = batch.cacheHits || (batch.cacheHits = []);
        return new Promise(function(resolve) {
          cacheHits.push(function() {
            resolve(cachedPromise);
          });
        });
      }
    }
    batch.keys.push(key);
    var promise = new Promise(function(resolve, reject) {
      batch.callbacks.push({
        resolve,
        reject
      });
    });
    if (cacheMap) {
      cacheMap.set(cacheKey, promise);
    }
    return promise;
  };
  _proto.loadMany = function loadMany(keys2) {
    if (!isArrayLike(keys2)) {
      throw new TypeError("The loader.loadMany() function must be called with Array<key> " + ("but got: " + keys2 + "."));
    }
    var loadPromises = [];
    for (var i = 0; i < keys2.length; i++) {
      loadPromises.push(this.load(keys2[i])["catch"](function(error) {
        return error;
      }));
    }
    return Promise.all(loadPromises);
  };
  _proto.clear = function clear(key) {
    var cacheMap = this._cacheMap;
    if (cacheMap) {
      var cacheKey = this._cacheKeyFn(key);
      cacheMap["delete"](cacheKey);
    }
    return this;
  };
  _proto.clearAll = function clearAll() {
    var cacheMap = this._cacheMap;
    if (cacheMap) {
      cacheMap.clear();
    }
    return this;
  };
  _proto.prime = function prime(key, value) {
    var cacheMap = this._cacheMap;
    if (cacheMap) {
      var cacheKey = this._cacheKeyFn(key);
      if (cacheMap.get(cacheKey) === void 0) {
        var promise;
        if (value instanceof Error) {
          promise = Promise.reject(value);
          promise["catch"](function() {
          });
        } else {
          promise = Promise.resolve(value);
        }
        cacheMap.set(cacheKey, promise);
      }
    }
    return this;
  };
  return DataLoader2;
}();
var enqueuePostPromiseJob = typeof process === "object" && typeof process.nextTick === "function" ? function(fn) {
  if (!resolvedPromise) {
    resolvedPromise = Promise.resolve();
  }
  resolvedPromise.then(function() {
    process.nextTick(fn);
  });
} : typeof setImmediate === "function" ? function(fn) {
  setImmediate(fn);
} : function(fn) {
  setTimeout(fn);
};
var resolvedPromise;
function getCurrentBatch(loader) {
  var existingBatch = loader._batch;
  if (existingBatch !== null && !existingBatch.hasDispatched && existingBatch.keys.length < loader._maxBatchSize && (!existingBatch.cacheHits || existingBatch.cacheHits.length < loader._maxBatchSize)) {
    return existingBatch;
  }
  var newBatch = {
    hasDispatched: false,
    keys: [],
    callbacks: []
  };
  loader._batch = newBatch;
  loader._batchScheduleFn(function() {
    dispatchBatch(loader, newBatch);
  });
  return newBatch;
}
function dispatchBatch(loader, batch) {
  batch.hasDispatched = true;
  if (batch.keys.length === 0) {
    resolveCacheHits(batch);
    return;
  }
  var batchPromise = loader._batchLoadFn(batch.keys);
  if (!batchPromise || typeof batchPromise.then !== "function") {
    return failedDispatch(loader, batch, new TypeError("DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but the function did " + ("not return a Promise: " + String(batchPromise) + ".")));
  }
  batchPromise.then(function(values) {
    if (!isArrayLike(values)) {
      throw new TypeError("DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but the function did " + ("not return a Promise of an Array: " + String(values) + "."));
    }
    if (values.length !== batch.keys.length) {
      throw new TypeError("DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but the function did not return a Promise of an Array of the same length as the Array of keys." + ("\n\nKeys:\n" + String(batch.keys)) + ("\n\nValues:\n" + String(values)));
    }
    resolveCacheHits(batch);
    for (var i = 0; i < batch.callbacks.length; i++) {
      var value = values[i];
      if (value instanceof Error) {
        batch.callbacks[i].reject(value);
      } else {
        batch.callbacks[i].resolve(value);
      }
    }
  })["catch"](function(error) {
    failedDispatch(loader, batch, error);
  });
}
function failedDispatch(loader, batch, error) {
  resolveCacheHits(batch);
  for (var i = 0; i < batch.keys.length; i++) {
    loader.clear(batch.keys[i]);
    batch.callbacks[i].reject(error);
  }
}
function resolveCacheHits(batch) {
  if (batch.cacheHits) {
    for (var i = 0; i < batch.cacheHits.length; i++) {
      batch.cacheHits[i]();
    }
  }
}
function getValidMaxBatchSize(options) {
  var shouldBatch = !options || options.batch !== false;
  if (!shouldBatch) {
    return 1;
  }
  var maxBatchSize = options && options.maxBatchSize;
  if (maxBatchSize === void 0) {
    return Infinity;
  }
  if (typeof maxBatchSize !== "number" || maxBatchSize < 1) {
    throw new TypeError("maxBatchSize must be a positive number: " + maxBatchSize);
  }
  return maxBatchSize;
}
function getValidBatchScheduleFn(options) {
  var batchScheduleFn = options && options.batchScheduleFn;
  if (batchScheduleFn === void 0) {
    return enqueuePostPromiseJob;
  }
  if (typeof batchScheduleFn !== "function") {
    throw new TypeError("batchScheduleFn must be a function: " + batchScheduleFn);
  }
  return batchScheduleFn;
}
function getValidCacheKeyFn(options) {
  var cacheKeyFn = options && options.cacheKeyFn;
  if (cacheKeyFn === void 0) {
    return function(key) {
      return key;
    };
  }
  if (typeof cacheKeyFn !== "function") {
    throw new TypeError("cacheKeyFn must be a function: " + cacheKeyFn);
  }
  return cacheKeyFn;
}
function getValidCacheMap(options) {
  var shouldCache = !options || options.cache !== false;
  if (!shouldCache) {
    return null;
  }
  var cacheMap = options && options.cacheMap;
  if (cacheMap === void 0) {
    return /* @__PURE__ */ new Map();
  }
  if (cacheMap !== null) {
    var cacheFunctions = ["get", "set", "delete", "clear"];
    var missingFunctions = cacheFunctions.filter(function(fnName) {
      return cacheMap && typeof cacheMap[fnName] !== "function";
    });
    if (missingFunctions.length !== 0) {
      throw new TypeError("Custom cacheMap missing methods: " + missingFunctions.join(", "));
    }
  }
  return cacheMap;
}
function isArrayLike(x) {
  return typeof x === "object" && x !== null && typeof x.length === "number" && (x.length === 0 || x.length > 0 && Object.prototype.hasOwnProperty.call(x, x.length - 1));
}
var dataloader = DataLoader;
var axiosExports$1 = {};
var axios$2 = {
  get exports() {
    return axiosExports$1;
  },
  set exports(v) {
    axiosExports$1 = v;
  }
};
var axiosExports = {};
var axios$1 = {
  get exports() {
    return axiosExports;
  },
  set exports(v) {
    axiosExports = v;
  }
};
var bind$2 = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};
var bind$1 = bind$2;
var toString = Object.prototype.toString;
function isArray(val) {
  return Array.isArray(val);
}
function isUndefined(val) {
  return typeof val === "undefined";
}
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
}
function isArrayBuffer(val) {
  return toString.call(val) === "[object ArrayBuffer]";
}
function isFormData(val) {
  return toString.call(val) === "[object FormData]";
}
function isArrayBufferView(val) {
  var result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
function isString(val) {
  return typeof val === "string";
}
function isNumber(val) {
  return typeof val === "number";
}
function isObject(val) {
  return val !== null && typeof val === "object";
}
function isPlainObject(val) {
  if (toString.call(val) !== "[object Object]") {
    return false;
  }
  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}
function isDate(val) {
  return toString.call(val) === "[object Date]";
}
function isFile(val) {
  return toString.call(val) === "[object File]";
}
function isBlob(val) {
  return toString.call(val) === "[object Blob]";
}
function isFunction(val) {
  return toString.call(val) === "[object Function]";
}
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}
function isURLSearchParams(val) {
  return toString.call(val) === "[object URLSearchParams]";
}
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
}
function isStandardBrowserEnv() {
  if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
    return false;
  }
  return typeof window !== "undefined" && typeof document !== "undefined";
}
function forEach(obj, fn) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
function merge() {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }
  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === "function") {
      a[key] = bind$1(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}
function stripBOM(content) {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
}
var utils$8 = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isFunction,
  isStream,
  isURLSearchParams,
  isStandardBrowserEnv,
  forEach,
  merge,
  extend,
  trim,
  stripBOM
};
var utils$7 = utils$8;
function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
var buildURL$1 = function buildURL(url, params, paramsSerializer) {
  if (!params) {
    return url;
  }
  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils$7.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];
    utils$7.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === "undefined") {
        return;
      }
      if (utils$7.isArray(val)) {
        key = key + "[]";
      } else {
        val = [val];
      }
      utils$7.forEach(val, function parseValue(v) {
        if (utils$7.isDate(v)) {
          v = v.toISOString();
        } else if (utils$7.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + "=" + encode(v));
      });
    });
    serializedParams = parts.join("&");
  }
  if (serializedParams) {
    var hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
};
var utils$6 = utils$8;
function InterceptorManager$1() {
  this.handlers = [];
}
InterceptorManager$1.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled,
    rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};
InterceptorManager$1.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};
InterceptorManager$1.prototype.forEach = function forEach2(fn) {
  utils$6.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};
var InterceptorManager_1 = InterceptorManager$1;
var utils$5 = utils$8;
var normalizeHeaderName = function normalizeHeaderName2(headers, normalizedName) {
  utils$5.forEach(headers, function processHeader(value, name2) {
    if (name2 !== normalizedName && name2.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name2];
    }
  });
};
var enhanceError = function enhanceError2(error, config, code, request2, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request2;
  error.response = response;
  error.isAxiosError = true;
  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
};
var createError;
var hasRequiredCreateError;
function requireCreateError() {
  if (hasRequiredCreateError)
    return createError;
  hasRequiredCreateError = 1;
  var enhanceError$1 = enhanceError;
  createError = function createError2(message2, config, code, request2, response) {
    var error = new Error(message2);
    return enhanceError$1(error, config, code, request2, response);
  };
  return createError;
}
var settle;
var hasRequiredSettle;
function requireSettle() {
  if (hasRequiredSettle)
    return settle;
  hasRequiredSettle = 1;
  var createError2 = requireCreateError();
  settle = function settle2(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError2(
        "Request failed with status code " + response.status,
        response.config,
        null,
        response.request,
        response
      ));
    }
  };
  return settle;
}
var cookies;
var hasRequiredCookies;
function requireCookies() {
  if (hasRequiredCookies)
    return cookies;
  hasRequiredCookies = 1;
  var utils2 = utils$8;
  cookies = utils2.isStandardBrowserEnv() ? function standardBrowserEnv() {
    return {
      write: function write(name2, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name2 + "=" + encodeURIComponent(value));
        if (utils2.isNumber(expires)) {
          cookie.push("expires=" + new Date(expires).toGMTString());
        }
        if (utils2.isString(path)) {
          cookie.push("path=" + path);
        }
        if (utils2.isString(domain)) {
          cookie.push("domain=" + domain);
        }
        if (secure === true) {
          cookie.push("secure");
        }
        document.cookie = cookie.join("; ");
      },
      read: function read(name2) {
        var match2 = document.cookie.match(new RegExp("(^|;\\s*)(" + name2 + ")=([^;]*)"));
        return match2 ? decodeURIComponent(match2[3]) : null;
      },
      remove: function remove(name2) {
        this.write(name2, "", Date.now() - 864e5);
      }
    };
  }() : function nonStandardBrowserEnv() {
    return {
      write: function write() {
      },
      read: function read() {
        return null;
      },
      remove: function remove() {
      }
    };
  }();
  return cookies;
}
var isAbsoluteURL;
var hasRequiredIsAbsoluteURL;
function requireIsAbsoluteURL() {
  if (hasRequiredIsAbsoluteURL)
    return isAbsoluteURL;
  hasRequiredIsAbsoluteURL = 1;
  isAbsoluteURL = function isAbsoluteURL2(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  };
  return isAbsoluteURL;
}
var combineURLs;
var hasRequiredCombineURLs;
function requireCombineURLs() {
  if (hasRequiredCombineURLs)
    return combineURLs;
  hasRequiredCombineURLs = 1;
  combineURLs = function combineURLs2(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  };
  return combineURLs;
}
var buildFullPath;
var hasRequiredBuildFullPath;
function requireBuildFullPath() {
  if (hasRequiredBuildFullPath)
    return buildFullPath;
  hasRequiredBuildFullPath = 1;
  var isAbsoluteURL2 = requireIsAbsoluteURL();
  var combineURLs2 = requireCombineURLs();
  buildFullPath = function buildFullPath2(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL2(requestedURL)) {
      return combineURLs2(baseURL, requestedURL);
    }
    return requestedURL;
  };
  return buildFullPath;
}
var parseHeaders;
var hasRequiredParseHeaders;
function requireParseHeaders() {
  if (hasRequiredParseHeaders)
    return parseHeaders;
  hasRequiredParseHeaders = 1;
  var utils2 = utils$8;
  var ignoreDuplicateOf = [
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ];
  parseHeaders = function parseHeaders2(headers) {
    var parsed = {};
    var key;
    var val;
    var i;
    if (!headers) {
      return parsed;
    }
    utils2.forEach(headers.split("\n"), function parser(line) {
      i = line.indexOf(":");
      key = utils2.trim(line.substr(0, i)).toLowerCase();
      val = utils2.trim(line.substr(i + 1));
      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === "set-cookie") {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
        }
      }
    });
    return parsed;
  };
  return parseHeaders;
}
var isURLSameOrigin;
var hasRequiredIsURLSameOrigin;
function requireIsURLSameOrigin() {
  if (hasRequiredIsURLSameOrigin)
    return isURLSameOrigin;
  hasRequiredIsURLSameOrigin = 1;
  var utils2 = utils$8;
  isURLSameOrigin = utils2.isStandardBrowserEnv() ? function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement("a");
    var originURL;
    function resolveURL(url) {
      var href = url;
      if (msie) {
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute("href", href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
      };
    }
    originURL = resolveURL(window.location.href);
    return function isURLSameOrigin2(requestURL) {
      var parsed = utils2.isString(requestURL) ? resolveURL(requestURL) : requestURL;
      return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
  }() : function nonStandardBrowserEnv() {
    return function isURLSameOrigin2() {
      return true;
    };
  }();
  return isURLSameOrigin;
}
var Cancel_1;
var hasRequiredCancel;
function requireCancel() {
  if (hasRequiredCancel)
    return Cancel_1;
  hasRequiredCancel = 1;
  function Cancel2(message2) {
    this.message = message2;
  }
  Cancel2.prototype.toString = function toString2() {
    return "Cancel" + (this.message ? ": " + this.message : "");
  };
  Cancel2.prototype.__CANCEL__ = true;
  Cancel_1 = Cancel2;
  return Cancel_1;
}
var xhr;
var hasRequiredXhr;
function requireXhr() {
  if (hasRequiredXhr)
    return xhr;
  hasRequiredXhr = 1;
  var utils2 = utils$8;
  var settle2 = requireSettle();
  var cookies2 = requireCookies();
  var buildURL3 = buildURL$1;
  var buildFullPath2 = requireBuildFullPath();
  var parseHeaders2 = requireParseHeaders();
  var isURLSameOrigin2 = requireIsURLSameOrigin();
  var createError2 = requireCreateError();
  var defaults2 = requireDefaults();
  var Cancel2 = requireCancel();
  xhr = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;
      var responseType = config.responseType;
      var onCanceled;
      function done() {
        if (config.cancelToken) {
          config.cancelToken.unsubscribe(onCanceled);
        }
        if (config.signal) {
          config.signal.removeEventListener("abort", onCanceled);
        }
      }
      if (utils2.isFormData(requestData)) {
        delete requestHeaders["Content-Type"];
      }
      var request2 = new XMLHttpRequest();
      if (config.auth) {
        var username = config.auth.username || "";
        var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
        requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
      }
      var fullPath = buildFullPath2(config.baseURL, config.url);
      request2.open(config.method.toUpperCase(), buildURL3(fullPath, config.params, config.paramsSerializer), true);
      request2.timeout = config.timeout;
      function onloadend() {
        if (!request2) {
          return;
        }
        var responseHeaders = "getAllResponseHeaders" in request2 ? parseHeaders2(request2.getAllResponseHeaders()) : null;
        var responseData = !responseType || responseType === "text" || responseType === "json" ? request2.responseText : request2.response;
        var response = {
          data: responseData,
          status: request2.status,
          statusText: request2.statusText,
          headers: responseHeaders,
          config,
          request: request2
        };
        settle2(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);
        request2 = null;
      }
      if ("onloadend" in request2) {
        request2.onloadend = onloadend;
      } else {
        request2.onreadystatechange = function handleLoad() {
          if (!request2 || request2.readyState !== 4) {
            return;
          }
          if (request2.status === 0 && !(request2.responseURL && request2.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request2.onabort = function handleAbort() {
        if (!request2) {
          return;
        }
        reject(createError2("Request aborted", config, "ECONNABORTED", request2));
        request2 = null;
      };
      request2.onerror = function handleError() {
        reject(createError2("Network Error", config, null, request2));
        request2 = null;
      };
      request2.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
        var transitional2 = config.transitional || defaults2.transitional;
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(createError2(
          timeoutErrorMessage,
          config,
          transitional2.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED",
          request2
        ));
        request2 = null;
      };
      if (utils2.isStandardBrowserEnv()) {
        var xsrfValue = (config.withCredentials || isURLSameOrigin2(fullPath)) && config.xsrfCookieName ? cookies2.read(config.xsrfCookieName) : void 0;
        if (xsrfValue) {
          requestHeaders[config.xsrfHeaderName] = xsrfValue;
        }
      }
      if ("setRequestHeader" in request2) {
        utils2.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
            delete requestHeaders[key];
          } else {
            request2.setRequestHeader(key, val);
          }
        });
      }
      if (!utils2.isUndefined(config.withCredentials)) {
        request2.withCredentials = !!config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request2.responseType = config.responseType;
      }
      if (typeof config.onDownloadProgress === "function") {
        request2.addEventListener("progress", config.onDownloadProgress);
      }
      if (typeof config.onUploadProgress === "function" && request2.upload) {
        request2.upload.addEventListener("progress", config.onUploadProgress);
      }
      if (config.cancelToken || config.signal) {
        onCanceled = function(cancel) {
          if (!request2) {
            return;
          }
          reject(!cancel || cancel && cancel.type ? new Cancel2("canceled") : cancel);
          request2.abort();
          request2 = null;
        };
        config.cancelToken && config.cancelToken.subscribe(onCanceled);
        if (config.signal) {
          config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
        }
      }
      if (!requestData) {
        requestData = null;
      }
      request2.send(requestData);
    });
  };
  return xhr;
}
var defaults_1;
var hasRequiredDefaults;
function requireDefaults() {
  if (hasRequiredDefaults)
    return defaults_1;
  hasRequiredDefaults = 1;
  var utils2 = utils$8;
  var normalizeHeaderName$1 = normalizeHeaderName;
  var enhanceError$1 = enhanceError;
  var DEFAULT_CONTENT_TYPE = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  function setContentTypeIfUnset(headers, value) {
    if (!utils2.isUndefined(headers) && utils2.isUndefined(headers["Content-Type"])) {
      headers["Content-Type"] = value;
    }
  }
  function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== "undefined") {
      adapter = requireXhr();
    } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
      adapter = requireXhr();
    }
    return adapter;
  }
  function stringifySafely(rawValue, parser, encoder) {
    if (utils2.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils2.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  var defaults2 = {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    },
    adapter: getDefaultAdapter(),
    transformRequest: [function transformRequest(data2, headers) {
      normalizeHeaderName$1(headers, "Accept");
      normalizeHeaderName$1(headers, "Content-Type");
      if (utils2.isFormData(data2) || utils2.isArrayBuffer(data2) || utils2.isBuffer(data2) || utils2.isStream(data2) || utils2.isFile(data2) || utils2.isBlob(data2)) {
        return data2;
      }
      if (utils2.isArrayBufferView(data2)) {
        return data2.buffer;
      }
      if (utils2.isURLSearchParams(data2)) {
        setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
        return data2.toString();
      }
      if (utils2.isObject(data2) || headers && headers["Content-Type"] === "application/json") {
        setContentTypeIfUnset(headers, "application/json");
        return stringifySafely(data2);
      }
      return data2;
    }],
    transformResponse: [function transformResponse(data2) {
      var transitional2 = this.transitional || defaults2.transitional;
      var silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      var forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
      var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
      if (strictJSONParsing || forcedJSONParsing && utils2.isString(data2) && data2.length) {
        try {
          return JSON.parse(data2);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw enhanceError$1(e, this, "E_JSON_PARSE");
            }
            throw e;
          }
        }
      }
      return data2;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*"
      }
    }
  };
  utils2.forEach(["delete", "get", "head"], function forEachMethodNoData2(method) {
    defaults2.headers[method] = {};
  });
  utils2.forEach(["post", "put", "patch"], function forEachMethodWithData2(method) {
    defaults2.headers[method] = utils2.merge(DEFAULT_CONTENT_TYPE);
  });
  defaults_1 = defaults2;
  return defaults_1;
}
var utils$4 = utils$8;
var defaults$2 = requireDefaults();
var transformData$1 = function transformData(data2, headers, fns) {
  var context = this || defaults$2;
  utils$4.forEach(fns, function transform(fn) {
    data2 = fn.call(context, data2, headers);
  });
  return data2;
};
var isCancel$1;
var hasRequiredIsCancel;
function requireIsCancel() {
  if (hasRequiredIsCancel)
    return isCancel$1;
  hasRequiredIsCancel = 1;
  isCancel$1 = function isCancel2(value) {
    return !!(value && value.__CANCEL__);
  };
  return isCancel$1;
}
var utils$3 = utils$8;
var transformData2 = transformData$1;
var isCancel = requireIsCancel();
var defaults$1 = requireDefaults();
var Cancel = requireCancel();
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new Cancel("canceled");
  }
}
var dispatchRequest$1 = function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = config.headers || {};
  config.data = transformData2.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );
  config.headers = utils$3.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );
  utils$3.forEach(
    ["delete", "get", "head", "post", "put", "patch", "common"],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );
  var adapter = config.adapter || defaults$1.adapter;
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData2.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData2.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }
    return Promise.reject(reason);
  });
};
var utils$2 = utils$8;
var mergeConfig$2 = function mergeConfig(config1, config2) {
  config2 = config2 || {};
  var config = {};
  function getMergedValue(target, source) {
    if (utils$2.isPlainObject(target) && utils$2.isPlainObject(source)) {
      return utils$2.merge(target, source);
    } else if (utils$2.isPlainObject(source)) {
      return utils$2.merge({}, source);
    } else if (utils$2.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(prop) {
    if (!utils$2.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils$2.isUndefined(config1[prop])) {
      return getMergedValue(void 0, config1[prop]);
    }
  }
  function valueFromConfig2(prop) {
    if (!utils$2.isUndefined(config2[prop])) {
      return getMergedValue(void 0, config2[prop]);
    }
  }
  function defaultToConfig2(prop) {
    if (!utils$2.isUndefined(config2[prop])) {
      return getMergedValue(void 0, config2[prop]);
    } else if (!utils$2.isUndefined(config1[prop])) {
      return getMergedValue(void 0, config1[prop]);
    }
  }
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(void 0, config1[prop]);
    }
  }
  var mergeMap = {
    "url": valueFromConfig2,
    "method": valueFromConfig2,
    "data": valueFromConfig2,
    "baseURL": defaultToConfig2,
    "transformRequest": defaultToConfig2,
    "transformResponse": defaultToConfig2,
    "paramsSerializer": defaultToConfig2,
    "timeout": defaultToConfig2,
    "timeoutMessage": defaultToConfig2,
    "withCredentials": defaultToConfig2,
    "adapter": defaultToConfig2,
    "responseType": defaultToConfig2,
    "xsrfCookieName": defaultToConfig2,
    "xsrfHeaderName": defaultToConfig2,
    "onUploadProgress": defaultToConfig2,
    "onDownloadProgress": defaultToConfig2,
    "decompress": defaultToConfig2,
    "maxContentLength": defaultToConfig2,
    "maxBodyLength": defaultToConfig2,
    "transport": defaultToConfig2,
    "httpAgent": defaultToConfig2,
    "httpsAgent": defaultToConfig2,
    "cancelToken": defaultToConfig2,
    "socketPath": defaultToConfig2,
    "responseEncoding": defaultToConfig2,
    "validateStatus": mergeDirectKeys
  };
  utils$2.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge2 = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge2(prop);
    utils$2.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
};
var data;
var hasRequiredData;
function requireData() {
  if (hasRequiredData)
    return data;
  hasRequiredData = 1;
  data = {
    "version": "0.25.0"
  };
  return data;
}
var VERSION = requireData().version;
var validators$1 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type2, i) {
  validators$1[type2] = function validator2(thing) {
    return typeof thing === type2 || "a" + (i < 1 ? "n " : " ") + type2;
  };
});
var deprecatedWarnings = {};
validators$1.transitional = function transitional(validator2, version2, message2) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message2 ? ". " + message2 : "");
  }
  return function(value, opt, opts) {
    if (validator2 === false) {
      throw new Error(formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")));
    }
    if (version2 && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version2 + " and will be removed in the near future"
        )
      );
    }
    return validator2 ? validator2(value, opt, opts) : true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new TypeError("options must be an object");
  }
  var keys2 = Object.keys(options);
  var i = keys2.length;
  while (i-- > 0) {
    var opt = keys2[i];
    var validator2 = schema[opt];
    if (validator2) {
      var value = options[opt];
      var result = value === void 0 || validator2(value, opt, options);
      if (result !== true) {
        throw new TypeError("option " + opt + " must be " + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error("Unknown option " + opt);
    }
  }
}
var validator$1 = {
  assertOptions,
  validators: validators$1
};
var utils$1 = utils$8;
var buildURL2 = buildURL$1;
var InterceptorManager = InterceptorManager_1;
var dispatchRequest2 = dispatchRequest$1;
var mergeConfig$1 = mergeConfig$2;
var validator = validator$1;
var validators = validator.validators;
function Axios$1(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
Axios$1.prototype.request = function request(configOrUrl, config) {
  if (typeof configOrUrl === "string") {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }
  if (!config.url) {
    throw new Error("Provided config url is not valid");
  }
  config = mergeConfig$1(this.defaults, config);
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = "get";
  }
  var transitional2 = config.transitional;
  if (transitional2 !== void 0) {
    validator.assertOptions(transitional2, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
      return;
    }
    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });
  var promise;
  if (!synchronousRequestInterceptors) {
    var chain2 = [dispatchRequest2, void 0];
    Array.prototype.unshift.apply(chain2, requestInterceptorChain);
    chain2 = chain2.concat(responseInterceptorChain);
    promise = Promise.resolve(config);
    while (chain2.length) {
      promise = promise.then(chain2.shift(), chain2.shift());
    }
    return promise;
  }
  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }
  try {
    promise = dispatchRequest2(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }
  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }
  return promise;
};
Axios$1.prototype.getUri = function getUri(config) {
  if (!config.url) {
    throw new Error("Provided config url is not valid");
  }
  config = mergeConfig$1(this.defaults, config);
  return buildURL2(config.url, config.params, config.paramsSerializer).replace(/^\?/, "");
};
utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
  Axios$1.prototype[method] = function(url, config) {
    return this.request(mergeConfig$1(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});
utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  Axios$1.prototype[method] = function(url, data2, config) {
    return this.request(mergeConfig$1(config || {}, {
      method,
      url,
      data: data2
    }));
  };
});
var Axios_1 = Axios$1;
var CancelToken_1;
var hasRequiredCancelToken;
function requireCancelToken() {
  if (hasRequiredCancelToken)
    return CancelToken_1;
  hasRequiredCancelToken = 1;
  var Cancel2 = requireCancel();
  function CancelToken(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    var token = this;
    this.promise.then(function(cancel) {
      if (!token._listeners)
        return;
      var i;
      var l = token._listeners.length;
      for (i = 0; i < l; i++) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = function(onfulfilled) {
      var _resolve;
      var promise = new Promise(function(resolve) {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message2) {
      if (token.reason) {
        return;
      }
      token.reason = new Cancel2(message2);
      resolvePromise(token.reason);
    });
  }
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };
  CancelToken.prototype.subscribe = function subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  };
  CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    var index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  };
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  };
  CancelToken_1 = CancelToken;
  return CancelToken_1;
}
var spread;
var hasRequiredSpread;
function requireSpread() {
  if (hasRequiredSpread)
    return spread;
  hasRequiredSpread = 1;
  spread = function spread2(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };
  return spread;
}
var isAxiosError;
var hasRequiredIsAxiosError;
function requireIsAxiosError() {
  if (hasRequiredIsAxiosError)
    return isAxiosError;
  hasRequiredIsAxiosError = 1;
  var utils2 = utils$8;
  isAxiosError = function isAxiosError2(payload) {
    return utils2.isObject(payload) && payload.isAxiosError === true;
  };
  return isAxiosError;
}
var utils = utils$8;
var bind2 = bind$2;
var Axios = Axios_1;
var mergeConfig2 = mergeConfig$2;
var defaults = requireDefaults();
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind2(Axios.prototype.request, context);
  utils.extend(instance, Axios.prototype, context);
  utils.extend(instance, context);
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig2(defaultConfig, instanceConfig));
  };
  return instance;
}
var axios = createInstance(defaults);
axios.Axios = Axios;
axios.Cancel = requireCancel();
axios.CancelToken = requireCancelToken();
axios.isCancel = requireIsCancel();
axios.VERSION = requireData().version;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = requireSpread();
axios.isAxiosError = requireIsAxiosError();
axios$1.exports = axios;
axiosExports.default = axios;
(function(module) {
  module.exports = axiosExports;
})(axios$2);
const name = "ton";
const version$1 = "13.3.0";
const repository = "https://github.com/tonwhales/ton.git";
const author = "Steve Korshakov <steve@korshakov.com>";
const license = "MIT";
const main = "dist/index.js";
const files = [
  "dist"
];
const scripts = {
  build: "rm -fr dist && tsc --declaration",
  test: "jest --verbose --runInBand",
  release: "yarn build && yarn release-it --npm.yarn1"
};
const devDependencies = {
  "@release-it/keep-a-changelog": "^3.1.0",
  "@types/jest": "^27.0.1",
  "@types/node": "^16.7.10",
  buffer: "^6.0.3",
  expect: "^27.1.0",
  jest: "^27.1.0",
  "jest-mock": "^27.1.0",
  karma: "^6.3.4",
  "karma-chrome-launcher": "^3.1.0",
  "karma-jasmine": "^4.0.1",
  "karma-typescript": "^5.5.2",
  "karma-webpack": "^5.0.0",
  prando: "^6.0.1",
  "release-it": "^15.5.1",
  "ton-core": "^0.32.0",
  "ton-crypto": "3.2.0",
  "ts-jest": "^27.0.5",
  "ts-loader": "^9.2.5",
  "ts-node": "^10.7.0",
  typescript: "^4.4.2",
  webpack: "^5.51.2"
};
const dependencies = {
  axios: "^0.25.0",
  dataloader: "^2.0.0",
  "fp-ts": "^2.11.1",
  "io-ts": "^2.2.16",
  "io-ts-reporters": "^2.0.0",
  "symbol.inspect": "1.0.1",
  teslabot: "^1.3.0"
};
const peerDependencies = {
  "ton-core": ">=0.32.0",
  "ton-crypto": ">=3.2.0"
};
const publishConfig = {
  access: "public",
  registry: "https://registry.npmjs.org/"
};
const require$$6 = {
  name,
  version: version$1,
  repository,
  author,
  license,
  main,
  files,
  scripts,
  devDependencies,
  dependencies,
  peerDependencies,
  publishConfig,
  "release-it": {
    github: {
      release: true
    },
    plugins: {
      "@release-it/keep-a-changelog": {
        filename: "CHANGELOG.md"
      }
    }
  }
};
var __createBinding$1 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  Object.defineProperty(o, k2, { enumerable: true, get: function() {
    return m[k];
  } });
} : function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault$1 = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function(o, v) {
  o["default"] = v;
});
var __importStar$1 = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod)
      if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
        __createBinding$1(result, mod, k);
  }
  __setModuleDefault$1(result, mod);
  return result;
};
var __importDefault$1 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(HttpApi$1, "__esModule", { value: true });
HttpApi$1.HttpApi = void 0;
const t$1 = __importStar$1(require$$1$1);
const Either_1 = Either;
const io_ts_reporters_1 = __importDefault$1(src);
const TonCache_1 = TonCache;
const dataloader_1 = __importDefault$1(dataloader);
const axios_1$1 = __importDefault$1(axiosExports$1);
const version = require$$6.version;
const blockIdExt = t$1.type({
  "@type": t$1.literal("ton.blockIdExt"),
  workchain: t$1.number,
  shard: t$1.string,
  seqno: t$1.number,
  root_hash: t$1.string,
  file_hash: t$1.string
});
const addressInformation = t$1.type({
  balance: t$1.union([t$1.number, t$1.string]),
  state: t$1.union([t$1.literal("active"), t$1.literal("uninitialized"), t$1.literal("frozen")]),
  data: t$1.string,
  code: t$1.string,
  last_transaction_id: t$1.type({
    "@type": t$1.literal("internal.transactionId"),
    lt: t$1.string,
    hash: t$1.string
  }),
  block_id: blockIdExt,
  sync_utime: t$1.number
});
const bocResponse = t$1.type({
  "@type": t$1.literal("ok")
});
const feeResponse = t$1.type({
  "@type": t$1.literal("query.fees"),
  source_fees: t$1.type({
    "@type": t$1.literal("fees"),
    in_fwd_fee: t$1.number,
    storage_fee: t$1.number,
    gas_fee: t$1.number,
    fwd_fee: t$1.number
  })
});
const callGetMethod = t$1.type({
  gas_used: t$1.number,
  exit_code: t$1.number,
  stack: t$1.array(t$1.unknown)
});
const messageData = t$1.union([
  t$1.type({
    "@type": t$1.literal("msg.dataRaw"),
    "body": t$1.string
  }),
  t$1.type({
    "@type": t$1.literal("msg.dataText"),
    "text": t$1.string
  }),
  t$1.type({
    "@type": t$1.literal("msg.dataDecryptedText"),
    "text": t$1.string
  }),
  t$1.type({
    "@type": t$1.literal("msg.dataEncryptedText"),
    "text": t$1.string
  })
]);
const message = t$1.type({
  source: t$1.string,
  destination: t$1.string,
  value: t$1.string,
  fwd_fee: t$1.string,
  ihr_fee: t$1.string,
  created_lt: t$1.string,
  body_hash: t$1.string,
  msg_data: messageData
});
const transaction = t$1.type({
  data: t$1.string,
  utime: t$1.number,
  transaction_id: t$1.type({
    lt: t$1.string,
    hash: t$1.string
  }),
  fee: t$1.string,
  storage_fee: t$1.string,
  other_fee: t$1.string,
  in_msg: t$1.union([t$1.undefined, message]),
  out_msgs: t$1.array(message)
});
const getTransactions = t$1.array(transaction);
const getMasterchain = t$1.type({
  state_root_hash: t$1.string,
  last: blockIdExt,
  init: blockIdExt
});
const getShards = t$1.type({
  shards: t$1.array(blockIdExt)
});
const blockShortTxt = t$1.type({
  "@type": t$1.literal("blocks.shortTxId"),
  mode: t$1.number,
  account: t$1.string,
  lt: t$1.string,
  hash: t$1.string
});
const getBlockTransactions = t$1.type({
  id: blockIdExt,
  req_count: t$1.number,
  incomplete: t$1.boolean,
  transactions: t$1.array(blockShortTxt)
});
class TypedCache {
  constructor(namespace, cache, codec, keyEncoder) {
    this.namespace = namespace;
    this.cache = cache;
    this.codec = codec;
    this.keyEncoder = keyEncoder;
  }
  async get(key) {
    let ex = await this.cache.get(this.namespace, this.keyEncoder(key));
    if (ex) {
      let decoded = this.codec.decode(JSON.parse(ex));
      if ((0, Either_1.isRight)(decoded)) {
        return decoded.right;
      }
    }
    return null;
  }
  async set(key, value) {
    if (value !== null) {
      await this.cache.set(this.namespace, this.keyEncoder(key), JSON.stringify(value));
    } else {
      await this.cache.set(this.namespace, this.keyEncoder(key), null);
    }
  }
}
class HttpApi {
  constructor(endpoint, parameters) {
    this.endpoint = endpoint;
    this.cache = new TonCache_1.InMemoryCache();
    this.parameters = {
      timeout: (parameters == null ? void 0 : parameters.timeout) || 3e4,
      apiKey: parameters == null ? void 0 : parameters.apiKey
    };
    this.shardCache = new TypedCache("ton-shard", this.cache, t$1.array(blockIdExt), (src2) => src2 + "");
    this.shardLoader = new dataloader_1.default(async (src2) => {
      return await Promise.all(src2.map(async (v) => {
        const cached = await this.shardCache.get(v);
        if (cached) {
          return cached;
        }
        let loaded = (await this.doCall("shards", { seqno: v }, getShards)).shards;
        await this.shardCache.set(v, loaded);
        return loaded;
      }));
    });
    this.shardTransactionsCache = new TypedCache("ton-shard-tx", this.cache, getBlockTransactions, (src2) => src2.workchain + ":" + src2.shard + ":" + src2.seqno);
    this.shardTransactionsLoader = new dataloader_1.default(async (src2) => {
      return await Promise.all(src2.map(async (v) => {
        const cached = await this.shardTransactionsCache.get(v);
        if (cached) {
          return cached;
        }
        let loaded = await this.doCall("getBlockTransactions", { workchain: v.workchain, seqno: v.seqno, shard: v.shard }, getBlockTransactions);
        await this.shardTransactionsCache.set(v, loaded);
        return loaded;
      }));
    }, { cacheKeyFn: (src2) => src2.workchain + ":" + src2.shard + ":" + src2.seqno });
  }
  getAddressInformation(address) {
    return this.doCall("getAddressInformation", { address: address.toString() }, addressInformation);
  }
  async getTransactions(address, opts) {
    const inclusive = opts.inclusive;
    delete opts.inclusive;
    let hash = void 0;
    if (opts.hash) {
      hash = Buffer.from(opts.hash, "base64").toString("hex");
    }
    let limit = opts.limit;
    if (opts.hash && opts.lt && inclusive !== true) {
      limit++;
    }
    let res = await this.doCall("getTransactions", { address: address.toString(), ...opts, limit, hash }, getTransactions);
    if (res.length > limit) {
      res = res.slice(0, limit);
    }
    if (opts.hash && opts.lt && inclusive !== true) {
      res.shift();
      return res;
    } else {
      return res;
    }
  }
  async getMasterchainInfo() {
    return await this.doCall("getMasterchainInfo", {}, getMasterchain);
  }
  async getShards(seqno) {
    return await this.shardLoader.load(seqno);
  }
  async getBlockTransactions(workchain, seqno, shard) {
    return await this.shardTransactionsLoader.load({ workchain, seqno, shard });
  }
  async getTransaction(address, lt, hash) {
    let convHash = Buffer.from(hash, "base64").toString("hex");
    let res = await this.doCall("getTransactions", { address: address.toString(), lt, hash: convHash, limit: 1 }, getTransactions);
    let ex = res.find((v) => v.transaction_id.lt === lt && v.transaction_id.hash === hash);
    if (ex) {
      return ex;
    } else {
      return null;
    }
  }
  async callGetMethod(address, method, stack) {
    return await this.doCall("runGetMethod", { address: address.toString(), method, stack: serializeStack(stack) }, callGetMethod);
  }
  async sendBoc(body) {
    await this.doCall("sendBoc", { boc: body.toString("base64") }, bocResponse);
  }
  async estimateFee(address, args) {
    return await this.doCall("estimateFee", {
      address: address.toString(),
      body: args.body.toBoc().toString("base64"),
      "init_data": args.initData ? args.initData.toBoc().toString("base64") : "",
      "init_code": args.initCode ? args.initCode.toBoc().toString("base64") : "",
      ignore_chksig: args.ignoreSignature
    }, feeResponse);
  }
  async doCall(method, body, codec) {
    let headers = {
      "Content-Type": "application/json",
      "X-Ton-Client-Version": version
    };
    if (this.parameters.apiKey) {
      headers["X-API-Key"] = this.parameters.apiKey;
    }
    let res = await axios_1$1.default.post(this.endpoint, JSON.stringify({
      id: "1",
      jsonrpc: "2.0",
      method,
      params: body
    }), {
      headers,
      timeout: this.parameters.timeout
    });
    if (res.status !== 200 || !res.data.ok) {
      throw Error("Received error: " + JSON.stringify(res.data));
    }
    let decoded = codec.decode(res.data.result);
    if ((0, Either_1.isRight)(decoded)) {
      return decoded.right;
    } else {
      throw Error("Malformed response: " + io_ts_reporters_1.default.report(decoded).join(", "));
    }
  }
}
HttpApi$1.HttpApi = HttpApi;
function serializeStack(src2) {
  let stack = [];
  for (let s of src2) {
    if (s.type === "int") {
      stack.push(["num", s.value.toString()]);
    } else if (s.type === "cell") {
      stack.push(["tvm.Cell", s.cell.toBoc().toString("base64")]);
    } else if (s.type === "slice") {
      stack.push(["tvm.Slice", s.cell.toBoc().toString("base64")]);
    } else if (s.type === "builder") {
      stack.push(["tvm.Builder", s.cell.toBoc().toString("base64")]);
    } else {
      throw Error("Unsupported stack item type: " + s.type);
    }
  }
  return stack;
}
var TonClient$1 = {};
var __classPrivateFieldSet$1 = commonjsGlobal && commonjsGlobal.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet$1 = commonjsGlobal && commonjsGlobal.__classPrivateFieldGet || function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TonClient_api;
Object.defineProperty(TonClient$1, "__esModule", { value: true });
TonClient$1.TonClient = void 0;
const HttpApi_1 = HttpApi$1;
const ton_core_1$b = dist$1;
class TonClient {
  constructor(parameters) {
    _TonClient_api.set(this, void 0);
    this.parameters = {
      endpoint: parameters.endpoint
    };
    __classPrivateFieldSet$1(this, _TonClient_api, new HttpApi_1.HttpApi(this.parameters.endpoint, {
      timeout: parameters.timeout,
      apiKey: parameters.apiKey,
      adapter: parameters.httpAdapter
    }), "f");
  }
  /**
   * Get Address Balance
   * @param address address for balance check
   * @returns balance
   */
  async getBalance(address) {
    return (await this.getContractState(address)).balance;
  }
  /**
   * Invoke get method
   * @param address contract address
   * @param name name of method
   * @param params optional parameters
   * @returns stack and gas_used field
   */
  async callGetMethod(address, name2, stack = []) {
    let res = await __classPrivateFieldGet$1(this, _TonClient_api, "f").callGetMethod(address, name2, stack);
    if (res.exit_code !== 0) {
      throw Error("Unable to execute get method. Got exit_code: " + res.exit_code);
    }
    return { gas_used: res.gas_used, stack: parseStack(res.stack) };
  }
  /**
   * Invoke get method that returns error code instead of throwing error
   * @param address contract address
   * @param name name of method
   * @param params optional parameters
   * @returns stack and gas_used field
  */
  async callGetMethodWithError(address, name2, params = []) {
    let res = await __classPrivateFieldGet$1(this, _TonClient_api, "f").callGetMethod(address, name2, params);
    return { gas_used: res.gas_used, stack: parseStack(res.stack), exit_code: res.exit_code };
  }
  /**
   * Get transactions
   * @param address address
   */
  async getTransactions(address, opts) {
    let tx = await __classPrivateFieldGet$1(this, _TonClient_api, "f").getTransactions(address, opts);
    let res = [];
    for (let r of tx) {
      res.push((0, ton_core_1$b.loadTransaction)(ton_core_1$b.Cell.fromBoc(Buffer.from(r.data, "base64"))[0].beginParse()));
    }
    return res;
  }
  /**
   * Get transaction by it's id
   * @param address address
   * @param lt logical time
   * @param hash transaction hash
   * @returns transaction or null if not exist
   */
  async getTransaction(address, lt, hash) {
    let res = await __classPrivateFieldGet$1(this, _TonClient_api, "f").getTransaction(address, lt, hash);
    if (res) {
      return (0, ton_core_1$b.loadTransaction)(ton_core_1$b.Cell.fromBoc(Buffer.from(res.data, "base64"))[0].beginParse());
    } else {
      return null;
    }
  }
  /**
   * Fetch latest masterchain info
   * @returns masterchain info
   */
  async getMasterchainInfo() {
    let r = await __classPrivateFieldGet$1(this, _TonClient_api, "f").getMasterchainInfo();
    return {
      workchain: r.init.workchain,
      shard: r.last.shard,
      initSeqno: r.init.seqno,
      latestSeqno: r.last.seqno
    };
  }
  /**
   * Fetch latest workchain shards
   * @param seqno masterchain seqno
   */
  async getWorkchainShards(seqno) {
    let r = await __classPrivateFieldGet$1(this, _TonClient_api, "f").getShards(seqno);
    return r.map((m) => ({
      workchain: m.workchain,
      shard: m.shard,
      seqno: m.seqno
    }));
  }
  /**
   * Fetch transactions inf shards
   * @param workchain
   * @param seqno
   * @param shard
   */
  async getShardTransactions(workchain, seqno, shard) {
    let tx = await __classPrivateFieldGet$1(this, _TonClient_api, "f").getBlockTransactions(workchain, seqno, shard);
    if (tx.incomplete) {
      throw Error("Unsupported");
    }
    return tx.transactions.map((v) => ({
      account: ton_core_1$b.Address.parseRaw(v.account),
      lt: v.lt,
      hash: v.hash
    }));
  }
  /**
   * Send message to a network
   * @param src source message
   */
  async sendMessage(src2) {
    const boc = (0, ton_core_1$b.beginCell)().store((0, ton_core_1$b.storeMessage)(src2)).endCell().toBoc();
    await __classPrivateFieldGet$1(this, _TonClient_api, "f").sendBoc(boc);
  }
  /**
   * Send file to a network
   * @param src source file
   */
  async sendFile(src2) {
    await __classPrivateFieldGet$1(this, _TonClient_api, "f").sendBoc(src2);
  }
  /**
   * Estimate fees for external message
   * @param address target address
   * @returns
   */
  async estimateExternalMessageFee(address, args) {
    return await __classPrivateFieldGet$1(this, _TonClient_api, "f").estimateFee(address, { body: args.body, initCode: args.initCode, initData: args.initData, ignoreSignature: args.ignoreSignature });
  }
  /**
   * Send external message to contract
   * @param contract contract to send message
   * @param src message body
   */
  async sendExternalMessage(contract, src2) {
    if (await this.isContractDeployed(contract.address) || !contract.init) {
      const message2 = (0, ton_core_1$b.external)({
        to: contract.address,
        body: src2
      });
      await this.sendMessage(message2);
    } else {
      const message2 = (0, ton_core_1$b.external)({
        to: contract.address,
        init: { code: contract.init.code, data: contract.init.data },
        body: src2
      });
      await this.sendMessage(message2);
    }
  }
  /**
   * Check if contract is deployed
   * @param address addres to check
   * @returns true if contract is in active state
   */
  async isContractDeployed(address) {
    return (await this.getContractState(address)).state === "active";
  }
  /**
   * Resolves contract state
   * @param address contract address
   */
  async getContractState(address) {
    let info = await __classPrivateFieldGet$1(this, _TonClient_api, "f").getAddressInformation(address);
    let balance = BigInt(info.balance);
    let state = info.state;
    return {
      balance,
      state,
      code: info.code !== "" ? Buffer.from(info.code, "base64") : null,
      data: info.data !== "" ? Buffer.from(info.data, "base64") : null,
      lastTransaction: info.last_transaction_id.lt !== "0" ? {
        lt: info.last_transaction_id.lt,
        hash: info.last_transaction_id.hash
      } : null,
      blockId: {
        workchain: info.block_id.workchain,
        shard: info.block_id.shard,
        seqno: info.block_id.seqno
      },
      timestampt: info.sync_utime
    };
  }
  /**
   * Open contract
   * @param src source contract
   * @returns contract
   */
  open(src2) {
    return (0, ton_core_1$b.openContract)(src2, (args) => createProvider$1(this, args.address, args.init));
  }
  /**
   * Create a provider
   * @param address address
   * @param init optional init
   * @returns provider
   */
  provider(address, init2) {
    return createProvider$1(this, address, init2);
  }
}
TonClient$1.TonClient = TonClient;
_TonClient_api = /* @__PURE__ */ new WeakMap();
function parseStack(src2) {
  let stack = [];
  for (let s of src2) {
    if (s[0] === "num") {
      let val = s[1];
      if (val.startsWith("-")) {
        stack.push({ type: "int", value: -BigInt(val.slice(1)) });
      } else {
        stack.push({ type: "int", value: BigInt(val) });
      }
    } else if (s[0] === "null") {
      stack.push({ type: "null" });
    } else if (s[0] === "cell") {
      stack.push({ type: "cell", cell: ton_core_1$b.Cell.fromBoc(Buffer.from(s[1].bytes, "base64"))[0] });
    } else if (s[0] === "slice") {
      stack.push({ type: "slice", cell: ton_core_1$b.Cell.fromBoc(Buffer.from(s[1].bytes, "base64"))[0] });
    } else if (s[0] === "builder") {
      stack.push({ type: "builder", cell: ton_core_1$b.Cell.fromBoc(Buffer.from(s[1].bytes, "base64"))[0] });
    } else {
      throw Error("Unsupported stack item type: " + s[0]);
    }
  }
  return new ton_core_1$b.TupleReader(stack);
}
function createProvider$1(client, address, init2) {
  return {
    async getState() {
      let state = await client.getContractState(address);
      let balance = state.balance;
      let last2 = state.lastTransaction ? { lt: BigInt(state.lastTransaction.lt), hash: Buffer.from(state.lastTransaction.hash, "base64") } : null;
      let storage;
      if (state.state === "active") {
        storage = {
          type: "active",
          code: state.code ? state.code : null,
          data: state.data ? state.data : null
        };
      } else if (state.state === "uninitialized") {
        storage = {
          type: "uninit"
        };
      } else if (state.state === "frozen") {
        storage = {
          type: "frozen",
          stateHash: Buffer.alloc(0)
        };
      } else {
        throw Error("Unsupported state");
      }
      return {
        balance,
        last: last2,
        state: storage
      };
    },
    async get(name2, args) {
      let method = await client.callGetMethod(address, name2, args);
      return { stack: method.stack };
    },
    async external(message2) {
      let neededInit = null;
      if (init2 && !await client.isContractDeployed(address)) {
        neededInit = init2;
      }
      const ext = (0, ton_core_1$b.external)({
        to: address,
        init: neededInit ? { code: neededInit.code, data: neededInit.data } : null,
        body: message2
      });
      let boc = (0, ton_core_1$b.beginCell)().store((0, ton_core_1$b.storeMessage)(ext)).endCell().toBoc();
      await client.sendFile(boc);
    },
    async internal(via, message2) {
      let neededInit = null;
      if (init2 && !await client.isContractDeployed(address)) {
        neededInit = init2;
      }
      let bounce = true;
      if (message2.bounce !== null && message2.bounce !== void 0) {
        bounce = message2.bounce;
      }
      let value;
      if (typeof message2.value === "string") {
        value = (0, ton_core_1$b.toNano)(message2.value);
      } else {
        value = message2.value;
      }
      let body = null;
      if (typeof message2.body === "string") {
        body = (0, ton_core_1$b.comment)(message2.body);
      } else if (message2.body) {
        body = message2.body;
      }
      await via.send({
        to: address,
        value,
        bounce,
        sendMode: message2.sendMode,
        init: neededInit,
        body
      });
    }
  };
}
var TonClient4$1 = {};
var toUrlSafe$1 = {};
Object.defineProperty(toUrlSafe$1, "__esModule", { value: true });
toUrlSafe$1.toUrlSafe = void 0;
function toUrlSafe(src2) {
  while (src2.indexOf("/") >= 0) {
    src2 = src2.replace("/", "_");
  }
  while (src2.indexOf("+") >= 0) {
    src2 = src2.replace("+", "-");
  }
  while (src2.indexOf("=") >= 0) {
    src2 = src2.replace("=", "");
  }
  return src2;
}
toUrlSafe$1.toUrlSafe = toUrlSafe;
var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  Object.defineProperty(o, k2, { enumerable: true, get: function() {
    return m[k];
  } });
} : function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function(o, v) {
  o["default"] = v;
});
var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod)
      if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
        __createBinding(result, mod, k);
  }
  __setModuleDefault(result, mod);
  return result;
};
var __classPrivateFieldSet = commonjsGlobal && commonjsGlobal.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = commonjsGlobal && commonjsGlobal.__classPrivateFieldGet || function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
var _TonClient4_endpoint, _TonClient4_timeout, _TonClient4_adapter;
Object.defineProperty(TonClient4$1, "__esModule", { value: true });
TonClient4$1.TonClient4 = void 0;
const axios_1 = __importDefault(axiosExports$1);
const t = __importStar(require$$1$1);
const ton_core_1$a = dist$1;
const toUrlSafe_1 = toUrlSafe$1;
class TonClient4 {
  constructor(args) {
    _TonClient4_endpoint.set(this, void 0);
    _TonClient4_timeout.set(this, void 0);
    _TonClient4_adapter.set(this, void 0);
    __classPrivateFieldSet(this, _TonClient4_endpoint, args.endpoint, "f");
    __classPrivateFieldSet(this, _TonClient4_timeout, args.timeout || 5e3, "f");
    __classPrivateFieldSet(this, _TonClient4_adapter, args.httpAdapter, "f");
  }
  /**
   * Get Last Block
   * @returns last block info
   */
  async getLastBlock() {
    let res = await axios_1.default.get(__classPrivateFieldGet(this, _TonClient4_endpoint, "f") + "/block/latest", { adapter: __classPrivateFieldGet(this, _TonClient4_adapter, "f"), timeout: __classPrivateFieldGet(this, _TonClient4_timeout, "f") });
    if (!lastBlockCodec.is(res.data)) {
      throw Error("Mailformed response");
    }
    return res.data;
  }
  /**
   * Get block info
   * @param seqno block sequence number
   * @returns block info
   */
  async getBlock(seqno) {
    let res = await axios_1.default.get(__classPrivateFieldGet(this, _TonClient4_endpoint, "f") + "/block/" + seqno, { adapter: __classPrivateFieldGet(this, _TonClient4_adapter, "f"), timeout: __classPrivateFieldGet(this, _TonClient4_timeout, "f") });
    if (!blockCodec.is(res.data)) {
      throw Error("Mailformed response");
    }
    if (!res.data.exist) {
      throw Error("Block is out of scope");
    }
    return res.data.block;
  }
  /**
   * Get block info by unix timestamp
   * @param ts unix timestamp
   * @returns block info
   */
  async getBlockByUtime(ts) {
    let res = await axios_1.default.get(__classPrivateFieldGet(this, _TonClient4_endpoint, "f") + "/block/utime/" + ts, { adapter: __classPrivateFieldGet(this, _TonClient4_adapter, "f"), timeout: __classPrivateFieldGet(this, _TonClient4_timeout, "f") });
    if (!blockCodec.is(res.data)) {
      throw Error("Mailformed response");
    }
    if (!res.data.exist) {
      throw Error("Block is out of scope");
    }
    return res.data.block;
  }
  /**
   * Get block info by unix timestamp
   * @param seqno block sequence number
   * @param address account address
   * @returns account info
   */
  async getAccount(seqno, address) {
    let res = await axios_1.default.get(__classPrivateFieldGet(this, _TonClient4_endpoint, "f") + "/block/" + seqno + "/" + address.toString({ urlSafe: true }), { adapter: __classPrivateFieldGet(this, _TonClient4_adapter, "f"), timeout: __classPrivateFieldGet(this, _TonClient4_timeout, "f") });
    if (!accountCodec.is(res.data)) {
      throw Error("Mailformed response");
    }
    return res.data;
  }
  /**
   * Get account lite info (without code and data)
   * @param seqno block sequence number
   * @param address account address
   * @returns account lite info
   */
  async getAccountLite(seqno, address) {
    let res = await axios_1.default.get(__classPrivateFieldGet(this, _TonClient4_endpoint, "f") + "/block/" + seqno + "/" + address.toString({ urlSafe: true }) + "/lite", { adapter: __classPrivateFieldGet(this, _TonClient4_adapter, "f"), timeout: __classPrivateFieldGet(this, _TonClient4_timeout, "f") });
    if (!accountLiteCodec.is(res.data)) {
      throw Error("Mailformed response");
    }
    return res.data;
  }
  /**
   * Check if account was updated since
   * @param seqno block sequence number
   * @param address account address
   * @param lt account last transaction lt
   * @returns account change info
   */
  async isAccountChanged(seqno, address, lt) {
    let res = await axios_1.default.get(__classPrivateFieldGet(this, _TonClient4_endpoint, "f") + "/block/" + seqno + "/" + address.toString({ urlSafe: true }) + "/changed/" + lt.toString(10), { adapter: __classPrivateFieldGet(this, _TonClient4_adapter, "f"), timeout: __classPrivateFieldGet(this, _TonClient4_timeout, "f") });
    if (!changedCodec.is(res.data)) {
      throw Error("Mailformed response");
    }
    return res.data;
  }
  /**
   * Load one unparsed account transaction
   * @param seqno block sequence number
   * @param address account address
   * @param lt account last transaction lt
   * @returns one unparsed transaction
   */
  async getTransaction(seqno, address, lt) {
    const urladdr = address.toString({ urlSafe: true });
    const urlpath = `/block/${seqno}/${urladdr}/tx/${lt.toString(10)}`;
    const res = await axios_1.default.get(new URL(urlpath, __classPrivateFieldGet(this, _TonClient4_endpoint, "f")).href, { adapter: __classPrivateFieldGet(this, _TonClient4_adapter, "f"), timeout: __classPrivateFieldGet(this, _TonClient4_timeout, "f") });
    if (!transactionCodec.is(res.data))
      throw Error("Mailformed response");
    const txcell = ton_core_1$a.Cell.fromBoc(Buffer.from(res.data.boc, "base64"))[0];
    return { tx: (0, ton_core_1$a.loadTransaction)(txcell.beginParse()), ...res.data };
  }
  /**
   * Load unparsed account transactions
   * @param address address
   * @param lt last transaction lt
   * @param hash last transaction hash
   * @returns unparsed transactions
   */
  async getAccountTransactions(address, lt, hash) {
    let res = await axios_1.default.get(__classPrivateFieldGet(this, _TonClient4_endpoint, "f") + "/account/" + address.toString({ urlSafe: true }) + "/tx/" + lt.toString(10) + "/" + (0, toUrlSafe_1.toUrlSafe)(hash.toString("base64")), { adapter: __classPrivateFieldGet(this, _TonClient4_adapter, "f"), timeout: __classPrivateFieldGet(this, _TonClient4_timeout, "f") });
    if (!transactionsCodec.is(res.data)) {
      throw Error("Mailformed response");
    }
    let data2 = res.data;
    let tx = [];
    let cells = ton_core_1$a.Cell.fromBoc(Buffer.from(data2.boc, "base64"));
    for (let i = 0; i < data2.blocks.length; i++) {
      tx.push({
        block: data2.blocks[i],
        tx: (0, ton_core_1$a.loadTransaction)(cells[i].beginParse())
      });
    }
    return tx;
  }
  /**
   * Get network config
   * @param seqno block sequence number
   * @param ids optional config ids
   * @returns network config
   */
  async getConfig(seqno, ids) {
    let tail2 = "";
    if (ids && ids.length > 0) {
      tail2 = "/" + [...ids].sort().join(",");
    }
    let res = await axios_1.default.get(__classPrivateFieldGet(this, _TonClient4_endpoint, "f") + "/block/" + seqno + "/config" + tail2, { adapter: __classPrivateFieldGet(this, _TonClient4_adapter, "f"), timeout: __classPrivateFieldGet(this, _TonClient4_timeout, "f") });
    if (!configCodec.is(res.data)) {
      throw Error("Mailformed response");
    }
    return res.data;
  }
  /**
   * Execute run method
   * @param seqno block sequence number
   * @param address account address
   * @param name method name
   * @param args method arguments
   * @returns method result
   */
  async runMethod(seqno, address, name2, args) {
    let tail2 = args && args.length > 0 ? "/" + (0, toUrlSafe_1.toUrlSafe)((0, ton_core_1$a.serializeTuple)(args).toBoc({ idx: false, crc32: false }).toString("base64")) : "";
    let url = __classPrivateFieldGet(this, _TonClient4_endpoint, "f") + "/block/" + seqno + "/" + address.toString({ urlSafe: true }) + "/run/" + name2 + tail2;
    let res = await axios_1.default.get(url, { adapter: __classPrivateFieldGet(this, _TonClient4_adapter, "f"), timeout: __classPrivateFieldGet(this, _TonClient4_timeout, "f") });
    if (!runMethodCodec.is(res.data)) {
      throw Error("Mailformed response");
    }
    return {
      exitCode: res.data.exitCode,
      result: res.data.resultRaw ? (0, ton_core_1$a.parseTuple)(ton_core_1$a.Cell.fromBoc(Buffer.from(res.data.resultRaw, "base64"))[0]) : [],
      resultRaw: res.data.resultRaw,
      block: res.data.block,
      shardBlock: res.data.shardBlock
    };
  }
  /**
   * Send external message
   * @param message message boc
   * @returns message status
   */
  async sendMessage(message2) {
    let res = await axios_1.default.post(__classPrivateFieldGet(this, _TonClient4_endpoint, "f") + "/send", { boc: message2.toString("base64") }, { adapter: __classPrivateFieldGet(this, _TonClient4_adapter, "f"), timeout: __classPrivateFieldGet(this, _TonClient4_timeout, "f") });
    if (!sendCodec.is(res.data)) {
      throw Error("Mailformed response");
    }
    return { status: res.data.status };
  }
  /**
   * Open smart contract
   * @param contract contract
   * @returns opened contract
   */
  open(contract) {
    return (0, ton_core_1$a.openContract)(contract, (args) => createProvider(this, null, args.address, args.init));
  }
  /**
   * Open smart contract
   * @param block block number
   * @param contract contract
   * @returns opened contract
   */
  openAt(block, contract) {
    return (0, ton_core_1$a.openContract)(contract, (args) => createProvider(this, block, args.address, args.init));
  }
  /**
   * Create provider
   * @param address address
   * @param init optional init data
   * @returns provider
   */
  provider(address, init2) {
    return createProvider(this, null, address, init2 ? init2 : null);
  }
  /**
   * Create provider at specified block number
   * @param block block number
   * @param address address
   * @param init optional init data
   * @returns provider
   */
  providerAt(block, address, init2) {
    return createProvider(this, block, address, init2 ? init2 : null);
  }
}
TonClient4$1.TonClient4 = TonClient4;
_TonClient4_endpoint = /* @__PURE__ */ new WeakMap(), _TonClient4_timeout = /* @__PURE__ */ new WeakMap(), _TonClient4_adapter = /* @__PURE__ */ new WeakMap();
function createProvider(client, block, address, init2) {
  return {
    async getState() {
      let sq = block;
      if (sq === null) {
        let res = await client.getLastBlock();
        sq = res.last.seqno;
      }
      let state = await client.getAccount(sq, address);
      let last2 = state.account.last ? { lt: BigInt(state.account.last.lt), hash: Buffer.from(state.account.last.hash, "base64") } : null;
      let storage;
      if (state.account.state.type === "active") {
        storage = {
          type: "active",
          code: state.account.state.code ? Buffer.from(state.account.state.code, "base64") : null,
          data: state.account.state.data ? Buffer.from(state.account.state.data, "base64") : null
        };
      } else if (state.account.state.type === "uninit") {
        storage = {
          type: "uninit"
        };
      } else if (state.account.state.type === "frozen") {
        storage = {
          type: "frozen",
          stateHash: Buffer.from(state.account.state.stateHash, "base64")
        };
      } else {
        throw Error("Unsupported state");
      }
      return {
        balance: BigInt(state.account.balance.coins),
        last: last2,
        state: storage
      };
    },
    async get(name2, args) {
      let sq = block;
      if (sq === null) {
        let res = await client.getLastBlock();
        sq = res.last.seqno;
      }
      let method = await client.runMethod(sq, address, name2, args);
      if (method.exitCode !== 0 && method.exitCode !== 1) {
        throw Error("Exit code: " + method.exitCode);
      }
      return {
        stack: new ton_core_1$a.TupleReader(method.result)
      };
    },
    async external(message2) {
      let last2 = await client.getLastBlock();
      let neededInit = null;
      if (init2 && (await client.getAccountLite(last2.last.seqno, address)).account.state.type !== "active") {
        neededInit = init2;
      }
      const ext = (0, ton_core_1$a.external)({
        to: address,
        init: neededInit ? { code: neededInit.code, data: neededInit.data } : null,
        body: message2
      });
      let pkg = (0, ton_core_1$a.beginCell)().store((0, ton_core_1$a.storeMessage)(ext)).endCell().toBoc();
      await client.sendMessage(pkg);
    },
    async internal(via, message2) {
      let last2 = await client.getLastBlock();
      let neededInit = null;
      if (init2 && (await client.getAccountLite(last2.last.seqno, address)).account.state.type !== "active") {
        neededInit = init2;
      }
      let bounce = true;
      if (message2.bounce !== null && message2.bounce !== void 0) {
        bounce = message2.bounce;
      }
      let value;
      if (typeof message2.value === "string") {
        value = (0, ton_core_1$a.toNano)(message2.value);
      } else {
        value = message2.value;
      }
      let body = null;
      if (typeof message2.body === "string") {
        body = (0, ton_core_1$a.comment)(message2.body);
      } else if (message2.body) {
        body = message2.body;
      }
      await via.send({
        to: address,
        value,
        bounce,
        sendMode: message2.sendMode,
        init: neededInit,
        body
      });
    }
  };
}
const lastBlockCodec = t.type({
  last: t.type({
    seqno: t.number,
    shard: t.string,
    workchain: t.number,
    fileHash: t.string,
    rootHash: t.string
  }),
  init: t.type({
    fileHash: t.string,
    rootHash: t.string
  }),
  stateRootHash: t.string,
  now: t.number
});
const blockCodec = t.union([t.type({
  exist: t.literal(false)
}), t.type({
  exist: t.literal(true),
  block: t.type({
    shards: t.array(t.type({
      workchain: t.number,
      seqno: t.number,
      shard: t.string,
      rootHash: t.string,
      fileHash: t.string,
      transactions: t.array(t.type({
        account: t.string,
        hash: t.string,
        lt: t.string
      }))
    }))
  })
})]);
const storageStatCodec = t.type({
  lastPaid: t.number,
  duePayment: t.union([t.null, t.string]),
  used: t.type({
    bits: t.number,
    cells: t.number,
    publicCells: t.number
  })
});
const accountCodec = t.type({
  account: t.type({
    state: t.union([
      t.type({ type: t.literal("uninit") }),
      t.type({ type: t.literal("active"), code: t.union([t.string, t.null]), data: t.union([t.string, t.null]) }),
      t.type({ type: t.literal("frozen"), stateHash: t.string })
    ]),
    balance: t.type({
      coins: t.string
    }),
    last: t.union([
      t.null,
      t.type({
        lt: t.string,
        hash: t.string
      })
    ]),
    storageStat: t.union([t.null, storageStatCodec])
  }),
  block: t.type({
    workchain: t.number,
    seqno: t.number,
    shard: t.string,
    rootHash: t.string,
    fileHash: t.string
  })
});
const accountLiteCodec = t.type({
  account: t.type({
    state: t.union([
      t.type({ type: t.literal("uninit") }),
      t.type({ type: t.literal("active"), codeHash: t.string, dataHash: t.string }),
      t.type({ type: t.literal("frozen"), stateHash: t.string })
    ]),
    balance: t.type({
      coins: t.string
    }),
    last: t.union([
      t.null,
      t.type({
        lt: t.string,
        hash: t.string
      })
    ]),
    storageStat: t.union([t.null, storageStatCodec])
  })
});
const changedCodec = t.type({
  changed: t.boolean,
  block: t.type({
    workchain: t.number,
    seqno: t.number,
    shard: t.string,
    rootHash: t.string,
    fileHash: t.string
  })
});
const runMethodCodec = t.type({
  exitCode: t.number,
  resultRaw: t.union([t.string, t.null]),
  block: t.type({
    workchain: t.number,
    seqno: t.number,
    shard: t.string,
    rootHash: t.string,
    fileHash: t.string
  }),
  shardBlock: t.type({
    workchain: t.number,
    seqno: t.number,
    shard: t.string,
    rootHash: t.string,
    fileHash: t.string
  })
});
const configCodec = t.type({
  config: t.type({
    cell: t.string,
    address: t.string,
    globalBalance: t.type({
      coins: t.string
    })
  })
});
const sendCodec = t.type({
  status: t.number
});
const transactionsCodec = t.type({
  blocks: t.array(t.type({
    workchain: t.number,
    seqno: t.number,
    shard: t.string,
    rootHash: t.string,
    fileHash: t.string
  })),
  boc: t.string
});
const transactionCodec = t.type({
  block: t.type({
    workchain: t.number,
    seqno: t.number,
    shard: t.string,
    rootHash: t.string
  }),
  boc: t.string,
  proof: t.string
});
var WalletContractV1R1$1 = {};
var createWalletTransfer = {};
Object.defineProperty(createWalletTransfer, "__esModule", { value: true });
createWalletTransfer.createWalletTransferV4 = createWalletTransfer.createWalletTransferV3 = createWalletTransfer.createWalletTransferV2 = createWalletTransfer.createWalletTransferV1 = void 0;
const ton_core_1$9 = dist$1;
const ton_crypto_1 = requireDist();
function createWalletTransferV1(args) {
  let signingMessage = (0, ton_core_1$9.beginCell)().storeUint(args.seqno, 32);
  if (args.message) {
    signingMessage.storeUint(args.sendMode, 8);
    signingMessage.storeRef((0, ton_core_1$9.beginCell)().store((0, ton_core_1$9.storeMessageRelaxed)(args.message)));
  }
  let signature = (0, ton_crypto_1.sign)(signingMessage.endCell().hash(), args.secretKey);
  const body = (0, ton_core_1$9.beginCell)().storeBuffer(signature).storeBuilder(signingMessage).endCell();
  return body;
}
createWalletTransfer.createWalletTransferV1 = createWalletTransferV1;
function createWalletTransferV2(args) {
  if (args.messages.length > 4) {
    throw new Error("Maximum number of messages in a single transfer is 4");
  }
  let signingMessage = (0, ton_core_1$9.beginCell)().storeUint(args.seqno, 32);
  if (args.seqno === 0) {
    for (let i = 0; i < 32; i++) {
      signingMessage.storeBit(1);
    }
  } else {
    signingMessage.storeUint(args.timeout || Math.floor(Date.now() / 1e3) + 60, 32);
  }
  for (let m of args.messages) {
    signingMessage.storeUint(args.sendMode, 8);
    signingMessage.storeRef((0, ton_core_1$9.beginCell)().store((0, ton_core_1$9.storeMessageRelaxed)(m)));
  }
  let signature = (0, ton_crypto_1.sign)(signingMessage.endCell().hash(), args.secretKey);
  const body = (0, ton_core_1$9.beginCell)().storeBuffer(signature).storeBuilder(signingMessage).endCell();
  return body;
}
createWalletTransfer.createWalletTransferV2 = createWalletTransferV2;
function createWalletTransferV3(args) {
  if (args.messages.length > 4) {
    throw new Error("Maximum number of messages in a single transfer is 4");
  }
  let signingMessage = (0, ton_core_1$9.beginCell)().storeUint(args.walletId, 32);
  if (args.seqno === 0) {
    for (let i = 0; i < 32; i++) {
      signingMessage.storeBit(1);
    }
  } else {
    signingMessage.storeUint(args.timeout || Math.floor(Date.now() / 1e3) + 60, 32);
  }
  signingMessage.storeUint(args.seqno, 32);
  for (let m of args.messages) {
    signingMessage.storeUint(args.sendMode, 8);
    signingMessage.storeRef((0, ton_core_1$9.beginCell)().store((0, ton_core_1$9.storeMessageRelaxed)(m)));
  }
  let signature = (0, ton_crypto_1.sign)(signingMessage.endCell().hash(), args.secretKey);
  const body = (0, ton_core_1$9.beginCell)().storeBuffer(signature).storeBuilder(signingMessage).endCell();
  return body;
}
createWalletTransfer.createWalletTransferV3 = createWalletTransferV3;
function createWalletTransferV4(args) {
  if (args.messages.length > 4) {
    throw new Error("Maximum number of messages in a single transfer is 4");
  }
  let signingMessage = (0, ton_core_1$9.beginCell)().storeUint(args.walletId, 32);
  if (args.seqno === 0) {
    for (let i = 0; i < 32; i++) {
      signingMessage.storeBit(1);
    }
  } else {
    signingMessage.storeUint(args.timeout || Math.floor(Date.now() / 1e3) + 60, 32);
  }
  signingMessage.storeUint(args.seqno, 32);
  signingMessage.storeUint(0, 8);
  for (let m of args.messages) {
    signingMessage.storeUint(args.sendMode, 8);
    signingMessage.storeRef((0, ton_core_1$9.beginCell)().store((0, ton_core_1$9.storeMessageRelaxed)(m)));
  }
  let signature = (0, ton_crypto_1.sign)(signingMessage.endCell().hash(), args.secretKey);
  const body = (0, ton_core_1$9.beginCell)().storeBuffer(signature).storeBuilder(signingMessage).endCell();
  return body;
}
createWalletTransfer.createWalletTransferV4 = createWalletTransferV4;
Object.defineProperty(WalletContractV1R1$1, "__esModule", { value: true });
WalletContractV1R1$1.WalletContractV1R1 = void 0;
const ton_core_1$8 = dist$1;
const createWalletTransfer_1$7 = createWalletTransfer;
class WalletContractV1R1 {
  constructor(workchain, publicKey) {
    this.workchain = workchain;
    this.publicKey = publicKey;
    let code = ton_core_1$8.Cell.fromBoc(Buffer.from("te6cckEBAQEARAAAhP8AIN2k8mCBAgDXGCDXCx/tRNDTH9P/0VESuvKhIvkBVBBE+RDyovgAAdMfMSDXSpbTB9QC+wDe0aTIyx/L/8ntVEH98Ik=", "base64"))[0];
    let data2 = (0, ton_core_1$8.beginCell)().storeUint(0, 32).storeBuffer(publicKey).endCell();
    this.init = { code, data: data2 };
    this.address = (0, ton_core_1$8.contractAddress)(workchain, { code, data: data2 });
  }
  static create(args) {
    return new WalletContractV1R1(args.workchain, args.publicKey);
  }
  /**
   * Get Wallet Balance
   */
  async getBalance(provider) {
    let state = await provider.getState();
    return state.balance;
  }
  /**
   * Get Wallet Seqno
   */
  async getSeqno(provider) {
    let state = await provider.getState();
    if (state.state.type === "active") {
      return ton_core_1$8.Cell.fromBoc(state.state.data)[0].beginParse().loadUint(32);
    } else {
      return 0;
    }
  }
  /**
   * Send signed transfer
   */
  async send(provider, message2) {
    await provider.external(message2);
  }
  /**
   * Sign and send transfer
   */
  async sendTransfer(provider, args) {
    let transfer = this.createTransfer(args);
    await this.send(provider, transfer);
  }
  /**
   * Create signed transfer
   */
  createTransfer(args) {
    let sendMode = ton_core_1$8.SendMode.PAY_GAS_SEPARATLY;
    if (args.sendMode !== null && args.sendMode !== void 0) {
      sendMode = args.sendMode;
    }
    return (0, createWalletTransfer_1$7.createWalletTransferV1)({
      seqno: args.seqno,
      sendMode,
      secretKey: args.secretKey,
      message: args.message
    });
  }
  /**
   * Create sender
   */
  sender(provider, secretKey) {
    return {
      send: async (args) => {
        let seqno = await this.getSeqno(provider);
        let transfer = this.createTransfer({
          seqno,
          secretKey,
          sendMode: args.sendMode,
          message: (0, ton_core_1$8.internal)({
            to: args.to,
            value: args.value,
            init: args.init,
            body: args.body,
            bounce: args.bounce
          })
        });
        await this.send(provider, transfer);
      }
    };
  }
}
WalletContractV1R1$1.WalletContractV1R1 = WalletContractV1R1;
var WalletContractV1R2$1 = {};
Object.defineProperty(WalletContractV1R2$1, "__esModule", { value: true });
WalletContractV1R2$1.WalletContractV1R2 = void 0;
const ton_core_1$7 = dist$1;
const createWalletTransfer_1$6 = createWalletTransfer;
class WalletContractV1R2 {
  constructor(workchain, publicKey) {
    this.workchain = workchain;
    this.publicKey = publicKey;
    let code = ton_core_1$7.Cell.fromBoc(Buffer.from("te6cckEBAQEAUwAAov8AIN0gggFMl7qXMO1E0NcLH+Ck8mCBAgDXGCDXCx/tRNDTH9P/0VESuvKhIvkBVBBE+RDyovgAAdMfMSDXSpbTB9QC+wDe0aTIyx/L/8ntVNDieG8=", "base64"))[0];
    let data2 = (0, ton_core_1$7.beginCell)().storeUint(0, 32).storeBuffer(publicKey).endCell();
    this.init = { code, data: data2 };
    this.address = (0, ton_core_1$7.contractAddress)(workchain, { code, data: data2 });
  }
  static create(args) {
    return new WalletContractV1R2(args.workchain, args.publicKey);
  }
  /**
   * Get Wallet Balance
   */
  async getBalance(provider) {
    let state = await provider.getState();
    return state.balance;
  }
  /**
   * Get Wallet Seqno
   */
  async getSeqno(provider) {
    let state = await provider.getState();
    if (state.state.type === "active") {
      let res = await provider.get("seqno", []);
      return res.stack.readNumber();
    } else {
      return 0;
    }
  }
  /**
   * Send signed transfer
   */
  async send(provider, message2) {
    await provider.external(message2);
  }
  /**
   * Sign and send transfer
   */
  async sendTransfer(provider, args) {
    let transfer = this.createTransfer(args);
    await this.send(provider, transfer);
  }
  /**
   * Create signed transfer
   */
  createTransfer(args) {
    let sendMode = ton_core_1$7.SendMode.PAY_GAS_SEPARATLY;
    if (args.sendMode !== null && args.sendMode !== void 0) {
      sendMode = args.sendMode;
    }
    return (0, createWalletTransfer_1$6.createWalletTransferV1)({
      seqno: args.seqno,
      sendMode,
      secretKey: args.secretKey,
      message: args.message
    });
  }
  /**
   * Create sender
   */
  sender(provider, secretKey) {
    return {
      send: async (args) => {
        let seqno = await this.getSeqno(provider);
        let transfer = this.createTransfer({
          seqno,
          secretKey,
          sendMode: args.sendMode,
          message: (0, ton_core_1$7.internal)({
            to: args.to,
            value: args.value,
            init: args.init,
            body: args.body,
            bounce: args.bounce
          })
        });
        await this.send(provider, transfer);
      }
    };
  }
}
WalletContractV1R2$1.WalletContractV1R2 = WalletContractV1R2;
var WalletContractV1R3$1 = {};
Object.defineProperty(WalletContractV1R3$1, "__esModule", { value: true });
WalletContractV1R3$1.WalletContractV1R3 = void 0;
const ton_core_1$6 = dist$1;
const createWalletTransfer_1$5 = createWalletTransfer;
class WalletContractV1R3 {
  constructor(workchain, publicKey) {
    this.workchain = workchain;
    this.publicKey = publicKey;
    let code = ton_core_1$6.Cell.fromBoc(Buffer.from("te6cckEBAQEAXwAAuv8AIN0gggFMl7ohggEznLqxnHGw7UTQ0x/XC//jBOCk8mCBAgDXGCDXCx/tRNDTH9P/0VESuvKhIvkBVBBE+RDyovgAAdMfMSDXSpbTB9QC+wDe0aTIyx/L/8ntVLW4bkI=", "base64"))[0];
    let data2 = (0, ton_core_1$6.beginCell)().storeUint(0, 32).storeBuffer(publicKey).endCell();
    this.init = { code, data: data2 };
    this.address = (0, ton_core_1$6.contractAddress)(workchain, { code, data: data2 });
  }
  static create(args) {
    return new WalletContractV1R3(args.workchain, args.publicKey);
  }
  /**
   * Get Wallet Balance
   */
  async getBalance(provider) {
    let state = await provider.getState();
    return state.balance;
  }
  /**
   * Get Wallet Seqno
   */
  async getSeqno(provider) {
    let state = await provider.getState();
    if (state.state.type === "active") {
      let res = await provider.get("seqno", []);
      return res.stack.readNumber();
    } else {
      return 0;
    }
  }
  /**
   * Send signed transfer
   */
  async send(executor, message2) {
    await executor.external(message2);
  }
  /**
   * Sign and send transfer
   */
  async sendTransfer(provider, args) {
    let transfer = this.createTransfer(args);
    await this.send(provider, transfer);
  }
  /**
   * Create signed transfer
   */
  createTransfer(args) {
    let sendMode = ton_core_1$6.SendMode.PAY_GAS_SEPARATLY;
    if (args.sendMode !== null && args.sendMode !== void 0) {
      sendMode = args.sendMode;
    }
    return (0, createWalletTransfer_1$5.createWalletTransferV1)({
      seqno: args.seqno,
      sendMode,
      secretKey: args.secretKey,
      message: args.message
    });
  }
  /**
   * Create sender
   */
  sender(provider, secretKey) {
    return {
      send: async (args) => {
        let seqno = await this.getSeqno(provider);
        let transfer = this.createTransfer({
          seqno,
          secretKey,
          sendMode: args.sendMode,
          message: (0, ton_core_1$6.internal)({
            to: args.to,
            value: args.value,
            init: args.init,
            body: args.body,
            bounce: args.bounce
          })
        });
        await this.send(provider, transfer);
      }
    };
  }
}
WalletContractV1R3$1.WalletContractV1R3 = WalletContractV1R3;
var WalletContractV2R1$1 = {};
Object.defineProperty(WalletContractV2R1$1, "__esModule", { value: true });
WalletContractV2R1$1.WalletContractV2R1 = void 0;
const ton_core_1$5 = dist$1;
const createWalletTransfer_1$4 = createWalletTransfer;
class WalletContractV2R1 {
  constructor(workchain, publicKey) {
    this.workchain = workchain;
    this.publicKey = publicKey;
    let code = ton_core_1$5.Cell.fromBoc(Buffer.from("te6cckEBAQEAVwAAqv8AIN0gggFMl7qXMO1E0NcLH+Ck8mCDCNcYINMf0x8B+CO78mPtRNDTH9P/0VExuvKhA/kBVBBC+RDyovgAApMg10qW0wfUAvsA6NGkyMsfy//J7VShNwu2", "base64"))[0];
    let data2 = (0, ton_core_1$5.beginCell)().storeUint(0, 32).storeBuffer(publicKey).endCell();
    this.init = { code, data: data2 };
    this.address = (0, ton_core_1$5.contractAddress)(workchain, { code, data: data2 });
  }
  static create(args) {
    return new WalletContractV2R1(args.workchain, args.publicKey);
  }
  /**
   * Get Wallet Balance
   */
  async getBalance(provider) {
    let state = await provider.getState();
    return state.balance;
  }
  /**
   * Get Wallet Seqno
   */
  async getSeqno(provider) {
    let state = await provider.getState();
    if (state.state.type === "active") {
      let res = await provider.get("seqno", []);
      return res.stack.readNumber();
    } else {
      return 0;
    }
  }
  /**
   * Send signed transfer
   */
  async send(provider, message2) {
    await provider.external(message2);
  }
  /**
   * Sign and send transfer
   */
  async sendTransfer(provider, args) {
    let transfer = this.createTransfer(args);
    await this.send(provider, transfer);
  }
  /**
   * Create signed transfer
   */
  createTransfer(args) {
    let sendMode = ton_core_1$5.SendMode.PAY_GAS_SEPARATLY;
    if (args.sendMode !== null && args.sendMode !== void 0) {
      sendMode = args.sendMode;
    }
    return (0, createWalletTransfer_1$4.createWalletTransferV2)({
      seqno: args.seqno,
      sendMode,
      secretKey: args.secretKey,
      messages: args.messages,
      timeout: args.timeout
    });
  }
  /**
   * Create sender
   */
  sender(provider, secretKey) {
    return {
      send: async (args) => {
        let seqno = await this.getSeqno(provider);
        let transfer = this.createTransfer({
          seqno,
          secretKey,
          sendMode: args.sendMode,
          messages: [(0, ton_core_1$5.internal)({
            to: args.to,
            value: args.value,
            init: args.init,
            body: args.body,
            bounce: args.bounce
          })]
        });
        await this.send(provider, transfer);
      }
    };
  }
}
WalletContractV2R1$1.WalletContractV2R1 = WalletContractV2R1;
var WalletContractV2R2$1 = {};
Object.defineProperty(WalletContractV2R2$1, "__esModule", { value: true });
WalletContractV2R2$1.WalletContractV2R2 = void 0;
const ton_core_1$4 = dist$1;
const createWalletTransfer_1$3 = createWalletTransfer;
class WalletContractV2R2 {
  constructor(workchain, publicKey) {
    this.workchain = workchain;
    this.publicKey = publicKey;
    let code = ton_core_1$4.Cell.fromBoc(Buffer.from("te6cckEBAQEAYwAAwv8AIN0gggFMl7ohggEznLqxnHGw7UTQ0x/XC//jBOCk8mCDCNcYINMf0x8B+CO78mPtRNDTH9P/0VExuvKhA/kBVBBC+RDyovgAApMg10qW0wfUAvsA6NGkyMsfy//J7VQETNeh", "base64"))[0];
    let data2 = (0, ton_core_1$4.beginCell)().storeUint(0, 32).storeBuffer(publicKey).endCell();
    this.init = { code, data: data2 };
    this.address = (0, ton_core_1$4.contractAddress)(workchain, { code, data: data2 });
  }
  static create(args) {
    return new WalletContractV2R2(args.workchain, args.publicKey);
  }
  /**
   * Get Wallet Balance
   */
  async getBalance(provider) {
    let state = await provider.getState();
    return state.balance;
  }
  /**
   * Get Wallet Seqno
   */
  async getSeqno(provider) {
    let state = await provider.getState();
    if (state.state.type === "active") {
      let res = await provider.get("seqno", []);
      return res.stack.readNumber();
    } else {
      return 0;
    }
  }
  /**
   * Send signed transfer
   */
  async send(provider, message2) {
    await provider.external(message2);
  }
  /**
   * Sign and send transfer
   */
  async sendTransfer(provider, args) {
    let transfer = this.createTransfer(args);
    await this.send(provider, transfer);
  }
  /**
   * Create signed transfer
   */
  createTransfer(args) {
    let sendMode = ton_core_1$4.SendMode.PAY_GAS_SEPARATLY;
    if (args.sendMode !== null && args.sendMode !== void 0) {
      sendMode = args.sendMode;
    }
    return (0, createWalletTransfer_1$3.createWalletTransferV2)({
      seqno: args.seqno,
      sendMode,
      secretKey: args.secretKey,
      messages: args.messages,
      timeout: args.timeout
    });
  }
  /**
   * Create sender
   */
  sender(provider, secretKey) {
    return {
      send: async (args) => {
        let seqno = await this.getSeqno(provider);
        let transfer = this.createTransfer({
          seqno,
          secretKey,
          sendMode: args.sendMode,
          messages: [(0, ton_core_1$4.internal)({
            to: args.to,
            value: args.value,
            init: args.init,
            body: args.body,
            bounce: args.bounce
          })]
        });
        await this.send(provider, transfer);
      }
    };
  }
}
WalletContractV2R2$1.WalletContractV2R2 = WalletContractV2R2;
var WalletContractV3R1$1 = {};
Object.defineProperty(WalletContractV3R1$1, "__esModule", { value: true });
WalletContractV3R1$1.WalletContractV3R1 = void 0;
const ton_core_1$3 = dist$1;
const createWalletTransfer_1$2 = createWalletTransfer;
class WalletContractV3R1 {
  constructor(workchain, publicKey, walletId) {
    this.workchain = workchain;
    this.publicKey = publicKey;
    if (walletId !== null && walletId !== void 0) {
      this.walletId = walletId;
    } else {
      this.walletId = 698983191 + workchain;
    }
    let code = ton_core_1$3.Cell.fromBoc(Buffer.from("te6cckEBAQEAYgAAwP8AIN0gggFMl7qXMO1E0NcLH+Ck8mCDCNcYINMf0x/TH/gjE7vyY+1E0NMf0x/T/9FRMrryoVFEuvKiBPkBVBBV+RDyo/gAkyDXSpbTB9QC+wDo0QGkyMsfyx/L/8ntVD++buA=", "base64"))[0];
    let data2 = (0, ton_core_1$3.beginCell)().storeUint(0, 32).storeUint(this.walletId, 32).storeBuffer(publicKey).endCell();
    this.init = { code, data: data2 };
    this.address = (0, ton_core_1$3.contractAddress)(workchain, { code, data: data2 });
  }
  static create(args) {
    return new WalletContractV3R1(args.workchain, args.publicKey, args.walletId);
  }
  /**
   * Get wallet balance
   */
  async getBalance(provider) {
    let state = await provider.getState();
    return state.balance;
  }
  /**
   * Get Wallet Seqno
   */
  async getSeqno(provider) {
    let state = await provider.getState();
    if (state.state.type === "active") {
      let res = await provider.get("seqno", []);
      return res.stack.readNumber();
    } else {
      return 0;
    }
  }
  /**
   * Send signed transfer
   */
  async send(provider, message2) {
    await provider.external(message2);
  }
  /**
   * Sign and send transfer
   */
  async sendTransfer(provider, args) {
    let transfer = this.createTransfer(args);
    await this.send(provider, transfer);
  }
  /**
   * Create transfer
   */
  createTransfer(args) {
    let sendMode = ton_core_1$3.SendMode.PAY_GAS_SEPARATLY;
    if (args.sendMode !== null && args.sendMode !== void 0) {
      sendMode = args.sendMode;
    }
    return (0, createWalletTransfer_1$2.createWalletTransferV3)({
      seqno: args.seqno,
      sendMode,
      secretKey: args.secretKey,
      messages: args.messages,
      timeout: args.timeout,
      walletId: this.walletId
    });
  }
  /**
   * Create sender
   */
  sender(provider, secretKey) {
    return {
      send: async (args) => {
        let seqno = await this.getSeqno(provider);
        let transfer = this.createTransfer({
          seqno,
          secretKey,
          sendMode: args.sendMode,
          messages: [(0, ton_core_1$3.internal)({
            to: args.to,
            value: args.value,
            init: args.init,
            body: args.body,
            bounce: args.bounce
          })]
        });
        await this.send(provider, transfer);
      }
    };
  }
}
WalletContractV3R1$1.WalletContractV3R1 = WalletContractV3R1;
var WalletContractV3R2$1 = {};
Object.defineProperty(WalletContractV3R2$1, "__esModule", { value: true });
WalletContractV3R2$1.WalletContractV3R2 = void 0;
const ton_core_1$2 = dist$1;
const createWalletTransfer_1$1 = createWalletTransfer;
class WalletContractV3R2 {
  constructor(workchain, publicKey, walletId) {
    this.workchain = workchain;
    this.publicKey = publicKey;
    if (walletId !== null && walletId !== void 0) {
      this.walletId = walletId;
    } else {
      this.walletId = 698983191 + workchain;
    }
    let code = ton_core_1$2.Cell.fromBoc(Buffer.from("te6cckEBAQEAcQAA3v8AIN0gggFMl7ohggEznLqxn3Gw7UTQ0x/THzHXC//jBOCk8mCDCNcYINMf0x/TH/gjE7vyY+1E0NMf0x/T/9FRMrryoVFEuvKiBPkBVBBV+RDyo/gAkyDXSpbTB9QC+wDo0QGkyMsfyx/L/8ntVBC9ba0=", "base64"))[0];
    let data2 = (0, ton_core_1$2.beginCell)().storeUint(0, 32).storeUint(this.walletId, 32).storeBuffer(publicKey).endCell();
    this.init = { code, data: data2 };
    this.address = (0, ton_core_1$2.contractAddress)(workchain, { code, data: data2 });
  }
  static create(args) {
    return new WalletContractV3R2(args.workchain, args.publicKey, args.walletId);
  }
  /**
   * Get wallet balance
   */
  async getBalance(provider) {
    let state = await provider.getState();
    return state.balance;
  }
  /**
   * Get Wallet Seqno
   */
  async getSeqno(provider) {
    let state = await provider.getState();
    if (state.state.type === "active") {
      let res = await provider.get("seqno", []);
      return res.stack.readNumber();
    } else {
      return 0;
    }
  }
  /**
   * Send signed transfer
   */
  async send(provider, message2) {
    await provider.external(message2);
  }
  /**
   * Sign and send transfer
   */
  async sendTransfer(provider, args) {
    let transfer = this.createTransfer(args);
    await this.send(provider, transfer);
  }
  /**
   * Create transfer
   */
  createTransfer(args) {
    let sendMode = ton_core_1$2.SendMode.PAY_GAS_SEPARATLY;
    if (args.sendMode !== null && args.sendMode !== void 0) {
      sendMode = args.sendMode;
    }
    return (0, createWalletTransfer_1$1.createWalletTransferV3)({
      seqno: args.seqno,
      sendMode,
      secretKey: args.secretKey,
      messages: args.messages,
      timeout: args.timeout,
      walletId: this.walletId
    });
  }
  /**
   * Create sender
   */
  sender(provider, secretKey) {
    return {
      send: async (args) => {
        let seqno = await this.getSeqno(provider);
        let transfer = this.createTransfer({
          seqno,
          secretKey,
          sendMode: args.sendMode,
          messages: [(0, ton_core_1$2.internal)({
            to: args.to,
            value: args.value,
            init: args.init,
            body: args.body,
            bounce: args.bounce
          })]
        });
        await this.send(provider, transfer);
      }
    };
  }
}
WalletContractV3R2$1.WalletContractV3R2 = WalletContractV3R2;
var WalletContractV4$1 = {};
Object.defineProperty(WalletContractV4$1, "__esModule", { value: true });
WalletContractV4$1.WalletContractV4 = void 0;
const ton_core_1$1 = dist$1;
const createWalletTransfer_1 = createWalletTransfer;
class WalletContractV4 {
  constructor(workchain, publicKey, walletId) {
    this.workchain = workchain;
    this.publicKey = publicKey;
    if (walletId !== null && walletId !== void 0) {
      this.walletId = walletId;
    } else {
      this.walletId = 698983191 + workchain;
    }
    let code = ton_core_1$1.Cell.fromBoc(Buffer.from("te6ccgECFAEAAtQAART/APSkE/S88sgLAQIBIAIDAgFIBAUE+PKDCNcYINMf0x/THwL4I7vyZO1E0NMf0x/T//QE0VFDuvKhUVG68qIF+QFUEGT5EPKj+AAkpMjLH1JAyx9SMMv/UhD0AMntVPgPAdMHIcAAn2xRkyDXSpbTB9QC+wDoMOAhwAHjACHAAuMAAcADkTDjDQOkyMsfEssfy/8QERITAubQAdDTAyFxsJJfBOAi10nBIJJfBOAC0x8hghBwbHVnvSKCEGRzdHK9sJJfBeAD+kAwIPpEAcjKB8v/ydDtRNCBAUDXIfQEMFyBAQj0Cm+hMbOSXwfgBdM/yCWCEHBsdWe6kjgw4w0DghBkc3RyupJfBuMNBgcCASAICQB4AfoA9AQw+CdvIjBQCqEhvvLgUIIQcGx1Z4MesXCAGFAEywUmzxZY+gIZ9ADLaRfLH1Jgyz8gyYBA+wAGAIpQBIEBCPRZMO1E0IEBQNcgyAHPFvQAye1UAXKwjiOCEGRzdHKDHrFwgBhQBcsFUAPPFiP6AhPLassfyz/JgED7AJJfA+ICASAKCwBZvSQrb2omhAgKBrkPoCGEcNQICEekk30pkQzmkD6f+YN4EoAbeBAUiYcVnzGEAgFYDA0AEbjJftRNDXCx+AA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIA4PABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AAG7SB/oA1NQi+QAFyMoHFcv/ydB3dIAYyMsFywIizxZQBfoCFMtrEszMyXP7AMhAFIEBCPRR8qcCAHCBAQjXGPoA0z/IVCBHgQEI9FHyp4IQbm90ZXB0gBjIywXLAlAGzxZQBPoCFMtqEssfyz/Jc/sAAgBsgQEI1xj6ANM/MFIkgQEI9Fnyp4IQZHN0cnB0gBjIywXLAlAFzxZQA/oCE8tqyx8Syz/Jc/sAAAr0AMntVA==", "base64"))[0];
    let data2 = (0, ton_core_1$1.beginCell)().storeUint(0, 32).storeUint(this.walletId, 32).storeBuffer(this.publicKey).storeBit(0).endCell();
    this.init = { code, data: data2 };
    this.address = (0, ton_core_1$1.contractAddress)(workchain, { code, data: data2 });
  }
  static create(args) {
    return new WalletContractV4(args.workchain, args.publicKey, args.walletId);
  }
  /**
   * Get Wallet Balance
   */
  async getBalance(provider) {
    let state = await provider.getState();
    return state.balance;
  }
  /**
   * Get Wallet Seqno
   */
  async getSeqno(provider) {
    let state = await provider.getState();
    if (state.state.type === "active") {
      let res = await provider.get("seqno", []);
      return res.stack.readNumber();
    } else {
      return 0;
    }
  }
  /**
   * Send signed transfer
   */
  async send(provider, message2) {
    await provider.external(message2);
  }
  /**
   * Sign and send transfer
   */
  async sendTransfer(provider, args) {
    let transfer = this.createTransfer(args);
    await this.send(provider, transfer);
  }
  /**
   * Create signed transfer
   */
  createTransfer(args) {
    let sendMode = ton_core_1$1.SendMode.PAY_GAS_SEPARATLY;
    if (args.sendMode !== null && args.sendMode !== void 0) {
      sendMode = args.sendMode;
    }
    return (0, createWalletTransfer_1.createWalletTransferV4)({
      seqno: args.seqno,
      sendMode,
      secretKey: args.secretKey,
      messages: args.messages,
      timeout: args.timeout,
      walletId: this.walletId
    });
  }
  /**
   * Create sender
   */
  sender(provider, secretKey) {
    return {
      send: async (args) => {
        let seqno = await this.getSeqno(provider);
        let transfer = this.createTransfer({
          seqno,
          secretKey,
          sendMode: args.sendMode,
          messages: [(0, ton_core_1$1.internal)({
            to: args.to,
            value: args.value,
            init: args.init,
            body: args.body,
            bounce: args.bounce
          })]
        });
        await this.send(provider, transfer);
      }
    };
  }
}
WalletContractV4$1.WalletContractV4 = WalletContractV4;
var JettonMaster$1 = {};
Object.defineProperty(JettonMaster$1, "__esModule", { value: true });
JettonMaster$1.JettonMaster = void 0;
const ton_core_1 = dist$1;
class JettonMaster {
  constructor(address) {
    this.address = address;
  }
  static create(address) {
    return new JettonMaster(address);
  }
  async getWalletAddress(provider, owner) {
    let res = await provider.get("get_wallet_address", [{ type: "slice", cell: (0, ton_core_1.beginCell)().storeAddress(owner).endCell() }]);
    return res.stack.readAddress();
  }
  async getJettonData(provider) {
    let res = await provider.get("get_jetton_data", []);
    let totalSupply = res.stack.readBigNumber();
    let mintable = res.stack.readBoolean();
    let adminAddress = res.stack.readAddress();
    let content = res.stack.readCell();
    let walletCode = res.stack.readCell();
    return {
      totalSupply,
      mintable,
      adminAddress,
      content,
      walletCode
    };
  }
}
JettonMaster$1.JettonMaster = JettonMaster;
var JettonWallet$1 = {};
Object.defineProperty(JettonWallet$1, "__esModule", { value: true });
JettonWallet$1.JettonWallet = void 0;
class JettonWallet {
  constructor(address) {
    this.address = address;
  }
  static create(address) {
    return new JettonWallet(address);
  }
  async getBalance(provider) {
    let state = await provider.getState();
    if (state.state.type !== "active") {
      return 0n;
    }
    let res = await provider.get("get_wallet_data", []);
    return res.stack.readBigNumber();
  }
}
JettonWallet$1.JettonWallet = JettonWallet;
(function(exports) {
  var __createBinding2 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() {
      return m[k];
    } });
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding2(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.JettonWallet = exports.JettonMaster = exports.WalletContractV4 = exports.WalletContractV3R2 = exports.WalletContractV3R1 = exports.WalletContractV2R2 = exports.WalletContractV2R1 = exports.WalletContractV1R3 = exports.WalletContractV1R2 = exports.WalletContractV1R1 = exports.TonClient4 = exports.TonClient = exports.HttpApi = void 0;
  __exportStar(dist$1, exports);
  var HttpApi_12 = HttpApi$1;
  Object.defineProperty(exports, "HttpApi", { enumerable: true, get: function() {
    return HttpApi_12.HttpApi;
  } });
  var TonClient_1 = TonClient$1;
  Object.defineProperty(exports, "TonClient", { enumerable: true, get: function() {
    return TonClient_1.TonClient;
  } });
  var TonClient4_1 = TonClient4$1;
  Object.defineProperty(exports, "TonClient4", { enumerable: true, get: function() {
    return TonClient4_1.TonClient4;
  } });
  var WalletContractV1R1_1 = WalletContractV1R1$1;
  Object.defineProperty(exports, "WalletContractV1R1", { enumerable: true, get: function() {
    return WalletContractV1R1_1.WalletContractV1R1;
  } });
  var WalletContractV1R2_1 = WalletContractV1R2$1;
  Object.defineProperty(exports, "WalletContractV1R2", { enumerable: true, get: function() {
    return WalletContractV1R2_1.WalletContractV1R2;
  } });
  var WalletContractV1R3_1 = WalletContractV1R3$1;
  Object.defineProperty(exports, "WalletContractV1R3", { enumerable: true, get: function() {
    return WalletContractV1R3_1.WalletContractV1R3;
  } });
  var WalletContractV2R1_1 = WalletContractV2R1$1;
  Object.defineProperty(exports, "WalletContractV2R1", { enumerable: true, get: function() {
    return WalletContractV2R1_1.WalletContractV2R1;
  } });
  var WalletContractV2R2_1 = WalletContractV2R2$1;
  Object.defineProperty(exports, "WalletContractV2R2", { enumerable: true, get: function() {
    return WalletContractV2R2_1.WalletContractV2R2;
  } });
  var WalletContractV3R1_1 = WalletContractV3R1$1;
  Object.defineProperty(exports, "WalletContractV3R1", { enumerable: true, get: function() {
    return WalletContractV3R1_1.WalletContractV3R1;
  } });
  var WalletContractV3R2_1 = WalletContractV3R2$1;
  Object.defineProperty(exports, "WalletContractV3R2", { enumerable: true, get: function() {
    return WalletContractV3R2_1.WalletContractV3R2;
  } });
  var WalletContractV4_1 = WalletContractV4$1;
  Object.defineProperty(exports, "WalletContractV4", { enumerable: true, get: function() {
    return WalletContractV4_1.WalletContractV4;
  } });
  var JettonMaster_1 = JettonMaster$1;
  Object.defineProperty(exports, "JettonMaster", { enumerable: true, get: function() {
    return JettonMaster_1.JettonMaster;
  } });
  var JettonWallet_1 = JettonWallet$1;
  Object.defineProperty(exports, "JettonWallet", { enumerable: true, get: function() {
    return JettonWallet_1.JettonWallet;
  } });
})(dist$2);
class Wallet {
  constructor() {
    /**
     * True if user has wallet installed in browser, false otherwise.
     * For external wallets its always true.
     */
    __publicField(this, "available");
    /**
     * The connection status.
     * True if connected, false otherwise.
     *
     * @public
     * @type {boolean}
     */
    __publicField(this, "connected");
    /**
     * The address of the wallet.
     *
     * @public
     * @type {string}
     */
    __publicField(this, "address");
    if (this.constructor == Wallet) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }
  /**
   * Connects to the browser wallet.
   *
   * @returns {string} address
   */
  connectInjected() {
    throw new Error("Method 'connectInjected' must be implemented.");
  }
  /**
   * Returns link for connection through external wallet.
   * Use it for generating QR code or some other way to connect.
   * Callback function is called when connection is established. The address is passed as a parameter.
   *
   * @param {function} cb
   * @returns {string} link
   */
  connectExternal(cb) {
    throw new Error("Method 'connectExternal' must be implemented.");
  }
  /**
   * Sends transaction that calls the method that locks coins on the chain.
   * It starts the native-to-wrapped swap process.
   *
   * @param {string} destAddress
   * @param {string} destCoinId
   * @param {string} amount
   */
  lockCoins(destAddress, destCoinId, amount) {
    throw new Error("Method 'lockCoins' must be implemented.");
  }
  /**
   * Calls burn method in the token (or jetton) contract.
   * It starts the wrapped-to-native swap process.
   *
   * @param {string} token
   * @param {string} amount
   */
  burnTokens(token, amount) {
    throw new Error("Method 'burnTokens' must be implemented.");
  }
}
const makeWalletStore = (wallet) => {
  if (!wallet.prototype instanceof Wallet) {
    throw new Error("Invalid wallet type");
  }
  const { subscribe, set } = writable({});
  const connectInjected = async () => {
    let walletAddress = await wallet.connectInjected();
    set({
      address: walletAddress,
      connected: true
    });
  };
  const connectExternal = async () => {
    let link = await wallet.connectExternal((address) => {
      set({
        address,
        connected: true
      });
    });
    return link;
  };
  const disconnect = () => {
    set({
      address: "",
      connected: false
    });
  };
  return {
    subscribe,
    connectInjected,
    connectExternal,
    disconnect,
    available: wallet.available,
    lockCoins: wallet.lockCoins,
    burnTokens: wallet.burnTokens
  };
};
const makeNetworkStore = () => {
  let initialValue = {};
  const { subscribe, set } = writable(initialValue);
  return {
    subscribe,
    init(wallets) {
      let walletStores = {};
      for (let [key, value] of Object.entries(wallets)) {
        walletStores[key] = makeWalletStore(value);
      }
      let connected = derived(Object.values(walletStores), (wallets2) => {
        return wallets2.some((wallet) => wallet.connected);
      });
      let address = derived(Object.values(walletStores), (wallets2) => {
        let addresses = wallets2.map((wallet) => wallet.address);
        return addresses.filter((address2) => address2 !== "")[0];
      });
      set({ connected, address, wallets: walletStores });
    },
    disconnect() {
      let network = get_store_value(this);
      for (let wallet of Object.values(network.wallets)) {
        wallet.disconnect();
      }
    }
  };
};
const Ethereum = makeNetworkStore();
const Tezos = makeNetworkStore();
const TON = makeNetworkStore();
var isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i, mathceil = Math.ceil, mathfloor = Math.floor, bignumberError = "[BigNumber Error] ", tooManyDigits = bignumberError + "Number primitive has more than 15 significant digits: ", BASE = 1e14, LOG_BASE = 14, MAX_SAFE_INTEGER = 9007199254740991, POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13], SQRT_BASE = 1e7, MAX = 1e9;
function clone(configObject) {
  var div, convertBase, parseNumeric, P = BigNumber2.prototype = { constructor: BigNumber2, toString: null, valueOf: null }, ONE = new BigNumber2(1), DECIMAL_PLACES = 20, ROUNDING_MODE = 4, TO_EXP_NEG = -7, TO_EXP_POS = 21, MIN_EXP = -1e7, MAX_EXP = 1e7, CRYPTO = false, MODULO_MODE = 1, POW_PRECISION = 0, FORMAT = {
    prefix: "",
    groupSize: 3,
    secondaryGroupSize: 0,
    groupSeparator: ",",
    decimalSeparator: ".",
    fractionGroupSize: 0,
    fractionGroupSeparator: " ",
    // non-breaking space
    suffix: ""
  }, ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz", alphabetHasNormalDecimalDigits = true;
  function BigNumber2(v, b) {
    var alphabet2, c, caseChanged, e, i, isNum, len, str, x = this;
    if (!(x instanceof BigNumber2))
      return new BigNumber2(v, b);
    if (b == null) {
      if (v && v._isBigNumber === true) {
        x.s = v.s;
        if (!v.c || v.e > MAX_EXP) {
          x.c = x.e = null;
        } else if (v.e < MIN_EXP) {
          x.c = [x.e = 0];
        } else {
          x.e = v.e;
          x.c = v.c.slice();
        }
        return;
      }
      if ((isNum = typeof v == "number") && v * 0 == 0) {
        x.s = 1 / v < 0 ? (v = -v, -1) : 1;
        if (v === ~~v) {
          for (e = 0, i = v; i >= 10; i /= 10, e++)
            ;
          if (e > MAX_EXP) {
            x.c = x.e = null;
          } else {
            x.e = e;
            x.c = [v];
          }
          return;
        }
        str = String(v);
      } else {
        if (!isNumeric.test(str = String(v)))
          return parseNumeric(x, str, isNum);
        x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
      }
      if ((e = str.indexOf(".")) > -1)
        str = str.replace(".", "");
      if ((i = str.search(/e/i)) > 0) {
        if (e < 0)
          e = i;
        e += +str.slice(i + 1);
        str = str.substring(0, i);
      } else if (e < 0) {
        e = str.length;
      }
    } else {
      intCheck(b, 2, ALPHABET.length, "Base");
      if (b == 10 && alphabetHasNormalDecimalDigits) {
        x = new BigNumber2(v);
        return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
      }
      str = String(v);
      if (isNum = typeof v == "number") {
        if (v * 0 != 0)
          return parseNumeric(x, str, isNum, b);
        x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;
        if (BigNumber2.DEBUG && str.replace(/^0\.0*|\./, "").length > 15) {
          throw Error(tooManyDigits + v);
        }
      } else {
        x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
      }
      alphabet2 = ALPHABET.slice(0, b);
      e = i = 0;
      for (len = str.length; i < len; i++) {
        if (alphabet2.indexOf(c = str.charAt(i)) < 0) {
          if (c == ".") {
            if (i > e) {
              e = len;
              continue;
            }
          } else if (!caseChanged) {
            if (str == str.toUpperCase() && (str = str.toLowerCase()) || str == str.toLowerCase() && (str = str.toUpperCase())) {
              caseChanged = true;
              i = -1;
              e = 0;
              continue;
            }
          }
          return parseNumeric(x, String(v), isNum, b);
        }
      }
      isNum = false;
      str = convertBase(str, b, 10, x.s);
      if ((e = str.indexOf(".")) > -1)
        str = str.replace(".", "");
      else
        e = str.length;
    }
    for (i = 0; str.charCodeAt(i) === 48; i++)
      ;
    for (len = str.length; str.charCodeAt(--len) === 48; )
      ;
    if (str = str.slice(i, ++len)) {
      len -= i;
      if (isNum && BigNumber2.DEBUG && len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
        throw Error(tooManyDigits + x.s * v);
      }
      if ((e = e - i - 1) > MAX_EXP) {
        x.c = x.e = null;
      } else if (e < MIN_EXP) {
        x.c = [x.e = 0];
      } else {
        x.e = e;
        x.c = [];
        i = (e + 1) % LOG_BASE;
        if (e < 0)
          i += LOG_BASE;
        if (i < len) {
          if (i)
            x.c.push(+str.slice(0, i));
          for (len -= LOG_BASE; i < len; ) {
            x.c.push(+str.slice(i, i += LOG_BASE));
          }
          i = LOG_BASE - (str = str.slice(i)).length;
        } else {
          i -= len;
        }
        for (; i--; str += "0")
          ;
        x.c.push(+str);
      }
    } else {
      x.c = [x.e = 0];
    }
  }
  BigNumber2.clone = clone;
  BigNumber2.ROUND_UP = 0;
  BigNumber2.ROUND_DOWN = 1;
  BigNumber2.ROUND_CEIL = 2;
  BigNumber2.ROUND_FLOOR = 3;
  BigNumber2.ROUND_HALF_UP = 4;
  BigNumber2.ROUND_HALF_DOWN = 5;
  BigNumber2.ROUND_HALF_EVEN = 6;
  BigNumber2.ROUND_HALF_CEIL = 7;
  BigNumber2.ROUND_HALF_FLOOR = 8;
  BigNumber2.EUCLID = 9;
  BigNumber2.config = BigNumber2.set = function(obj) {
    var p, v;
    if (obj != null) {
      if (typeof obj == "object") {
        if (obj.hasOwnProperty(p = "DECIMAL_PLACES")) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          DECIMAL_PLACES = v;
        }
        if (obj.hasOwnProperty(p = "ROUNDING_MODE")) {
          v = obj[p];
          intCheck(v, 0, 8, p);
          ROUNDING_MODE = v;
        }
        if (obj.hasOwnProperty(p = "EXPONENTIAL_AT")) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, 0, p);
            intCheck(v[1], 0, MAX, p);
            TO_EXP_NEG = v[0];
            TO_EXP_POS = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
          }
        }
        if (obj.hasOwnProperty(p = "RANGE")) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, -1, p);
            intCheck(v[1], 1, MAX, p);
            MIN_EXP = v[0];
            MAX_EXP = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            if (v) {
              MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
            } else {
              throw Error(bignumberError + p + " cannot be zero: " + v);
            }
          }
        }
        if (obj.hasOwnProperty(p = "CRYPTO")) {
          v = obj[p];
          if (v === !!v) {
            if (v) {
              if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
                CRYPTO = v;
              } else {
                CRYPTO = !v;
                throw Error(bignumberError + "crypto unavailable");
              }
            } else {
              CRYPTO = v;
            }
          } else {
            throw Error(bignumberError + p + " not true or false: " + v);
          }
        }
        if (obj.hasOwnProperty(p = "MODULO_MODE")) {
          v = obj[p];
          intCheck(v, 0, 9, p);
          MODULO_MODE = v;
        }
        if (obj.hasOwnProperty(p = "POW_PRECISION")) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          POW_PRECISION = v;
        }
        if (obj.hasOwnProperty(p = "FORMAT")) {
          v = obj[p];
          if (typeof v == "object")
            FORMAT = v;
          else
            throw Error(bignumberError + p + " not an object: " + v);
        }
        if (obj.hasOwnProperty(p = "ALPHABET")) {
          v = obj[p];
          if (typeof v == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
            alphabetHasNormalDecimalDigits = v.slice(0, 10) == "0123456789";
            ALPHABET = v;
          } else {
            throw Error(bignumberError + p + " invalid: " + v);
          }
        }
      } else {
        throw Error(bignumberError + "Object expected: " + obj);
      }
    }
    return {
      DECIMAL_PLACES,
      ROUNDING_MODE,
      EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
      RANGE: [MIN_EXP, MAX_EXP],
      CRYPTO,
      MODULO_MODE,
      POW_PRECISION,
      FORMAT,
      ALPHABET
    };
  };
  BigNumber2.isBigNumber = function(v) {
    if (!v || v._isBigNumber !== true)
      return false;
    if (!BigNumber2.DEBUG)
      return true;
    var i, n, c = v.c, e = v.e, s = v.s;
    out:
      if ({}.toString.call(c) == "[object Array]") {
        if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {
          if (c[0] === 0) {
            if (e === 0 && c.length === 1)
              return true;
            break out;
          }
          i = (e + 1) % LOG_BASE;
          if (i < 1)
            i += LOG_BASE;
          if (String(c[0]).length == i) {
            for (i = 0; i < c.length; i++) {
              n = c[i];
              if (n < 0 || n >= BASE || n !== mathfloor(n))
                break out;
            }
            if (n !== 0)
              return true;
          }
        }
      } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
        return true;
      }
    throw Error(bignumberError + "Invalid BigNumber: " + v);
  };
  BigNumber2.maximum = BigNumber2.max = function() {
    return maxOrMin(arguments, P.lt);
  };
  BigNumber2.minimum = BigNumber2.min = function() {
    return maxOrMin(arguments, P.gt);
  };
  BigNumber2.random = function() {
    var pow2_53 = 9007199254740992;
    var random53bitInt = Math.random() * pow2_53 & 2097151 ? function() {
      return mathfloor(Math.random() * pow2_53);
    } : function() {
      return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0);
    };
    return function(dp) {
      var a, b, e, k, v, i = 0, c = [], rand = new BigNumber2(ONE);
      if (dp == null)
        dp = DECIMAL_PLACES;
      else
        intCheck(dp, 0, MAX);
      k = mathceil(dp / LOG_BASE);
      if (CRYPTO) {
        if (crypto.getRandomValues) {
          a = crypto.getRandomValues(new Uint32Array(k *= 2));
          for (; i < k; ) {
            v = a[i] * 131072 + (a[i + 1] >>> 11);
            if (v >= 9e15) {
              b = crypto.getRandomValues(new Uint32Array(2));
              a[i] = b[0];
              a[i + 1] = b[1];
            } else {
              c.push(v % 1e14);
              i += 2;
            }
          }
          i = k / 2;
        } else if (crypto.randomBytes) {
          a = crypto.randomBytes(k *= 7);
          for (; i < k; ) {
            v = (a[i] & 31) * 281474976710656 + a[i + 1] * 1099511627776 + a[i + 2] * 4294967296 + a[i + 3] * 16777216 + (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];
            if (v >= 9e15) {
              crypto.randomBytes(7).copy(a, i);
            } else {
              c.push(v % 1e14);
              i += 7;
            }
          }
          i = k / 7;
        } else {
          CRYPTO = false;
          throw Error(bignumberError + "crypto unavailable");
        }
      }
      if (!CRYPTO) {
        for (; i < k; ) {
          v = random53bitInt();
          if (v < 9e15)
            c[i++] = v % 1e14;
        }
      }
      k = c[--i];
      dp %= LOG_BASE;
      if (k && dp) {
        v = POWS_TEN[LOG_BASE - dp];
        c[i] = mathfloor(k / v) * v;
      }
      for (; c[i] === 0; c.pop(), i--)
        ;
      if (i < 0) {
        c = [e = 0];
      } else {
        for (e = -1; c[0] === 0; c.splice(0, 1), e -= LOG_BASE)
          ;
        for (i = 1, v = c[0]; v >= 10; v /= 10, i++)
          ;
        if (i < LOG_BASE)
          e -= LOG_BASE - i;
      }
      rand.e = e;
      rand.c = c;
      return rand;
    };
  }();
  BigNumber2.sum = function() {
    var i = 1, args = arguments, sum = new BigNumber2(args[0]);
    for (; i < args.length; )
      sum = sum.plus(args[i++]);
    return sum;
  };
  convertBase = function() {
    var decimal = "0123456789";
    function toBaseOut(str, baseIn, baseOut, alphabet2) {
      var j, arr = [0], arrL, i = 0, len = str.length;
      for (; i < len; ) {
        for (arrL = arr.length; arrL--; arr[arrL] *= baseIn)
          ;
        arr[0] += alphabet2.indexOf(str.charAt(i++));
        for (j = 0; j < arr.length; j++) {
          if (arr[j] > baseOut - 1) {
            if (arr[j + 1] == null)
              arr[j + 1] = 0;
            arr[j + 1] += arr[j] / baseOut | 0;
            arr[j] %= baseOut;
          }
        }
      }
      return arr.reverse();
    }
    return function(str, baseIn, baseOut, sign2, callerIsToString) {
      var alphabet2, d, e, k, r, x, xc, y, i = str.indexOf("."), dp = DECIMAL_PLACES, rm = ROUNDING_MODE;
      if (i >= 0) {
        k = POW_PRECISION;
        POW_PRECISION = 0;
        str = str.replace(".", "");
        y = new BigNumber2(baseIn);
        x = y.pow(str.length - i);
        POW_PRECISION = k;
        y.c = toBaseOut(
          toFixedPoint(coeffToString(x.c), x.e, "0"),
          10,
          baseOut,
          decimal
        );
        y.e = y.c.length;
      }
      xc = toBaseOut(str, baseIn, baseOut, callerIsToString ? (alphabet2 = ALPHABET, decimal) : (alphabet2 = decimal, ALPHABET));
      e = k = xc.length;
      for (; xc[--k] == 0; xc.pop())
        ;
      if (!xc[0])
        return alphabet2.charAt(0);
      if (i < 0) {
        --e;
      } else {
        x.c = xc;
        x.e = e;
        x.s = sign2;
        x = div(x, y, dp, rm, baseOut);
        xc = x.c;
        r = x.r;
        e = x.e;
      }
      d = e + dp + 1;
      i = xc[d];
      k = baseOut / 2;
      r = r || d < 0 || xc[d + 1] != null;
      r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : i > k || i == k && (rm == 4 || r || rm == 6 && xc[d - 1] & 1 || rm == (x.s < 0 ? 8 : 7));
      if (d < 1 || !xc[0]) {
        str = r ? toFixedPoint(alphabet2.charAt(1), -dp, alphabet2.charAt(0)) : alphabet2.charAt(0);
      } else {
        xc.length = d;
        if (r) {
          for (--baseOut; ++xc[--d] > baseOut; ) {
            xc[d] = 0;
            if (!d) {
              ++e;
              xc = [1].concat(xc);
            }
          }
        }
        for (k = xc.length; !xc[--k]; )
          ;
        for (i = 0, str = ""; i <= k; str += alphabet2.charAt(xc[i++]))
          ;
        str = toFixedPoint(str, e, alphabet2.charAt(0));
      }
      return str;
    };
  }();
  div = function() {
    function multiply(x, k, base) {
      var m, temp, xlo, xhi, carry = 0, i = x.length, klo = k % SQRT_BASE, khi = k / SQRT_BASE | 0;
      for (x = x.slice(); i--; ) {
        xlo = x[i] % SQRT_BASE;
        xhi = x[i] / SQRT_BASE | 0;
        m = khi * xlo + xhi * klo;
        temp = klo * xlo + m % SQRT_BASE * SQRT_BASE + carry;
        carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
        x[i] = temp % base;
      }
      if (carry)
        x = [carry].concat(x);
      return x;
    }
    function compare2(a, b, aL, bL) {
      var i, cmp;
      if (aL != bL) {
        cmp = aL > bL ? 1 : -1;
      } else {
        for (i = cmp = 0; i < aL; i++) {
          if (a[i] != b[i]) {
            cmp = a[i] > b[i] ? 1 : -1;
            break;
          }
        }
      }
      return cmp;
    }
    function subtract(a, b, aL, base) {
      var i = 0;
      for (; aL--; ) {
        a[aL] -= i;
        i = a[aL] < b[aL] ? 1 : 0;
        a[aL] = i * base + a[aL] - b[aL];
      }
      for (; !a[0] && a.length > 1; a.splice(0, 1))
        ;
    }
    return function(x, y, dp, rm, base) {
      var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0, yL, yz, s = x.s == y.s ? 1 : -1, xc = x.c, yc = y.c;
      if (!xc || !xc[0] || !yc || !yc[0]) {
        return new BigNumber2(
          // Return NaN if either NaN, or both Infinity or 0.
          !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN : (
            // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
            xc && xc[0] == 0 || !yc ? s * 0 : s / 0
          )
        );
      }
      q = new BigNumber2(s);
      qc = q.c = [];
      e = x.e - y.e;
      s = dp + e + 1;
      if (!base) {
        base = BASE;
        e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
        s = s / LOG_BASE | 0;
      }
      for (i = 0; yc[i] == (xc[i] || 0); i++)
        ;
      if (yc[i] > (xc[i] || 0))
        e--;
      if (s < 0) {
        qc.push(1);
        more = true;
      } else {
        xL = xc.length;
        yL = yc.length;
        i = 0;
        s += 2;
        n = mathfloor(base / (yc[0] + 1));
        if (n > 1) {
          yc = multiply(yc, n, base);
          xc = multiply(xc, n, base);
          yL = yc.length;
          xL = xc.length;
        }
        xi = yL;
        rem = xc.slice(0, yL);
        remL = rem.length;
        for (; remL < yL; rem[remL++] = 0)
          ;
        yz = yc.slice();
        yz = [0].concat(yz);
        yc0 = yc[0];
        if (yc[1] >= base / 2)
          yc0++;
        do {
          n = 0;
          cmp = compare2(yc, rem, yL, remL);
          if (cmp < 0) {
            rem0 = rem[0];
            if (yL != remL)
              rem0 = rem0 * base + (rem[1] || 0);
            n = mathfloor(rem0 / yc0);
            if (n > 1) {
              if (n >= base)
                n = base - 1;
              prod = multiply(yc, n, base);
              prodL = prod.length;
              remL = rem.length;
              while (compare2(prod, rem, prodL, remL) == 1) {
                n--;
                subtract(prod, yL < prodL ? yz : yc, prodL, base);
                prodL = prod.length;
                cmp = 1;
              }
            } else {
              if (n == 0) {
                cmp = n = 1;
              }
              prod = yc.slice();
              prodL = prod.length;
            }
            if (prodL < remL)
              prod = [0].concat(prod);
            subtract(rem, prod, remL, base);
            remL = rem.length;
            if (cmp == -1) {
              while (compare2(yc, rem, yL, remL) < 1) {
                n++;
                subtract(rem, yL < remL ? yz : yc, remL, base);
                remL = rem.length;
              }
            }
          } else if (cmp === 0) {
            n++;
            rem = [0];
          }
          qc[i++] = n;
          if (rem[0]) {
            rem[remL++] = xc[xi] || 0;
          } else {
            rem = [xc[xi]];
            remL = 1;
          }
        } while ((xi++ < xL || rem[0] != null) && s--);
        more = rem[0] != null;
        if (!qc[0])
          qc.splice(0, 1);
      }
      if (base == BASE) {
        for (i = 1, s = qc[0]; s >= 10; s /= 10, i++)
          ;
        round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);
      } else {
        q.e = e;
        q.r = +more;
      }
      return q;
    };
  }();
  function format(n, i, rm, id) {
    var c0, e, ne, len, str;
    if (rm == null)
      rm = ROUNDING_MODE;
    else
      intCheck(rm, 0, 8);
    if (!n.c)
      return n.toString();
    c0 = n.c[0];
    ne = n.e;
    if (i == null) {
      str = coeffToString(n.c);
      str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS) ? toExponential(str, ne) : toFixedPoint(str, ne, "0");
    } else {
      n = round(new BigNumber2(n), i, rm);
      e = n.e;
      str = coeffToString(n.c);
      len = str.length;
      if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {
        for (; len < i; str += "0", len++)
          ;
        str = toExponential(str, e);
      } else {
        i -= ne;
        str = toFixedPoint(str, e, "0");
        if (e + 1 > len) {
          if (--i > 0)
            for (str += "."; i--; str += "0")
              ;
        } else {
          i += e - len;
          if (i > 0) {
            if (e + 1 == len)
              str += ".";
            for (; i--; str += "0")
              ;
          }
        }
      }
    }
    return n.s < 0 && c0 ? "-" + str : str;
  }
  function maxOrMin(args, method) {
    var n, i = 1, m = new BigNumber2(args[0]);
    for (; i < args.length; i++) {
      n = new BigNumber2(args[i]);
      if (!n.s) {
        m = n;
        break;
      } else if (method.call(m, n)) {
        m = n;
      }
    }
    return m;
  }
  function normalise(n, c, e) {
    var i = 1, j = c.length;
    for (; !c[--j]; c.pop())
      ;
    for (j = c[0]; j >= 10; j /= 10, i++)
      ;
    if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {
      n.c = n.e = null;
    } else if (e < MIN_EXP) {
      n.c = [n.e = 0];
    } else {
      n.e = e;
      n.c = c;
    }
    return n;
  }
  parseNumeric = function() {
    var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i, dotAfter = /^([^.]+)\.$/, dotBefore = /^\.([^.]+)$/, isInfinityOrNaN = /^-?(Infinity|NaN)$/, whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
    return function(x, str, isNum, b) {
      var base, s = isNum ? str : str.replace(whitespaceOrPlus, "");
      if (isInfinityOrNaN.test(s)) {
        x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
      } else {
        if (!isNum) {
          s = s.replace(basePrefix, function(m, p1, p2) {
            base = (p2 = p2.toLowerCase()) == "x" ? 16 : p2 == "b" ? 2 : 8;
            return !b || b == base ? p1 : m;
          });
          if (b) {
            base = b;
            s = s.replace(dotAfter, "$1").replace(dotBefore, "0.$1");
          }
          if (str != s)
            return new BigNumber2(s, base);
        }
        if (BigNumber2.DEBUG) {
          throw Error(bignumberError + "Not a" + (b ? " base " + b : "") + " number: " + str);
        }
        x.s = null;
      }
      x.c = x.e = null;
    };
  }();
  function round(x, sd, rm, r) {
    var d, i, j, k, n, ni, rd, xc = x.c, pows10 = POWS_TEN;
    if (xc) {
      out: {
        for (d = 1, k = xc[0]; k >= 10; k /= 10, d++)
          ;
        i = sd - d;
        if (i < 0) {
          i += LOG_BASE;
          j = sd;
          n = xc[ni = 0];
          rd = n / pows10[d - j - 1] % 10 | 0;
        } else {
          ni = mathceil((i + 1) / LOG_BASE);
          if (ni >= xc.length) {
            if (r) {
              for (; xc.length <= ni; xc.push(0))
                ;
              n = rd = 0;
              d = 1;
              i %= LOG_BASE;
              j = i - LOG_BASE + 1;
            } else {
              break out;
            }
          } else {
            n = k = xc[ni];
            for (d = 1; k >= 10; k /= 10, d++)
              ;
            i %= LOG_BASE;
            j = i - LOG_BASE + d;
            rd = j < 0 ? 0 : n / pows10[d - j - 1] % 10 | 0;
          }
        }
        r = r || sd < 0 || // Are there any non-zero digits after the rounding digit?
        // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
        // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
        xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);
        r = rm < 4 ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 && (i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
        if (sd < 1 || !xc[0]) {
          xc.length = 0;
          if (r) {
            sd -= x.e + 1;
            xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
            x.e = -sd || 0;
          } else {
            xc[0] = x.e = 0;
          }
          return x;
        }
        if (i == 0) {
          xc.length = ni;
          k = 1;
          ni--;
        } else {
          xc.length = ni + 1;
          k = pows10[LOG_BASE - i];
          xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
        }
        if (r) {
          for (; ; ) {
            if (ni == 0) {
              for (i = 1, j = xc[0]; j >= 10; j /= 10, i++)
                ;
              j = xc[0] += k;
              for (k = 1; j >= 10; j /= 10, k++)
                ;
              if (i != k) {
                x.e++;
                if (xc[0] == BASE)
                  xc[0] = 1;
              }
              break;
            } else {
              xc[ni] += k;
              if (xc[ni] != BASE)
                break;
              xc[ni--] = 0;
              k = 1;
            }
          }
        }
        for (i = xc.length; xc[--i] === 0; xc.pop())
          ;
      }
      if (x.e > MAX_EXP) {
        x.c = x.e = null;
      } else if (x.e < MIN_EXP) {
        x.c = [x.e = 0];
      }
    }
    return x;
  }
  function valueOf(n) {
    var str, e = n.e;
    if (e === null)
      return n.toString();
    str = coeffToString(n.c);
    str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(str, e) : toFixedPoint(str, e, "0");
    return n.s < 0 ? "-" + str : str;
  }
  P.absoluteValue = P.abs = function() {
    var x = new BigNumber2(this);
    if (x.s < 0)
      x.s = 1;
    return x;
  };
  P.comparedTo = function(y, b) {
    return compare(this, new BigNumber2(y, b));
  };
  P.decimalPlaces = P.dp = function(dp, rm) {
    var c, n, v, x = this;
    if (dp != null) {
      intCheck(dp, 0, MAX);
      if (rm == null)
        rm = ROUNDING_MODE;
      else
        intCheck(rm, 0, 8);
      return round(new BigNumber2(x), dp + x.e + 1, rm);
    }
    if (!(c = x.c))
      return null;
    n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;
    if (v = c[v])
      for (; v % 10 == 0; v /= 10, n--)
        ;
    if (n < 0)
      n = 0;
    return n;
  };
  P.dividedBy = P.div = function(y, b) {
    return div(this, new BigNumber2(y, b), DECIMAL_PLACES, ROUNDING_MODE);
  };
  P.dividedToIntegerBy = P.idiv = function(y, b) {
    return div(this, new BigNumber2(y, b), 0, 1);
  };
  P.exponentiatedBy = P.pow = function(n, m) {
    var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y, x = this;
    n = new BigNumber2(n);
    if (n.c && !n.isInteger()) {
      throw Error(bignumberError + "Exponent not an integer: " + valueOf(n));
    }
    if (m != null)
      m = new BigNumber2(m);
    nIsBig = n.e > 14;
    if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {
      y = new BigNumber2(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
      return m ? y.mod(m) : y;
    }
    nIsNeg = n.s < 0;
    if (m) {
      if (m.c ? !m.c[0] : !m.s)
        return new BigNumber2(NaN);
      isModExp = !nIsNeg && x.isInteger() && m.isInteger();
      if (isModExp)
        x = x.mod(m);
    } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0 ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7 : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {
      k = x.s < 0 && isOdd(n) ? -0 : 0;
      if (x.e > -1)
        k = 1 / k;
      return new BigNumber2(nIsNeg ? 1 / k : k);
    } else if (POW_PRECISION) {
      k = mathceil(POW_PRECISION / LOG_BASE + 2);
    }
    if (nIsBig) {
      half = new BigNumber2(0.5);
      if (nIsNeg)
        n.s = 1;
      nIsOdd = isOdd(n);
    } else {
      i = Math.abs(+valueOf(n));
      nIsOdd = i % 2;
    }
    y = new BigNumber2(ONE);
    for (; ; ) {
      if (nIsOdd) {
        y = y.times(x);
        if (!y.c)
          break;
        if (k) {
          if (y.c.length > k)
            y.c.length = k;
        } else if (isModExp) {
          y = y.mod(m);
        }
      }
      if (i) {
        i = mathfloor(i / 2);
        if (i === 0)
          break;
        nIsOdd = i % 2;
      } else {
        n = n.times(half);
        round(n, n.e + 1, 1);
        if (n.e > 14) {
          nIsOdd = isOdd(n);
        } else {
          i = +valueOf(n);
          if (i === 0)
            break;
          nIsOdd = i % 2;
        }
      }
      x = x.times(x);
      if (k) {
        if (x.c && x.c.length > k)
          x.c.length = k;
      } else if (isModExp) {
        x = x.mod(m);
      }
    }
    if (isModExp)
      return y;
    if (nIsNeg)
      y = ONE.div(y);
    return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
  };
  P.integerValue = function(rm) {
    var n = new BigNumber2(this);
    if (rm == null)
      rm = ROUNDING_MODE;
    else
      intCheck(rm, 0, 8);
    return round(n, n.e + 1, rm);
  };
  P.isEqualTo = P.eq = function(y, b) {
    return compare(this, new BigNumber2(y, b)) === 0;
  };
  P.isFinite = function() {
    return !!this.c;
  };
  P.isGreaterThan = P.gt = function(y, b) {
    return compare(this, new BigNumber2(y, b)) > 0;
  };
  P.isGreaterThanOrEqualTo = P.gte = function(y, b) {
    return (b = compare(this, new BigNumber2(y, b))) === 1 || b === 0;
  };
  P.isInteger = function() {
    return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
  };
  P.isLessThan = P.lt = function(y, b) {
    return compare(this, new BigNumber2(y, b)) < 0;
  };
  P.isLessThanOrEqualTo = P.lte = function(y, b) {
    return (b = compare(this, new BigNumber2(y, b))) === -1 || b === 0;
  };
  P.isNaN = function() {
    return !this.s;
  };
  P.isNegative = function() {
    return this.s < 0;
  };
  P.isPositive = function() {
    return this.s > 0;
  };
  P.isZero = function() {
    return !!this.c && this.c[0] == 0;
  };
  P.minus = function(y, b) {
    var i, j, t2, xLTy, x = this, a = x.s;
    y = new BigNumber2(y, b);
    b = y.s;
    if (!a || !b)
      return new BigNumber2(NaN);
    if (a != b) {
      y.s = -b;
      return x.plus(y);
    }
    var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
    if (!xe || !ye) {
      if (!xc || !yc)
        return xc ? (y.s = -b, y) : new BigNumber2(yc ? x : NaN);
      if (!xc[0] || !yc[0]) {
        return yc[0] ? (y.s = -b, y) : new BigNumber2(xc[0] ? x : (
          // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
          ROUNDING_MODE == 3 ? -0 : 0
        ));
      }
    }
    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();
    if (a = xe - ye) {
      if (xLTy = a < 0) {
        a = -a;
        t2 = xc;
      } else {
        ye = xe;
        t2 = yc;
      }
      t2.reverse();
      for (b = a; b--; t2.push(0))
        ;
      t2.reverse();
    } else {
      j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;
      for (a = b = 0; b < j; b++) {
        if (xc[b] != yc[b]) {
          xLTy = xc[b] < yc[b];
          break;
        }
      }
    }
    if (xLTy)
      t2 = xc, xc = yc, yc = t2, y.s = -y.s;
    b = (j = yc.length) - (i = xc.length);
    if (b > 0)
      for (; b--; xc[i++] = 0)
        ;
    b = BASE - 1;
    for (; j > a; ) {
      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i]; xc[i] = b)
          ;
        --xc[i];
        xc[j] += BASE;
      }
      xc[j] -= yc[j];
    }
    for (; xc[0] == 0; xc.splice(0, 1), --ye)
      ;
    if (!xc[0]) {
      y.s = ROUNDING_MODE == 3 ? -1 : 1;
      y.c = [y.e = 0];
      return y;
    }
    return normalise(y, xc, ye);
  };
  P.modulo = P.mod = function(y, b) {
    var q, s, x = this;
    y = new BigNumber2(y, b);
    if (!x.c || !y.s || y.c && !y.c[0]) {
      return new BigNumber2(NaN);
    } else if (!y.c || x.c && !x.c[0]) {
      return new BigNumber2(x);
    }
    if (MODULO_MODE == 9) {
      s = y.s;
      y.s = 1;
      q = div(x, y, 0, 3);
      y.s = s;
      q.s *= s;
    } else {
      q = div(x, y, 0, MODULO_MODE);
    }
    y = x.minus(q.times(y));
    if (!y.c[0] && MODULO_MODE == 1)
      y.s = x.s;
    return y;
  };
  P.multipliedBy = P.times = function(y, b) {
    var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc, base, sqrtBase, x = this, xc = x.c, yc = (y = new BigNumber2(y, b)).c;
    if (!xc || !yc || !xc[0] || !yc[0]) {
      if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
        y.c = y.e = y.s = null;
      } else {
        y.s *= x.s;
        if (!xc || !yc) {
          y.c = y.e = null;
        } else {
          y.c = [0];
          y.e = 0;
        }
      }
      return y;
    }
    e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
    y.s *= x.s;
    xcL = xc.length;
    ycL = yc.length;
    if (xcL < ycL)
      zc = xc, xc = yc, yc = zc, i = xcL, xcL = ycL, ycL = i;
    for (i = xcL + ycL, zc = []; i--; zc.push(0))
      ;
    base = BASE;
    sqrtBase = SQRT_BASE;
    for (i = ycL; --i >= 0; ) {
      c = 0;
      ylo = yc[i] % sqrtBase;
      yhi = yc[i] / sqrtBase | 0;
      for (k = xcL, j = i + k; j > i; ) {
        xlo = xc[--k] % sqrtBase;
        xhi = xc[k] / sqrtBase | 0;
        m = yhi * xlo + xhi * ylo;
        xlo = ylo * xlo + m % sqrtBase * sqrtBase + zc[j] + c;
        c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
        zc[j--] = xlo % base;
      }
      zc[j] = c;
    }
    if (c) {
      ++e;
    } else {
      zc.splice(0, 1);
    }
    return normalise(y, zc, e);
  };
  P.negated = function() {
    var x = new BigNumber2(this);
    x.s = -x.s || null;
    return x;
  };
  P.plus = function(y, b) {
    var t2, x = this, a = x.s;
    y = new BigNumber2(y, b);
    b = y.s;
    if (!a || !b)
      return new BigNumber2(NaN);
    if (a != b) {
      y.s = -b;
      return x.minus(y);
    }
    var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
    if (!xe || !ye) {
      if (!xc || !yc)
        return new BigNumber2(a / 0);
      if (!xc[0] || !yc[0])
        return yc[0] ? y : new BigNumber2(xc[0] ? x : a * 0);
    }
    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();
    if (a = xe - ye) {
      if (a > 0) {
        ye = xe;
        t2 = yc;
      } else {
        a = -a;
        t2 = xc;
      }
      t2.reverse();
      for (; a--; t2.push(0))
        ;
      t2.reverse();
    }
    a = xc.length;
    b = yc.length;
    if (a - b < 0)
      t2 = yc, yc = xc, xc = t2, b = a;
    for (a = 0; b; ) {
      a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
      xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
    }
    if (a) {
      xc = [a].concat(xc);
      ++ye;
    }
    return normalise(y, xc, ye);
  };
  P.precision = P.sd = function(sd, rm) {
    var c, n, v, x = this;
    if (sd != null && sd !== !!sd) {
      intCheck(sd, 1, MAX);
      if (rm == null)
        rm = ROUNDING_MODE;
      else
        intCheck(rm, 0, 8);
      return round(new BigNumber2(x), sd, rm);
    }
    if (!(c = x.c))
      return null;
    v = c.length - 1;
    n = v * LOG_BASE + 1;
    if (v = c[v]) {
      for (; v % 10 == 0; v /= 10, n--)
        ;
      for (v = c[0]; v >= 10; v /= 10, n++)
        ;
    }
    if (sd && x.e + 1 > n)
      n = x.e + 1;
    return n;
  };
  P.shiftedBy = function(k) {
    intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
    return this.times("1e" + k);
  };
  P.squareRoot = P.sqrt = function() {
    var m, n, r, rep, t2, x = this, c = x.c, s = x.s, e = x.e, dp = DECIMAL_PLACES + 4, half = new BigNumber2("0.5");
    if (s !== 1 || !c || !c[0]) {
      return new BigNumber2(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
    }
    s = Math.sqrt(+valueOf(x));
    if (s == 0 || s == 1 / 0) {
      n = coeffToString(c);
      if ((n.length + e) % 2 == 0)
        n += "0";
      s = Math.sqrt(+n);
      e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);
      if (s == 1 / 0) {
        n = "5e" + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf("e") + 1) + e;
      }
      r = new BigNumber2(n);
    } else {
      r = new BigNumber2(s + "");
    }
    if (r.c[0]) {
      e = r.e;
      s = e + dp;
      if (s < 3)
        s = 0;
      for (; ; ) {
        t2 = r;
        r = half.times(t2.plus(div(x, t2, dp, 1)));
        if (coeffToString(t2.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {
          if (r.e < e)
            --s;
          n = n.slice(s - 3, s + 1);
          if (n == "9999" || !rep && n == "4999") {
            if (!rep) {
              round(t2, t2.e + DECIMAL_PLACES + 2, 0);
              if (t2.times(t2).eq(x)) {
                r = t2;
                break;
              }
            }
            dp += 4;
            s += 4;
            rep = 1;
          } else {
            if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
              round(r, r.e + DECIMAL_PLACES + 2, 1);
              m = !r.times(r).eq(x);
            }
            break;
          }
        }
      }
    }
    return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
  };
  P.toExponential = function(dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp++;
    }
    return format(this, dp, rm, 1);
  };
  P.toFixed = function(dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp = dp + this.e + 1;
    }
    return format(this, dp, rm);
  };
  P.toFormat = function(dp, rm, format2) {
    var str, x = this;
    if (format2 == null) {
      if (dp != null && rm && typeof rm == "object") {
        format2 = rm;
        rm = null;
      } else if (dp && typeof dp == "object") {
        format2 = dp;
        dp = rm = null;
      } else {
        format2 = FORMAT;
      }
    } else if (typeof format2 != "object") {
      throw Error(bignumberError + "Argument not an object: " + format2);
    }
    str = x.toFixed(dp, rm);
    if (x.c) {
      var i, arr = str.split("."), g1 = +format2.groupSize, g2 = +format2.secondaryGroupSize, groupSeparator = format2.groupSeparator || "", intPart = arr[0], fractionPart = arr[1], isNeg = x.s < 0, intDigits = isNeg ? intPart.slice(1) : intPart, len = intDigits.length;
      if (g2)
        i = g1, g1 = g2, g2 = i, len -= i;
      if (g1 > 0 && len > 0) {
        i = len % g1 || g1;
        intPart = intDigits.substr(0, i);
        for (; i < len; i += g1)
          intPart += groupSeparator + intDigits.substr(i, g1);
        if (g2 > 0)
          intPart += groupSeparator + intDigits.slice(i);
        if (isNeg)
          intPart = "-" + intPart;
      }
      str = fractionPart ? intPart + (format2.decimalSeparator || "") + ((g2 = +format2.fractionGroupSize) ? fractionPart.replace(
        new RegExp("\\d{" + g2 + "}\\B", "g"),
        "$&" + (format2.fractionGroupSeparator || "")
      ) : fractionPart) : intPart;
    }
    return (format2.prefix || "") + str + (format2.suffix || "");
  };
  P.toFraction = function(md) {
    var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s, x = this, xc = x.c;
    if (md != null) {
      n = new BigNumber2(md);
      if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
        throw Error(bignumberError + "Argument " + (n.isInteger() ? "out of range: " : "not an integer: ") + valueOf(n));
      }
    }
    if (!xc)
      return new BigNumber2(x);
    d = new BigNumber2(ONE);
    n1 = d0 = new BigNumber2(ONE);
    d1 = n0 = new BigNumber2(ONE);
    s = coeffToString(xc);
    e = d.e = s.length - x.e - 1;
    d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
    md = !md || n.comparedTo(d) > 0 ? e > 0 ? d : n1 : n;
    exp = MAX_EXP;
    MAX_EXP = 1 / 0;
    n = new BigNumber2(s);
    n0.c[0] = 0;
    for (; ; ) {
      q = div(n, d, 0, 1);
      d2 = d0.plus(q.times(d1));
      if (d2.comparedTo(md) == 1)
        break;
      d0 = d1;
      d1 = d2;
      n1 = n0.plus(q.times(d2 = n1));
      n0 = d2;
      d = n.minus(q.times(d2 = d));
      n = d2;
    }
    d2 = div(md.minus(d0), d1, 0, 1);
    n0 = n0.plus(d2.times(n1));
    d0 = d0.plus(d2.times(d1));
    n0.s = n1.s = x.s;
    e = e * 2;
    r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
      div(n0, d0, e, ROUNDING_MODE).minus(x).abs()
    ) < 1 ? [n1, d1] : [n0, d0];
    MAX_EXP = exp;
    return r;
  };
  P.toNumber = function() {
    return +valueOf(this);
  };
  P.toPrecision = function(sd, rm) {
    if (sd != null)
      intCheck(sd, 1, MAX);
    return format(this, sd, rm, 2);
  };
  P.toString = function(b) {
    var str, n = this, s = n.s, e = n.e;
    if (e === null) {
      if (s) {
        str = "Infinity";
        if (s < 0)
          str = "-" + str;
      } else {
        str = "NaN";
      }
    } else {
      if (b == null) {
        str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(coeffToString(n.c), e) : toFixedPoint(coeffToString(n.c), e, "0");
      } else if (b === 10 && alphabetHasNormalDecimalDigits) {
        n = round(new BigNumber2(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
        str = toFixedPoint(coeffToString(n.c), n.e, "0");
      } else {
        intCheck(b, 2, ALPHABET.length, "Base");
        str = convertBase(toFixedPoint(coeffToString(n.c), e, "0"), 10, b, s, true);
      }
      if (s < 0 && n.c[0])
        str = "-" + str;
    }
    return str;
  };
  P.valueOf = P.toJSON = function() {
    return valueOf(this);
  };
  P._isBigNumber = true;
  P[Symbol.toStringTag] = "BigNumber";
  P[Symbol.for("nodejs.util.inspect.custom")] = P.valueOf;
  if (configObject != null)
    BigNumber2.set(configObject);
  return BigNumber2;
}
function bitFloor(n) {
  var i = n | 0;
  return n > 0 || n === i ? i : i - 1;
}
function coeffToString(a) {
  var s, z, i = 1, j = a.length, r = a[0] + "";
  for (; i < j; ) {
    s = a[i++] + "";
    z = LOG_BASE - s.length;
    for (; z--; s = "0" + s)
      ;
    r += s;
  }
  for (j = r.length; r.charCodeAt(--j) === 48; )
    ;
  return r.slice(0, j + 1 || 1);
}
function compare(x, y) {
  var a, b, xc = x.c, yc = y.c, i = x.s, j = y.s, k = x.e, l = y.e;
  if (!i || !j)
    return null;
  a = xc && !xc[0];
  b = yc && !yc[0];
  if (a || b)
    return a ? b ? 0 : -j : i;
  if (i != j)
    return i;
  a = i < 0;
  b = k == l;
  if (!xc || !yc)
    return b ? 0 : !xc ^ a ? 1 : -1;
  if (!b)
    return k > l ^ a ? 1 : -1;
  j = (k = xc.length) < (l = yc.length) ? k : l;
  for (i = 0; i < j; i++)
    if (xc[i] != yc[i])
      return xc[i] > yc[i] ^ a ? 1 : -1;
  return k == l ? 0 : k > l ^ a ? 1 : -1;
}
function intCheck(n, min2, max2, name2) {
  if (n < min2 || n > max2 || n !== mathfloor(n)) {
    throw Error(bignumberError + (name2 || "Argument") + (typeof n == "number" ? n < min2 || n > max2 ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(n));
  }
}
function isOdd(n) {
  var k = n.c.length - 1;
  return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
}
function toExponential(str, e) {
  return (str.length > 1 ? str.charAt(0) + "." + str.slice(1) : str) + (e < 0 ? "e" : "e+") + e;
}
function toFixedPoint(str, e, z) {
  var len, zs;
  if (e < 0) {
    for (zs = z + "."; ++e; zs += z)
      ;
    str = zs + str;
  } else {
    len = str.length;
    if (++e > len) {
      for (zs = z, e -= len; --e; zs += z)
        ;
      str += zs;
    } else if (e < len) {
      str = str.slice(0, e) + "." + str.slice(e);
    }
  }
  return str;
}
var BigNumber = clone();
export {
  BigNumber as B,
  Ethereum as E,
  Tezos as T,
  Wallet as W,
  commonjsRequire as a,
  TON as b,
  commonjsGlobal as c,
  dist$2 as d,
  getDefaultExportFromCjs as g,
  naclFastExports as n,
  require$$0$1 as r
};
