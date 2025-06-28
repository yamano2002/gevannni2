<template>
  <v-dialog
    v-model="modalIsOpen"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar
        dark
        fixed
        color="yellow darken-2">
        <v-btn
          icon
          dark
          @click="modalIsOpen = false">
          <v-icon>close</v-icon>
        </v-btn>   
        <v-card-title>
          <span class="headline">
            新規団体登録
          </span>
        </v-card-title>
        <v-spacer />
        <v-toolbar-items >
          <v-btn
            flat
            @click="ConfirmandRegister"
          >
            登録
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container
        grid-list-md
        style="margin-top: 65px;">
        <v-layout d-block>
          <ListSelector form-type="register"/> 
          <RegisterGroupList />
          <v-btn
            color="yellow darken-2"
            @click="OpenAddPage"
          >
            <v-icon
              left
              small
              color="white"
            >fas fa-plus</v-icon>
            <font color="white" >追加</font>
          </v-btn>
          <v-btn
            color="yellow darken-2"
            @click="OpenAddCsvPage"
          >
            <v-icon
              left
              small
              color="white"
            >
              fas fa-plus</v-icon>
            <font color="white">CSV取り込み</font>
          </v-btn>
        </v-layout>
      </v-container> 
    </v-card>
    <SendingDialog />
    <AddCsvModal />
  </v-dialog>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import Editorform from './editor-form';
import ListSelector from '../../components/group/list-selector';
import RegisterGroupList from '../../components/group/register-group-list';
import SendingDialog from '../../components/group/sending-dialog';
import AddCsvModal from '../../components/group/add-csv-modal';

export default {
  name: 'GroupResisterModalComponent',
  components: {
    Editorform,
    ListSelector,
    RegisterGroupList,
    SendingDialog,
    AddCsvModal
  },
  computed: {
    ...mapState('group/register', ['selectedList', 'addedGroups']),
    modalIsOpen: {
      get() {
        return this.$store.state.group.register.modalOpen;
      },
      set(value) {
        this.SWITCH_OPEN({ modal: 'register', value: value });
      }
    }
  },
  mounted() {
    this.RESET_GROUPS();
  },
  methods: {
    ...mapMutations('group/register', [
      'SWITCH_OPEN',
      'SET_SUBMITTING',
      'RESET_GROUPS'
    ]),
    ...mapActions('group/register', ['openModal', 'ConfirmandRegister']),
    OpenAddPage() {
      this.openModal('add');
    },
    OpenAddCsvPage() {
      this.openModal('add-csv');
    }
  }
};
</script>
<style scoped>
</style>
