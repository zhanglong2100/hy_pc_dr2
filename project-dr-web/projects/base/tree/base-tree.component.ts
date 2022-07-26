import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {
    NzFormatBeforeDropEvent,
    NzFormatEmitEvent,
    NzMessageService,
    NzModalService,
    NzTreeComponent
} from 'ng-zorro-antd';
import {BaseNzTreeNodeOptions, Page, ReturnForm} from '@sb/base/core';
import {STData} from '@delon/abc';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';
import {BaseTreeSearchConfig} from '@sb/base/core/entity/base-tree-search-config';
import {NzTreeNode} from "ng-zorro-antd/core/tree/nz-tree-base-node";

@Component({
    selector: 'base-tree',
    templateUrl: './base-tree.component.html',
    styleUrls: ['./base-tree.component.less']
})
export class BaseTreeComponent implements OnInit, AfterViewInit {


    @ViewChild("nzTree", {static: true})
    nzTree: NzTreeComponent;

    activatedNode: BaseNzTreeNodeOptions<STData>;

    treeContainerHeight: string;

    @Input() showRoot = false;

    @Input()
    treeData: BaseNzTreeNodeOptions<STData>[] = [
        {
            key: '-1',
            title: '根节点',
            loadedChildren: false,
            expanded: true,
            selected: true,
            isLeaf: false,
            type: 'root',
            data: {}
        }
    ];

    searchValue: string;
    checkedKeys: string[] = [];

    searchContainer: boolean = false;

    listData;

    @Input()
    draggable = false;

    @Input()
    showTypeIcon = false;

    @Input()
    customLoadMethod: (parentId: string, searchConfig: any, maxLevel: number, baseTreeService: BaseTreeService<STData, Page, BaseNzTreeNodeOptions<STData>>) => Observable<ReturnForm<BaseNzTreeNodeOptions<any>[]>>;

    @Input()
    customDragMethod: (drag: NzTreeNode, target: NzTreeNode, position: number, baseTreeService: BaseTreeService<STData, Page, BaseNzTreeNodeOptions<STData>>) => Observable<ReturnForm<string>>;

    @Input()
    checkable = false;

    @Input()
    checkedWhileClick = false;  //点击节点时选择复选框


    @Input()
    typeIcon: { [key: string]: string } = {
        "root": "dr:hy-root"
    };

    @Input()
    maxLevel = 1;

    private _searchConfig: BaseTreeSearchConfig;

    get searchConfig(): BaseTreeSearchConfig {
        return this._searchConfig;
    }

    @Input()
    set searchConfig(value: BaseTreeSearchConfig) {
        this._searchConfig = value;
    }

    @Input()
    showSearch = false;

    @Input()
    set globalName(globalName: string) {
        let rootNode = this.nzTree.getTreeNodeByKey("-1");
        if (rootNode != null) {
            rootNode.title = globalName;
        } else {
            this.treeData[0].title = globalName;
        }
    }

    @Input()
    beforeDrop: (dragNode: BaseNzTreeNodeOptions<STData>, targetNode: BaseNzTreeNodeOptions<STData>) => boolean;

    @Input()
    treeNodeTemplate: TemplateRef<{ $implicit: BaseNzTreeNodeOptions<STData>; }>;

    @Output()
    selectNode = new EventEmitter<BaseNzTreeNodeOptions<STData>>();

    @Output()
    expandChange = new EventEmitter<BaseNzTreeNodeOptions<STData>>();

    @Input()
    customListItem: TemplateRef<any>;

    clickNode(data: NzFormatEmitEvent): void {
        if (!data.node.isDisabled) {
            this.activatedNode = data.node;
            // 选中节点
            /* if(this.checkable &&this.checkedWhileClick){
                 data.node.isChecked = !data.node.isChecked;
             }*/
            this.selectNode.emit(data.node.origin as BaseNzTreeNodeOptions<STData>);
        }
    }

    constructor(
        public message: NzMessageService,
        private modalService: NzModalService,
        private baseTreeService: BaseTreeService<STData, Page, BaseNzTreeNodeOptions<STData>>
    ) {
    }


    ngOnInit() {
    }


    ngAfterViewInit(): void {
        let node = this.nzTree.getTreeNodeByKey('-1');
        this.reloadNode("-1", !this.showRoot).subscribe(
            res => {
                if (res && res.success) {
                    if (!this.showRoot) {
                        let message = res.message;
                        node = this.nzTree.getTreeNodeByKey(message[0].key);
                    }
                    this.defaultSelect(node);
                }
            }
        );

        if (this.showSearch) {
            this.treeContainerHeight = 'calc(100% - 42px)';
        } else {
            this.treeContainerHeight = '100%';
        }
    }

    nzOnDrop(event: NzFormatEmitEvent): void {
    }

    nzOnDragOver(event: NzFormatEmitEvent): void {
    }

    nzBeforeDrop(arg: NzFormatBeforeDropEvent): Observable<boolean> {
        const dragNode = arg.dragNode;
        let targetNode = arg.node;
        let pos = arg.pos;

        let result = false;
        if (this.beforeDrop) {
            result = this.beforeDrop(dragNode, targetNode);
        }

        if (!result) {
            this.message.info("不允许移动！");
            return of(false);
        }

        if (pos === -1 || pos === 1) {
            let tempNode = targetNode;
            targetNode = targetNode.parentNode;
            let tempPos: number = 0;
            for (let i = 0; i < targetNode.children.length; i++) {
                if (targetNode.children[i] === tempNode) {
                    tempPos = i;
                    break;
                }
            }
            pos = tempPos + pos;
        }

        const subject = new BehaviorSubject(false);

        this.modalService.create({
            nzTitle: '系统提示',
            nzContent: '是否进行移动？',
            nzClosable: false,
            nzOnOk: () => {
                subject.next(true);
                subject.complete();


                if (this.customDragMethod) {
                    return this.customDragMethod(dragNode, targetNode, pos, this.baseTreeService)
                        .pipe(map((returnForm) => {
                            return returnForm.success;
                        }))
                        .toPromise();
                } else {
                    return this.baseTreeService.drag(dragNode.key, targetNode.key, pos)
                        .pipe(map((returnForm) => {
                            return returnForm.success;
                        }))
                        .toPromise();
                }

            }
        });

        return subject;
    }

    openEvent(event: NzFormatEmitEvent): void {
        if (event.eventName === 'expand') {
            const node = event.node;
            if (node && node.getChildren().length === 0 && node.isExpanded) {
                this.reloadNode(node.key);
            }
            this.expandChange.emit(node.origin as BaseNzTreeNodeOptions<STData>);
        }
    }

    searchByText(value: string) {
        if (value) {
            this.baseTreeService.searchByText(value).subscribe(res => {
                if (res.success) {
                    this.listData = res.message
                    this.searchContainer = true;
                } else {
                    this.message.error("获取节点数据异常：" + res.errorMessage);
                }
            })
        } else {
            this.searchContainer = false
        }
    }

    itemClick(item) {
        this.baseTreeService.get(item.key).subscribe(res => {
            if (res.success) {
                let message = res.message
                let parentPath: string[] = [];
                if (message['parentPath'] != null) {
                    parentPath = message['parentPath'].split(".");
                }
                this.reloadNodeByPath(parentPath, item.key)
            }
        })
    }

    reloadNodeByPath(parentPath: string[], selfKey: string) {
        if (parentPath != null && parentPath.length != 0) {
            const path = parentPath.shift();
            const node = this.nzTree.getTreeNodeByKey(path)
            if (node != null) {
                if (node.getChildren().length == 0) {
                    node.isLeaf = false;
                    node.isExpanded = true;
                    let temp;
                    if (this.customLoadMethod) {
                        temp = this.customLoadMethod(node.key, this._searchConfig, this.maxLevel, this.baseTreeService);
                    } else {
                        temp = this.baseTreeService.getNzTree(node.key, this._searchConfig, this.maxLevel);
                    }
                    temp.subscribe(returnForm => {
                        if (returnForm.success) {
                            const treeData = returnForm.message.sort((a) => {
                                if (a.type === 'module') {
                                    return -1
                                }
                            });
                            node.addChildren(treeData);
                            node.isExpanded = true;
                            node.isLeaf = returnForm.message.length === 0;
                            this.reloadNodeByPath(parentPath, selfKey)
                        } else {
                            this.message.error("加载节点数据异常：" + returnForm.errorMessage);
                        }
                    });
                } else {
                    node.isExpanded = true;
                    this.reloadNodeByPath(parentPath, selfKey)
                }
            } else {
                this.message.error("节点加载异常 , 异常节点Id为 " + path)
            }
        } else {
            const acNode = this.nzTree.getTreeNodeByKey(selfKey)
            if (!acNode.isDisabled) {
                this.activatedNode = acNode;
                this.selectNode.emit(acNode.origin as BaseNzTreeNodeOptions<STData>);
            }
            this.searchContainer = false;
        }
    }


    reload(): Observable<any> {
        return this.reloadNode("-1", !this.showRoot);
    }

    reloadNode(nodeId, cover = false): Observable<any> {
        const node = this.nzTree.getTreeNodeByKey(nodeId);
        node.isLeaf = false;
        node.isExpanded = true;
        const subject = new BehaviorSubject(null);
        let temp;
        if (this.customLoadMethod) {
            temp = this.customLoadMethod(nodeId, this._searchConfig, this.maxLevel, this.baseTreeService);
        } else {
            temp = this.baseTreeService.getNzTree(nodeId, this._searchConfig, this.maxLevel);
        }
        temp.subscribe(returnForm => {
            if (returnForm.success) {
                if (cover) {
                    this.treeData = returnForm.message;
                    this.nzTree.initNzData(this.treeData);
                } else {
                    node.clearChildren();
                    node.addChildren(returnForm.message);
                    node.isLeaf = returnForm.message.length === 0;
                }
            } else {
                this.message.error("加载节点数据异常：" + returnForm.errorMessage);
            }
            subject.next(returnForm);
            subject.complete();
        });
        return subject;
    }

    setDefaultChecked(keys: string[]) {
        this.checkedKeys = keys;
    }

    getTreeNodeTypeIcon(treeNode: BaseNzTreeNodeOptions<STData>) {
        return this.typeIcon[treeNode.type] || 'file';
    }

    defaultSelect(treeNode: NzTreeNode) {
        if (!treeNode.isDisabled) {
            treeNode.isSelected = true;
            treeNode.isExpanded = true;
            this.activatedNode = treeNode;
            this.selectNode.emit(treeNode.origin as BaseNzTreeNodeOptions<STData>);
            return true;
        }
        let children = treeNode.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (this.defaultSelect(child)) {
                break;
            }
        }
    }

}
