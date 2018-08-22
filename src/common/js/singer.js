// es6创建class类，export default 出去的，在import时候要用{}包裹
export default class Singer {
    constructor({id, name}) {
        this.id = id
        this.name = name
        this.avatar = `https://y.gtimg.cn/music/photo_new/T001R150x150M000${this.id}.jpg?max_age=2592000`
    }
}