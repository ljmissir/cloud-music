<!--  -->
<template>
    <div class="switch-item-wrapper">
        <ul class="switch-list">
            <li 
                v-for="(item, index) in switchList" 
                :key="index"
                :class="{active: currentIndex === index}"
                @click="switchIndex(index)">
                {{item}}
            </li>
        </ul>
    </div>
</template>

<script type='text/ecmascript-6'>
    export default {
        props: {
            switchList: {
                type: Array,
                default: []
            },
            currentIndex: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {

            }
        },
        methods: {
            switchIndex (index) {
                this.$emit('changeItem', index)
            }
        }
    }
</script>

<style lang='less' scoped>
    .switch-item-wrapper {
        .switch-list {
            display: flex;
            color: #fff;
            width: 24rem;
            height: 3.6rem;
            font-size: 1.4rem;
            border: 1px solid #333;
            margin: 0 auto;
            border-radius: 1rem;
            li {
                flex: 1;
                text-align: center;
                height: 100%;
                line-height: 3.6rem;
                &.active {
                    background: #333;
                    color: #e84639;
                }
            }
        }
    }
</style>