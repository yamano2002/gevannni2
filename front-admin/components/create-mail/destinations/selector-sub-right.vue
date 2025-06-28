<template>
  <v-card>
    <v-toolbar 
      id="cr-ml-ds-sl-r-ttb" 
      color="amber lighten-2"
      flat>
      <v-toolbar-title>
        以下の宛先に配信します
        (全 <span class="red--text">{{ countTotalDests }}</span> 件)
      </v-toolbar-title>

      <v-spacer/>

      <v-btn 
        depressed 
        color="error" 
        @click="clear">
        <v-icon 
          small 
          class="mr-2">fa-trash-alt</v-icon>
        全て消去
      </v-btn>
    </v-toolbar>

    <v-list
      v-show="countTotalDests > 0"
      id="cr-ml-ds-sl-r-l-area"
      dense 
      two-line 
      expand
      class="py-0">
      <v-list-group
        v-for="(list, listId) in dests"
        v-model="listExpanded[listId]"
        :key="listId"
        append-icon="keyboard_arrow_down"
      >
        <v-list-tile 
          slot="activator"
          class="list-header" 
          @click.stop>
          <v-list-tile-action>
            <v-checkbox
              v-model="listGrpAllSelected[listId]"
              hide-details
              @change="toggleListAllSelect({ listId, value: $event })"/>
          </v-list-tile-action>

          <v-list-tile-content @click="listExpanded[listId] = !listExpanded[listId]">
            <v-list-tile-title>
              <span class="list-name">{{ getListNameById(listId) }}</span>
              <span><span class="group-num">{{ list.length }}</span> 件</span>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <DestItem 
          v-for="dest in list"
          :key="dest.id"
          :group="dest"
          v-model="selected"
          :click-cb="TOGGLE_SELECT"
          :item-val="destItemVal"
          style="padding-left: 30px;"
        >
          <v-btn 
            slot="action-right"
            icon
            ripple 
            @click="rmDestsByListAndGrpId({ listId, groupIds: dest.id })">
            <v-icon color="red">fa-times-circle</v-icon>
          </v-btn>
        </DestItem>
      </v-list-group>
    </v-list>

    <div 
      v-if="countTotalDests < 1" 
      class="pa-3 grey--text">
      配信先が選択されていません
    </div>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { adjustHeight } from '../../../assets/domUtils';
import DestItem from '../../common/destinations/list-item';

export default {
  name: 'DestinationSelectorSubRightComponent',
  components: { DestItem },
  computed: {
    ...mapState('createMail/destination', ['modalOpen']),
    ...mapState('createMail/destination/tmpDests', ['dests']),
    ...mapGetters('lists', ['findListById']),
    ...mapGetters('createMail/destination/tmpDests', [
      'getDestItemKey',
      'isListAllGrpSelected',
      'countTotalDests'
    ]),
    selected: {
      get() {
        return this.$store.state.createMail.destination.tmpDests.selected;
      },
      set(val) {
        this.SET_SELECTED(val);
      }
    },
    listExpanded: {
      get() {
        return this.$store.state.createMail.destination.tmpDests.listExpanded;
      },
      set(val) {
        this.SET_LIST_EXPANDED(val);
      }
    },
    listGrpAllSelected: {
      get() {
        let rtnVal = {};
        Object.keys(this.dests).forEach(listId => {
          rtnVal[listId] = this.isListAllGrpSelected(listId);
        });
        return rtnVal;
      }
    }
  },
  watch: {
    modalOpen(newVal, oldVal) {
      if (newVal) {
        adjustHeight('cr-ml-ds-sl-r-l-area', 'cr-ml-ds-sl-r-ttb');
      }
    }
  },
  methods: {
    ...mapMutations('createMail/destination/tmpDests', [
      'SET_SELECTED',
      'TOGGLE_SELECT'
    ]),
    ...mapActions('createMail/destination/tmpDests', [
      'toggleListAllSelect',
      'rmDestsByListAndGrpId',
      'clear'
    ]),
    getListNameById(id) {
      return this.findListById(Number(id)).name;
    },
    destItemVal(group) {
      return this.getDestItemKey(group);
    }
  }
};
</script>

<style scoped lang="stylus">
#cr-ml-ds-sl-r-l-area
  overflow-y scroll

.list-header
  background-color #f7f3eb
  .list-name
    @extend .mr-2
    font-size 1.4em
  .group-num
    @extend .orange--text
    @extend .font-weight-bold
    font-size 1.4em
</style>
