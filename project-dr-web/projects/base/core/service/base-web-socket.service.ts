import {Injectable} from '@angular/core';
import {BaseWebSocket} from './base-web-socket';

@Injectable({
    providedIn: 'root'
})
export class BaseWebSocketService {
    constructor() {
    }


    public connect(url): BaseWebSocket {
        const wsc: BaseWebSocket = new BaseWebSocket();
        wsc.connect(url);
        return wsc;
    }

    public create(): BaseWebSocket {
        const wsc: BaseWebSocket = new BaseWebSocket();
        return wsc;
    }

}
