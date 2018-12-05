import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SysRoutingModule } from './sys-routing.module';
import { SysMenuComponent } from './menu/menu.component';
import { SysMenuEditComponent } from './menu/edit/edit.component';
import { SysDictComponent } from './dict/dict.component';
import { SysDictEditComponent } from './dict/edit/edit.component';
import { SysDictTypeComponent } from './dict/dict-type/type.component';
import { SysDictTypeEditComponent } from './dict/dict-type/edit/edit.component';
import { SysOrgComponent } from './org/org.component';
import { SysOrgEditComponent } from './org/edit/edit.component';
import { SysOrgsComponent } from './orgs/orgs.component';
import { SysOrgsEditComponent } from './orgs/edit/edit.component';
import { SysOrgsViewComponent } from './orgs/view/view.component';
import { SysOrgViewComponent } from './org/view/view.component';
import { SysMenuViewComponent } from './menu/view/view.component';
import { SysDictTypeViewComponent } from './dict/dict-type/view/view.component';
import { SysRoleComponent } from './role/role.component';
import { SysAclComponent } from './acl/acl.component';

const COMPONENTS = [
  SysMenuComponent,
  SysDictComponent,
  SysOrgComponent,
  SysOrgsComponent,
  SysRoleComponent,
  SysAclComponent];
const COMPONENTS_NOROUNT = [
  SysMenuEditComponent,
  SysDictEditComponent,
  SysDictTypeComponent,
  SysDictTypeEditComponent,
  SysDictTypeViewComponent,
  SysOrgEditComponent,
  SysOrgsEditComponent,
  SysOrgsViewComponent,
  SysOrgViewComponent,
  SysMenuViewComponent];

@NgModule({
  imports: [
    SharedModule,
    SysRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class SysModule { }
