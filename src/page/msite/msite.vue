<template>
  <div>
    <head-top signin-up='msite'>
      <div class="msite-title-row" slot="msite-title-row">
        <router-link to="/home" class="msite-title">
          <svg class="location">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#location" fill="#fff"></use>
          </svg>
          <span class="title_text ellipsis">{{msietTitle}}</span>
        </router-link>
        <aside class="air-show">
          <div>
            <h2>22°</h2>
            <p>多云天</p>
          </div>
          <img alt="天气图标" class="index-wRPUE"
               src="//fuss10.elemecdn.com/2/52/5383cfd55c8ba454449f63f54ce2apng.png?imageMogr/format/webp/thumbnail/!69x69r/gravity/Center/crop/69x69/">
        </aside>
      </div>
      <router-link :to="'/search/' + geohash" class="link_search" slot="search">
        <form action="">
          <input type="text" placeholder="搜索商家、商品" aria-label="搜索商家、商品" class="food-search">
        </form>
      </router-link>
      <div class="recommend-shop" slot="recommend-shop">
        <a href="/search/#/shop?keyword=%E5%98%89%E5%92%8C%E4%B8%80%E5%93%81&amp;geohash=wx4ermccnuqk">
          嘉和一品
        </a>
        <a href="/search/#/shop?keyword=%E5%90%88%E5%88%A9%E5%B1%8B&amp;geohash=wx4ermccnuqk">
          合利屋
        </a>
        <a href="/search/#/shop?keyword=%E6%98%9F%E5%B7%B4%E5%85%8B&amp;geohash=wx4ermccnuqk">
          星巴克
        </a>
        <a href="/search/#/shop?keyword=%E6%9E%9C%E5%A4%9A%E7%BE%8E&amp;geohash=wx4ermccnuqk">
          果多美
        </a>
        <a href="/search/#/shop?keyword=%E5%B7%9D%E6%B8%9D%E7%BE%8E%E9%A3%9F&amp;geohash=wx4ermccnuqk">
          川渝美食
        </a>
        <a href="/search/#/shop?keyword=%E5%A4%A7%E6%8B%87%E6%8C%87&amp;geohash=wx4ermccnuqk">
          大拇指
        </a>
        <a href="/search/#/shop?keyword=%E8%82%AF%E5%BE%B7%E5%9F%BA&amp;geohash=wx4ermccnuqk">
          肯德基
        </a>
        <a href="/search/#/shop?keyword=%E9%BA%BB%E8%BE%A3%E9%A6%99%E9%94%85&amp;geohash=wx4ermccnuqk">
          麻辣香锅
        </a>
        <a href="/search/#/shop?keyword=%E7%B2%A5&amp;geohash=wx4ermccnuqk">
          粥
        </a>
        <a href="/search/#/shop?keyword=%E9%BB%84%E7%84%96%E9%B8%A1&amp;geohash=wx4ermccnuqk">
          黄焖鸡
        </a>
      </div>
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
        <span class="shop_header_title">推荐商家</span>
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
    height: .92rem;
    padding-bottom: 1.28rem;

    .msite-title {
      width: 80%;
      color: #fff;
      .location {
        @include wh(.6rem, .9rem);
        fill: #fff;
      }

      .title_text {
        @include sc(0.78rem, #fff);
        width: 60%;
        display: inline-block;
        max-width: 80%;
      }
    }

    .air-show {
      @include ai(center);
      @include fj(space-between);
      color: #fff;
      float: right;
      h2 {
        @include sc(0.6rem, #fff);
      }
      p {
        display: none;
        @include sc(0.1rem, #fff);
      }
      img {
        fill: #fff;
        padding: 0.15rem;
        @include wh(0.98rem, 0.98rem);
      }
    }
  }

  .link_search {
    .food-search {
      margin: .25rem 0;
      text-align: center;
      border-radius: .96rem;
      box-shadow: 0 0.026667rem 0.066667rem 0 rgba(0, 0, 0, .2);
      color: #333;
      font-size: .346667rem;
      @include wh(100%, 1.55rem);
    }
  }

  .recommend-shop{
    @include fj(space-between);
    @include ai(center);
    white-space: nowrap;
    overflow-x: auto;

    a{
      @include sc(0.4rem, #fff);
      margin-right: .48rem;
    }
  }

  .msite_nav {
    background-color: #fff;
    border-bottom: 1px solid $bc;

    .swiper-container {
      @include wh(100%, auto);
      padding-bottom: 0.6rem;

      .swiper-pagination {
        bottom: 0.05rem;
      }

      .swiper-pagination-bullet-active {
        background: #000;
        opacity: .6;
      }

      .swiper-pagination-bullet {
        margin: 0 .066667rem;
        width: 5px;
        height: 5px;
      }
    }
  }

  .food_types_container {
    display: flex;
    flex-wrap: wrap;

    .link_to_food {
      width: 25%;
      padding: 0.3rem 0rem;
      text-align: center;
      figure {

        img {
          //margin-bottom: 0.3rem;
          @include wh(1.8rem, 1.8rem);
        }

        figcaption {
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
        color: #333;
        font-weight: bold !important;
        @include font(0.65rem, 0.65rem, 'PingFangSC-Regular');
      }
    }
  }

</style>
