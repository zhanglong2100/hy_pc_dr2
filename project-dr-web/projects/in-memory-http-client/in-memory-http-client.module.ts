import {ModuleWithProviders, NgModule, Type} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CONFIGS_INTERCEPTORS, IN_MEMORY_DB_SERVICES_INTERCEPTORS, InMemoryConfig} from './interfaces';
import {InMemoryDbService} from './service/in-memory-db-service';
import {HttpClientInterceptor} from './service/http-client-interceptor';
import {InMemoryUtil} from './service/in-memory-util';
import {ReturnFormInterceptor} from './service/return-form-interceptor';


// export function SCROLL_SERVICE_PROVIDER_FACTORY(doc: Document, scrollService: NzScrollService): NzScrollService {
//     return scrollService || new NzScrollService(doc);
// }
@NgModule({
    imports: [
        HttpClientModule
    ],
})
export class InMemoryHttpClientModule {
    static forRoot(options?: InMemoryConfig, inType?: Type<InMemoryDbService>): ModuleWithProviders {
        return {
            ngModule: InMemoryHttpClientModule,
            providers: [
                InMemoryUtil,
                {
                    provide: IN_MEMORY_DB_SERVICES_INTERCEPTORS,
                    useClass: inType,
                    multi: true
                },
                {
                    provide: CONFIGS_INTERCEPTORS,
                    useValue: options,
                    multi: true
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: ReturnFormInterceptor,
                    multi: true
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HttpClientInterceptor,
                    multi: true
                }
            ]
        };
    }

    // static forRoot(options?: InMemoryBackendConfigArgs, inType?: Type<InMemoryDbService>): ModuleWithProviders {
    //     const a = [inType];
    //     return InMemoryHttpClientModule.forRootMulti(options, a);
    // }
    //
    // static forRootMulti(options: InMemoryBackendConfigArgs, inTypes: Array<Type<InMemoryDbService>>): ModuleWithProviders {
    //     const d = {
    //         ngModule: InMemoryHttpClientModule,
    //         providers: [
    //             InMemoryUtil,
    //             // {provide: InMemoryDbService, useClass: inType},
    //             {
    //                 provide: IN_MEMORY_DB_SERVICES_INTERCEPTORS,
    //                 useClass: inTypes[0],
    //                 multi: true
    //             },
    //             {provide: InMemoryBaseConfig, useValue: options},
    //             {
    //                 provide: HTTP_INTERCEPTORS,
    //                 useClass: ReturnFormInterceptor,
    //                 multi: true
    //             },
    //             {
    //                 provide: HTTP_INTERCEPTORS,
    //                 useClass: HttpClientInterceptor,
    //                 deps: [IN_MEMORY_DB_SERVICES_INTERCEPTORS, InMemoryBaseConfig, InMemoryUtil],
    //                 multi: true
    //             }
    //         ]
    //     };
    //     for (let i = 1; i < inTypes.length; i++) {
    //         const t: Type<InMemoryDbService> = inTypes[i];
    //         const c = {
    //             provide: IN_MEMORY_DB_SERVICES_INTERCEPTORS,
    //             useClass: t,
    //             multi: true
    //         };
    //         d.providers.splice(i, 0, c);
    //     }
    //     return d;
    // }
}
