/**
 * Interface for InMemoryBackend configuration options
 */
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class PopupConfig {
    /**
     * 显示背景
     */
    showMask?: boolean = true;

    /**
     * 关闭
     */
    maskCloseEvent?: boolean = false;

    /**
     * 颜色
     */
    maskColor?: string = '#fafafa8c';

    /**
     * 宽度
     */
    width?: number | string = '50%';

    /**
     * 高度
     */
    height?: number | string = '50%';

    /**
     * 左
     */
    left?: number | string = '50%';

    /**
     * 上
     */
    top?: number | string = '50%';


}
