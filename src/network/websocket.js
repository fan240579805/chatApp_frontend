import {API_PATH, WS_BASE_URL} from '../const';
import eventBus from '../utils/eventBus';
const url = `${WS_BASE_URL}${API_PATH.WS}`;
let that = null;

export default class WebSocketClient {
  uid = '';
  constructor() {
    this.ws = null;
    that = this;
  }

  /**
   * 获取WebSocket单例
   * @returns {WebSocketClient}
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new WebSocketClient();
    }
    return this.instance;
  }

  /**
   * 初始化WebSocket
   */
  initWebSocket(userid) {
    try {
      this.uid = userid;
      //timer为发送心跳的计时器
      // this.timer && clearInterval(this.timer);
      this.ws = new WebSocket(`${url}/?userid=${userid}`);
      this.initWsEvent();
    } catch (e) {
      console.log('WebSocket err:', e);
      //重连
      this.reconnect();
    }
  }

  /**
   * 初始化WebSocket相关事件
   */
  initWsEvent() {
    //建立WebSocket连接
    this.ws.onopen = function () {
      console.log('WebSocket:', 'connect to server');
    };

    //客户端接收服务端数据时触发
    this.ws.onmessage = function (evt) {
      if (evt.data !== 'pong') {
        //不是心跳消息，消息处理逻辑
        // console.log('WebSocket: response msg', evt.data);
        const wsData = JSON.parse(evt.data);
        wsData.DataType == 'msg' && eventBus.emit('pushMsg', wsData);
        wsData.DataType == 'chatItem' && eventBus.emit('pushChatItem', wsData);
        wsData.DataType == 'friend' && eventBus.emit('pushFriend', wsData);
      } else {
        console.log('WebSocket: response pong msg=', evt.data);
      }
    };
    //连接错误
    this.ws.onerror = function (err) {
      console.log('WebSocket:', 'connect to server error');
      console.log(err)
      //重连
      that.reconnect();
    };
    //连接关闭
    this.ws.onclose = function () {
      console.log('WebSocket:', 'connect close');
      //重连
      that.reconnect();
    };

    //每隔15s向服务器发送一次心跳
    // this.timer = setInterval(() => {
    //   if (this.ws && this.ws.readyState === WebSocket.OPEN) {
    //     console.log('WebSocket:', 'ping');
    //     this.ws.sendMessage('ping');
    //   }
    // }, 15000);
  }

  //发送消息
  sendMessage(msg) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(msg);
      } catch (err) {
        console.warn('ws sendMessage', err.message);
      }
    } else {
      console.log('WebSocket:', 'connect not open to send message');
    }
  }

  //重连
  reconnect() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(function () {
      //重新连接WebSocket
      that.initWebSocket(that.uid);
    }, 15000);
  }
}

export const wsInstance = new WebSocketClient();
