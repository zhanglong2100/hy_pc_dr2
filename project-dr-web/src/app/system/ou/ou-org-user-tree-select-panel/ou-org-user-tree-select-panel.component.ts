import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';
import {OuOrgService} from '../ou-org/service/ou-org.service';
import {BaseNzTreeNodeOptions, BaseTreeComponent} from '@sb/base';
import {OuOrgSearchConfig} from '../ou-org/entity/ou-org-search-config';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'ou-org-user-tree-select-panel',
    templateUrl: './ou-org-user-tree-select-panel.component.html',
    providers: [{
        provide: BaseTreeService,
        useClass: OuOrgService
    }]
})
export class OuOrgUserTreeSelectPanelComponent implements OnInit {

    @ViewChild("baseTree", {static: false})
    baseTree: BaseTreeComponent;

    typeIcon = {
        root: "dr:hy-root",
        ORG: "dr:hy-module",
        DEPT: "dr:hy-terminal",
        USER: "dr:user_yw"
    };

    @Output()
    selectNode = new EventEmitter<BaseNzTreeNodeOptions<any>>();

    @Input()
    searchConfig: OuOrgSearchConfig;

    @Input()
    checkable: boolean;

    ngOnInit(): void {
    }

    onSelectNode(selectedNodeTreeNode: BaseNzTreeNodeOptions<any>): void {
        this.selectNode.emit(selectedNodeTreeNode)
    }

    constructor(
        private message: NzMessageService) {
    }

    reload() {
        this.baseTree.reload();
    }

    reloadNode(nodeId) {
        this.baseTree.reloadNode(nodeId);
    }
}
