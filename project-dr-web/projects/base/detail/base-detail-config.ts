import {SFSchema} from '@delon/form';
import {STData} from '@delon/abc';

export interface BaseDetailConfig {
    /**
     *
     */
    schema?: SFSchema;
    /**
     * todo 此处要修改, 不允许传递此方法. 后期修改
     */
    commitWrapper?: (value: STData) => STData;

    /**
     * todo 此处要修改, 不允许传递此方法. 后期修改
     */
    recordWrapper?: (value: STData) => STData;

}
