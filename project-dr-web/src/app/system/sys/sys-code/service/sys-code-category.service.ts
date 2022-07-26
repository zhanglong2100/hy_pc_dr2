import {Injectable} from '@angular/core';
import {SysCodeCategorySearchForm} from '../entity/sys-code-category-search-form';
import {SysCodeCategory} from '../entity/sys-code-category';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';
import {SysCodeCategoryTreeNode} from '../entity/sys-code-category-tree-node';

/**
 * 机构服务
 */
@Injectable({
    providedIn: 'root'
})
export class SysCodeCategoryService extends BaseTreeService<SysCodeCategory, SysCodeCategorySearchForm, SysCodeCategoryTreeNode> {

    basePath = 'sys/code-module';
}
