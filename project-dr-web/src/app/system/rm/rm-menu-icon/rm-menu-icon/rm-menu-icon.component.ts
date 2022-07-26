import {Component, OnInit,} from '@angular/core';
import {STColumn} from "@delon/abc";
import {BaseService} from "@sb/base";
import {RmMenuIconService} from "../service/re-menu-icon.service";
import {SFSchema} from "@delon/form";
import {RmMenuIconSearchForm} from "../entity/rm-menu-icon-search-form";

@Component({
    selector: 'rm-menu-icon',
    templateUrl: './rm-menu-icon.component.html',
    styleUrls: ['./rm-menu-icon.component.less'],
    providers: [
        {
            provide: BaseService,
            useClass: RmMenuIconService
        }
    ]
})

export class RmMenuIconComponent implements OnInit {


    _searchForm: RmMenuIconSearchForm = {}

    get searchForm() {
        return this._searchForm;
    }

    set searchForm(searchForm: RmMenuIconSearchForm) {
        this._searchForm = searchForm;
    }

    columns: STColumn[] = [
        {
            title: '',
            type: 'checkbox',
            index: 'iconId',
        },
        {
            title: '名称',
            index: 'name',
        }, {
            title: '类型',
            index: 'picture',
        }
    ];
    schema: SFSchema = {
        properties: {
            name: {
                type: 'string',
                title: '名称',
                ui: {
                    spanLabel: 5,
                    spanControl: 18,
                    placeholder: '请输入名称',
                }
            },
            picture: {
                type: 'string',
                title: '图片',
                ui: {
                    spanLabel: 5,
                    spanControl: 16,
                    widget: 'icon-upload-alain',
                }
            }
        },
        required: ['name', 'picture'],
        ui: {
            grid: {
                span: 23
            }
        }
    };

    constructor() {
    }

    ngOnInit(): void {

    }


}
