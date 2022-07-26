import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ReturnForm, ReturnPage} from '@sb/base';
import {
    NzFormatEmitEvent,
    NzMessageService,
    NzModalService,
    NzTreeComponent,
    NzTreeNode,
    NzTreeNodeOptions
} from 'ng-zorro-antd';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {OuUserService} from '../ou-user.service';
import {OuUserTreeNode} from '../entity/ou-user-tree-node';
import {OuUser} from '../entity/ou-user';

@Component({
    selector: 'ou-user-select-panel',
    templateUrl: './ou-user-select-panel.component.html',
    styleUrls: ['./ou-user-select-panel.component.less']
})
export class OuUserSelectPanelComponent implements OnInit {

    searchValue = '';

    nzExpandedKeys = [];

    nodes = [
        {
            key: '-1',
            title: '用户列表',
            loadedChildren: true,
            expanded: true,
            selected: true,
            isLeaf: false,
            type: 'root',
            data: {}
        } as OuUserTreeNode
    ];

    @ViewChild(NzTreeComponent, {static: true})
    nzTree: NzTreeComponent;

    activedNode: NzTreeNode;

    @Output() clickNode = new EventEmitter<OuUserTreeNode>();

    activeNode(data: NzFormatEmitEvent): void {
        this.activedNode = data.node;
        // 选中节点
        this.clickNode.emit(data.node.origin as OuUserTreeNode);
    }

    openEvent(event: NzFormatEmitEvent): void {
        if (event.eventName === 'expand') {
            const node = event.node;
            if (node && node.getChildren().length === 0 && node.isExpanded) {
                this.loadNode(node.key).subscribe(data => {
                    node.addChildren(data);
                    node.isLeaf = data.length === 0;
                });
            }
        }
    }

    loadNode(parentId: string): Observable<NzTreeNodeOptions[]> {
        return this.ouUserService
            .listWithPage({})
            .pipe(
                map((returnForm: ReturnForm<ReturnPage<OuUser>>) => {
                    if (returnForm.success) {
                        let arr = [];
                        for (let one of returnForm.message.rows) {
                            one as NzTreeNodeOptions;
                            one.title = one.userName;
                            one.key = one.userId;
                            one.selected = false;
                            one.selectable = true;
                            one.children = [];
                            one.isLeaf = true;
                            one.checked = false;
                            arr.push(one);
                        }
                        return arr;
                    } else {
                        return [];
                    }
                })
            );
    }

    constructor(
        private ouUserService: OuUserService,
        private nzMessageService: NzMessageService,
        private modalService: NzModalService,
    ) {
    }

    ngAfterViewInit(): void {
        const node = this.nzTree.getTreeNodeByKey('-1');
        node.isExpanded = true;
        this.loadNode(node.key).subscribe(data => {
            node.addChildren(data);
            node.isLeaf = data.length === 0;
        });
    }


    searchTree(value) {
        const rootNode = this.nzTree.getTreeNodeByKey('-1');
        rootNode.clearChildren();
        if (value === '') {
            rootNode.isExpanded = false;
        } else {
            this.ouUserService.listWithPage({
                loginName: value
            }).subscribe(
                (returnForm: ReturnForm<ReturnPage<OuUser>>) => {
                    if (returnForm.success) {
                        rootNode.isExpanded = true;


                        let arr = [];
                        for (let one of returnForm.message.rows) {
                            one as NzTreeNodeOptions;
                            one.title = one.userName;
                            one.key = one.userId;
                            one.selected = false;
                            one.selectable = true;
                            one.children = [];
                            one.isLeaf = true;
                            one.checked = false;
                            arr.push(one);
                        }
                        rootNode.addChildren(arr);
                    }
                }
            );
        }
    }

    // refreshNode(parentId: string) {
    //     this.terminalDirService.getNzTree(parentId, 2).subscribe(
    //         (returnForm: ReturnForm<NzTreeNodeOptions[]>) => {
    //             if (returnForm.success) {
    //                 const pn = this.nzTree.getTreeNodeByKey(parentId);
    //                 pn.isLeaf = false;
    //                 pn.clearChildren();
    //                 pn.addChildren(returnForm.message);
    //                 pn.isExpanded = true;
    //             }
    //         }
    //     );
    // }

    ngOnInit(): void {
    }
}
