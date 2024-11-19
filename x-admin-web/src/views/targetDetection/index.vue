<template>
  <div style="width: 100%;height: 100%;">
    <h1>目标检测</h1>

    <el-upload
      class="upload-demo"
      action="http://localhost:9999/file/upload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :on-success="handleUpload"
      list-type="picture">
      <el-button size="medium " type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip" style="font-size: 15px;font-width: 300px;">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>

    <el-button  size="medium " type="success" style="margin-top: 100px" @click="startJiance">开始检测</el-button>
    <h2>检测结果</h2>
    <el-progress :text-inside="true" :stroke-width="24" :percentage=percentage status="success" style="width: 500px"></el-progress>
    <Carousel :items="items" :interval="interval" style="height: 700px;width: 500px;margin-top: 30px;" />

  </div>

</template>

<script>
import Carousel from '../../components/lunbotu'
import Request from "@/utils/request";
export default {
  name: 'targetDetection',
  components:{
    Carousel
  },
  data() {
    return {
      percentage: 0,
      fileList: [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ],
      items: [
        {
          image: 'https://picsum.photos/800/400?random=1',
        },
      ],
      interval: 5000000
    }
  },created() {
    this.fileList = []
    this.items = []
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log("浏览")
      console.log(file);
    },
    handleUpload(response, file){
      console.log(file)
      this.fileList.push({name: file.name,url: file.response})
    },
    startJiance(){
      if (this.fileList.length==0){
          this.$message.error("请上传照片！！")
      }else{
        this.percentage = 30;
        var str = "";
        for (var i=0;i < this.fileList.length;i++){
          if (i != this.fileList.length-1)
            str = str + this.fileList[i].url + "#";
          else
            str = str + this.fileList[i].url
        }
        this.percentage = 50;
        let formData = new FormData();
        formData.append("content", str);
        Request.post('/jiance/startjiance',formData).then(res => {
          console.log(res)
          this.percentage = 80;
          var ress = res.split('@')
          for (var j=0;j<ress.length;j++){
            this.items.push({image: ress[j]})
          }
          this.percentage = 100;
        })
      }
    }
  }
}
</script>
