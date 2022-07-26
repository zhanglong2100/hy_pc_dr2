import {Component, OnInit} from '@angular/core';
import {TitleService} from './service/title.service';

@Component({
    selector: 'sb-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

    /**
     * title空调用, 用于修改title
     * @param titleService 标题
     */
    constructor(
        private titleService: TitleService) {
    }

    ngOnInit() {
    }
}
