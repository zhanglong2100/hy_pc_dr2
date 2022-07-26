import {STData} from "@delon/abc";

export interface OuPasswordModify extends STData {

    /**
     * 旧密码
     */
    oldPassword?: string;

    /**
     * 新密码
     */
    newPassword?: string;
}
