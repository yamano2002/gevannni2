<template>
  <div>
    <RegisterModal />
    <Editor :form-options="GroupAdd"/>
    <Editor :form-options="GroupModify"/>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import scopes from '../../../enums/adminScopes';
import RegisterModal from '../../components/group/register-modal';
import Editor from '../../components/group/editor';

export default {
  name: 'CreateGroupResisterPage',
  components: { RegisterModal, Editor },
  validate({ store }) {
    store.dispatch('auth/scopeFilter', [scopes.GROUP]);
    return true;
  },
  async fetch({ store }) {
    await store.dispatch('lists/getLists');
    await store.dispatch('buildings/getBuildings');
  },
  data() {
    return {
      prevRoute: null
    };
  },
  computed: {
    ...mapState('group/register', ['modalOpen'])
  },
  watch: {
    modalOpen(newVal, oldVal) {
      // back to the previous page on editor close
      if (newVal === false) {
        // wait for the editor close transition
        setTimeout(this.quitEdit, 300);
      }
    }
  },
  mounted() {
    this.openModal('register');
  },
  methods: {
    ...mapActions('group/register', [
      'openModal',
      'addGroupToRegisterList',
      'rewriteAddedGroups'
    ]),
    ...mapMutations('group/register', [
      'SWITCH_OPEN',
      'INIT_VALUES',
      'SET_ADDFORM_VALID',
      'SET_ONE_GROUP',
      'CHANGE_MODIFY'
    ]),
    quitEdit() {
      this.$router.push(this.prevRoute.fullPath || '/');
    },
    GroupAdd() {
      return new Object({
        //新規団体追加
        title: '新規団体追加',
        formType: 'register-add',
        methods: {
          setValues: this.setValues,
          getOpenMethod: this.$store.state.group.register.addModalOpen,
          setOpenMethod: this.setOpenMethod,
          getValidMethod: this.$store.state.group.register.formValid,
          setValidMethod: this.setValidMethod,
          getValuesMethod: this.$store.state.group.register.values,
          setValuesMethod: this.setValuesMethod
        }
      });
    },
    GroupModify() {
      return new Object({
        //追加する団体を修正
        title: '追加団体修正',
        formType: 'register-modify',
        methods: {
          setValues: this.setValues,
          getOpenMethod: this.$store.state.group.register.modifyValues.isModify,
          setOpenMethod: this.setOpenMethod,
          getValidMethod: this.$store.state.group.register.formValid,
          setValidMethod: this.setValidMethod,
          getValuesMethod: this.$store.state.group.register.modifyValues.values,
          setValuesMethod: this.setValuesMethod
        }
      });
    },
    setOpenMethod(formType, value) {
      switch (formType) {
        case 'register-add':
          this.SWITCH_OPEN({ modal: 'add', value: value });
          break;
        case 'register-modify':
          this.SWITCH_OPEN({ modal: 'modify', value: value });
          break;
      }
    },
    setValidMethod(formType, value) {
      switch (formType) {
        case 'register-add':
          this.SET_ADDFORM_VALID(value);
          break;
        case 'register-modify':
          this.SET_ADDFORM_VALID(value);
          break;
      }
    },
    setValuesMethod(formType, values) {
      switch (formType) {
        case 'register-add':
          this.SET_ONE_GROUP(values);
          break;
        case 'register-modify':
          this.CHANGE_MODIFY({
            values: values,
            index: this.$store.state.group.register.modifyValues.index
          });
          break;
      }
    },
    setValues(formType) {
      //登録ボタン押下後処理
      switch (formType) {
        case 'register-add':
          this.addGroupToRegisterList();
          break;
        case 'register-modify':
          this.rewriteAddedGroups(
            this.$store.state.group.register.modifyValues
          );
          break;
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // store url of previous page
    next(vm => {
      vm.prevRoute = from;
    });
  }
};
</script>
<style scoped>
</style>
