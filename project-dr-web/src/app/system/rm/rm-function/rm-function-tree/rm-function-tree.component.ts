import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BaseTreeService} from "@sb/base/core/service/base-tree.service";
import {RmFunctionTreeService} from "../service/rm-function-tree.service";
import {BaseNzTreeNodeOptions, BaseTreeComponent} from "@sb/base";
import {RmFunctionSearchForm} from "../entity/rm-function-search-form";
import {RmFunctionTreeNode} from "../entity/rm-function-tree-node";
import {NzMessageService} from "ng-zorro-antd";

@Component({
    selector: 'rm-function-tree',
    templateUrl: './rm-function-tree.component.html',
    styleUrls: ['./rm-function-tree.component.less'],
    providers: [
        {
            provide: BaseTreeService,
            useClass: RmFunctionTreeService
        }
    ]
})
export class RmFunctionTreeComponent implements OnInit {

    typeIcon = {
        SERVER: 'dr:hy-server',
        FUNCTION: 'dr:hy-func',
        MODULE: 'dr:hy-module'
    };

    searchForm: RmFunctionSearchForm = {
        parentId: ''
    };

    activeNode: BaseNzTreeNodeOptions<RmFunctionTreeNode>;

    @ViewChild(BaseTreeComponent, {static: true})
    baseTree: BaseTreeComponent;

    @Input()
    checkable = true;
    @Input()
    checkedWhileClick = true;


    constructor(
        private message: NzMessageService) {
    }

    ngOnInit(): void {
    }

    selectNode(node: BaseNzTreeNodeOptions<RmFunctionTreeNode>): void {
        this.activeNode = node;
    }

}
