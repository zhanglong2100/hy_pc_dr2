import {OuPosition} from '../entity/ou-position';
import {OuPositionSearchForm} from '../entity/ou-position-search-form';
import {BaseInMemoryService} from '@sb/in-memory-http-client';

export class InMemoryOuPositionService extends BaseInMemoryService<OuPosition, OuPositionSearchForm> {
    get keyFields() {
        return ['positionId'];
    }

    get moduleName() {
        return 'ou/position';
    }

    get searchFields() {
        return ['positionName'];
    }

    get dbArrays(): OuPosition[] {
        const ouPositions: OuPosition[] = [];
        for (let i = 0; i < 51; i++) {
            const ouPosition: OuPosition = {} as OuPosition;
            ouPosition.positionId = this.genGuid();
            ouPosition.positionName = '岗位' + i;
            ouPositions.push(ouPosition);
        }
        return ouPositions;
    }
}
