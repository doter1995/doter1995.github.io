##使用文档
使用流程：
1.创建一个svg
2.初始化WorkFlow
```javascript
  var RootNode = document.getElementById('ROOT')
  WorkFlow.init(RootNode,initState)//数据加载
```
其中initState为wrokFLow的配置
3.重写部分函数，例如节点点击事件
```javascript
  WorkFlow.onNodeCilck = function () {
    alert("替代后的事件")
  }
```



# api部分
### _workFTool

checkNode(nodesJson)  //nodes校验，仅校验节点渲染所需位置信息

showNodes(RootNode)  //绘制节点数据 由于svg先画处于底层，所以节点在最后绘制。

### WorkFlow

onNodeCilck：(i,e) //点击节点，常用于处理弹出对话框 i为节点序号 ，e  event

nodeS 当前节点数据，基本保证了实时数据

addDefaultNode(x,y) 添加一个默认节点，设置x，y属性

addNode(node)   添加节点，未对数据进行校验，请确保数据正确

delNode(i) 删除节点需要节点的序号i

outPutData(filename) 导出成JSON文件 filename文件名 自动添加.json后缀  默认为test.json

changeNodeData(id,data)  修改node节点数据
