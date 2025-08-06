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

/**
 * 获取当前本地格式的年月日
 * @returns {string} 当前日期
 */
function getCurrentDate(): string {
    const now = new Date();
    return now.toLocaleDateString('zh-CN', {year: 'numeric', month: '2-digit', day: '2-digit'});
}

/**
 * 分页数据
 * @param dataArray 数据数组
 * @param pageNumber 当前页码
 * @param itemsPerPage 每页显示条数
 */
function paginateData(dataArray: any[], pageNumber: any, itemsPerPage = 50) {
    // 确保页码是正整数（最小为1）
    const currentPage = Math.max(1, parseInt(pageNumber) || 1);

    // 计算截取的起始索引（从0开始）
    const startIndex = (currentPage - 1) * itemsPerPage;

    // 计算结束索引（不超过数组长度）
    const endIndex = Math.min(startIndex + itemsPerPage, dataArray.length);

    // 返回截取后的分页数据
    return dataArray.slice(startIndex, endIndex);
}


//等待函数
async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    debounce,
    getCurrentDate,
    paginateData,
    wait
}
