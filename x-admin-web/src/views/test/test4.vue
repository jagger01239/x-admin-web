<template>
  <body>
  <div class="mainbox">
    <div class="cloumn">
      <div class="panel year" style="height: 33%">
        <h2 style="font-size: 25px">班级签到率</h2>
        <div id="chartPie1" class="chart" style="height: 100%"></div>
        <div class="panel-footer"></div>
      </div>
      <div class="panel month" style="height: 33%">
        <h2 style="font-size: 25px">出勤率</h2>
        <div id="chartColumn2" class="chart" style="height: 100%"></div>
        <div class="panel-footer"></div>
      </div>
      <div class="panel week" style="height: 33%">
        <h2 style="font-size: 25px">学生登录情况</h2>
        <div id="chartLine" class="chart" style="height: 100%"></div>
        <div class="panel-footer"></div>
      </div>
    </div>
    <div class="cloumn">

      <!-- no模块制作 -->
      <div class="no" style="height: 25%">
        <div class="no-hd" style="margin-top: 0px">
          <ul>
            <li id="yeardata">{{ websocketdatas.yeardata }}</li>
            <li id="monthdata">{{ websocketdatas.monthdata }}</li>
          </ul>
        </div>
        <div class="no-bd no-bd1">
          <ul>
            <li style="font-size: 25px">本年度实训人数</li>
            <li style="font-size: 25px">本月实训人数</li>
          </ul>
        </div>
        <div class="no-hd no-hd1">
          <ul>
            <li id="weekdata">{{ websocketdatas.weekdata }}</li>
            <li id="todaydata">{{ websocketdatas.daydata }}</li>
          </ul>
        </div>
        <div class="no-bd">
          <ul>
            <li style="font-size: 25px">本周实训人数</li>
            <li style="font-size: 25px">今日实训人数</li>
          </ul>
        </div>
      </div>
      <!-- 地图模块 -->
      <div class="map" style="height: 100%;">
        <div class="map_panel">
          <div id="chartBar" class="chart" style="margin-top: 50px;width: 70%;height: 560px;left: 115px"></div>
          <div style="height: 100px;color: #ffeb7b;font-size: 40px;text-align: center;font-family:  electronicFont;">
            <div style="height: 60px;margin-top: -25px"></div>
          </div>
        </div>
      </div>


    </div>
    <div class="cloumn">
      <div class="panel use-rate" style="height: 33%">
        <h2 style="font-size: 25px">教学工具使用比率</h2>
        <div id="chartPie" class="chart" style="height: 100%"></div>
        <div class="panel-footer"></div>
      </div>
      <div class="panel test-rate" style="height: 33%">
        <h2 style="font-size: 25px">安全测试通过率</h2>
        <div id="chartColumn7" class="chart" style="height: 100%"></div>
        <div class="panel-footer"></div>
      </div>
      <div class="panel use-time" style="height: 33%">
        <h2 style="font-size: 25px">课程教学进度</h2>
        <div id="chartColumn8" class="chart" style="height: 90%;margin-top: 40px"></div>
        <div class="panel-footer"></div>
      </div>
    </div>
  </div>
  </body>

</template>
<script>
import axios from "axios";
import * as echarts from "echarts";
import Request from "@/utils/request";
//import echarts from "echarts";
// import { onMounted, getCurrentInstance } from "vue";
export default {
  data() {
    return {
      liststudent: [],
      gname: "无",
      websock: null,
      websocketdatas: {
          qiandao: 0,
          noqiandao: 0,
          qinjia: 0,
          chuqin1: 0,
          chuqin2: 0,
          chuqin3: 0,
          logindata: [],
          loginmonth: [],
          yeardata: 0,
          monthdata: 0,
          weekdata: 0,
          daydata: 0,
          cepingyou: 0,
          cepingliang: 0,
          cepinghege: 0,
          cepingnohege: 0,
          jichuang1: 0,
          jichuang2: 0,
          jichuang3: 0,
          aqpass1: 0,
          aqpass2: 0,
          aqpass3: 0,
          jihua: [],
          wanceng: [],
          nowanceng: [],
      },
      chartColumn: null,
      chartBar: null,
      chartLine: null,
      chartPie: null,
      chartPie1: null,
      chartColumn7: null,
      xAx: [],
      yAy: [],
      data: [],
      timer: null,
      tLoading: true,
      // back
      background: {
        // 背景图片地址
        backgroundImage: "url(" + require("../../images/bg.jpg") + ")",
        // 背景图片是否重复
        backgroundRepeat: "no-repeat",
        // 背景图片大小
        backgroundSize: "cover",
        // 背景颜色
        backgroundColor: "#000",
        // 背景图片位置
        backgroundPosition: "center top",
      },
    };
  },
  created() {
    this.initWebSocket();
  },
  methods: {
    initWebSocket: function () { // 建立连接
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      var socketUrl = "http://localhost:9999/websocket/" + 777;
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
    websocketonmessage: function (e) {
       var res = JSON.parse(e.data);
        this.websocketdatas.qiandao = res.qiandao;
        this.websocketdatas.noqiandao = res.noqiandao;
        this.websocketdatas.qinjia = res.qinjia;
        this.websocketdatas.chuqin1 = res.chuqin1;
        this.websocketdatas.chuqin2 = res.chuqin2;
        this.websocketdatas.chuqin3 = res.chuqin3;
        this.websocketdatas.loginmonth = [1,2,3,4,5,6,7,8,9,10,11,12];
        this.websocketdatas.logindata = res.logindata;
        this.websocketdatas.yeardata = res.yeardata;
        this.websocketdatas.monthdata =res.monthdata;
        this.websocketdatas.weekdata =res.weekdata;
        this.websocketdatas.daydata =res.daydata;
        this.websocketdatas.cepingyou = res.cepingyou;
        this.websocketdatas.cepingliang = res.cepingliang;
        this.websocketdatas.cepinghege = res.cepinghege;
        this.websocketdatas.cepingnohege = res.cepingnohege;
        this.websocketdatas.jichuang1 = res.jichuang1;
        this.websocketdatas.jichuang2 = res.jichuang2;
        this.websocketdatas.jichuang3 = res.jichuang3;
        this.websocketdatas.aqpass1 = res.aqpass1;
        this.websocketdatas.aqpass2 = res.aqpass2;
        this.websocketdatas.aqpass3 = res.aqpass3;
      this.websocketdatas.jihua = res.jihua;
      this.websocketdatas.wanceng = res.wanceng;
      this.websocketdatas.nowanceng = res.nowanceng;
      this.getdata1();
      this.getdata2();
      this.getDataList3();
      this.getDataList5();
      this.getDataList6();
      this.getDataList77();

    },
    // 关闭连接时调用
    websocketclose: function (e) {
      console.log("connection closed (" + e.code + ")");
    },
    getdata1() {
        var person = new Object();
        person.name = "已签到";
        person.value = this.websocketdatas.qiandao;
        var person2 = new Object();
        person2.name = "未签到";
        person2.value = this.websocketdatas.noqiandao;
        var person3 = new Object();
        person3.name = "请假";
        person3.value = this.websocketdatas.qinjia;
        let arr = new Array(3);
        arr[0] = person;
        arr[1] = person2;
        arr[2] = person3;
        this.data = arr;
        this.drawPieChart1();
        this.tLoading = false;
    },
    async getdata2() {
      let arr = new Array(5);
      arr[0] = this.websocketdatas.chuqin1;
      arr[1] = this.websocketdatas.chuqin2;
      arr[2] = this.websocketdatas.chuqin3;
      this.data = arr;
      this.drawLine2();
      this.tLoading = false;
    },

    async getDataList3() {
        this.drawLineChart();
        this.tLoading = false;
    },
    getDataList5() {
        var person2 = new Object();
        person2.name = "优秀";
        person2.value = this.websocketdatas.cepingyou;
        var person3 = new Object();
        person3.name = "良好";
        person3.value = this.websocketdatas.cepingliang;
        var person4 = new Object();
        person4.name = "合格";
        person4.value = this.websocketdatas.cepinghege;
        var person5 = new Object();
        person5.name = "不合格";
        person5.value = this.websocketdatas.cepingnohege;
        let arr = new Array(4);
        arr[0] = person2;
        arr[1] = person3 ;
        arr[2] = person4;
        arr[3] = person5;
        this.data = arr;
        this.drawBarChart();
    },
    getDataList6() {
        var person = new Object();
        person.name = "维修中";
        person.value = this.websocketdatas.jichuang1;
        var person2 = new Object();
        person2.name = "实训中";
        person2.value = this.websocketdatas.jichuang2;
        var person3 = new Object();
        person3.name = "空闲";
        person3.value = this.websocketdatas.jichuang3;
        let arr = new Array(3);
        arr[0] = person;
        arr[1] = person2;
        arr[2] = person3;
        this.data = arr;
        this.drawPieChart();
        this.tLoading = false;
    },

    getDataList77() {
        let arr = new Array(3);
        arr[0] = this.websocketdatas.aqpass1;
        arr[1] = this.websocketdatas.aqpass2;
        arr[2] = this.websocketdatas.aqpass3;
        this.data = arr;
        this.drawColumnChart7();
        this.drawColumnChart8();
    },

    drawLine2() {
      this.chartyibiaopan = echarts.init(
        document.getElementById("chartColumn2")
      );
      this.chartyibiaopan.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          //修改图表的大小
          left: "0%",
          right: "10px",
          bottom: "4%",
          top: "40px",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["2103", "2022", "2104"],
            axisTick: {
              alignWithLabel: true,
            },
            //修改刻度标签相关样式
            axisLabel: {
              color: "rgba(255,255,255,.7)",
              fontSize: "18",
            },
            axisLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            max:100,
            axisLabel: {
              formatter: "{value} H",
            },
            nameTextStyle: {
              color: "#fff",
              verticalAlign: "top",
            },
            //修改刻度标签相关样式
            axisLabel: {
              color: "rgba(255,255,255,.7)",
              fontSize: "18",
            },

            //y轴的线条的样式
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)",
                width: 2,
              },
            },
            //更改y轴分割线
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)",
                width: 1,
              },
            },
          },
        ],
        series: [
          {
            // name: '使用时间',
            type: "bar",
            barWidth: "30%",
            data: this.data,

            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "rgba(255,255,255,.7)",
              },
            },
            itemStyle: {
              normal: {
                barBorderRadius: 4,
                color: "#4ad2ff",
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "rgba(255,255,255,.7)",
                  },
                },
              },
            },
          },
        ],
      });
    },
    drawLineChart() {
      this.chartLine = echarts.init(document.getElementById("chartLine"));
      this.chartLine.setOption({
        title: {
          x: "left",
        },

        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          //修改图表的大小
          left: "0%",
          right: "10px",
          bottom: "4%",
          top: "40px",
          containLabel: true,
        },

        xAxis: {
          axisLabel: {
            interval: 0,
          },

          data: this.websocketdatas.loginmonth,
          axisTick: {
            alignWithLabel: true,
          },
          //修改刻度标签相关样式
          axisLabel: {
            color: "rgba(255,255,255,.7)",
            fontSize: "18",
          },
          axisLine: {
            show: false,
          },
        },

        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} H",
          },
          nameTextStyle: {
            color: "#fff",
            verticalAlign: "top",
          },
          //修改刻度标签相关样式
          axisLabel: {
            color: "rgba(255,255,255,.7)",
            fontSize: "18",
          },

          //y轴的线条的样式
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)",
              width: 2,
            },
          },
          //更改y轴分割线
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)",
              width: 1,
            },
          },
        },
        series: [
          {
            name: "登录总数",
            type: "line",
            stack: "总量",
            // data: [0, 670, 2400, 2430, 2560, 2360, 120, 160, 2670, 2430, 680, 0],
            data: this.websocketdatas.logindata,
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "rgba(255,255,255,.7)",
              },
            },
            itemStyle: {
              normal: {
                barBorderRadius: 4,
                color: "#FE8463",
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "rgba(255,255,255,.7)",
                  },
                },
              },
            },
          },
        ],
      });
    },

    drawBarChart() {
      this.chartBar = echarts.init(document.getElementById("chartBar"));
      this.chartBar.setOption({
        tooltip: {
          trigger: "item",
        },
        // 标题
        title: [{
          text: '教学质量评测',
          top: '0%',
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 30,
          }
        }],
        legend: {
          top: "9%",
          left: "center",
          textStyle: {                      // 图例的公用文本样式。
            fontSize: 23,
            color: '#fff'
          },
          data: ["优秀", "良好", "合格","不合格"],
        },
        series: [
          {
            name: "评测分数",
            type: "pie",
            top: "12%",
            radius: ["45%", "86%"],
            avoidLabelOverlap: false,
            data: this.data,
            itemStyle: {
              borderRadius: 10,
              normal: {
                color: function (params) {
                  //自定义颜色
                  var colorList = ["#00FF00","#FE8499","#FE8463", "#FF0000"];
                  return colorList[params.dataIndex];
                },
              },
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
          },
        ],
      });
    },

    drawPieChart() {
      this.chartPie = echarts.init(document.getElementById("chartPie"));
      this.chartPie.setOption({
        title: {
          x: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["维修中", "实训中", "空闲"],
          textStyle: {
            color: '#FFF',     // 文字的颜色
          },

        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "65%",
            center: ["50%", "60%"],
            data: this.data,
            itemStyle: {
              normal: {
                color: function (params) {
                  //自定义颜色
                  var colorList = ["#FF8C00", "#00FFFF", "#00c040"];
                  return colorList[params.dataIndex];
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
      //  window.onresize =this.chartPie.resize;
    },
    drawPieChart1() {
      this.chartPie1 = echarts.init(document.getElementById("chartPie1"));
      this.chartPie1.setOption({
        title: {
          x: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["已签到", "未签到", "请假"],
          textStyle: {
            color: '#FFF',     // 文字的颜色
          },

        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "65%",
            center: ["50%", "60%"],
            data: this.data,
            itemStyle: {
              normal: {
                color: function (params) {
                  //自定义颜色
                  var colorList = ["#FF8C00", "#00FFFF", "#00FF00"];
                  return colorList[params.dataIndex];
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
      //  window.onresize =this.chartPie.resize;
    },

    drawColumnChart7() {
      this.chartColumn = echarts.init(document.getElementById("chartColumn7"));
      this.chartColumn.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },

        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "15%",
          containLabel: true,
        },

        xAxis: [
          {
            type: "category",
            data: ["年通过率", "月通过率", "周通过率"],
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              color: "rgba(255,255,255,.7)",
              fontSize: 18,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            max: 100,
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)",
              },
            },
            splitLine: {
              lineStyle: {
                width: 1,
                color: "rgba(255,255,255,.1)",
              },
            },
            axisLabel: {
              fontSize: 18,
              color: "rgba(255,255,255,.7)",
            },
          },
        ],
        series: [
          {
            type: "bar",
            barWidth: "35%",
            data: this.data,
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "rgba(255,255,255,.7)",
              },
            },
            itemStyle: {
              normal: {
                barBorderRadius: 4,
                color: "#FF6666",
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "rgba(255,255,255,.7)",
                  },
                },
              },
            },
          },
        ],
      });
    },
    drawColumnChart8() {
      this.chartColumn = echarts.init(document.getElementById("chartColumn8"));
      this.chartColumn.setOption({
        tooltip: {
          trigger: 'axis',

          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
          },

        },
        legend: {
          textStyle: {
            color: '#FFF',     // 文字的颜色
          },

        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['任务1', '任务2', '任务3'],
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: '#fff',
              fontSize: 20,

            }
          }


        },
        series: [
          {
            name: '已完成',
            type: 'bar',
            color: "#33FFCC",
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.websocketdatas.wanceng
          },
          {
            name: '本周计划',
            type: 'bar',
            color: "#FFCC99",
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.websocketdatas.jihua
          },
          {
            name: '未完成',
            type: 'bar',
            color: "#FF0000",
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.websocketdatas.nowanceng
          }
        ]
      });
    },
  },
  mounted() {
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>


<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

li {
  list-style: none;
}

a {
  text-decoration: none;
}

body {
  background: url('../../images/bg.jpg') no-repeat top center;
  background-size: 100% 100%;
  line-height: 1.15;
  /*      min-width: none 12.8rem;
        min-height: none 12.8rem;*/
}

.mainbox {
  width: 100%;
  height: 950px;
  padding: 0.125rem 0.125rem 0;
  display: flex;
}

.mainbox .cloumn {
  text-align: center;
  flex: 3.5;
}

.mainbox .cloumn:nth-child(2) {
  margin: 0 0.125rem 0.1875rem;
  overflow: hidden;
  flex: 5;
}

.mainbox .panel {
  position: relative;
  height: 15.3rem;
  border: 1px solid rgba(25, 186, 139, 0.17);
  background: url("../../images/line1.png") rgba(255, 255, 255, 0.03);
  padding: 0 0.1875rem 0.5rem;
  margin-bottom: 0.1875rem;
}

.mainbox .panel::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  border-left: 2px solid #02a6b5;
  border-top: 2px solid #02a6b5;
  content: "";
}

.mat {
  background: url("../../images/map.png");
}

.mainbox .panel::after {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-right: 2px solid #02a6b5;
  border-top: 2px solid #02a6b5;
  content: "";
}

.mainbox .panel .panel-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.mainbox .panel .panel-footer::before {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-left: 2px solid #02a6b5;
  border-bottom: 2px solid #02a6b5;
  content: "";
}

.mainbox .panel .panel-footer::after {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-right: 2px solid #02a6b5;
  border-bottom: 2px solid #02a6b5;
  content: "";
}

.mainbox .panel h2 {
  height: 0.6rem;
  color: #fff;
  line-height: 48px;
  text-align: center;
  font-size: 0.25rem;
}

.mainbox .panel .chart {
  height: 13.5rem;
}

.no {
  background: rgba(101, 132, 226, 0.05);
  border: 1px solid rgba(25, 186, 139, 0.17);
  padding: 0.875rem;
  height: 14.5rem;
}

.no .no-hd {
  position: relative;
  /*border: 1px solid rgba(25, 186, 139, 0.17);*/
  height: 3rem;
}

.no .no-hd ul {
  display: flex;
}

.no .no-hd ul li {
  position: relative;
  flex: 1;
  line-height: 1rem;
  font-size: 1.8rem;
  color: #ffeb7b;
  text-align: center;
  font-family: "electronicFont";
}

.no .no-bd ul {
  display: flex;
  height: 3rem;
}

.no .no-bd ul li {
  flex: 1;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  line-height: 0.5rem;
  padding-bottom: 0.175rem;
}

.no .no-hd1 {
  margin-top: 1.5rem;
  height: 3rem;
}

.map {
  margin-top: 0.175rem;
  position: relative;
  height: 32rem;
  background: rgba(101, 132, 226, 0.05);
  border: 1px solid rgba(25, 186, 139, 0.17);
}

.map .map_panel {
  height: 25rem;
}

.map .map_panel .info {
  height: 0.75rem;
  margin: 0 auto;
}

.map .map_panel .info ul {
  height: 2.5rem;
  width: 70%;
  margin: 0 auto;
}

.map .map_panel .info ul li {
  float: left;
  padding: 0 0.2rem;
  line-height: 1.5rem;
  font-size: 1rem;
  color: #fff;
}

.map .map_panel .chart {
  height: 24rem;
}

.map .map_panel .title {
  color: #fff;
  font-size: 0.8rem;
}

.map .map_panel .not_sign {
  position: relative;
  overflow: hidden;
  height: 1.5rem;
  width: 95%;
  margin: 0 auto;
  margin-top: 0.75rem;
}

.map .map_panel .not_sign h4 {
  float: left;
  width: 20%;
  line-height: 1rem;
  font-size: 0.8rem;
  color: #fff;
}

.map .map_panel .not_sign .not_sign_name {
  position: relative;
  float: left;
  overflow: hidden;
  width: 75%;
  height: 1rem;
}

.map .map_panel .not_sign .not_sign_name .text_box {
  position: absolute;
  line-height: 1rem;
  height: 1rem;
  left: 100%;
  line-height: 0.375rem;
  font-size: 0.275rem;
  display: block;
  color: #fff;
  word-break: keep-all;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.map .map_panel .not_sign .not_sign_name .text_box p {
  line-height: 1rem;
}

.map .map1 {
  width: 6.475rem;
  height: 6.475rem;
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: url("../../images/map.png");
  background-size: 100% 100%;
  opacity: 0.2;
}

.mapf {
  background: url("../../images/bg.jpg");
}

.map .map2 {
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6rem;
  height: 6rem;
  background: url("../../images/lbx.png");
  background-size: 100% 100%;
  opacity: 0.2;
  animation: rotate1 20s linear infinite;
}

.map .map3 {
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 7.075rem;
  height: 7.075rem;
  background: url("../../images/jt.png");
  background-size: 100% 100%;
  opacity: 0.4;
  animation: rotate2 20s linear infinite;
}

@keyframes rotate1 {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes rotate2 {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

.right {
  float: left;
  height: 11.875rem;
  width: 2.35rem;
  margin-top: 0.1875rem;
  border: 1px solid rgba(25, 186, 139, 0.17);
  background: rgba(101, 132, 226, 0.05);
}

.right .btn {
  width: 1rem;
  height: 1rem;
  margin: 0.5125rem 0.75rem;
  border-radius: 8px;
  border: 0;
  background-color: #4472c4;
  color: #fff;
  font-size: 0.3rem;
  padding: 8px;
}

</style>
