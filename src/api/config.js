export const commonParams = {
    // 这些参数不是非必须的，可和后台一起定义
    g_tk: 5381,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp'
}

export const options = {
    // 和后台约定的jsonpCallback名称
    param: 'jsonpCallback'
}

export const ERR_OK = 0