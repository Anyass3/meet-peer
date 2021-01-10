export const debounce = (fn: CallableFunction, delay = 5000) => {
  let timeout;
  return (...args) => {
    if (!!timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
export const throttle = (fn: CallableFunction, delay = 5000) => {
  let record = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - record < delay) return;
    record = now;
    return fn(...args);
  };
};

//function will only throttle on a specific key input
export const keyInputThrottle = (fn: CallableFunction, key: String = 'Enter', delay = 5000) => {
  let record = 0;
  return (event) => {
    if (event.key !== key) return;
    const now = new Date().getTime();
    if (now - record < delay) return;
    record = now;
    return fn(event);
  };
};
