<template>
  <DestList 
    :header-title="headerTitle" 
    :no-dest-msg="noDestMsg" 
    :dests="dests">
    <v-btn
      slot="header-right"
      depressed
      color="green"
      dark
      @click="openSelectModal">
      <v-icon
        small
        class="mr-2">fa-edit</v-icon>
      編集
    </v-btn>
  </DestList>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import DestList from '../../common/destinations/list';

export default {
  name: 'DestinationViewerComponent',
  components: { DestList },
  data() {
    return {
      headerTitle: '以下の宛先に配信します',
      noDestMsg: '配信先が選択されていません'
    };
  },
  computed: {
    ...mapState('createMail/destination', ['dests'])
  },
  methods: {
    ...mapActions('createMail/destination', ['openSelectModal'])
  }
};
</script>

<style scoped>
</style>
