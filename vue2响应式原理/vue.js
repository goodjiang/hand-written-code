import Observer from './observer.js';
import Compiler from './compiler.js';
/**
 * 包括vue 构造函数，接收各种配置参数等等
 */

export default class vue {
  constructor(options = {}) {
    console.log(options);
    // 带$相当于私有变量
    this.$options = options;
    this.$data = options.data;
    this.$methods = options.methods;
    this.initRootElement(options);
    // 利用Object.defineProperty将data里面的属性注入到vue实例中
    this._proxyData(this.$data);
    // 实例化observer对象，监听数据变化
    new Observer(this.$data);
    // 实例化compiler对象，解析指令和模板表达式
    new Compiler(this);
  }
  /**
   * 获取根元素，并存储到vue实例，简单检查一下传入的el是否合规
   */
  initRootElement(options) {
    if (typeof options.el == 'string') {
      this.$el = document.querySelector(options.el);
    } else if (typeof options.el instanceof HTMLElement) {
      this.$el = options.el;
    }

    if (!this.$el) {
      throw new Error('传入的数据不正确');
    }
  }

  _proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(newValue) {
          // 如果数据没有变化不做处理
          if (data[key] === newValue) return;
          data[key] = newValue;
        }
      });
    });
  }
}
