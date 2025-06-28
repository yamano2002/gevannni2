<template>
  <div>
    <v-select
      :items="lists"
      label="リスト"
      item-text="name"
      item-value="id"
      outline
      placeholder="選択してください..."
      @change="checkTypeandSetList"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'GroupListSelectorComponent',
  props: {
    formType: { type: String, default: '' }
  },
  computed: {
    ...mapState('lists', ['lists']),
    ...mapState('group/groupList', ['targetListId'])
  },
  methods: {
    ...mapActions('group/groupList', ['retrieveGroupList']),
    ...mapMutations('group/register', ['SELECT_LIST']),
    checkTypeandSetList(listid) {
      switch (this.formType) {
        case 'watch':
          this.retrieveGroupList(listid);
          break;
        case 'register':
          this.SELECT_LIST(listid);
          break;
      }
    }
  }
};
</script>

<style scoped>
</style>
