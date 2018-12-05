import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {
    res?: any;
    describe?: string;
    color?: string;

    constructor() {}

    // 输出打印内容（res: 打印对象，describe: 打印对象的描述，color: 描述颜色）
    log(res?: any, describe?: string, color?: string) {
        console.log('%c' + describe, 'color:' + color);
        console.log(res);
    }
}
