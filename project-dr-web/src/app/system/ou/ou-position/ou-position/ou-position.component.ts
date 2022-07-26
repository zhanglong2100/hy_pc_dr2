import {Component, OnInit} from '@angular/core';
import {STColumn} from '@delon/abc';
import {BaseService} from '@sb/base';
import {OuPositionService} from '../service/ou-position.service';
import {SFSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'ou-position',
    templateUrl: './ou-position.component.html',
    styleUrls: ['./ou-position.component.less'],
    providers: [
        {
            provide: BaseService,
            useClass: OuPositionService
        }
    ]
})
export class OuPositionComponent implements OnInit {

    columns: STColumn[] = [
        {
            title: '',
            type: 'checkbox',
            index: 'positionId',
            width: '7%',
            className: 'text-center word-wrap'
        }, {
            title: '岗位',
            index: 'positionName',
            width: '20%',
            className: 'text-center word-wrap'
        }, {
            title: '岗位职责',
            index: 'duty',
            width: '20%',
            className: 'text-center word-wrap'
        }, {
            title: '备注',
            index: 'description',
            width: '30%',
            className: 'text-center word-wrap'
        }, {
            title: '操作区',
            width: '23%',
            className: 'text-center word-wrap',
            buttons: []
        }
    ];

    schema: SFSchema = {
        properties: {
            positionName: {
                type: 'string',
                title: '岗位名称',
                minLength: 2
            },
            duty: {
                type: 'string',
                title: '岗位职责',
                minLength: 2
            },
            description: {
                type: 'string',
                title: '岗位备注',
                minLength: 2
            },
        },
        required: ['positionName', 'duty'],
        ui: {
            spanLabelFixed: 100,
            grid: {
                span: 23
            }
        }
    };

    constructor(
        private message: NzMessageService) {
    }

    ngOnInit(): void {
    }
}
