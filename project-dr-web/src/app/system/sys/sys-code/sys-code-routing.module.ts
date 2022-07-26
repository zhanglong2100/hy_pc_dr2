import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SysCodeCategoryComponent} from './sys-code-category/sys-code-category.component';


const routes: Routes = [
    {
        path: '', component: SysCodeCategoryComponent
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
export class SysCodeRoutingModule {
}
