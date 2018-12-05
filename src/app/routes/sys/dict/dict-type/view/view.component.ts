import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { LoggerService } from 'app/service/logger';

@Component({
  selector: 'app-sys-dict-type-view',
  templateUrl: './view.component.html',
})
export class SysDictTypeViewComponent implements OnInit {
  @Input()
  dictParam: any = {}; // 接收字典类型父组件传过来的字典类型参数
  title: any; // 模态框标题

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public log: LoggerService
  ) { }

  ngOnInit(): void {
    this.title = this.dictParam.dictType.label;
    this.log.log(this.dictParam, '字典类型父组件传过来的字典类型参数', 'red');
  }

  close() {
    this.modal.destroy();
  }
}
