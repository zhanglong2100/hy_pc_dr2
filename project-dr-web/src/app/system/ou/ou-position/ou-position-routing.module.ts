import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OuPositionComponent} from './ou-position/ou-position.component';


const routes: Routes = [
    {
        path: '', component: OuPositionComponent
    }
];


@NgModule({
    exports: [
        RouterModule
    ],
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class OuPositionRoutingModule {
}
