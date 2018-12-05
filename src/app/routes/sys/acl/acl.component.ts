import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzTreeNode, NzDropdownContextComponent, NzDropdownService,
  NzFormatEmitEvent, NzTreeComponent, NzMessageService } from 'ng-zorro-antd';
import { LoggerService } from 'app/service/logger';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sys-acl',
  templateUrl: './acl.component.html',
  styleUrls: ['./acl.component.less'],
})
export class SysAclComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    aclTree: '/aclTree', // 获取权限树结构接口
    buttons: '/buttons', // 增加、修改权限按钮的接口
    btnDel: '/buttons/', // 删除权限按钮的接口
  };

  // 数据接收
  @ViewChild('aclTreeCom') aclTreeCom: NzTreeComponent;
  aclTree: any[] = []; // 返回权限树
  dropdown: NzDropdownContextComponent;
  activedNode: NzTreeNode;
  isShowView: boolean; // 显示、隐藏权限查看信息
  isShowEdit: boolean; // 显示、隐藏权限编辑
  title: any; // 权限查看、编辑标题
  node: any; // 修改、删除、添加子项的节点
  validateForm: FormGroup;
  isLoading: any; // 加载状态

  constructor(
    private http: _HttpClient,
    private nzDropdownService: NzDropdownService,
    private fb: FormBuilder,
    public msgSrv: NzMessageService,
    public log: LoggerService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      id: [],
      name: [ '', [ Validators.required ]],
      acl: [ '', [ Validators.required ]],
      description: []
    });
    this.getData();
  }

  getData() {
    // 获取权限树
    this.http.get(this.apiUrl.aclTree).subscribe((res: any) => {
      this.aclTree = res;
      this.log.log(this.aclTree, '获取的权限树结构', 'red');
    });
  }

  // 查看权限信息
  aclView(data: NzFormatEmitEvent): void {
    this.log.log(data, '查看权限信息', 'red');
    this.activedNode = data.node;
    this.isShowView = true;
    this.isShowEdit = !this.isShowView;
    this.title = '查看 ' + this.activedNode.title + ' 信息';
    this.log.log(this.activedNode, 'activedNode', 'red');
  }

  // 添加子项（增加下级权限按钮或修改权限按钮）
  aclEidt(node: any) {
    this.isShowEdit = true;
    this.isShowView = !this.isShowEdit;
    if (node) {
        this.title = '编辑 ' + node.origin.title + ' 按钮权限';
        this.validateForm.setValue({
          id: node.origin.key,
          name : node.origin.title,
          acl: node.origin.acl,
          description: node.origin.description
        });
    } else {
        this.title = '新增 ' + this.node.title + ' 下按钮权限';
    }
    this.dropdown.close();
  }

  // 删除权限按钮
  aclDel(event: any, node: any) {
    this.dropdown.close();
    this.log.log(node, '删除参数', 'green');
    this.http.delete(this.apiUrl.btnDel + `${node.key}`)
    .subscribe((res: any) => {
      this.onSuccess(res, '删除成功', event);
    }, (error) => {
      this.onError(error, '删除失败', event);
    });
  }

  contextMenu(node: any, $event: MouseEvent, template: TemplateRef<void>): void {
      this.node = node;
      this.dropdown = this.nzDropdownService.create($event, template);
  }

  // 保存新增权限按钮或编辑权限按钮
  save(event: any, value: any) {
    this.log.log(this.node, 'node', 'red');
    this.isLoading = true;
    this.log.log(value, '编辑、保存的信息', 'green');
    if (value.id) {
      value.menuPid = this.node.origin.pid;
      this.http.put(this.apiUrl.buttons, value)
      .subscribe((res: any) => {
        this.onSuccess(res, '修改成功', event);
      }, (error) => {
        this.onError(error, '修改失败', event);
      });
    } else {
      value.menuPid = this.node.key;
      this.http.post(this.apiUrl.buttons, value)
      .subscribe((res: any) => {
        this.onSuccess(res, '创建权限按钮成功', event);
      }, (error) => {
        this.onError(error, '创建权限按钮失败', event);
      });
    }
  }

  // 重置
  reset(event: MouseEvent) {
    this.validateForm.reset();
  }

  // 成功的回调函数
  onSuccess(res: any, dsc?: string, event?: any) {
    this.isLoading = false;
    this.msgSrv.success(dsc);
    this.isShowView = false;
    this.isShowEdit = false;
    // 新建、编辑、删除成功重新获取数据
    this.getData();
  }

  // 失败的回调函数
  onError(error: any, dsc?: string, event?: any) {
    this.isLoading = false;
    this.msgSrv.error(dsc);

    event.preventDefault();
    // tslint:disable-next-line:forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsDirty();
      this.validateForm.controls[ key ].updateValueAndValidity();
    }
  }

}
