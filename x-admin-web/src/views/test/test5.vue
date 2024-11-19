<template>
  <div style="position: relative;">
    <div>
      <h1 style="text-align: center;color: #42b983">人脸识别</h1>
      <h2 style="color: #42b983;position: absolute;top: 50px;left: 120px;">摄像头拍摄</h2>
      <video style="width: 400px;height: 400px;" ref="video" autoplay></video>
    </div>
    <el-button type="primary" @click="startRecognition">点击识别</el-button>
<!--    <el-button type="success" @click="continueRecognition">持续识别</el-button>-->
    <el-button type="danger" @click="stopRecognition">停止识别</el-button>
    <div style="width: 400px;height: 300px;border: red 1px solid;position: absolute;right: 0px;top: 100px;" >
       <img style="width: 100%;height: 100%;" :src="avatar">
    </div>

    <h2 style="position: absolute;right: 120px;top: 50px;color: #42b983">上传本地图片</h2>
    <el-upload style="display: inline-block; margin-left: 10px"
               action="http://localhost:9999/file/upload"
               :show-file-list="false"
               :accept="'jpg'"
               :on-success="handleAvatarSuccess"
    >
      <el-button style="position: absolute;right: 150px;top: 450px;" type="primary">上传图片</el-button>
    </el-upload>
    <h2 style="position: absolute;right: 47%;bottom: -50px;color: #42b983">对比结果</h2>
    <div ref="tisi" style="position: absolute;width: 400px;height: 200px;border: #1482f0 2px solid;right: 37.5%;bottom: -250px">
        <h3 style="color: orangered">匹配率：{{pipeilv}}</h3>
    </div>
  </div>
</template>
<script>
const newElement = document.createElement('h2');
import Request from "@/utils/request";
import axios from "axios";
export default {

  data() {
    return {
      videoStream: null,
      avatar: 'http://localhost:9999/file/e9f68afaa44e472c8a7c2a46af04aac9.jpg',
      pipeilv: 0
    };
  },
  mounted() {
    this.startCamera();
  },
  methods: {
    startCamera() {
      navigator.mediaDevices
        .getUserMedia({video: true})
        .then((stream) => {
          this.videoStream = stream;
          this.$refs.video.srcObject = stream;
          // 开始播放视频
          this.$refs.video.play();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    startRecognition() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // 设置canvas的宽高和视频流宽高一致
      canvas.width = this.$refs.video.videoWidth;
      canvas.height = this.$refs.video.videoHeight;
      // 绘制视频帧到canvas
      ctx.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
      // 获取截取的视频帧的base64 data URL
      const frameDataUrl = canvas.toDataURL('image/png');
      // 在控制台打印截取的视频帧的data URL
      console.log(frameDataUrl)
      let formData = new FormData();
      formData.append("base64", frameDataUrl);
      formData.append("localImageUrl",this.avatar)

      // 在这里编写人脸识别的逻辑
      Request.post('/video/torenlianshibie', formData).then(res => {
        console.log(res.split('#'))
        var ress = res.split('#');
        this.pipeilv = ress[1];
        if (ress[0] === 'true'){
          this.$message({
            message: "恭喜你，人脸识别成功啦！！",
            type: 'success'
          });
          newElement.textContent = '恭喜你，人脸识别成功啦！！！';
          newElement.style="color: green";
          this.$refs.tisi.appendChild(newElement);
        }else {
          this.$message.error('很遗憾，人脸识别失败，请重新面向摄像头识别！！！');
          newElement.textContent = '很遗憾，人脸识别失败，请重新面向摄像头识别！！！';
          newElement.style="color: red";
          this.$refs.tisi.appendChild(newElement);
        }
      })
    },
    stopRecognition() {
      // 在这里编写停止人脸识别的逻辑
      this.videoStream.getTracks()[0].stop();
    },
    handleAvatarSuccess(res) {
      console.log("测试照片"+res)
      this.avatar= res
    },
    // continueRecognition(){
    //     var i = 0;
    //     while (i < 50){
    //
    //     }
    // }
  },
};
</script>
