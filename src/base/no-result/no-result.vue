<!--  -->
<template>
    <div class="no-result">
        <p>{{title}}</p>
    </div>
</template>

<script type='text/ecmascript-6'>
    export default {
        props: {
            title: {
                type: String,
                default: ''
            }
        },
        data () {
            return {

            }
        }
    }
</script>

<style lang='less' scoped>
    .no-result {
        text-align: center;
        p {
            font-size: 1.4rem;
        }
    }
</style>