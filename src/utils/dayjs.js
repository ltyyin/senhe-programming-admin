import * as dayjs from "dayjs";
import "dayjs/locale/zh-cn"; // import locale
import Vue from "vue";

dayjs.locale("zh-cn"); // use locale

Vue.filter("formatTime", function (time, format) {
  return dayjs(time).format(format);
});
