<template>
  <div>
    <MailEditor
      v-model="isOpen"
      :input="input"
      :variables="variables">
      <div
        slot="title">メール作成</div>

      <v-btn
        slot="toolbar-items"
        dark
        flat
        @click="send"
      >
        <v-icon class="mr-3">send</v-icon>
        送信
      </v-btn>

      <DestViewer class="mt-4"/>
    </MailEditor>

    <DestSelectModal/>
    <SendingDialog/>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import MailEditor from '../../common/mail-editor';
import DestSelectModal from '../destinations/selector-modal';
import DestViewer from '../destinations/viewer';
import SendingDialog from './sending-dialog';

export default {
  name: 'CreateMailEditorComponent',
  components: { MailEditor, DestSelectModal, DestViewer, SendingDialog },
  computed: {
    ...mapState('createMail/editor', ['variables']),
    isOpen: {
      get() {
        return this.$store.state.createMail.editor.modalOpen;
      },
      set(value) {
        this.SWITCH_OPEN(value);
      }
    },
    input: {
      get() {
        return this.$store.state.createMail.editor.input;
      },
      set(value) {
        this.SET_INPUT(value);
      }
    }
  },
  methods: {
    ...mapMutations('createMail/editor', ['SWITCH_OPEN', 'SET_OPEN']),
    ...mapActions('createMail/editor', ['send'])
  }
};
</script>

<style scoped>
</style>
