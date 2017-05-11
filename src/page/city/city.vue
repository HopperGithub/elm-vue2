<template>
  <div class="city_container">
    <head-top :head-title="headerTitle" go-back='true'>
      <router-link to="/home" slot="changecity" class="change_city" v-if="false">切换城市</router-link>
      <form class="city_form" slot="search_city" @submit.prevent>
        <input type="search" name="city" placeholder="请输入地址" class="city_input" required
               v-model='inputVaule' @change='postpois'>
      </form>
    </head-top>
    <!--<header v-if="historytitle" class="pois_search_history">搜索历史</header>-->
    <section>
      <ul class="getpois_ul">
        <li v-for="(item, index) in placelist" @click='nextpage(index, item.geohash)' :key="index">
          <h4 class="pois_name ellipsis">{{item.name}}</h4>
          <p class="pois_address ellipsis">{{item.address}}</p>
        </li>
      </ul>
      <footer v-if="historytitle" class="del_pois_search_history" @click.prevent="clearHistory">删除搜索历史</footer>
    </section>
    <section class="search_none_place" v-if="placeNone">
      <img src="//github.elemecdn.com/eleme/fe-static/master/media/empty/no-shop.png">
      <h3>没有搜索结果</h3>
      <p>换个关键字试试</p>
    </section>
  </div>
</template>

<script>
  import headTop from '../../components/header/head'
  import {currentcity, searchplace, search_poi_nearby} from '../../service/getData'
  import {getStore, setStore} from '../../config/mUtils'

  export default {
    data(){
      return {
        inputVaule: '', // 搜索地址
        cityid: '', // 当前城市id
        headerTitle: '选择地址', // 当前页面title
        cityname: '', // 当前城市名字
        placelist: [], // 搜索城市列表
        placeHistory: [], // 历史搜索记录
        historytitle: false, // 默认显示搜索历史头部，点击搜索后隐藏
        placeNone: false, // 搜索无结果，显示提示信息
      }
    },

    mounted(){
      /*this.cityid = this.$route.params.cityid;
      //获取当前城市名字
      currentcity(this.cityid).then(res => {
        this.cityname = res.name;
      })*/
      //获取搜索历史记录
      if (getStore('placeHistory')) {
        this.placelist = JSON.parse(getStore('placeHistory'));
        this.historytitle = this.placelist.length > 0 ? true : false;
      }
    },

    components: {
      headTop
    },

    computed: {},

    methods: {
      //发送搜索信息inputVaule
      postpois(){
        //输入值不为空时才发送信息
        if (this.inputVaule) {
          /*searchplace(this.cityid, this.inputVaule).then(res => {
            this.historytitle = false;
            this.placelist = res;
            this.placeNone = res.length ? false : true;
          });*/
          search_poi_nearby('', this.inputVaule).then(res => {
            this.historytitle = false;
            this.placelist = res;
            this.placeNone = res.length ? false : true;
          })
        }
      },
      //清除所有历史记录
      clearHistory(){
        this.placelist = [];
        this.placeHistory = [];
        this.historytitle = false;
        setStore('placeHistory', this.placeHistory);
      },
      /**
       * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
       * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
       */
      nextpage(index, geohash){
        let history = getStore('placeHistory');
        let choosePlace = this.placelist[index];
        let cityid = this.cityid;
        if (history) {
          let checkrepeat = false;
          this.placeHistory = JSON.parse(history);
          this.placeHistory.forEach(item => {
            if (item.geohash == geohash) {
              checkrepeat = true;
            }
          })
          if (!checkrepeat) {
            this.placeHistory.push(choosePlace)
          }
        } else {
          this.placeHistory.push(choosePlace)
        }
        setStore('placeHistory', this.placeHistory)
        this.$router.push({path: '/msite', query: {cityid, geohash}})
      },
    }
  }

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../style/mixin';

  .city_container {
    //padding-top: 2.35rem;
  }

  .change_city {
    float: right;
    padding: 0.3rem;
    @include sc(0.6rem, #f5f5f5);
  }

  .city_form {
    padding: 0.3rem 0.25rem 0.1rem 0.25rem;

      .city_input {
        padding: 0.25rem 0.6rem;
        border-radius: .96rem;
        box-shadow: 0 0.026667rem 0.066667rem 0 rgba(0, 0, 0, .2);
        @include sc(.555rem, #333);
        @include wh(100%, 1.35rem);
      }
    }

  .pois_search_history {
    border-top: 1px solid $bc;
    border-bottom: 1px solid $bc;
    padding-left: 0.5rem;
    @include font(0.575rem, 0.8rem);
  }

  .del_pois_search_history{
    border-bottom: 1px solid $bc;
    padding: 0.15rem;
    text-align: center;
    font-weight: 400;
    @include sc(0.675rem, #0096ff);
  }

  .getpois_ul {
    background-color: #fff;
    border-top: 1px solid $bc;
    li {
      margin: 0 auto;
      padding-top: 0.25rem;
      border-bottom: 1px solid $bc;
      .pois_name {
        margin: 0 auto 0.35rem;
        width: 90%;
        @include sc(0.65rem, #333);
      }
      .pois_address {
        width: 90%;
        margin: 0 auto 0.55rem;
        @include sc(0.45rem, #999);
      }
    }
  }

  .search_none_place {
    padding-top: 4rem;
    margin: 0 auto;
    color: #333;
    text-align: center;
    text-indent: 0.5rem;
    img{
      @include wh(10rem, 5rem);
    }
    h3{
      margin: .333333rem 0 .266667rem;
      @include sc(0.83rem, #6a6a6a);
      font-weight: 400;
    }
    p{
      margin: 0 0 .333333rem;
      @include sc(0.6rem, #999);
    }
  }
</style>
