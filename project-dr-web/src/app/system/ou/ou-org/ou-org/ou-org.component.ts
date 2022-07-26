import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {OuOrg} from '../entity/ou-org';
import {OuOrgService} from '../service/ou-org.service';
import {BaseGridComponent, BaseService} from '@sb/base';
import {SFSchema} from '@delon/form';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';
import {OuOrgTreeNode} from '../entity/ou-org-tree-node';
import {STColumn} from '@delon/abc';
import {OuOrgSearchConfig} from '../entity/ou-org-search-config';
import {OuOrgUserTreeSelectAlainSchema} from '../../ou-org-user-tree-select-alain/ou-org-user-tree-select-alain.component';
import {OuOrgUserTreeSelectPanelComponent} from '../../ou-org-user-tree-select-panel/ou-org-user-tree-select-panel.component';
import {BehaviorSubject, Observable, of} from "rxjs/index";

@Component({
    selector: 'ou-org',
    templateUrl: './ou-org.component.html',
    styleUrls: ['./ou-org.component.less'],
    providers: [{
        provide: BaseTreeService,
        useClass: OuOrgService
    }, {
        provide: BaseService,
        useClass: OuOrgService
    }]
})
export class OuOrgComponent implements OnInit {

    @ViewChild('baseTree', {static: false})
    baseTree: OuOrgUserTreeSelectPanelComponent;

    @ViewChild('baseGrid', {static: false})
    baseGrid: BaseGridComponent;

    showType: 'list' | 'table' = 'list';

    // _showLoadPanel = false;

    baseParam: OuOrg = {
        parentOrgId: '-1'
    };

    activeNode: OuOrg;

    typeIcon = {
        root: 'dr:hy-root',
        ORG: 'dr:hy-module',
        DEPT: 'dr:hy-terminal',
        USER: 'dr:user_yw'
    };

    searchConfig: OuOrgSearchConfig = {
        searchSubOrg: true,
        searchDept: true,
        searchUser: false,
    };

    ngOnInit(): void {
    }

    selectNode(selectedNodeTreeNode: OuOrgTreeNode): void {
        this.activeNode = selectedNodeTreeNode.data;
        this.baseParam.parentOrgId = this.activeNode.orgId;
        this.updateSchema(this.activeNode);
        this.baseGrid.reload();
    }

    constructor(
        private message: NzMessageService,
        private modal: NzModalService) {
    }

    onDataReload() {
        this.baseTree.reloadNode(this.baseParam.parentOrgId || "-1");
    }

    columns: STColumn[] = [
        {
            title: '',
            type: 'checkbox',
            index: 'roleId',
            width: '7%',
            className: 'text-center word-wrap',
        }, {
            title: '名称',
            index: 'orgName',
            width: '31%',
            className: 'text-center word-wrap',
        }, {
            title: '类型',
            index: 'orgType',
            format: v => {
                if (v.orgType === 'ORG') {
                    return '机构';
                } else if (v.orgType === 'DEPT') {
                    return '部门';
                } else {
                    return '-';
                }
            },
            width: '31%',
            className: 'text-center word-wrap',
        }, {
            title: '操作区',
            width: '31%',
            className: 'text-center word-wrap',
            buttons: []
        }
    ];

    schema: SFSchema = {
        properties: {
            parentOrgId: {
                type: 'string',
                title: '父级机构',
                ui: {
                    grid: {
                        span: 12,
                    },
                    widget: 'ou-org-user-tree-select-alain',
                    searchConfig: {
                        searchSubOrg: true,
                        searchDept: true
                    }
                } as OuOrgUserTreeSelectAlainSchema,
                readOnly: true
            },
            orgType: {
                type: 'string',
                title: '机构类型',
                enum: [{
                    value: 'ORG',
                    label: '机构'
                }, {
                    value: 'DEPT',
                    label: '部门'
                }],
                default: 'ORG',
                ui: {
                    widget: 'select',
                    grid: {
                        span: 12,
                    }
                },
            },
            orgName: {
                type: 'string',
                title: '机构名称',
            },
            orgAddr: {
                type: 'string',
                title: '机构地址',
                ui: {
                    visibleIf: {
                        orgType: ['ORG']
                    }
                }
            },
            linkMan: {
                type: 'string',
                title: '联 系 人',
                ui: {
                    visibleIf: {
                        orgType: ['ORG']
                    }
                }
            },
            linkTel: {
                type: 'string',
                title: '联系电话',
                ui: {
                    visibleIf: {
                        orgType: ['ORG']
                    }
                }
            },
            email: {
                type: 'string',
                title: '电子邮箱',
                ui: {
                    visibleIf: {
                        orgType: ['ORG']
                    }
                }
            },
            webUrl: {
                type: 'string',
                title: '网站地址',
                ui: {
                    visibleIf: {
                        orgType: ['ORG']
                    }
                }
            }/*,
            status: {
                type: 'string',
                title: '机构状态',
                ui: {
                    visibleIf: {
                        orgType: ['ORG']
                    }
                }
            }*/
        },
        required: ['orgName', 'orgType'],
        ui: {
            width: 375,
            spanLabelFixed: 110,
            grid: {
                span: 12
            }
        }
    };

    updateSchema(ouOrg: OuOrg) {
        let enu = [{
            value: 'ORG',
            label: '机构'
        }, {
            value: 'DEPT',
            label: '部门'
        }];
        let defaultValue = 'ORG';
        if (ouOrg.orgType === 'DEPT') {
            enu = [{
                value: 'DEPT',
                label: '部门'
            }];
            defaultValue = 'DEPT';
        }
        this.schema.properties.orgType = {
            type: 'string',
            title: '类型',
            enum: enu,
            default: defaultValue
        };
    }

    beforeRemove(orgs: OuOrg[]): Observable<boolean> {
        const subject = new BehaviorSubject(false);
        for (let i = 0; i < orgs.length; i++) {
            const org = orgs[i];
            if (org.orgType === 'ORG') {
                this.modal.confirm({
                    nzTitle: '删除提示',
                    nzContent: '删除机构会同时删除机构下的所有部门，是否确定删除?',
                    nzOnOk: () => {
                        subject.next(true);
                        subject.complete();
                    }
                }, 'warning');
                break;
            }

            if (i === orgs.length - 1) {
                return of(true);
            }
        }
        return subject;
    }

}
