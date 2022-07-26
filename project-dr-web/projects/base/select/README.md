# base-select

#### 描述
{**基础下拉列表使用说明**}

###BaseSelectComponent
###成员
| 成员 | 说明 | 类型 | 默认值
| --- | --- | --- | --- |
|[config]|类所需要的参数|? extends BaseSelectConfig|-
|[propertyValues]|属性值|ComboBox[]|[]
|[selectedValue]|选中的值|string[]|[]
|[_initSelectOnInit]|是否自动初始化|boolean|true
|[emptyText]|空选择时显示的文本|string|请选择...
###方法
| 名称 | 说明 |
| --- | --- |
|initSelect()|初始化下拉列表|
|filterValue(propertyValues: ComboBox[]): ComboBox[]|下拉列表数据过滤|
|getRealData(keyId: string): Observable<ReturnForm<any>>|根据列表项的标识获取完整的记录|
|reset(_value: any): void|数据回显|
###BaseSelect2Component
###成员
| 成员 | 说明 | 类型 | 默认值
| --- | --- | --- | --- |
|[multiple]|是否多选|boolean|false
|[valueType]|值的类型|string|string
|[emptyText]|空选择时显示的文本|string|请选择...
|[searchForm]|查询对象|? extends Page|{}
|[propertyValues]|属性值|ComboBox[]|[]
|[selectedValue]|选中的值|string[]|[]
###方法
| 名称 | 说明 |
| --- | --- |
|initSelect()|初始化下拉列表|
|filterValue(propertyValues: ComboBox[]): ComboBox[]|下拉列表数据过滤|
|registerOnChange(fn: any): void|注册监听值改变事件|
|setDisabledState(isDisabled: boolean)|设置disabled|
|writeValue(_value: any): void|设置值|
###BaseSelectAlain2Component
###成员
 成员 | 说明 | 类型 | 默认值
| --- | --- | --- | --- |
|[selectedValue]|选中的值|any|-
###方法
| 名称 | 说明 |
| --- | --- |
|getRealData(keyId: string): Observable<ReturnForm<any>>|根据列表项的标识获取完整的记录|
|reset(_value: any): void|数据回显|
###BaseSelectConfig
###成员
 成员 | 说明 | 类型 | 默认值
| --- | --- | --- | --- |
|[multiple]|是否多选|boolean|-
|[valueType]|值的类型|'array' 或 'string'|-
|[emptyText]|空白文本|string|-
|[searchForm]|查询对象|? extends Page|-
|[notifyProp]|通知属性|NotifyPropConfig[]|-
###NotifyPropConfig
###成员
 成员 | 说明 | 类型 | 默认值
| --- | --- | --- | --- |
|[notifyProp]|通知属性|string 或 [string]|-
|[listenProp]|需要监听的属性|string|-
|[notifyWidgetMethod]|通知方法|((value: any, formProperty: FormProperty, sfComp?: SFComponent) => {}) 或 string|-
###BaseSelectSchema
###成员
 成员 | 说明 | 类型 | 默认值
| --- | --- | --- | --- |
|[config]|配置|BaseSelectConfig<? extends Page>|-
