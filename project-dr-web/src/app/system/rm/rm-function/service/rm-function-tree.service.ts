import {Injectable} from '@angular/core';
import {RmFunctionSearchForm} from '../entity/rm-function-search-form';
import {HttpClient} from '@angular/common/http';
import {RmFunction} from '../entity/rm-function';
import {RmFunctionTreeNode} from '../entity/rm-function-tree-node';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';

/**
 * 功能服务
 */
@Injectable({
    providedIn: 'root'
})
export class RmFunctionTreeService extends BaseTreeService<RmFunction, RmFunctionSearchForm, RmFunctionTreeNode> {

    basePath = 'rm/function';

    constructor(
        private http: HttpClient
    ) {
        super(http);
    }

}
