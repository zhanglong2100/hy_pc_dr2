import {Injectable} from '@angular/core';
import {OuOrgSearchForm} from '../entity/ou-org-search-form';
import {OuOrg} from '../entity/ou-org';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';
import {OuOrgTreeNode} from '../entity/ou-org-tree-node';

/**
 * 机构服务
 */
@Injectable({
    providedIn: 'root'
})
export class OuOrgService extends BaseTreeService<OuOrg, OuOrgSearchForm, OuOrgTreeNode> {

    basePath = 'ou/org';
}
