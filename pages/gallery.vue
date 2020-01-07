<template lang="pug">
  div.gallery
    div.slider.js-drag-area
      div.slider__inner.js-slider
        div.slide.js-slide
          div.slide.js-slide
            div.slide__inner.js-slide__inner
              img.js-slide__img(src='http://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/tex1.jpg')
          div.slide.js-slide(style='left: 120%;')
            div.slide__inner.js-slide__inner
              img.js-slide__img(src='http://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/tex1.jpg')
          div.slide.js-slide(style='left: 240%;')
            div.slide__inner.js-slide__inner
              img.js-slide__img(src='http://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/tex1.jpg')
    div.titles
      div.titles__tile.titles__title--proxy
        div.titles.js-titles
          div.titles__title.js-title 1
          div.titles__title.js-title 2
          div.titles__title.js-title 3
    div.progress
      div.progress__line.js-progress-line
        div.progress__line.js-progress-line-2
</template>

<script>

export default {
  asyncData () {
    return {
    }
  }
}
</script>
