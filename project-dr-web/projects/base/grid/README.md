# base-grid

#### 描述
{**基础表格模块使用说明**}

### BaseGridComponent
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | ---
|[baseParam]|表单提交的默认值|{ [key: string]: string }|-
|[name]|编辑窗口的名称|string|-
|[usePage]|是否使用分页|boolean|true
|[rowClassName]|表格行的类名|(record: STData, index: number) => string|-
|[keyField]|主键字段名|string|-
|[usePopup]|编辑窗口是否使用弹窗|boolean|true
|[typeIcon]|自定义列表的图标| [key: string]: string }|{}
|[clickRowWhileSetRowClass]|点击表格行设置行类名，配合rowClassName使用| boolean|false
|[typeFieldName]|类型字段名称，配合typeIcon使用| string|-
|[sortNameField]|排序的显示的字段名称| [key: string]: string }|-
|[customButtons]|自定义按钮| string 或者 TemplateRef<void> 或者 null|-
|[customContent]|自定义内容| string 或者 TemplateRef<void> 或者 null|-
|[customOperateButtons]|自定义表格内的操作按钮|STColumnButton[]|-
|[schema]|制定表单|SFSchema|-
|[popupWidth]|属性编辑窗口的宽度|string|-
|[popupHeight]|属性编辑窗口的高度|string|-
|(detailFormChange)|表单数据变更时回调|STData|-
|(dataReload)|表格重新加载时回调|void|-
|(itemClick)|列表项点击时回调|STData|-
|[showAdd]|是否显示新增按钮|boolean|true
|[addButtonText]|新增按钮文本|string|新增
|[showDelete]|是否显示删除按钮|boolean|true
|[showModify]|是否显示修改按钮|boolean|true
|[modifyButtonText]|修改按钮文本|string|修改
|[showRefresh]|是否显示刷新按钮|boolean|true
|[showSort]|是否显示排序|boolean|false
|[showTableListChange]|是否显示表格、图层切换按钮|boolean|false
|[showOperateModify]|是否显示表格内的修改按钮|boolean|true
|[showOperateDelete]|是否显示表格内的删除按钮|boolean|true
|[columns]|表格列制定|STColumn[]|-
|[customLoadPageMethod]|自定义分页的加载方法|(page: Page, baseService?: BaseService<STData, Page>) => Observable<ReturnForm<ReturnPage<STData>>>|-
|[customLoadMethod]|自定义列表的加载方法|(page: Page, baseService?: BaseService<STData, Page>) => Observable<ReturnForm<STData[]>>|-
|[customCommitMethod]|自定义提交方法|(page: STData, baseService?: BaseService<STData, Page>) => Observable<ReturnForm<STData[]>>|-
|[beforeDataRender]|数据渲染前执行|(data: STData[]) => STData[]|-
|(customDetailClick)|点击新增或修改时的回调|{record:STData,detailPanelType:'add'或'modify'}|-
|[showToolbar]|是否显示工具栏|boolean|true
|[showType]|数据显示类型|table 或 list 或 custom|table
|[searchForm]|数据搜索form|Page|{}
|[commitWrapper]|表单提交前的表单数据封装|(value: STData) => STData|-
|[recordWrapper]|点击新增或修改时表单数据封装|(value: STData) => STData|-
|[customDetail]|自定义编辑弹窗框|TemplateRef<void>|-
|[showDetailButton]|是否显示编辑按钮（查看和编辑按钮的切换）|boolean|true
|[customContainer]|自定义显示容器|TemplateRef<any>|-
|[customListItem]|自定义列表项|TemplateRef<any>|-
###组件属性和方法
| 名称 | 说明 |
| --- | --- |
|[tableData]|获取表格数据|
|[tableDataObservable]|表格数据的观察对象|
|[record]|当前编辑的记录|
|[page]|当前页码|
|[total]|当前总记录数|
|[detailPanelType]|当前属性编辑窗口的类型（'add' 或 'modify'）|
|[sf]|获取动态表单组件|
|[st]|获取表格组件|
|[selectAll]|当前是否全选|
|[checkData]|当前选中的数据|
|updateColumn()|重置表格列|
|reload(emit=false)|刷新表格|
