<template>
  <v-dialog
    v-model="open"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition">
    <v-card style="height: 100%; background-color: #f5f5f5;">
      <v-toolbar
        dark
        fixed
        color="green">
        <v-toolbar-title>
          配信先を選択
        </v-toolbar-title>
        <v-spacer/>
        <v-toolbar-items>
          <v-btn
            dark
            flat
            @click="open = false">
            <v-icon class="mr-3">fa-times-circle</v-icon>
            保存せずに戻る
          </v-btn>
          <v-btn
            dark
            flat
            @click="saveThenClose"
          >
            <v-icon class="mr-3">fa-check</v-icon>
            決定
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <Selector style="padding-top: 85px;"/>

    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import Selector from './selector';

export default {
  name: 'DestinationSelectorModalComponent',
  components: { Selector },
  computed: {
    open: {
      get() {
        return this.$store.state.createMail.destination.modalOpen;
      },
      set(value) {
        this.SWITCH_MODAL_OPEN(value);
      }
    }
  },
  methods: {
    ...mapMutations('createMail/destination', ['SWITCH_MODAL_OPEN']),
    ...mapActions('createMail/destination/tmpDests', ['save']),
    saveThenClose() {
      this.save();
      this.SWITCH_MODAL_OPEN(false);
    }
  }
};
</script>

<style scoped>
</style>
