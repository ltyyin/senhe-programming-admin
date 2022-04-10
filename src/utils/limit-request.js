export function throttling(fn, wait, immediate) {
  let timer, context, args;

  let run = () => {
    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(context, args);
      }
      clearTimeout(timer);
      timer = null;
    }, wait);
  };

  return function () {
    context = this;
    args = arguments;
    if (!timer) {
      console.log("节流阀：允许");
      if (immediate) {
        fn.apply(context, args);
      }
      run();
    } else {
      console.log("节流阀：忽略");
    }
  };
}
