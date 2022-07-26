import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {OuPositionComponent} from './ou-position/ou-position.component';
import {OuPositionRoutingModule} from './ou-position-routing.module';
import {NzButtonModule, NzCardModule, NzIconModule} from 'ng-zorro-antd';
import {environment} from '../../../../environments/environment';
import {InMemoryOuPositionService} from './service/in-memory-ou-position.service';
import {BaseGridModule} from '@sb/base';
import {InMemoryHttpClientModule} from '@sb/in-memory-http-client';


@NgModule({
    imports: [
        CommonModule,
        OuPositionRoutingModule,
        FormsModule,
        environment.production ? [] : InMemoryHttpClientModule.forRoot({
            dataEncapsulation: false,
            delay: 1500,
            rootPath: environment.baseServerUrl
        }, InMemoryOuPositionService),
        BaseGridModule,
        NzButtonModule,
        NzIconModule,
        NzCardModule,
    ],
    declarations: [
        OuPositionComponent,
    ]
})
export class OuPositionModule {
}
