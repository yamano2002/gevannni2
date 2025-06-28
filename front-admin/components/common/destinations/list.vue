<template>
  <v-card>
    <v-toolbar
      color="amber lighten-2"
      dense
      flat>
      <v-toolbar-title>
        {{ headerTitle }}
      </v-toolbar-title>

      <v-spacer/>

      <slot name="header-right"/>
    </v-toolbar>

    <v-list
      v-if="!isDestsEmpty"
      dense
      expand
      class="py-0 dests-veiwer-list">
      <v-list-group
        v-for="(list, listId) in dests"
        :key="listId"
        append-icon="keyboard_arrow_down"
      >
        <v-list-tile
          slot="activator"
          class="list-header">
          <v-list-tile-content>
            <v-list-tile-title>
              <span class="list-name">{{ getListNameById(listId) }}</span>
              <span><span class="group-num">{{ list.length }}</span> 件</span>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <ListItem
          v-for="dest in list"
          :key="dest.id"
          :group="dest"
          :has-cb-ctrl="false"
          :single-line="true"
          :show-bldg="showBldg"
          style="padding-left: 20px;"
        />
      </v-list-group>
    </v-list>
    <div
      v-else
      class="pa-3 grey--text">
      {{ noDestMsg }}
    </div>

  </v-card>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import { mapGetters } from 'vuex';
import ListItem from './list-item';

export default {
  name: 'DestinationsListComponent',
  components: { ListItem },
  props: {
    headerTitle: {
      type: String,
      default: 'Destinations'
    },
    noDestMsg: {
      type: String,
      default: 'No Destination'
    },
    dests: {
      type: Object,
      required: true
    },
    showBldg: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters('lists', ['findListById']),
    isDestsEmpty() {
      return isEmpty(this.dests);
    }
  },
  methods: {
    getListNameById(id) {
      return this.findListById(Number(id)).name;
    }
  }
};
</script>

<style scoped lang="stylus">
  .list-header
    background-color #f7f3eb
    .list-name
      @extend .mr-2
      font-size 1.2em
    .group-num
      @extend .orange--text
      @extend .font-weight-bold
      font-size 1.2em
</style>

<style lang="stylus">
  .dests-veiwer-list
    .v-list__group__items
      overflow-y scroll
      max-height 300px
</style>
