import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SysNoticeComponent} from "./sys-notice/sys-notice.component";


const routes: Routes = [{
    path: '', component: SysNoticeComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SysNoticeRoutingModule {
}
