import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { PageParam } from 'app/model/pageParam';
import { LoggerService } from 'app/service/logger';
import { SysOrgsEditComponent } from './edit/edit.component';
import { NzMessageService } from 'ng-zorro-antd';
import { SysOrgsViewComponent } from './view/view.component';
import { Urls } from '@core/url';

export interface OrgParam {
  org?: any;
  orgTree?: any;
  orgDictType?: any;
}

@Component({
  selector: 'app-sys-orgs',
  templateUrl: './orgs.component.html',
})
export class SysOrgsComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    orgList: Urls.orgList, // 获取组织机构列表接口
    orgTree: Urls.orgTree, // 获取组织机构树结构接口
    orgDel: Urls.orgDel, // 删除组织机构接口
    orgDictList: Urls.orgDictList, // 获取组织机构类型字典接口
    orgSearch: Urls.orgSearch // 搜索组织机构接口
  };

  // 分页配置
  pageSet: STPage = {front: false, zeroIndexed: true}; // 分页配置（默认后台分页）
  pi = 0; // 默认的页码数
  ps = 10; // 默认的每页展示多少数据
  total: any; // 返回的菜单总数据个数

  // 数据接收
  orgData: any[] = []; // 返回组织信息列表
  orgTree: any[] = []; // 返回左侧组织机构树
  orgDictType: any; // 返回组织机构类型字典
  treeName: any; // 左侧搜索框输入参数（组织机构名）

  // sf配置
  searchSchema: SFSchema = {
    properties: {
      dsc: {
        type: 'string',
        title: '',
        ui: { placeholder: '机构名称、机构编码' }
      }
    }
  };

  // st配置
  @ViewChild('orgSt') orgSt: STComponent;
  columns: STColumn[] = [
    { title: '序号', type: 'no', className: 'text-center', width: '10%' },
    { title: '组织机构名称', index: 'title', className: 'text-center', width: '15%' },
    { title: '机构编码', index: 'code', className: 'text-center', width: '10%' },
    { title: '机构类型', index: 'dictOrgType.label', className: 'text-center', width: '10%' },
    { title: '电话号码', index: 'telephone', className: 'text-center', width: '15%' },
    { title: '地址', index: 'address', className: 'text-center', width: '15%' },
    {
      title: '操作',
      className: 'text-center',
      width: '25%',
      buttons: [
        {
          text: '查看',
          icon: { type: 'edit', theme: 'outline' },
          click: (record: any, modal: any) => {
            // 向组织机构新增、编辑子组件传递参数（org: 选中编辑的组织机构）
            const orgParam: OrgParam = { org: record};
            this.modal
              .createStatic(SysOrgsViewComponent, {orgParam})
                .subscribe((res: any) => {
            });
          }
        },
        {
          text: '编辑',
          icon: { type: 'edit', theme: 'outline' },
          click: (record: any, modal: any) => {
            // 向组织机构新增、编辑子组件传递参数（org: 选中编辑的组织机构；orgTree：组织机构树结构；orgDictType：组织机构类型字典）
            const orgParam: OrgParam = { org: record, orgTree: this.orgTree, orgDictType: this.orgDictType };
            this.modal
              .createStatic(SysOrgsEditComponent, {orgParam})
                .subscribe((res: any) => {
                  this.getData();
            });
          }
        },
        {
          text: '删除',
          type: 'del',
          popTitle: '确认删除此字典吗？',
          icon: { type: 'delete', theme: 'outline' },
          click: (record: any, modal: any) => {
            this.http.delete(this.apiUrl.orgDel + `${record.id}`)
              .subscribe((res: any) => {
                this.onSuccess(res, '删除成功');
                this.getData();
            }, (error: any) => {
              this.onError(error, '删除失败');
            });
          }
        }
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public log: LoggerService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    const pageParam: PageParam = { page: this.pi, size: this.ps };
    // 获取组织机构列表
    this.http.get(this.apiUrl.orgList, pageParam).subscribe((res: any) => {
      this.orgData = res.list;
      this.total = res.total;
    }, (error: any) => {
      this.onError(error);
    });
    // 获取左侧组织机构树
    this.http.get(this.apiUrl.orgTree).subscribe((res: any) => {
      this.orgTree = res;
    }, (error: any) => {
      this.onError(error);
    });
    // 获取组织机构类型字典
    this.http.get(this.apiUrl.orgDictList).subscribe((res: any) => {
      this.orgDictType = res;
    }, (error: any) => {
      this.onError(error);
    });
  }

  // 新建组织机构
  addOrg(event: any) {
    // 向组织机构新增、编辑子组件传递参数（org: 选中编辑的组织机构；dataTree：组织机构树结构）
    const orgParam: OrgParam = { org: event, orgTree: this.orgTree, orgDictType: this.orgDictType };
    this.modal
      .createStatic(SysOrgsEditComponent, {orgParam})
        .subscribe((res: any) => {
          // 因为存在树结构，所以创建成功则重新获取数据。（成功回调的对象暂时没想到办法加入到树结构数据中）
          this.getData();
          // res.pid = res.parent.id;
          // res.title = res.name;
          // res.dictOrgTypeId = res.dictOrgType.id;
          // this.orgData.push(res);
          // this.orgSt.reload();
        });
  }

  // 点击左侧树节点触发函数
  clickTreeName(event: any) {
    this.searchOrg(event.node.key);
  }

  // 在组织机构列表中搜索（通过组织机构名或编码）
  searchOrg(event: any) {
    const item = event.dsc ? event.dsc : event;
    const pageParam: PageParam = { page: this.pi, size: this.ps };
    this.http.get(this.apiUrl.orgSearch + item, pageParam).subscribe((res: any) => {
      this.orgData = res.list;
      this.total = res.total;
    }, (error: any) => {
      this.onError(error);
    });
  }

  // 重置组织机构列表
  resetOrg(event: any) {
    this.getData();
  }

  // 当前页码改变时的回调函数
  pageIndexChange(stChange: STChange) {
    const pageParam: PageParam = { page: stChange.pi - 1, size: stChange.ps };
    this.http.get(this.apiUrl.orgList, pageParam).subscribe((res: any) => {
      this.orgData = res.list;
      this.total = res.total;
    }, (error: any) => {
      this.onError(error);
    });
  }

  // 成功的回调函数
  onSuccess(res: any, dsc?: string) {
    this.msgSrv.success(dsc);
  }

  // 失败的回调函数
  onError(error: any, dsc?: string) {
    this.msgSrv.error(dsc);
  }

}
