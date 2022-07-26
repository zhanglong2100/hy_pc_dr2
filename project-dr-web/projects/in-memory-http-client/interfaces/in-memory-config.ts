/**
 * Interface for InMemoryBackend configuration options
 */
export abstract class InMemoryConfig {
    /**
     * 区分大小写
     */
    caseSensitiveSearch?: boolean;
    /**
     * false (default) put content directly inside the response body.
     * true: encapsulate content in a `data` property inside the response body, `{ data: ... }`.
     */
    dataEncapsulation?: boolean;
    /**
     * 延迟
     */
    delay?: number;
    /**
     * 相对路径
     */
    rootPath?: string;
}
