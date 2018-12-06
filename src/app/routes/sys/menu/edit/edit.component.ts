import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, MenuService } from '@delon/theme';
import { SFComponent, SFSchema, FormProperty, PropertyGroup } from '@delon/form';
import { Urls } from '@core/url';

@Component({
  selector: 'app-sys-menu-edit',
  templateUrl: './edit.component.html',
})
export class SysMenuEditComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    menus: Urls.menus // 增加、修改菜单接口
  };
  @Input()
  menuParam: any; // 接收菜单父组件传过来的参数
  pid: string; // 上级菜单显示的值
  title: any; // 模态框标题
  isLoading: any; // 加载状态
  type: any; // 图标
  pidValid: any = true; // 控制是否隐藏pid的提示以及校验pid的值
  pidTip: string; // pid的提示信息

  // sf配置
  @ViewChild('sf') sf: SFComponent;
  schema: SFSchema = {
    properties: {
      pid:  { type: 'string', title: '上级菜单', ui: { widget: 'custom' } },
      text: { type: 'string', title: '菜单名称', maxLength: 50 },
      ico:  { type: 'string', title: '图标及样式', ui: { widget: 'custom', grid: { span: 1 } } },
      icon: { type: 'string', title: '', ui: { widget: 'custom', grid: { span: 23 } } },
      link: { type: 'string', title: '访问地址', ui: { grid: { span: 12 } } },
      acl:  { type: 'string', title: 'acl控制', ui: { grid: { span: 12 } } },
      sort: { type: 'number', title: '菜单顺序' }
    },
    required: ['text', 'sort', 'acl'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    private menuService: MenuService,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
    console.log(this.menuParam);
    if (!this.menuParam.menu.id) {
      this.title = '新增菜单';
    } else {
      this.title = '编辑 ' + this.menuParam.menu.text + ' 信息';
      this.type = this.menuParam.menu.icon.value;
      if (this.menuParam.menu.pid) {
        this.pid = this.menuParam.menu.pid;
      }
    }
  }

  // 修改图标的调用函数
  onIconChange(type: string) {
    this.type = type;
  }

  // 修改上级菜单pid值的调用函数
  onPidChange(pid: string) {
    this.pid = pid;
    const index = [];
    // 判断传入的menu是否有子菜单，有则把子菜单的id存入index数组
    if (this.menuParam.menu.children != null) {
      this.menuParam.menu.children.forEach(element => {
        index.push(element.id);
      });
    }
    // 选择的父菜单id等于传入的菜单id或者等于传入菜单子菜单中的id，则校验不通过
    if (pid === this.menuParam.menu.id) {
      this.pidTip = '*请勿选择自己为上级菜单！';
      this.pidValid = false;
    } else if (!index.indexOf(pid)) {
      this.pidTip = '*请勿选择自己的子菜单为上级菜单！';
      this.pidValid = false;
    } else {
      this.pidValid = true;
    }
  }

  // 保存新增菜单或编辑菜单信息
  save(menu: any) {
    // 判断加载是否完成（true: 加载中；false: 加载完成）
    this.isLoading = true;
    menu.pid = this.pid;
    menu.ico = this.type;
    menu.group = menu.pid == null ? true : false;
    if (menu.id !== undefined) {
      this.http.put(this.apiUrl.menus, menu).subscribe((res: any) => {
        this.onSuccess(res, '修改成功');
      }, (error) => {
        this.onError(error, '修改失败');
      });
    } else {
      this.http.post(this.apiUrl.menus, menu).subscribe((res: any) => {
        this.onSuccess(res, '创建菜单成功');
      }, (error) => {
        this.onError(error, '创建菜单失败');
      });
    }
  }

  // 成功的回调函数
  onSuccess(res: any, dsc?: string) {
    this.isLoading = false;
    this.menuService.resume();
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
