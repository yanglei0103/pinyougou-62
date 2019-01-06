const template = require('art-template')
const path = require('path')
const url = require('url')
/**
 * 生成分页的HTML
 * @param options {page:'',total:'',btnNum:''}
 */
module.exports = (options) => {
  //思考：生成分页的时候需要哪些参数
  //1. 当前页码    page
  //2. 总页数     total
  //3. 显示多少个页码的按钮  btnNum  默认 5个
  //规则：当前页码的按钮尽可能在中间
  //4. 请求对象  req
  //我们需要在进行分页跳转的时候  带上之前的传参  去修改当前页码
  const req = options.req
  //获取当前请求的地址
  //a. 需求  /list/1?page=2&sort=price  地址转换出里面的传参
  //b. url.parse(url) 转换url字符串地址为对象  query属性只是键值对字符串
  //c. url.parse(url,true) 转换url字符串地址为对象  query属性包含所有传参而是对象
  const urlObject = url.parse(req.url, true) //转成url对象  query search pathname
  //urlObject.query.page = 10
  //如果 urlObject.search 数据   ‘?page=2&sort=price’  拼接地址
  //如果 urlObject.search 是 undefined 使用 query属性 是个对象  querystring.stringify()
  //urlObject.search = undefined
  //const createUrl = url.format(urlObject)  //格式化url对象  生成url地址
  // /list/1?page=10&sort=price
  //console.log(createUrl)
  const getUrl = (page) => {
    urlObject.query.page = page
    urlObject.search = undefined
    return url.format(urlObject)
  }
  //console.log(getUrl(8)) 去模版引擎中使用

  const {page, total} = options
  const btnNum = options.btnNum || 5

  //计算起始按钮的页码
  //计算结束按钮的页码

  //理想情况起始的页码
  let begin = page - Math.floor(btnNum / 2)
  //起始的页码小于1的时候
  begin = begin < 1 ? 1 : begin

  //理想情况结束的页码
  let end = begin + btnNum - 1
  //结束的页码大于总页数
  end = end > total ? total : end

  //如果结束按钮的页码换了  起始的页码也需要换
  begin = end - btnNum + 1
  //起始的页码小于1的时候
  begin = begin < 1 ? 1 : begin

  //生成HTML格式的字符串（分页） 使用模版引擎
  //通过路径找到模版结合数据动态生成HTML格式的分页
  const urlTemplate = path.join(__dirname, '../views/component/pagination.art')
  return template(urlTemplate, {page, total, begin, end, getUrl, query: req.query})
}