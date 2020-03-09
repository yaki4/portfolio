<template lang="pug">
  div
    nav.timing(:style="{ gridTemplateColumns: `repeat(${colors.length}, 1fr)` }")
      div(v-for='(color, index) in 31', :key='index + 100')
    section.story(v-for='(color, index) in colors', :key='index', v-if='current === index', :style="{ background: color }")
</template>

<style scoped>
.story{
  height: 100vh;
  width: 100vw;
}
.timing{
  box-sizing: border-box;
  display: grid;
  grid-column-gap: 1em;
  grid-template-columns: repeat(31, 1fr);
  height: 0.5em;
  padding: 0 1em;
  position: fixed;
  top: 1em;
  width: 100%;
}
.timing > div {
  background: rgba(0,0,0,0.25);
  height: 100%;
}
.timing > div > div:nth-child(){
  background: black;
  height: 100%;
  width: 0%;
}
</style>

<script>
import gsap from 'gsap'

export default {
  asyncData () {
    return {
      colors: ['#D53738', '#638867', '#FAF429'],
      current: 0,
      animLoop: null
    }
  },
  mounted () {
    /* eslint-disable */
    this.animLoop = new gsap.timeline({ repeat: -1, duration: 1, onComplete: () => { this.checkComp() } })
  },
  methods: {
    checkComp () {
      console.log('time')
    }
  }
}
</script>
