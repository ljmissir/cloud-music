<!--  -->
<template>
    <div class="process-bar" ref="processBar" @click.stop="progressBarClick">
        <div class="process-line">
            <div class="process-runing" ref="processRuning"></div>
        </div>
        <div 
            class="process-btn-wrapper" 
            ref="processBtnWrapper"
            @touchstart.prevent="processTouchStart"
            @touchmove.prevent="processTouchMove"
            @touchend="processTouchEnd">
            <!-- @touchstart.prevent 阻止浏览器的默认事件 -->
            <div class="process-btn"></div>  
        </div>
    </div>
</template>

<script type='text/ecmascript-6'>
    // 小滑块的默认宽度
    const baseProcessBtnWidth = 16
    export default {
        props: {
            percent: {
                type: Number,
                default: 0
            }
        },
        created () {
            // 实例挂载时，创建一个touch对象供touch事件共享数据和状态
            this.touch = {}
        },
        methods: {
            processTouchStart (e) {
                // 初始化一个标志位，表示触摸事件已经开始激活
                this.touch.initialed = true
                // touchmove事件要从touchstart中取手指第一次点击的位置，所以把startX值设置在this.touch中共享
                this.touch.startX = e.touches[0].pageX
                // 记录进度条初始偏移量
                this.touch.left = this.$refs.processRuning.clientWidth
            },
            processTouchMove (e) {
                if (!this.touch.initialed) {
                    return
                }
                // 拖拽期间，记录与第一次触摸点位置的偏移量
                const diff = e.touches[0].pageX - this.touch.startX
                // 设置拖动滑块的左右边界值
                const offsetWidth = Math.min(this.$refs.processBar.clientWidth - baseProcessBtnWidth, Math.max(0, this.touch.left + diff))
                this._offsetHandle(offsetWidth)
            },
            processTouchEnd () {
                // 触摸事件结束时，把标志位置为false
                this.touch.initialed = false
                this._setNewPercent()
            },
            progressBarClick (e) {
                const rect = this.$refs.processBar.getBoundingClientRect()
                const offsetWidth = e.pageX - rect.left
                this._offsetHandle(offsetWidth)
                this._setNewPercent()
            },
            _offsetHandle (offsetWidth) {
                // 设置进度条的偏移量
                this.$refs.processRuning.style.width = `${offsetWidth}px`
                // 设置按钮随拖动而移动
                this.$refs.processBtnWrapper.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`
            },
            _setNewPercent () {
                // 重新计算拖动位置占整个进度条的百分比
                const barWidth = this.$refs.processBar.clientWidth - baseProcessBtnWidth
                const percent = this.$refs.processRuning.clientWidth / barWidth
                // 接收事件，并通知父组件
                this.$emit('percentChange', percent)
            }
        },
        watch: {
            percent (newPercent) {
                if (newPercent >= 0 && !this.touch.initialed) {
                    const barWidth = this.$refs.processBar.clientWidth - baseProcessBtnWidth
                    const offsetWidth = newPercent * barWidth
                    this._offsetHandle(offsetWidth)
                }
            }
        }
    }
</script>

<style lang='less' scoped>
    .process-bar {
        margin: 0 1rem;
        flex: 1;
        position: relative;
        height: 3rem;
        .process-line {
            width: 100%;
            position: absolute;
            top: 1.3rem;
            height: .4rem;
            background: rgba(0,0,0,0.3);
            .process-runing {
                height: 100%;
                position: absolute;
                background: #e84639;
            }
        }
        .process-btn-wrapper {
            position: absolute;
            width: 3rem;
            height: 3rem;
            .process-btn {
                position: relative;
                top: .7rem;
                box-sizing: border-box;
                width: 1.6rem;
                height: 1.6rem;
                border: .6rem solid #fff;
                border-radius: 50%;
                background: #e84639;
            }
        }
    }
</style>