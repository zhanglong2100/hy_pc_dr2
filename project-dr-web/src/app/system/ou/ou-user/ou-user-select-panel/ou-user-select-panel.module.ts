import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OuUserSelectPanelComponent} from './ou-user-select-panel.component';
import {NzIconModule, NzInputModule, NzTreeModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [OuUserSelectPanelComponent],
    imports: [
        CommonModule,
        NzInputModule,
        FormsModule,
        NzTreeModule,
        NzIconModule
    ],
    exports: [
        OuUserSelectPanelComponent
    ]
})
export class OuUserSelectPanelModule {
}
