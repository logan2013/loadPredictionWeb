import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { LoggerService } from 'app/service/logger';

@Component({
  selector: 'app-sys-menu-view',
  templateUrl: './view.component.html',
})
export class SysMenuViewComponent implements OnInit {
  @Input()
  menuParam: any = {}; // 接收菜单父组件传过来的菜单参数
  title: any; // 模态框标题

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public log: LoggerService
  ) { }

  ngOnInit(): void {
    this.title = this.menuParam.menu.text;
  }

  close() {
    this.modal.destroy();
  }
}
