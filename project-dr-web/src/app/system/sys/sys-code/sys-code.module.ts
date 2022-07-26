import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SysCodeComponent} from './sys-code/sys-code.component';
import {SysCodeRoutingModule} from './sys-code-routing.module';
import {
    NzButtonModule,
    NzCardModule,
    NzGridModule,
    NzIconModule,
    NzInputModule,
    NzPopconfirmModule,
    NzTreeModule,
    NzUploadModule
} from 'ng-zorro-antd';
import {BaseDetailModule, BaseGridModule, BaseTreeModule} from '@sb/base';
import {SysCodeCategoryComponent} from './sys-code-category/sys-code-category.component';


@NgModule({
    imports: [
        CommonModule,
        SysCodeRoutingModule,
        FormsModule,
        BaseGridModule,
        NzButtonModule,
        NzIconModule,
        NzGridModule,
        NzTreeModule,
        NzInputModule,
        BaseTreeModule,
        BaseDetailModule,
        NzPopconfirmModule,
        NzCardModule,
        NzUploadModule,
    ],
    declarations: [
        SysCodeComponent,
        SysCodeCategoryComponent,
    ]
})
export class SysCodeModule {
}
