import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SysParamComponent} from './sys-param/sys-param.component';


const routes: Routes = [{
    path: '',
    component: SysParamComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SysParamRoutingModule {
}
