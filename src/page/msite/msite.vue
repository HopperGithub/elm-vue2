<template>
  <div>
    <head-top signin-up='msite'>
      <div class="msite-title-row" slot="msite-title-row">
        <router-link :to="'/city/' + cityid" class="msite-title">
          <svg class="location">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#location" fill="#fff"></use>
          </svg>
          <span class="title_text ellipsis">{{msietTitle}}</span>
        </router-link>
        <aside class="weather">
          <div>
            <h2>{{ weather.temperature }}</h2>
            <p>{{ weather.desc }}</p>
          </div>
          <img alt="天气图标" v-if="weather.image_url"
               :src="imgBaseUrl + weather.image_url">
        </aside>
      </div>
      <router-link :to="'/search/' + geohash" class="link_search" slot="search">
        <form action="">
          <input type="text" placeholder="搜索商家、商品" aria-label="搜索商家、商品" class="food-search">
        </form>
      </router-link>
      <div class="hot-search-word" slot="hot-search-word">
        <router-link
          :to="{path: '/search', query: {geohash, keyword: item.search_word}}"
          v-for="(item, index) in hotWords" :key="index" class="link_to_food">
          {{item.word}}
        </router-link>
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
  import {mapMutations, mapState} from 'vuex'
  import {imgBaseUrl} from '../../config/env'
  import headTop from '../../components/header/head'
  import footGuide from '../../components/footer/footGuide'
  import shopList from '../../components/common/shoplist'
  import {
    msiteAdress,
    msiteFoodTypes,
    msiteShopList,
    msiteCurrentWeather,
    msiteHotSearchWord
  } from '../../service/getData'
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
        weather: {}, // 天气信息数据
        hotWords: [], // 搜索热词列表
        cityid: '', // 当前城市id
      }
    },
    async beforeMount(){
      this.geohash = this.$route.query.geohash || 'wtw3sm0q087';
      this.cityid = this.$route.query.cityid;
      //保存geohash 到vuex
      this.SAVE_GEOHASH(this.geohash);
      //获取位置信息
      let res = await msiteAdress(this.geohash);
      this.msietTitle = res.name;
      this.latitude = res.latitude;
      this.longitude = res.longitude;
      // 记录当前经度纬度
      this.RECORD_ADDRESS(res);

      let hotSearchWord = await msiteHotSearchWord(this.latitude, this.longitude);
      this.hotWords = hotSearchWord.concat([]);

      let weather = await msiteCurrentWeather(this.latitude, this.longitude);
      let path1 = weather.image_hash.slice(0, 1);
      let path2 = weather.image_hash.slice(1, 3);
      let path3 = weather.image_hash.slice(3);
      this.weather.temperature = weather.temperature + '°';
      this.weather.desc = weather.description;
      this.weather.image_url = '/' + path1 + '/' + path2 + '/' + path3 + '.png';

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
          effect: 'flip',
          loop: true,
          paginationBulletRender: function (swiper, index, className) {
            return '<span style="width:4px;height: 4px;margin:0 3px;background-color: #000;" class="' + className + '" ></span>';
          }
        });
      })
    },
    components: {
      headTop,
      shopList,
      footGuide,
    },
    computed: {
      ...mapState([
        'latitude', 'longitude'
      ]),
    },
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

    .weather {
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
        padding: 0rem;
        @include wh(1.2rem, 1.2rem);
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

  .hot-search-word {
    @include fj(space-between);
    @include ai(center);
    white-space: nowrap;
    overflow-x: auto;

    a {
      @include sc(0.4rem, #fff);
      margin-right: .58rem;
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
      border-bottom: 0.025rem solid #f1f1f1;
      padding: .2rem 0;

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
