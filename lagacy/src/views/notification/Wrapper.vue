<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";

  @Component
  export default class MessageWrapper extends Vue {
  }
</script>
