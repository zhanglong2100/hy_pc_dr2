import {Component, OnInit} from '@angular/core';
import {BaseService} from '@sb/base';
import {SysParamService} from '../service/sys-param.service';
import {STColumn} from '@delon/abc';
import {SFSchema, SFSelectWidgetSchema, SFTextareaWidgetSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd';
import {SysParam} from "../entity/sys-param";

@Component({
    selector: 'sys-param',
    templateUrl: './sys-param.component.html',
    styleUrls: ['./sys-param.component.less'],
    providers: [
        {
            provide: BaseService,
            useClass: SysParamService
        }
    ]
})
export class SysParamComponent implements OnInit {

    columns: STColumn[] = [
        {
            title: '',
            type: 'checkbox',
            index: 'paramId',
            width: '7%',
            className: 'text-center word-wrap'
        }, {
            title: '参数名',
            index: 'paramName',
            width: '30%',
            className: 'text-center word-wrap'
        }, {
            title: '参数值',
            index: 'paramValue',
            width: '30%',
            className: 'text-center word-wrap'
        }, {
            title: '操作区',
            width: '33%',
            className: 'text-center word-wrap',
            buttons: []
        }
    ];


    schema: SFSchema = {
        properties: {
            paramName: {
                type: 'string',
                title: '参数名',
                // minLength: 2
            },
            valueType: {
                type: 'string',
                title: '类型',
                enum: [
                    {label: '文本', value: 'TEXT'},
                    {label: '数值', value: 'NUMBER'},
                    // {label: '数据字典', value: 'SYS_CODE'},
                    // { label: '选择', value: 'SELECT' },
                ],
                default: 'TEXT',
                ui: {
                    widget: 'select',
                } as SFSelectWidgetSchema,
            },
            paramValue: {
                type: 'string',
                title: '参数值',
                ui: {
                    widget: 'textarea',
                    visibleIf: {valueType: (value: any) => value === 'TEXT'},
                } as SFTextareaWidgetSchema,
            },
            paramValue1: {
                type: 'number',
                title: '参数值',
                // minimum: 18, maximum: 100,
                ui: {
                    visibleIf: {valueType: (value: any) => value === 'NUMBER'},
                }
            },
            remark: {
                type: 'string',
                title: '描述',
                ui: {
                    widget: 'textarea',
                    autosize: {minRows: 2, maxRows: 4},
                } as SFTextareaWidgetSchema,
            }
        },
        required: ['paramName', 'paramValue', 'paramValue1'],
        /*if: {
            properties: {valueType: {enum: ['NUMBER']}}
        },
        then: {
            required: ['paramValue1'],
        },
        else: {
            required: ['paramValue'],
        },*/
        ui: {
            spanLabelFixed: 100,
            grid: {
                span: 23
            }
        }
    };

    /*  customCommitMethod(sysParam: SysParam, sysParamService: SysParamService) {
          return sysParamService.commit1(sysParam);
      }*/
    commitWrapper(sysParam: SysParam) {
        if (sysParam.paramValue1) {
            sysParam.paramValue = sysParam.paramValue1;
            delete sysParam.paramValue1;
        }
        return sysParam;
    }

    recordWrapper(value) {
        if (value.valueType === 'NUMBER') {
            value.paramValue1 = value.paramValue;
            delete value.paramValue;
        }
        return value;
    }

    constructor(
        private message: NzMessageService) {
    }

    ngOnInit(): void {

    }
}
