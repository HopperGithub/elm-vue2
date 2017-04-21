<template>
  <div>
    <head-top signin-up='msite'>
      <div class="msite-title-row" slot="msite-title-row">
        <router-link to="/home" class="msite-title">
          <svg class="location">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#location"></use>
          </svg>
          <span class="title_text ellipsis">{{msietTitle}}</span>
        </router-link>
        <aside class="air-show">
          <div><h2 class="index-17uRU">22°</h2>
            <p class="index-3-P-K">多云天</p></div>
          <img alt="天气图标" class="index-wRPUE"
               src="//fuss10.elemecdn.com/2/52/5383cfd55c8ba454449f63f54ce2apng.png?imageMogr/format/webp/thumbnail/!69x69r/gravity/Center/crop/69x69/">
        </aside>
      </div>
      <router-link :to="'/search/' + geohash" class="link_search" slot="search">
        <form action=""><input type="text" placeholder="搜索商家、商品" aria-label="搜索商家、商品" class="food-search"></form>
      </router-link>
    </head-top>
    <nav class="msite_nav">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide food_types_container" v-for="(item, index) in foodTypes" :key="index">
            <router-link
              :to="{path: '/food', query: {geohash, title: foodItem.title, restaurant_category_id: getCategoryId(foodItem.link)}}"
              v-for="foodItem in item" :key="foodItem.id" class="link_to_food">
              <figure>
                <img :src="imgBaseUrl + foodItem.image_url">
                <figcaption>{{foodItem.title}}</figcaption>
              </figure>
            </router-link>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </nav>
    <div class="shop_list_container">
      <header class="shop_header">
        <svg class="shop_icon">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shop"></use>
        </svg>
        <span class="shop_header_title">附近商家</span>
      </header>
      <shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
    </div>
    <foot-guide></foot-guide>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import {imgBaseUrl} from '../../config/env'
  import headTop from '../../components/header/head'
  import footGuide from '../../components/footer/footGuide'
  import shopList from '../../components/common/shoplist'
  import {msiteAdress, msiteFoodTypes, msiteShopList} from '../../service/getData'
  import '../../plugins/swiper.min.js'
  import '../../style/swiper.min.css'

  export default {
    data(){
      return {
        geohash: '', // city页面传递过来的地址geohash
        msietTitle: '请选择地址...', // msiet页面头部标题
        foodTypes: [], // 食品分类列表
        hasGetData: false, //是否已经获取地理位置数据，成功之后再获取商铺列表信息
        imgBaseUrl, //图片域名地址
      }
    },
    async beforeMount(){
      this.geohash = this.$route.query.geohash || 'wtw3sm0q087';
      //保存geohash 到vuex
      this.SAVE_GEOHASH(this.geohash);
      //获取位置信息
      let res = await msiteAdress(this.geohash);
      this.msietTitle = res.name;

      // 记录当前经度纬度
      this.RECORD_ADDRESS(res);

      this.hasGetData = true;
    },
    mounted(){
      //获取导航食品类型列表
      msiteFoodTypes(this.geohash).then(res => {
        let resLength = res.length;
        let resArr = res.concat([]); // 返回一个新的数组
        let foodArr = [];
        for (let i = 0, j = 0; i < resLength; i += 8, j++) {
          foodArr[j] = resArr.splice(0, 8);
        }
        this.foodTypes = foodArr;
      }).then(() => {
        //初始化swiper
        new Swiper('.swiper-container', {
          pagination: '.swiper-pagination',
          loop: true
        });
      })
    },
    components: {
      headTop,
      shopList,
      footGuide,
    },
    computed: {},
    methods: {
      ...mapMutations([
        'RECORD_ADDRESS', 'SAVE_GEOHASH'
      ]),
      // 解码url地址，求去restaurant_category_id值
      getCategoryId(url){
        let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name', ''));
        if (/restaurant_category_id/gi.test(urlData)) {
          return JSON.parse(urlData).restaurant_category_id.id
        } else {
          return ''
        }
      }
    },
    watch: {}
  }

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../style/mixin';

  .msite-title-row {

    .msite-title {
      //@include center;
      width: 80%;
      color: #fff;
      //text-align: center;
      margin-left: -0.5rem;

      .location {
        @include wh(0.3rem, 0.4rem);
        fill: #fff;
        //display: inline-block;
      }

      .title_text {
        @include sc(0.6rem, #fff);
        text-align: center;
        width: 60%;
        display: inline-block;
      }

    }

    .air-show {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      color: #fff;
      h2 {
        font-size: .373333rem;
        color: #fff;
      }
      p {
        font-size: .266667rem;
        color: #fff;
      }
      img {
        margin-left: .106667rem;
        width: .733333rem;
        height: .733333rem;
        max-width: 100%;
      }
    }
  }

  .link_search {
    //left: 0.8rem;
    //@include wh(0.8rem, 0.9rem);
    //@include ct;
    .food-search {
      display: block;
      margin: .2rem 0;
      width: 100%;
      height: .96rem;
      text-align: center;
      border-radius: .96rem;
      box-shadow: 0 0.026667rem 0.066667rem 0 rgba(0, 0, 0, .2);
      color: #333;
      font-size: .346667rem;
    }
  }

  .msite_nav {
    padding-top: 2.1rem;
    background-color: #fff;
    border-bottom: 0.025rem solid $bc;

    .swiper-container {
      @include wh(100%, auto);
      padding-bottom: 0.6rem;

      .swiper-pagination {
        bottom: 0.2rem;
      }

    }
  }

  .food_types_container {
    display: flex;
    flex-wrap: wrap;

    .link_to_food {
      width: 25%;
      padding: 0.3rem 0rem;
      @include fj(center);

      figure {

        img {
          margin-bottom: 0.3rem;
          @include wh(1.8rem, 1.8rem);
        }

        figcaption {
          text-align: center;
          @include sc(0.55rem, #666);
        }

      }
    }
  }

  .shop_list_container {
    margin-top: .4rem;
    border-top: 0.025rem solid $bc;
    background-color: #fff;

    .shop_header {

      .shop_icon {
        fill: #999;
        margin-left: 0.6rem;
        vertical-align: middle;
        @include wh(0.6rem, 0.6rem);
      }

      .shop_header_title {
        color: #999;
        @include font(0.55rem, 1.6rem);
      }

    }
  }

</style>
