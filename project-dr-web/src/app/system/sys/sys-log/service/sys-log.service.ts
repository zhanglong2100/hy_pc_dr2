import {Injectable} from '@angular/core';
import {BaseService} from '@sb/base';
import {SysLogSearchForm} from '../entity/sys-log-search-form';
import {SysLog} from '../entity/sys-log';

@Injectable({
    providedIn: 'root'
})
export class SysLogService extends BaseService<SysLog, SysLogSearchForm> {
    readonly basePath = 'sys/logOperate';
}
