import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class TitleService {

    // title = '公厕物联网通讯管理系统';
    // title = '贵阳习酒数据接收平台';
    title = '绘宇公告管理系统';
    subTitle = '';

    constructor(private titleService: Title) {
        this.titleService.setTitle(this.title);
    }
}
