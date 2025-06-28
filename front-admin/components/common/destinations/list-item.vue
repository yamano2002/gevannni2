<template>
  <v-list-tile
    @click.prevent>
    <v-list-tile-action v-if="hasCbCtrl">
      <v-checkbox
        v-model="selectedCmp"
        :value="itemVal(group)"
        hide-details/>
    </v-list-tile-action>

    <v-list-tile-content @click="clickCb(itemVal(group))">
      <v-list-tile-title>
        <span class="mr-2">{{ group.name }}</span>
        <span v-if="group.charge_person_name">{{ group.charge_person_name }}</span>
        <span v-if="group.mail">&lt;{{ group.mail }}&gt;</span>
        <Bldg 
          v-if="showBldg && singleLine"
          :building="group.Building"
          class="ml-2" />
      </v-list-tile-title>
      <v-list-tile-sub-title v-if="showBldg && !singleLine">
        <Bldg :building="group.Building"/>
      </v-list-tile-sub-title>
    </v-list-tile-content>

    <v-list-tile-action>
      <slot name="action-right"/>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
import Bldg from './list-item-building';

export default {
  name: 'DestinationsListItemComponent',
  components: { Bldg },
  model: {
    prop: 'selected',
    event: 'change'
  },
  props: {
    // whether to use checkbox selector
    hasCbCtrl: {
      type: Boolean,
      default: true
    },
    singleLine: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: () => {
        return [];
      }
    },
    group: {
      type: Object,
      required: true
    },
    clickCb: {
      type: Function,
      default: () => {
        return () => {};
      }
    },
    itemVal: {
      type: Function,
      default: () => {
        return () => {};
      }
    },
    showBldg: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    selectedCmp: {
      get() {
        return this.selected;
      },
      set(value) {
        this.$emit('change', value);
      }
    }
  }
};
</script>

<style scoped>
</style>
