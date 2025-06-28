<template>
  <span>
    <v-icon class="room-place-icon">fa-building</v-icon>
    <span v-if="building">{{ building.name }}</span>
    <span v-else>(部室なし)</span>
  </span>
</template>

<script>
export default {
  name: 'DestinationsListItemBuildingComponent',
  props: {
    building: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true
    }
  }
};
</script>

<style scoped lang="stylus">
  .room-place-icon
    @extend .mr-1
    font-size 15px !important
    color: #9c9c9c !important
</style>
