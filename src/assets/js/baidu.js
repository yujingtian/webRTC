/*百度统计*/
setTimeout(() => {
  var _hmt = _hmt || [];
  (function() {
    //每次执行前，先移除上次插入的代码
    document.getElementById("baidu_tj") &&
      document.getElementById("baidu_tj").remove();
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?b3895b6a7c0b5fc7e3127f4922dace2f";
    hm.id = "baidu_tj";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();
}, 0);
