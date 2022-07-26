import {InjectionToken} from '@angular/core';
import {InMemoryDbServices} from '../service/in-memory-db-service';
import {InMemoryBaseConfig} from '../index';

export const IN_MEMORY_DB_SERVICES_INTERCEPTORS =
    new InjectionToken<InMemoryDbServices>('IN_MEMORY_DB_SERVICES_INTERCEPTORS');
export const CONFIGS_INTERCEPTORS =
    new InjectionToken<InMemoryBaseConfig[]>('CONFIGS_INTERCEPTORS');
