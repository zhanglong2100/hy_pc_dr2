import {Component, OnInit} from '@angular/core';
import {SysNotice} from "../entity/sys-notice";
import {SysNoticeService} from "../service/sys-notice.service";

@Component({
    selector: 'sys-notice',
    templateUrl: './sys-notice.component.html',
    styleUrls: ['./sys-notice.component.less']
})
export class SysNoticeComponent implements OnInit {

    sysNotice: SysNotice = {};

    constructor(
        private service: SysNoticeService
    ) {
    }

    ngOnInit() {
        this.init();
    }

    init() {
        this.service.getUnique().subscribe(
            res => {
                if (res.success) {
                    let config = res.message;
                    if (config) {
                        this.sysNotice = config;
                    }
                }
            }
        );
    }

    doCommit() {
        this.service.commit(this.sysNotice).subscribe(
            res => {
                if (res.success) {
                    console.log('配置已保存');
                }
            }
        );
    }

}
