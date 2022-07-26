import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseGridModule} from '@sb/base';
import {SysLogRoutingModule} from './sys-log-routing.module';
import {
    NzAutocompleteModule,
    NzButtonModule,
    NzCardModule,
    NzCollapseModule,
    NzDatePickerModule,
    NzGridModule,
    NzIconModule,
    NzInputModule,
    NzListModule,
    NzRadioModule,
    NzSelectModule
} from 'ng-zorro-antd';
import {SysLogComponent} from './sys-log/sys-log.component';
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [SysLogComponent],
    imports: [
        CommonModule,
        SysLogRoutingModule,
        BaseGridModule,
        NzCardModule,
        NzCollapseModule,
        NzListModule,
        NzRadioModule,
        FormsModule,
        NzDatePickerModule,
        NzGridModule,
        NzInputModule,
        NzButtonModule,
        NzIconModule,
        NzSelectModule,
        NzAutocompleteModule
    ]
})
export class SysLogModule {
}
