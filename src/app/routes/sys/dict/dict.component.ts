import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, DrawerHelper, DrawerHelperOptions } from '@delon/theme';
import { STColumn, STComponent, STData, STPage, STReq, STChange } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { SysDictEditComponent } from './edit/edit.component';
import { SysDictTypeComponent } from './dict-type/type.component';
import { NzMessageService, NzDrawerOptions } from 'ng-zorro-antd';
import { PageParam } from 'app/model/pageParam';
import { LoggerService } from 'app/service/logger';

@Component({
  selector: 'app-sys-dict',
  templateUrl: './dict.component.html',
  styleUrls: ['./dict.component.less'],

})
export class SysDictComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    dictList: '/dictList', // 获取字典列表接口
    dictDel: '/dicts/', // 删除字典接口
    dictSearch: '/dictSearch/' // 搜索字典接口
  };

  // 分页配置
  pageSet: STPage = {front: false, zeroIndexed: true}; // 分页配置（默认后台分页）
  pi = 0; // 默认的页码数
  ps = 10; // 默认的每页展示多少数据
  total: any; // 返回的菜单总数据个数

  // 数据接收
  dictData: any[] = []; // 返回字典信息列表

  // sf配置
  @ViewChild('sf') sf: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      dsc: {
        type: 'string',
        title: '',
        ui: { placeholder: '字典名称、字典类型' }
      }
    }
  };

  // st配置
  @ViewChild('dictSt') dictSt: STComponent;
  columnsDict: STColumn[] = [
    { title: '序号', type: 'no', className: 'text-center', width: '10%' },
    { title: '字典名称', index: 'name', className: 'text-center', width: '25%' },
    { title: '字典类型', index: 'type', className: 'text-center', width: '25%' },
    {
      title: '操作',
      className: 'text-center',
      width: '40%',
      buttons: [
        {
          text: '编辑',
          icon: { type: 'edit', theme: 'outline' },
          type: 'modal',
          acl: 'dict-edit',
          modal: { component: SysDictEditComponent, paramsName: 'dict' },
          click: (record: any, modal: any) => {
            record = Object.assign(record, modal);
            this.dictSt.reload();
          }
        },
        {
          text: '删除',
          type: 'del',
          acl: 'dict-del',
          popTitle: '确认删除此字典吗？',
          icon: { type: 'delete', theme: 'outline' },
          click: (record: any, modal: any) => {
            this.http.delete(this.apiUrl.dictDel + `${record.id}`)
              .subscribe((res: any) => {
                for (let i = 0; i < this.dictData.length; i++) {
                  if (record.id === this.dictData[i].id) {
                    this.dictData.splice(i, 1);
                  }
                }
              this.dictSt.removeRow(record);
              this.dictSt.reload();
              this.msgSrv.success('删除成功');
            });
          }
        },
        {
          text: ' 查看类型',
          icon: { type: 'search', theme: 'outline' },
          click: (dict: any) => {
            const drawerHelperOpt: DrawerHelperOptions = {size: 800};
            this.drawer
              .create(dict.name + '列表', SysDictTypeComponent, { dict }, drawerHelperOpt)
                .subscribe((res) => {
              });
          }
        }
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private drawer: DrawerHelper,
    public msgSrv: NzMessageService,
    public log: LoggerService
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    const pageParam: PageParam = { page: this.pi, size: this.ps };
    // 获取字典列表
    this.http.get(this.apiUrl.dictList, pageParam).subscribe((res: any) => {
      this.dictData = res.list;
      this.total = res.total;
    });
  }

  // 新增字典
  addDict(event: any) {
    this.modal
      .createStatic(SysDictEditComponent)
        .subscribe((res) => {
          this.dictData.push(res);
          this.dictSt.reload();
    });
  }

  // 在字典列表中搜索（通过字典铝管或字典类型）
  searchDict(item: any) {
    const pageParam: PageParam = { page: this.pi, size: this.ps };
    this.http.get(this.apiUrl.dictSearch + `${item.dsc}`, pageParam).subscribe((res: any) => {
      this.dictData = res.list;
      this.total = res.total;
    });
  }

  // 重置字典列表
  resetDict() {
    this.getData();
  }

  // 当前页码改变时的回调函数
  pageIndexChange(stChange: STChange) {
    const pageParam: PageParam = { page: stChange.pi - 1, size: stChange.ps };
    this.http.get(this.apiUrl.dictList, pageParam).subscribe((res: any) => {
      this.dictData = res.list;
      this.total = res.total;
    });
  }

}
