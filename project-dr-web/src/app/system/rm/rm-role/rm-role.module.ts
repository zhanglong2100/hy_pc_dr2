import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RmRoleComponent} from './rm-role/rm-role.component';
import {RmRoleRoutingModule} from './rm-role-routing.module';
import {NzButtonModule, NzCardModule, NzGridModule, NzIconModule} from 'ng-zorro-antd';
import {InMemoryRmRoleService} from './service/in-memory-rm-role.service';
import {BaseGridModule} from '@sb/base';
import {InMemoryHttpClientModule} from '@sb/in-memory-http-client';
import {environment} from '../../../../environments/environment';
import {RmRoleFunctionModule} from "../rm-role-function/rm-role-function.module";


@NgModule({
    imports: [
        CommonModule,
        RmRoleRoutingModule,
        FormsModule,
        environment.production ? [] : InMemoryHttpClientModule.forRoot({
            dataEncapsulation: false,
            delay: 1500,
            rootPath: environment.baseServerUrl
        }, InMemoryRmRoleService),
        BaseGridModule,
        NzButtonModule,
        NzIconModule,
        NzCardModule,
        NzGridModule,
        RmRoleFunctionModule,
    ],
    declarations: [
        RmRoleComponent,
    ]
})
export class RmRoleModule {
}
