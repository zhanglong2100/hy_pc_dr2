import {Component, OnInit} from '@angular/core';
import {STColumn, STData} from '@delon/abc';
import {BaseService} from '@sb/base';
import {RmRoleService} from '../service/rm-role.service';
import {SFSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd';
import {RmRole} from "../entity/rm-role";

@Component({
    selector: 'rm-role',
    templateUrl: './rm-role.component.html',
    styleUrls: ['./rm-role.component.less'],
    providers: [
        {
            provide: BaseService,
            useClass: RmRoleService
        }
    ]
})
export class RmRoleComponent implements OnInit {

    selectRoleId: string;

    columns: STColumn[] = [
        {
            title: '',
            type: 'checkbox',
            index: 'roleId',
            width: '7%',
            className: 'text-center word-wrap'
        }, {
            title: '角色编码',
            index: 'roleCode',
            width: '20%',
            className: 'text-center word-wrap'
        }, {
            title: '角色名称',
            index: 'roleName',
            width: '16%',
            className: 'text-center word-wrap'
        }, {
            title: '角色类型',
            index: 'roleType',
            format: (item, col, index) => {
                return item.roleType === 'SYSTEM' ? '系统级' : '普通级';
            },
            width: '13%',
            className: 'text-center word-wrap'
        }, {
            title: '备注',
            index: 'remark',
            width: '18%',
            className: 'text-center word-wrap'
        }, {
            title: '操作区',
            className: 'text-center word-wrap',
            width: '28%',
            buttons: []
        }
    ];

    schema: SFSchema = {
        properties: {
            roleCode: {
                type: 'string',
                title: '角色编码',
                minLength: 2
            },
            roleName: {
                type: 'string',
                title: '角色名称',
                minLength: 2
            },
            roleType: {
                type: 'string',
                title: '角色类型',
                enum: [{
                    value: 'SYSTEM',
                    label: '系统级'
                }, {
                    value: 'NORMAL',
                    label: '普通级'
                }]
            },
            remark: {
                type: 'string',
                title: '备 注',
                ui: {
                    widget: 'textarea',
                    autosize: {
                        minRows: 2,
                        maxRows: 8
                    },
                }
            }
        },
        required: ['roleCode', 'roleName'],
        ui: {
            spanLabelFixed: 100,
            grid: {
                span: 23

            }
        }
    } as SFSchema;

    itemClick(item: STData) {
        this.selectRoleId = item.roleId;
    }

    beforeDataRender(data: RmRole[]): RmRole[] {
        if (data.length > 0) {
            this.selectRoleId = data[0].roleId;
        }
        return data;
    }

    constructor(
        private message: NzMessageService) {
    }

    ngOnInit(): void {
    }

    rowClassName() {
        return 'tr-hover-pointer'
    }
}
