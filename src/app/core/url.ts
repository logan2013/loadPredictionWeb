const host="api"

export const Urls={

    loginInit:host+'/init',   //登陆初始化
    login:host+'/authenticate',  //登陆


    users:host+'/users',  //用户操作
    getUsers:host+'/users?type=2', //获取用户


}
