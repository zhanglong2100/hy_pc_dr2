import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {STChange, STColumn, STColumnButton, STComponent, STData, STPage} from '@delon/abc';
import {NzMessageService} from 'ng-zorro-antd';
import {map} from 'rxjs/operators';
import {BaseService, Page, ReturnForm, ReturnPage} from '@sb/base/core';
import {SFComponent, SFSchema} from '@delon/form';
import {BaseDetailComponent} from '@sb/base/detail';

@Component({
    selector: 'base-grid',
    templateUrl: './base-grid.component.html',
    styleUrls: ['./base-grid.component.less']
})
export class BaseGridComponent implements OnInit, AfterViewInit {

    @Input() baseParam: { [key: string]: any; };

    @Input() name = '';

    @Input() usePage = true;

    @Input() rowClassName;

    @Input() keyField: string;

    @Input() usePopup = true;

    @Input()
    scroll: { x?: string, y?: string };

    @Input() listUlHeight = 10;

    @Input()
    selectAllConfig: {
        obj: any,
        property: {
            [key: string]: string
        },
        ngModelChangeFn: (data: { selected: boolean, fieldName: string }) => void
    };

    @Input()
    typeIcon: { [key: string]: string } = {
        default: 'dr:hy-terminal'
    };

    @Input()
    clickRowWhileSetRowClass = false;

    @Input()
    typeFieldName;

    _nameField: string;

    @Input()
    set sortNameField(sortNameField: string) {
        this._nameField = sortNameField;
    }

    get sortNameField() {
        return this._nameField;
    }

    @Input()
    set nameField(sortNameField: string) {
        this._nameField = sortNameField;
    }

    get nameField() {
        return this._nameField;
    }

    @Input() customButtons: string | TemplateRef<void> | null;

    @Input() customContent: string | TemplateRef<void> | null;

    @Input() customColumnTemplate: string | TemplateRef<void> | null;

    @Input() customOperateButtons: STColumnButton[];

    @Input() schema: SFSchema;

    @Input() popupWidth;

    @Input() popupHeight;

    @Output() detailFormChange = new EventEmitter<STData>();

    @Output() dataReload = new EventEmitter<any>();

    @Output() itemClick = new EventEmitter<STData>();

    @Output() itemDbClick = new EventEmitter<STData>();

    @Output() itemSortClick = new EventEmitter<any>();

    // 显示新增按钮
    @Input() showAdd = true;

    @Input() addButtonText;

    // 显示删除按钮
    @Input() showDelete = true;
    @Input() deleteButtonText;

    // 显示修改按钮
    @Input() showModify = true;
    @Input() modifyButtonText;


    // 显示刷新按钮
    @Input() showRefresh = true;

    lastItem: any;
    // 显示排序按钮
    @Input() showSort = false;

    // 显示图层、列表切换按钮
    @Input() showTableListChange = false;

    _showSortPanel = false;

    // 显示修改按钮
    @Input() showOperateModify = true;

    // 修改按钮文本
    @Input() operateModifyButtonText;

    // 显示删除按钮
    @Input() showOperateDelete = true;

    // 删除按钮文本
    @Input() operateDeleteButtonText;

    // 块状展示时是否显示修改按钮
    @Input() showListModifyButton = true;

    // 块状展示时是否显示删除按钮
    @Input() showListDeleteButton = true;

    _columns: STColumn[];

    @Input()
    set columns(columns: STColumn[]) {
        this._columns = columns;
    }

    get columns() {
        return this._columns;
    }

    tableData: STData[] = [];

    sortData: STData[] = [];

    tableDataObservable: Observable<STData[]>;

    @Input()
    customLoadPageMethod: (page: Page, baseService?: BaseService<STData, Page>) => Observable<ReturnForm<ReturnPage<STData>>>;

    @Input()
    customLoadMethod: (page: Page, baseService?: BaseService<STData, Page>) => Observable<ReturnForm<STData[]>>;

    @Input()
    customCommitMethod: (page: STData, baseService?: BaseService<STData, Page>) => Observable<ReturnForm<any>>;

    @Input()
    customRemoveMethod: (data: STData[], baseService?: BaseService<STData, Page>) => Observable<ReturnForm<any>>;

    @Input() beforeDataRender: (data: STData[]) => STData[];

    @Input() beforeRemove: (data: STData[]) => Observable<boolean>;

    @Input() afterDetailInit: (sf: SFComponent) => void;

    _showDetailPanel = false;

    get page(): STPage {
        return {
            show: this.usePage
        };
    }

    total: number | undefined;

    @Output() customDetailClick = new EventEmitter();

    _record: STData;

    get record() {
        return this._record;
    }

    set record(_record: STData) {
        this._record = _record;
        this.customDetailClick.emit({
            record: _record,
            detailPanelType: this.detailPanelType
        });
    }

    _showType: 'table' | 'list' | 'custom' = 'table';

    get showType() {
        return this._showType;
    }

    @Input()
    showToolbar = true;

    @Input()
    showScroll = true;

    @Input()
    set showType(_showType) {
        this._showType = _showType;
        this.updateColumn();
        if (this.showScroll && _showType) {
            this.updateScroll();
        }
        this.checkData = [];
    }

    detailPanelType: 'add' | 'modify' = 'add';


    _searchForm: Page = {} as Page;
    @Input()
    set searchForm(searchForm: Page) {
        if (searchForm) {
            this._searchForm = searchForm;
        }
    }

    get searchForm() {
        return this._searchForm;
    }

    loadTipText = '';

    /**
     * todo 此处要修改, 不允许传递此方法. 后期修改
     */
    @Input() commitWrapper: (value: STData) => STData;

    /**
     * todo 此处要修改, 不允许传递此方法. 后期修改
     */
    @Input() recordWrapper: (value: STData) => STData | Observable<STData>;

    /**
     * 自定认弹出框
     */
    @Input() customDetail: TemplateRef<void>;

    private _showDetailButton = true;
    @Input()
    set showDetailButton(_showDetailButton) {
        this._showDetailButton = _showDetailButton;
    }

    get showDetailButton() {
        return this._showDetailButton;
    }

    @ViewChild(STComponent, {static: false})
    st: STComponent;

    @ViewChild(BaseDetailComponent, {static: false})
    baseDetail: BaseDetailComponent;

    get sf(): SFComponent {
        return this.baseDetail.sf;
    }

    _selectAll;

    get selectAll() {
        return this._selectAll;
    }

    set selectAll(a) {
        this._selectAll = a;

        let temp = [];
        this.tableData.forEach(value => {
            if (!value.disabled) {
                value.checked = a;
                temp.push(value);
            }
        });

        if (a) {
            this.checkData = temp.slice(0, temp.length);
        } else {
            this.checkData = [];
        }
    }

    @Input()
    customContainer: TemplateRef<any>;

    @Input()
    customListItem: TemplateRef<any>;

    checkData: STData[] = [];

    constructor(
        public message: NzMessageService,
        private baseService: BaseService<STData, Page>,
        private el: ElementRef
    ) {
    }

    addClick(): void {
        this.detailPanelType = 'add';
        this.record = Object.assign({}, this.baseParam);
        this._showDetailPanel = true;
    }

    updateColumn() {
        if (this.showType === 'table' && (this.showOperateDelete || this.showOperateModify || this.customOperateButtons)) {
            let column: STColumn = null;
            for (const one of this._columns) {
                if (one.title === '操作区') {
                    one.buttons = [];
                    column = one;
                }
            }
            if (!column) {
                column = {
                    title: '操作区',
                    className: 'text-center',
                    buttons: []
                } as STColumn;
                this._columns.push(column);
            }

            if (this.showOperateModify) {
                column.buttons.push({
                    text: this.operateModifyButtonText || (this.showDetailButton ? '修改' : '查看'),
                    icon: this.showDetailButton ? 'edit' : 'snippets',
                    iif: item => !item.disabled,
                    type: 'none',
                    click: (record, modal, comp) => {
                        this.modifyClick(record);
                    }
                });
            }

            if (this.showOperateDelete) {
                column.buttons.push({
                    text: this.operateDeleteButtonText || '删除',
                    type: 'del',
                    icon: 'delete',
                    popTitle: '确认删除吗？',
                    click: (record, modal, comp) => {
                        this.deleteRecord([record]);
                    }
                });
            }

            if (this.customOperateButtons && this.customOperateButtons.length > 0) {
                column.buttons.push(...this.customOperateButtons);
            }
        }
    }

    ngOnInit() {

        this.updateColumn();

    }

    ngAfterViewInit(): void {
        this.tableDataObservable = new Observable<STData[]>((subscriber): void => {
            this._searchForm = Object.assign(this._searchForm, this.baseParam);
            if (this.usePage && this.st) {
                this.searchForm.page = this.st.pi;
                this.searchForm.rows = this.st.ps;
                let temp;
                if (this.customLoadPageMethod) {
                    temp = this.customLoadPageMethod(this.searchForm, this.baseService);
                } else {
                    temp = this.baseService.listWithPage(this.searchForm);
                }
                temp.pipe(
                    map((returnForm: ReturnForm<ReturnPage<STData>>) => {
                        // 成功的情况
                        if (returnForm && returnForm.success) {
                            const returnPage: ReturnPage<STData> = returnForm.message;
                            this.total = returnPage.total;
                            this.tableData = returnPage.rows;
                            if (this.loadTipText) {
                                this.message.info(this.loadTipText + '成功！');
                                this.loadTipText = '';
                            }
                            return returnPage.rows;
                        } else {
                            let message = returnForm && returnForm.errorMessage || '';
                            if (this.loadTipText) {
                                message = this.loadTipText + '失败！';
                                this.loadTipText = '';
                            }
                            this.message.info("出现错误：" + message);
                            this.tableData = [];
                            return [];
                        }
                    })
                ).subscribe(value => {
                    if (this.beforeDataRender) {
                        value = this.beforeDataRender(value);
                    }
                    if (value instanceof Observable) {
                        value.subscribe(vv => {
                            subscriber.next(vv);
                            subscriber.complete();
                        });
                    } else {
                        subscriber.next(value);
                        subscriber.complete();
                    }
                });
            } else {
                let temp;
                if (this.customLoadMethod) {
                    temp = this.customLoadMethod(this.searchForm, this.baseService);
                } else {
                    temp = this.baseService.list(this.searchForm);
                }

                temp.pipe(
                    map((returnForm: ReturnForm<STData[]>) => {
                        // 成功的情况
                        if (returnForm.success) {
                            this.tableData = returnForm.message;
                            if (this.loadTipText) {
                                this.message.info(this.loadTipText + '成功！');
                                this.loadTipText = '';
                            }
                            return returnForm.message;
                        } else {
                            let message = returnForm && returnForm.errorMessage || '';
                            if (this.loadTipText) {
                                message = this.loadTipText + '失败！';
                                this.loadTipText = '';
                            }
                            this.message.info("出现错误：" + message);
                            this.tableData = [];
                            return [];
                        }
                    })
                ).subscribe(value => {
                    if (this.beforeDataRender) {
                        value = this.beforeDataRender(value);
                    }
                    if (value instanceof Observable) {
                        value.subscribe(vv => {
                            subscriber.next(vv);
                            subscriber.complete();
                        });
                    } else {
                        subscriber.next(value);
                        subscriber.complete();
                    }
                });
            }
        });

        if (this.showType === 'list') {
            this.reload();
        }

        if (this.showScroll) {
            setTimeout(() => {
                this.updateScroll();
            }, 200);
        }
    }


    deleteClick(): void {
        const ids = [];
        for (const p in this.checkData) {
            ids.push(this.checkData[p]);
        }
        this.deleteRecord(ids);
    }

    temp: Subscription;

    reload(emit = false) {
        this.selectAll = false;
        if (this.st) {
            // this.st.reload();//注释原因：与当前下句代码会重复执行刷新
            this.st.load(1); // 添加于2020年7月17 添加人：zk 作用：在调用basegrid的st表单执行reload方法时让其刷新后跳转到第一页
        } else {
            if (this.temp) {
                this.temp.unsubscribe();
            }
            this.temp = this.tableDataObservable.subscribe(result => {
            })
        }
        this._showDetailPanel = false;

        if (emit) {
            this.dataReload.emit();
        }
    }


    change(e: STChange) {
        if (e.type === 'checkbox') {
            this.checkData = e.checkbox as STData[];
        } else if (e.type === 'click') {
            const s = e.click;
            if (this.clickRowWhileSetRowClass) {
                if (this.lastItem) {
                    this.lastItem['_rowClassName'] = this.lastItem['_rowClassName'].replace(" tr-select", "");
                }
                s.item['_rowClassName'] = s.item['_rowClassName'] + " tr-select";
                this.lastItem = s.item;
            }
            this.clickItem(s.e, s.item);
        } else if (e.type === 'sort') {
            this.itemSortClick.emit(e);
        }
    }

    checkItem(event: Event, one: STData) {
        if (!one.disabled) {
            one.checked = !one.checked;
            const checkData: STData[] = [];
            for (const o of this.tableData) {
                if (o.checked) {
                    checkData.push(o);
                }
            }

            this.checkData = checkData;
        }
        event.stopPropagation();
    }

    clickItem(event: Event, item: STData) {
        this.itemClick.emit(item);
        event.stopPropagation();
    }

    dbClickItem(event: Event, item: STData) {
        this.itemDbClick.emit(item);
        event.stopPropagation();
    }

    deleteRecord(datas: STData[]): void {
        if (this.beforeRemove) {
            this.beforeRemove(datas).subscribe(
                del => {
                    if (del) {
                        this.doDeleteRecord(datas);
                    }
                }
            );
        } else {
            this.doDeleteRecord(datas);
        }
    }

    doDeleteRecord(datas: STData[]) {
        let o;
        if (this.customRemoveMethod) {
            o = this.customRemoveMethod(datas, this.baseService);
        } else {
            o = this.baseService.remove(datas.map(v => v[this.keyField]));
        }
        o.subscribe(returnForm => {
            if (returnForm.success) {
                this.reload(true);
                this.message.info('删除成功！');
            } else {
                this.message.error(returnForm.errorMessage);
            }
        });
    }

    modifyClick(record: STData, event?: Event) {
        this.detailPanelType = 'modify';
        this.record = record;
        this._showDetailPanel = true;
        event && event.stopPropagation();
    }

    sortClick() {
        this.sortData = [];
        for (const item of this.tableData) {
            if (!item.unSortable) {
                this.sortData.push(item);
            }
        }
        if (this.sortData.length === 0) {
            this.message.warning('没有可排序的记录！');
            return;
        }
        this._showSortPanel = true;
    }

    sortChange(newTableData: STData[]) {
        const keyIds = [];
        for (const row of newTableData) {
            keyIds.push(row[this.keyField]);
        }
        this.baseService.updateOrder(keyIds, this.baseParam).subscribe(
            (returnForm: ReturnForm<string>) => {
                if (returnForm.success) {
                    this._showSortPanel = false;
                    this.reload(true);
                    this.message.info('排序更新成功！');
                } else {
                    this.message.error(returnForm.errorMessage);
                }
            }
        );
    }

    detailClose(empt) {
        this._showDetailPanel = false;
        if (empt) {
            this.reload(true);
        }
    }

    formChange(value: STData) {
        this.detailFormChange.emit(value);
    }

    // @HostListener('window:resize', [])
    updateScroll() {
        let abcHeight = 0;
        let abc = this.el.nativeElement.querySelector('.abc');
        if (abc) {
            abcHeight = abc.offsetHeight;
            let marginTop = abc.style['margin-top'];
            if (marginTop) {
                abcHeight += parseInt(marginTop);
            }
            let marginBottom = abc.style['margin-bottom'];
            if (marginBottom) {
                abcHeight += parseInt(marginBottom);
            }
        }
        let customContentHeight = 0;
        let customContent = this.el.nativeElement.querySelector('.customContent');
        if (customContent) {
            customContentHeight = customContent.offsetHeight;
            let marginTop = customContent.style['margin-top'];
            if (marginTop) {
                customContentHeight += parseInt(marginTop);
            }
            let marginBottom = customContent.style['margin-bottom'];
            if (marginBottom) {
                customContentHeight += parseInt(marginBottom);
            }
        }
        let containerHeight = this.el.nativeElement.querySelector('.base-grid-container').offsetHeight;
        if (containerHeight < 100) {
            return;
        }
        if (this.showType === 'table') {
            let y = containerHeight - abcHeight - customContentHeight - 47;
            if (this.usePage) {
                y = y - 57;
            }
        } else if (this.showType === 'list') {
            let listCheckboxHeight = 0;
            let listCheckbox = this.el.nativeElement.querySelector('.list-checkbox');
            if (listCheckbox) {
                listCheckboxHeight = listCheckbox.offsetHeight;
                let marginTop = listCheckbox.style['margin-top'];
                if (marginTop) {
                    listCheckboxHeight += parseInt(marginTop);
                }
                let marginBottom = listCheckbox.style['margin-bottom'];
                if (marginBottom) {
                    listCheckboxHeight += parseInt(marginBottom);
                }
            }
            this.listUlHeight = containerHeight - abcHeight - customContentHeight - listCheckboxHeight - 10;
        }
    }
}
