import Watcher from './watcher.js';

export default class Compiler {
  // vm 指 Vue 实例
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.methods = vm.$methods;
    // 编译模板
    this.compile(vm.$el);
  }

  // 编译模板  el-根元素
  compile(el) {
    const childNodes = el.childNodes; // 子节点 - 伪数组
    // 伪数组必须转换成真实数组才可进行遍历---不然在低版本浏览器上面不支持forEach
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        // 文本节点
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        // 元素节点
        this.compileElement(node);
      }

      // 有子节点，递归调用
      if (node.childNodes && node.childNodes.length > 0) {
        // 继续递归编译模板
        this.compile(node);
      }
    });
  }
  // 编译文本节点(简单的实现)
  compileText(node) {
    // 核心思想利用把正则表达式把{{}}去掉找到里面的变量
    // 再去Vue找这个变量赋值给node.textContent
    // {{msg}}] msg:  hello word
    const reg = /\{\{(.+?)\}\}/;
    // 获取节点的文本内容
    const value = node.textContent; // hello word
    // 判断是否有 {{}}
    if (reg.test(value)) {
      // 获取分组一  也就是 {{}} 里面的内容 去除前后空格
      const key = RegExp.$1.trim(); // msg
      // 进行替换再赋值给node
      node.textContent = value.replace(reg, this.vm[key]);
      // 添加观察者
      new Watcher(this.vm, key, newValue => {
        // 数据改变时更新
        node.textContent = newValue;
      });
    }
  }
  // 编译元素节点这里只处理指令
  compileElement(node) {
    // 获取到元素节点上面的所有属性进行遍历
    if (node.attributes.length) {
      Array.from(node.attributes).forEach(attr => {
        // 遍历元素节点的所有属性
        const attrName = attr.name; // v-model v-text v-html v-on:click => 目前没有作@click的
        if (this.isDirective(attrName)) {
          let directiveName = attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2);
          let key = attr.value; // msg
          // TODO 更新元素节点
          // vue指令很多为了避免大量个 if判断这里就写个 uapdate 方法
          this.update(node, key, directiveName);
        }
      });
    }
  }
  // 添加指令方法 并且执行
  update(node, key, directiveName) {
    // 比如添加 textUpdater 就是用来处理 v-text 方法
    // 我们应该就内置一个 textUpdater 方法进行调用
    // 加个后缀加什么无所谓但是要定义相应的方法
    const updateFn = this[directiveName + 'Updater'];
    console.log('updateFn===', directiveName);
    // 如果存在这个内置方法 就可以调用了
    // 绑定this执行，不然方法里面的this就是undefined
    updateFn && updateFn.call(this, node, this.vm[key], key, directiveName);
  }
  // 解析v-text
  textUpdater(node, val, key) {
    node.textContent = val;
    new Watcher(this.vm, key, newValue => {
      console.log(newValue);
      node.textContent = newValue;
    });
  }
  // 解析v-mdoel
  modelUpdater(node, val, key) {
    node.value = val;
    new Watcher(this.vm, key, newValue => {
      node.value = newValue;
    });

    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value;
    });
  }
  // 解析v-html
  htmlUpdater(node, val, key) {
    console.log(val);
    node.innerHTML = val;
    new Watcher(this.vm, key, newValue => {
      node.innerHTML = newValue;
    });
  }
  // 解析v-on:click
  clickUpdater(node, val, key, directiveName) {
    console.log('===', directiveName);
    node.addEventListener(directiveName, this.methods[key]);
  }
  // 判断是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }
  // 判断是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
  // 判断元素属性是否是指令
  isDirective(attrName) {
    // v-xxx
    return attrName.startsWith('v-');
  }
}
