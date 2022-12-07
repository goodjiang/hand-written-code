import Dep from './dep.js';

export default class Watcher {
  /**
   * @param {*} vm   vue实例
   * @param {*} key  data属性名
   * @param {*} cb   负责更新视图的回调函数
   */
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;
    // 此时 Dep.target 作为一个全局变量理解，放的就是这个watcher
    Dep.target = this;
    // 旧数据 更新视图的时候要进行比较
    // 还有一点就是 vm[key] 这个时候就触发了observer的 get 方法
    // 之前在 get 把 观察者 通过dep.addSub(Dep.target) 添加到了 dep.subs中
    this.oldVal = vm[key]; // 旧值
    // Dep.target 就不用存在了 因为上面的操作已经存好了
    Dep.target = null;
  }
  // 当数据变化的时候更新视图
  update() {
    let newValue = this.vm[this.key]; // 新值
    if (this.oldVal === newValue) {
      return;
    }
    this.cb(newValue);
  }
}

// watcher初始化获取oldVal的时候，会去做一些什么操作？添加依赖的操作
// 通过vm[key]获取oldVal前，为什么要将当前的实例挂在Dep上，获取之后为什么又置为null？先收集依赖进行暂存，用完后赋值为空
// update 方法是在什么时候执行的？   notify时调用update
