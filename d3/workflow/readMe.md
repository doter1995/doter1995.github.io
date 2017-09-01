#关于工作流简要说明

#### 工作流是通过全局变量_nodeEvent.workFlow来装载配置据
其中nodes为节点信息,其余数据用于辅助性数据

workState是我将原来react工作流中redux数据处理拆除改写后的E6语法，最终使用babel在线转换为es5语法，从而不再重写交互逻辑。

#### WorkFlow全局对象主要对外提供接口，用于调控工作流。
#### _myNode用于单个节点渲染

#### _workFTool用于提供非功能性，例如导入校验，导出文件等等



全局逻辑是
1. 使用d3绘制节点  使用数据_nodeEvent.workFlow。 
2. 绘制时添加事件，事件触发会调用SetState方法。
3. 需要修改数据时,使用SetState方法，修改并重绘页面。



注：State是原react Redux抽出的es6语法

部分功能正在抽取，稍等