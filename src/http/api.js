import axios from 'axios';
import router from '../router';
import Qs from 'qs'
import * as QyConfig from './gc.config';

//当前端配置withCredentials=true时, 后端配置Access-Control-Allow-Origin不能为*, 必须是相应地址
axios.defaults.withCredentials = false;

axios.interceptors.request.use(
    config => {
        let token = sessionStorage.getItem("Authorization");
        if (token) {
            config.headers.Authorization = token;
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
);

axios.interceptors.response.use(function (response) {
    // Do something with response data
    console.log('响应体:',response);
    checkData(response);
    return response;
}, function (error) {
    // Do something with response error
    if (error.response.data.status === 401){
        router.push('/');
    }else{
        return Promise.reject(error);
    }
});

// 测试机
const BASE_URL = QyConfig.BASE_URL;
const COMMON_URL =QyConfig.COMMON_URL;

var flag = true;

function checkData(data) {
    if (data.status === 401){
        this.$router.push('/');
    }else {
        return data.data;
    }
}

/**
 * 封装get请求
 * @param url
 * @param params
 * @returns {Promise}
 */
function myGet(url, params) {
    return new Promise((resolve, reject) => {
        url = BASE_URL + url;
        axios.get(url, {
            params: params
        })
            .then(res => {
                let data = checkData(res);
                if (data !== false) {
                    resolve(data);
                }
            })
            .catch(err => {
                reject(err);
            })
    })
}

/**
 * 封装post请求
 * @param url
 * @param params
 * @returns {Promise}
 */
function myPost(url, params) {
    return new Promise((resolve, reject) => {
        url = BASE_URL + url;
        axios.post(url, params, {
        })
            .then(res => {
                let data = checkData(res);
                if (data !== false) {
                    resolve(data);
                }
            })
            .catch(err => {
                console.log(err);
            })
    })
}

function download(url, params) {
    let  loadUrl = BASE_URL + url;
    return axios.post(loadUrl, params, { responseType:'blob' });
}

/**
 * 封装表单提交post请求
 * @param url
 * @param params
 * @returns {Promise}
 */
function myFormDataPost(url, formdata) {
    return new Promise((resolve, reject) => {
        url = BASE_URL + url;
        axios.post(url,  Qs.stringify(formdata))
            .then(res => {
                let data = checkData(res);
                if (data !== false) {
                    resolve(data);
                }
            })
            .catch(err => {
                reject(err);
                console.log(err);
            })
    })
}

/**
 * 封装表单提交post请求
 * @param url
 * @param params
 * @returns {Promise}
 */
function myCommonPost(url, formdata) {
    return new Promise((resolve, reject) => {
        url = COMMON_URL + url;
        axios.get(url, formdata)
            .then(res => {
                let data = checkData(res);
                if (data !== false) {
                    resolve(data);
                }
            })
            .catch(err => {
                reject(err);
                console.log(err);
            })
    })
}

// ===============================================================================================================
// 登陆接口
export const login = params =>{
    return myPost('/admin/auth/ssoLogin',params)
};
// 退出接口
export const logout = params =>{
    return myGet('/admin/auth/logout',params)
};
// 用户列表
export const userList = params =>{
    return myPost('/admin/auth/user/list',params)
};
// 获取用户信息
export const getUserInfo = params =>{
    return myGet('/admin/auth/user/getUserInfo',params)
};
// 保存用户信息
export const saveUserInfo = params =>{
    return myPost('/admin/auth/user/edit',params)
};
// 更新密码
export const editPassword = params =>{
    return myPost('/admin/auth/user/editPassword',params)
};
// 删除用户信息
export const deleteUserInfo = params =>{
    return myGet('/admin/auth/user/deleteUser',params)
};
// 获取用户授权信息
export const getUserAuthMsg = params =>{
    return myGet('/admin/auth/user/getUserRoleByUserId',params)
};
//保存用户与角色关系
export const saveUserRole = params =>{
    return myPost('/admin/auth/user/saveUserRole',params)
};
// ============================角色管理===============================================
// 获取所有角色
export const getAllRole = params =>{
    return myGet('/admin/auth/role/all',params)
};
// 角色列表接口
export const roleList = params =>{
    return myPost('/admin/auth/role/list',params)
};
// 角色信息保存
export const roleSave = params =>{
    return myPost('/admin/auth/role/edit',params)
};
// 获取角色信息
export const getRoleInfo = params =>{
    return myGet('/admin/auth/role/view',params)
};
//删除角色信息
export const deleteRole = params =>{
    return myGet('/admin/auth/role/delete',params)
};
// 获取角色对应的用户信息
export const getUserByRoleId = params =>{
    return myGet('/admin/auth/role/getUserByRoleId',params)
};
//删除用户与角色关系
export const deleteUserRole = params =>{
    return myGet('/admin/auth/role/deleteUserRole',params)
};
// 根据用户ID查询用户
export const findUserByUserId = params =>{
    return myGet('/admin/auth/role/getStaffDetailByUserId',params)
};
//保存用户与角色关系
export const submitUserRole = params =>{
    return myPost('/admin/auth/role/submitUserRole',params)
};
//==============================菜单管理============================================
// 导航菜单
export const menuNav = params =>{
    return myGet('/admin/auth/menu/nav',params)
};
// 菜单列表
export const menuList = params =>{
    return myGet('/admin/auth/menu/tree',params)
};
// 保存菜单信息
export const saveMenu = params =>{
    return myPost('/admin/auth/menu/edit',params)
};
//获取菜单详情
export const menuInfo = params =>{
    return myGet('/admin/auth/menu/getMenuInfo',params)
};
//删除菜单
export const deleteMenuInfo = params =>{
    return myGet('/admin/auth/menu/delete',params)
};
//============================代码生成器=============================================
// 数据库列表
export const generatorList = params =>{
    return myPost('/admin/sys/generator/list',params)
};
// 生成代码
export const generatorCode = params =>{
    return download('/admin/sys/generator/code',params)
};
//============================字典管理=============================================
//字典类型列表
export const typeDictList = params =>{
    return myPost('/admin/sys/dict/type/list',params)
};
//保存字典类型
export const saveTypeDict = params =>{
    return myPost('/admin/sys/dict/type/save',params)
};
//获取字典类型信息
export const getTypeDictInfo = params =>{
    return myGet('/admin/sys/dict/type/getTypeInfo',params)
};
//删除字典类型
export const deleteTypeDict = params =>{
    return myGet('/admin/sys/dict/type/delete',params)
};
//字典项列表
export const dictList = params =>{
    return myPost('/admin/sys/dict/entry/list',params)
};
//保存字典项
export const saveDict = params =>{
    return myPost('/admin/sys/dict/entry/save',params)
};
//删除字典项
export const deleteDict = params =>{
    return myGet('/admin/sys/dict/entry/delete',params)
};
//获取字典项信息
export const getEntryInfo = params =>{
    return myGet('/admin/sys/dict/entry/getEntryInfo',params)
};
//刷新业务字典的缓存信息
export const reloadCache = params =>{
    return myGet('/admin/sys/dict/type/reloadCache',params)
};
//============================日志管理=============================================
// 列表数据
export const operationList = params =>{
    return myPost('/operationLog/list',params)
};
