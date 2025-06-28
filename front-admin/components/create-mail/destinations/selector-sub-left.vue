<template>
  <v-card>
    <div 
      id="destSelectCtrlArea" 
      class="px-3 pt-3 pb-1">
      <v-select
        v-model="targetList"
        :items="lists"
        label="リストを選択してください..."
        item-text="name"
        item-value="id"
        outline
        dense
        hide-details
        single-line
        @change="retrieveGroupList"
      />
      <v-text-field
        v-model="search"
        clearable
        clear-icon="clear"
        append-icon="search"
        label="フィルター"
        single-line
        hide-details
      />
      <v-select
        v-model="bldgs"
        :items="buildings"
        item-text="name"
        item-value="id"
        clearable
        clear-icon="clear"
        multiple
        chips
        single-line
        label="部室"
      />
      <v-layout d-flex>
        <v-checkbox
          style="height: 25px; margin-top: 0;"
          label="全選択 / 全解除"
          @change="toggleAllSelect"/>
        <div class="select-count">
          <span class="num">{{ countSelectedGrps }}</span> 件選択中
        </div>
      </v-layout>
    </div>

    <v-divider/>

    <v-list
      id="distCandGrpListArea"
      subheader
      two-line
      dense
    >
      <DestItem 
        v-for="group in filteredCandGrps"
        :key="group.id"
        :group="group"
        v-model="selected"
        :click-cb="TOGGLE_SELECT"
        :item-val="group => group.id"
      >
        <v-btn 
          slot="action-right" 
          icon 
          ripple 
          @click="addGroupToTmpDests(group.id)">
          <v-icon color="green">fa-plus-circle</v-icon>
        </v-btn>
      </DestItem>
    </v-list>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { adjustHeight } from '../../../assets/domUtils';
import DestItem from '../../common/destinations/list-item';

export default {
  name: 'DestinationSelectorSubLeftComponent',
  components: { DestItem },
  data() {
    return {
      targetList: null
    };
  },
  computed: {
    ...mapState('lists', ['lists']),
    ...mapState('buildings', ['buildings']),
    ...mapState('createMail/destination', ['modalOpen']),
    ...mapGetters('createMail/destination/candidates', [
      'filteredCandGrps',
      'countSelectedGrps'
    ]),
    search: {
      get() {
        return this.$store.state.createMail.destination.candidates.filterTxt;
      },
      set(val) {
        this.SET_FILTER_TXT(val);
      }
    },
    bldgs: {
      get() {
        return this.$store.state.createMail.destination.candidates.filterBldg;
      },
      set(val) {
        this.SET_FILTER_BLDG(val);
      }
    },
    selected: {
      get() {
        return this.$store.state.createMail.destination.candidates.selected;
      },
      set(val) {
        this.SET_SELECTED(val);
      }
    }
  },
  watch: {
    modalOpen(newVal, oldVal) {
      if (newVal) {
        this.targetList = null;
        adjustHeight('distCandGrpListArea', 'destSelectCtrlArea');
      }
    }
  },
  methods: {
    ...mapMutations('createMail/destination/candidates', [
      'SET_FILTER_TXT',
      'SET_FILTER_BLDG',
      'SET_SELECTED',
      'TOGGLE_SELECT'
    ]),
    ...mapActions('createMail/destination/candidates', [
      'retrieveGroupList',
      'addGroupToTmpDests',
      'toggleAllSelect'
    ])
  }
};
</script>

<style scoped lang="stylus">
#distCandGrpListArea
  overflow-y scroll

.select-count
  @extend .text-xs-right

  .num
    @extend .font-weight-bold
    @extend .orange--text
    font-size 1.8em
</style>
