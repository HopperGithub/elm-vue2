<template>
  <header id='head_top'>
    <slot name='logo'></slot>
    <slot name="msite-title-row"></slot>
    <slot name='search'></slot>
    <section class="head_goback" v-if="goBack" @click="$router.go(-1)">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:2"/>
      </svg>
    </section>
    <section class="title_head ellipsis" v-if="headTitle">
      <span class="title_text">{{headTitle}}</span>
    </section>
    <slot name="hot-search-word"></slot>
    <slot name="changecity"></slot>
    <slot name="changeLogin"></slot>
  </header>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    data(){
      return {}
    },
    created(){
      //获取用户信息
      this.getUserInfo();
    },
    mounted(){

    },
    props: ['headTitle', 'goBack'],
    computed: {
      ...mapState([
        'userInfo'
      ]),
    },
    methods: {
      ...mapActions([
        'getUserInfo'
      ]),
    },

  }

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../style/mixin';

  #head_top {
    background-color: $blue;
    padding: .42rem 0.55rem;
    z-index: 100;
    left: 0;
    top: 0;
  }

  .head_goback {
    @include wh(1.25rem, 1.25rem);
    @include sc(0.45rem, #fff);
    display: inline-flex;
    padding: 0.25rem;
    //vertical-align: middle;
  }

  .title_head {
    position: absolute;
    top: 0;
    margin-top: 1.1rem;
    left: 50%;
    text-align: center;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);

    .title_text{
      @include sc(0.9rem, #fff);
      font-weight: 700;
    }
  }

  .head_login {
    right: 0.55rem;
    @include sc(0.65rem, #fff);
    @include ct;
    .login_span {
      color: #fff;
    }
    .user_avatar {
      fill: #fff;
      @include wh(.8rem, .8rem);
    }
  }
</style>
