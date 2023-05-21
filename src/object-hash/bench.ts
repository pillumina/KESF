import { hasher } from "./hasher";


const obj1 = {
    a: ["1", "2", "3"],
    b: "c"
}

const obj2 = {
    b: "c",
    a: ["1", "2", "3"],
}

const res1 = hasher().hash(obj1)
const res2 = hasher().hash(obj2)

console.log(`res1: ${res1}`)
console.log(`res2: ${res2}`)
console.log(res1 === res2)