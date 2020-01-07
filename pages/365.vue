<template lang="pug">
  div
    section(v-for='(color, index) in colors', :key='index')
</template>

<script>

export default {
  asyncData () {
    return {
      colors: ['#D53738', '#638867', '#FAF429']
    }
  }
}
</script>
