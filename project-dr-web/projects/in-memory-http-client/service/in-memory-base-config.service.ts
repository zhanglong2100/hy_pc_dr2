import {Injectable} from '@angular/core';
import {InMemoryConfig} from '../interfaces';

/**
 *  InMemoryBackendService configuration options
 *  Usage:
 *    InMemoryHttpClientModule.forRoot(InMemHeroService, {delay: 600})
 *
 *  or if providing separately:
 *    provide(InMemoryBaseConfig, {useValue: {delay: 600}}),
 */
@Injectable()
export class InMemoryBaseConfig implements InMemoryConfig {
    constructor(config: InMemoryConfig = {}) {
        Object.assign(this, {
            // default config:
            caseSensitiveSearch: false,
            dataEncapsulation: false, // do NOT wrap content within an object with a `data` property
            delay: 500, // simulate latency by delaying response
            rootPath: undefined // default value is actually set in InMemoryBackendService ctor
        }, config);
    }
}
