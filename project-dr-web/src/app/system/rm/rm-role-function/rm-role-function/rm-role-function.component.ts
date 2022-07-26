import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {BaseNzTreeNodeOptions, BaseService} from '@sb/base';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';
import {RmRoleFunctionTreeService} from "../service/rm-role-function-tree.service";
import {RmRoleFunctionService} from "../service/rm-role-function.service";
import {RmRoleFunctionSearchForm} from "../entity/rm-role-function-search-form";
import {RmRoleFunctionTreeNode} from "../entity/rm-role-function-tree-node";
import {RmFunctionTreeComponent} from "../../rm-function/rm-function-tree/rm-function-tree.component";
import {RmRoleFunctionTreeComponent} from "../rm-role-function-tree/rm-role-function-tree.component";
import {RmRoleService} from "../../rm-role/service/rm-role.service";
import {RmRole} from "../../rm-role/entity/rm-role";
import {STData} from "@delon/abc";

@Component({
    selector: 'rm-role-function',
    templateUrl: './rm-role-function.component.html',
    styleUrls: ['./rm-role-function.component.less'],
    providers: [
        {
            provide: BaseTreeService,
            useClass: RmRoleFunctionTreeService
        },
        {
            provide: BaseService,
            useClass: RmRoleFunctionService
        }
    ]
})
export class RmRoleFunctionComponent implements OnInit {

    _showDetailPanel = false;
    roles: RmRole[];
    checkFuncIds: string[] = [];
    checkKeys: string[] = [];

    typeIcon = {
        SERVER: 'dr:hy-server',
        FUNCTION: 'dr:hy-func',
        MODULE: 'dr:hy-module'
    };

    searchForm: RmRoleFunctionSearchForm = {
        roleId: ''
    };

    activeNode: BaseNzTreeNodeOptions<RmRoleFunctionTreeNode>;

    selectRoleId: string = "";

    @Input()
    set roleId(roleId: string) {
        this.selectRoleId = roleId;
        this.getCheckKeys();
    }

    @ViewChild(RmRoleFunctionTreeComponent, {static: true})
    roleFunctionTree: RmRoleFunctionTreeComponent;
    @ViewChild(RmFunctionTreeComponent, {static: false})
    rmFunctionTree: RmFunctionTreeComponent;


    constructor(
        private message: NzMessageService,
        private rmRoleService: RmRoleService,
        private roleFunctionService: RmRoleFunctionService
    ) {
    }

    ngAfterViewInit(): void {
        this.rmRoleService.list(null).subscribe(returnForm => {
            if (returnForm.success) {
                this.roles = returnForm.message['rows'];
                this.selectRoleId = this.roles[0].roleId;
                this.getCheckKeys();
            } else {
                this.message.error("获取角色失败：" + returnForm.errorMessage);
            }
        });
    }

    ngOnInit(): void {
    }

    selectNode(node: BaseNzTreeNodeOptions<RmRoleFunctionTreeNode>): void {
        this.activeNode = node;
    }

    collapsed(): void {
        this.roleFunctionTree.baseTree.nzTree.getTreeNodeByKey("-1").isExpanded = false;
        this.roleFunctionTree.baseTree.nzTree.nzExpandAll = false;
    }

    expanded(): void {
        this.roleFunctionTree.baseTree.nzTree.nzExpandAll = true;
    }

    refresh(): void {
        this.roleFunctionTree.baseTree.reload();
    }

    commitFunc(): void {
        this._showDetailPanel = true;
        setTimeout(() => {
            this.rmFunctionTree.baseTree.checkedKeys = this.checkKeys;
        }, 200);
    }

    closeClick() {
        this._showDetailPanel = !this._showDetailPanel;
    }

    submit() {
        this.checkFuncIds = [];
        let checkedNodeList = this.rmFunctionTree.baseTree.nzTree.getCheckedNodeList();
        this.getCheckedFuncId(checkedNodeList);
        if (!this.selectRoleId) {
            this.message.error("请选择角色");
            return;
        }
        this.roleFunctionService.updateRoleFunc(this.selectRoleId, this.checkFuncIds).subscribe(returnForm => {
            if (returnForm.success) {
                this._showDetailPanel = false;
                this.roleFunctionTree.baseTree.reload();
                this.message.success('保存成功！');
                this.checkKeys = this.checkFuncIds;
            } else {
                this.message.error("获取角色失败：" + returnForm.errorMessage);
            }
        });
    }

    getCheckedFuncId(Data) {
        if (!Data || !Data.length) return;
        for (let i = 0; i < Data.length; i++) {
            if (Data[i].origin.checked && Data[i].origin.type == "FUNCTION") this.checkFuncIds.push(Data[i].key);
            let childs = Data[i].children;
            if (childs && childs.length > 0) {
                this.getCheckedFuncId(childs);
            }
        }
    }

    clickItem(event: Event, item: STData) {
        this.selectRoleId = item.roleId;
        this.checkKeys = [];
        this.getCheckKeys();
        event.stopPropagation();
    }

    getCheckKeys() {
        this.checkKeys = [];
        this.roleFunctionService.list(Object.assign({}, this.searchForm, {roleId: this.selectRoleId})).subscribe(returnForm => {
            if (returnForm.success) {
                let roleFunction = returnForm.message;
                for (let i = 0; i < roleFunction.length; i++) {
                    this.checkKeys.push(roleFunction[i].funcId);
                }
            } else {
                this.message.error("获取角色功能失败：" + returnForm.errorMessage);
            }
        });
    }
}
