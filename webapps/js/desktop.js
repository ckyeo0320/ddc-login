
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";
window.jwtToken = 'Bearer ';
$.ajaxSetup({
  xhrFields: {
      withCredentials: true
    },
  headers: {'authorization': window.jwtToken}
});

require("core-js/shim");

require("regenerator-runtime/runtime");

require("core-js/fn/regexp/escape");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"core-js/fn/regexp/escape":2,"core-js/shim":324,"regenerator-runtime/runtime":325}],2:[function(require,module,exports){
require('../../modules/core.regexp.escape');
module.exports = require('../../modules/_core').RegExp.escape;

},{"../../modules/_core":23,"../../modules/core.regexp.escape":127}],3:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],4:[function(require,module,exports){
var cof = require('./_cof');
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};

},{"./_cof":18}],5:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_hide":42,"./_wks":125}],6:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],7:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":51}],8:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};

},{"./_to-absolute-index":111,"./_to-length":115,"./_to-object":116}],9:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"./_to-absolute-index":111,"./_to-length":115,"./_to-object":116}],10:[function(require,module,exports){
var forOf = require('./_for-of');

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":39}],11:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":111,"./_to-iobject":114,"./_to-length":115}],12:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx');
var IObject = require('./_iobject');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":15,"./_ctx":25,"./_iobject":47,"./_to-length":115,"./_to-object":116}],13:[function(require,module,exports){
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var toLength = require('./_to-length');

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};

},{"./_a-function":3,"./_iobject":47,"./_to-length":115,"./_to-object":116}],14:[function(require,module,exports){
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-array":49,"./_is-object":51,"./_wks":125}],15:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":14}],16:[function(require,module,exports){
'use strict';
var aFunction = require('./_a-function');
var isObject = require('./_is-object');
var invoke = require('./_invoke');
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

},{"./_a-function":3,"./_invoke":46,"./_is-object":51}],17:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":18,"./_wks":125}],18:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],19:[function(require,module,exports){
'use strict';
var dP = require('./_object-dp').f;
var create = require('./_object-create');
var redefineAll = require('./_redefine-all');
var ctx = require('./_ctx');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var $iterDefine = require('./_iter-define');
var step = require('./_iter-step');
var setSpecies = require('./_set-species');
var DESCRIPTORS = require('./_descriptors');
var fastKey = require('./_meta').fastKey;
var validate = require('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":6,"./_ctx":25,"./_descriptors":29,"./_for-of":39,"./_iter-define":55,"./_iter-step":57,"./_meta":65,"./_object-create":70,"./_object-dp":71,"./_redefine-all":90,"./_set-species":97,"./_validate-collection":122}],20:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof');
var from = require('./_array-from-iterable');
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

},{"./_array-from-iterable":10,"./_classof":17}],21:[function(require,module,exports){
'use strict';
var redefineAll = require('./_redefine-all');
var getWeak = require('./_meta').getWeak;
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var createArrayMethod = require('./_array-methods');
var $has = require('./_has');
var validate = require('./_validate-collection');
var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

},{"./_an-instance":6,"./_an-object":7,"./_array-methods":12,"./_for-of":39,"./_has":41,"./_is-object":51,"./_meta":65,"./_redefine-all":90,"./_validate-collection":122}],22:[function(require,module,exports){
'use strict';
var global = require('./_global');
var $export = require('./_export');
var redefine = require('./_redefine');
var redefineAll = require('./_redefine-all');
var meta = require('./_meta');
var forOf = require('./_for-of');
var anInstance = require('./_an-instance');
var isObject = require('./_is-object');
var fails = require('./_fails');
var $iterDetect = require('./_iter-detect');
var setToStringTag = require('./_set-to-string-tag');
var inheritIfRequired = require('./_inherit-if-required');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":6,"./_export":33,"./_fails":35,"./_for-of":39,"./_global":40,"./_inherit-if-required":45,"./_is-object":51,"./_iter-detect":56,"./_meta":65,"./_redefine":91,"./_redefine-all":90,"./_set-to-string-tag":98}],23:[function(require,module,exports){
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],24:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":71,"./_property-desc":89}],25:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":3}],26:[function(require,module,exports){
'use strict';
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var fails = require('./_fails');
var getTime = Date.prototype.getTime;
var $toISOString = Date.prototype.toISOString;

var lz = function (num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
module.exports = (fails(function () {
  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  $toISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var d = this;
  var y = d.getUTCFullYear();
  var m = d.getUTCMilliseconds();
  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
} : $toISOString;

},{"./_fails":35}],27:[function(require,module,exports){
'use strict';
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');
var NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};

},{"./_an-object":7,"./_to-primitive":117}],28:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],29:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":35}],30:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":40,"./_is-object":51}],31:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],32:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":77,"./_object-keys":80,"./_object-pie":81}],33:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":23,"./_ctx":25,"./_global":40,"./_hide":42,"./_redefine":91}],34:[function(require,module,exports){
var MATCH = require('./_wks')('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};

},{"./_wks":125}],35:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],36:[function(require,module,exports){
'use strict';
var hide = require('./_hide');
var redefine = require('./_redefine');
var fails = require('./_fails');
var defined = require('./_defined');
var wks = require('./_wks');

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

},{"./_defined":28,"./_fails":35,"./_hide":42,"./_redefine":91,"./_wks":125}],37:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"./_an-object":7}],38:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var isArray = require('./_is-array');
var isObject = require('./_is-object');
var toLength = require('./_to-length');
var ctx = require('./_ctx');
var IS_CONCAT_SPREADABLE = require('./_wks')('isConcatSpreadable');

function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
  var element, spreadable;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      spreadable = false;
      if (isObject(element)) {
        spreadable = element[IS_CONCAT_SPREADABLE];
        spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
      }

      if (spreadable && depth > 0) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1fffffffffffff) throw TypeError();
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
}

module.exports = flattenIntoArray;

},{"./_ctx":25,"./_is-array":49,"./_is-object":51,"./_to-length":115,"./_wks":125}],39:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":7,"./_ctx":25,"./_is-array-iter":48,"./_iter-call":53,"./_to-length":115,"./core.get-iterator-method":126}],40:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],41:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],42:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":29,"./_object-dp":71,"./_property-desc":89}],43:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":40}],44:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":29,"./_dom-create":30,"./_fails":35}],45:[function(require,module,exports){
var isObject = require('./_is-object');
var setPrototypeOf = require('./_set-proto').set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"./_is-object":51,"./_set-proto":96}],46:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],47:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":18}],48:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":58,"./_wks":125}],49:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":18}],50:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object');
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"./_is-object":51}],51:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],52:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object');
var cof = require('./_cof');
var MATCH = require('./_wks')('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

},{"./_cof":18,"./_is-object":51,"./_wks":125}],53:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":7}],54:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":42,"./_object-create":70,"./_property-desc":89,"./_set-to-string-tag":98,"./_wks":125}],55:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var has = require('./_has');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":33,"./_has":41,"./_hide":42,"./_iter-create":54,"./_iterators":58,"./_library":59,"./_object-gpo":78,"./_redefine":91,"./_set-to-string-tag":98,"./_wks":125}],56:[function(require,module,exports){
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":125}],57:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],58:[function(require,module,exports){
module.exports = {};

},{}],59:[function(require,module,exports){
module.exports = false;

},{}],60:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

},{}],61:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var sign = require('./_math-sign');
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

module.exports = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

},{"./_math-sign":64}],62:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

},{}],63:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
module.exports = Math.scale || function scale(x, inLow, inHigh, outLow, outHigh) {
  if (
    arguments.length === 0
      // eslint-disable-next-line no-self-compare
      || x != x
      // eslint-disable-next-line no-self-compare
      || inLow != inLow
      // eslint-disable-next-line no-self-compare
      || inHigh != inHigh
      // eslint-disable-next-line no-self-compare
      || outLow != outLow
      // eslint-disable-next-line no-self-compare
      || outHigh != outHigh
  ) return NaN;
  if (x === Infinity || x === -Infinity) return x;
  return (x - inLow) * (outHigh - outLow) / (inHigh - inLow) + outLow;
};

},{}],64:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

},{}],65:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":35,"./_has":41,"./_is-object":51,"./_object-dp":71,"./_uid":121}],66:[function(require,module,exports){
var Map = require('./es6.map');
var $export = require('./_export');
var shared = require('./_shared')('metadata');
var store = shared.store || (shared.store = new (require('./es6.weak-map'))());

var getOrCreateMetadataMap = function (target, targetKey, create) {
  var targetMetadata = store.get(target);
  if (!targetMetadata) {
    if (!create) return undefined;
    store.set(target, targetMetadata = new Map());
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if (!keyMetadata) {
    if (!create) return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map());
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function (MetadataKey, MetadataValue, O, P) {
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function (target, targetKey) {
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false);
  var keys = [];
  if (metadataMap) metadataMap.forEach(function (_, key) { keys.push(key); });
  return keys;
};
var toMetaKey = function (it) {
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function (O) {
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};

},{"./_export":33,"./_shared":100,"./es6.map":157,"./es6.weak-map":263}],67:[function(require,module,exports){
var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_cof":18,"./_global":40,"./_task":110}],68:[function(require,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":3}],69:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_fails":35,"./_iobject":47,"./_object-gops":77,"./_object-keys":80,"./_object-pie":81,"./_to-object":116}],70:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":7,"./_dom-create":30,"./_enum-bug-keys":31,"./_html":43,"./_object-dps":72,"./_shared-key":99}],71:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":7,"./_descriptors":29,"./_ie8-dom-define":44,"./_to-primitive":117}],72:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":7,"./_descriptors":29,"./_object-dp":71,"./_object-keys":80}],73:[function(require,module,exports){
'use strict';
// Forced replacement prototype accessors methods
module.exports = require('./_library') || !require('./_fails')(function () {
  var K = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call
  __defineSetter__.call(null, K, function () { /* empty */ });
  delete require('./_global')[K];
});

},{"./_fails":35,"./_global":40,"./_library":59}],74:[function(require,module,exports){
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":29,"./_has":41,"./_ie8-dom-define":44,"./_object-pie":81,"./_property-desc":89,"./_to-iobject":114,"./_to-primitive":117}],75:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":76,"./_to-iobject":114}],76:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":31,"./_object-keys-internal":79}],77:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],78:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":41,"./_shared-key":99,"./_to-object":116}],79:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":11,"./_has":41,"./_shared-key":99,"./_to-iobject":114}],80:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":31,"./_object-keys-internal":79}],81:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],82:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_core":23,"./_export":33,"./_fails":35}],83:[function(require,module,exports){
var getKeys = require('./_object-keys');
var toIObject = require('./_to-iobject');
var isEnum = require('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

},{"./_object-keys":80,"./_object-pie":81,"./_to-iobject":114}],84:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var gOPN = require('./_object-gopn');
var gOPS = require('./_object-gops');
var anObject = require('./_an-object');
var Reflect = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

},{"./_an-object":7,"./_global":40,"./_object-gopn":76,"./_object-gops":77}],85:[function(require,module,exports){
var $parseFloat = require('./_global').parseFloat;
var $trim = require('./_string-trim').trim;

module.exports = 1 / $parseFloat(require('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

},{"./_global":40,"./_string-trim":108,"./_string-ws":109}],86:[function(require,module,exports){
var $parseInt = require('./_global').parseInt;
var $trim = require('./_string-trim').trim;
var ws = require('./_string-ws');
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

},{"./_global":40,"./_string-trim":108,"./_string-ws":109}],87:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],88:[function(require,module,exports){
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":7,"./_is-object":51,"./_new-promise-capability":68}],89:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],90:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":91}],91:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":23,"./_global":40,"./_has":41,"./_hide":42,"./_uid":121}],92:[function(require,module,exports){
module.exports = function (regExp, replace) {
  var replacer = replace === Object(replace) ? function (part) {
    return replace[part];
  } : replace;
  return function (it) {
    return String(it).replace(regExp, replacer);
  };
};

},{}],93:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

},{}],94:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');
var aFunction = require('./_a-function');
var ctx = require('./_ctx');
var forOf = require('./_for-of');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};

},{"./_a-function":3,"./_ctx":25,"./_export":33,"./_for-of":39}],95:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};

},{"./_export":33}],96:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object');
var anObject = require('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_an-object":7,"./_ctx":25,"./_is-object":51,"./_object-gopd":74}],97:[function(require,module,exports){
'use strict';
var global = require('./_global');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_descriptors":29,"./_global":40,"./_object-dp":71,"./_wks":125}],98:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":41,"./_object-dp":71,"./_wks":125}],99:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":100,"./_uid":121}],100:[function(require,module,exports){
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":40}],101:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":3,"./_an-object":7,"./_wks":125}],102:[function(require,module,exports){
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":35}],103:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":28,"./_to-integer":113}],104:[function(require,module,exports){
// helper for String{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp');
var defined = require('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

},{"./_defined":28,"./_is-regexp":52}],105:[function(require,module,exports){
var $export = require('./_export');
var fails = require('./_fails');
var defined = require('./_defined');
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

},{"./_defined":28,"./_export":33,"./_fails":35}],106:[function(require,module,exports){
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length');
var repeat = require('./_string-repeat');
var defined = require('./_defined');

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

},{"./_defined":28,"./_string-repeat":107,"./_to-length":115}],107:[function(require,module,exports){
'use strict';
var toInteger = require('./_to-integer');
var defined = require('./_defined');

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};

},{"./_defined":28,"./_to-integer":113}],108:[function(require,module,exports){
var $export = require('./_export');
var defined = require('./_defined');
var fails = require('./_fails');
var spaces = require('./_string-ws');
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

},{"./_defined":28,"./_export":33,"./_fails":35,"./_string-ws":109}],109:[function(require,module,exports){
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],110:[function(require,module,exports){
var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":18,"./_ctx":25,"./_dom-create":30,"./_global":40,"./_html":43,"./_invoke":46}],111:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":113}],112:[function(require,module,exports){
// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};

},{"./_to-integer":113,"./_to-length":115}],113:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],114:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":28,"./_iobject":47}],115:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":113}],116:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":28}],117:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":51}],118:[function(require,module,exports){
'use strict';
if (require('./_descriptors')) {
  var LIBRARY = require('./_library');
  var global = require('./_global');
  var fails = require('./_fails');
  var $export = require('./_export');
  var $typed = require('./_typed');
  var $buffer = require('./_typed-buffer');
  var ctx = require('./_ctx');
  var anInstance = require('./_an-instance');
  var propertyDesc = require('./_property-desc');
  var hide = require('./_hide');
  var redefineAll = require('./_redefine-all');
  var toInteger = require('./_to-integer');
  var toLength = require('./_to-length');
  var toIndex = require('./_to-index');
  var toAbsoluteIndex = require('./_to-absolute-index');
  var toPrimitive = require('./_to-primitive');
  var has = require('./_has');
  var classof = require('./_classof');
  var isObject = require('./_is-object');
  var toObject = require('./_to-object');
  var isArrayIter = require('./_is-array-iter');
  var create = require('./_object-create');
  var getPrototypeOf = require('./_object-gpo');
  var gOPN = require('./_object-gopn').f;
  var getIterFn = require('./core.get-iterator-method');
  var uid = require('./_uid');
  var wks = require('./_wks');
  var createArrayMethod = require('./_array-methods');
  var createArrayIncludes = require('./_array-includes');
  var speciesConstructor = require('./_species-constructor');
  var ArrayIterators = require('./es6.array.iterator');
  var Iterators = require('./_iterators');
  var $iterDetect = require('./_iter-detect');
  var setSpecies = require('./_set-species');
  var arrayFill = require('./_array-fill');
  var arrayCopyWithin = require('./_array-copy-within');
  var $DP = require('./_object-dp');
  var $GOPD = require('./_object-gopd');
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };

},{"./_an-instance":6,"./_array-copy-within":8,"./_array-fill":9,"./_array-includes":11,"./_array-methods":12,"./_classof":17,"./_ctx":25,"./_descriptors":29,"./_export":33,"./_fails":35,"./_global":40,"./_has":41,"./_hide":42,"./_is-array-iter":48,"./_is-object":51,"./_iter-detect":56,"./_iterators":58,"./_library":59,"./_object-create":70,"./_object-dp":71,"./_object-gopd":74,"./_object-gopn":76,"./_object-gpo":78,"./_property-desc":89,"./_redefine-all":90,"./_set-species":97,"./_species-constructor":101,"./_to-absolute-index":111,"./_to-index":112,"./_to-integer":113,"./_to-length":115,"./_to-object":116,"./_to-primitive":117,"./_typed":120,"./_typed-buffer":119,"./_uid":121,"./_wks":125,"./core.get-iterator-method":126,"./es6.array.iterator":138}],119:[function(require,module,exports){
'use strict';
var global = require('./_global');
var DESCRIPTORS = require('./_descriptors');
var LIBRARY = require('./_library');
var $typed = require('./_typed');
var hide = require('./_hide');
var redefineAll = require('./_redefine-all');
var fails = require('./_fails');
var anInstance = require('./_an-instance');
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
var toIndex = require('./_to-index');
var gOPN = require('./_object-gopn').f;
var dP = require('./_object-dp').f;
var arrayFill = require('./_array-fill');
var setToStringTag = require('./_set-to-string-tag');
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

},{"./_an-instance":6,"./_array-fill":9,"./_descriptors":29,"./_fails":35,"./_global":40,"./_hide":42,"./_library":59,"./_object-dp":71,"./_object-gopn":76,"./_redefine-all":90,"./_set-to-string-tag":98,"./_to-index":112,"./_to-integer":113,"./_to-length":115,"./_typed":120}],120:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var uid = require('./_uid');
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};

},{"./_global":40,"./_hide":42,"./_uid":121}],121:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],122:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":51}],123:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":23,"./_global":40,"./_library":59,"./_object-dp":71,"./_wks-ext":124}],124:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":125}],125:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":40,"./_shared":100,"./_uid":121}],126:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":17,"./_core":23,"./_iterators":58,"./_wks":125}],127:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $export = require('./_export');
var $re = require('./_replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', { escape: function escape(it) { return $re(it); } });

},{"./_export":33,"./_replacer":92}],128:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { copyWithin: require('./_array-copy-within') });

require('./_add-to-unscopables')('copyWithin');

},{"./_add-to-unscopables":5,"./_array-copy-within":8,"./_export":33}],129:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $every = require('./_array-methods')(4);

$export($export.P + $export.F * !require('./_strict-method')([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":12,"./_export":33,"./_strict-method":102}],130:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { fill: require('./_array-fill') });

require('./_add-to-unscopables')('fill');

},{"./_add-to-unscopables":5,"./_array-fill":9,"./_export":33}],131:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":12,"./_export":33,"./_strict-method":102}],132:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":5,"./_array-methods":12,"./_export":33}],133:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":5,"./_array-methods":12,"./_export":33}],134:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $forEach = require('./_array-methods')(0);
var STRICT = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":12,"./_export":33,"./_strict-method":102}],135:[function(require,module,exports){
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":24,"./_ctx":25,"./_export":33,"./_is-array-iter":48,"./_iter-call":53,"./_iter-detect":56,"./_to-length":115,"./_to-object":116,"./core.get-iterator-method":126}],136:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $indexOf = require('./_array-includes')(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

},{"./_array-includes":11,"./_export":33,"./_strict-method":102}],137:[function(require,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', { isArray: require('./_is-array') });

},{"./_export":33,"./_is-array":49}],138:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":5,"./_iter-define":55,"./_iter-step":57,"./_iterators":58,"./_to-iobject":114}],139:[function(require,module,exports){
'use strict';
// 22.1.3.13 Array.prototype.join(separator)
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (require('./_iobject') != Object || !require('./_strict-method')(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});

},{"./_export":33,"./_iobject":47,"./_strict-method":102,"./_to-iobject":114}],140:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
var $native = [].lastIndexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
    return -1;
  }
});

},{"./_export":33,"./_strict-method":102,"./_to-integer":113,"./_to-iobject":114,"./_to-length":115}],141:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $map = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":12,"./_export":33,"./_strict-method":102}],142:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var createProperty = require('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});

},{"./_create-property":24,"./_export":33,"./_fails":35}],143:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});

},{"./_array-reduce":13,"./_export":33,"./_strict-method":102}],144:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

},{"./_array-reduce":13,"./_export":33,"./_strict-method":102}],145:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var html = require('./_html');
var cof = require('./_cof');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * require('./_fails')(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = Array(size);
    var i = 0;
    for (; i < size; i++) cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});

},{"./_cof":18,"./_export":33,"./_fails":35,"./_html":43,"./_to-absolute-index":111,"./_to-length":115}],146:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $some = require('./_array-methods')(3);

$export($export.P + $export.F * !require('./_strict-method')([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":12,"./_export":33,"./_strict-method":102}],147:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var fails = require('./_fails');
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});

},{"./_a-function":3,"./_export":33,"./_fails":35,"./_strict-method":102,"./_to-object":116}],148:[function(require,module,exports){
require('./_set-species')('Array');

},{"./_set-species":97}],149:[function(require,module,exports){
// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = require('./_export');

$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });

},{"./_export":33}],150:[function(require,module,exports){
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = require('./_export');
var toISOString = require('./_date-to-iso-string');

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
  toISOString: toISOString
});

},{"./_date-to-iso-string":26,"./_export":33}],151:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');

$export($export.P + $export.F * require('./_fails')(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
}), 'Date', {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

},{"./_export":33,"./_fails":35,"./_to-object":116,"./_to-primitive":117}],152:[function(require,module,exports){
var TO_PRIMITIVE = require('./_wks')('toPrimitive');
var proto = Date.prototype;

if (!(TO_PRIMITIVE in proto)) require('./_hide')(proto, TO_PRIMITIVE, require('./_date-to-primitive'));

},{"./_date-to-primitive":27,"./_hide":42,"./_wks":125}],153:[function(require,module,exports){
var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  require('./_redefine')(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

},{"./_redefine":91}],154:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', { bind: require('./_bind') });

},{"./_bind":16,"./_export":33}],155:[function(require,module,exports){
'use strict';
var isObject = require('./_is-object');
var getPrototypeOf = require('./_object-gpo');
var HAS_INSTANCE = require('./_wks')('hasInstance');
var FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if (!(HAS_INSTANCE in FunctionProto)) require('./_object-dp').f(FunctionProto, HAS_INSTANCE, { value: function (O) {
  if (typeof this != 'function' || !isObject(O)) return false;
  if (!isObject(this.prototype)) return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
  return false;
} });

},{"./_is-object":51,"./_object-dp":71,"./_object-gpo":78,"./_wks":125}],156:[function(require,module,exports){
var dP = require('./_object-dp').f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

},{"./_descriptors":29,"./_object-dp":71}],157:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = require('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":22,"./_collection-strong":19,"./_validate-collection":122}],158:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./_export');
var log1p = require('./_math-log1p');
var sqrt = Math.sqrt;
var $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

},{"./_export":33,"./_math-log1p":62}],159:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./_export');
var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });

},{"./_export":33}],160:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./_export');
var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

},{"./_export":33}],161:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export');
var sign = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

},{"./_export":33,"./_math-sign":64}],162:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

},{"./_export":33}],163:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./_export');
var exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

},{"./_export":33}],164:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./_export');
var $expm1 = require('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });

},{"./_export":33,"./_math-expm1":60}],165:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export = require('./_export');

$export($export.S, 'Math', { fround: require('./_math-fround') });

},{"./_export":33,"./_math-fround":61}],166:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, â€¦ ]]])
var $export = require('./_export');
var abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

},{"./_export":33}],167:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export');
var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

},{"./_export":33,"./_fails":35}],168:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});

},{"./_export":33}],169:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', { log1p: require('./_math-log1p') });

},{"./_export":33,"./_math-log1p":62}],170:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});

},{"./_export":33}],171:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', { sign: require('./_math-sign') });

},{"./_export":33,"./_math-sign":64}],172:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

},{"./_export":33,"./_fails":35,"./_math-expm1":60}],173:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

},{"./_export":33,"./_math-expm1":60}],174:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

},{"./_export":33}],175:[function(require,module,exports){
'use strict';
var global = require('./_global');
var has = require('./_has');
var cof = require('./_cof');
var inheritIfRequired = require('./_inherit-if-required');
var toPrimitive = require('./_to-primitive');
var fails = require('./_fails');
var gOPN = require('./_object-gopn').f;
var gOPD = require('./_object-gopd').f;
var dP = require('./_object-dp').f;
var $trim = require('./_string-trim').trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(require('./_object-create')(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = require('./_descriptors') ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./_redefine')(global, NUMBER, $Number);
}

},{"./_cof":18,"./_descriptors":29,"./_fails":35,"./_global":40,"./_has":41,"./_inherit-if-required":45,"./_object-create":70,"./_object-dp":71,"./_object-gopd":74,"./_object-gopn":76,"./_redefine":91,"./_string-trim":108,"./_to-primitive":117}],176:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });

},{"./_export":33}],177:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export = require('./_export');
var _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

},{"./_export":33,"./_global":40}],178:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', { isInteger: require('./_is-integer') });

},{"./_export":33,"./_is-integer":50}],179:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

},{"./_export":33}],180:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export = require('./_export');
var isInteger = require('./_is-integer');
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

},{"./_export":33,"./_is-integer":50}],181:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

},{"./_export":33}],182:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

},{"./_export":33}],183:[function(require,module,exports){
var $export = require('./_export');
var $parseFloat = require('./_parse-float');
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });

},{"./_export":33,"./_parse-float":85}],184:[function(require,module,exports){
var $export = require('./_export');
var $parseInt = require('./_parse-int');
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });

},{"./_export":33,"./_parse-int":86}],185:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toInteger = require('./_to-integer');
var aNumberValue = require('./_a-number-value');
var repeat = require('./_string-repeat');
var $toFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function (n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function (n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function () {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !require('./_fails')(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});

},{"./_a-number-value":4,"./_export":33,"./_fails":35,"./_string-repeat":107,"./_to-integer":113}],186:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $fails = require('./_fails');
var aNumberValue = require('./_a-number-value');
var $toPrecision = 1.0.toPrecision;

$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});

},{"./_a-number-value":4,"./_export":33,"./_fails":35}],187:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":33,"./_object-assign":69}],188:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":33,"./_object-create":70}],189:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperties: require('./_object-dps') });

},{"./_descriptors":29,"./_export":33,"./_object-dps":72}],190:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":29,"./_export":33,"./_object-dp":71}],191:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

},{"./_is-object":51,"./_meta":65,"./_object-sap":82}],192:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./_to-iobject');
var $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

},{"./_object-gopd":74,"./_object-sap":82,"./_to-iobject":114}],193:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function () {
  return require('./_object-gopn-ext').f;
});

},{"./_object-gopn-ext":75,"./_object-sap":82}],194:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./_to-object');
var $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

},{"./_object-gpo":78,"./_object-sap":82,"./_to-object":116}],195:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./_is-object');

require('./_object-sap')('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

},{"./_is-object":51,"./_object-sap":82}],196:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./_is-object');

require('./_object-sap')('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

},{"./_is-object":51,"./_object-sap":82}],197:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./_is-object');

require('./_object-sap')('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

},{"./_is-object":51,"./_object-sap":82}],198:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', { is: require('./_same-value') });

},{"./_export":33,"./_same-value":93}],199:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":80,"./_object-sap":82,"./_to-object":116}],200:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

},{"./_is-object":51,"./_meta":65,"./_object-sap":82}],201:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

},{"./_is-object":51,"./_meta":65,"./_object-sap":82}],202:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":33,"./_set-proto":96}],203:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./_classof');
var test = {};
test[require('./_wks')('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  require('./_redefine')(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}

},{"./_classof":17,"./_redefine":91,"./_wks":125}],204:[function(require,module,exports){
var $export = require('./_export');
var $parseFloat = require('./_parse-float');
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });

},{"./_export":33,"./_parse-float":85}],205:[function(require,module,exports){
var $export = require('./_export');
var $parseInt = require('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });

},{"./_export":33,"./_parse-int":86}],206:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c;
  var i = 0;
  var reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  } return true;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":3,"./_an-instance":6,"./_classof":17,"./_core":23,"./_ctx":25,"./_export":33,"./_for-of":39,"./_global":40,"./_is-object":51,"./_iter-detect":56,"./_library":59,"./_microtask":67,"./_new-promise-capability":68,"./_perform":87,"./_promise-resolve":88,"./_redefine-all":90,"./_set-species":97,"./_set-to-string-tag":98,"./_species-constructor":101,"./_task":110,"./_wks":125}],207:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = require('./_export');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var rApply = (require('./_global').Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !require('./_fails')(function () {
  rApply(function () { /* empty */ });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target);
    var L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

},{"./_a-function":3,"./_an-object":7,"./_export":33,"./_fails":35,"./_global":40}],208:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = require('./_export');
var create = require('./_object-create');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var fails = require('./_fails');
var bind = require('./_bind');
var rConstruct = (require('./_global').Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () { /* empty */ });
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

},{"./_a-function":3,"./_an-object":7,"./_bind":16,"./_export":33,"./_fails":35,"./_global":40,"./_is-object":51,"./_object-create":70}],209:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = require('./_object-dp');
var $export = require('./_export');
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":7,"./_export":33,"./_fails":35,"./_object-dp":71,"./_to-primitive":117}],210:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = require('./_export');
var gOPD = require('./_object-gopd').f;
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

},{"./_an-object":7,"./_export":33,"./_object-gopd":74}],211:[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var Enumerate = function (iterated) {
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = [];      // keys
  var key;
  for (key in iterated) keys.push(key);
};
require('./_iter-create')(Enumerate, 'Object', function () {
  var that = this;
  var keys = that._k;
  var key;
  do {
    if (that._i >= keys.length) return { value: undefined, done: true };
  } while (!((key = keys[that._i++]) in that._t));
  return { value: key, done: false };
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target) {
    return new Enumerate(target);
  }
});

},{"./_an-object":7,"./_export":33,"./_iter-create":54}],212:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = require('./_object-gopd');
var $export = require('./_export');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});

},{"./_an-object":7,"./_export":33,"./_object-gopd":74}],213:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export = require('./_export');
var getProto = require('./_object-gpo');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});

},{"./_an-object":7,"./_export":33,"./_object-gpo":78}],214:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var isObject = require('./_is-object');
var anObject = require('./_an-object');

function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });

},{"./_an-object":7,"./_export":33,"./_has":41,"./_is-object":51,"./_object-gopd":74,"./_object-gpo":78}],215:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

},{"./_export":33}],216:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

},{"./_an-object":7,"./_export":33}],217:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', { ownKeys: require('./_own-keys') });

},{"./_export":33,"./_own-keys":84}],218:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":7,"./_export":33}],219:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = require('./_export');
var setProto = require('./_set-proto');

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_export":33,"./_set-proto":96}],220:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = require('./_object-dp');
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var createDesc = require('./_property-desc');
var anObject = require('./_an-object');
var isObject = require('./_is-object');

function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = gOPD.f(anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });

},{"./_an-object":7,"./_export":33,"./_has":41,"./_is-object":51,"./_object-dp":71,"./_object-gopd":74,"./_object-gpo":78,"./_property-desc":89}],221:[function(require,module,exports){
var global = require('./_global');
var inheritIfRequired = require('./_inherit-if-required');
var dP = require('./_object-dp').f;
var gOPN = require('./_object-gopn').f;
var isRegExp = require('./_is-regexp');
var $flags = require('./_flags');
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (require('./_descriptors') && (!CORRECT_NEW || require('./_fails')(function () {
  re2[require('./_wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./_redefine')(global, 'RegExp', $RegExp);
}

require('./_set-species')('RegExp');

},{"./_descriptors":29,"./_fails":35,"./_flags":37,"./_global":40,"./_inherit-if-required":45,"./_is-regexp":52,"./_object-dp":71,"./_object-gopn":76,"./_redefine":91,"./_set-species":97,"./_wks":125}],222:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});

},{"./_descriptors":29,"./_flags":37,"./_object-dp":71}],223:[function(require,module,exports){
// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

},{"./_fix-re-wks":36}],224:[function(require,module,exports){
// @@replace logic
require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

},{"./_fix-re-wks":36}],225:[function(require,module,exports){
// @@search logic
require('./_fix-re-wks')('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});

},{"./_fix-re-wks":36}],226:[function(require,module,exports){
// @@split logic
require('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split) {
  'use strict';
  var isRegExp = require('./_is-regexp');
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

},{"./_fix-re-wks":36,"./_is-regexp":52}],227:[function(require,module,exports){
'use strict';
require('./es6.regexp.flags');
var anObject = require('./_an-object');
var $flags = require('./_flags');
var DESCRIPTORS = require('./_descriptors');
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (require('./_fails')(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}

},{"./_an-object":7,"./_descriptors":29,"./_fails":35,"./_flags":37,"./_redefine":91,"./es6.regexp.flags":222}],228:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = require('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":22,"./_collection-strong":19,"./_validate-collection":122}],229:[function(require,module,exports){
'use strict';
// B.2.3.2 String.prototype.anchor(name)
require('./_string-html')('anchor', function (createHTML) {
  return function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  };
});

},{"./_string-html":105}],230:[function(require,module,exports){
'use strict';
// B.2.3.3 String.prototype.big()
require('./_string-html')('big', function (createHTML) {
  return function big() {
    return createHTML(this, 'big', '', '');
  };
});

},{"./_string-html":105}],231:[function(require,module,exports){
'use strict';
// B.2.3.4 String.prototype.blink()
require('./_string-html')('blink', function (createHTML) {
  return function blink() {
    return createHTML(this, 'blink', '', '');
  };
});

},{"./_string-html":105}],232:[function(require,module,exports){
'use strict';
// B.2.3.5 String.prototype.bold()
require('./_string-html')('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});

},{"./_string-html":105}],233:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $at = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});

},{"./_export":33,"./_string-at":103}],234:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

},{"./_export":33,"./_fails-is-regexp":34,"./_string-context":104,"./_to-length":115}],235:[function(require,module,exports){
'use strict';
// B.2.3.6 String.prototype.fixed()
require('./_string-html')('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});

},{"./_string-html":105}],236:[function(require,module,exports){
'use strict';
// B.2.3.7 String.prototype.fontcolor(color)
require('./_string-html')('fontcolor', function (createHTML) {
  return function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  };
});

},{"./_string-html":105}],237:[function(require,module,exports){
'use strict';
// B.2.3.8 String.prototype.fontsize(size)
require('./_string-html')('fontsize', function (createHTML) {
  return function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  };
});

},{"./_string-html":105}],238:[function(require,module,exports){
var $export = require('./_export');
var toAbsoluteIndex = require('./_to-absolute-index');
var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});

},{"./_export":33,"./_to-absolute-index":111}],239:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export = require('./_export');
var context = require('./_string-context');
var INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"./_export":33,"./_fails-is-regexp":34,"./_string-context":104}],240:[function(require,module,exports){
'use strict';
// B.2.3.9 String.prototype.italics()
require('./_string-html')('italics', function (createHTML) {
  return function italics() {
    return createHTML(this, 'i', '', '');
  };
});

},{"./_string-html":105}],241:[function(require,module,exports){
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":55,"./_string-at":103}],242:[function(require,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});

},{"./_string-html":105}],243:[function(require,module,exports){
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    } return res.join('');
  }
});

},{"./_export":33,"./_to-iobject":114,"./_to-length":115}],244:[function(require,module,exports){
var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});

},{"./_export":33,"./_string-repeat":107}],245:[function(require,module,exports){
'use strict';
// B.2.3.11 String.prototype.small()
require('./_string-html')('small', function (createHTML) {
  return function small() {
    return createHTML(this, 'small', '', '');
  };
});

},{"./_string-html":105}],246:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

},{"./_export":33,"./_fails-is-regexp":34,"./_string-context":104,"./_to-length":115}],247:[function(require,module,exports){
'use strict';
// B.2.3.12 String.prototype.strike()
require('./_string-html')('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});

},{"./_string-html":105}],248:[function(require,module,exports){
'use strict';
// B.2.3.13 String.prototype.sub()
require('./_string-html')('sub', function (createHTML) {
  return function sub() {
    return createHTML(this, 'sub', '', '');
  };
});

},{"./_string-html":105}],249:[function(require,module,exports){
'use strict';
// B.2.3.14 String.prototype.sup()
require('./_string-html')('sup', function (createHTML) {
  return function sup() {
    return createHTML(this, 'sup', '', '');
  };
});

},{"./_string-html":105}],250:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./_string-trim')('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});

},{"./_string-trim":108}],251:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !isArray(replacer)) replacer = function (key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":7,"./_descriptors":29,"./_enum-keys":32,"./_export":33,"./_fails":35,"./_global":40,"./_has":41,"./_hide":42,"./_is-array":49,"./_library":59,"./_meta":65,"./_object-create":70,"./_object-dp":71,"./_object-gopd":74,"./_object-gopn":76,"./_object-gopn-ext":75,"./_object-gops":77,"./_object-keys":80,"./_object-pie":81,"./_property-desc":89,"./_redefine":91,"./_set-to-string-tag":98,"./_shared":100,"./_to-iobject":114,"./_to-primitive":117,"./_uid":121,"./_wks":125,"./_wks-define":123,"./_wks-ext":124}],252:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $typed = require('./_typed');
var buffer = require('./_typed-buffer');
var anObject = require('./_an-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
var isObject = require('./_is-object');
var ArrayBuffer = require('./_global').ArrayBuffer;
var speciesConstructor = require('./_species-constructor');
var $ArrayBuffer = buffer.ArrayBuffer;
var $DataView = buffer.DataView;
var $isView = $typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = $typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, len);
    var final = toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < final) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);

},{"./_an-object":7,"./_export":33,"./_fails":35,"./_global":40,"./_is-object":51,"./_set-species":97,"./_species-constructor":101,"./_to-absolute-index":111,"./_to-length":115,"./_typed":120,"./_typed-buffer":119}],253:[function(require,module,exports){
var $export = require('./_export');
$export($export.G + $export.W + $export.F * !require('./_typed').ABV, {
  DataView: require('./_typed-buffer').DataView
});

},{"./_export":33,"./_typed":120,"./_typed-buffer":119}],254:[function(require,module,exports){
require('./_typed-array')('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":118}],255:[function(require,module,exports){
require('./_typed-array')('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":118}],256:[function(require,module,exports){
require('./_typed-array')('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":118}],257:[function(require,module,exports){
require('./_typed-array')('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":118}],258:[function(require,module,exports){
require('./_typed-array')('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":118}],259:[function(require,module,exports){
require('./_typed-array')('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":118}],260:[function(require,module,exports){
require('./_typed-array')('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":118}],261:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":118}],262:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

},{"./_typed-array":118}],263:[function(require,module,exports){
'use strict';
var each = require('./_array-methods')(0);
var redefine = require('./_redefine');
var meta = require('./_meta');
var assign = require('./_object-assign');
var weak = require('./_collection-weak');
var isObject = require('./_is-object');
var fails = require('./_fails');
var validate = require('./_validate-collection');
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var tmp = {};
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')(WEAK_MAP, wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (fails(function () { return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7; })) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}

},{"./_array-methods":12,"./_collection":22,"./_collection-weak":21,"./_fails":35,"./_is-object":51,"./_meta":65,"./_object-assign":69,"./_redefine":91,"./_validate-collection":122}],264:[function(require,module,exports){
'use strict';
var weak = require('./_collection-weak');
var validate = require('./_validate-collection');
var WEAK_SET = 'WeakSet';

// 23.4 WeakSet Objects
require('./_collection')(WEAK_SET, function (get) {
  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(validate(this, WEAK_SET), value, true);
  }
}, weak, false, true);

},{"./_collection":22,"./_collection-weak":21,"./_validate-collection":122}],265:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
var $export = require('./_export');
var flattenIntoArray = require('./_flatten-into-array');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var aFunction = require('./_a-function');
var arraySpeciesCreate = require('./_array-species-create');

$export($export.P, 'Array', {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen, A;
    aFunction(callbackfn);
    sourceLen = toLength(O.length);
    A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
    return A;
  }
});

require('./_add-to-unscopables')('flatMap');

},{"./_a-function":3,"./_add-to-unscopables":5,"./_array-species-create":15,"./_export":33,"./_flatten-into-array":38,"./_to-length":115,"./_to-object":116}],266:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatten
var $export = require('./_export');
var flattenIntoArray = require('./_flatten-into-array');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var toInteger = require('./_to-integer');
var arraySpeciesCreate = require('./_array-species-create');

$export($export.P, 'Array', {
  flatten: function flatten(/* depthArg = 1 */) {
    var depthArg = arguments[0];
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
    return A;
  }
});

require('./_add-to-unscopables')('flatten');

},{"./_add-to-unscopables":5,"./_array-species-create":15,"./_export":33,"./_flatten-into-array":38,"./_to-integer":113,"./_to-length":115,"./_to-object":116}],267:[function(require,module,exports){
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export = require('./_export');
var $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');

},{"./_add-to-unscopables":5,"./_array-includes":11,"./_export":33}],268:[function(require,module,exports){
// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export = require('./_export');
var microtask = require('./_microtask')();
var process = require('./_global').process;
var isNode = require('./_cof')(process) == 'process';

$export($export.G, {
  asap: function asap(fn) {
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

},{"./_cof":18,"./_export":33,"./_global":40,"./_microtask":67}],269:[function(require,module,exports){
// https://github.com/ljharb/proposal-is-error
var $export = require('./_export');
var cof = require('./_cof');

$export($export.S, 'Error', {
  isError: function isError(it) {
    return cof(it) === 'Error';
  }
});

},{"./_cof":18,"./_export":33}],270:[function(require,module,exports){
// https://github.com/tc39/proposal-global
var $export = require('./_export');

$export($export.G, { global: require('./_global') });

},{"./_export":33,"./_global":40}],271:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
require('./_set-collection-from')('Map');

},{"./_set-collection-from":94}],272:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
require('./_set-collection-of')('Map');

},{"./_set-collection-of":95}],273:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Map', { toJSON: require('./_collection-to-json')('Map') });

},{"./_collection-to-json":20,"./_export":33}],274:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', {
  clamp: function clamp(x, lower, upper) {
    return Math.min(upper, Math.max(lower, x));
  }
});

},{"./_export":33}],275:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', { DEG_PER_RAD: Math.PI / 180 });

},{"./_export":33}],276:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');
var RAD_PER_DEG = 180 / Math.PI;

$export($export.S, 'Math', {
  degrees: function degrees(radians) {
    return radians * RAD_PER_DEG;
  }
});

},{"./_export":33}],277:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');
var scale = require('./_math-scale');
var fround = require('./_math-fround');

$export($export.S, 'Math', {
  fscale: function fscale(x, inLow, inHigh, outLow, outHigh) {
    return fround(scale(x, inLow, inHigh, outLow, outHigh));
  }
});

},{"./_export":33,"./_math-fround":61,"./_math-scale":63}],278:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});

},{"./_export":33}],279:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  imulh: function imulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >> 16;
    var v1 = $v >> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});

},{"./_export":33}],280:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});

},{"./_export":33}],281:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', { RAD_PER_DEG: 180 / Math.PI });

},{"./_export":33}],282:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');
var DEG_PER_RAD = Math.PI / 180;

$export($export.S, 'Math', {
  radians: function radians(degrees) {
    return degrees * DEG_PER_RAD;
  }
});

},{"./_export":33}],283:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', { scale: require('./_math-scale') });

},{"./_export":33,"./_math-scale":63}],284:[function(require,module,exports){
// http://jfbastien.github.io/papers/Math.signbit.html
var $export = require('./_export');

$export($export.S, 'Math', { signbit: function signbit(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) != x ? x : x == 0 ? 1 / x == Infinity : x > 0;
} });

},{"./_export":33}],285:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  umulh: function umulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >>> 16;
    var v1 = $v >>> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});

},{"./_export":33}],286:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var aFunction = require('./_a-function');
var $defineProperty = require('./_object-dp');

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter) {
    $defineProperty.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
  }
});

},{"./_a-function":3,"./_descriptors":29,"./_export":33,"./_object-dp":71,"./_object-forced-pam":73,"./_to-object":116}],287:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var aFunction = require('./_a-function');
var $defineProperty = require('./_object-dp');

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter) {
    $defineProperty.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
  }
});

},{"./_a-function":3,"./_descriptors":29,"./_export":33,"./_object-dp":71,"./_object-forced-pam":73,"./_to-object":116}],288:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

},{"./_export":33,"./_object-to-array":83}],289:[function(require,module,exports){
// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = require('./_export');
var ownKeys = require('./_own-keys');
var toIObject = require('./_to-iobject');
var gOPD = require('./_object-gopd');
var createProperty = require('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});

},{"./_create-property":24,"./_export":33,"./_object-gopd":74,"./_own-keys":84,"./_to-iobject":114}],290:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');
var getPrototypeOf = require('./_object-gpo');
var getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupGetter__: function __lookupGetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.get;
    } while (O = getPrototypeOf(O));
  }
});

},{"./_descriptors":29,"./_export":33,"./_object-forced-pam":73,"./_object-gopd":74,"./_object-gpo":78,"./_to-object":116,"./_to-primitive":117}],291:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');
var getPrototypeOf = require('./_object-gpo');
var getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupSetter__: function __lookupSetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.set;
    } while (O = getPrototypeOf(O));
  }
});

},{"./_descriptors":29,"./_export":33,"./_object-forced-pam":73,"./_object-gopd":74,"./_object-gpo":78,"./_to-object":116,"./_to-primitive":117}],292:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

},{"./_export":33,"./_object-to-array":83}],293:[function(require,module,exports){
'use strict';
// https://github.com/zenparsing/es-observable
var $export = require('./_export');
var global = require('./_global');
var core = require('./_core');
var microtask = require('./_microtask')();
var OBSERVABLE = require('./_wks')('observable');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var anInstance = require('./_an-instance');
var redefineAll = require('./_redefine-all');
var hide = require('./_hide');
var forOf = require('./_for-of');
var RETURN = forOf.RETURN;

var getMethod = function (fn) {
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function (subscription) {
  var cleanup = subscription._c;
  if (cleanup) {
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function (subscription) {
  return subscription._o === undefined;
};

var closeSubscription = function (subscription) {
  if (!subscriptionClosed(subscription)) {
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function (observer, subscriber) {
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup = subscriber(observer);
    var subscription = cleanup;
    if (cleanup != null) {
      if (typeof cleanup.unsubscribe === 'function') cleanup = function () { subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch (e) {
    observer.error(e);
    return;
  } if (subscriptionClosed(this)) cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe() { closeSubscription(this); }
});

var SubscriptionObserver = function (subscription) {
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if (m) return m.call(observer, value);
      } catch (e) {
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value) {
    var subscription = this._s;
    if (subscriptionClosed(subscription)) throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if (!m) throw value;
      value = m.call(observer, value);
    } catch (e) {
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch (e) {
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber) {
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer) {
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn) {
    var that = this;
    return new (core.Promise || global.Promise)(function (resolve, reject) {
      aFunction(fn);
      var subscription = that.subscribe({
        next: function (value) {
          try {
            return fn(value);
          } catch (e) {
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x) {
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if (method) {
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function (observer) {
        return observable.subscribe(observer);
      });
    }
    return new C(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          try {
            if (forOf(x, false, function (it) {
              observer.next(it);
              if (done) return RETURN;
            }) === RETURN) return;
          } catch (e) {
            if (done) throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  },
  of: function of() {
    for (var i = 0, l = arguments.length, items = Array(l); i < l;) items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          for (var j = 0; j < items.length; ++j) {
            observer.next(items[j]);
            if (done) return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function () { return this; });

$export($export.G, { Observable: $Observable });

require('./_set-species')('Observable');

},{"./_a-function":3,"./_an-instance":6,"./_an-object":7,"./_core":23,"./_export":33,"./_for-of":39,"./_global":40,"./_hide":42,"./_microtask":67,"./_redefine-all":90,"./_set-species":97,"./_wks":125}],294:[function(require,module,exports){
// https://github.com/tc39/proposal-promise-finally
'use strict';
var $export = require('./_export');
var core = require('./_core');
var global = require('./_global');
var speciesConstructor = require('./_species-constructor');
var promiseResolve = require('./_promise-resolve');

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

},{"./_core":23,"./_export":33,"./_global":40,"./_promise-resolve":88,"./_species-constructor":101}],295:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-promise-try
var $export = require('./_export');
var newPromiseCapability = require('./_new-promise-capability');
var perform = require('./_perform');

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

},{"./_export":33,"./_new-promise-capability":68,"./_perform":87}],296:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var toMetaKey = metadata.key;
var ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({ defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey) {
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
} });

},{"./_an-object":7,"./_metadata":66}],297:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var toMetaKey = metadata.key;
var getOrCreateMetadataMap = metadata.map;
var store = metadata.store;

metadata.exp({ deleteMetadata: function deleteMetadata(metadataKey, target /* , targetKey */) {
  var targetKey = arguments.length < 3 ? undefined : toMetaKey(arguments[2]);
  var metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
  if (metadataMap.size) return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
} });

},{"./_an-object":7,"./_metadata":66}],298:[function(require,module,exports){
var Set = require('./es6.set');
var from = require('./_array-from-iterable');
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var getPrototypeOf = require('./_object-gpo');
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

var ordinaryMetadataKeys = function (O, P) {
  var oKeys = ordinaryOwnMetadataKeys(O, P);
  var parent = getPrototypeOf(O);
  if (parent === null) return oKeys;
  var pKeys = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({ getMetadataKeys: function getMetadataKeys(target /* , targetKey */) {
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });

},{"./_an-object":7,"./_array-from-iterable":10,"./_metadata":66,"./_object-gpo":78,"./es6.set":228}],299:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var getPrototypeOf = require('./_object-gpo');
var ordinaryHasOwnMetadata = metadata.has;
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

var ordinaryGetMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({ getMetadata: function getMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":7,"./_metadata":66,"./_object-gpo":78}],300:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(target /* , targetKey */) {
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });

},{"./_an-object":7,"./_metadata":66}],301:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadata: function getOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":7,"./_metadata":66}],302:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var getPrototypeOf = require('./_object-gpo');
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

var ordinaryHasMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({ hasMetadata: function hasMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":7,"./_metadata":66,"./_object-gpo":78}],303:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

metadata.exp({ hasOwnMetadata: function hasOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":7,"./_metadata":66}],304:[function(require,module,exports){
var $metadata = require('./_metadata');
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var toMetaKey = $metadata.key;
var ordinaryDefineOwnMetadata = $metadata.set;

$metadata.exp({ metadata: function metadata(metadataKey, metadataValue) {
  return function decorator(target, targetKey) {
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
} });

},{"./_a-function":3,"./_an-object":7,"./_metadata":66}],305:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
require('./_set-collection-from')('Set');

},{"./_set-collection-from":94}],306:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
require('./_set-collection-of')('Set');

},{"./_set-collection-of":95}],307:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Set', { toJSON: require('./_collection-to-json')('Set') });

},{"./_collection-to-json":20,"./_export":33}],308:[function(require,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = require('./_export');
var $at = require('./_string-at')(true);

$export($export.P, 'String', {
  at: function at(pos) {
    return $at(this, pos);
  }
});

},{"./_export":33,"./_string-at":103}],309:[function(require,module,exports){
'use strict';
// https://tc39.github.io/String.prototype.matchAll/
var $export = require('./_export');
var defined = require('./_defined');
var toLength = require('./_to-length');
var isRegExp = require('./_is-regexp');
var getFlags = require('./_flags');
var RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function (regexp, string) {
  this._r = regexp;
  this._s = string;
};

require('./_iter-create')($RegExpStringIterator, 'RegExp String', function next() {
  var match = this._r.exec(this._s);
  return { value: match, done: match === null };
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp) {
    defined(this);
    if (!isRegExp(regexp)) throw TypeError(regexp + ' is not a regexp!');
    var S = String(this);
    var flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp);
    var rx = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});

},{"./_defined":28,"./_export":33,"./_flags":37,"./_is-regexp":52,"./_iter-create":54,"./_to-length":115}],310:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

},{"./_export":33,"./_string-pad":106}],311:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');

$export($export.P, 'String', {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

},{"./_export":33,"./_string-pad":106}],312:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimLeft', function ($trim) {
  return function trimLeft() {
    return $trim(this, 1);
  };
}, 'trimStart');

},{"./_string-trim":108}],313:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimRight', function ($trim) {
  return function trimRight() {
    return $trim(this, 2);
  };
}, 'trimEnd');

},{"./_string-trim":108}],314:[function(require,module,exports){
require('./_wks-define')('asyncIterator');

},{"./_wks-define":123}],315:[function(require,module,exports){
require('./_wks-define')('observable');

},{"./_wks-define":123}],316:[function(require,module,exports){
// https://github.com/tc39/proposal-global
var $export = require('./_export');

$export($export.S, 'System', { global: require('./_global') });

},{"./_export":33,"./_global":40}],317:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
require('./_set-collection-from')('WeakMap');

},{"./_set-collection-from":94}],318:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
require('./_set-collection-of')('WeakMap');

},{"./_set-collection-of":95}],319:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.from
require('./_set-collection-from')('WeakSet');

},{"./_set-collection-from":94}],320:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.of
require('./_set-collection-of')('WeakSet');

},{"./_set-collection-of":95}],321:[function(require,module,exports){
var $iterators = require('./es6.array.iterator');
var getKeys = require('./_object-keys');
var redefine = require('./_redefine');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var wks = require('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./_global":40,"./_hide":42,"./_iterators":58,"./_object-keys":80,"./_redefine":91,"./_wks":125,"./es6.array.iterator":138}],322:[function(require,module,exports){
var $export = require('./_export');
var $task = require('./_task');
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});

},{"./_export":33,"./_task":110}],323:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global = require('./_global');
var $export = require('./_export');
var navigator = global.navigator;
var slice = [].slice;
var MSIE = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function (set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

},{"./_export":33,"./_global":40}],324:[function(require,module,exports){
require('./modules/es6.symbol');
require('./modules/es6.object.create');
require('./modules/es6.object.define-property');
require('./modules/es6.object.define-properties');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.function.bind');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.parse-int');
require('./modules/es6.parse-float');
require('./modules/es6.number.constructor');
require('./modules/es6.number.to-fixed');
require('./modules/es6.number.to-precision');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.string.anchor');
require('./modules/es6.string.big');
require('./modules/es6.string.blink');
require('./modules/es6.string.bold');
require('./modules/es6.string.fixed');
require('./modules/es6.string.fontcolor');
require('./modules/es6.string.fontsize');
require('./modules/es6.string.italics');
require('./modules/es6.string.link');
require('./modules/es6.string.small');
require('./modules/es6.string.strike');
require('./modules/es6.string.sub');
require('./modules/es6.string.sup');
require('./modules/es6.date.now');
require('./modules/es6.date.to-json');
require('./modules/es6.date.to-iso-string');
require('./modules/es6.date.to-string');
require('./modules/es6.date.to-primitive');
require('./modules/es6.array.is-array');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.join');
require('./modules/es6.array.slice');
require('./modules/es6.array.sort');
require('./modules/es6.array.for-each');
require('./modules/es6.array.map');
require('./modules/es6.array.filter');
require('./modules/es6.array.some');
require('./modules/es6.array.every');
require('./modules/es6.array.reduce');
require('./modules/es6.array.reduce-right');
require('./modules/es6.array.index-of');
require('./modules/es6.array.last-index-of');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.array.species');
require('./modules/es6.array.iterator');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.to-string');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.typed.array-buffer');
require('./modules/es6.typed.data-view');
require('./modules/es6.typed.int8-array');
require('./modules/es6.typed.uint8-array');
require('./modules/es6.typed.uint8-clamped-array');
require('./modules/es6.typed.int16-array');
require('./modules/es6.typed.uint16-array');
require('./modules/es6.typed.int32-array');
require('./modules/es6.typed.uint32-array');
require('./modules/es6.typed.float32-array');
require('./modules/es6.typed.float64-array');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.array.flat-map');
require('./modules/es7.array.flatten');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-start');
require('./modules/es7.string.pad-end');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.string.match-all');
require('./modules/es7.symbol.async-iterator');
require('./modules/es7.symbol.observable');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.object.define-getter');
require('./modules/es7.object.define-setter');
require('./modules/es7.object.lookup-getter');
require('./modules/es7.object.lookup-setter');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/es7.map.of');
require('./modules/es7.set.of');
require('./modules/es7.weak-map.of');
require('./modules/es7.weak-set.of');
require('./modules/es7.map.from');
require('./modules/es7.set.from');
require('./modules/es7.weak-map.from');
require('./modules/es7.weak-set.from');
require('./modules/es7.global');
require('./modules/es7.system.global');
require('./modules/es7.error.is-error');
require('./modules/es7.math.clamp');
require('./modules/es7.math.deg-per-rad');
require('./modules/es7.math.degrees');
require('./modules/es7.math.fscale');
require('./modules/es7.math.iaddh');
require('./modules/es7.math.isubh');
require('./modules/es7.math.imulh');
require('./modules/es7.math.rad-per-deg');
require('./modules/es7.math.radians');
require('./modules/es7.math.scale');
require('./modules/es7.math.umulh');
require('./modules/es7.math.signbit');
require('./modules/es7.promise.finally');
require('./modules/es7.promise.try');
require('./modules/es7.reflect.define-metadata');
require('./modules/es7.reflect.delete-metadata');
require('./modules/es7.reflect.get-metadata');
require('./modules/es7.reflect.get-metadata-keys');
require('./modules/es7.reflect.get-own-metadata');
require('./modules/es7.reflect.get-own-metadata-keys');
require('./modules/es7.reflect.has-metadata');
require('./modules/es7.reflect.has-own-metadata');
require('./modules/es7.reflect.metadata');
require('./modules/es7.asap');
require('./modules/es7.observable');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/_core');

},{"./modules/_core":23,"./modules/es6.array.copy-within":128,"./modules/es6.array.every":129,"./modules/es6.array.fill":130,"./modules/es6.array.filter":131,"./modules/es6.array.find":133,"./modules/es6.array.find-index":132,"./modules/es6.array.for-each":134,"./modules/es6.array.from":135,"./modules/es6.array.index-of":136,"./modules/es6.array.is-array":137,"./modules/es6.array.iterator":138,"./modules/es6.array.join":139,"./modules/es6.array.last-index-of":140,"./modules/es6.array.map":141,"./modules/es6.array.of":142,"./modules/es6.array.reduce":144,"./modules/es6.array.reduce-right":143,"./modules/es6.array.slice":145,"./modules/es6.array.some":146,"./modules/es6.array.sort":147,"./modules/es6.array.species":148,"./modules/es6.date.now":149,"./modules/es6.date.to-iso-string":150,"./modules/es6.date.to-json":151,"./modules/es6.date.to-primitive":152,"./modules/es6.date.to-string":153,"./modules/es6.function.bind":154,"./modules/es6.function.has-instance":155,"./modules/es6.function.name":156,"./modules/es6.map":157,"./modules/es6.math.acosh":158,"./modules/es6.math.asinh":159,"./modules/es6.math.atanh":160,"./modules/es6.math.cbrt":161,"./modules/es6.math.clz32":162,"./modules/es6.math.cosh":163,"./modules/es6.math.expm1":164,"./modules/es6.math.fround":165,"./modules/es6.math.hypot":166,"./modules/es6.math.imul":167,"./modules/es6.math.log10":168,"./modules/es6.math.log1p":169,"./modules/es6.math.log2":170,"./modules/es6.math.sign":171,"./modules/es6.math.sinh":172,"./modules/es6.math.tanh":173,"./modules/es6.math.trunc":174,"./modules/es6.number.constructor":175,"./modules/es6.number.epsilon":176,"./modules/es6.number.is-finite":177,"./modules/es6.number.is-integer":178,"./modules/es6.number.is-nan":179,"./modules/es6.number.is-safe-integer":180,"./modules/es6.number.max-safe-integer":181,"./modules/es6.number.min-safe-integer":182,"./modules/es6.number.parse-float":183,"./modules/es6.number.parse-int":184,"./modules/es6.number.to-fixed":185,"./modules/es6.number.to-precision":186,"./modules/es6.object.assign":187,"./modules/es6.object.create":188,"./modules/es6.object.define-properties":189,"./modules/es6.object.define-property":190,"./modules/es6.object.freeze":191,"./modules/es6.object.get-own-property-descriptor":192,"./modules/es6.object.get-own-property-names":193,"./modules/es6.object.get-prototype-of":194,"./modules/es6.object.is":198,"./modules/es6.object.is-extensible":195,"./modules/es6.object.is-frozen":196,"./modules/es6.object.is-sealed":197,"./modules/es6.object.keys":199,"./modules/es6.object.prevent-extensions":200,"./modules/es6.object.seal":201,"./modules/es6.object.set-prototype-of":202,"./modules/es6.object.to-string":203,"./modules/es6.parse-float":204,"./modules/es6.parse-int":205,"./modules/es6.promise":206,"./modules/es6.reflect.apply":207,"./modules/es6.reflect.construct":208,"./modules/es6.reflect.define-property":209,"./modules/es6.reflect.delete-property":210,"./modules/es6.reflect.enumerate":211,"./modules/es6.reflect.get":214,"./modules/es6.reflect.get-own-property-descriptor":212,"./modules/es6.reflect.get-prototype-of":213,"./modules/es6.reflect.has":215,"./modules/es6.reflect.is-extensible":216,"./modules/es6.reflect.own-keys":217,"./modules/es6.reflect.prevent-extensions":218,"./modules/es6.reflect.set":220,"./modules/es6.reflect.set-prototype-of":219,"./modules/es6.regexp.constructor":221,"./modules/es6.regexp.flags":222,"./modules/es6.regexp.match":223,"./modules/es6.regexp.replace":224,"./modules/es6.regexp.search":225,"./modules/es6.regexp.split":226,"./modules/es6.regexp.to-string":227,"./modules/es6.set":228,"./modules/es6.string.anchor":229,"./modules/es6.string.big":230,"./modules/es6.string.blink":231,"./modules/es6.string.bold":232,"./modules/es6.string.code-point-at":233,"./modules/es6.string.ends-with":234,"./modules/es6.string.fixed":235,"./modules/es6.string.fontcolor":236,"./modules/es6.string.fontsize":237,"./modules/es6.string.from-code-point":238,"./modules/es6.string.includes":239,"./modules/es6.string.italics":240,"./modules/es6.string.iterator":241,"./modules/es6.string.link":242,"./modules/es6.string.raw":243,"./modules/es6.string.repeat":244,"./modules/es6.string.small":245,"./modules/es6.string.starts-with":246,"./modules/es6.string.strike":247,"./modules/es6.string.sub":248,"./modules/es6.string.sup":249,"./modules/es6.string.trim":250,"./modules/es6.symbol":251,"./modules/es6.typed.array-buffer":252,"./modules/es6.typed.data-view":253,"./modules/es6.typed.float32-array":254,"./modules/es6.typed.float64-array":255,"./modules/es6.typed.int16-array":256,"./modules/es6.typed.int32-array":257,"./modules/es6.typed.int8-array":258,"./modules/es6.typed.uint16-array":259,"./modules/es6.typed.uint32-array":260,"./modules/es6.typed.uint8-array":261,"./modules/es6.typed.uint8-clamped-array":262,"./modules/es6.weak-map":263,"./modules/es6.weak-set":264,"./modules/es7.array.flat-map":265,"./modules/es7.array.flatten":266,"./modules/es7.array.includes":267,"./modules/es7.asap":268,"./modules/es7.error.is-error":269,"./modules/es7.global":270,"./modules/es7.map.from":271,"./modules/es7.map.of":272,"./modules/es7.map.to-json":273,"./modules/es7.math.clamp":274,"./modules/es7.math.deg-per-rad":275,"./modules/es7.math.degrees":276,"./modules/es7.math.fscale":277,"./modules/es7.math.iaddh":278,"./modules/es7.math.imulh":279,"./modules/es7.math.isubh":280,"./modules/es7.math.rad-per-deg":281,"./modules/es7.math.radians":282,"./modules/es7.math.scale":283,"./modules/es7.math.signbit":284,"./modules/es7.math.umulh":285,"./modules/es7.object.define-getter":286,"./modules/es7.object.define-setter":287,"./modules/es7.object.entries":288,"./modules/es7.object.get-own-property-descriptors":289,"./modules/es7.object.lookup-getter":290,"./modules/es7.object.lookup-setter":291,"./modules/es7.object.values":292,"./modules/es7.observable":293,"./modules/es7.promise.finally":294,"./modules/es7.promise.try":295,"./modules/es7.reflect.define-metadata":296,"./modules/es7.reflect.delete-metadata":297,"./modules/es7.reflect.get-metadata":299,"./modules/es7.reflect.get-metadata-keys":298,"./modules/es7.reflect.get-own-metadata":301,"./modules/es7.reflect.get-own-metadata-keys":300,"./modules/es7.reflect.has-metadata":302,"./modules/es7.reflect.has-own-metadata":303,"./modules/es7.reflect.metadata":304,"./modules/es7.set.from":305,"./modules/es7.set.of":306,"./modules/es7.set.to-json":307,"./modules/es7.string.at":308,"./modules/es7.string.match-all":309,"./modules/es7.string.pad-end":310,"./modules/es7.string.pad-start":311,"./modules/es7.string.trim-left":312,"./modules/es7.string.trim-right":313,"./modules/es7.symbol.async-iterator":314,"./modules/es7.symbol.observable":315,"./modules/es7.system.global":316,"./modules/es7.weak-map.from":317,"./modules/es7.weak-map.of":318,"./modules/es7.weak-set.from":319,"./modules/es7.weak-set.of":320,"./modules/web.dom.iterable":321,"./modules/web.immediate":322,"./modules/web.timers":323}],325:[function(require,module,exports){
(function (global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],326:[function(require,module,exports){
'use strict';

var _taskRunner = require('./services/task-runner');

var _taskRunner2 = _interopRequireDefault(_taskRunner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-polyfill');


var tasks = new _taskRunner2.default(require('./tasks/init').default, require('./tasks/load-config').default, require('./tasks/load-url-params').default, require('./tasks/auth-user').default, require('./tasks/auth-partner').default, require('./tasks/load-prefs').default, require('./tasks/load-experiments').default, require('./tasks/launch-index').default // Always last
);

tasks.run().then(function () {
  console.log('Launchpad Completed');
}).catch(function (e) {
  console.error('Launchpad Error: ', e);
});

},{"./services/task-runner":332,"./tasks/auth-partner":333,"./tasks/auth-user":334,"./tasks/init":335,"./tasks/launch-index":336,"./tasks/load-config":337,"./tasks/load-experiments":338,"./tasks/load-prefs":339,"./tasks/load-url-params":340,"babel-polyfill":1}],327:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /******************************************************************************
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  Ajax: request helper class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  usage:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      new Ajax();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      Ajax.instance;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  members:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      Ajax.instance; // singleton/global instance
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      new Ajax().send(method, url, body, headers); // sends a request
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      new Ajax().get(url, headers); // sends a GET request
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      new Ajax().put(url, body, headers); // sends a PUT request
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      new Ajax().post(url, body, headers); // sends a POST request
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      new Ajax().patch(url, body, headers); // sends a PATCH request
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      new Ajax().delete(url, headers); // sends a DELETE request
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      new Ajax().headers; // the "common" headers set for this instance
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      new Ajax().getHeader(name); // gets the specified "common" header
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      new Ajax().setHeader(name, value); // sets a "common" header
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      new Ajax().removeHeader(name); // removes a "common" header
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ******************************************************************************/


var _miniUrl = require('./mini-url');

var _miniUrl2 = _interopRequireDefault(_miniUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ajax = function () {
    _createClass(Ajax, [{
        key: 'get',

        // e.g. > new Ajax().get('http://...')
        //                  .then(response => console.log(response))
        //                  .catch(response => console.error(response));
        value: function get(url, headers) {
            return this.send('GET', url, false, headers);
        }

        // e.g. > new Ajax().put('http://...', {value1: 'a', value2: 'b'})
        //                  .then(response => console.log(response))
        //                  .catch(response => console.error(response));

    }, {
        key: 'put',
        value: function put(url, body, headers) {
            return this.send('PUT', url, body, headers);
        }

        // e.g. > new Ajax().post('http://...', {value1: 'a', value2: 'b'})
        //                  .then(response => console.log(response))
        //                  .catch(response => console.error(response));

    }, {
        key: 'post',
        value: function post(url, body, headers) {
            return this.send('POST', url, body, headers);
        }

        // e.g. > new Ajax().patch('http://...', {value1: 'a', value2: 'b'})
        //                  .then(response => console.log(response))
        //                  .catch(response => console.error(response));

    }, {
        key: 'patch',
        value: function patch(url, body, headers) {
            return this.send('PATCH', url, body, headers);
        }

        // e.g. > new Ajax().delete('http://...')
        //                  .then(response => console.log(response))
        //                  .catch(response => console.error(response));

    }, {
        key: 'delete',
        value: function _delete(url, headers) {
            return this.send('DELETE', url, false, headers);
        }

        // e.g. > new Ajax().send('GET', 'http://...')
        //                  .then(response => console.log(response))
        //                  .catch(response => console.error(response));

    }, {
        key: 'send',
        value: function send(method, url, body, headers) {
            var _this = this;

            return new Promise(function (success, error) {
                var request = new XMLHttpRequest();
                request.withCredentials = true;
                request.onreadystatechange = function () {
                    if (request.readyState !== XMLHttpRequest.DONE) {
                        return;
                    }
                    var response = request.responseText;
                    try {
                        response = JSON.parse(response);
                    } catch (e) {}
                    if (request.status < 200 || request.status >= 300) {
                        return error(response, request);
                    }
                    return success(response, request);
                };
                request.open(method, url);

                headers = arrayConvert(headers);
                headers = arrayConvert(_this.headers).filter(function (b) {
                    return !headers.some(function (h) {
                        return h[0].toLowerCase() === b[0].toLowerCase();
                    });
                }).concat(headers);
                headers.forEach(function (h) {
                    request.setRequestHeader(h[0], h[1]);
                });
                if (body) {
                    body = _this.datatype === 'json' ? JSON.stringify(body) : _miniUrl2.default.formatQuery(body).replace(/^\?/gi, '');
                    request.send(body);
                } else {
                    request.send();
                }
            });
        }
    }]);

    function Ajax() {
        _classCallCheck(this, Ajax);

        var headers = [['Accept', 'application/json'], ['Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8'] // avoids CORS
        ];
        // e.g. > console.log(new Ajax().getHeader('content-type'));
        this.getHeader = function (name) {
            name = name.trim();
            var header = headers.find(function (h) {
                return h[0].toLowerCase() === name.toLowerCase();
            });
            return header ? header[1] : false;
        };

        // e.g. > console.log(new Ajax().setHeader('content-type', 'application/json'));
        this.setHeader = function (name, value) {
            name = name.trim();
            value = typeof value === 'undefined' ? '' : value.toString();
            var header = headers.find(function (h) {
                return h[0].toLowerCase() === name.toLowerCase();
            });
            if (header) {
                header[2] = value;
            } else {
                headers.push([name, value]);
            }
        };

        // e.g. > console.log(new Ajax().removeHeader('content-type'));
        this.removeHeader = function (name) {
            name = name.trim().toLowerCase();
            headers = headers.filter(function (h) {
                return h[0].toLowerCase() !== name;
            });
        };

        // e.g. > console.log(new Ajax().headers['content-type']);
        Object.defineProperty(this, 'headers', {
            configurable: false, enumerable: true,
            get: function get() {
                var values = {};
                headers.forEach(function (h) {
                    values[h[0]] = h[1];
                });
                Object.freeze(values);
                return values;
            }
        });
    }

    // e.g. > console.log(new Ajax().datatype === 'json');


    _createClass(Ajax, [{
        key: 'serializeForm',


        // e.g. > console.log(new Ajax().serializeForm(document.getElementById('my-form')));
        value: function serializeForm(element) {
            return Ajax.serializeForm(element);
        }

        // e.g. > console.log(Ajax.serializeForm(document.getElementById('my-form')));

    }, {
        key: 'datatype',
        get: function get() {
            var ctype = this.headers['Content-Type'];
            return (/\bapplication\/x-www-form.urlencoded(;|$)/gi.exec(ctype) ? 'form' : 'json'
            );
        }
    }], [{
        key: 'serializeForm',
        value: function serializeForm(form) {
            // NOTE: FormData is not supported pre-IE10 nor can it be polyfilled
            var values = [];
            var inputs = Array.from(form.querySelectorAll('[name]'));
            var values = inputs.map(function (input) {
                var ischeck = /radio|checkbox/gi.exec(input.type);
                var hasValue = !ischeck || input.checked;
                if (hasValue) {
                    var name = input.getAttribute('name');
                    var value = input.value;
                    return encodeURIComponent(name) + '=' + encodeURIComponent(value);
                }
            }).filter(function (set) {
                return set;
            });
            return values.join('&');
        }
    }]);

    return Ajax;
}();

// Optional singleton getter
// e.g. > Ajax.instance.get('http://...')
//                     .then(response => console.log(response))
//                     .catch(response => console.log(response));


exports.default = Ajax;
var instance = false;
Object.defineProperty(Ajax, 'instance', {
    configurable: false, enumerable: true,
    get: function get() {
        return instance ? instance : instance = new Ajax();
    }
});

/***************** non-exported stuff below *******************/

function arrayConvert(obj) {
    var result = [];
    for (var member in obj) {
        result.push([member, obj[member]]);
    }
    return result;
}

},{"./mini-url":331}],328:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /******************************************************************************
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  ConfigService: provides static, consistant run-time configuration services
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  usage:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      ConfigService.instance.config
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      new ConfigService().config
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  members:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      ConfigService.isPrimitive(value)        // Determines if a value is "primitive"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      ConfigService.override(from, to)        // Overrides values from one object to another
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      ConfigService.isOnCanvas()              // Determines if the current host is FB Canvas
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      new ConfigService().toCdnPath(path)     // Converts a relative/partial path to a fully-qualified cdn path using the RemoteCdn config settings
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *      new ConfigSerivce().config              // The config as processed by this service instance.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ******************************************************************************/


var _miniUrl = require('./mini-url');

var _miniUrl2 = _interopRequireDefault(_miniUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConfigService = function () {
    function ConfigService() {
        _classCallCheck(this, ConfigService);

        var values = require('config');
        var canvasvalues = values['canvas-config'] || {};
        var oncanvas = ConfigService.isOnCanvas();
        if (oncanvas) {
            ConfigService.override(canvasvalues, values);
        }
        else {
	        	document.getElementById('log-out-button').style.display = '';
        }

        values.isOnCanvas = oncanvas;
        values.urlTarget = oncanvas ? '_top' : '_self';
        this.config = values;
    }

    _createClass(ConfigService, [{
        key: 'toCdnPath',
        value: function toCdnPath(path) {
            if (!this.config.useRemoteCdn || /^[\s\w]+:\/\//gi.exec(path)) {
                return path;
            }
            var merged = [this.config.protocol, this.config.remoteCdnConfig.host, this.config.remoteCdnConfig.id, this.config.remoteCdnConfig.version, path].map(function (part) {
                return part.toString().replace(/^\/|\/$/gi, '');
            }).join('/');
            return merged;
        }
    }], [{
        key: 'isPrimitive',
        value: function isPrimitive(value) {
            return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' && !Array.isArray(value);
        }
    }, {
        key: 'override',
        value: function override(from, to) {
            for (var member in from) {
                if (ConfigService.isPrimitive(from[member])) {
                    to[member] = from[member];
                } else {
                    if (ConfigService.isPrimitive(to[member])) {
                        to[member] = {};
                    }
                    ConfigService.override(from[member], to[member]);
                }
            }
        }
    }, {
        key: 'isOnCanvas',
        value: function isOnCanvas() {
            if (typeof window !== 'undefined' && window.self !== window.top && _miniUrl2.default.parseQuery(window.location.search).isOnCanvas) {
                return true;
            }
            return typeof window !== 'undefined' && // Is in browser
            window.self !== window.top; // Is in iframe
            // && !!/https:\/\/apps\.facebook\.com\/?/gi.exec(document.referrer); // Ancestor is apps.facebook.com
        }
    }]);

    return ConfigService;
}();

exports.default = ConfigService;


Object.defineProperty(ConfigService, 'instance', {
    writable: false, enumerable: true,
    value: new ConfigService()
});

},{"./mini-url":331,"config":"config"}],329:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _configService = require('./config-service');

var _configService2 = _interopRequireDefault(_configService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = _configService2.default.instance.config;

var ErrorService = function () {
  function ErrorService() {
    _classCallCheck(this, ErrorService);
  }

  _createClass(ErrorService, null, [{
    key: 'warn',
    value: function warn() {
      var messages = Array.from(arguments);
      messages.push({ StackTrace: window.Error ? new Error().stack : {} });
      console.error(messages, JSON.stringify(messages));
    }
  }, {
    key: 'fatal',
    value: function fatal() {
      ErrorService.warn.apply(this, Array.from(arguments));
      ErrorService.maint();

      throw '';
    }
  }, {
    key: 'maint',
    value: function maint() {
      // Clear document
      while (document.body && document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }

      // Clear Style
      [document.documentElement, document.body].forEach(function (element) {
        element.style.width = "100%";
        element.style.height = "100%";
        element.style.margin = "0px";
        element.style.padding = "0px";
      });
      document.body.style.backgroundColor = '#000000';
      document.body.style.backgroundImage = "url('" + "https://"+desktopResourceUrl + "/ddc-www-casino/images/maintenance.gif" + "')";
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';

      var tenMins = 1000 * 60 * 10;
      setTimeout(function () {
        window.location.reload(true);
      }, tenMins);
    }
  }, {
    key: 'connectionError',
    value: function connectionError() {
      // Clear document
      while (document.body && document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }

      // Clear Style
      [document.documentElement, document.body].forEach(function (element) {
        element.style.width = "100%";
        element.style.height = "100%";
        element.style.margin = "0px";
        element.style.padding = "0px";
      });
      document.body.style.backgroundColor = '#000000';
      document.body.style.backgroundImage = "url('https://"+desktopResourceUrl + "/ddc-www-casino/images/dialog_border.png')";
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      var div = document.createElement("div");
      var text = 'Oops!  You found an error, and we are working to fix it now!';
      if(window.navigator.languages[0] == 'de-DE'){
          text = 'Das Casino ist derzeit aufgrund von Wartungsarbeiten offline.\n\rWir sind bald wieder zurück!';
      }else if(window.navigator.languages[0] == 'es-ES'){
          text = 'El casino está en mantenimiento,\n\rpor lo que se encuentra temporalmente inactivo.\n\r¡Volveremos pronto!';
      }else if(window.navigator.languages[0] == 'fr-FR'){
          text = 'Le casino est temporairement hors ligne pour cause de maintenance.\n\rNous serons bientôt de retour!';
      }else if(window.navigator.languages[0] == 'it-IT'){
          text = 'Il casinò è momentaneamente offline causa manutenzione.\n\rA presto!';
      }else if(window.navigator.languages[0] == 'pt-PT' || window.navigator.languages[0] == 'pt-BR'){
          text = 'O cassino está fechado temporariamente para manutenção.\n\rVoltaremos em breve!';
      }


      div.innerText = text;

      div.style.textAlign = 'center';

      div.style.fontFamily = 'Trebuchet MS';
      div.style.fontSize = '20px';
      div.style.position = 'absolute';
      div.style.top = '600px';
      div.style.width = "100%";
      div.style.height = "100px";


      document.body.appendChild(div);

      var tenMins = 1000 * 60 * 10;
      setTimeout(function () {
        window.location.reload(true);
      }, tenMins);
    }
  }]);

  return ErrorService;
}();

exports.default = ErrorService;

},{"./config-service":328}],330:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _configService = require('../services/config-service');

var _configService2 = _interopRequireDefault(_configService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = _configService2.default.instance.config;

// NOTE: Everything here has been ripped out of something somewhere and adapted to work with launchpad in order to reduce dependencies and complexity.
// NOTE: Adaptation includes global state effects
// TODO: Target everything here for termination when it is appropriate to do so.
var LegacyService = function () {
    function LegacyService() {
        _classCallCheck(this, LegacyService);
    }

    _createClass(LegacyService, null, [{
        key: 'loadValidateFormThing',
        value: function loadValidateFormThing() {
            /**** ADAPTED for use with launchpad               ****/
            /**** NOTE: Extracted from some page-loaded script ****/

            $(document).ready(function () {

                // format the date into a hidden field that can be validated when the dropdowns are changed.
                $('#date, #month, #year').change(function () {
                    $('#partnerCasinoUserBirthday').val($('#month').val() + '/' + $('#date').val() + '/' + $('#year').val());

                    // any time anything changes in the drop downs, clear errors
                    if ($('#birthdaybtn').hasClass("birthday-error")) $('#birthdaybtn').removeClass("birthday-error");
                    removeErrors($('#partnerCasinoUserBirthday'));
                });

                // Min age in accordance with facebook (http://www.facebook.com/help/210644045634222/)
                var minDDCPlayerAge = 13;

                // method to determine if user is over a minimum age.
                jQuery.validator.addMethod("ofAge", function (value, element) {
                    var userBirthday = new Date();
                    userBirthday.setFullYear($('#year').val(), $('#month').val() - 1, $('#date').val());
                    var minAgeDate = new Date();
                    minAgeDate.setFullYear(minAgeDate.getFullYear() - minDDCPlayerAge);
                    return minAgeDate > userBirthday;
                }, "You must be at least " + minDDCPlayerAge + " years old to play.");

                //validate the form before submitting
                $("#ddc-dataCaptureForm").validate({
                    onfocusout: false, //validate only on submit
                    onkeyup: false,
                    rules: {
                        partnerCasinoUserFirstName: "required",
                        partnerCasinoUserLastName: "required",
                        partnerCasinoUserGender: "required",
                        partnerCasinoUserBirthday: { required: true, date: true, ofAge: true },
                        partnerCasinoUserEmail1: { required: true, email: true },
                        partnerCasinoUserEmail2: { required: true, email: true, equalTo: "#ddc_dataCapture_email" },
                        partnerCasinoUserZipCode: "required",
                        partnerCasinoUserMemberId: { digits: true }
                    },
                    messages: {
                        partnerCasinoUserFirstName: "Please enter your first name.",
                        partnerCasinoUserLastName: "Please enter your last name.",
                        partnerCasinoUserGender: "Please select your gender.",
                        partnerCasinoUserBirthday: {
                            required: "Please enter your birthday.",
                            date: "Please enter a valid birthday."
                        },
                        partnerCasinoUserEmail1: "Please enter a valid email.",
                        partnerCasinoUserEmail2: {
                            required: "Please enter your email again.",
                            email: "Please enter a valid email",
                            equalTo: "The two emails you entered do not match."
                        },
                        partnerCasinoUserZipCode: "Please enter a valid ZIP code.",
                        partnerCasinoUserMemberId: "Player Club ID should contain only numbers."
                    },
                    errorPlacement: function errorPlacement(error, element) {
                        element.parent().append("<div class='errorMsg'>" + error.html() + "</div>");

                        // hack for the dropdowns to show error state
                        if (element.attr('id') == "partnerCasinoUserBirthday") $('#birthdaybtn').addClass("birthday-error");
                    }
                });

                // When a user goes back to a field (that previously had errors)...clear the errors
                $("#ddc-dataCaptureForm input").keyup(function () {
                    removeErrors($(this));
                });

                // When the user tries to submit..clear all the previous errors(if any).
                // The validator will take care of validating and adding any new errors
                // This helps with error messages piling up when the user hits submit multiple times without correcting previous errors
                $("#submit_btn").click(function () {
                    removeErrors($("#ddc-dataCaptureForm input"));
                });

                window.removeErrors = function (el) {
                    var errordiv = el.next("div.errorMsg");
                    if (errordiv) errordiv.remove(); // remove error message
                    if (el.hasClass("error")) el.removeClass("error"); // make the input box green again (from red)
                };
            });
        }
    }, {
        key: 'loadBirthdatePluginThing',
        value: function loadBirthdatePluginThing() {
            /**** NOTE: Extracted from old dependency ******/
            /**** Adapted to function with launchpad  ******/

            /***********************************************
            * Drop Down Date select script- by JavaScriptKit.com
            * This notice MUST stay intact for use
            * Visit JavaScript Kit at http://www.javascriptkit.com/ for this script and more
            * WARNING -------------------------------------------------------!-
            * This javascript has been modified by *bdhacker* for real life use
            * ishafiul@gmail.com
            * http://bdhacker.wordpress.com
            ***********************************************/

            window.monthtext = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            window.birthdayJSStr = [{ // 0
                'de_DE': 'Januar',
                'es_ES': 'Enero',
                'en_US': 'January',
                'fr_FR': 'Janvier',
                'it_IT': 'Gennaio',
                'pt_PT': 'Janeiro'
            }, { // 1
                'de_DE': 'Februar',
                'es_ES': 'Febrero',
                'en_US': 'February',
                'fr_FR': 'Fevrier',
                'it_IT': 'Febbraio',
                'pt_PT': 'Fevereiro'
            }, { // 2
                'de_DE': 'Marz',
                'es_ES': 'Marzo',
                'en_US': 'March',
                'fr_FR': 'Mars',
                'it_IT': 'Marzo',
                'pt_PT': 'Marco'
            }, { // 3
                'de_DE': 'April',
                'es_ES': 'Abril',
                'en_US': 'April',
                'fr_FR': 'Avril',
                'it_IT': 'Aprile',
                'pt_PT': 'Abril'
            }, { // 4
                'de_DE': 'Mai',
                'es_ES': 'Mayo',
                'en_US': 'May',
                'fr_FR': 'Mai',
                'it_IT': 'Maggio',
                'pt_PT': 'Maio'
            }, { // 5
                'de_DE': 'Juni',
                'es_ES': 'Junio',
                'en_US': 'June',
                'fr_FR': 'Juin',
                'it_IT': 'Giugno',
                'pt_PT': 'Junho'
            }, { // 6
                'de_DE': 'Juli',
                'es_ES': 'Julio',
                'en_US': 'July',
                'fr_FR': 'Juillet',
                'it_IT': 'Luglio',
                'pt_PT': 'Julho'
            }, { // 7
                'de_DE': 'August',
                'es_ES': 'Agosto',
                'en_US': 'August',
                'fr_FR': 'Aout',
                'it_IT': 'Agosto',
                'pt_PT': 'Agosto'
            }, { // 8
                'de_DE': 'September',
                'es_ES': 'Septiembre',
                'en_US': 'September',
                'fr_FR': 'Septembre',
                'it_IT': 'Settembre',
                'pt_PT': 'Septembro'
            }, { // 9
                'de_DE': 'Oktober',
                'es_ES': 'Octubre',
                'en_US': 'October',
                'fr_FR': 'Octobre',
                'it_IT': 'Ottobre',
                'pt_PT': 'Octubro'
            }, { // 10
                'de_DE': 'November',
                'es_ES': 'Noviembre',
                'en_US': 'November',
                'fr_FR': 'Novembre',
                'it_IT': 'Novembre',
                'pt_PT': 'Novembro'
            }, { // 11
                'de_DE': 'Dezember',
                'es_ES': 'Diciembre',
                'en_US': 'December',
                'fr_FR': 'Decembre',
                'it_IT': 'Dicembre',
                'pt_PT': 'Dezembro'
            }];

            window.date_populate = function (dayfield, monthfield, yearfield) {
                var today = new Date();
                var monthLang = $("#languageCode").val();
                var dayfield = document.getElementById(dayfield);
                var monthfield = document.getElementById(monthfield);
                var yearfield = document.getElementById(yearfield);
                for (var i = 1; i < 32; i++) {
                    dayfield.options[i] = new Option(i, i);
                }dayfield.options[today.getDate()] = new Option(today.getDate(), today.getDate(), true, true); //select today's day
                for (var m = 0; m < 12; m++) {
                    monthfield.options[m] = new Option(birthdayJSStr[m][monthLang], m + 1);
                }monthfield.options[today.getMonth()] = new Option(birthdayJSStr[today.getMonth()][monthLang], today.getMonth() + 1, true, true); //select today's month
                var thisyear = today.getFullYear();
                for (var y = 0; y < 100; y++) {
                    yearfield.options[y] = new Option(thisyear, thisyear);
                    thisyear -= 1;
                }
                yearfield.options[0] = new Option(today.getFullYear() - 21, today.getFullYear() - 21, true, true); //select today's year
            };
        }
    }, {
        key: 'loadQuanrudAdaptiveThing',
        value: function loadQuanrudAdaptiveThing() {
            // --> Adaptive
            // Author: Kasey Quanrud
            // Adaptive is short for modifying the swf object to change the width to the size of the window.
            // The reason for not using percetange based layout, 100%, is that flash redraws automatically with the browsers
            // window resize, which is too often, causing performance issues and glitches in rendering. Instead, the window
            // resize event is caught in js, below, and a time delay is added before changing the swf dimensions and then js
            // calls a method in the flash object that responds to the change in dimensions.
            //
            // ::: Adapted to Launchpad ::: ripped from index.php
            //Assign to window, and a local ref
            var adaptive = window.Adaptive = window.Adaptive || {};

            //The casino swf
            adaptive.swfDOMElement = null;
            //timeout ref for delaying the swf resize
            adaptive.resizeTimer = null;

            adaptive.initialize = function (swfElementId, config) {

                var scope = window.Adaptive;
                //Get a ref to the swf for later use
                scope.swfDOMElement = document.getElementById(swfElementId);

                document.getElementById("container").style.width = "100%";
                document.getElementById("content").style.width = "100%";

                //Listen to the window for resize
                window.onresize = scope.resizedHandler;

                //Force a resize based on the current values
                scope.resizeElements();
            };

            adaptive.registerResizeCallback = function () {
                var scope = window.Adaptive;

                //force immediate resize
                scope.resizeElements();

                //Also start the timer to catch any late resizes
                scope.resizedHandler();
            };

            adaptive.resizedHandler = function () {
                var scope = window.Adaptive;

                //Always reset and null the timer
                scope.cleanupTimer();

                //start the time delay
                scope.resizeTimer = window.setTimeout(scope.resizeElements, 200);
            };

            adaptive.resizeElements = function () {
                var scope = window.Adaptive,
                    outerWidth = 0,
                    width = jQuery(window).width() || 760,
                    height = 895;

                scope.swfDOMElement.width = width;
                scope.swfDOMElement.height = height;

                //Style values are strings
                scope.swfDOMElement.style.width = width + "px";
                scope.swfDOMElement.style.height = height + "px";

                // If the swf registered a callback, call it...
                if (scope.swfDOMElement && scope.swfDOMElement.resizeCallback) {
                    scope.swfDOMElement.resizeCallback(width, height);
                }
                scope.dialogHelper();
            };

            adaptive.cleanupTimer = function () {
                var scope = window.Adaptive;

                if (scope.resizeTimer) {
                    window.clearTimeout(scope.resizeTimer);
                    scope.resizeTimer = null;
                }
            };

            //Center all popups
            adaptive.dialogHelper = function () {

                if (jQuery && jQuery.ui) {
                    if (jQuery("#nav-pages").length > 0 && jQuery("#nav-pages").hasClass('ui-dialog-content')) {
                        jQuery("#nav-pages").dialog("option", "position", "center");
                    }

                    if (jQuery('#buy_chips_message_dialog').length > 0 && jQuery('#buy_chips_message_dialog').hasClass('ui-dialog-content')) {
                        jQuery("#buy_chips_message_dialog").dialog("option", "position", "center");
                    }
                }
            };
        }
    }, {
        key: 'loadCommonJsThing',
        value: function loadCommonJsThing() {
            // NOTE: Adapted for launchpad : ripped from common.js
            window.commonLangaugeSetTo = convertLangCodeJS(getBrowserLanguageCodeJS());
            window.commonJSStr = [{ // 0
                'de_DE': 'Wird geladen, bitte warten ...',
                'es_ES': 'Cargando...',
                'en_US': 'Loading, please wait...',
                'fr_FR': 'Chargement en cours, veuillez patienter...',
                'it_IT': 'Caricamento, attendere prego...',
                'pt_PT': 'Carregando, aguarde...'
            }, { // 1
                'de_DE': 'Deine Sitzung ist abgelaufen. Klicke auf OK, um dich wieder anzumelden',
                'es_ES': 'Tu sesi&oacute;n ha caducado.  Haz clic en OK para volver a entrar',
                'en_US': 'Your session has expired.  Click OK to login again',
                'fr_FR': 'Votre session a expir&eacute;. Cliquez sur OK pour vous reconnecter.',
                'it_IT': 'La tua sessione Ã¨ scaduta.  Clicca OK per accedere nuovamente.'
            }, { // 2
                'de_DE': 'Partnerprogramm',
                'es_ES': 'Programa de afiliaci&oacute;n',
                'en_US': 'Affiliate Program',
                'fr_FR': 'Programme d\'affiliation',
                'it_IT': 'Programmi affiliati',
                'pt_PT': 'Programa de afiliado'
            }, { // 3
                'de_DE': 'Datenschutzerkl&auml;rung',
                'es_ES': 'Pol&iacute;tica de privacidad',
                'en_US': 'Privacy Policy',
                'fr_FR': 'Politique de confidentialitÃ©',
                'it_IT': 'Normativa sulla privacy',
                'pt_PT': 'Pol&iacute;tica de privacidade'
            }, { // 4
                'de_DE': 'Nutzungsbedingungen',
                'es_ES': 'Condiciones de uso',
                'en_US': 'Terms of Use',
                'fr_FR': 'Conditions d\'utilisation',
                'it_IT': 'Termini dâ€™utilizzo',
                'pt_PT': 'Termos de uso'
            }, { // 5
                'de_DE': 'Brauchen Sie Hilfe?',
                'es_ES': 'Â¿Necesitas ayuda?',
                'en_US': 'Need Help?',
                'fr_FR': 'Avez-vous besoin d\'aide ?',
                'it_IT': 'Serve Aiuto?',
                'pt_PT': 'Precisa de ajuda?'
            }, { // 6
                'de_DE': 'Abmelden',
                'es_ES': 'Cerrar session',
                'en_US': 'Log Out',
                'fr_FR': 'Se d&eacute;connecter',
                'it_IT': 'Uscire',
                'pt_PT': 'Sair'
            }, { // 7
                'de_DE': 'https://de.support.doubledowncasino.com/',
                'es_ES': 'https://es.support.doubledowncasino.com/',
                'en_US': 'https://support.doubledowncasino.com/',
                'fr_FR': 'https://fr.support.doubledowncasino.com/',
                'it_IT': 'https://it.support.doubledowncasino.com/'
            }, { // 8
                'de_DE': 'Mobil spielen',
                'es_ES': 'Juega desde tu telÃ©fono',
                'en_US': 'Go Mobile!',
                'fr_FR': 'Joue sur ton portable',
                'it_IT': 'Gioca su cellulare'
            }, { // 9
                'de_DE': 'Spiele deine Lieblings-Casinospiele jetzt unterwegs!',
                'es_ES': 'Â¡Ahora puedes disfrutar de tus juegos de casino favoritos donde quieras!',
                'en_US': 'Now play your favorite casino games on the go!',
                'fr_FR': 'Joue dÃ©sormais Ã  tes jeux de casino prÃ©fÃ©rÃ©s oÃ¹ que tu sois !',
                'it_IT': 'Goditi i tuoi giochi da casinÃ² preferiti in movimento!'
            }, { // 10
                'de_DE': 'Lies Facebook-Benachrichtigungen auf deinem Mobiltelefon',
                'es_ES': 'Echa un vistazo a las notificaciones de Facebook de tu mÃ³vil',
                'en_US': 'Check Facebook Notifications on Your Device',
                'fr_FR': 'ReÃ§ois les notifications Facebook sur ton portable.',
                'it_IT': 'Controlla le Notifiche di Facebook sul tuo telefono cellulare'
            }];

            window.setLanguageCode = function (languageCode) {
                languageCode = convertLangCodeJS(languageCode);

                // Google Analytics - setlanguageCode Notification
                _gaq.push(['_trackEvent', 'userAction', 'setLangaugeCodeAttempt']);

                if (window['FBUID'] && languageCode != "") {
                    var params = {
                        'userId': $("#userId").val(),
                        'fbuid': FBUID,
                        'locale': languageCode
                    };

                    $.ajax({
                        type: 'POST',
                        url: '/set-user-language/?fbuid=' + FBUID,
                        method: 'POST',
                        data: JSON.stringify(params),
                        dataType: 'json',
                        cache: false,

                        success: function success(json) {
                            // Google Analytics - setlanguageCode Completion Notification
                            _gaq.push(['_trackEvent', 'userAction', 'setLanguageCodeComplete']);

                            $("#languageCode").val(languageCode);
                            updateLanguageLabels();
                        },

                        error: function error(json) {
                            // Google Analytics - setlanguageCode Error Notification
                            _gaq.push(['_trackEvent', 'userAction', 'setLangaugeCodeErrorPost']);

                            $("#languageCode").val('en_US');
                            updateLanguageLabels();
                        }
                    });
                } else {
                    // Google Analytics - setlanguageCode Error Notification (failure pre-ajax)
                    _gaq.push(['_trackEvent', 'userAction', 'setLangaugeCodeErrorPre']);

                    var locale = convertLangCodeJS(getBrowserLanguageCodeJS());
                    $("#languageCode").val(locale);
                    updateLanguageLabels();
                }
            };

            window.updateLanguageLabels = function () {

                var languageCode = $("#languageCode").val();

                $('#affiliate').html(commonJSStr[2][languageCode]);
                $('#privacy').html(commonJSStr[3][languageCode]);
                $('#privacyNew').html(commonJSStr[3][languageCode]);
                $('#terms').html(commonJSStr[4][languageCode]);
                $('#termsNew').html(commonJSStr[4][languageCode]);
                $('#help').html(commonJSStr[5][languageCode]);
                $('#logout').html(commonJSStr[6][languageCode]);
            };

            var displayedLocalizationPopup = false;

            window.casinoLockedAndLoaded = function (userid) {
                // Check to see if we need to show the "We're localized" dialog.
                if (typeof showLocalizationPopup !== "undefined" && typeof thisMovie().showNewLanguagesPopup == 'function' && displayedLocalizationPopup == false) {
                    displayedLocalizationPopup = true;
                    thisMovie().showNewLanguagesPopup();
                }

                sendExactTarget();

                showMarketingContent();
            };

            // JS functions common for all pages
            window.redeemGiftCard = function (provider, pin, userid) {
                // Google Analytics - PIN Redemption Notification
                _gaq.push(['_trackEvent', 'userAction', 'GiftCardRedemptionAttempt']);

                // Client side parameter cleanup/validation.
                if (userid == null || !userid.toString().match(/\d+/) || provider == null || provider.toLowerCase() != "incomm" || pin == null || !pin.toString().match(/\d{10}/)) {
                    // Google Analytics - PIN Redemption Error Notification
                    _gaq.push(['_trackEvent', 'userAction', 'GiftCardRedemptionErrorPre']);

                    thisMovie().redeemGiftCardCallback('300');
                    return false;
                }

                var params = {
                    'userid': userid,
                    'provider': provider,
                    'pin': pin
                };

                // jQuery call back to the redemption service.
                $.ajax({
                    type: 'POST',
                    url: '/order/redeem-gift-card/',
                    method: 'POST',
                    data: JSON.stringify(params),
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    success: function success(data) {
                        // Check to see if we had an error returned.
                        if (data.error) {
                            // Google Analytics - PIN Redemption Error Notification
                            _gaq.push(['_trackEvent', 'userAction', 'GiftCardRedemptionError']);

                            thisMovie().redeemGiftCardCallback(data.error.code);
                            return false;
                        }

                        // Google Analytics - PIN Redemption Completion Notification
                        _gaq.push(['_trackEvent', 'userAction', 'GiftCardRedemptionComplete']);

                        thisMovie().redeemGiftCardCallback(data.success);
                        return true;
                    },
                    error: function error(data, statusCode) {
                        // Google Analytics - PIN Redemption Error Notification
                        _gaq.push(['_trackEvent', 'userAction', 'GiftCardRedemptionErrorCalling']);

                        thisMovie().redeemGiftCardCallback(310);
                        return false;
                    }
                });

                return true;
            };

            window.showNavPage = function (url) {

                if (url.search('account') > -1) {
                    var width = 420;
                } else {
                    var width = 760;
                }

                var length = arguments.length;

                var argument_list = arguments[0].split('/');

                if (length >= 3) {
                    url += '/?' + arguments[1] + '=' + argument_list[1];
                }

                $('#nav-pages').html('<div id="dialog-wrapper"><strong>' + commonJSStr[0][commonLangaugeSetTo] + '</strong></div>');
                $('#nav-pages').dialog({ title: '', width: width, height: 580, modal: true, resizable: false, close: function close() {
                        $('#nav-pages').dialog('destroy');
                    } });

                var params = {};
                params.ajax = 1;
                params.userId = $("#userId").val();

                if (window['FBUID']) {
                    params.fbid = FBUID;
                }

                if (SIGNED_REQUEST) {
                    params.signed_request = SIGNED_REQUEST;
                }

                $.ajax({
                    'type': 'GET',
                    'url': url,
                    'data': params,
                    'complete': function complete(xhr, statusText) {
                        if (statusText == 'error') {
                            if (xhr.status == 401) {
                                $('#nav-pages').dialog('close');
                                alert(commonJSStr[1][commonLangaugeSetTo]);
                                window.location = '/';
                            } else {
                                $('#nav-pages').html(xhr.responseText);
                                $('#nav-pages').dialog('option', 'position', 'center');
                                $('#nav-pages').dialog('option', 'title', $('#pagetitle').html());
                            }
                        } else {
                            $('#nav-pages').html(xhr.responseText);
                            $('#nav-pages').dialog('option', 'height', 600);
                            $('#nav-pages').dialog('option', 'position', 'center');
                            $('#nav-pages').dialog('option', 'title', $('#pagetitle').html());
                        }
                    }
                });
            };

            window.playersClub = function () {
                $('#nav-pages').html('<div id="dialog-wrapper"><strong>' + commonJSStr[0][commonLangaugeSetTo] + '</strong></div>');
                $('#nav-pages').dialog({ title: $('#pagetitle').html(), width: 720, modal: true, resizable: false, close: function close() {
                        $('#nav-pages').dialog('destroy');
                    } });

                var params = {};
                params.ajax = 1;
                params.userId = $("#userId").val();
                if (SIGNED_REQUEST) {
                    params.signed_request = SIGNED_REQUEST;
                }

                $.ajax({
                    'type': 'GET',
                    'url': 'players-club',
                    'data': params,
                    'complete': function complete(xhr, statusText) {
                        if (statusText == 'error') {
                            if (xhr.status == 401) {
                                $('#nav-pages').dialog('close');
                                alert(commonJSStr[1][commonLangaugeSetTo]);
                                window.location = '/';
                            } else {
                                $('#nav-pages').html(xhr.responseText);
                                $('#nav-pages').dialog('option', 'position', 'center');
                                $('#nav-pages').dialog('option', 'title', $('#pagetitle').html());
                            }
                        } else {
                            $('#nav-pages').html(xhr.responseText);
                            $('#nav-pages').dialog('option', 'position', 'center');
                            $('#nav-pages').dialog('option', 'title', $('#pagetitle').html());
                        }
                    }
                });
            };

            // startup functions
            $(function () {
                $("#headerImage").click(function () {
                    var edc_ddiOptions = null;

                    try {
                        edc_ddiOptions = ddiOptions;
                    } catch (error) {
                        console.error(error);
                    }

                    if (edc_ddiOptions && edc_ddiOptions.headerImageDeepLink) {
                        window.location.href = window.location.protocol + "//" + window.location.hostname + window.location.pathname + "?" + ddiOptions.headerImageDeepLink;
                        return false;
                    } else if (flashvars && flashvars.headerImageDeepLink) {
                        window.location.href = window.location.protocol + "//" + window.location.hostname + window.location.pathname + "?" + flashvars.headerImageDeepLink;
                        return false;
                    }

                    var edc_casino = null;

                    try {
                        edc_casino = casino;
                    } catch (err) {
                        console.error(err);
                    }

                    if (edc_casino != null) {

                        casino.Slots.environment.getPubsub().publish(dd.desktop.application.appConstants.dialogShowRequest, { contentId: "buyChipsDialog" });
                        casino.Slots.environment.getPubsub().publish(dd.desktop.application.appConstants.logMessageRequest, { evt: 'Header App', msg: 'Buy Chips Clicked' });
                    } else {

                        buyChips();
                    }
                    return false;
                });
                $("#headerImageLike").click(function () {
                    showFanEmailDialog("");return false;
                });
                $("#affiliate").click(function () {
                    showNavPage('/affiliate');return false;
                });
                $("#terms").click(function () {
                    showNavPage('/terms');return false;
                });
                $("#privacy").click(function () {
                    showNavPage('/privacy');return false;
                });

                var locale = $("#languageCode").val();

                var _regex = /[?&]([^=#]+)=([^&#]*)/g,
                    _url = window.location.href,
                    _params = {},
                    _match;
                while (_match = _regex.exec(_url)) {
                    _params[_match[1]] = decodeURIComponent(_match[2]);
                }

                if (_params["locale"]) {
                    locale = _params["locale"];
                }

                if (locale != undefined && locale != null && locale.length > 1 && locale != "") {
                    updateLanguageLabels();
                }

                // Hover states on green cta buttons
                $(".greenBtn").hover(function () {
                    $(this).addClass("ui-state-hover");
                }, function () {
                    $(this).removeClass("ui-state-hover");
                });

                $(".yellowBtn").hover(function () {
                    $(this).addClass("ui-state-hover");
                }, function () {
                    $(this).removeClass("ui-state-hover");
                });

                $("#package_promo_button").hover(function () {
                    $(this).addClass("ui-state-hover");
                }, function () {
                    $(this).removeClass("ui-state-hover");
                });
                $(".blueBtn").hover(function () {
                    $(this).addClass("ui-state-hover");
                }, function () {
                    $(this).removeClass("ui-state-hover");
                });
                var buttons = document.getElementsByTagName('button');
                for (var j = 0; j < buttons.length; j++) {
                    var button = buttons[j];
                    var textNode = button;
                    while (textNode.children[0]) {
                        textNode = textNode.children[0];
                    }
                    var text, words, numSplits;
                    var spacing = 0;
                    while (button.scrollWidth !== 0 && button.clientWidth !== 0 && button.scrollWidth > button.clientWidth) {
                        if (!spacing) {
                            text = textNode.innerHTML;
                            words = text.split(' ');
                            numSplits = Math.ceil(button.scrollWidth / button.clientWidth);
                            spacing = Math.round(words.length / numSplits);
                        }
                        for (var i = spacing; i < words.length; i += spacing + 1) {
                            words.splice(i, 0, '<br />');
                        }
                        textNode.innerHTML = words.join(' ');
                        spacing--;
                        words = text.split(' ');
                    }
                }
            });

            window.refreshPage = function () {
                window.location.reload();
            };

            window.showFanEmailDialog = function (showWhich) {
                //This function used to check for like permissions
                //but we no longer need to do that because of
                //fanpagelikestatemanager.js.

                //This function's contents remains a single method call
                //to support legacy flash calls which still call out to
                //showFanEmailDialog("");
                getShowFanEmailDialog(showWhich);
            };

            window.getShowFanEmailDialog = function (showWhich) {
                // set up the params for which dialog html to show
                params = {};
                params.display = showWhich;
                params.userId = $("#userId").val();
                params.ajax = 1;

                if (window['FBUID']) {
                    params.fbuid = FBUID;
                }

                if (SIGNED_REQUEST) {
                    params.signed_request = SIGNED_REQUEST;
                }

                $.ajax({
                    'type': 'GET',
                    'url': '/fan-box',
                    'data': params,
                    'complete': function complete(xhr, statusText) {
                        if (statusText == 'error') {
                            if (xhr.status == 401) {
                                alert(commonJSStr[1][commonLangaugeSetTo]);
                                window.location = '/';
                            } else {
                                $('#nav-pages').html(xhr.responseText);
                                $('#nav-pages').dialog({ title: $('#pagetitle').html(), width: 444, modal: true, resizable: false, close: function close() {
                                        $('#nav-pages').dialog('destroy');
                                    } });
                                $(".ui-dialog").wrap('<div class="borderlessDialog" />');
                            }
                        } else {
                            //width: 560 was switched to 300 for loc'd like us dialog
                            $('#nav-pages').html(xhr.responseText);
                            //The close callback is handled in fan-box.phtml now.
                            $('#nav-pages').dialog({ title: $('#pagetitle').html(), width: 430, modal: true, resizable: false });
                            $.cookie('fanDialog', 'true', { expires: 1 });
                        }
                    }
                });
            };

            window.showPlayerEnginePopupDialog = function (title1, message1, message2, cta_title, bg_image, promo_id) {
                // set up the params for which dialog html to show
                params = {};
                //params.ajax = 1

                params.title1 = title1;
                params.message1 = message1;
                params.message2 = message2;
                params.cta_title = cta_title;
                params.bg_image = bg_image;
                params.promo_id = promo_id;
                params.userId = $("#userId").val();

                if (window['FBUID']) {
                    params.fbuid = FBUID;
                }

                if (SIGNED_REQUEST) {
                    params.signed_request = SIGNED_REQUEST;
                }

                $.ajax({
                    'type': 'GET',
                    'url': '/player-engine-popup',
                    'data': params,
                    'complete': function complete(xhr, statusText) {
                        if (statusText == 'error') {
                            if (xhr.status == 401) {
                                alert(commonJSStr[1][commonLangaugeSetTo]);
                                window.location = '/';
                            } else {
                                $('#nav-pages').html(xhr.responseText);
                                $('#nav-pages').dialog({ title: $('#pagetitle').html(), width: 444, modal: true, resizable: false, close: function close() {
                                        $('#nav-pages').dialog('destroy');
                                    } });
                                $(".ui-dialog").wrap('<div class="borderlessDialog" />');
                            }
                        } else {
                            //width: 560 was switched to 300 for loc'd like us dialog
                            $('#nav-pages').html(xhr.responseText);
                            //The close callback is handled in fan-box.phtml now.
                            $('#nav-pages').dialog({ title: $('#pagetitle').html(), width: 430, modal: true, resizable: false });
                        }
                    }
                });
            };

            window.processRedemptionCode = function () {
                var params = {};
                params.ajax = 1;

                if (SIGNED_REQUEST) {
                    params.signed_request = SIGNED_REQUEST;
                }

                var onClose = function onClose() {
                    $('#nav-pages').dialog('destroy');
                    fanBox();
                };

                $('#nav-pages').load('/process-redemption-code', params, function (e, statusText, xhr) {
                    if (statusText == 'error') {
                        if (xhr.status == 401) {
                            window.location.href = '/';
                        } else if (xhr.status == 200) {
                            $('#nav-pages').html(xhr.responseText);
                            $('#nav-pages').dialog({
                                width: 400,
                                modal: true,
                                resizable: false,
                                close: onClose
                            });
                        }
                    } else {
                        $('#nav-pages').html(xhr.responseText);
                        $('#nav-pages').dialog({ width: 400, modal: true, resizable: false, close: onClose });
                    }
                });
            };

            window.processPromo = function () {
                //get pid from cookie
                if ($.cookie('ddc_pid')) {
                    if ($('#partnerName').val() != '') {
                        // a partner name hidden input is with the value of the partner name filled in on partner sites.
                        //per BESI-85 - if we are on a partner site, we do not want to allow URL pids to be redeemable.
                        var html = '';
                        html += '<span id="pagetitle" style="display:none"></span>';

                        html += '<div id="dialog-wrapper">';
                        html += '	<div align="center" style="margin:20px;">' + 'The promotion code URL you are trying to access is not valid.' + '</div>';

                        html += '	<div align="center">';
                        html += '		<button class="promo-continue-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" onclick="$(\'#nav-pages\').dialog(\'close\');return false;" role="button" aria-disabled="false">';
                        html += '			<span class="ui-button-text">Continue</span>';
                        html += '		</button>';
                        html += '	</div>';

                        html += '	<script> $(".promo-continue-button").button(); <' + '/script>';
                        html += '</div>';

                        $('#nav-pages').html(html);
                        $('#nav-pages').dialog({ width: 400, modal: true, resizable: false, close: function close() {
                                $('#nav-pages').dialog('destroy');
                            } });
                    } else {
                        var pid = $.cookie('ddc_pid');

                        //call redeemPromo with pid passed over
                        //This function is in buy-chips.js
                        //Response is built and displayed by redeemPromotion()
                        redeemPromotion(pid, true);
                    }

                    //delete cookie after we're done.
                    //find cookie domain
                    var cookieHost = document.location.hostname;
                    if (cookieHost.search('facebook') == 0) {
                        cookieHost = cookieHost.replace('facebook', '');
                    } else {
                        cookieHost = '.' + cookieHost;
                    }

                    $.cookie('ddc_pid', '', { expires: -1, path: '/', domain: cookieHost });
                }
            };

            window.send2mobilePopup = function () {

                if (window['APP_ID']) {
                    if (typeof HAS_FACEBOOK_MOBILE === 'undefined' || HAS_FACEBOOK_MOBILE) {
                        var html = '';
                        html += '<div id="dialog-wrapper">';
                        html += '<h4 class="center uppercase">' + commonJSStr[9][commonLangaugeSetTo] + '</h4>';
                        html += '<div id="send2mobile-btn"><div id="middle"><div id="send2mobile-inner"><iframe frameborder="0" width="230px" height=39px" src="https://www.facebook.com/plugins/send_to_mobile.php?app_id=' + APP_ID + '&size=xlarge" ></iframe></div></div></div>';
                        html += '<div class="send2mobile-text center">' + commonJSStr[10][commonLangaugeSetTo] + '</div>';

                        $('#nav-pages').html(html);
                        $('#nav-pages').dialog({ title: commonJSStr[8][commonLangaugeSetTo], width: 380, height: 350, modal: true, resizable: false, close: function close() {
                                $('#nav-pages').dialog('destroy');
                            } });
                    } else {
                        window.open("http://m.doubledowncasino.com", "_blank");
                    }
                }
            };

            window.getMoreChipsOffer = function (userCashBalance) {
                return true;
            };

            window.processPID = function (PID) {
                var params = {
                    'userId': $("#userId").val(),
                    'PID': PID
                };

                $.ajax({
                    type: "GET",
                    url: '/process-promo',
                    data: params,
                    dataType: 'text'
                });
            };

            window.processSweepstakes = function (jsonParams) {
                var params = {
                    'userId': $("#userId").val(),
                    'data': jsonParams
                };

                $.ajax({
                    type: "POST",
                    url: '/process-sweepstakes',
                    data: params,
                    dataType: 'text'
                });
            };

            window.testDealerSweepstakes = function (data) {

                if (!data) {

                    console.debug('Data is empty');
                    return false;
                }

                if (data.error_message) {
                    console.debug(data.error_message);
                    return false;
                }

                var data = {
                    'data': '1'
                };

                // call to dealer this info
                $.ajax({
                    type: 'POST',
                    url: DEALER_URL + '/sweepstakes/getActiveSweepstakes/',
                    dataType: 'json',
                    data: data,
                    success: function success(data) {

                        if (data.status == 'success') {

                            console.debug(data.data.length);

                            for (var i = 0; i < data.data.length; i++) {
                                console.debug(data.data[0][i]);
                            }
                        }
                    },
                    error: function error(data) {

                        if (data.responseText != undefined && data.responseText != '') {

                            responseText = JSON.parse(data.responseText);

                            // TODO: nice dialog, not an alert?
                            if (responseText.status != undefined && responseText.status == 'error') {

                                alert(responseText.message);
                            }
                        }
                    }
                });
            };

            window.sendExactTarget = function () {

                var params = {
                    'userId': $("#userId").val()
                };

                $.ajax({
                    type: 'POST',
                    url: '/update-exact-target',
                    method: 'POST',
                    data: params,
                    dataType: 'json',
                    cache: false,
                    success: function success(json) {},
                    error: function error(json) {}
                });
            };

            window.showMarketingContent = function () {
                if ($.cookie('ddc_pid')) {
                    processPromo();
                } else if ($.cookie('ddc_rc')) {
                    processRedemptionCode();
                }
                /* else
                {
                	fanBox();
                } */
            };

            window.globalHeaderExternalLink = function () {
                // open the new tab to the mobile page
                window.open('http://m.doubledowncasino.com/', '_blank');
            };

            var browserScrolling;

            window.allowBrowserScroll = function (value) {
                browserScrolling = value;
            };
            window.handle = function (delta) {
                if (!browserScrolling) {
                    return false;
                }
                return true;
            };
            window.wheel = function (event) {
                var delta = 0;
                if (!event) {
                    event = window.event;
                }
                if (event.wheelDelta) {
                    delta = event.wheelDelta / 120;
                    if (window.opera) {
                        delta = -delta;
                    }
                } else if (event.detail) {
                    delta = -event.detail / 3;
                }
                if (delta) {
                    handle(delta);
                }
                if (!browserScrolling) {
                    if (event.preventDefault) {
                        event.preventDefault();
                    }

                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                }
            };
            if (window.addEventListener) {
                window.addEventListener('DOMMouseScroll', wheel, false);
            }
            window.onmousewheel = document.onmousewheel = wheel;
            allowBrowserScroll(true);

            window.launchFullScreen = function () {
                var element = document.body;
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            };

            window.doesHaveFullScreen = function () {
                if (document.body.requestFullscreen || document.body.mozRequestFullScreen || document.body.webkitRequestFullscreen || document.body.msRequestFullscreen) {
                    return true;
                } else {
                    return false;
                }
            };

            window.exitFullScreen = function () {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            };

            window.isFullScreen = function () {
                if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                    return false;
                } else {
                    return true;
                }
            };
        }
    }, {
        key: 'loadAdsJsThing',
        value: function loadAdsJsThing() {
            // NOTE: Adapted to launchpad : ripped from adManager.js
            var undefined = function () {}();
            window.adSenseHandled = false;
            window.chipSale = undefined;
            window.currentHouseAdRawURLSetting = undefined;
            // ------------------------------------------------------
            // TOGGLE PAID ADS ON/OFF ON CASINO HOME PAGE
            // ------------------------------------------------------

            window.toggleAdvertising = function (adRefresh) {
                console.log("AD MANAGER :: SHOW PAID ADS");
                hideHouseAd();
                console.log(window.APPLICATION_ENV);
                console.log("AD MANAGER :: SHOWING OPEN X ADS");
                loadOpenXAds(adRefresh);
            };

            // layout.phtml loads the adsbygoogle.js script.
            // and does the (adsbygoogle = window.adsbygoogle || []).push({}); initialization line.
            // unfortunately, the open x ad system used id names that aren't general enough.
            // but that's what we're coopting for our ad sense ads
            window.loadAdSenseAds = function () {
                // force this to only execute once.
                if (adSenseHandled !== true) {
                    adSenseHandled = true;
                } else {
                    return;
                }
                console.log("%cAD MANAGER :: SHOWING AD SENSE ADS", "color: Teal");

                if (!chipSale) {
                    var headerDiv = document.getElementById("openxads-header-wrapper");
                    if (headerDiv) {
                        headerDiv.style.height = "90px";
                        // place header unit.
                        var headerAdDiv = document.getElementById("openxads-header-content");
                        if (headerAdDiv) {
                            var newIns = document.createElement('ins');
                            newIns.setAttribute("data-ad-client", "ca-pub-6900566420071976");
                            newIns.setAttribute("data-ad-slot", "6068591241");
                            newIns.className = "adsbygoogle";
                            newIns.style.display = "inline-block";
                            newIns.style.width = "728px";
                            newIns.style.height = "90px";
                            headerDiv.replaceChild(newIns, headerAdDiv);
                        }
                    }
                }

                var footerDiv = document.getElementById("openxads-footer-wrapper");
                if (footerDiv) {
                    footerDiv.style.display = "inline-block";

                    var footerBannerDiv = document.getElementById("openxads-footer-content");
                    if (footerBannerDiv) {
                        var footerIns = document.createElement('ins');
                        footerIns.setAttribute("data-ad-client", "ca-pub-6900566420071976");
                        footerIns.setAttribute("data-ad-slot", "7545324440");
                        footerIns.className = "adsbygoogle";
                        footerIns.style.width = "728px";
                        footerIns.style.height = "90px";
                        footerIns.style.display = "inline-block";

                        footerDiv.replaceChild(footerIns, footerBannerDiv);
                    }
                }

                // var footerLeftDiv = document.getElementById("openxads-footer-square-left");
                // if (footerLeftDiv) {
                // 	footerLeftDiv["data-ad-client"] = "ca-pub-6900566420071976";
                // 	footerLeftDiv["data-ad-slot"] = "1498790846";
                // 	footerLeftDiv.className = "adsbygoogle";
                // 	footerLeftDiv.style.width = "336px";
                // 	footerLeftDiv.style.height = "280px";
                // 	footerLeftDiv.style.display = "inline-block";
                // }

                // var footerRightDiv = document.getElementById("openxads-footer-square-right");
                // if (footerRightDiv) {
                // 	footerRightDiv["data-ad-client"] = "ca-pub-6900566420071976";
                // 	footerRightDiv["data-ad-slot"] = "2975524041";
                // 	footerRightDiv.className = "adsbygoogle";
                // 	footerRightDiv.style.width = "336px";
                // 	footerRightDiv.style.height = "280px";
                // 	footerRightDiv.style.display = "inline-block";
                // }

                (adsbygoogle = window.adsbygoogle || []).push({});
            };

            // ------------------------------------------------------
            // HIDE HOUSE ADS FROM CASINO HOME PAGE
            // ------------------------------------------------------

            window.hideHouseAd = function () {
                console.log("AD MANAGER :: HIDING HOUSE ADS FROM DOM");
                var headerImage = document.getElementById("headerImage");
                if (headerImage) {
                    var headerImageHTML = headerImage.innerHTML;
                    if (headerImageHTML) {
                        if (headerImageHTML.indexOf("csale_") > 0) {
                            chipSale = true;
                            return;
                        }
                    }
                }

                var targetDiv = document.getElementById("houseads-content");
                if (targetDiv) {
                    targetDiv.style.display = "none";
                }
            };

            // reloads the house ad's image with a fresh language check.
            window.changeHouseAdLanguage = function () {
                console.log("AD MANAGER :: CHANGE HOUSE AD LANGUAGE");
                var banner = document.getElementById("houseAdBannerImage");
                // delay is so that the ajax call for changing language has time to come back.
                // otherwise getLanguageCode still returns the previous language.
                setTimeout(timeoutChangeHouseAdLanguage, 10000, banner);
                // if (banner != null) {
                // 	if (currentHouseAdRawURLSetting != null) {
                // 		banner.src = window.CONTENT_PATH + (currentHouseAdRawURLSetting.replace("{lang}", getLanguageCode()));
                // 	}
                // }
            };

            // I'm not proud of this, but common.js apparently wasn't made with extensibility in mind
            // so I can't readily tell when the language change has actually finished propagating.
            window.timeoutChangeHouseAdLanguage = function (element) {
                if (element != null && currentHouseAdRawURLSetting != null) {
                    element.src = window.CONTENT_PATH + currentHouseAdRawURLSetting.replace("{lang}", getLanguageCode());
                }
            };

            // $("#headerImage").click(function(){buyChips();return false;});
            // $("#headerImageLike").click(function(){showFanEmailDialog("");return false;});
            window.processHouseAdData = function (bannerAssetUrl, adDataJson) {
                console.log("AD MANAGER :: PROCESS HOUSE AD DATA");
                var adData = JSON.parse(adDataJson);
                var targetDiv = document.getElementById("houseads-content"),
                    placeholderHeader = null,
                    bannerImage = null;
                if (targetDiv && targetDiv.style.display !== "none") {
                    console.log("AD MANAGER :: ATTEMPTING TO DISPLAY HOUSE AD");
                    // when the user gets disconnected, the server currently resends the mpe offer.
                    // this created the possibility of having two banner ads side by side.
                    // so adding this check just so there is no way that can ever happen.
                    var checkForOldImage = document.getElementById("houseAdBannerImage");
                    if (checkForOldImage != null) {
                        targetDiv.removeChild(checkForOldImage);
                    }

                    bannerImage = document.createElement("img");
                    bannerImage.style.cursor = "pointer";
                    bannerImage.id = "houseAdBannerImage";
                    bannerImage.onload = function () {
                        bannerImage.onload = null; // unmap so this stuff can only ever happen once.

                        placeholderHeader = document.getElementById("headerImage");
                        if (placeholderHeader != null) {
                            targetDiv.removeChild(placeholderHeader);
                        }
                        placeholderHeader = document.getElementById("headerImageLike");
                        if (placeholderHeader != null) {
                            targetDiv.removeChild(placeholderHeader);
                        }
                        targetDiv.appendChild(bannerImage);

                        hookupBannerImageClickListener(bannerImage, adData);
                    };
                    currentHouseAdRawURLSetting = bannerAssetUrl; // save this in case we need to refresh the ad's appearance later.
                    bannerImage.src = window.CONTENT_PATH + bannerAssetUrl.replace("{lang}", getLanguageCode());
                }
            };

            // The snake that eats its own tail, forever and ever.
            window.hookupBannerImageClickListener = function (bannerImageElement, adData) {
                bannerImageElement.onclick = function () {
                    bannerImageElement.onclick = null;
                    thisMovie().sendPromoDataToFlash(adData);
                    setTimeout(hookupBannerImageClickListener, 5000, bannerImageElement, adData); // spam prevention.
                }.bind(this);
            };

            // ------------------------------------------------------
            // LOAD OPENX ADS AND DISPLAY ON CASINO HOME PAGE
            // ------------------------------------------------------
            window.loadOpenXAds = function (adRefresh) {
                console.log("AD MANAGER :: SHOWING OPENX ADS");

                var openxAPIObject = OX_DoubleDown();

                if (!chipSale) {
                    openxAPIObject.addAdUnit("538114617");
                    openxAPIObject.setAdUnitSlotId("538114617", "openxads-header-content");
                    //Fallback ad pulled from the current DOM value
                    //var houseAdsContent = document.getElementById("headerImage");
                    //openxAPIObject.setAdUnitFallback("538114617", houseAdsContent.firstChild.src)
                }
                openxAPIObject.addAdUnit("538114618");
                openxAPIObject.setAdUnitSlotId("538114618", "openxads-footer-content");
                openxAPIObject.addAdUnit("538114619");
                openxAPIObject.setAdUnitSlotId("538114619", "openxads-footer-square-left");
                openxAPIObject.addAdUnit("538114620");
                openxAPIObject.setAdUnitSlotId("538114620", "openxads-footer-square-right");
                openxAPIObject.setRefreshDelay(adRefresh);
                openxAPIObject.setRefreshMax(200);
                openxAPIObject.load();

                var headerDiv = document.getElementById("openxads-header-wrapper");
                if (headerDiv && !chipSale) {
                    headerDiv.style.height = "90px";
                }
                var footerDiv = document.getElementById("openxads-footer-wrapper");
                if (footerDiv) {
                    footerDiv.style.display = "inline-block";
                }
            };

            window.loadAdSenseScript = function (callback) {
                // Adding the script tag to the head as suggested before
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";

                // onload doesn't work on IE8 and before.
                // so listening to onreadystatechange for that browser.
                script.onreadystatechange = callback;
                script.onload = callback;

                // Fire the loading
                head.appendChild(script);
            };

            // ------------------------------------------------------
            // SETUP UI ELEMENTS RELATED TO AVERTISING
            // ------------------------------------------------------

            window.setupAdvertisingUI = function () {
                console.log("AD MANAGER :: SETTING UP UI ELEMENTS FOR ADS");

                var houseAdsContent = document.getElementById("houseads-content");
                if (houseAdsContent) {
                    houseAdsContent.style.zIndex = "1";
                    houseAdsContent.style.position = "relative";
                    houseAdsContent.style.height = "90px";
                }
                var openXHeaderContent = document.getElementById("openxads-header-wrapper");
                if (openXHeaderContent && !chipSale) {
                    openXHeaderContent.style.zIndex = "1";
                    openXHeaderContent.style.position = "relative";
                }
                var openXFooterContent = document.getElementById("openxads-footer-wrapper");
                if (openXFooterContent) {
                    openXFooterContent.style.zIndex = "1";
                    openXFooterContent.style.position = "relative";
                    openXFooterContent.style.top = "-49px";
                }
                var casinoContentWrapper = document.getElementById("content-nowrapper");
                if (casinoContentWrapper) {
                    casinoContentWrapper.style.overflow = "hidden";
                }
                var casinoBodyLayout = document.getElementById("casino-body");
                var casinoBodyFB = document.getElementById("casino");
                if (casinoBodyLayout) {
                    var landingLogo = document.getElementById("login_logo center");
                    if (!landingLogo) {
                        casinoBodyLayout.style.position = "relative";
                        casinoBodyLayout.style.top = "-49px";
                    }
                } else if (casinoBodyFB) {
                    casinoBodyFB.style.position = "relative";
                    casinoBodyFB.style.top = "-49px";
                }
                var bgBottomDiv = document.getElementById("bgBottom");
                if (bgBottomDiv) {
                    bgBottomDiv.style.top = "-49px";
                    bgBottomDiv.style.position = "relative";
                    bgBottomDiv.style.height = "70px";
                }
            };
            setupAdvertisingUI();
        }
    }, {
        key: 'loadBuyChipsThing',
        value: function loadBuyChipsThing() {
            // NOTE: Adapted for launchpad : ripped from buy-chips.js

            // This kills custom XDomainRequest Support in IE8
            $.support.cors = true;

            // Ajax transport method for cross domain requests when using IE9
            if ('XDomainRequest' in window && window.XDomainRequest !== null) {
                $.ajaxTransport("+*", function (options, originalOptions, jqXHR) {
                    // verify if we need to do a cross domain request
                    // if not return so we don't break same domain requests
                    if (typeof options.crossDomain === 'undefined' || !options.crossDomain) {
                        return;
                    }

                    var xdr;

                    return {
                        send: function send(headers, completeCallback) {
                            // Use Microsoft XDR
                            xdr = new XDomainRequest();
                            xdr.open("get", options.url); // NOTE: make sure protocols are the same otherwise this will fail silently
                            xdr.onload = function () {
                                if (this.contentType.match(/\/xml/)) {
                                    var dom = new ActiveXObject("Microsoft.XMLDOM");
                                    dom.async = false;
                                    dom.loadXML(this.responseText);
                                    completeCallback(200, "success", [dom]);
                                } else {
                                    completeCallback(200, "success", [this.responseText]);
                                }
                            };

                            xdr.onprogress = function () {};

                            xdr.ontimeout = function () {
                                completeCallback(408, "error", ["The request timed out."]);
                            };

                            xdr.onerror = function () {
                                completeCallback(404, "error", ["The requested resource could not be found."]);
                            };

                            xdr.send();
                        },
                        abort: function abort() {
                            if (xdr) {
                                xdr.abort();
                            }
                        }
                    };
                });
            }

            // TODO:  Clean this up.  This is bad m'kay?
            window.buyChipsJSStr = [
            // 0
            {
                'de_DE': 'Wird geladen, bitte warten ...',
                'es_ES': 'Cargando...',
                'en_US': 'Loading, please wait...',
                'fr_FR': 'Chargement en cours, veuillez patienter...',
                'it_IT': 'Caricamento, attendere prego...',
                'pt_PT': 'Carregando, aguarde...'
            },
            // 1
            {
                'de_DE': 'WÃ¤hle ein Chip-Paket',
                'es_ES': 'Elige una oferta de fichas',
                'en_US': 'Select a Chip Package',
                'fr_FR': 'Choisissez un ensemble de jetons',
                'it_IT': 'Seleziona un pacchetto di chip',
                'pt_PT': 'Selecione um Pacote de fichas'
            },
            // 2
            {
                'de_DE': 'Warte bitte, wÃ¤hrend wir deine Chips ablegen!',
                'es_ES': 'Te estamos ingresando las fichas.',
                'en_US': 'Please wait while we deposit your chips!',
                'fr_FR': 'Patiente quelques instants, nous ajoutons les jetons Ã  ton solde !',
                'it_IT': 'Attendere. Stiamo depositando le tue chips.',
                'pt_PT': 'Te estamos ingresando las fichas.'
            },
            // 3
            {
                'de_DE': 'Der Aktionscode, den du einl&ouml;sen m&ouml;chtest, wurde anscheinend falsch eingegeben oder ist nicht mehr g&uuml;ltig.',
                'es_ES': 'El c&oacute;digo promocional que deseas canjear es incorrecto o ya no es v&aacute;lido.',
                'en_US': 'The promotion code you are trying to redeem appears to have been entered incorrectly or is no longer valid.',
                'fr_FR': 'Le code de promotion que vous essayez d\'&eacute;changer semble avoir &eacute;t&eacute; mal saisi ou a expir&eacute;.',
                'it_IT': 'Il codice promozionale che stai cercando di riscattare potrebbe non essere stato inserito correttamente o non essere pi&ugrave; valido.',
                'pt_PT': 'O c&oacute;digo promocional que voc&ecirc; est&aacute; tentanto resgatar parece ter sido submetido incorretamente ou n&atilde;o estar mais v&aacute;lido.'
            },
            // 4
            {
                'de_DE': 'Gl&uuml;ckwunsch!',
                'es_ES': '&iexcl;Enhorabuena!',
                'en_US': 'Congratulations!',
                'fr_FR': 'F&eacute;licitations !',
                'it_IT': 'Congratulazioni!',
                'pt_PT': 'Parab&eacute;ns!'
            },
            // 5
            {
                'de_DE': 'Du hast gerade:',
                'es_ES': 'Fichas que acabas de ganar:',
                'en_US': 'You\'ve been awarded:',
                'fr_FR': '&nbsp;',
                'it_IT': 'Hai ricevuto in premio:',
                'pt_PT': 'Voc&ecirc; ganhou'
            },
            // 6
            {
                'de_DE': 'Chips erhalten!',
                'es_ES': '&nbsp;',
                'en_US': 'chips!',
                'fr_FR': 'jetons viennent de vous &ecirc;tre attribu&eacute;s!',
                'it_IT': 'chips!',
                'pt_PT': 'fichas!'
            },
            // 7
            {
                'de_DE': 'Weiter',
                'es_ES': 'Continuar',
                'en_US': 'Continue',
                'fr_FR': 'Continuer',
                'it_IT': 'Continua',
                'pt_PT': 'Continuar'
            },
            // 8
            {
                'de_DE': 'CHIPS KAUFEN!',
                'es_ES': '&iexcl;COMPRAR FICHAS!',
                'en_US': 'BUY CHIPS!',
                'fr_FR': 'ACHETER DES JETONS!',
                'it_IT': 'COMPRA CHIPS!',
                'pt_PT': 'COMPRAR FICHAS!'
            },
            // 9
            {
                'de_DE': 'Das Beliebteste!',
                'es_ES': '&iexcl;M&aacute;s popular!',
                'en_US': 'Most Popular!',
                'fr_FR': 'Le plus populaire!',
                'it_IT': 'Pi&ugrave; popolare!',
                'pt_PT': 'Mais popular!'
            },
            // 10
            {
                'de_DE': 'Das Beste von allen!',
                'es_ES': '&iexcl;Mejor compra!',
                'en_US': 'Best All Around!',
                'fr_FR': 'Le meilleur de tous !',
                'it_IT': 'Pi&ugrave; completo!',
                'pt_PT': 'Melhor, imposs&iacute;vel!'
            },
            // 11
            {
                'de_DE': 'Uh-oh!  We seem to have run into an error.',
                'es_ES': 'Uh-oh!  We seem to have run into an error.',
                'en_US': 'Uh-oh!  We seem to have run into an error.',
                'fr_FR': 'Uh-oh!  We seem to have run into an error.',
                'it_IT': 'Uh-oh!  We seem to have run into an error.',
                'pt_PT': 'Uh-oh!  We seem to have run into an error.'
            },
            // 12
            {
                'de_DE': 'Fehler',
                'es_ES': 'Error',
                'en_US': 'Error',
                'fr_FR': 'Erreur',
                'it_IT': 'Errore',
                'pt_PT': 'Erro'
            },
            // 13
            {
                'de_DE': 'OK',
                'es_ES': 'Cerrar',
                'en_US': 'Close',
                'fr_FR': 'Fermer',
                'it_IT': 'Chiudi',
                'pt_PT': 'Fechar'
            },
            // 14
            {
                'de_DE': 'Wenn die Seite zur Bezahlung mit PayPal nicht angezeigt wird, deaktiviere bitte die Popup-Blocker und versuche es erneut.',
                'es_ES': 'Si no ves la p&aacute;gina de pago de PayPal, comprueba que no tengas activado alg&uacute;n bloqueador de ventanas emergentes (pop-ups) y vuelve a intentarlo.',
                'en_US': 'If you do not see the PayPal payment page, please make sure that popup blockers are disabled and try again.',
                'fr_FR': 'Si vous ne parvenez pas &agrave; voir la page de paiement Paypal, assurez-vous dâ€™avoir autoris&eacute; les fen&ecirc;tres pop-up puis essayez &agrave; nouveau.',
                'it_IT': 'Se non riesci a visualizzare la pagina di pagamento PayPal, assicurati che il blocco popup sia disattivato e riprova.',
                'pt_PT': 'Se a p&aacute;gina do PayPal n&atilde;o abrir, desabilite os bloqueadores de popup e tente novamente.'
            },
            // 15 Hack for chips being offline due due membase error
            {
                'de_DE': "Es tut uns Leid aber wir kÃ¶nnen Ihr Einkauf gerade nicht verarbeiten.  Bitte kommen Sie spÃ¤ter zurÃ¼ck oder auf Ihrem Mobil-GerÃ¤t einkaufen.",
                'es_ES': "Lamentamos que no podemos procesar las compras de fichas en este momento. Por favor, vuelva mÃ¡s tarde o haga su compra a travÃ©s de nuestra aplicaciÃ³n mÃ³vil.",
                'en_US': "We are sorry that we are unable to process chip purchases at this time. Please check back later or purchase via our mobile application.",
                'fr_FR': "Nous sommes dÃ©solÃ©s que nous sommes incapables de traiter les achats en ce moment. S'il te plaÃ®t reviens plus tard ou acheter via notre application mobile.",
                'it_IT': "Siamo spiacenti che non siamo in grado di gestire acquisti di chip in questo momento. Chiediamo gentilmente di tornare piÃ¹ tardi o effettuare l'acquisto con un dispositivo mobile.",
                'pt_PT': "Pedimos desculpas por nÃ£o poder processar compras neste momento. Por favor volte mais tarde ou compre fichas no nosso aplicativo mÃ³vel."
            },
            //16
            {
                'de_DE': 'Aufstieg!',
                'es_ES': '&iexcl;PrÃ³xima categorÃ­a!',
                'en_US': 'Tier Up!',
                'fr_FR': 'Niveau supÃ©rieur!',
                'it_IT': 'Sali di grado!',
                'pt_PT': 'NÃ­vel superior!'
            },
            //17
            {
                'de_DE': 'Bestwert!',
                'es_ES': '&iexcl;El Mejor Precio!',
                'en_US': 'Best<br /> Value!',
                'fr_FR': 'Meilleure Offre!',
                'it_IT': 'Offerta Migliore',
                'pt_PT': 'Melhor Valor!'
            },
            //18
            {
                'de_DE': 'Treuepunkte',
                'es_ES': 'Puntos de fidelizaciÃ³n',
                'en_US': 'Loyalty Pts.',
                'fr_FR': 'Points de fidÃ©litÃ©',
                'it_IT': 'Punti FedeltÃ ',
                'pt_PT': 'Pontos de Fidelidade'
            }];

            window.CloseButtonText = buyChipsJSStr[13][languageCode];

            // FUNCTIONS
            window.buttonMaker = function () {

                // button-ify the buttons:
                $(".product_buy").button();
                $("#package_promo_button").button();
                $("#package_promo_remove_button").button();
            };

            window.getProcessorName = function () {

                switch (APPLICATION_ENV) {

                    case "www":
                        return "PayPal";
                        break;

                    case "facebook":
                        return "Facebook";
                        break;

                    default:
                        return "";
                        break;
                }
            };

            // POPULATORS


            // AJAX

            window.removePromotion = function () {

                var json = {
                    providerName: 'Double Down Casino',
                    providerUserId: $("#providerUserId").val()
                };

                $.ajax({
                    type: "POST",
                    url: DEALER_URL + "/promotion/removePromotion",
                    dataType: "json",
                    data: json,
                    cache: false,
                    success: function success(data) {

                        if (data.status !== undefined && data.status === 'success') {

                            $("#package_promo_input").val("");
                            togglePromoButton();
                        }
                    },
                    error: function error() {}
                });
            };

            window.redeemPromotion = function (promo_code, isUrlPid) {

                if (promo_code === undefined) {
                    promo_code = $("#package_promo_input").val();
                }

                var json = {
                    providerName: 'Double Down Casino',
                    providerUserId: $("#providerUserId").val(),
                    promoCode: promo_code,
                    partnerName: $("#partnerName").val()
                };

                $.ajax({
                    type: "POST",
                    url: DEALER_URL + "/promotion/redeemPromotion",
                    dataType: "json",
                    data: json,
                    cache: false,
                    success: function success(data) {

                        if (data.status !== undefined && data.status === 'success') {

                            // if the promo type is 1, then award chips,
                            switch (data.data[0].promo.promo_discount_type_id) {

                                case '1':
                                    awardPromotionChips(data.data[0].promo, isUrlPid);
                                    break;

                                case '2':
                                case '3':
                                    disablePayByMobile(); // for promos that alter package price, disable pay by mobile
                                case '4':
                                    getProductProcessor();
                                    break;

                                default:
                                    getProductProcessor();
                                    break;
                            }
                        }
                    },
                    error: function error(xhr, _error, errorThrown) {

                        if (xhr.status && xhr.status == 404) {

                            var dealerResponse = JSON.parse(xhr.responseText);
                            var languageCode = getLanguageCode();
                            var promoMessage = '';

                            if (dealerResponse.hasOwnProperty("message")) {
                                promoMessage = dealerResponse.message;
                            } else {
                                if (dealerResponse.hasOwnProperty("data")) {
                                    if (dealerResponse.data[0].hasOwnProperty("message")) {
                                        promoMessage = dealerResponse.data[0].message;
                                    }
                                }
                            }

                            var r = convertPromoMessage(promoMessage, languageCode);

                            if (isUrlPid) {
                                var html = '';
                                html = layoutForUrlPidResponse(r, languageCode, false);

                                $('#nav-pages').html(html);
                                $('#nav-pages').dialog({ width: 400, modal: true, resizable: false, close: function close() {
                                        $('#nav-pages').dialog('destroy');
                                    } });
                            } else {
                                $("#buy_chips_message_dialog").html(r);
                                $("#buy_chips_message_dialog").dialog("open");
                            }

                            // clear our the input
                            removePromotion();
                        }
                    }
                });
            };

            window.disablePayByMobile = function () {
                $("#pay_by_mobile").attr("src", "/images/buy_chips/pay_by_mobile_btn_diabled.png");
            };

            window.layoutForUrlPidResponse = function (msg, languageCode, showCongrats) {
                var html = '';
                html += '<span id="pagetitle" style="display:none"><' + '/span>';

                html += '<div id="dialog-wrapper">';

                if (showCongrats) {
                    html += '	<div align="center"><span id="awarded_chips_title">' + buyChipsJSStr[4][languageCode] + '</span></div>';
                }

                html += '	<div align="center" style="margin:20px;">' + msg + '</div>';

                html += '	<div align="center">';
                html += '		<button class="promo-continue-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" onclick="$(\'#nav-pages\').dialog(\'close\');return false;" role="button" aria-disabled="false">';
                html += '			<span class="ui-button-text">' + buyChipsJSStr[7][languageCode] + '</span>';
                html += '		</button>';
                html += '	</div>';

                html += '	<script> $(".promo-continue-button").button(); <' + '/script>';
                html += '</div>';

                return html;
            };

            window.awardPromotionChips = function (promo, isUrlPid) {

                var html = '';
                // get the language code
                var languageCode = getLanguageCode();

                // if this was a URL pid, need to pop up the navpages container
                if (isUrlPid) {
                    var msg = '';
                    msg = buyChipsJSStr[5][languageCode] + ' ' + promo.promo_amount_display + ' ' + buyChipsJSStr[6][languageCode];

                    html = '';
                    html = layoutForUrlPidResponse(msg, languageCode, true);

                    $('#nav-pages').html(html);
                    $('#nav-pages').dialog({ width: 400, modal: true, resizable: false, close: function close() {
                            $('#nav-pages').dialog('destroy');
                        } });
                } else {
                    // otherwise, this div is part of the buy-chips layout
                    // put the html in there
                    html = '';

                    html += '<div id="awarded_chips">';

                    html += '	<span id="awarded_chips_title" class="package_text_chip">';
                    html += '		' + buyChipsJSStr[4][languageCode];
                    html += '	</span>';

                    html += '	<br />';

                    html += '	' + buyChipsJSStr[5][languageCode] + ' ' + promo.promo_amount_display + ' ' + buyChipsJSStr[6][languageCode];

                    html += '	<br />';

                    html += '	<span class="package_button">';
                    html += '		<button id="award_chips_continue" class="package_promo_list_item">';
                    html += '			' + buyChipsJSStr[7][languageCode];
                    html += '		</button>';
                    html += '	</span>';

                    html += '</div>';

                    $("#package_provider_view").fadeOut(500, function () {
                        $("#package_provider_view").html("").html(html);
                        $("#package_promo_input").val("");
                        $("#award_chips_continue").button();
                        $("#package_provider_view").fadeIn(500);
                    });
                }
            };

            // VALIDATE


            // EVENTS

            $(document).on("click", "#award_chips_continue", function () {

                getProductProcessor();
            });

            // click the apply button?  do it up!
            $(document).on("click", '#package_promo_button', function () {

                if ($("#package_promo_input").val() === "") {

                    $("#package_promo_input").effect("highlight", {}, 500);
                } else {

                    if ($('#package_promo_button').is(':enabled')) {

                        $("#package_promo_button").attr("disabled", "disabled");
                        setTimeout(function () {
                            reEnableApplyButton();
                        }, 1000);

                        redeemPromotion();
                    }
                }
            });

            //click the remove button?  do it up!
            $(document).on("click", '#package_promo_remove_button', function () {

                removePromotion();
                getProductProcessor();
            });

            window.reEnableApplyButton = function () {
                $("#package_promo_button").removeAttr("disabled");
            };

            // hit enter?  go search that USER ID
            $(document).on("keypress", '#package_promo_button', function (e) {

                if (e.which === 13) {

                    if ($('#package_promo_button').is(':enabled')) {

                        $("#package_promo_button").attr("disabled", "disabled");
                        setTimeout(function () {
                            reEnableApplyButton();
                        }, 1000);

                        redeemPromotion();
                    }
                }
            });

            window.initializePayByMobileDialog = function () {
                // pay by mobile dialog
                $("#pay_by_mobile_dialog").dialog({
                    autoOpen: false,
                    modal: true,
                    title: "Pay By Mobile",
                    closeOnEscape: true,
                    width: 700
                });
            };

            // FB Carrier Billing
            $(document).on("click", "#pay_by_mobile", function () {
                var json = {
                    processorName: "Facebook Mobile",
                    providerName: 'Double Down Casino',
                    productType: 'Chip',
                    providerUserId: $("#providerUserId").val(),
                    partnerName: $("#partnerName").val()
                };

                initializePayByMobileDialog();

                $.ajax({
                    type: 'POST',
                    url: DEALER_URL + '/purchase/getProductProcessor',
                    dataType: 'json',
                    data: json,
                    success: function success(data) {
                        // get the language code
                        var languageCode = getLanguageCode();
                        var processorName = getProcessorName();

                        if (!data.data[0]) {
                            $("#pay_by_mobile_dialog").html("<div> We are sorry. Pay By Mobile is not available for your country/carrier.</div>").dialog("open");
                        } else {
                            var html = getMobileStoreHTML(data.data[0].productsByCountry, languageCode, processorName);
                            $("#pay_by_mobile_dialog").html("<div class='package'>" + html + "</div>").dialog("open");
                        }
                    },
                    error: function error(xhr, statusText) {
                        $("#pay_by_mobile_dialog").html("<div> We are sorry. Pay By Mobile is not available for your country/carrier.</div>").dialog("open");
                    }
                });
            });

            window.getMobileStoreHTML = function (productsByCountry, languageCode, processorName) {
                var productHTML = '';
                var selectHTML = 'Select your country: <select class="pay_by_mobile_countries toggle">';

                // Get html for each of the countries.
                $.each(productsByCountry, function (country, products) {
                    selectHTML += '<option value="' + country + '">' + country + '</option>';
                    productHTML += '<div class="hidden countryPrices ' + country + '">' + getProductHTML(this, languageCode, processorName);
                    productHTML += '</div>';
                });
                selectHTML += '</select>';

                var html = '<div class="pay_by_mobile_data">' + selectHTML + productHTML + '</div>';
                return html;
            };

            $(document).on("change", ".pay_by_mobile_countries", function () {
                // hide all divs
                $('.pay_by_mobile_data .countryPrices').hide();

                // show relevant country
                var country = $(this).val();
                $("." + country).toggle('slow');
            });

            // buy chips facebook click
            $("#package_provider_view").on("click", ".package_buy_facebook", function () {

                // parse int the packageId
                var packageId = parseInt($(this).val(), 10);

                // call the function in the JS socialWrapper/facebookWrapper
                buyChipsFBFormSubmit(packageId);
            });

            // buy chips facebook click
            $(document).on("click", ".product_buy_onclick", function () {

                // parse int the packageId
                var product_id = parseInt($(this).val(), 10);

                // grab the pricepointid and cost data in case its carrier billing
                var pricepoint_id = $(this).attr('data-pricepoint-id');
                var cost = $(this).attr('data-cost');
                var costVal = cost.replace('$', '');

                // call the function in the JS socialWrapper/facebookWrapper
                buildChipPayload(product_id, pricepoint_id, costVal);
            });

            window.openFacebookDialog = function (messageType, chipsNeeded, gameName) {

                // get the language code
                var languageCode = getLanguageCode();

                // make the dialog
                $('#nav-pages').html('<div id="dialog-wrapper"><strong>' + buyChipsJSStr[0][languageCode] + '</strong></div>');
                $('#nav-pages').dialog({
                    title: buyChipsJSStr[1][languageCode],
                    width: 700,
                    height: 700,
                    modal: true,
                    resizable: false,
                    draggable: false,
                    close: function close() {

                        // clear out the users promo when they close the dialog box
                        // removed for MPE
                        //removePromotion();

                        // destroy the dialog
                        $('#nav-pages').dialog('destroy');
                    }
                });

                $('#nav-pages').find('ui-dialog-titlebar').remove();

                // build the params
                var params = {};
                params.fbuid = FBUID;
                params.userId = $("#userId").val();
                params.ajax = 1;
                params.page = "facebook";

                // check if its a signed request
                if (SIGNED_REQUEST) {

                    params.signed_request = SIGNED_REQUEST;
                }

                // check the messageType
                //Paul F - I have no idea why this is here or why it would be needed, nor does Remy.
                /*if (messageType) {
                		params.messageType = messageType;
                	$.cookie('buyChipsPopup_' + FBUID, 'true', { expires: 1 });
                }*/

                // check to see if chips are needed
                if (chipsNeeded) {

                    params.chipsNeeded = chipsNeeded;
                }

                // set the gameName
                if (gameName) {

                    params.gameName = gameName;
                }

                params.providerName = 'Double Down Casino';
                params.providerUserId = $("#providerUserId").val();

                $.ajax({
                    type: 'GET',
                    url: "/order/buy-chips-package",
                    dataType: 'json',
                    data: params,
                    complete: function complete(xhr, statusText) {
                        if (statusText === 'error') {

                            if (xhr.status === 401) {

                                $('#nav-pages').dialog('close');
                                alert('Your session has expired.  Click OK to login again');
                                window.location = '/';
                            } else {

                                $('#nav-pages').html(xhr.responseText);
                                $('#nav-pages').dialog('option', 'position', 'center');
                                $('#nav-pages').dialog('option', 'title', $('#pagetitle').html());
                            }
                        } else {

                            $('#nav-pages').html(xhr.responseText);

                            getProductProcessor();
                        }
                    }
                });
            };

            window.openPayPalDialog = function (messageType, chipsNeeded, gameName) {

                // get the language code
                var languageCode = getLanguageCode();

                // make the dialog
                $('#nav-pages').html('<div id="dialog-wrapper"><strong>' + buyChipsJSStr[0][languageCode] + '</strong></div>');
                $('#nav-pages').dialog({
                    title: buyChipsJSStr[1][languageCode],
                    width: 700,
                    height: 700,
                    modal: true,
                    resizable: false,
                    draggable: false,
                    close: function close() {

                        // clear out the users promo when they close the dialog box
                        // removed for MPE
                        //removePromotion();

                        // destroy the dialog
                        $('#nav-pages').dialog('destroy');
                    }
                });

                $('#nav-pages').find('ui-dialog-titlebar').remove();

                // build the params
                var params = {};
                params.fbuid = FBUID;
                params.userId = $("#userId").val();
                params.ajax = 1;
                params.page = "paypal";

                // check if its a signed request
                if (SIGNED_REQUEST) {

                    params.signed_request = SIGNED_REQUEST;
                }

                // check the messageType
                //Paul F - I have no idea why this is here or why it would be needed, nor does Remy.
                /*if (messageType) {
                		params.messageType = messageType;
                	$.cookie('buyChipsPopup_' + FBUID, 'true', { expires: 1 });
                }*/

                // check to see if chips are needed
                if (chipsNeeded) {

                    params.chipsNeeded = chipsNeeded;
                }

                // set the gameName
                if (gameName) {

                    params.gameName = gameName;
                }

                params.providerName = 'Double Down Casino';
                params.providerUserId = $("#providerUserId").val();

                $.ajax({
                    type: 'GET',
                    url: "/order/buy-chips-package",
                    dataType: 'json',
                    data: params,
                    complete: function complete(xhr, statusText) {
                        if (statusText === 'error') {

                            if (xhr.status === 401) {

                                $('#nav-pages').dialog('close');
                                alert('Your session has expired.  Click OK to login again');
                                window.location = '/';
                            } else {

                                $('#nav-pages').html(xhr.responseText);
                                $('#nav-pages').dialog('option', 'position', 'center');
                                $('#nav-pages').dialog('option', 'title', $('#pagetitle').html());
                            }
                        } else {

                            $('#nav-pages').html(xhr.responseText);

                            getProductProcessor();
                        }
                    }
                });
            };

            window.setMPEPromo = function (promoCode, callback) {

                var json = {
                    providerName: 'Double Down Casino',
                    providerUserId: $("#providerUserId").val(),
                    promoCode: promoCode
                };

                $.ajax({
                    type: 'POST',
                    url: DEALER_URL + '/promotion/setCachedPromoCode',
                    dataType: 'json',
                    data: json,
                    success: function success(data) {
                      if(callback){
                        callback(data);
                      }
                    },
                    error: function error(xhr, statusText) {
                        alert('There was an error attaching you to this promo.');
                    }
                });
            };

            window.buyChips = function (messageType, chipsNeeded, gameName) {

                if (APPLICATION_ENV === 'wildtangent') {

                    thisMovie().openBuyChipsFromJS();
                } else if (APPLICATION_ENV === 'facebook') {
                    //buyChipsOffline();
                    openFacebookDialog(messageType, chipsNeeded, gameName);
                } else if (APPLICATION_ENV === 'www') {
                    //buyChipsOffline();
                    openPayPalDialog(messageType, chipsNeeded, gameName);
                } else {

                    alert('cannot buy chips for this environment: ' + APPLICATION_ENV);
                }
            };

            window.buyChipsOffline = function () {

                // get the language code
                var languageCode = getLanguageCode();

                // make the dialog
                $('#nav-pages').html('<div id="dialog-wrapper"><strong>' + buyChipsJSStr[0][languageCode] + '</strong></div>');
                $('#nav-pages').dialog({
                    title: buyChipsJSStr[1][languageCode],
                    width: 700,
                    height: 200,
                    modal: true,
                    resizable: false,
                    draggable: false,
                    close: function close() {

                        // clear out the users promo when they close the dialog box
                        // removed for MPE
                        //removePromotion();

                        // destroy the dialog
                        $('#nav-pages').dialog('destroy');
                    }
                });

                $('#nav-pages').find('ui-dialog-titlebar').remove();
                $('#nav-pages').html(buyChipsJSStr[15][languageCode]);
            };

            window.displayProduct = function (data) {
                // get the language code
                var languageCode = getLanguageCode();
                var processorName = getProcessorName();
                var html = getProductHTML(data, languageCode, processorName);

                if (data.loyaltyMemberTier != null && data.loyaltyMemberTier !== 'NONE') {
                    html = getLoyaltyProductHTML(data, languageCode, processorName);
                }

                // put the html in there
                $("#package_provider_view").fadeOut(500, function () {

                    $("#package_provider_view").html("").html(html);
                    buttonMaker();

                    var processorName = getProcessorName();

                    // push it
                    _gaq.push(['_trackPageview', '/' + processorName + '_new_buyChips']);

                    if (data.loyaltyMemberTier !== undefined && data.loyaltyMemberTier !== 'NONE') {
                        //loyalty classes
                        $('#nav-pages').css('visibility', 'hidden');
                        $('#nav-pages').height(720);
                        $('#nav-pages').addClass('loyalty_buyChips_background');
                        $('#nav-pages').removeClass('ui-widget-content');
                        $('#nav-pages').css('background', '#000');
                        $('#package_promo').addClass('loyalty_promos');
                        $('#package_promo').addClass('loyalty_promos_' + languageCode);
                    }

                    $("#package_provider_view").fadeIn(500, function () {
                        $('#nav-pages').dialog('option', 'position', 'center');
                    });

                    $('#nav-pages').css('visibility', 'visible');
                });
            };

            window.getProductHTML = function (data, languageCode, processorName) {
                // default the html to blank
                var html = '';

                html += '<div id="payment_section">';
                html += '	<ul class="package_list">';

                for (var i = 0, len = data.product.length; i < len; i++) {

                    html += '		<li class="package_list_item">';

                    // chips
                    html += '			<div class="package_list_item_unit package_text package_text_chip">';

                    html += '				<span class="package_chip ';
                    switch (i) {

                        case 5:
                        case 11:
                            html += '					  greenText">';
                            break;

                        default:
                            html += '					">';
                            break;
                    }
                    html += '					' + data.product[i].product_quantity_display;
                    html += '				</span>';
                    html += '				<br />';
                    html += '				<span class="package_sub_chip package_sub_chip_linethrough">';

                    if (data.product[i].product_quantity > data.product[i].product_quantity_original) {

                        html += '					' + data.product[i].product_quantity_original_display;
                    }

                    html += '				</span>';
                    html += '			</div>';

                    // credits
                    html += '			<div class="package_list_item_unit package_text package_text_amount">';
                    html += '				<span class="package_amount">';
                    // TODO: currency symbol change
                    html += '					' + data.product[i].product_cost_display;
                    html += '				</span>';
                    html += '				<br />';
                    html += '				<span class="package_sub_amount package_sub_amount_linethrough">';

                    if (data.product[i].product_cost < data.product[i].product_cost_original) {

                        html += '					' + data.product[i].product_cost_original_display;
                    }

                    html += '				</span>';
                    html += '			</div>';

                    // button
                    var pricePointId = data.product[i].pricepoint_id ? data.product[i].pricepoint_id : null;
                    html += '			<div class="package_list_item_unit package_text package_text_button">';
                    html += '				<span class="package_button">';
                    html += '					<button id="product' + data.product[i].product_id + '" class="product_buy product_buy_onclick" name="product_id"' + 'value="' + data.product[i].product_id + '" data-pricepoint-id = "' + pricePointId + '"' + 'data-cost = "' + data.product[i].product_cost_display + '">';
                    html += '						' + buyChipsJSStr[8][languageCode];
                    html += '					</button>';
                    html += '				</span>';
                    html += '				<br />';
                    html += '				<span class="package_sub_button">';

                    switch (i) {

                        case 3:
                            html += '					' + buyChipsJSStr[9][languageCode];
                            break;

                        case 5:
                        case 11:
                            html += '					' + buyChipsJSStr[10][languageCode];

                            break;

                        default:
                            html += '					';
                            break;
                    }

                    html += '				</span>';
                    html += '			</div>';

                    html += '		</li>';
                }

                html += '	</ul>';
                html += '</div>';

                return html;
            };

            window.getLoyaltyProductHTML = function (data, languageCode, processorName) {
                //setup classes
                var loyaltyMemberClass = '';
                var loyaltyChipsTextClass = '';
                var loyaltyUpgradeClass = '';
                var loyaltyHeaderClass = '';
                var loyaltyArrowClass = '';
                var loyaltyUpdateBadgeProductIndex = -1;

                if (data.loyaltyMemberTier !== undefined && data.loyaltyMemberTier !== '') {
                    if (data.loyaltyMemberTier == "BASE") {
                        loyaltyMemberClass = 'chips_black';
                        loyaltyChipsTextClass = 'chips_text_black';
                        loyaltyHeaderClass = '';
                        loyaltyArrowClass = 'arrow_black';
                        loyaltyUpgradeClass = '';
                    } else {
                        loyaltyMemberClass = 'chips_' + data.loyaltyMemberTier.toLowerCase();
                        loyaltyChipsTextClass = 'chips_text_' + data.loyaltyMemberTier.toLowerCase();
                        loyaltyHeaderClass = 'loyalty_tier_header_' + data.loyaltyMemberTier.toLowerCase();
                        loyaltyArrowClass = 'arrow_' + data.loyaltyMemberTier.toLowerCase();
                        loyaltyUpgradeClass = 'package_upgrade_' + data.loyaltyNextTier.toLowerCase();
                    }
                }

                //calculate next tier up package for loyalty - no upgrade for black, that's the top tier
                if (data.loyaltyMemberTier.toLowerCase() != 'black' && data.loyaltyMemberTier.toLowerCase() != 'base') {
                    for (var i = 0, len = data.product.length; i < len; i++) {
                        if (loyaltyUpdateBadgeProductIndex == -1 && data.loyaltyPointsToNextTier <= data.product[i].product_point) {
                            loyaltyUpdateBadgeProductIndex = i;
                        }
                    }
                }

                // default the html to blank
                var one_line_class = '';
                var two_line_class = '';
                var html = '';

                html += '<div class="' + loyaltyHeaderClass + '">&nbsp;</div>';

                html += '<div id="payment_section">';
                html += '	<ul class="package_list loyalty">';

                for (var i = 0; i < data.product.length; i++) {

                    html += '		<li>';

                    // chips
                    html += '			<div class="package_list_item_unit package_text package_text_chip ' + loyaltyMemberClass + ' ' + loyaltyChipsTextClass + '">';

                    html += '				<span class="package_chip">';
                    html += '					' + data.product[i].product_quantity_display;
                    html += '				</span>';
                    html += '				<br />';
                    html += '				<span class="package_sub_chip package_sub_chip_linethrough">';
                    if (data.product[i].product_quantity > data.product[i].product_quantity_original) {
                        html += '					' + data.product[i].product_quantity_original_display;
                    }
                    html += '				</span>';
                    html += '			</div>';

                    // loyalty points
                    html += '			<div class="package_list_item_unit package_text package_text_amount ' + loyaltyMemberClass + '">';
                    html += '				<span class="package_amount ' + loyaltyChipsTextClass + '">';
                    html += '					+' + data.product[i].product_point + ' ' + buyChipsJSStr[18][languageCode];
                    html += '				</span>';
                    html += '			</div>';

                    // colored arrow
                    html += '			<div class="package_list_item_unit package_arrow ">';
                    html += '				<div class="' + loyaltyArrowClass + '">';
                    html += '					&nbsp;';
                    html += '				</div>';
                    html += '			</div>';

                    if (i === loyaltyUpdateBadgeProductIndex) {
                        two_line_class = languageCode !== 'en_US' && languageCode !== 'de_DE' ? 'two_lines' : '';
                        // stickers - upgrade loyalty tier
                        html += '			<div class="package_list_item_unit package_stickers">';
                        html += '				<div class="package_upgrade_sticker ' + loyaltyUpgradeClass + ' ' + two_line_class + '">';
                        html += '					<div class="package_upgrade_text">' + buyChipsJSStr[16][languageCode] + '</div>';
                        html += '				</div>';
                        html += '			</div>';
                    } else if (i === 5 || i === 11) {

                        one_line_class = languageCode === 'de_DE' ? 'one_line' : '';

                        //$99 product - best deal sticker
                        html += '			<div class="package_list_item_unit package_stickers">';
                        html += '				<div class="package_popular_sticker package_best_deal_sticker ' + one_line_class + '">';
                        html += '					' + buyChipsJSStr[17][languageCode];
                        html += '				</div>';
                        html += '			</div>';
                    } else if (i === 3 && loyaltyUpdateBadgeProductIndex < 3) {
                        //$49 product - most popular
                        //Sticker display rule - If the Tier Up package is more expensive then the Most Popular (so 59.99 or 99.99) do not show Most Popular.
                        html += '			<div class="package_list_item_unit package_stickers">';
                        html += '				<div class="package_popular_sticker">';
                        html += '					' + buyChipsJSStr[9][languageCode];
                        html += '				</div>';
                        html += '			</div>';
                    } else {
                        //empty sticker cell
                        html += '			<div class="package_list_item_unit package_stickers">';
                        html += '				<div class="package_upgrade_sticker">';
                        html += '					&nbsp;';
                        html += '				</div>';
                        html += '			</div>';
                    }

                    // button + price
                    // TODO: currency symbol change
                    var pricePointId = data.product[i].pricepoint_id ? data.product[i].pricepoint_id : null;
                    html += '			<div class="package_list_item_unit package_text package_text_button">';
                    html += '				<span class="package_button">';
                    html += '					<button id="product' + data.product[i].product_id + '" class="buy_chips product_buy_onclick" name="product_id"' + 'value="' + data.product[i].product_id + '" data-pricepoint-id = "' + pricePointId + '"' + 'data-cost = "' + data.product[i].product_cost_display + '">';
                    html += '						' + data.product[i].product_cost_display;

                    if (data.product[i].product_cost < data.product[i].product_cost_original) {

                        html += '				<span class="package_sub_amount package_sub_amount_linethrough">';
                        html += '					' + data.product[i].product_cost_original_display;
                        html += '				</span>';
                        html += '			</span>';
                    }

                    html += '					</button>';
                    html += '				</span>';
                    html += '				<br />';
                    html += '			</div>';

                    html += '		</li>';
                }

                html += '	</ul>';
                html += '</div>';

                return html;
            };

            window.getProductProcessor = function () {

                // get the processor we're going with to pay:
                var processorName = getProcessorName();

                var json = {
                    processorName: processorName,
                    providerName: 'Double Down Casino',
                    productType: 'Chip',
                    providerUserId: $("#providerUserId").val(),
                    partnerName: $("#partnerName").val()
                };

                $.ajax({
                    type: 'POST',
                    url: DEALER_URL + '/purchase/getProductProcessor',
                    headers: {'authorization': 'Bearer ' + config.authInfo.dealer.jwt},
                    dataType: 'json',
                    data: json,
                    success: function success(data) {

                        displayProduct(data.data[0]);
                    },
                    error: function error(xhr, statusText) {}
                });

                togglePromoButton();
            };

            // do some finesse to get the code
            window.getLanguageCode = function () {

                var languageCode = 'en_US';
                languageCode = $("#languageCode").val();

                if (languageCode === '') {

                    languageCode = commonLangaugeSetTo;
                }

                // set this in the dialog too
                if ($("#buy_chips_message_dialog").hasClass('ui-dialog-content')) {

                    $('#buy_chips_message_dialog').dialog('option', 'title', buyChipsJSStr[12][languageCode]);
                    var CloseButtonText = buyChipsJSStr[13][languageCode];
                    $('#buy_chips_message_dialog').dialog('option', 'buttons', [{ text: "OK", click: function click() {
                            $(this).dialog("close");
                        } }]);
                }

                return languageCode;
            };

            window.buildChipPayload = function (product_id, pricepoint_id, cost) {

                var json = {
                    productId: product_id,
                    providerName: 'Double Down Casino',
                    providerUserId: $("#providerUserId").val(),
                    partnerName: $("#partnerName").val()
                };

                // make sure we have the value set before we
                // send it over:
                if ($("#campaignId").val() != 'undefined') {
                    json.campaignId = $("#campaignId").val();
                }

                // if theres a pricepointid and cost set, then we are trying to do carrier billing - so add that info to payload
                if (cost && pricepoint_id && pricepoint_id != "null") {
                    var pricePointJson = { pricepoint_id: pricepoint_id, pricePointId: pricepoint_id, cost: cost };
                    $.extend(true, json, pricePointJson);
                }

                // call to dealer this info
                $.ajax({
                    type: 'POST',
                    url: DEALER_URL + '/purchase/buildProductPayload',
                    dataType: 'json',
                    data: json,
                    success: function success(data) {

                        if (data.status !== undefined && data.status === 'success') {

                            // get the language code
                            var languageCode = getLanguageCode();

                            // get the processor name
                            var processorName = getProcessorName();

                            if (processorName == 'PayPal') {

                                $('#package_provider_view').html('<div id="dialog-wrapper"><strong style="font-size: 1.5em;">' + buyChipsJSStr[2][languageCode] + '<br>' + buyChipsJSStr[14][languageCode] + '</strong></div>');
                            } else {

                                $('#package_provider_view').html('<div id="dialog-wrapper"><strong style="font-size: 1.5em;">' + buyChipsJSStr[2][languageCode] + '</strong></div>');
                            }

                            switch (processorName) {

                                case "Facebook":
                                    // this is in socialWrappers/facebookWrapper.js
                                    buyChipsFacebook(data.data[0]);
                                    break;

                                case "PayPal":
                                    buyChipsPayPal(data.data[0]);
                                    break;

                                default:
                                    alert("There was an error building the chip payload.");
                                    break;

                            }
                        }
                    },
                    error: function error(jqXHR, textStatus, errorThrown) {

                        alert('Sorry, we seem to have run into an error when building your purchase request.  You have not been charged for this transaction attempt.');
                    }
                });
            };

            // Maybe have a buyChipsPayPal Review and another one for Complete...?
            window.buyChipsPayPal = function (data) {

                var json = {

                    orderUuid: data.orderUuid
                };

                // call to dealer to instantiate the order to be built up
                $.ajax({
                    type: 'POST',
                    url: DEALER_URL + '/purchase/instantiate',
                    dataType: 'json',
                    data: json,
                    success: function success(data) {

                        if (data.status !== undefined && data.status === 'success') {

                            openPayPalPopup(data.data[0].instantiate.url);
                        } else {

                            alert('Sorry, we seem to have run into an error when building your purchase request.  You have not been charged for this transaction attempt.');
                        }
                    },
                    error: function error(jqXHR, textStatus, errorThrown) {

                        alert('Sorry, we seem to have run into an error when building your purchase request.  You have not been charged for this transaction attempt.');
                    }
                });
            };

            window.openPayPalPopup = function (paypalRedirect) {

                _gaq.push(['_trackEvent', 'userAction', 'paypalPurchaseDialogShown']);

                var popup = window.open('', '', 'toolbar=no,menubar=no,width=1024,height=768,scrollbars=yes');
                popup.document.write("<span style='font-size:15pt;font-weight:600;font-family:Arial;'>Connecting to PayPal . . .</span>");
                popup.location = paypalRedirect;

                // make this a curl call from dealer to casino to echo this out...?
                $('#nav-pages').dialog('close');
            };

            window.togglePromoButton = function () {

                if ($("#package_promo_input").val() === "") {
                    $("#package_promo_remove_button").hide();
                    $("#package_promo_button").show();
                } else {
                    $("#package_promo_remove_button").show();
                    $("#package_promo_button").hide();
                }
            };

            window.convertPromoMessage = function (origMessage, userLang) {

                var msgIndex = 0;
                switch (origMessage) {
                    case "The promotion code has already been redeemed for this account.":
                        msgIndex = 2;
                        break;
                    case "This promotion is no longer active.":
                        msgIndex = 1;
                        break;
                    case "This promotion is not available to this user.":
                        msgIndex = 4;
                        break;
                    case "This promotion is available through select partner sites only.":
                        msgIndex = 3;
                        break;
                    case "This promotion type is only available for certain processors.":
                        msgIndex = 4;
                        break;
                    default:
                        msgIndex = 0;
                        break;
                }
                var errorMsgs = [
                // 0
                {
                    'de_DE': 'Der Aktionscode, den du einl&ouml;sen m&ouml;chtest, wurde anscheinend falsch eingegeben oder ist nicht mehr g&uuml;ltig.',
                    'es_ES': 'El c&oacute;digo promocional que deseas canjear es incorrecto o ya no es v&aacute;lido.',
                    'en_US': 'The promotion code you are trying to redeem appears to have been entered incorrectly or is no longer valid.',
                    'fr_FR': 'Le code de promotion que vous essayez d\'&eacute;changer semble avoir &eacute;t&eacute; mal saisi ou a expir&eacute;.',
                    'it_IT': 'Il codice promozionale che stai cercando di riscattare potrebbe non essere stato inserito correttamente o non essere pi&ugrave; valido.',
                    'pt_PT': 'O c&oacute;digo promocional que voc&ecirc; est&aacute; tentanto resgatar parece ter sido submetido incorretamente ou n&atilde;o estar mais v&aacute;lido.'
                },
                // 1
                {
                    'de_DE': 'Diese Aktion ist nicht mehr aktiv.',
                    'es_ES': 'Esta promoci&oacute;n ya no est&aacute; activa.',
                    'en_US': 'This promotion is no longer active.',
                    'fr_FR': 'Cette promotion a expir&eacute;.',
                    'it_IT': 'Questa promozione non &egrave; pi&ugrave; attiva.',
                    'pt_PT': 'Esse c&oacute;digo promocional n&atilde;o est&aacute; mais ativo.'
                },
                // 2
                {
                    'de_DE': 'Der Aktionscode wurde f&uuml;r dieses Konto bereits eingel&ouml;st.',
                    'es_ES': 'Ya se ha canjeado el c&oacute;digo promocional con esta cuenta.',
                    'en_US': 'The promotion code has already been redeemed for this account.',
                    'fr_FR': 'Le code de promotion a d&eacute;j&agrave; &eacute;t&eacute; &eacute;chang&eacute; pour ce compte.',
                    'it_IT': 'Il codice promozionale &egrave; gi&agrave; stato riscattato con questo account.',
                    'pt_PT': 'O c&oacute;digo promocional j&aacute; foi resgatado para essa conta.'
                },
                // 3
                {
                    'de_DE': 'Diese Aktion ist nur &uuml;ber ausgew&auml;hlte Partner-Websites verf&uuml; gbar.',
                    'es_ES': 'Esta oferta de promoci&oacute;n solo est&aacute; disponible a trav&eacute;s de sitios asociados exclusivos.',
                    'en_US': 'This promotion is available through select partner sites only.',
                    'fr_FR': 'Cette promotion n\'est disponible que via les sites de partenaires s&eacute;lectionn&eacute;s.',
                    'it_IT': 'Questa promozione &egrave; disponibile solo attraverso un numero selezionato di siti web affiliati.',
                    'pt_PT': 'Essa promo&ccedil;&atilde;o est&aacute; dispon&iacute;vel somente atrav&eacute;s de sites parceiros selecionados.'
                },
                // 4
                {
                    'de_DE': 'Tut uns leid, dieser Aktionscode ist ung&uuml;ltig oder nicht &uuml; bertragbar.',
                    'es_ES': 'Lo sentimos, pero este c&oacute;digo promocional no es v&aacute;lido o no es transferible.',
                    'en_US': 'This promotion is not available to you at this time.',
                    'fr_FR': 'Tu ne peux pas profiter de cette promotion pour le moment.',
                    'it_IT': 'Spiacente. Questo codice promozionale non &egrave; valido o non &egrave; trasferibile.',
                    'pt_PT': 'Esse c&oacute;digo promocional &eacute; inv&aacute;lido ou n&atilde;o transfer&iacute;vel.'
                }];
                return errorMsgs[msgIndex][userLang];
            };

            // DIALOGS
            $("#buy_chips_message_dialog").dialog({
                autoOpen: false,
                modal: true,
                width: 500,
                height: 500,
                title: buyChipsJSStr[12][getLanguageCode()],
                resizable: false,
                closeOnEscape: true,
                buttons: [{
                    text: "OK",
                    click: function click() {
                        $(this).dialog("close");
                    }
                }],
                close: function close() {

                    // clear out the dialog text after closing it
                    $(this).html("");
                }
            });

            // set the payment_provider to default at paypal
            if (APPLICATION_ENV === "facebook") {

                $("#payment_provider").val("package_tab_facebook");
            } else {

                $("#payment_provider").val("package_tab_paypal");
            }

            togglePromoButton();

            // button-ify the buttons
            buttonMaker();
        }
    }, {
        key: 'loadFacebookWrapperThing',
        value: function loadFacebookWrapperThing() {
            /**
             * Facebook wrapper for flash <-> Facebook communication
             *
             * NECESSARY JS FUNCTIONS FOR EACH NETWORK function inviteFriends(cid) function
             * earnChips() function sendGift(recipients) function
             * publishPhotoboothBadge(badgeId, badgeName, facebookCaption, fbuid, defaultImage) function
             * publishLevelUp(level, levelName, facebookCaption) function getUserImage(id)
             * function getUserName(id)
             *
             * POSSIBLE? function publishAttachment(attachment)
             *
             */

            window.DD = window.DD || {};
            DD.FB = {};

            var langs = ['de_DE', 'es_ES', 'en_US', 'fr_FR', 'it_IT', 'pt_PT'];

            window.fbWrapLangCode = $("#languageCode").val();

            var resolvedLanguage = fbWrapLangCode || "en_US";
            fbWrapLangCode = langs.some(function (l) {
                return l == resolvedLanguage;
            }) ? resolvedLanguage : 'en_US';


            window.providerName = 'Facebook';
            if (APPLICATION_ENV == 'www') {
                providerName = 'Facebook Off Canvas';
            }

            window.getUserName = function (id) {
                var params = {
                    providerName: providerName,
                    providerUserId: id,
                    appId: flashvars.APP_ID,
                    fields: 'first_name, last_name'
                };

                $.ajax({
                    type: 'POST',
                    url: DEALER_URL + '/user/getSocialInfo',
                    dataType: 'json',
                    data: params,
                    success: function success(data) {
                        if (data.status === 'success') {
                            var name = data.data[0].userInfo.first_name + " " + data.data[0].userInfo.last_name.charAt(0);
                            thisMovie().updateUserName(id, name);
                        }
                    }
                });
            };

            window.getUserImage = function (id) {
                // return the user image
                var params = {
                    providerName: providerName,
                    providerUserId: id,
                    appId: flashvars.APP_ID
                };

                $.ajax({
                    type: 'POST',
                    url: DEALER_URL + '/user/getSocialInfo',
                    dataType: 'json',
                    data: params
                }).done(function (data) {
                    if (data.status === 'success') {
                        var picture = data.data[0].userInfo.picture;
                        thisMovie().updateImageURL(id, picture);
                    }
                });
            };

            window.getUserImageObj = function (id) {
                // return the user image
                var params = {
                    providerName: providerName,
                    providerUserId: id,
                    appId: flashvars.APP_ID
                };

                $.ajax({
                    type: 'POST',
                    url: DEALER_URL + '/user/getSocialInfo',
                    //dataType: 'json',
                    data: params,
                    success: function success(data) {
                        if (data.status === 'success') {
                            var picture = data.data[0].userInfo.picture;
                            thisMovie().updateImageURL(id, picture);
                        }
                    }
                });
            };

            // Publish story for being awarded Photobooth badge
            window.publishPhotoboothBadge = function (badgeId, badgeName, facebookCaption, fbuid, defaultImage) {
                var publishPhotoboothBadgeStr = [{
                    'de_DE': 'Gewinne jetzt im Casino',
                    'es_ES': 'Gana ya en el casino',
                    'en_US': 'Win in the Casino Now',
                    'fr_FR': 'Gagnez au casino',
                    'it_IT': 'Vinci al casin&ograve;, ora'
                }];

                var badgeUrl = window.location.protocol + '//' + window.location.hostname + '/pb-badge?badgeId=' + badgeId + '&fbuid=' + fbuid + '&default=' + defaultImage + '&uid=' + flashvars.USER_ID;
                if (fbuid) {
                    var url = POST_URL + "?utm_medium=Facebook&utm_campaign=wallpost&utm_source=photobooth&utm_content=friendWall&utm_term=342&cid=342";
                    FB.ui({
                        method: 'feed',
                        name: badgeName,
                        to: fbuid,
                        link: url,
                        picture: badgeUrl,
                        caption: ' ',
                        description: facebookCaption,
                        actions: [{
                            name: publishPhotoboothBadgeStr[0][fbWrapLangCode],
                            link: url
                        }],
                        ref: 'acquisition'
                    });
                } else {
                    var url = POST_URL + "?utm_medium=Facebook&utm_campaign=wallpost&utm_source=photobooth&utm_content=regularBadge&utm_term=341&cid=341";
                    FB.ui({
                        method: 'feed',
                        name: badgeName,
                        link: url,
                        picture: badgeUrl,
                        caption: ' ',
                        description: facebookCaption,
                        actions: [{
                            name: publishPhotoboothBadgeStr[0][fbWrapLangCode],
                            link: url
                        }],
                        ref: 'acquisition'
                    });
                }
            };

            // Publish an American Idol badge.
            window.publishAmericanIdolBadge = function (badgeId, badgeName, facebookCaption, contestantUrl) {
                var badgeUrl = window.location.protocol + '//' + window.location.hostname + '/ai-badge?badgeId=' + badgeId + '&uid=' + flashvars.USER_ID;
                var publishAmericanIdolBadgeStr = [{
                    'de_DE': 'Gewinne jetzt im Casino',
                    'es_ES': 'Gana ya en el casino',
                    'en_US': 'Win in the Casino Now',
                    'fr_FR': 'Gagnez au casino',
                    'it_IT': 'Vinci al casin&ograve;, ora'
                }];

                if (contestantUrl) {
                    var contestantUrlRa = contestantUrl.split("/");
                    var contestantImage = contestantUrlRa[contestantUrlRa.length - 1].split(".");

                    var badgeUrl = badgeUrl + '&idol=' + contestantImage[0];
                }
                var url = POST_URL + "?utm_medium=Facebook&utm_campaign=wallpost&utm_source=americanidol&utm_content=regularBadge&utm_term=341&cid=341";

                // facebookCaption,
                FB.ui({
                    method: 'feed',
                    name: badgeName,
                    link: url,
                    picture: badgeUrl,
                    caption: ' ',
                    description: facebookCaption,
                    actions: [{
                        name: publishAmericanIdolBadgeStr[0][fbWrapLangCode],
                        link: url
                    }],
                    ref: 'acquisition'
                });
            };

            window.requestEmailPermission = function () {
                $('#nav-pages').dialog('close');
                var cb = function cb(response) {
                    if (response.status === 'connected') {
                        FB.api('/me', function (response) {
                            if (SIGNED_REQUEST) {
                                var params = {
                                    'signed_request': SIGNED_REQUEST,
                                    'email': response.email,
                                    'ajax': 1
                                };
                            } else {
                                var params = {
                                    'email': response.email,
                                    'ajax': 1
                                };
                            }
                            $.ajax({
                                type: 'POST',
                                url: '/process-email-optin',
                                data: params,
                                dataType: 'json'
                            });
                        });
                    }
                };
                FB.login(cb, {
                    scope: 'email'
                });
            };

            window.requestPublishPermissions = function () {
                requestPermission('publish_stream', function (permGranted) {
                    thisMovie().publishPermissionsResponseFromJS(permGranted);
                });
            };

            window.requestPublishActionsPermissions = function () {
                requestPermission('publish_actions', function (permGranted) {
                    thisMovie().publishActionsPermissionsResponseFromJS(permGranted);
                });
            };

            window.revokePublishActionsPermissions = function () {
                FB.api('/me/permissions/publish_actions', 'delete', function (response) {
                    /*
                    // handle failure or error
                    if (!response || response.error)
                    {
                     }
                    else // handle success
                    {
                     }
                    */
                });
            };

            window.requestReadStreamPermissions = function () {
                requestPermission('read_stream', function (permGranted) {
                    thisMovie().readStreamPermissionsResponseFromJS(permGranted);
                });
            };

            window.getPublishPermissions = function () {
                checkForPermission('publish_stream', function (permGranted) {
                    thisMovie().permissionQueryResponse(permGranted);
                });
            };

            window.getReadStreamPermissions = function () {
                checkForPermission('read_stream', function (permGranted) {
                    thisMovie().readStreamQueryResponse(permGranted);
                });
            };

            window.getPublishActionsPermissions = function () {
                checkForPermission('publish_actions', function (permGranted) {
                    thisMovie().publishActionsQueryResponse(permGranted);
                });
            };

            window.checkForPermission = function (permission, callback) {
                var params = {
                    providerName: providerName,
                    providerUserId: FBUID,
                    appId: flashvars.APP_ID
                };

                $.ajax({
                    type: 'POST',
                    url: DEALER_URL + '/user/getPermissions',
                    dataType: 'json',
                    data: params,
                    success: function success(data) {
                        if (data.status === 'success') {
                            if (data.data[0].hasOwnProperty(permission)) {
                                callback(true);
                            } else {
                                callback(false);
                            }
                        } else {
                            callback(false);
                        }
                    }
                });
            };

            window.requestPermission = function (permission, callback) {
                FB.login(function (response) {
                    if (response.status === 'connected') {
                        // connection succeeded, so check if perm was granted
                        checkForPermission(permission, callback);
                    } else {
                        // connection failed, so return false
                        callback(false);
                    }
                }, { scope: permission });
            };

            window.userLikesResult = function (response) {
                // console.log(response);

                // TODO:
                // do something here for recording them accepting
                // or not accepting the new permission
                if (response) {
                    // _gaq they took the bait!!
                    _gaq.push(['_trackEvent', 'userAction', 'userLikesPermissionGranted']);

                    // now show the fan box
                    getShowFanEmailDialog('showFan');
                } else {
                    // _gaq they said no
                    _gaq.push(['_trackEvent', 'userAction', 'userLikesPermissionRejected']);
                }
            };

            window.fanBox = function () {
                if (typeof dontShowFanBox == 'undefined') {
                    if (!$.cookie('fanDialog')) {
                        var showEmail = false;
                        var showFan = false;
                        marketingComplete = true;

                        var params = {
                            providerName: providerName,
                            providerUserId: FBUID,
                            appId: flashvars.APP_ID
                        };

                        $.ajax({
                            type: 'POST',
                            url: DEALER_URL + '/user/getPermissions',
                            dataType: 'json',
                            data: params,
                            success: function success(data) {
                                if (data.status === 'success') {
                                    if (data.data[0].hasOwnProperty('email')) {
                                        FB.api({
                                            method: 'pages.isFan',
                                            page_id: APP_ID,
                                            uid: FBUID
                                        }, function (response) {
                                            if (response == false) {
                                                showFanEmailDialog('showFan');
                                            }
                                        });
                                    } else {
                                        showFanEmailDialog('showEmail');
                                    }
                                }
                            }
                        });
                    }
                }
            };

            window.buyChipsFBFormSubmit = function (packageId) {
                _gaq.push(['_trackEvent', 'userAction', 'FBPurchaseDialogShown']);

                // calling the API ...
                var obj = {
                    method: 'pay',
                    order_info: packageId,
                    purchase_type: 'item',
                    dev_purchase_params: {
                        'oscif': true
                    }
                };

                var callback = function callback(data) {
                    if (data['order_id']) {
                        _gaq.push(['_trackEvent', 'userAction', 'buyChipsFBComplete', packageId.toString()]);
                        $('#nav-pages').dialog('close');
                        thisMovie().purchaseComplete(packageId.toString());
                        return true;
                    } else {
                        return false;
                    }
                };

                FB.ui(obj, callback);
            };

            window.cancelOrder = function (orderUuid) {
                // There is no callback because we won't do anything with the response
                $.ajax({
                    type: 'POST',
                    url: DEALER_URL + '/purchase/cancel',
                    dataType: 'json',
                    data: { orderUuid: orderUuid },
                    success: function success(data) {
                        if (data.status === 'success') {
                            // purchase was successfully marked as cancelled
                        }
                    }
                });
            };

            window.buyChipsFacebookVerify = function (data) {

                if (!data) {
                    if (buyChipsFailedCallback) {
                        buyChipsFailedCallback();
                    }
                    // TODO: BARF OUT A BETTER MESSAGE
                    alert("There was an error processing your payment. Please try again!");
                    return false;
                }

                if (data.error_message) {
                    if (buyChipsFailedCallback) {
                        buyChipsFailedCallback();
                    }
                    // cancel the payment
                    cancelOrder(DD.FB.orderUuid);
                    getProductProcessor();
                    return false;
                }

                // close the ridiculous dialog box
                try {
                    $('#nav-pages').dialog('close');
                } catch (e) {}
            };

            window.buyChipsFailedCallback = null;

            window.buyChipsFacebook = function (data, failedCallback) {

                var obj = {
                    method: 'pay',
                    action: 'purchaseitem',
                    product: DEALER_URL + '/purchase/product/' + data.product_id,
                    request_id: data.orderUuid,
                    quantity: data.quantity
                };

                if (data.pricePointId && data.pricePointId != "null") {
                    $.extend(true, obj, { pricepoint_id: data.pricePointId });
                }

                DD.FB.orderUuid = data.orderUuid;

                buyChipsFailedCallback = failedCallback;

                // fire off the callback and object
                FB.ui(obj, buyChipsFacebookVerify);
            };

            window.buySpin = function () {
                _gaq.push(['_trackEvent', 'userAction', 'FBPurchaseDialogShown']);

                var packageId = 5002;

                // calling the API ...
                var obj = {
                    method: 'pay',
                    order_info: packageId,
                    purchase_type: 'item',
                    dev_purchase_params: {
                        'oscif': true
                    }
                };

                var callback = function callback(data) {
                    if (data['order_id']) {
                        _gaq.push(['_trackEvent', 'userAction', 'buySpinFBComplete', packageId.toString()]);

                        // Put callback here to notify flash that purchase was successful.

                        return true;
                    } else {
                        // handle errors here
                        return false;
                    }
                };

                FB.ui(obj, callback);
            };

            window.fbLogout = function(e) {
                FB.getLoginStatus(function(e) {
                    if(e && "connected" === e.status) {
                    		try {
	                    		var cookies = document.cookie.split(';');
	                    		for(i=0; i<cookies.length; i++) {
	                    			var c = cookies[i];
	                    			var split = c.split('=');
	                    			if(split.length > 0) {
	                    				document.cookie = split[0]+'=;expires=' + (new Date(0).toGMTString());
	                    				console.log(split[0]+'=;expires=' + (new Date(0).toGMTString()));
	                    			}
	                    		}
                        } catch(e) {console.error(e);}
                    }
                });
                window.location.replace("/login");
            }

            /* --> Gifting --> */

            // TODO: change this to Dealer call:
            window.sendGift = function (callback) {
                //this function is invoking when the send gifts button is clicked from the desktop client header
                //when this is back in the user controller: url: '/user/gift-eligible-friends/' + flashvars.USER_ID,
                $.ajax({
                    type: 'POST',
                    url: '/gift-eligible-friends/?userId=' + flashvars.USER_ID,
                    success: function success(recipients) {
                        var params = {
                            providerName: providerName,
                            providerUserId: FBUID,
                            appId: flashvars.APP_ID,
                            accessToken: FB.getAccessToken()
                        };

                        showFriendsGiftDialog(recipients, false, callback);
                    }
                });
            };

            // TODO: need eligible friends here...?
            window.returnGift = function (recipients, callback) {

                var params = {
                    // These values were throwing an error - ZB
                    // providerName: 'Double Down Casino',
                    // providerUserId: $("#providerUserId").val(),

                    providerName: providerName,
                    providerUserId: FBUID,
                    appId: flashvars.APP_ID
                };

                showFriendsGiftDialog(recipients, true, callback);
            };

            window.showFriendsGiftDialog = function (recipients, frictionless, callback, errorCallback) {

                window.errorCallbackWrapper = function (xhr, status, data) {
                    console.log('gift error', xhr, status, data);
                    try {
                        var text = xhr.responseText.match(/\{.*\}/gi);
                        var response = $.parseJSON(text);

                        console.log('recovered from error, bad json returned');

                        callback(response);

                        return;
                    } catch (e) {}

                    if (errorCallback) {
                        errorCallback();
                    }
                };

                window.callbackWrapper = function (data) {
                    if (!callback || typeof callback !== 'function') {
                        callback = function callback(data) {
                            // send resp data thru to flash
                            thisMovie().giftsResponse(data);
                        };
                    }

                    callback(data);
                };

                _gaq.push(['_trackEvent', 'userAction', 'sendGiftDisplayed']);

                //TODO
                var showFriendsGiftDialogStr = [{
                    'de_DE': 'Ich habe dir ein Spiel fÃ¼r das Geschenkerad gesendet! Sende mir eins zurÃ¼ck!',
                    'es_ES': 'Â¡Te he mandado una tirada en la Rueda de obsequios! Â¡MÃ¡ndame tÃº una a mÃ­!',
                    'en_US': 'I sent you a spin of the Gift Wheel! Send me back one!',
                    'fr_FR': 'Je t\'ai envoyÃ© un tour de la roue des cadeauxÂ !',
                    'it_IT': 'Ti ho inviato un giro di ruota in regalo! Ricambia il regalo!',
                    'pt_PT': 'Eu te mandei uma rodada na Roda de Presentes! Me manda uma de volta!'
                }, {
                    'de_DE': 'Sende deinen Freunden Geschenke!',
                    'es_ES': 'Â¡EnvÃ­a regalos a tus amigos!',
                    'en_US': 'Send gifts to your friends!',
                    'fr_FR': 'Envoyez des cadeaux Ã  vos amisÂ !',
                    'it_IT': 'Invia regali ai tuoi amici!',
                    'pt_PT': 'Send gifts to your friends!'
                }];

                var fbparams = {
                    app_id: flashvars.APP_ID, //TODO
                    method: 'apprequests',
                    message: showFriendsGiftDialogStr[0][fbWrapLangCode],
                    title: showFriendsGiftDialogStr[1][fbWrapLangCode],
                    data: {
                        requestType: 'gift'
                    }
                };

                if (frictionless) {
                    fbparams.frictionlessRequests = true;
                }

                if (recipients !== undefined) {
                    if (recipients.to !== undefined) {
                        fbparams.to = recipients.to;
                    } else if (recipients.eligible !== undefined) {
                        fbparams.filters = [{
                            name: 'Eligible',
                            user_ids: recipients.eligible
                        }];
                    }
                }

                FB.ui(fbparams, function (response) {
                    if (response) {

                        if (response.error_code || response.error_message || !response.request || !response.to) {
                            // The user can cancel the send
                            console.log("fb.ui error", response);
                            return;
                        }

                        _gaq.push(['_trackEvent', 'userAction', 'numGiftsSent', response.request.length.toString()]);

                        var params = {
                            'userId': flashvars.USER_ID, //TODO
                            'requestId': response.request,
                            'recips': response.to
                        };

                        if (SIGNED_REQUEST) {
                            params.signed_request = SIGNED_REQUEST;
                        }

                        // TODO: dealer up this url:

                        $.ajax({
                            type: 'POST',
                            url: 'send-gifts',
                            data: params,
                            dataType: 'json',
                            success: callbackWrapper,
                            error: errorCallbackWrapper
                        });
                    }
                });
            };

            window.sendDealerGift = function (receiverFacebookIds, giftIds) {

                var params = {

                    senderProviderName: 'Double Down Casino',
                    senderProviderUserId: $("#providerUserId").val(),
                    receiverProviderName: providerName,
                    receiverProviderUserIds: receiverFacebookIds,
                    giftProviderName: providerName,
                    giftIds: giftIds,
                    giftName: 'Wheel Spin'
                };

                $.ajax({
                    type: 'POST',
                    url: DEALER_URL + '/gifts/sendGifts',
                    dataType: 'json',
                    data: params,
                    success: function success(data) {},
                    error: function error(xhr, statusText) {
                        alert('There was an error sending this gift.');
                    }
                });
            };

            window.getRedeemableGifts = function (callback) {

                if (!callback) {
                    callback = function callback(data) {
                        thisMovie().redeemableGifts(data);
                    };
                }

                var params = {
                    receiverProviderName: 'Double Down Casino',
                    receiverProviderUserId: $("#providerUserId").val()
                };

                $.ajax({
                    type: 'POST',
                    url: DEALER_URL + '/gifts/getRedeemableGifts',
                    dataType: 'json',
                    data: params,
                    success: function success(data) {
                        callback(data);
                    },
                    error: function error(xhr, statusText) {

                        alert('There was an error getting the pending gifts.');
                    }
                });
            };

            window.recordRedeemedGift = function (senderFacebookId, giftId, giftAmount) {

                var params = {

                    senderProviderName: providerName,
                    senderProviderUserId: senderFacebookId,
                    receiverProviderName: 'Double Down Casino',
                    receiverProviderUserId: $("#providerUserId").val(),
                    giftProviderName: providerName,
                    giftId: giftId,
                    giftName: 'Wheel Spin',
                    giftAmount: giftAmount
                };

                $.ajax({
                    type: 'POST',
                    url: DEALER_URL + '/gifts/recordRedeemedGift',
                    dataType: 'json',
                    data: params,
                    success: function success(data) {},
                    error: function error(xhr, statusText) {
                        alert('There was an error recording this gift.'); //TODO
                    }
                });
            };
            /* <-- Gifting <-- */

            window.isIE6orIE7 = function () {
                var ver = getInternetExplorerVersion();

                if (ver >= 6 && ver < 8) {
                    return true;
                }
            };

            window.getInternetExplorerVersion = function ()
            // Returns the version of Internet Explorer or a -1
            // (indicating the use of another browser).
            {
                var rv = -1; // Return value assumes failure.
                if (navigator.appName == 'Microsoft Internet Explorer') {
                    var ua = navigator.userAgent;
                    var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                    if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
                }
                return rv;
            };

            window.complementOfSet = function (baseSet, setToDeduct) {

                var output = new Array(0);
                $.each(baseSet, function (i, v) {
                    if ($.inArray(v, setToDeduct) == -1) {
                        output.push(v);
                    }
                });
                return output;
            };

            window.inviteFriends = function (cid, callback) {
                _gaq.push(['_trackEvent', 'userAction', 'inviteFriendDisplayed']);
                var inviteFriendsStr = [{
                    'de_DE': 'Neue Spieler im DoubleDown Casino erhalten ' + window.ddiOptions.inviteRewardAmounts + ' Dollar in Gratis-Chips - einfach durch die Anmeldung! DoubleDown Casino ist das grÃ¶ÃŸte und beste SpaÃŸ-Casino der Welt!',
                    'es_ES': 'Por tan solo inscribirse en DoubleDown Casino, los nuevos jugadores reciben ' + window.ddiOptions.inviteRewardAmounts + ' $ en fichas gratis. Â¡DoubleDown Casino es el mayor y mejor casino de entretenimiento gratuito del mundo!',
                    'en_US': 'New DoubleDown Casino players get $' + window.ddiOptions.inviteRewardAmounts + ' in free chips good for slot machines, poker, blackjack, roulette, video poker and more just for signing up! DoubleDown Casino is the biggest and best just-for-fun casino in the world!',
                    'fr_FR': 'Les nouveaux joueurs du DoubleDown Casino reÃ§oivent ' + window.ddiOptions.inviteRewardAmounts + ' $ en jetons gratuits. Il leur suffit pour cela de s\'inscrire ! Le DoubleDown Casino est le plus vaste et le meilleur casino de divertissement au monde !',
                    'it_IT': 'I nuovi giocatori di DoubleDown Casino, per il semplice fatto di essersi registrati, ricevono gratis $' + window.ddiOptions.inviteRewardAmounts + ' in chips. DoubleDown Casino Ã¨ il casinÃ² per divertimento puro piÃ¹ grande e migliore al mondo!',
                    'pt_PT': 'Jogadores novos no DoubleDown Casino receberÃ£o ' + window.ddiOptions.inviteRewardAmounts + ' de fichas grÃ¡tis para usar em mÃ¡quinas de caÃ§a-nÃ­queis, video pÃ´quer e mais! DoubleDown Casino Ã© o maior e melhor jogo de cassino sÃ³ pra diversÃ£o no mundo inteiro!'
                }, {
                    'de_DE': 'Freunde einladen',
                    'es_ES': 'Invitar a amigos',
                    'en_US': 'Invite Friends',
                    'fr_FR': 'Inviter des amis',
                    'it_IT': 'Invita gli amici',
                    'pt_PT': 'Invite Friends'
                }];

                if (cid == null) {
                    cid = 9;
                }

                FB.ui({
                    app_id: flashvars.APP_ID,
                    method: 'apprequests',
                    message: inviteFriendsStr[0][fbWrapLangCode],
                    title: inviteFriendsStr[1][fbWrapLangCode],
                    data: {
                        requestType: 'invite',
                        campaignId: cid
                    },
                    filters: ['app_non_users']
                }, function(response) {
                    requestCallback(response);
                    if ( typeof callback === "function" ) {
                      callback();
                    }
                });
            };

            window.inviteSelectedFriends = function (friends) {
                var maxInvites = 50;
                var friendsArray = null;
                var groups = null;
                var start = null;
                var stop = null;
                var splitFriends = null;
                var i = null;

                friendsArray = friends.split(",");
                if (friendsArray.length > maxInvites) {

                    groups = Math.ceil(friendsArray.length / maxInvites);
                    i = 0;
                    while (i < groups) {
                        start = i * maxInvites;
                        stop = maxInvites + i * maxInvites;
                        splitFriends = friendsArray.slice(start, stop);
                        sendToFriends(splitFriends);
                        i++;
                    }
                } else {
                    sendToFriends(friends);
                }
            };

            window.sendToFriends = function (friends) {
                _gaq.push(['_trackEvent', 'userAction', 'inviteFriendDisplayed']);
                var sendToFriendsStr = [{
                    'de_DE': 'Neue Spieler im DoubleDown Casino erhalten ' + window.ddiOptions.inviteRewardAmounts + ' Dollar in Gratis-Chips - einfach durch die Anmeldung! DoubleDown Casino ist das grÃ¶ÃŸte und beste SpaÃŸ-Casino der Welt!',
                    'es_ES': 'Por tan solo inscribirse en DoubleDown Casino, los nuevos jugadores reciben ' + window.ddiOptions.inviteRewardAmounts + ' $ en fichas gratis. Â¡DoubleDown Casino es el mayor y mejor casino de entretenimiento gratuito del mundo!',
                    'en_US': 'New DoubleDown Casino players get $' + window.ddiOptions.inviteRewardAmounts + ' in free chips good for slot machines, poker, blackjack, roulette, video poker and more just for signing up! DoubleDown Casino is the biggest and best just-for-fun casino in the world!',
                    'fr_FR': 'Les nouveaux joueurs du DoubleDown Casino reÃ§oivent ' + window.ddiOptions.inviteRewardAmounts + ' $ en jetons gratuits. Il leur suffit pour cela de s\'inscrire ! Le DoubleDown Casino est le plus vaste et le meilleur casino de divertissement au monde !',
                    'it_IT': 'I nuovi giocatori di DoubleDown Casino, per il semplice fatto di essersi registrati, ricevono gratis $' + window.ddiOptions.inviteRewardAmounts + ' in chips. DoubleDown Casino Ã¨ il casinÃ² per divertimento puro piÃ¹ grande e migliore al mondo!',
                    'pt_PT': 'Jogadores novos no DoubleDown Casino receberÃ£o ' + window.ddiOptions.inviteRewardAmounts + ' de fichas grÃ¡tis para usar em mÃ¡quinas de caÃ§a-nÃ­queis, video pÃ´quer e mais! DoubleDown Casino Ã© o maior e melhor jogo de cassino sÃ³ pra diversÃ£o no mundo inteiro!'
                }, {
                    'de_DE': 'Freunde einladen',
                    'es_ES': 'Invitar a amigos',
                    'en_US': 'Invite Friends',
                    'fr_FR': 'Inviter des amis',
                    'it_IT': 'Invita gli amici',
                    'pt_PT': 'Invite Friends'
                }];

                FB.ui({
                    app_id: flashvars.APP_ID,
                    method: 'apprequests',
                    message: sendToFriendsStr[0][fbWrapLangCode],
                    title: sendToFriendsStr[1][fbWrapLangCode],
                    to: friends,
                    data: { requestType: 'invite' }
                });
            };

            window.requestCallback = function (response) {
                if (response != null && !response['error_code']) {
                    _gaq.push(['_trackEvent', 'userAction', 'numFriendsInvited', response.to.length.toString()]);
                }
            };

            window.earnChips = function () {
                if (APPLICATION_ENV == 'facebook') {
                    // Earn chips for FB Credits
                    var obj = {
                        method: 'pay',
                        action: 'earn_currency',
                        product: window.location.protocol + '//' + window.location.hostname + '/ogoi-chips'
                    };

                    var callback = function callback(data) {
                        if (data['order_id']) {
                            _gaq.push(['_trackEvent', 'userAction', 'earnChipsComplete', "Earned chips"]);

                            $('#nav-pages').dialog('close');
                            thisMovie().purchaseComplete(packageId.toString());

                            return true;
                        } else if (data['error_code']) {
                            // Handle error.
                            _gaq.push(['_trackEvent', 'userAction', 'earnChipsComplete', "Earned chips error " + data['error_code'].toString()]);
                            return false;
                        } else {
                            // Handle unknown error.
                            _gaq.push(['_trackEvent', 'userAction', 'earnChipsComplete', "Earned chips error UNKNOWN"]);
                            return false;
                        }
                    };

                    FB.ui(obj, callback);
                } else {
                    showNavPage('/earn-chips');
                }
            };

            window.publishAttachment = function (attachment) {
                FB.ui(attachment, function (response) {
                    if (response && reponse.post_id) {
                        var d = 1;
                    }
                });
            };

            window.addFriend = function (fbuid) {
                FB.ui({
                    method: 'friends',
                    id: fbuid
                });
            };

            // POP FB GRAPH 2.2 PERMISSIONS DIALOG --------------------

            window.popFacebookPermissionsDialog = function (permission, optCallback) {
                FB.login(function (response) {
                    if (window['thisMovie']) {
                        thisMovie().handleFBPermissionDialogCallback(response);
                    }

                    if (typeof optCallback === 'function') {
                        optCallback();
                    }
                }, {
                    scope: permission,
                    auth_type: "rerequest"
                });
            };

            // RETURN FACEBOOK PERMS COOKIE ---------------------------

            window.getFBPermsCookie = function (cname) {
                var result = "";
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }if (c.indexOf(name) == 0) result = c.substring(name.length, c.length);
                }
                thisMovie().onCookieCheckResponse(result);
            };

            // SET FACEBOOK PERMS COOKIE ------------------------------

            window.setFBPermsCookie = function (cname, cvalue, exdays) {
                var d = new Date();
                d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
                var expires = "expires=" + d.toUTCString();
                document.cookie = cname + "=" + cvalue + "; " + expires;
            };
        }
    }, {
        key: 'loadFanPageLikeThing',
        value: function loadFanPageLikeThing() {
            //This Class provides access to whether or not the user likes the fan page via subscription.
            //This Class stores no internal state related to the status of fan page like.
            // ::: Adapted to Launchpad ::: ripped from fanpagelikestatemanager.js
            window.FanPageLikeStateManager = new function () {
                var _callbacks = [];
                var _init = false;
                var _fbuid = "";
                var _fanPageId = "";

                /**
                *	Initialize the component.
                *	@param {String} The Facebook user id.
                *	@param {String} The fan page id.
                **/
                this.init = function (fbuid, fanPageId) {
                    _init = true;
                    _fbuid = fbuid;
                    _fanPageId = fanPageId;
                };

                /**
                *	Add a callback for when the user has liked the fan page.
                *	@param {Function} The callback to add.
                **/
                this.addCallback = function (callback) {
                    _callbacks.push(callback);
                };

                /**
                *	Remove a callback.
                *	@param {Function} The callback to remove.
                *	@return {Boolean} Whether or not the callback was removed successfully.
                **/
                this.removeCallback = function (callback) {
                    for (var i = 0; i < _callbacks.length; i++) {
                        if (_callbacks[i] == callback) {
                            _callbacks.splice(i, 1);
                            return true;
                        }
                    }
                    return false;
                };

                /**
                *	Triggers a call to facebook to check whether or not the user likes our fan page.
                **/
                this.checkState = function () {
                    return;
                };

                return this;
            }();
        }
    }, {
        key: 'loadFacebookPopupThing',
        value: function loadFacebookPopupThing() {
            //This Class controls whether or not to show the FacebookLikePopup as part of
            //the marketing dialog system which occurs on initial login.
            // ::: Adapted to Launchpad ::: ripped from fblikepopup.js
            window.FacebookLikePopupManager = new function () {
                var _self = this;
                var _doesLikeFanPage = false;
                var _init = false;

                /**
                	* Initialize the component
                	* @param {Boolean} doesLikeFanPage Whether or not the user likes our fan page.
                */
                this.init = function (doesLikeFanPage) {
                    _init = true;
                    _doesLikeFanPage = doesLikeFanPage;
                };

                /**
                *	Called by the FanPageLikeStateManager when we recieve data about
                *	whether or not the user likes the fanpage.
                *	@param {Boolean} doesLikeFanPage Whether or not the user likes our fan page.
                **/
                this.likeStateCallback = function (doesLikeFanPage) {
                    if (typeof FacebookLikePopupManager !== 'undefined') {
                        _self.init(doesLikeFanPage);
                    }
                    FanPageLikeStateManager.removeCallback(_self.likeStateCallback);
                };

                /**
                	* Attempts to show the FB like popup, and call back to flash
                	* based on the result.
                	*/
                this.tryShowLikePopup = function () {

                    if (APPLICATION_ENV == 'facebook') {
                        if (!_init || _doesLikeFanPage) {
                            _self.closeLikePopup(false);
                            return;
                        }

                        showFanEmailDialog("");

                        $("#nav-pages").on("dialogclose", function (event, ui) {
                            _self.closeLikePopup(true);
                        });
                    } else {
                        _self.closeLikePopup(false);
                    }
                };

                /**
                	* Closes the like popup, and informs flash about whether or not
                	* it was actually shown.
                	*/
                this.closeLikePopup = function (didShow) {
                    //tell flash that we closed the popup
                    thisMovie().closeLikePopup(didShow);
                };

                return this;
            }();
        }
    }]);

    return LegacyService;
}();

exports.default = LegacyService;

},{"../services/ajax":327,"../services/config-service":328}],331:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/******************************************************************************
 *  MiniUrl: simple url parsing / formatting services
 *  NOTE: This only supports common, basic urls
 *
 *  usage:
 *      new MiniUrl('http://www.something.com/somewhere?this=that#really');
 *      MiniUrl.parseProtocol('http://www.something.com');
 *
 *  members:
 *      MiniUrl.parseOrigin(url);   // Returns the 'origin' portion of the url
 *      MiniUrl.parseProtocol(url); // Returns the 'protocol' portion of the url
 *      MiniUrl.parseHost(url);     // Returns the 'host' portion of the url
 *      MiniUrl.parseHostName(url); // Returns the 'host-name' portion of the url
 *      MiniUrl.parsePort(url);     // Returns the 'port' portion of the url
 *      MiniUrl.parsePath(url);     // Returns the 'path' portion of the url
 *      MiniUrl.parseSearch(url);   // Returns the 'search' portion of the url
 *      MiniUrl.parseHash(url);     // Returns the 'hash' portion of the url
 *      MiniUrl.parseQuery(search); // Converts the search portion of a url to an object
 *      MiniUrl.formatQuery(obj);   // Formats an object into a search portion of a url
 *      MiniUrl.parseValue(str);    // Attempts to intelligently parse a string to a value
 *
 *      new MiniUrl(url).href;      // The full url
 *      new MiniUrl(url).origin;    // The 'origin' portion of a url
 *      new MiniUrl(url).protocol;  // The 'protocol' portion of a url
 *      new MiniUrl(url).host;      // The 'host' portion of a url
 *      new MiniUrl(url).hostName;  // The 'hostName' portion of a url
 *      new MiniUrl(url).port;      // The 'port' portion of a url
 *      new MiniUrl(url).path;      // The 'path' portion of a url
 *      new MiniUrl(url).search;    // The 'search' portion of a url
 *      new MiniUrl(url).hash;      // The 'hash' portion of a url
 *      new MiniUrl(url).query;     // The 'query' portion of a url
 *      new MiniUrl(url).toString() // Assembles the current MiniUrl values back into a string
 ******************************************************************************/

var MiniUrl = function () {
    function MiniUrl(url) {
        _classCallCheck(this, MiniUrl);

        this.href = url;
    }

    _createClass(MiniUrl, [{
        key: 'toString',
        value: function toString() {
            return this.href;
        }
    }, {
        key: 'href',
        get: function get() {
            var url = this.origin;
            var path = (this.path || '').replace(/^[\s\/]+|[\s\/]+$/gi, '');
            url += path ? '/' + path : '';
            var search = (this.search || '').replace(/^[\s\/\?]+/gi, '');
            url += search ? '?' + search : '';
            var hash = (this.hash || '').replace(/^[\s\/\#]+/gi, '');
            url += hash ? '#' + hash : '';
            return url;
        },
        set: function set(value) {
            this.protocol = MiniUrl.parseProtocol(value);
            this.hostName = MiniUrl.parseHostName(value);
            this.port = MiniUrl.parsePort(value);
            this.path = MiniUrl.parsePath(value);
            this.search = MiniUrl.parseSearch(value);
            this.hash = MiniUrl.parseHash(value);
        }
    }, {
        key: 'origin',
        get: function get() {
            var protocol = (this.protocol || '').replace(/^\s+|[\s:\/]+$/gi, '');
            protocol = protocol ? protocol + '://' : '';
            return protocol + this.host;
        },
        set: function set(value) {
            this.protocol = MiniUrl.parseProtocol(value);
            this.hostName = MiniUrl.parseHostName(value);
            this.port = MiniUrl.parsePort(value);
        }
    }, {
        key: 'host',
        get: function get() {
            var name = (this.hostName || '').replace(/^[\s\/\:]+|[\s\/\:]+$/gi, '');
            var port = (this.port || '').replace(/^[\s\/\:]+|[\s\/\:]+$/gi, '');
            return port ? name + ':' + port : name;
        },
        set: function set(value) {
            var host = (value || '').replace(/^[^:]+\/+|^[\s\/]+|[\s\/]+/gi, '');
            this.hostName = (/^[^:]+/gi.exec(host) || [])[0] || '';
            this.port = (/^(?:[^:]+:)(.+)$/gi.exec(host) || [])[1] || '';
        }
    }, {
        key: 'query',
        get: function get() {
            return MiniUrl.parseQuery(this.search);
        },
        set: function set(value) {
            this.search = MiniUrl.formatQuery(value);
        }
    }], [{
        key: 'parseOrigin',
        value: function parseOrigin(url) {
            return (/^[^:]+:\/\/[^\/]+/gi.exec(url) || [])[0] || '';
        }
    }, {
        key: 'parseProtocol',
        value: function parseProtocol(url) {
            return (/^[^:]+:(?=\/\/)/gi.exec(url) || [])[0] || '';
        }
    }, {
        key: 'parseHost',
        value: function parseHost(url) {
            return (/^(?:[^:]+:\/\/)([^\/]+)/gi.exec(url) || [])[1] || '';
        }
    }, {
        key: 'parseHostName',
        value: function parseHostName(url) {
            return MiniUrl.parseHost(url).split(':')[0] || '';
        }
    }, {
        key: 'parsePort',
        value: function parsePort(url) {
            return MiniUrl.parseHost(url).split(':')[1] || '';
        }
    }, {
        key: 'parsePath',
        value: function parsePath(url) {
            return '/' + ((/^\/?[^\?\#]+/gi.exec((url || '').replace(/^[^:]+:\/\/[^\/]*/gi, '')) || [])[0] || '').replace(/^\/|\/$/gi, '');
        }
    }, {
        key: 'parseSearch',
        value: function parseSearch(url) {
            return '?' + ((/^(?:[^\?\#]+)(\?[^\#]+)/gi.exec(url) || [])[1] || '').replace(/^\?/gi, '');
        }
    }, {
        key: 'parseHash',
        value: function parseHash(url) {
            return '#' + ((/^(?:[^\#]+)(\#.+)/gi.exec(url) || [])[1] || '').replace(/^\#/gi, '');
        }

        // Converts the search portion of a url into an object
        // Example: MiniUrl.parseQuery('?a=b&c=1&d=true')

    }, {
        key: 'parseQuery',
        value: function parseQuery(search) {
            var query = {};
            search.replace(/^\s*\?/gi, '').split('&').filter(function (item) {
                return !!item;
            }).map(function (item) {
                return item.split('=').map(decodeURIComponent);
            }).forEach(function (item) {
                var name = item[0];
                var value = MiniUrl.parseValue(item[1]);
                if (!(name in query)) {
                    return query[name] = value;
                }
                if (!Array.isArray(query[name])) {
                    query[name] = [query[name]];
                }
                query[name].push(value);
            });
            return query;
        }

        // Attempts to intelligently parse a string to a value
        // Example: parseValue('10')

    }, {
        key: 'parseValue',
        value: function parseValue(value) {
            if (typeof value !== 'string') {
                return value;
            }
            if (/^(true|false)$/gi.exec(value)) {
                return value.toLowerCase() === 'true';
            }
            if (/^\d+$/gi.exec(value)) {
                return parseInt(value);
            }
            if (/^\d+\.\d*$/gi.exec(value)) {
                return parseFloat(value);
            }
            return value;
        }

        // Formats an object into a search for a url
        // Example: formatQuery({a: 'b', b: [1, 2, 3], c: true})

    }, {
        key: 'formatQuery',
        value: function formatQuery(query) {
            var items = [];
            for (var member in query) {
                var values = Array.isArray(query[member]) ? query[member] : [query[member]];
                values.forEach(function (value) {
                    value = typeof value === 'undefined' ? '' : value.toString();
                    items.push(encodeURIComponent(member) + '=' + encodeURIComponent(value));
                });
            }
            return items.length ? '?' + items.join('&') : '';
        }
    }]);

    return MiniUrl;
}();

exports.default = MiniUrl;

},{}],332:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/******************************************************************************
 *  TaskRunner: provides sequential, asynchronous task execution
 *
 *  usage:
 *      new TaskRunner(
 *          task1,
 *          task2,
 *          ...
 *      ).run()
 *      .then(() => { ... })
 *      .catch(() => { ... });
 *
 *  example task:
 *      class ExampleTask {
 *          constructor(next) {
 *              // Do some stuff
 *              next(); // call next when your stuff is done
 *          }
 *      }
 ******************************************************************************/
var TaskRunner = function () {
  function TaskRunner() {
    _classCallCheck(this, TaskRunner);

    this.tasks = Array.from(arguments);
  }

  _createClass(TaskRunner, [{
    key: "run",
    value: function run() {
      var _this = this;

      return new Promise(function (success, error) {
        var next = function next() {
          if (!_this.tasks.length) {
            return success();
          }
          var task = _this.tasks.shift();
          try {
            new task(next);
          } catch (e) {
            error(e);
          }
        };
        try {
          next();
        } catch (e) {
          error(e);
        }
      });
    }
  }]);

  return TaskRunner;
}();

exports.default = TaskRunner;

},{}],333:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ajax = require('../services/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _miniUrl = require('../services/mini-url');

var _miniUrl2 = _interopRequireDefault(_miniUrl);

var _configService = require('../services/config-service');

var _configService2 = _interopRequireDefault(_configService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = _configService2.default.instance.config;

// Provides functionality around parter user info

var AuthPartner = function () {
    function AuthPartner(next) {
        var _this = this;

        _classCallCheck(this, AuthPartner);

        config.partnerInfo = false;

        AuthPartner.getPartner(config).then(function () {
            if (!config.partnerInfo) {
                return next();
            }
            _this.getUser().then(function () {
                if (!config.partnerInfo.user) {
                    return _this.registerUser();
                }
                next();
            }).catch(function (error) {
                console.error('Partner Failure: ', error);
                next();
            });
        }).catch(function (error) {
            console.error('Partner Failure: ', error);
            next();
        });
    }

    _createClass(AuthPartner, [{
        key: 'getUser',
        value: function getUser() {
            return new Promise(function (success, error) {
                _ajax2.default.instance.post(window.location.protocol + '//' + config.locatorInfo.domain + '/partners/getUserPartnerData', {
                    providerName: config.authInfo.dealer.providerName,
                    providerUserId: config.authInfo.dealer.providerUserId,
                    partnerName: config.partnerInfo.partner['partner_name'],
                    partnerId: config.partnerInfo.partner['partner_id']
                }).then(function (response) {
                    console.info('Partner User: ', response);
                    config.partnerInfo.user = response.data[0];
                    return success();
                }).catch(function (response) {
                    console.info('Partner User: ', response);
                    config.partnerInfo.user = false;
                    if (response && response.data && response.data[0] && response.data[0].hasRecord === false) {
                        success(response);
                    } else {
                        error(response);
                    }
                });
            });
        }
    }, {
        key: 'registerUser',
        value: function registerUser() {
            window.location.href = config.partnerPath + (config.partnerPath.indexOf('?') >= 0 ? '&' : '?') + window.location.search.replace(/\?/gi, '');
        }
    }], [{
        key: 'getPartner',
        value: function getPartner(config) {
            return new Promise(function (success, error) {
                var query = _miniUrl2.default.parseQuery(window.location.search);
                var partnerid = query.oid || query.origin || query.originid || query.originId;
                if (!partnerid) {
                    return success();
                }

                _ajax2.default.instance.post(window.location.protocol + '//' + config.locatorInfo.domain + '/partners/get', { partnerId: partnerid }).then(function (response) {
                    console.info('Partner Response: ', response);
                    if (response.status !== 'success') {
                        return error(response);
                    }
                    config.partnerInfo = { partner: response.data[0].partner[0] };
                    success(response);
                }).catch(function (response) {
                    console.info('Partner Response: ', response);
                    error(response);
                });
            });
        }
    }]);

    return AuthPartner;
}();

exports.default = AuthPartner;

},{"../services/ajax":327,"../services/config-service":328,"../services/mini-url":331}],334:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _errorService = require('../services/error-service');

var _errorService2 = _interopRequireDefault(_errorService);

var _ajax = require('../services/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _miniUrl = require('../services/mini-url');

var _miniUrl2 = _interopRequireDefault(_miniUrl);

var _configService = require('../services/config-service');

var _configService2 = _interopRequireDefault(_configService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = _configService2.default.instance.config;


//Pulls FB then Dealer auth info and loads it into the config

var AuthUser = function () {
 function AuthUser(next) {
     var _this = this;

     _classCallCheck(this, AuthUser);

     config.authInfo = config.authInfo || {};

     this.authFacebook().then(function () {
         return new Promise(function (success, error) {
             config.locatorInfo = config.locatorInfo || {};

             var facebook = config.authInfo.facebook;
             _ajax2.default.instance.post(locatorUrl + "/u/locate", {
                 client_type: "web",
                 processor: config.isOnCanvas ? "pf" : "pp",
                 provider: config.isOnCanvas ? 'Facebook' : 'Facebook Off Canvas',
                 sid: facebook.signedRequest,
                 fbAccessToken: facebook.accessToken,
                 fbId: facebook.userID,
                 email: facebook.email
             }).then(function (response) {

               try{
                 locate(response);
               }catch(e){
                 console.log("============= error : " + e);
               }

                 console.info('Locator Response: ', response);

                 config.locatorInfo = response;

                 var _regex = /[?&]([^=#]+)=([^&#]*)/g,
                     _url = window.location.href,
                     _params = {},
                     _match;
                 while (_match = _regex.exec(_url)) {
                     _params[_match[1]] = decodeURIComponent(_match[2]);
                 }
                 if (_params["apiUrl"]) {
                     config.locatorInfo.domain = _params["apiUrl"];
                 }

                config.isOwnApi = "false";
                 if(_params["isOwnApi"]){
                   config.isOwnApi = _params["isOwnApi"];
                 }

                 if (response.service == "new_service") {
                     success();
                 } else {
                	 	var legacyRedirect = null;
                	 	if(config.isOnCanvas) {
                	 		legacyRedirect = onCanvasLegacyUrl;

                	 	}
                	 	else {
                	 		legacyRedirect = offCanvasLegacyUrl;

                	 	}

                    var hash = window.location.hash;
                    if(hash && hash.indexOf('#') < 0 && hash.length > 0){
                       hash = '#' + hash;
                    }

                    var search = window.location.search;
                    if(search && search.indexOf('?') < 0 && search.length > 0){
                      search = '?' + search;
                    }

                	 	window.location = legacyRedirect + hash + search;


                 }
             }).catch(function (response) {
                 console.error('Locator Response: ' + response);
                 error();
             });
         });
     }).then(function () {

       //flash enable check logic
        var hasFlash = false;
        for (var i in navigator.plugins) {
          if (navigator.plugins[i].name && navigator.plugins[i].name.toString().indexOf('Flash') > -1) {
            hasFlash = true;
          }
        }

        if(navigator.appName == "Microsoft Internet Explorer"){
          hasFlash = true;
        }

        if(hasFlash){
          _this.authDealer().then(function () {
            _this.newUser().then(function () {
                next();
            }).catch(function (error) {
                console.warn('New User Detection Failure: ', error);
                next();
            });
          }).catch(function (error) {
              console.error('Dealer Api Failure: ', error);
              _this.login();
          });
        }else{
          showFlashCheck();
          //document.getElementById('flashcheck').style.display = "block";
        }

     }).catch(function (error) {
         console.error('FB Api Failure: ', error);
         _this.login();
     });
 }

 _createClass(AuthUser, [{
     key: 'authFacebook',
     value: function authFacebook() {
         var _this2 = this;

         return new Promise(function (success, error) {
             // Ready facebook
             window.fbAsyncInit = function () {
                 FB.init({
                     appId: config.appId,
                     oauth: true,
                     version: 'v2.12'
                 }, true);

                 if (config.isOnCanvas) {
                     FB.Canvas.setAutoGrow();
                 }

                 FB.Event.subscribe('auth.logout', function (response) {
                     $.cookie('ddc_active', null, { path: '/' });
                     _this2.login();
                 });

                 var permissions = config.isOnCanvas ? 'public_profile,email,user_birthday,user_friends' : 'public_profile,email,user_birthday';

                 FB.getLoginStatus(function (response) {
                     console.info('FB Auth Response: ', response);
                     if (response.status === 'connected') {
                         config.authInfo.facebook = response.authResponse;
                         return success();
                     }
                     if (!config.isOnCanvas) {
                         return error();
                     }
                     console.warn('On-Canvas Login...');
                     FB.login(function (response) {
                         if (response.status === 'connected') {
                             config.authInfo.facebook = response.authResponse;
                             return success();
                         }
                         console.error('FB Auth Response: ', response);
                     }, { scope: permissions });
                 }, true);
             };

             // Launch facebook
             var e = document.createElement('script');
             e.src = 'https://connect.facebook.net/en_US/sdk.js';
             e.async = true;
             document.getElementById('fb-root').appendChild(e);
         });
     }
 }, {
     key: 'authDealer',
     value: function authDealer() {
         var _this3 = this;

         var facebook = config.authInfo.facebook;

         return new Promise(function (success, error) {
             var authParam = {
                 appId: config.appId,
                 processor: config.isOnCanvas ? "pf" : "pp",
                 providerName: config.isOnCanvas ? 'Facebook' : 'Facebook Off Canvas',
                 providerUserId: facebook.userID,
                 client_type: "web",
                 resolution: "1024X768",
                 signedRequest: facebook.signedRequest,
                 accessToken: facebook.accessToken,
                 generateCasinoId: true,
                 version_web: desktopResourceVersion
             };
             if (getParameter('pid'))
             {
                 authParam.pid = getParameter('pid');
             }
             if (getParameter('cid'))
             {
                 authParam.cid = getParameter('cid');
             }

             _ajax2.default.instance.post(config.locatorInfo.domain + '/authenticate/user', authParam).then(function (response) {
                 console.info('Dealer Auth Response: ', response);
                 config.authInfo.dealer = response.data[0];
                 window.jwtToken = window.jwtToken + config.authInfo.dealer.jwt;

                 $.ajaxSetup({
                   xhrFields: {
                       withCredentials: true
                     },
                   headers: {'authorization': window.jwtToken}
                 });

                 config.authInfo.dealer.userProvider = _this3.getProvider(config.authInfo.dealer.userProviders);
                 success();
             }).catch(function (response) {
                 console.info('Dealer Auth Response: ', response);
                 console.error('Dealer Response: ' + response);
                 error();
             });
         });
     }
 }, {
     key: 'newUser',
     value: function newUser() {
         return new Promise(function (success, error) {
             try {
                 if (!config.authInfo.dealer.newUser || !config.isOnCanvas) {
                     return success();
                 }
                 _ajax2.default.instance.post(config.locatorInfo.domain + '/invitation/rewardBatchInviters', {
                     useNotification: true,
                     inviteeProviderName: 'Facebook',
                     appId: config.appId,
                     inviteeProviderUserId: config.authInfo.facebook.userID
                 }, {'authorization': 'Bearer ' + config.authInfo.dealer.jwt}).then(function (response) {
                     success();
                 }).catch(function (e) {
                     error(e);
                 });
             } catch (e) {
                 error(e);
             }
         });
     }
 }, {
     key: 'login',
     value: function login() {
         if (config.isOnCanvas) {
             // window.location.reload(true);
            _errorService2.default.connectionError();
         } else {
             var navigation = new _miniUrl2.default(window.location.href);
             navigation.path = config.loginPath;
             window.location = navigation.toString();
         }
     }
 }, {
     key: 'getProvider',
     value: function getProvider(providers) {
         var providerName = "Double Down Heap o' Fun Old Casino"; // TODO: This gets the old casino id - please depreciate when possible
         return providers.find(function (p) {
             return p['provider_name'] === providerName;
         }) || providers.find(function (p) {
             return p['provider_name'] === "Double Down Heap o' Fun Old Casino";
         }) || providers.find(function (p) {
             return p['provider_name'] === "Double Down Casino";
         }) || providers.find(function (p) {
             return p['provider_name'] === "Facebook Off Canvas";
         }) || providers[0];
     }
 }]);

 return AuthUser;
}();

exports.default = AuthUser;

},{"../services/ajax":327,"../services/config-service":328,"../services/error-service":329,"../services/mini-url":331}],335:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
 value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _miniUrl = require('../services/mini-url');

var _miniUrl2 = _interopRequireDefault(_miniUrl);

var _configService = require('../services/config-service');

var _configService2 = _interopRequireDefault(_configService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = _configService2.default.instance.config;

//MISC prelim stuff that may or may not make any sense...

var Init = function () {
 function Init(next) {
     _classCallCheck(this, Init);

     window._gaq = window._gaq || [];

     if (Init.canvasRedirect()) {
         return;
     }

     next();
 }

 _createClass(Init, null, [{
     key: 'canvasRedirect',
     value: function canvasRedirect() {
         if (!config.isOnCanvas) {
             return false;
         }
         var currentLocation = new _miniUrl2.default(window.location.href);
         var targetLocation = new _miniUrl2.default(config.appUrl);
         var targetLocation2 = new _miniUrl2.default(landingUrl);
         if (targetLocation.hostName.toLowerCase() === currentLocation.hostName.toLowerCase() || targetLocation2.hostName.toLowerCase() === currentLocation.hostName.toLowerCase()) {
             return false;
         }
         var from = JSON.stringify(currentLocation);

         targetLocation.search = currentLocation.search;
         targetLocation.hash = currentLocation.hash;
         var query = currentLocation.query;
         query.isOnCanvas = true;
         targetLocation.query = query;
         var to = JSON.stringify(targetLocation);

         console.info('Canvas Proxy Redirect: ', targetLocation.toString(), 'from', from, 'to', to);
         window.location.replace(targetLocation.toString());
         return true;
     }
 }]);

 return Init;
}();

exports.default = Init;

},{"../services/config-service":328,"../services/mini-url":331}],336:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
 value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _legacyService = require('../services/legacy-service');

var _legacyService2 = _interopRequireDefault(_legacyService);

var _configService = require('../services/config-service');

var _configService2 = _interopRequireDefault(_configService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = _configService2.default.instance.config;

var LaunchIndex = function () {
 function LaunchIndex(next) {
     _classCallCheck(this, LaunchIndex);

     this.configureLanguage();
     this.configureGlobals();
     this.configureFlashVars();
     this.configureDdiOptions();
     this.configureURLParams();
     this.showLogoutButton();
     _legacyService2.default.loadQuanrudAdaptiveThing();
     _legacyService2.default.loadCommonJsThing();
     _legacyService2.default.loadAdsJsThing();
     _legacyService2.default.loadBuyChipsThing();
     _legacyService2.default.loadFacebookWrapperThing();
     _legacyService2.default.loadFacebookPopupThing();
     _legacyService2.default.loadFanPageLikeThing();

     this.launchApplication();
     return next();
 }

 _createClass(LaunchIndex, [{
     key: 'configureGlobals',
     value: function configureGlobals() {
         var data = config.authInfo.dealer;
         window.ENV_CONFIG = config;
         window.APP_URL = config.appUrl;
         window.APP_ID = config.appId;
         window.APPLICATION_ENV = config.isOnCanvas ? 'facebook' : 'www';
         window.DEALER_URL = config.locatorInfo.domain;
         window.LANG = config.userLang.lang;
         window.LOCALE = config.userLang.country;
         window.FBUID = data.userInfo.id;
         document.getElementById('providerUserId').value = data.providerUserId;
         document.getElementById('languageCode').value = data.userInfo.locale;
         document.getElementById('userId').value = data.userProvider.provider_user_id;
         if (config.partnerInfo && config.partnerInfo.partner && config.partnerInfo.partner.partner_name) {
            document.getElementById('partnerName').value = config.partnerInfo.partner.partner_name;
          }

     }
 }, {
     key: 'configureFlashVars',
     value: function configureFlashVars() {
         var data = config.authInfo.dealer;

         window.flashvars = {
             "APP_ID": config.appId,
             "APP_URL": config.appUrl,
             "CAPI_SERVICE_ENDPOINT": config.capiServer,
             "HTTP_PROTO": config.protocol,
             "PROVIDER_USER_ID": data.providerUserId,
             "SMARTFOX": config.sfservers[Math.round(Math.random() * config.sfservers.length)],
             "TOKEN": data.jwt,
             "URL_TARGET": config.urlTarget,
             "USER_ID": data.userProvider.provider_user_id
         };
     }
 }, {
     key: 'configureDdiOptions',
     value: function configureDdiOptions() {
         var data = config.authInfo.dealer;

         window.ddiOptions = {
             // Currently unchanging values - add to a config later if needed
             assetResolution: "1024x768",
             assetsPath: "/desktop/assets",
             casinoPackageDataPath: "/desktop/packages/packagedata",
             casinoLibraryPath: "/desktop/library",
             codeFileExtension: location.host.indexOf('t8gslot.com') > -1 ? ".js" : "_gz.js",
             casinoModuleId: "desktop-casino",
             crossDomain: true,
             casinoType: "desktop",
             context: "1024x768/",
             dealer_enabled: true,
             goldCoinsUIEnabled: false,
             loyaltyEnabled: true,
             providerName: "Double Down Casino",
             testHookAutoStartClient: true,
             testHookForceSmartfoxPolling: false,
             udid: "",
             inviteRewardAmounts: "1000000",

             // Configured values
             flashClientUrl: config.flashClientUrl,
             smartfoxPollingUrl: config.smartfoxPollingUrl,
             activePokerVariants: config.activePokerVariants,
             appId: config.appId,
             authType: config.isOnCanvas ? 'DESKTOP_AUTH_TYPE_FACEBOOK' : false,
             buildLang: config.userLang.lang,
             buildLocaleType: config.userLang.type,
             chipjarServiceUrl: config.locatorInfo.domain,
             cdnPathServiceEnabled: config.useRemoteCdn,
             cdnPathServiceLookupHash: { './': config.remoteCdnConfig },
             dealer_url: config.locatorInfo.domain,
             edcDevMode: config.debug,
             environment: config.isOnCanvas ? 'facebook' : 'www',
             experimentServiceClientURI: config.locatorInfo.domain + "/xpt/client",
             giftsEnabled: config.isOnCanvas,
             isDebugMode: config.debug,
             jsCompiledMode: config.jsCompiledMode,
             onFacebookCanvas: config.isOnCanvas,
             playerEvents: {
                 kinesisStreamIds: PLAYER_EVENTS_CONFIG.kinesisStreamIds,
                 options: PLAYER_EVENTS_CONFIG.options
             },
             protocol: config.protocol,
             providerUserId: data.providerUserId,
             sfservers: config.sfservers,
             sfsToken: data.jwt,
             skinTheme: config.skins.theme,
             skinConfigDesktopCasinoLobby: config.skins.desktopCasinoLobby,
             skinConfigDesktopDailyWheel: config.skins.desktopDailyWheel,
             token: data.jwt,
             userExperiments: config.experiments,
             newCasinoUser: data.newUser,
             userData: {
                 userId: data.userProvider.provider_user_id,
                 fbdata: data.userInfo,
                 noFriendData: !config.isOnCanvas
             },
             locatorInfo: config.locatorInfo,
             remoteCdnConfig: config.remoteCdnConfig,
             imageAssetsUrl:  desktopResourceUrl,
             isOwnApi: config.isOwnApi
         };
     }
 }, {
     key: 'configureURLParams',
     value: function configureURLParams() {
         for (var setting in config.urlParams) {
             window.ddiOptions[setting] = config.urlParams[setting];
         }
     }
 },{
     key: 'showLogoutButton',
     value: function showLogoutButton() {
      if (config.isOnCanvas) { return; }
        document.getElementById('log-out-button').style.display = 'inline';
      }

 }, {
     key: 'configureLanguage',
     value: function configureLanguage() {
         var pref = config.userPrefs.casinoPreferredLanguageCode;

         var _regex = /[?&]([^=#]+)=([^&#]*)/g,
             _url = window.location.href,
             _params = {},
             _match;
         while (_match = _regex.exec(_url)) {
             _params[_match[1]] = decodeURIComponent(_match[2]);
         }

         if (_params["locale"]) {
             pref = _params["locale"];
         }

         var parts = pref.split('_');
         config.userLang = {
             code: pref,
             lang: parts[0],
             country: parts[1],
             type: parts[0].toLowerCase() == 'pt' ? 'br' : 'common'
         };
     }
 }, {
     key: 'launchApplication',
     value: function launchApplication() {
         config.indexBootscripts.forEach(function (script) {
             script = _configService2.default.instance.toCdnPath(script);
             var element = document.createElement('script');
             element.type = 'text/javascript';
             element.src = script;
             document.getElementsByTagName('body')[0].appendChild(element);
         });

         var overlay = document.getElementById('load-overlay');
         if (overlay && overlay.parentNode) {
             overlay.parentNode.removeChild(overlay);
         }
     }
 }]);

 return LaunchIndex;
}();

exports.default = LaunchIndex;

},{"../services/config-service":328,"../services/legacy-service":330}],337:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
 value: true
});

var _errorService = require('../services/error-service');

var _errorService2 = _interopRequireDefault(_errorService);

var _ajax = require('../services/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _configService = require('../services/config-service');

var _configService2 = _interopRequireDefault(_configService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = _configService2.default.instance.config;

var LoadConfig = function LoadConfig(next) {
 _classCallCheck(this, LoadConfig);

 _ajax2.default.instance.get(config.clientConfigUrl).then(function (clientConfig) {
     if (clientConfig.launchpad.isMaintMode === true) {
         throw 'Maint Mode';
     }
     for (var setting in clientConfig.launchpad) {
         config[setting] = clientConfig.launchpad[setting];
     }
     return next();
 }).catch(function (error) {
     _errorService2.default.fatal('ConfigService failed', error);
 });
};

exports.default = LoadConfig;

},{"../services/ajax":327,"../services/config-service":328,"../services/error-service":329}],338:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
 value: true
});

var _ajax = require('../services/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _configService = require('../services/config-service');

var _configService2 = _interopRequireDefault(_configService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = _configService2.default.instance.config;

var LoadExperiments = function LoadExperiments(next) {
 _classCallCheck(this, LoadExperiments);

 _ajax2.default.instance.get(config.locatorInfo.domain + '/xpt/client/experiments/' + config.authInfo.dealer.userInfo.providerUserId).then(function (experiments) {
     config.experiments = experiments;
     return next();
 }).catch(function (error) {
     console.info("Experiment service failed: ", error);
     config.experiments = [];
     return next();
 });
};

exports.default = LoadExperiments;

},{"../services/ajax":327,"../services/config-service":328}],339:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
 value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _configService = require('../services/config-service');

var _configService2 = _interopRequireDefault(_configService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = _configService2.default.instance.config;

//Adds user preferences to the config or default preferences

var LoadPrefs = function () {
 function LoadPrefs(next) {
     _classCallCheck(this, LoadPrefs);

     config.userPrefs = LoadPrefs.getPrefs();
     next();
 }

 _createClass(LoadPrefs, null, [{
     key: 'getPrefs',
     value: function getPrefs() {
         try {

             var existing = localStorage.getItem(LoadPrefs.getPrefsKey());
             if (typeof existing !== 'string') {
                 return LoadPrefs.generateDefaults();
             }

             // casino sometimes stores prefs as an escaped JSON string and must be un-escaped
             if (/^\s*".+"\s*$/gi.exec(existing)) { existing = JSON.parse(existing); }

             var prefs = JSON.parse(existing);
             prefs.casinoPreferredLanguageCode = LoadPrefs.resolveLanguage(prefs.casinoPreferredLanguageCode);
             return prefs;
         } catch (error) {
             console.warn('Error reading user prefs:', error);
             return LoadPrefs.generateDefaults();
         }
     }
 }, {
     key: 'generateDefaults',
     value: function generateDefaults() {
         return {
             casinoPreferredLanguageCode: LoadPrefs.resolveLanguage(config.authInfo.dealer.userInfo.locale)
         };
     }
 }, {
     key: 'generateDefaults',
     value: function generateDefaults() {
         return {
             casinoPreferredLanguageCode: LoadPrefs.resolveLanguage(config.authInfo.dealer.userInfo.locale)
         };
     }
 }, {
     key: 'resolveLanguage',
     value: function resolveLanguage(lang) {
         var defaultLanguage = 'en_US';
         var availableLanguages = ['en_US', 'de_DE', 'es_ES', 'fr_FR', 'it_IT', 'pt_BR'];
         // NOTE: If availableLanguages EVER changes please move to a config value.

         var resolvedLanguage = lang || defaultLanguage;
         var parts = resolvedLanguage.split(/[_-]/gi);
         if (parts.length !== 2) {
             resolvedLanguage = [parts[0], { // If missing country, attempt to map or default to fake-common
                 'en': 'US',
                 'de': 'DE',
                 'es': 'ES',
                 'fr': 'FR',
                 'it': 'IT',
                 'pt': 'BR'
             }[parts[0].toLowerCase()] || parts[0].toUpperCase()].join('_');
         }

         return availableLanguages.some(function (l) {
             return l == resolvedLanguage;
         }) ? resolvedLanguage : 'en_US';
     }
 }, {
     key: 'getPrefsKey',
     value: function getPrefsKey() {
         return 'preferences' + config.authInfo.dealer.userProvider.provider_user_id;
     }
 }]);

 return LoadPrefs;
}();

exports.default = LoadPrefs;

},{"../services/config-service":328}],340:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
 value: true
});

var _ajax = require('../services/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _miniUrl = require('../services/mini-url');

var _miniUrl2 = _interopRequireDefault(_miniUrl);

var _configService = require('../services/config-service');

var _configService2 = _interopRequireDefault(_configService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = _configService2.default.instance.config;

var LoadURLParams = function LoadURLParams(next) {
 _classCallCheck(this, LoadURLParams);

 config.urlParams = {};
 var supportedParams = {
     // url param name                 : config/ddioptions name
     "skinConfigDesktopCasinoLobby": "skinConfigDesktopCasinoLobby",
     "skinConfigDesktopDailyWheel": "skinConfigDesktopDailyWheel",
     "disableMarketingDialogs": "isMarketingDisabled",
     "disableMPEDialogs": "isMPEDisabled",
     "edcJsCompiledMode": "jsCompiledMode",
     "edcTestHookForceSmartfoxPolling": "testHookForceSmartfoxPolling"
 };
 var urlParams = _miniUrl2.default.parseQuery(window.location.search);
 for (var setting in urlParams) {
     if (setting in supportedParams) {
         config.urlParams[supportedParams[setting]] = urlParams[setting];
     }
 }
 next();
};

exports.default = LoadURLParams;

},{"../services/ajax":327,"../services/config-service":328,"../services/mini-url":331}],"config":[function(require,module,exports){
	module.exports={"environment":environment,"minify":false,"debug":environment=='prod'?false:true,"jsCompiledMode":true,"indexPath":"/","loginPath":"login","partnerPath":"partner","appUrl":landingUrl,"assetsUrl":"https://"+desktopResourceUrl+"/ddc-www-casino","appId":facebookOffCanvasAppId,"protocol":"https://","useRemoteCdn":true,"remoteCdnConfig":{"host":desktopResourceUrl,"id":desktopResourcePath,"version":desktopResourceVersion},"clientConfigUrl":"//"+location.hostname+"/ccf/public/v1/config/launchpad.json","flashClientUrl":"http://www.google.com","maintImageUrl":"http://ddc-cdn-desktop-dev.s3-website-us-east-1.amazonaws.com/ddc-www-casino/images/maintenance.gif","instrumentation":{"streamId":"ddc-instrumentation-stream-desktop","identityPoolId":"us-east-1:7b69c6bc-1cd7-4808-bf83-59f119731643","roleArn":"arn:aws:iam::416386939808:role/Cognito_MobileWebUsersUnauth_Role"},"indexBootscripts":["desktop/bootstrap.min.js"],"canvas-config":{"useRemoteCdn":true,"appUrl":landingUrl,"appId":facebookAppId,"protocol":"https://"},"build":1510739138689}
},{}]},{},[326]);
