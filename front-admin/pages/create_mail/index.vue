<template>
  <div>
    <Editor/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import scopes from '../../../enums/adminScopes';
import Editor from '../../components/create-mail/editor/editor';

export default {
  name: 'CreateMailIndexPage',
  components: { Editor },
  validate({ store }) {
    store.dispatch('auth/scopeFilter', [scopes.MAIL]);
    return true;
  },
  async fetch({ store }) {
    await store.dispatch('sendMailSetting/getSendMailSettings');
    await store.dispatch('mailTemplate/getMailTemplates');
    await store.dispatch('lists/getLists');
    await store.dispatch('buildings/getBuildings');
  },
  data() {
    return {
      prevRoute: null
    };
  },
  computed: {
    ...mapState('createMail/editor', ['modalOpen'])
  },
  watch: {
    modalOpen(newVal, oldVal) {
      // back to the previous page on editor close
      if (newVal === false) {
        // wait for the editor close transition
        setTimeout(this.quitEdit, 300);
        //this.quitEdit();
      }
    }
  },
  mounted() {
    this.openEditor();
  },
  methods: {
    ...mapActions('createMail/editor', ['openEditor']),
    quitEdit() {
      this.$router.push(this.prevRoute.fullPath || '/');
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
