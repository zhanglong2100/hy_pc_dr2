# base-detail

#### 描述
{**基础细项编辑模块使用说明**}

### BaseDetailComponent
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | ---
|[commitWrapper]|表单提交前的表单数据封装|(value: STData) => STData|-
|[recordWrapper]|点击新增或修改时表单数据封装|(value: STData) => STData|-
|[schema]|制定表单|SFSchema|-
|[baseParam]|表单提交的默认值|{ [key: string]: string }|-
|[name]|编辑窗口的名称|string|-
|[usePopup]|编辑窗口是否使用弹窗|boolean|true
|[customCommitMethod]|自定义提交方法|(page: STData, baseService?: BaseService<STData, Page>) => Observable<ReturnForm<STData[]>>|-
|[showButton]|是否显示提交按钮|boolean|true
|(formChangeEvent)|表单数据变更时回调|STData|-
|[detailPanelType]|编辑窗口的类型|'add' 或 'modify'|add
|[record]|编辑的数据|STData|-
|[width]|弹窗宽度|string 或 number|-
|[height]|弹窗高度|string 或 number|-
|(eventClose)|点击关闭弹窗时的回调|void|-
###组件属性和方法
| 名称 | 说明 |
| --- | --- |
|[detailButton]|按钮|
|[detailPanelTitle]|获取窗口的名称|
|submit(value: STData)|提交表单|
