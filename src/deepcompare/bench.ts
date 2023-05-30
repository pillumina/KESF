// 导入deepCompareObjects函数
import { deepCompareObjects } from "./deepcompare";

// 导入performance模块
import { performance } from "perf_hooks";

// 定义一个testPerformance函数，接受一个函数和一组参数，返回函数的执行时间、内存占用和cpu占用
function testPerformance<T extends any[], R>(fn: (...args: T) => R, ...args: T): { time: number; memory: number; cpu: number } {
  // 记录开始时间
  const start = performance.now();
  // 记录开始内存
  const startMemory = process.memoryUsage().heapUsed;
  // 记录开始cpu
  const startCpu = process.cpuUsage();
  // 调用函数
  fn(...args);
  // 记录结束时间
  const end = performance.now();
  // 记录结束内存
  const endMemory = process.memoryUsage().heapUsed;
  // 记录结束cpu
  const endCpu = process.cpuUsage();
  // 返回执行时间、内存占用和cpu占用
  return {
    time: end - start,
    memory: endMemory - startMemory,
    cpu: (endCpu.user - startCpu.user + endCpu.system - startCpu.system) / 1000,
  };
}

// 定义一个person1对象，包含name和hobbies属性，其中name属性是一个对象，包含first和last属性；hobbies属性是一个数组，包含三个字符串元素
const person1 = {
  name: {
    first: "Alice",
    last: "Smith",
  },
  hobbies: ["reading", "writing", "coding"],
};

// 定义一个person2对象，包含name和hobbies属性，其中name属性是一个对象，包含first和last属性；hobbies属性是一个数组，包含三个字符串元素
const person2 = {
  name: {
    first: "Bob",
    last: "Jones",
  },
  hobbies: ["reading", "gaming", "cooking"],
};

// 定义一个times变量，表示要执行的次数
const times = 100000;

// 定义一个totalTime变量，表示总的执行时间
let totalTime = 0;

// 定义一个totalMemory变量，表示总的内存占用
let totalMemory = 0;

// 定义一个totalCpu变量，表示总的cpu占用
let totalCpu = 0;

// 循环执行times次函数，并累加执行时间、内存占用和cpu占用
for (let i = 0; i < times; i++) {
  const result = testPerformance(deepCompareObjects, person1, person2);
  totalTime += result.time;
  totalMemory += result.memory;
  totalCpu += result.cpu;
}

// 计算平均执行时间、平均内存占用和平均cpu占用
const averageTime = totalTime / times;
const averageMemory = totalMemory / times;
const averageCpu = totalCpu / times;

// 输出平均执行时间、平均内存占用和平均cpu占用
console.log(`Average time: ${averageTime} ms`);
console.log(`Average memory: ${averageMemory} bytes`);
console.log(`Average cpu: ${averageCpu} ms`);