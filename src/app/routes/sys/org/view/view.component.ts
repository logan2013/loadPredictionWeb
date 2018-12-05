import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-sys-org-view',
  templateUrl: './view.component.html',
})
export class SysOrgViewComponent implements OnInit {
  @Input()
  orgParam: any = {}; // 接收组织机构父组件传过来的组织参数
  title: any; // 模态框标题

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
    this.title = this.orgParam.org.title;
  }

  close() {
    this.modal.destroy();
  }
}
