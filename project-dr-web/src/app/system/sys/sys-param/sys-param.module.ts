import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SysParamComponent} from './sys-param/sys-param.component';
import {BaseGridModule} from '@sb/base';
import {SysParamRoutingModule} from './sys-param-routing.module';
import {NgZorroAntdModule, NzButtonModule, NzCardModule, NzIconModule} from 'ng-zorro-antd';


@NgModule({
    imports: [
        CommonModule,
        SysParamRoutingModule,
        FormsModule,
        BaseGridModule,
        NzButtonModule,
        NzIconModule,
        NgZorroAntdModule,
        NzCardModule,
    ],
    declarations: [
        SysParamComponent,
    ]
})
export class SysParamModule {
}
