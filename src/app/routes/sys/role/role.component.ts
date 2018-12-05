import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { LoggerService } from 'app/service/logger';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sys-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.less'],
})
export class SysRoleComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    roleTree: '/roleTree', // 获取角色树结构接口
    roleDel: '/roles/', // 删除角色接口
    aclTree: '/aclTree' // 获取权限树结构接口
  };

  // 数据接收
  roleTree: any[] = []; // 返回左侧菜单树
  aclTree: any[] = []; // 返回权限树
  isShow: boolean; // 显示、隐藏角色编辑框
  title: any; // 角色编辑框的标题名
  validateForm: FormGroup;

  @ViewChild('aclTreeCom') aclTreeCom;

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private fb: FormBuilder,
    public log: LoggerService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      id: [],
      name: [ '', [ Validators.required ]],
      acl: []
    });
    this.getData();
   }

  getData() {
     // 获取左侧角色树
    this.http.get(this.apiUrl.roleTree).subscribe((res: any) => {
      this.roleTree = res;
    });
    // 获取权限树
    this.http.get(this.apiUrl.aclTree).subscribe((res: any) => {
      this.aclTree = res;
    });
  }

   // 新增、编辑角色
  openEdit(event: any) {
    this.isShow = true;
    this.log.log(event, 'event的值', 'blue');
    if (!event.id) {
      this.title = '新增角色';
    } else {
      this.title = '编辑角色';
    }
    this.log.log(this.isShow, '编辑框的显示与隐藏', 'red');
  }

  clickTreeName(event: any) {
    this.log.log(event, '点击树节点 Checkbox 触发', 'red');
  }

  save() {
    this.aclTreeCom.getSelectedNodeList();
    this.log.log(this.aclTreeCom.getCheckedNodeList(), '获取组件 checkBox 被点击选中的节点', 'blue');
    this.log.log(this.validateForm.controls, 'value', 'red');
  }

}
