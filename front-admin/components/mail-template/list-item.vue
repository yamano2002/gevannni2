<template>
  <MailViewer 
    :mail="mailData" 
    :body-vars="template.variables" 
    class="blue-grey lighten-5">
    <v-btn
      slot="header-right"
      color="primary"
      depressed
      @click="openEditor(template.tag)">
      <v-icon
        small
        class="mr-2"
      >
        edit
      </v-icon>
      編集
    </v-btn>
  </MailViewer>
</template>

<script>
import SEND_MAIL_SETTING_TAG from '../../../enums/sendMailSettingTag';
import { mapGetters, mapActions } from 'vuex';
import MailViewer from '../common/mail-viewer';

export default {
  name: 'MailTemplateListItemComponent',
  components: { MailViewer },
  props: {
    template: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters('sendMailSetting', {
      findSendMailSettingByTag: 'findByTag'
    }),
    mailData() {
      return {
        from_address_name: this.template.from_address_name,
        from_address: this.fromAddress,
        reply_to: this.template.reply_to,
        subject: this.template.subject,
        body: this.prcdBody
      };
    },
    fromAddress() {
      const localPart = this.template.from_address_local_part;
      if (!localPart) {
        return null;
      }

      const domain = this.findSendMailSettingByTag(
        SEND_MAIL_SETTING_TAG.FROM_ADDRESS_DOMAIN
      ).value;
      return `${localPart}@${domain}`;
    },
    prcdBody() {
      let body = this.template.body || '';

      if (this.template.has_sign) {
        const footerSign = this.findSendMailSettingByTag(
          SEND_MAIL_SETTING_TAG.MAIL_FOOTER_SIGN
        ).value;
        body += `\n<span class="footer-sign">${footerSign}</span>`;
      }

      return body;
    }
  },
  methods: {
    ...mapActions('mailTemplate', ['openEditor'])
  }
};
</script>

<style lang="stylus">
  .footer-sign
    color #828d92
</style>
