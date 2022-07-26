import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicNoticeDirComponent} from './public-notice-dir/public-notice-dir.component';


const routes: Routes = [
    {
        path: '', component: PublicNoticeDirComponent
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
export class PublicNoticeDirRoutingModule {
}
