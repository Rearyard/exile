<template>
  <div class="tag-input">
    <div class="tag-bar">
      <Tag v-for="name in value" :key="name" :name="name" closable @on-close="close">
        {{name}}
      </Tag>
    </div>
    <Input v-model="str" @keypress.native="keyPress" :placeholder="placeholder"/>
  </div>
</template>

<script lang="ts">
  import {Component, Model, Prop, Vue, Watch} from "vue-property-decorator";

  @Component
  export default class TagInput extends Vue {
    @Model('change', {type: Array, default: () => ([])})
    readonly value!: string[]
    @Prop({type: String, default: ''})
    readonly placeholder!: string
    str = ''

    @Watch('str')
    strChange() {
      this.str = this.str.replace(/[ \r\n]/g, '')
    }

    keyPress($event: KeyboardEvent) {
      if ([' ', 'Enter'].includes($event.key)) {
        this.str = this.str.trim()
        if (this.str && !this.value.includes(this.str)) {
          this.$emit('change',
            this.value.concat([this.str.replace(/[ \r\n]/g, '-')]))
          this.str = ''
        }
        return false
      }
    }

    close({target}: MouseEvent) {
      const removeTag = ((target as any).__vue__.$parent.name)
      this.$emit('change', this.value.filter(v => v != removeTag))
    }
  }
</script>

<style scoped>

</style>