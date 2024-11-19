<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input
            v-model="searchModel.name"
            placeholder="文件名"
            clearable>
          </el-input>
          <el-button
            @click="getFileList"
            type="primary"
            round
            icon="el-icon-search">查询
          </el-button>
          <el-button
            @click="delBatch"
            type="danger"
            round
            icon="el-icon-delete-solid">批量删除
          </el-button>

          <el-upload style="display: inline-block; margin-left:15px"
                     action="http://localhost:9999/file/upload"
                     :show-file-list="false"
                     :on-success="handleImportSuccess">
            <el-button
              type="success"
              round
              icon="el-icon-plus">新增文件
            </el-button>
          </el-upload>
        </el-col>
      </el-row>
    </el-card>


    <!-- 结果列表 -->
    <el-card>
      <el-table :data="fileList"  @selection-change="handleSelectionChange" stripe style="width: 100%">
        <el-table-column type="selection"  width="55">
        </el-table-column>
        <el-table-column prop="id" label="文件ID" width="180">
        </el-table-column>
        <el-table-column prop="name" label="文件名" width="180">
        </el-table-column>
        <el-table-column prop="type" label="文件类型" width="180">
        </el-table-column>
        <el-table-column prop="size" label="文件大小(kb)" width="180">
        </el-table-column>
        <el-table-column label="下载">
          <template slot-scope="scope">
             <el-button type="primary" @click="download(scope.row.url)">下载</el-button>
          </template>
        </el-table-column>
        <el-table-column label="预览">
          <template slot-scope="scope">
            <el-button type="warning" @click="preview(scope.row.url)">预览</el-button>
          </template>
        </el-table-column>
        <el-table-column label="启用">
            <template slot-scope="scope">
                <el-switch v-model="scope.row.enable" active-color="#13ce66" inactive-color="#CCC" @change="changeEnable(scope.row)"></el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="deleteFile(scope.row)" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import fileApi from "@/api/fileManage";

export default {
  data() {
    return {
      formLabelWidth: "130px",
      dialogFormVisible: false,
      title: "",
      total: 0,
      multipleSelection: [],
      searchModel: {
        pageNo: 1,
        pageSize: 5,
      },
      fileList: [],
    };
  },
  methods: {
    delBatch(){
      let ids = this.multipleSelection.map(v => v.id)  // [{}, {}, {}] => [1,2,3]
      this.$confirm(`您确认删除文件 ${ids} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => fileApi.delBatch(ids).then(res => {
        console.log(res)
        if (res.code == '20000') {
          this.$message.success("批量删除成功")
          this.getFileList()
        } else {
          this.$message.error("批量删除失败")
          this.getFileList()
        }
      }))
    },
    changeEnable(row){
      fileApi.updateFile(row).then(response =>{
        if (response.code == 20000){
          this.$message({
            type: "success",
            message: "修改成功啦！"
          })
        }else {
          this.$message({
            type: "error",
            message: "修改失败啦！"
          })
        }
      })
    },
    download(url){
      window.open(url);
    },
    handleImportSuccess(){
      this.$message({
        type: 'success',
        message: "导入成功啦！"
      })
      this.getFileList();
    },
    deleteFile(row){
      this.$confirm(`您确认删除文件 ${row.name} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fileApi.deleteFileById(row.id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          });
          this.getFileList();
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getFileList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getFileList();
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    getFileList() {
      fileApi.getFileList(this.searchModel).then((response) => {
        this.fileList = response.data.records;
        this.total = response.data.total;
      });
    },
    preview(url) {
      window.open('http://localhost:8012/onlinePreview?url=' + encodeURIComponent(window.btoa((url))))
    },
  },
  created() {
    this.getFileList();
  },
};

</script>

<style>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}
.el-dialog .el-input {
  width: 85%;
}
</style>
