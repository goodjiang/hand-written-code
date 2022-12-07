import Vue from './vue.js';

const vm = new Vue({
  el: '#app',
  data: {
    msg: 'hello word',
    count: 0,
    testHtml: '<ul><li>1</li><li>2</li><li>3</li></ul>'
  },
  methods: {
    handler() {
      console.log('1111111111===', 1111111111);
    }
  }
});
