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
      console.log("throttle, set");
      if (immediate) {
        fn.apply(context, args);
      }
      run();
    } else {
      console.log("throttle, ignore");
    }
  };
}
