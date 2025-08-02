//ts版本的防抖函数
function debounce(fn: Function, delay: number) {
    let timer: any = null;
    return function (this: any) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, delay);
    };
}

export default {
    debounce
}
