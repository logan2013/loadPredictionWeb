import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema } from '@delon/form';

@Component({
  selector: 'app-sys-dict-edit',
  templateUrl: './edit.component.html',
})
export class SysDictEditComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    dicts: '/dicts' // 增加、修改字典信息的接口
  };
  @Input()
  dict: any = {}; // 接收字典父组件传过来的字典参数
  title: any; // 模态框标题
  isLoading: any; // 加载状态

  // sf配置
  @ViewChild('sf') sf: SFComponent;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '字典名称', maxLength: 50 },
      type: { type: 'string', title: '字典类型'}
    },
    required: ['name', 'type'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
    if (!this.dict.id) {
      this.title = '新增字典';
    } else {
      this.title = '编辑 ' + this.dict.name + ' 信息';
    }
  }

  // 保存新增字典或编辑字典信息
  save(dict: any) {
    // 判断加载是否完成（true: 加载中；false: 加载完成）
    this.isLoading = true;
    if (dict.id !== undefined) {
      this.http.put(this.apiUrl.dicts, dict).subscribe((res: any) => {
        this.onSuccess(res, '修改成功');
      }, (error) => {
        this.onError(error, '修改失败');
      });
    } else {
      this.http.post(this.apiUrl.dicts, dict).subscribe((res: any) => {
        this.onSuccess(res, '创建字典成功');
      }, (error) => {
        this.onError(error, '创建字典失败');
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
