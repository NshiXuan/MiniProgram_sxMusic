export function stringToNodes(keyword, searchValue) {
  const nodes = []
  // startsWith可以判断以什么开头 这里以搜索的字符串开头 keyword为服务器返回的搜索建议 searchValue为输入内容
  // 转为大写为了把小写也转为大写来比较 保证大小写都可以匹配
  if (keyword.toUpperCase().startsWith(searchValue.toUpperCase())) {
    const key1 = keyword.slice(0, searchValue.length)
    const node1 = {
      name: "span",
      attrs: { style: "color: #26ce8a;" },
      children: [{ type: "text", text: key1 }]
    }
    nodes.push(node1)

    const key2 = keyword.slice(searchValue.length)
    const node2 = {
      name: "span",
      attrs: { style: "color: #000000;" },
      children: [{ type: "text", text: key2 }]
    }
    nodes.push(node2)
  } else {
    const node = {
      name: "span",
      attrs: { style: "color: #000000;" },
      children: [{ type: "text", text: keyword }]
    }
    nodes.push(node)
  }
  return nodes
}