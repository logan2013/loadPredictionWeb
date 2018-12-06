import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzFormatEmitEvent, NzMessageService } from 'ng-zorro-antd';
import { SysOrgEditComponent } from './edit/edit.component';
import { LoggerService } from 'app/service/logger';
import { PageParam } from 'app/model/pageParam';
import { SFSchema } from '@delon/form';
import { SysOrgViewComponent } from './view/view.component';
import { Urls } from '@core/url';

export interface TreeNodeInterface {
  id: number;
  title: string;
  code: string;
  type: string;
  telephone: string;
  fax: string;
  address: string;
  longitude: number;
  latitude: number;
  describe: string;
  level: number;
  expand: boolean;
  leaf: boolean;
  children?: TreeNodeInterface[];
}

export interface OrgParam {
  org?: any;
  orgTree?: any;
  orgDictType?: any;
}

@Component({
  selector: 'app-sys-org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.component.less'],
})
export class SysOrgComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    orgTreeNode: Urls.orgTreeNode, // 获取组织机构列表树形数据接口
    orgTree: Urls.orgTree, // 获取组织机构树结构接口
    orgDel: Urls.orgDel, // 删除组织机构接口
    orgDictList: Urls.orgDictList, // 获取组织机构类型字典接口
    orgSearch: Urls.orgSearch // 搜索组织机构接口
  };

  // 分页配置
  pi = 0; // 默认的页码数
  ps = 10; // 默认的每页展示多少数据
  total: any; // 返回的菜单总数据个数

  // 数据接收
  orgData: any[] = []; // 返回组织信息列表树形数据
  orgTree: any[] = []; // 返回左侧组织机构树
  orgDictType: any; // 返回组织机构类型字典
  treeName: any; // 左侧搜索框输入参数（组织机构名）
  expandDataCache = {};

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

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public log: LoggerService) {
    }

  ngOnInit() {
    this.getData();
  }

  getData() {
    const pageParam: PageParam = { page: this.pi, size: this.ps };
    // 获取组织机构列表树形数据信息
    this.http.get(this.apiUrl.orgTreeNode, pageParam).subscribe((res: any) => {
      this.orgData = res.list;
      this.total = res.total;
      this.orgData.forEach(item => {
        this.expandDataCache[ item.id ] = this.convertTreeToList(item);
      });
    });
    // 获取组织机构类型字典
    this.http.get(this.apiUrl.orgDictList).subscribe((res: any) => {
      this.orgDictType = res;
    });
    // 获取左侧组织机构树
    this.http.get(this.apiUrl.orgTree).subscribe((res: any) => {
      this.orgTree = res;
    });
  }
  // 折叠
  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }
  // 将组织机构信息转换成树结构
  convertTreeToList(root: object): TreeNodeInterface[] {
    const stack = [];
    const array = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });
    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[ i ], level: node.level + 1, expand: false, parent: node });
        }
      }
    }
    return array;
  }
  // 访问节点
  visitNode(node: TreeNodeInterface, hashMap: object, array: TreeNodeInterface[]): void {
    if (!hashMap[ node.id ]) {
      hashMap[ node.id ] = true;
      array.push(node);
    }
  }

  // 查看组织机构信息
  openView(org: any = {}) {
    // 向组织机构新增、编辑子组件传递参数（org: 选中编辑的组织机构）
    const orgParam: OrgParam = { org: org };
    this.modal
      .createStatic(SysOrgViewComponent, { orgParam })
        .subscribe((res: any) => {
    });
  }

  // 新增、编辑组织机构
  openEdit(org: any = {}) {
    // 向组织机构新增、编辑子组件传递参数（org: 选中编辑的组织机构；orgTree：组织机构树结构；orgDictType：组织机构类型字典）
    const orgParam: OrgParam = { org: org, orgTree: this.orgTree, orgDictType: this.orgDictType };
    this.modal
      .createStatic(SysOrgEditComponent, { orgParam })
      .subscribe(res => {
        if (org.id) {
          // 如果编辑了组织机构的上级，则重新获取组织机构信息
          if (org.pid !== res.pid) {
            this.getData();
          }
          org = Object.assign(org, res);
        } else {
          // 新增组织后，重新获取组织信息
          this.getData();
        }
      });
  }

  // 删除组织机构
  deleteOrg(record: any = {}) {
    this.http.delete(this.apiUrl.orgDel + `${record.id}`)
    .subscribe((res: any) => {
      // 删除组织机构后，重新获取组织机构信息
      this.onSuccess(res, '删除成功');
      this.getData();
    }, (error: any) => {
      this.onError(error, '删除失败');
    });
  }

  // 当前页码改变时的回调函数
  pageIndexChange(pi: number) {
    const pageParam: PageParam = { page: pi - 1, size: this.ps };
    this.http.get(this.apiUrl.orgTreeNode, pageParam).subscribe((res: any) => {
      this.orgData = res.list;
      this.total = res.total;
      this.orgData.forEach(item => {
        this.expandDataCache[ item.id ] = this.convertTreeToList(item);
      });
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
      this.orgData.forEach(org => {
        this.expandDataCache[ org.id ] = this.convertTreeToList(org);
      });
    }, (error: any) => {
      this.onError(error);
    });
  }

  // 重置组织机构列表
  resetOrg(event: any) {
    this.getData();
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
