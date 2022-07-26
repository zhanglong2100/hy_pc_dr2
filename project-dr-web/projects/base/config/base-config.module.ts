import {NgModule} from '@angular/core';
import {NZ_I18N, NZ_NOTIFICATION_CONFIG, zh_CN} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {STConfig} from '@delon/abc';
import {BASE_HTTP_OPTIONS} from '@sb/base/core';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [],
    providers: [
        {provide: NZ_I18N, useValue: zh_CN},
        {provide: NZ_NOTIFICATION_CONFIG, useValue: {nzDuration: 4000, nzPlacement: 'bottomRight'}},
        {
            provide: STConfig, useValue: {
                size: 'middle',
                req: {
                    reName: {
                        pi: 'page',
                        ps: 'rows'
                    },
                    headers: BASE_HTTP_OPTIONS.headers,
                    method: 'POST'        // ,allInBody : true
                },
                // scroll: {y: '500px'},
                res: {
                    reName: {
                        list: 'message.rows',
                        total: 'message.total'
                    }
                },
                page: {
                    front: false,
                    showSize: true,
                    pageSizes: [10, 20, 50, 100],
                    showQuickJumper: true,
                    total: '{{range[0]}} - {{range[1]}} /共 {{total}} 条',
                    indexReset: false
                },
            } as STConfig
        },
    ]
})
export class BaseConfigModule {
}
