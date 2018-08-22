<!--  -->
<template>
    <transition name="confirm-fade">
        <div class="confirm" v-show="showFlag" @click.stop>
            <div class="confirm-wrapper">
                <div class="confirm-content">
                    <p class="text">{{title}}</p>
                    <div class="operate-btn">
                        <div @click="cancel" class="cancel-btn">{{cancelText}}</div>
                        <div @click="confirm" class="confirm-btn">{{confirmText}}</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type='text/ecmascript-6'>
    export default {
        props: {
            title: {
                type: String,
                default: ''
            },
            confirmText: {
                type: String,
                default: '确定'
            },
            cancelText: {
                type: String,
                default: '取消'
            }
        },
        data () {
            return {
                showFlag: false
            }
        },
        methods: {
            show () {
                this.showFlag = true
            },
            hide () {
                this.showFlag = false
            },
            // 取消清空
            cancel () {
                this.hide()
                this.$emit('cancel')
            },
            // 确认清空，向外派发confirm事件
            confirm () {
                this.hide()
                this.$emit('confirm')
            }
        }
    }
</script>

<style lang='less' scoped>
    .confirm {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 998;
        background: rgba(0, 0, 0, 0.5);
        &.confirm-fade-enter-active{
            animation: confirm-fadein .4s;
            .confirm-content {
                animation: confirm-zoom .4s;
            }
        }
        .confirm-wrapper {
            width: 27rem;
            border-radius: 1.3rem;
            background: #333;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .confirm-content {
                .text {
                    text-align: center;
                    padding: 2rem 1.5rem;
                    line-height: 2.2rem;
                    text-align: center;
                    font-size: 1.8rem;
                    color: rgba(255,255,255,0.5);
                }
                .operate-btn {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 1.6rem;
                    color: rgba(255,255,255,0.5);
                    .cancel-btn{
                        padding: 1rem 0;
                        flex: 1;
                        border-top: 1px solid rgba(0, 0, 0, 0.3);
                        border-right: 1px solid rgba(0, 0 ,0, 0.3);
                        line-height: 2.4rem;
                        text-align: center;
                    }
                    .confirm-btn {
                        padding: 1rem 0;
                        flex: 1;
                        border-top: 1px solid rgba(0, 0, 0, 0.3);
                        line-height: 2.4rem;
                        text-align: center;
                    }
                }
            }
        }
    }

    @keyframes confirm-fadein {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    @keyframes confirm-zoom {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
</style>