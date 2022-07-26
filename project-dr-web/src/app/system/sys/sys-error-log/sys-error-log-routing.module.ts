import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SysErrorLogComponent} from './sys-error-log/sys-error-log.component';


const routes: Routes = [{
    path: '', component: SysErrorLogComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SysErrorLogRoutingModule {
}
