import {Injectable} from '@angular/core';
import {baseHandleError, BaseService, ReturnForm} from '@sb/base';
import {PublicNotice} from './entity/public-notice';
import {PublicNoticeSearchForm} from './entity/public-notice-search-form';


@Injectable({
    providedIn: 'root'
})
export class PublicNoticeService extends BaseService<PublicNotice, PublicNoticeSearchForm> {

    basePath = 'dataReceive/publicNotice';

    exportPath = `${this.url}/export`;


}
