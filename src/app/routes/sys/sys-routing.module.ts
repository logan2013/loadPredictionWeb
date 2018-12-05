import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SysMenuComponent } from './menu/menu.component';
import { SysDictComponent } from './dict/dict.component';
import { SysOrgComponent } from './org/org.component';
import { SysOrgsComponent } from './orgs/orgs.component';
import { SysRoleComponent } from './role/role.component';
import { SysAclComponent } from './acl/acl.component';

const routes: Routes = [

  { path: 'menu', component: SysMenuComponent },
  { path: 'dict', component: SysDictComponent },
  { path: 'org', component: SysOrgComponent },
  { path: 'orgs', component: SysOrgsComponent },
  { path: 'role', component: SysRoleComponent },
  { path: 'acl', component: SysAclComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
