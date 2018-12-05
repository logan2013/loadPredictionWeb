import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { LoggerService } from 'app/service/logger';

@Component({
  selector: 'app-sys-org-edit',
  templateUrl: './edit.component.html',
})
export class SysOrgEditComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    orgs: '/orgs' // 增加、修改组织机构接口
  };
  @Input()
  orgParam: any = {}; // 接收组织机构父组件传过来的组织参数
  pid: string; // 上级菜单显示的值
  title: any; // 模态框标题
  isLoading: any; // 加载状态
  pidValid: any = true; // 控制是否隐藏pid的提示以及校验pid的值
  pidTip: string; // pid的提示信息

  // sf配置
  @ViewChild('sf') sf: SFComponent;
  schema: SFSchema = {
    properties: {
      pid:   { type: 'string', title: '上级机构', ui: { widget: 'custom' } },
      title: { type: 'string', title: '机构名称', maxLength: 50, ui: { grid: { span: 12 } }  },
      dictOrgTypeId:  { type: 'string',
                           title: '机构类型',
                           ui: { widget: 'select', grid: { span: 12 } },
                           default: 'null',
                           enum: []
                          },
      telephone: { type: 'string', title: '电话', ui: { grid: { span: 12 } } },
      fax: { type: 'string', title: '传真', ui: { grid: { span: 12 } } },
      longitude: { type: 'string', title: '经度', ui: { grid: { span: 12 } } },
      latitude: { type: 'string', title: '纬度', ui: { grid: { span: 12 } } },
      address: { type: 'string', title: '机构地址', ui: { grid: { span: 12 } } },
      code: { type: 'string', title: '行政编码', ui: { grid: { span: 12 } } },
      description: { type: 'string', title: '机构描述', ui: { widget: 'textarea', autosize: { minRows: 2, maxRows: 6 } } }
    },
    required: ['title', 'dictOrgTypeId', 'telephone', 'longitude', 'latitude', 'address', 'code'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    public log: LoggerService
  ) {}

  ngOnInit(): void {
    this.setOrgTypeAndTitle();
  }

  // 设置组织机构字典类型及模态框标题
  setOrgTypeAndTitle() {
    this.schema.properties.dictOrgTypeId.enum = this.orgParam.orgDictType.children;
    if (!this.orgParam.org.id) {
      this.title = '新增组织机构';
    } else {
      this.title = '编辑 ' + this.orgParam.org.title + ' 信息';
      this.schema.properties.dictOrgTypeId.default = this.orgParam.org.dictOrgType.value;
      if (this.orgParam.org.pid) {
        this.pid = this.orgParam.org.pid;
      }
    }
  }

  // 修改上级组织机构pid值的调用函数
  onPidChange(pid: string) {
    this.pid = pid;
    const index = [];
    // 判断传入的org是否有子组织，有则把子组织的id存入index数组
    if (this.orgParam.org.children != null) {
      this.orgParam.org.children.forEach(element => {
        index.push(element.id);
      });
    }
    // 选择的父组织id等于传入的组织id或者等于传入组织子组织中的id，则校验不通过
    if (pid === this.orgParam.org.id) {
      this.pidTip = '*请勿选择自己为上级组织！';
      this.pidValid = false;
    } else if (!index.indexOf(pid)) {
      this.pidTip = '*请勿选择自己的子组织为上级组织！';
      this.pidValid = false;
    } else {
      this.pidValid = true;
    }
  }

  // 保存新增组织或编辑组织信息
  save(org: any) {
    // 判断加载是否完成（true: 加载中；false: 加载完成）
    this.isLoading = true;
    org.pid = this.pid;
    org.group = org.pid == null ? true : false;
    this.orgParam.orgDictType.children.forEach(element => {
      if (org.dictOrgTypeId === element.value) {
        org.dictOrgTypeId = element.id;
      }
    });
    if (org.id !== undefined) {
      this.http.put(this.apiUrl.orgs, org).subscribe((res: any) => {
        this.onSuccess(res, '修改成功');
      }, (error) => {
        this.onError(error, '修改失败');
      });
    } else {
      this.http.post(this.apiUrl.orgs, org).subscribe((res: any) => {
        this.onSuccess(res, '创建组织成功');
      }, (error) => {
        this.onError(error, '创建组织失败');
      });
    }
  }

  // 成功的回调函数
  onSuccess(res: any, dsc?: string) {
    this.isLoading = false;
    this.msgSrv.success(dsc);
    this.modal.close(res);
  }

  // 失败的回调函数
  onError(error: any, dsc?: string) {
    this.isLoading = false;
    this.msgSrv.error(dsc);
    this.modal.close();
  }

  close() {
    this.modal.destroy();
  }
}
