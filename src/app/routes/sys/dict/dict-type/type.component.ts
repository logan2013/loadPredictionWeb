import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STComponent, STColumn } from '@delon/abc';
import { SysDictTypeEditComponent } from './edit/edit.component';
import { SysDictTypeViewComponent } from './view/view.component';

export interface DictParam {
  dict?: any;
  dictType?: any;
}

@Component({
  selector: 'app-sys-dict-type',
  templateUrl: './type.component.html',
})
export class SysDictTypeComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    dictTypeDel: '/dict-types/' // 删除字典接口
  };
  @Input()
  dict: any = {}; // 接收字典父组件传过来的字典参数
  @ViewChild('dictTypeSt') dictTypeSt: STComponent;
  columnsDictType: STColumn[] = [
    { title: '序号', type: 'no', className: 'text-center', width: '10%' },
    { title: '类型名称', index: 'label', className: 'text-center', width: '20%' },
    { title: '类型编码', index: 'value', className: 'text-center', width: '20%' },
    { title: '类型顺序', index: 'sort', className: 'text-center', width: '20%' },
    {
      title: '操作',
      className: 'text-center',
      width: '30%',
      buttons: [
        {
          text: '查看',
          icon: { type: 'edit', theme: 'outline' },
          // type: 'modal',
          // modal: { component: SysDictTypeViewComponent, paramsName: 'dictType' },
          click: (record: any, modal: any) => {
            // 向字典查看类型子组件传递参数（dict: 字典信息；dictType: 选中的字典类型信息）
            const dictParam: DictParam = { dict: this.dict, dictType: record};
            this.modal
              .createStatic(SysDictTypeViewComponent, {dictParam})
                .subscribe((res: any) => {
            });
          }
        },
        {
          text: '编辑',
          icon: { type: 'edit', theme: 'outline' },
          type: 'modal',
          modal: { component: SysDictTypeEditComponent, paramsName: 'dictType' },
          click: (record: any, modal: any) => {
            modal.dictPid = record.dictType;
            record = Object.assign(record, modal);
            this.dict.children.sort(this.compare);
            this.dictTypeSt.reload();
          }
        },
        {
          text: '删除',
          type: 'del',
          popTitle: '确认删除此类型吗？',
          icon: { type: 'delete', theme: 'outline' },
          click: (record: any) => {
            this.http.delete(this.apiUrl.dictTypeDel + `${record.id}`)
            .subscribe((res: any) => {
              for (let i = 0; i < this.dict.children.length; i++) {
                if (record.id === this.dict.children[i].id) {
                  this.dict.children.splice(i, 1);
                }
              }
              this.dictTypeSt.removeRow(record);
              this.dictTypeSt.reload();
              this.msgSrv.success('删除成功');
            }, (error: any) => {
              this.msgSrv.success('删除失败');
            });
          }
        }
      ]
    }
  ];

  constructor(
    private ref: NzDrawerRef,
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
  }

  // 新增字典类型
  addDictType() {
    const dictPid = this.dict.id; // 将字典类型父id传入字典类型edit组件
    this.modal
      .create( SysDictTypeEditComponent, {dictPid} )
      .subscribe((res) => {
        if (this.dict.children) {
          this.dict.children.push(res);
        } else {
          this.dict.children = [];
          this.dict.children.push(res);
        }
        this.dictTypeSt.reload();
    });
  }

  // 新增字典类型后，根据sort重新排序
  compare(obj1: any, obj2: any) {
    let val1 = obj1.sort;
    let val2 = obj2.sort;
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
        return -1;
    } else if (val1 > val2) {
        return 1;
    } else {
        return 0;
    }
  }

  close() {
    this.ref.close();
  }

}
