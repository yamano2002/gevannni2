<template>
  <v-layout>
    <Lists/>
  </v-layout>
</template>

<script>
import Lists from '../components/top/lists';
export default {
  name: 'IndexPage',
  async fetch({ store }) {
    await store.dispatch('lists/getLists');
  },
  components: { Lists }
};
</script>

<style>
</style>
