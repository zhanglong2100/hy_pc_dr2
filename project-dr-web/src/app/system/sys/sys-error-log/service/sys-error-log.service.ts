import {Injectable} from '@angular/core';
import {BaseService} from '@sb/base';
import {SysErrorLogSearchForm} from '../entity/sys-error-log-search-form';
import {SysErrorLog} from '../entity/sys-error-log';

@Injectable({
    providedIn: 'root'
})
export class SysErrorLogService extends BaseService<SysErrorLog, SysErrorLogSearchForm> {
    readonly basePath = 'sys/errorLog';
}
