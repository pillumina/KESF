import {property, some, toLower, toUpper} from "lodash";
import { join, curry, call, compose, map, prop, AnyFunction, split} from "ramda";
import http = require('http')


/**
 * Cachable: memoize
 */
const memoize  = (fn: CallableFunction): CallableFunction => {
    const cache: any = {};
    
    return (...args: any) => {
        const argStr = JSON.stringify(args);
        cache[argStr] = cache[argStr] || fn(...args);
        return cache[argStr];
    }
}

const square = memoize((x: number) => {
    return x * x;
})


 console.log(square(2)); 


 /**
  * Portable
  */


 /**
  * Currying
  */

const curried = curry((what: string, str: string) => {
    return str.match(what);
})

// console.log(curried("*"));



/**
 * compose
 */

/**
 * pointfree: 函数无需提及将要操作的数据是什么样的。function, currying, compose组合协作这种模式
 */
const snakeCase = compose(toUpper, toLower);
console.log(snakeCase("helloworld"));


interface res {
    items: item[];
}

interface item {
    media: media;
}

interface media {
    name: string;
}

const trace = curry((tag: string, x: string) => {
    console.log(tag, x);
    return x;
})

const impure = curry((callback: Function, url: string) => {
    console.log(`get url: ${url}`);
    callback();
})

const url = (form: string) => {
    return 'http://example?tags=' + form;
}

const app = compose(impure(trace("response")), url);

app("cats");

const get = curry((property: any, obj: object) => {
    return obj[property];
})
    

const mediaName = compose(get("name"), get("media"));
// 得到items，用map分解每一个item，得到含有name的数组
const srcs = compose(map(mediaName), get("items"));
const mockRes = {items: [{media: {name: "test1"}}, {media: {name: "test2"}}, {media: {name: "test3"}}]};
console.log(srcs(mockRes));


/**
 * Delay
 */

class IO {
    _value : AnyFunction;
    constructor(fn: AnyFunction) {
        this._value = fn;
    }
    of(x: any){
        return new IO(() => {
            return x;
        });
    }

    map(fn: AnyFunction) {
        return new IO(compose(fn, this._value));
    }
}


const ioWindow = new IO(() => {
    return window;  
});

ioWindow.map((win: Window) => {
    return win.innerWidth;
})

ioWindow.map(prop('location')).map(prop('href')).map(split('/'));






