<template>
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="list in lists">
                <a class="js-no-follow" v-bind:href="list.clickUrl">
                    <img class="goods-main-photo fadeIn" v-bind:src="list.img">
                </a>
            </div>
        </div>
         <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>

    </div>
</template>


<script>
import Swiper from "swiper";
import "swiper/dist/css/swiper.css";
export default {
  //   props: ['lists'],
  props: {
    lists: {
      required: true
    }
  },
  mounted() {
    new Swiper(".swiper-container", {
      loop: true,
      pagination: {
        el: ".swiper-pagination"
      }
    });
  }
};
</script>

 <style>
.swiper-slide img {
  width: 100%;
  height: 100%;
}
</style>