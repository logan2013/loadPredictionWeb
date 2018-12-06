const host = '';

export const Urls = {

    loginInit: host + '/init',   // 登陆初始化
    login: host + '/authenticate',  // 登陆

    users: host + '/users',  // 用户操作
    getUsers: host + '/users?type=2', // 获取用户

    info: host + '/info', // 启动应用时获取的信息接口

    menuTreeNode: host + '/menuTreeNode', // 获取菜单列表树形数据接口
    menuTree: host + '/menuTree', // 获取菜单树结构接口
    menuDel: host + '/menus/', // 删除菜单接口
    menuSearch: host + '/menuSearch/', // 搜索菜单接口
    menus: host + '/menus', // 增加、修改菜单接口

    orgTreeNode: host + '/orgTreeNode', // 获取组织机构列表树形数据接口
    orgTree: host + '/orgTree', // 获取组织机构树结构接口
    orgDel: host + '/orgs/', // 删除组织机构接口
    orgDictList: host + '/dictOrg', // 获取组织机构类型字典接口
    orgSearch: host + '/orgSearch/', // 搜索组织机构接口
    orgs: host + '/orgs', // 增加、修改组织机构接口
    orgList: host + '/orgList', // 获取组织机构列表接口

    dictList: host + '/dictList', // 获取字典列表接口
    dictDel: host + '/dicts/', // 删除字典接口
    dictSearch: host + '/dictSearch/', // 搜索字典接口
    dicts: host + '/dicts', // 增加、修改字典信息的接口

    dictTypeDel: host + '/dict-types/', // 删除字典类型接口
    dictTypes: host + '/dict-types', // 增加、修改字典类型的接口

    aclTree: host + '/aclTree', // 获取权限树结构接口
    buttons: host + '/buttons', // 增加、修改权限按钮的接口
    btnDel: host + '/buttons/', // 删除权限按钮的接口

    roleTree: host + '/roleTree', // 获取角色树结构接口
    roleDel: host + '/roles/', // 删除角色接口
    roles: host + '/roles', // 增加、修改角色的接口
};

