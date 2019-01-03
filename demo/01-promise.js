//为什么有Promise  在异步操作中会有大量的回调嵌套  -- 回调地狱
//1s 后 一件事情  2s 后 一件事件

// setTimeout(()=>{
//   console.log('1s')
//   setTimeout(()=>{
//     console.log('2s')
//   },2000)
// },1000)

//使用Promise对异步操作进行封装
const first = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('1s')
      resolve()
    }, time)
  })
}
first(1000)
  .then(() => {
    return first(2000)
  })
  .then(() => {

  })

