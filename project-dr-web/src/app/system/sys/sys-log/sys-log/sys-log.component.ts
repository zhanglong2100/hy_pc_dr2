import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseGridComponent, BaseService} from '@sb/base';
import {STColumn} from '@delon/abc';
import {SFSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd';
import {SysLogService} from '../service/sys-log.service';
import {SysCodeService} from "../../sys-code/service/sys-code.service";
import {SysLogSearchForm} from "../entity/sys-log-search-form";
import {SysCodeCategoryService} from "../../sys-code/service/sys-code-category.service";

@Component({
    selector: 'sys-log',
    templateUrl: './sys-log.component.html',
    styleUrls: ['./sys-log.component.less'],
    providers: [
        {
            provide: BaseService,
            useClass: SysLogService
        }
    ]
})
export class SysLogComponent implements OnInit {
    firstSelect: string = "";
    secondSelect: string = "";

    inputValue: string = "";
    ipValue: string = "";
    userValue: string = "";

    date = 'A';
    dateRange = [];
    customDate = false;

    defaultLogSmall: any = [{name: "全部", code: ""}];
    logBigCodes: any = [];
    logSmallCodes: any = [];

    searchForm: SysLogSearchForm = {};


    @ViewChild(BaseGridComponent, {static: false})
    baseGrid: BaseGridComponent;

    columns: STColumn[] = [
        {
            title: '',
            type: 'checkbox',
            index: 'logId',
            width: '7%',
            className: 'text-center word-wrap'
        }, {
            title: '日志大类',
            index: 'logType1',
            width: '15%',
            className: 'text-center word-wrap'
        }, {
            title: '日志小类',
            index: 'logType2',
            width: '15%',
            className: 'text-center word-wrap'
        }, {
            title: '日志时间',
            index: 'logTime',
            width: '15%',
            className: 'text-center word-wrap'
        }, {
            title: '操作用户',
            index: 'username',
            width: '15%',
            className: 'text-center word-wrap'
        }, {
            title: '操作IP',
            index: 'ip',
            width: '15%',
            className: 'text-center word-wrap'
        }, {
            title: '错误信息',
            index: 'errorMessage',
            width: '18%',
            className: 'text-center word-wrap'
        }
    ];

    schema: SFSchema = {} as SFSchema;

    constructor(
        private message: NzMessageService,
        private sysCodeService: SysCodeService,
        private sysCodeModuleService: SysCodeCategoryService) {
    }

    doSearch() {
        if (this.ipValue) {
            this.searchForm.ip = this.ipValue;
        } else {
            delete this.searchForm.ip;
        }
        if (this.userValue) {
            this.searchForm.username = this.userValue
        } else {
            delete this.searchForm.username;
        }
        this.baseGrid.reload();
    }


    //获取AddDayCount天后的日期
    getDateStr(AddDayCount) {
        let dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);
        let y = dd.getFullYear();
        let m = dd.getMonth() + 1;
        let d = dd.getDate();
        return y + '-' + (m < 10 ? '0' + m : m) + '-' + d;
    }

    dateFormat(date: Date, fmt: string) {
        let o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    onOk(result: Date) {
        this.searchForm.repTimeStart = this.dateFormat(result[0], "yyyy-MM-dd hh:mm:ss");
        this.searchForm.repTimeEnd = this.dateFormat(result[1], "yyyy-MM-dd hh:mm:ss");
        this.baseGrid.reload()
    }

    reset() {
        delete this.searchForm.repTimeStart;
        delete this.searchForm.repTimeEnd;
        delete this.searchForm.username;
        delete this.searchForm.ip;
        this.firstSelect = this.secondSelect = '';
        delete this.searchForm.logType1;
        delete this.searchForm.logType2;
        this.ipValue = this.userValue = '';
        this.baseGrid.reload();
    }

    reload(paramField: string, e: any) {
        if (paramField == 'logType1') {
            delete this.searchForm.logType2;
            if (e && e == '_LOG_LOGIN_') {
                this.logSmallCodes = this.defaultLogSmall.concat([{
                    name: "web登陆",
                    code: "_LOG_WEB_LOGIN_"
                }, {name: "app登陆", code: "_LOG_APP_LOGIN_"}]);
                this.secondSelect = this.logSmallCodes[0].code;
            } else if (e && e == '_LOG_LOGOUT_') {
                this.logSmallCodes = this.defaultLogSmall.concat({name: "web登出", code: "logout"});
                this.secondSelect = this.logSmallCodes[0].code;
            } else {
                this.logSmallCodes = this.defaultLogSmall;
                this.secondSelect = this.logSmallCodes[0].code;
            }
        } else if (paramField == 'date') {
            if (e == "A") {
                this.searchForm.repTimeStart = '';
                this.searchForm.repTimeEnd = '';
            }
            if (e == "B") {
                this.searchForm.repTimeStart = this.getDateStr(0) + " 00:00:00";
                this.searchForm.repTimeEnd = this.getDateStr(0) + " 24:00:00";
            }
            if (e == "C") {
                this.searchForm.repTimeStart = this.getDateStr(-1) + " 00:00:00";
                this.searchForm.repTimeEnd = this.getDateStr(-1) + " 24:00:00";
            }
            if (e == "D") {
                this.searchForm.repTimeStart = this.getDateStr(-new Date().getDate()) + " 24:00:00";
                this.searchForm.repTimeEnd = '';
            }
            if (e == "custom") {
                this.customDate = true;
                return;
            } else {
                this.customDate = false
            }
        }

        if (e) {
            this.searchForm[paramField] = e;
        } else {
            if (this.searchForm[paramField]) {
                delete this.searchForm[paramField];
            }
        }
        this.baseGrid.reload();
    }

    ngOnInit(): void {
        this.sysCodeService.getComboBox("_LOG_TYPE_").subscribe(returnForm => {
            if (returnForm.success) {
                let temp = [{name: "全部", code: ""}];
                this.logBigCodes = temp.concat(returnForm.message);
            } else {
                this.message.error("获取数据字典失败：" + returnForm.errorMessage);
            }
        });
        this.logSmallCodes = this.defaultLogSmall;

    }

}
