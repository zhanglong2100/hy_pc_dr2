import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SysLogComponent} from './sys-log/sys-log.component';


const routes: Routes = [{
    path: '', component: SysLogComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SysLogRoutingModule {
}
