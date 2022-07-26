import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseGridModule} from '@sb/base';
import {SysErrorLogRoutingModule} from './sys-error-log-routing.module';
import {NzCardModule} from 'ng-zorro-antd';
import {SysErrorLogComponent} from './sys-error-log/sys-error-log.component';


@NgModule({
    declarations: [SysErrorLogComponent],
    imports: [
        CommonModule,
        SysErrorLogRoutingModule,
        BaseGridModule,
        NzCardModule
    ]
})
export class SysErrorLogModule {
}
