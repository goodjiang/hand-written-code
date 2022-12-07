// 给每个属性添加getter/setter，用于依赖收集和派发更新

import Dep from './dep.js';

export default class Observer {
  constructor(data) {
    this.traverse(data);
  }
  // 用于递归data里面的所有属性
  traverse(data) {
    if (!data || typeof data !== 'object') {
      return;
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
    });
  }
  // 给传入的数据设置  getter/setter
  defineReactive(obj, key, val) {
    // TODO 递归遍历
    this.traverse(val);
    const that = this;
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        // 在这里添加观察者对象 Dep.target 表示观察者
        Dep.target && dep.addSub(Dep.target);
        return val;
      },
      set(newValue) {
        if (newValue == val) {
          return;
        }
        val = newValue;
        // 赋值的话如果是newValue是对象，对象里面的属性也应该设置为响应式的
        // 例如： info.age = {name:1111}
        that.traverse(newValue);
        dep.notify();
      }
    });
  }
}
