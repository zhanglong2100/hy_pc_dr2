# base-tree

#### 描述
{**基础树模块使用说明**}

### BaseTreeComponent
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | ---
|[draggable]|树节点是否允许拖拽|boolean|false
|[showTypeIcon]|是否显示树节点图标|boolean|false
|[customLoadMethod]|自定义树加载方法|(parentId: string, searchConfig: any, maxLevel: number, baseTreeService: BaseTreeService<STData, Page, BaseNzTreeNodeOptions<STData>>) => Observable<ReturnForm<BaseNzTreeNodeOptions<any>[]>>|-
|[customDragMethod]|自定义树节点拖拽方法|(dragId: string, targetId: string, position: number, baseTreeService: BaseTreeService<STData, Page, BaseNzTreeNodeOptions<STData>>) => Observable<ReturnForm<string>>|-
|[checkable]|是否显示多选框|boolean|false
|[checkedWhileClick]|是否点击节点时选择复选框|boolean|false
|[typeIcon]|树节点图标制定|{ [key: string]: string }|{"root":"dr:hy-root"}
|[maxLevel]|树加载最大查询级别|number|-1
|[searchConfig]|树加载配置项|BaseTreeSearchConfig|-
|[showSearch]|是否显示树搜索框|boolean|false
|[globalName]|根节点名称|string|根节点
|[beforeDrop]|节点拖拽前验证|(dragNode: BaseNzTreeNodeOptions<STData>, targetNode: BaseNzTreeNodeOptions<STData>) => boolean|-
|[treeNodeTemplate]|自定义树节点|TemplateRef<{ $implicit: BaseNzTreeNodeOptions<STData>; }>|-
|(selectNode)|选择树节点时回调|BaseNzTreeNodeOptions<STData>|-
|(expandChange)|树节点展开时回调|BaseNzTreeNodeOptions<STData>|-
###组件属性和方法
| 名称 | 说明 |
| --- | --- |
|[nzTree]|获取nzTree组件|
|[activatedNode]|获取当前选中的节点|
|[treeData]|获取树的数据|
|[searchValue]|获取当前搜索框输入的值|
|[checkedKeys]|获取当前勾选的树节点|
|searchTree(value: string)|搜索树|
|reload()|重新加载树|
|reloadNode(nodeId)|按树节点标识重新加载树|
|setDefaultChecked(keys: string[])|设置默认选中的节点|
|getTreeNodeTypeIcon(treeNode: BaseNzTreeNodeOptions<STData>): string|获取树节点图标|
