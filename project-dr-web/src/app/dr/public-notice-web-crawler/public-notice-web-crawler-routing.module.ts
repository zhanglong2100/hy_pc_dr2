import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicNoticeWebCrawlerComponent} from './public-notice-web-crawler/public-notice-web-crawler.component';


const routes: Routes = [{
    path: '', component: PublicNoticeWebCrawlerComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PublicNoticeWebCrawlerRoutingModule {
}
