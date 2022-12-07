/**
 * 发布订阅模式：
 * 存储所有观察者，watcher
 * 每个watcher都有一个update
 * 通知subs里的每个watcher实例，触发update方法
 *
 */
export default class Dep {
  constructor() {
    // 存储所有的观察者
    this.subs = [];
  }
  // 添加观察者
  addSub(watcher) {
    // 判断观察者是否存在 和 是否拥有update方法
    if (watcher && watcher.update) {
      this.subs.push(watcher);
    }
  }
  // 发送通知
  notify() {
    // 触发每个观察者的更新方法
    this.subs.forEach(watcher => {
      watcher.update();
    });
  }
}
