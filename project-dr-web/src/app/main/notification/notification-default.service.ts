import {NzNotificationDataOptions, NzNotificationService} from 'ng-zorro-antd';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class NotificationDefaultService {
    constructor(private notification: NzNotificationService) {
    }

    // 设置通知框弹出位置
    placement = 'topRight';

    basicNotification(title, content, option: NzNotificationDataOptions = {}): void {
        this.notification.config({
            nzPlacement: this.placement
        });
        if (title == null || title === '') {
            title = '系统提示';
        }
        this.notification.blank(title, content, option);
    }
}
