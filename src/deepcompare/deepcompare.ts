// 定义一个deepCompareObjects函数，接受两个对象，深度比较二者间不同的字段并输出包含了不同字段的key和value，输出的类型是一个对象
export function deepCompareObjects<T extends Record<string, any>>(obj1: T, obj2: T): Record<string, { value1: any; value2: any }> {
    const result: Record<string, { value1: any; value2: any }> = {};
    for (const key in obj1) {
      // 如果字段是对象类型，递归调用deepCompareObjects函数
      if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
        // 根据字段的具体类型，调用相应的比较函数
        switch (getType(obj1[key])) {
          case "Array":
            compareArrays(obj1[key], obj2[key], key, result);
            break;
          case "Map":
            compareMaps(obj1[key], obj2[key], key, result);
            break;
          case "Set":
            compareSets(obj1[key], obj2[key], key, result);
            break;
          case "Date":
            compareDates(obj1[key], obj2[key], key, result);
            break;
          default:
            compareObjects(obj1[key], obj2[key], key, result);
        }
      } else {
        // 如果字段不是对象类型，直接比较值是否相等
        if (!deepEqual(obj1[key], obj2[key])) {
          result[key] = { value1: obj1[key], value2: obj2[key] };
        }
      }
    }
    return result;
  }
  
  // 定义一个compareArrays函数，接受两个数组，一个键名和一个结果对象，比较数组的长度和元素是否相等，并将不同的字段添加到结果对象中
  function compareArrays<T>(arr1: T[], arr2: T[], key: string, result: Record<string, { value1: any; value2: any }>): void {
    // 如果数组的长度不相等，直接返回value为该数组
    if (arr1.length !== arr2.length) {
      result[key] = { value1: arr1, value2: arr2 };
    } else {
      // 定义一个flag变量，表示数组是否相等
      let flag = true;
      for (let i = 0; i < arr1.length; i++) {
        // 如果有任何一个元素不相等，将flag设为false，并跳出循环
        if (!deepEqual(arr1[i], arr2[i])) {
          flag = false;
          break;
        }
      }
      // 如果flag为false，表示数组不相等，返回value为该数组
      if (!flag) {
        result[key] = { value1: arr1, value2: arr2 };
      }
    }
  }
  
  // 定义一个compareMaps函数，接受两个map，一个键名和一个结果对象，比较map的大小和键值对是否相等，并将不同的字段添加到结果对象中
  function compareMaps<K, V>(map1: Map<K, V>, map2: Map<K, V>, key: string, result: Record<string, { value1: any; value2: any }>): void {
    if (map1.size !== map2.size) {
      result[key] = { value1: map1, value2: map2 };
    } else {
      for (const [k, v] of map1) {
        if (!map2.has(k) || !deepEqual(v, map2.get(k))) {
          result[`${key}.${k}`] = { value1: v, value2: map2.get(k) };
        }
      }
    }
  }
  
  // 定义一个compareSets函数，接受两个set，一个键名和一个结果对象，比较set的大小和元素是否相等，并将不同的字段添加到结果对象中
  function compareSets<T>(set1: Set<T>, set2: Set<T>, key: string, result: Record<string, { value1: any; value2: any }>): void {
    if (set1.size !== set2.size) {
      result[key] = { value1: set1, value2: set2 };
    } else {
      for (const v of set1) {
        if (!set2.has(v)) {
          result[`${key}.${v}`] = { value1: v, value2: undefined };
        }
      }
    }
  }
  
  // 定义一个compareDates函数，接受两个date，一个键名和一个结果对象，比较date的时间戳是否相等，并将不同的字段添加到结果对象中
  function compareDates(date1: Date, date2: Date, key: string, result: Record<string, { value1: any; value2: any }>): void {
    // 如果date的时间戳不相等，返回value为该date
    if (date1.getTime() !== date2.getTime()) {
      result[key] = { value1: date1, value2: date2 };
    }
  }

  // 定义一个compareObjects函数，接受两个对象，一个键名和一个结果对象，比较它们的属性是否相等，并将不同的字段添加到结果对象中
function compareObjects<T extends Record<string, any>>(obj1: T, obj2: T, key: string, result: Record<string, { value1: any; value2: any }>): void {
    const subResult = deepCompareObjects(obj1, obj2);
    // 如果子结果不为空，将子结果拼接到结果中
    if (Object.keys(subResult).length > 0) {
      for (const subKey in subResult) {
        result[`${key}.${subKey}`] = subResult[subKey];
      }
    }
  }
  
  // 定义一个getType函数，接受一个值，返回它的类型字符串
  function getType(x: any): string {
    return Object.prototype.toString.call(x).slice(8, -1);
  }
  
  // 定义一个deepEqual函数，接受两个值，深度比较它们是否相等
  function deepEqual(x: any, y: any): boolean {
    // 如果两个值都是对象类型，递归调用deepEqual函数
    if (typeof x === "object" && typeof y === "object") {
      // 如果两个值都是null，返回true
      if (x === null && y === null) return true;
      // 如果两个值有一个是null，返回false
      if (x === null || y === null) return false;
      // 如果两个值都是数组类型，比较数组的长度和元素是否相等
      if (Array.isArray(x) && Array.isArray(y)) {
        if (x.length !== y.length) return false;
        for (let i = 0; i < x.length; i++) {
          if (!deepEqual(x[i], y[i])) return false;
        }
        return true;
      }
      // 如果两个值都是map类型，比较map的大小和键值对是否相等
      else if (x instanceof Map && y instanceof Map) {
        if (x.size !== y.size) return false;
        for (const [k, v] of x) {
          if (!y.has(k) || !deepEqual(v, y.get(k))) return false;
        }
        return true;
      }
      // 如果两个值都是set类型，比较set的大小和元素是否相等
      else if (x instanceof Set && y instanceof Set) {
        if (x.size !== y.size) return false;
        for (const v of x) {
          if (!y.has(v)) return false;
        }
        return true;
      }
      // 如果两个值都是date类型，比较date的时间戳是否相等
      else if (x instanceof Date && y instanceof Date) {
        return x.getTime() === y.getTime();
      }
      // 其他对象类型，比较它们的属性是否相等
      else {
        for (const key in x) {
          if (!(key in y) || !deepEqual(x[key], y[key])) return false;
        }
        for (const key in y) {
          if (!(key in x)) return false;
        }
        return true;
      }
    } else {
      // 如果两个值不是对象类型，直接比较它们是否相等
      return Object.is(x, y);
    }
  }