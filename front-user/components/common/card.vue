<template>
  <v-layout d-block>
    <v-flex
      xs12
      sm8
      md6
      offset-sm2
      offset-md3>
      <v-card>
        <v-card-title 
          :style="{ backgroundColor: color }" 
          primary-title>
          <slot name="title"/>
        </v-card-title>
        <v-card-text>
          <slot/>
        </v-card-text>
        <v-card-actions>
          <slot name="actions"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'CardComponent',
  props: {
    color: {
      type: String,
      default: 'white'
    }
  }
};
</script>

<style scoped>
</style>
