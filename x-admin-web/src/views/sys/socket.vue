<template>
  <div>
      <h2>{{sun}}</h2>
  </div>
</template>
<script>
export default {
    name: 'socket',
    data() {
        return {
          sun: 0,
          websock: null
        }
      },
     created() {
       this.initWebSocket();
     },
     methods: {
       initWebSocket: function () { // 建立连接
         // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
         var socketUrl = "http://localhost:9999/websocket/" + 666;
         socketUrl = socketUrl.replace("https", "ws").replace("http", "ws");
         this.websock = new WebSocket(socketUrl);
         this.websock.onopen = this.websocketonopen;
         this.websock.send = this.websocketsend;
         this.websock.onerror = this.websocketonerror;
         this.websock.onmessage = this.websocketonmessage;
         this.websock.onclose = this.websocketclose;
       },
       // 连接成功后调用
       websocketonopen: function () {
         console.log("WebSocket连接成功!!!");
       },
       // 发生错误时调用
       websocketonerror: function (e) {
         console.log("WebSocket连接发生错误");
       },
       // 给后端发消息时调用
       websocketsend: function (e) {
         console.log("WebSocket连接发生错误");
       },
       // 接收后端消息
       // vue 客户端根据返回的cmd类型处理不同的业务响应
       websocketonmessage: function (e) {
         console.log(this.sun++)
       },
       // 关闭连接时调用
       websocketclose: function (e) {
         console.log("connection closed (" + e.code + ")");
       }
     }
   }
</script>
