# Core

#### 描述
{**核心类属性说明**}

###BaseForm
###成员
| 成员 | 说明 | 类型 | 默认值
| --- | --- | --- | --- |
|[createTime]|创建时间|string|-
|[createUserName]|创建用户|string|-
|[lastModifyTime]|最后更新时间|string|-
|[lastModifyUserName]|最后更新用户|string|-
###BaseNzTreeNodeOptions
###成员
| 成员 | 说明 | 类型 | 默认值
| --- | --- | --- | --- |
|[loadedChildren]|已加载子节点|boolean|-
|[data]|数据|any|-
|[type]|类型|string|-
###BaseTreeSearchConfig
###成员
| 成员 | 说明 | 类型 | 默认值
| --- | --- | --- | --- |
|[parentId]|父节点标识|string|-
|[maxLevel]|每一次请求的层级|number|-
###ComboBox
###成员
| 成员 | 说明 | 类型 | 默认值
| --- | --- | --- | --- |
|[name]|名称|string|-
|[code]|编码|string|-
###ComboBoxTreeNode
###成员
| 成员 | 说明 | 类型 | 默认值
| --- | --- | --- | --- |
|[name]|名称|string|-
|[code]|编码|string|-
###GroupComboBox
###成员
| 成员 | 说明 | 类型 | 默认值
| --- | --- | --- | --- |
|[group]|分组名称|string|-
###OrderBy
###成员
| 成员 | 说明 | 类型 | 默认值
| --- | --- | --- | --- |
|[orderByField]|排序字段|string|-
|[orderByFields]|排序字段|string[]|-
|[orderByType]|排序方式|OrderByType|-
|[orderByTypes]|排序方式|OrderByType[]|-
|[orderByStr]|排序字符串|string|-
###Page
###成员
| 成员 | 说明 | 类型 | 默认值
| --- | --- | --- | --- |
|[page]|页数|number|-
|[rows]|行数|number|-
|[searchCount]|是否查询总数|boolean|-
|[searchResult]|是否查询结果|boolean|-
###ReturnForm
###成员
| 成员 | 说明 | 类型 | 默认值
| --- | --- | --- | --- |
|[success]|是否成功|boolean|-
|[message]|消息体|any|-
|[errorMessage]|错误消息体|string|-
|[status]|返回状态|number|-
###BaseService
###基础服务的方法
| 名称 | 说明 |
| --- | --- |
|listWithPage(searchForm: S): Observable<ReturnForm<ReturnPage<F>>>|分页查询|
|list(searchForm: S): Observable<ReturnForm<F[]>>|列表查询|
|get(id: string): Observable<ReturnForm<F>>|按标识获取|
|commit(entity: F): Observable<ReturnForm<F>>|表单提交|
|remove(ids: string[]): Observable<ReturnForm<string>>|删除数据|
|comboBox(searchForm: S): Observable<ReturnForm<ComboBox[]>>|获取下拉列表数据|
|updateOrder(keyIds: string[], baseParam: object = {}): Observable<ReturnForm<string>>|修改排序|
|drag(dragId: string, targetId: string, position: number): Observable<ReturnForm<string>>|拖拽树节点|
###BaseTreeService
###基础的树服务的方法
| 名称 | 说明 |
| --- | --- |
|getNzTree(parentId: string, searchConfig?: BaseTreeSearchConfig, maxLevel?: number): Observable<ReturnForm<T[]>>|获取子节点|
|searchNzTree(text: string): Observable<ReturnForm<T[]>>|搜索树|
|getComboBoxNzTree(parentId: string, searchForm?: BaseTreeSearchConfig, maxLevel?: number): Observable<ReturnForm<ComboBoxTreeNode[]>>|获取下拉树子节点|
|searchComboBoxNzTree(text: string): Observable<ReturnForm<ComboBoxTreeNode[]>>|搜索下拉树|
###BaseWebSocketService
###基础的webSocket服务的方法
| 名称 | 说明 |
| --- | --- |
|connect(url): BaseWebSocket|连接webSocket|
|create(): BaseWebSocket|创建一个webSocket连接对象|
###BaseWebSocket
###成员
| 成员 | 说明 | 类型 | 默认值| 
--- | --- | --- | --- |
|messageSubject|subject对象,用于发送事件|Subject<ReturnForm<any>>/-
|connectSubject|连接事件|Subject<any>/-
|disconnectSubject|关闭连接事件|Subject<any>/-
|url|默认请求的url|string/-
|webSocket|webSocket对象|WebSocket/-
|connectSuccess|连接状态|boolean|false
|period|心跳周期（毫秒）|number|600000
|serverTimeoutSubscription|定时检测连接对象|any|-
|allowReconnect|是否允许重连|boolean|false
|_reconnectFlag|重连标记|boolean|false
|reconnectPeriod|重连失败后再重连的时间（毫秒）|number|5000
|reconnectSubscription|重连订阅对象（毫秒）|Observable|-
|runTimeSubscription|记录运行连接|any|-
|runTimePeriod|记录运行连接时间|number|600000
###方法
| 名称 | 说明 |
--- | --- |
|sendMessage(message)|发送消息|
|connect(url)|创建新连接|
|createWebSocket()|创建连接|
|onOpen(e)|连接打开|
|onMessage(event)|接受到消息|
|onMessage(event)|接受到消息|
|close()|主动断开|
|reconnect()|开始重新连接|
|stopReconnect()|停止重连|
|heartCheckStart()|开始心跳检测|
|heartCheckStop()|停止心跳检测|
|calcRunTime()|开始计算运行时间|
|stopRunTime()|停止计算运行时间|
