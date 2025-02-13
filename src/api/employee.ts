import request from '@/utils/request'
/**
 *
 * 员工管理
 *
 **/
// 登录
export const login = (data: any) =>
  request({
    'url': '/employee/login',
    'method': 'post',
    data: data
  })

  // 退出
 export const userLogout = (params: any) =>
 request({
   'url': `/employee/logout`,
   'method': 'post',
   params
 })

 export const getEmployeeList=(params: any)=>
  request({
    'url':'/employee/page',
    'method':'get',
    'params': params
  })

  export const enableOrDisableEmployee=(params: any)=>
    request({
      'url':`/employee/status/${params.status}`,
      'method':'POST',
      'params': {id:params.id}
    })
//add new emp
//请求体传参
    export const addEmployee=(params: any)=>
      request({
        'url':'/employee',
        'method':'POST',
        'data': params
      })
//根据id查询员工
      export const queryEmployeeById=(id:number)=>
        request({
          'url':`/employee/${id}`,
          'method':'get',

        })
//修改员工
        export const updateEmployee=(params: any)=>
          request({
            'url':'/employee',
            'method':'put',
            'data': params
          })
  
