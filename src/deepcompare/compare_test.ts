import { deepCompareObjects } from "./deepcompare";


// 定义一个person1对象，包含name和birthday属性，其中name属性是一个对象，包含first和last属性；birthday属性是一个date对象
const person1 = {
    name: {
      first: "Alice",
      last: "Smith",
    },
    birthday: new Date(1996, 0, 1),
  };
  
  // 定义一个person2对象，包含name和birthday属性，其中name属性是一个对象，包含first和last属性；birthday属性是一个date对象
  const person2 = {
    name: {
      first: "Bob",
      last: "Jones",
    },
    birthday: new Date(1995, 11, 31),
  };

  const diff = deepCompareObjects(person1, person2);
  console.log(diff); 