import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema } from '@delon/form';
import { Urls } from '@core/url';

@Component({
  selector: 'app-sys-dict-type-edit',
  templateUrl: './edit.component.html',
})
export class SysDictTypeEditComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    dictTypes: Urls.dictTypes // 增加、修改字典信息的接口
  };
  @Input()
  dictType: any = {}; // 接收字典类型父组件传过来的字典类型参数
  @Input()
  dictPid: string; // 接收字典类型父组件传过来的字典id
  title: any; // 模态框标题
  isLoading: any; // 加载状态
  @ViewChild('sf') sf: SFComponent;
  schema: SFSchema = {
    properties: {
      label: { type: 'string', title: '类型名称', maxLength: 50 },
      value: { type: 'string', title: '类型编码' },
      sort: { type: 'number', title: '类型顺序' }
    },
    required: ['label', 'value', 'sort'],
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
    if (!this.dictType.id) {
      this.title = '新增字典类型';
    } else {
      this.title = '编辑 ' + this.dictType.label + ' 信息';
    }
  }

  // 保存新增字典或编辑字典信息
  save(dictType: any) {
    if (!dictType.dictPid) {
      dictType.dictPid = this.dictPid;
    }
    if (dictType.dictParent) {
      dictType.dictPid = dictType.dictParent.id;
    }
    // 判断加载是否完成（true: 加载中；false: 加载完成）
    this.isLoading = true;
    if (dictType.id !== undefined) {
      this.http.put(this.apiUrl.dictTypes, dictType).subscribe((res: any) => {
        this.isLoading = false;
        this.msgSrv.success('修改成功');
        this.modal.close(res);
      }, (error) => {
        this.isLoading = false;
        this.msgSrv.error('修改失败');
        this.modal.close(error);
      });
    } else {
      this.http.post(this.apiUrl.dictTypes, dictType).subscribe((res: any) => {
        this.isLoading = false;
        this.msgSrv.success('创建字典类型成功');
        this.modal.close(res);
      }, (error) => {
        this.isLoading = false;
        this.msgSrv.error('创建字典类型失败');
        this.modal.close(error);
      });
    }
  }

  close() {
    this.modal.destroy();
  }
}
