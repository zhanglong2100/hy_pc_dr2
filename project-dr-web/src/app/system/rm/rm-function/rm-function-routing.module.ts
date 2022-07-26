import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RmFunctionComponent} from './rm-function/rm-function.component';


const routes: Routes = [
    {
        path: '', component: RmFunctionComponent
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
export class RmFunctionRoutingModule {
}
