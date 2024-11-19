import request from '@/utils/request'

export default{
  getFileList(searchModel){
    return request({
      url: '/file/page',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        name: searchModel.name,
      }
    });
  },
  updateFile(row){
    return request({
      url: '/file/update',
      method: 'post',
      data: row
    });
  },
  deleteFileById(id){
    return request({
      url: `/file/${id}`,
      method: 'delete'
    });
  },
  delBatch(ids){
    return request({
      url: '/file/del/batch',
      data: ids,
      method: 'post'
    });
  }

}
