<template>
  <v-layout d-block>
    <v-layout justify-space-between>
      <PageTitle class="mb-3">登録団体</PageTitle>
      <v-btn
        v-if="hasPrivScope"
        color="primary"
        class="white--text"
        @click="moveToRegisterPage"
      >
        <v-icon 
          left
          small>fa-plus</v-icon>
        新規団体登録
      </v-btn>
    </v-layout>
    <ListSelector form-type="watch"/>
    <GroupList/>
    <GroupEditor :form-options="GroupEdit"/>
  </v-layout>
</template>

<script>
import scopes from '../../../enums/adminScopes';
import PageTitle from '../../components/common/page-title';
import ListSelector from '../../components/group/list-selector';
import GroupList from '../../components/group/group-list';
import GroupEditor from '../../components/group/editor';
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'GroupsIndexPage',
  components: { PageTitle, ListSelector, GroupList, GroupEditor },
  computed: {
    ...mapGetters('auth', ['hasScope']),
    hasPrivScope() {
      return this.hasScope(scopes.GROUP);
    }
  },
  validate({ store }) {
    store.dispatch('auth/scopeFilter', [scopes.GROUP, scopes.GROUP_INF]);
    return true;
  },
  async fetch({ store }) {
    await store.dispatch('buildings/getBuildings');
    await store.dispatch('lists/getLists');
    store.commit('group/groupList/INIT');
  },
  methods: {
    ...mapActions('group/editor', ['save']),
    ...mapMutations('group/editor', [
      'SET_FORM_VALID',
      'EDITOR_SWITCH_OPEN',
      'SET_FORM_VALUES'
    ]),
    moveToRegisterPage() {
      this.$router.push('/group/register');
    },
    GroupEdit() {
      return new Object({
        title: '団体情報編集',
        formType: 'edit',
        methods: {
          setValues: this.setValues,
          getOpenMethod: this.$store.state.group.editor.modalOpen,
          setOpenMethod: this.setOpenMethod,
          getValidMethod: this.$store.state.group.editor.formValid,
          setValidMethod: this.setValidMethod,
          getValuesMethod: this.$store.state.group.editor.values,
          setValuesMethod: this.setValuesMethod
        }
      });
    },
    setValues(formType) {
      this.save();
    },
    setOpenMethod(formType, value) {
      this.EDITOR_SWITCH_OPEN();
    },
    setValidMethod(formType, value) {
      this.SET_FORM_VALID(value);
    },
    setValuesMethod(formType, values) {
      this.SET_FORM_VALUES(values);
    }
  }
};
</script>

<style scoped>
</style>
