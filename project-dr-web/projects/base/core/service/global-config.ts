/**
 * 基础form
 */
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GlobalConfig {
    /**
     * 全局服务地址配置
     */
    baseServerUrl?: string;
}
