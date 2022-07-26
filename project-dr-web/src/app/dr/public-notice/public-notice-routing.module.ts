import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicNoticeComponent} from './public-notice/public-notice.component';


const routes: Routes = [{
    path: '', component: PublicNoticeComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PublicNoticeRoutingModule {
}
