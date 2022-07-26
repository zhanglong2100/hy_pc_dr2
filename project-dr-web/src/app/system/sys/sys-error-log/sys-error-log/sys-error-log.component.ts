import {Component, OnInit} from '@angular/core';
import {BaseService} from '@sb/base';
import {STColumn} from '@delon/abc';
import {SFSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd';
import {SysErrorLogService} from '../service/sys-error-log.service';

@Component({
    selector: 'sys-error-log',
    templateUrl: './sys-error-log.component.html',
    styleUrls: ['./sys-error-log.component.less'],
    providers: [
        {
            provide: BaseService,
            useClass: SysErrorLogService
        }
    ]
})
export class SysErrorLogComponent implements OnInit {

    columns: STColumn[] = [
        {
            title: '',
            type: 'checkbox',
            index: 'errorId',
            width: '7%',
            className: 'text-center word-wrap'
        }, {
            title: '错误时间',
            index: 'errorTime',
            width: '20%',
            className: 'text-center word-wrap'
        }, {
            title: '访问的错误地址',
            index: 'url',
            width: '20%',
            className: 'text-center word-wrap'
        }, {
            title: '错误包名',
            index: 'errorPackage',
            width: '20%',
            className: 'text-center word-wrap'
        }, {
            title: '错误方法名',
            index: 'errorMethod',
            width: '20%',
            className: 'text-center word-wrap'
        }, {
            title: '操作区',
            className: 'text-center word-wrap',
            width: '13%',
            buttons: []
        }
    ];

    schema: SFSchema = {
        properties: {
            errorTime: {
                type: 'string',
                title: '错误时间'
            },
            url: {
                type: 'string',
                title: '访问的错误地址'
            },
            param: {
                type: 'string',
                title: '错误参数'
            },
            errorPackage: {
                type: 'string',
                title: '错误包名'
            },
            errorMethod: {
                type: 'string',
                title: '错误方法名'
            },
            errorLineNumber: {
                type: 'string',
                title: '错误行号'
            },
            errorMessage: {
                type: 'string',
                title: '错误消息',
                ui: {
                    widget: 'textarea',
                    autosize: {
                        minRows: 2,
                        maxRows: 6
                    },
                }
            },
            errorStack: {
                type: 'string',
                title: '错误堆栈',
                ui: {
                    widget: 'textarea',
                    autosize: {
                        minRows: 2,
                        maxRows: 10
                    },
                }
            }
        },
        ui: {
            spanLabelFixed: 120,
            grid: {}
        },
    } as SFSchema;

    constructor(
        private message: NzMessageService) {
    }

    ngOnInit(): void {
    }
}
