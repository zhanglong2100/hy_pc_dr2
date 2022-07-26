import {Injectable} from '@angular/core';
import {RmMenuSearchForm} from '../entity/rm-menu-search-form';
import {HttpClient} from '@angular/common/http';
import {RmMenu} from '../entity/rm-menu';
import {RmMenuTreeNode} from '../entity/rm-menu-tree-node';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';

/**
 * 功能服务
 */
@Injectable({
    providedIn: 'root'
})
export class RmMenuTreeService extends BaseTreeService<RmMenu, RmMenuSearchForm, RmMenuTreeNode> {

    basePath = 'rm/menu';

    constructor(
        private http: HttpClient
    ) {
        super(http);
    }

}
