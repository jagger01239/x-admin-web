import request from '@/utils/request'

export default{
  getUserList(searchModel){
    return request({
      url: '/user/list',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        username: searchModel.username,
        phone: searchModel.phone
      }
    });
  },
  addUser(user){
    return request({
      url: '/user/addUser',
      method: 'post',
      data: user
    });
  },
  updateUser(user){
    return request({
      url: '/user/updateUser',
      method: 'put',
      data: user
    });
  },
  saveUser(user){
    if(user.id == null && user.id == undefined){
      return this.addUser(user);
    }
    return this.updateUser(user);
  },
  getUserById(id){
    return request({
      url: `/user/getUserById/${id}`,
      method: 'get'
    });
  },
  deleteUserById(id){
    return request({
      url: `/user/deleteUserById/${id}`,
      method: 'delete'
    });
  },
  getUserByNameAndPassword(name,password){
    return request({
      url: `/user/getUserByNameAndPassword/${name}&${password}`,
      method: 'get'
    })
  }
  // ExportUsers() {
  //   return request({
  //     url: '/export',
  //     method: 'post'
  //   });
  // },
  // ImportUsers() {
  //   return request({
  //     url: '/import',
  //     method: 'post'
  //   });
  // }
}
