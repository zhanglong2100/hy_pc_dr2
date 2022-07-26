import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BaseTreeService} from "@sb/base/core/service/base-tree.service";
import {BaseNzTreeNodeOptions, BaseService, BaseTreeComponent} from "@sb/base";
import {NzMessageService} from "ng-zorro-antd";
import {RmRoleFunctionTreeService} from "../service/rm-role-function-tree.service";
import {RmRoleFunctionService} from "../service/rm-role-function.service";
import {RmRoleFunctionSearchForm} from "../entity/rm-role-function-search-form";
import {RmRoleFunctionTreeNode} from "../entity/rm-role-function-tree-node";

@Component({
    selector: 'rm-role-function-tree',
    templateUrl: './rm-role-function-tree.component.html',
    styleUrls: ['./rm-role-function-tree.component.less'],
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
export class RmRoleFunctionTreeComponent implements OnInit {

    typeIcon = {
        SERVER: 'dr:hy-server',
        FUNCTION: 'dr:hy-func',
        MODULE: 'dr:hy-module'
    };

    searchForm: RmRoleFunctionSearchForm = {
        roleId: ''
    };
    selectRoldId: string = "";

    activeNode: BaseNzTreeNodeOptions<RmRoleFunctionTreeNode>;

    @ViewChild(BaseTreeComponent, {static: true})
    baseTree: BaseTreeComponent;


    @Input()
    checkable = false;
    @Input()
    checkedWhileClick = true;
    @Input()
    checkedKeys = ["95b0d3f8abdd45b3b4c8ab149d86cf7c"];


    constructor(
        private message: NzMessageService,
        private roleFunctionService: RmRoleFunctionService) {
    }

    @Input()
    set roleId(roleId: string) {
        this.selectRoldId = roleId;
        if (this.selectRoldId) {
            this.baseTree.reload();
            this.baseTree.setDefaultChecked(this.checkedKeys);
        }
    }

    ngOnInit(): void {
    }

    selectNode(node: BaseNzTreeNodeOptions<RmRoleFunctionTreeNode>): void {
        this.activeNode = node;
    }

    expandChange(node: BaseNzTreeNodeOptions<RmRoleFunctionTreeNode>): void {
        this.activeNode = node;
        this.baseTree.nzTree.nzExpandAll = false;
    }

    customLoadMethod(parentId, seach: RmRoleFunctionSearchForm, maxLevel, roleFunctionTreeService: RmRoleFunctionTreeService) {
        return roleFunctionTreeService.getRoleFuncNzTree(this.selectRoldId);
    }


}
