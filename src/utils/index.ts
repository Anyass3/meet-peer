
    export const debounce=(fn: CallableFunction,delay=2000)=>{
        let timeout;
        return (...args)=>{
          if (!!timeout)clearTimeout(timeout);
          timeout=setTimeout(()=>{
            fn(...args)
          },delay)
        }
    }
    export const throttle=(fn: CallableFunction, delay=2000)=>{
        let record=0;
        return (...args)=>{
          const now = new Date().getTime();
          if(now-record<delay)return;
          record=now;
          return fn(...args);
        }
    }