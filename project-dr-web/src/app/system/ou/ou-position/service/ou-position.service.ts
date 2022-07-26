import {Injectable} from '@angular/core';
import {OuPositionSearchForm} from '../entity/ou-position-search-form';
import {OuPosition} from '../entity/ou-position';
import {BaseService} from '@sb/base';

/**
 * 机构服务
 */
@Injectable({
    providedIn: 'root'
})
export class OuPositionService extends BaseService<OuPosition, OuPositionSearchForm> {

    basePath = 'ou/position';
}
