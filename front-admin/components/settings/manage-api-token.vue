<template>
  <section>
    <v-layout>
      <v-flex>
        <h2 class="mb-2">API Token 管理</h2>
        <p>
          API を利用するための Token です。
        </p>
      </v-flex>
      <v-flex
        d-flex
        class="align-self-center shrink">
        <v-btn
          color="primary"
          class="white--text"
          @click="generateToken"
        >
          <v-icon
            left
            small>fa-redo-alt</v-icon>
          Token 再生成
        </v-btn>
      </v-flex>
    </v-layout>
    <v-card class="pa-3">
      {{ apiToken }}
    </v-card>
  </section>
</template>

<script>
export default {
  name: 'ManageApiToken',
  data() {
    return {
      apiToken: null
    };
  },
  async created() {
    const { token } = await this.$axios.$get('/api_token');
    this.apiToken = token;
  },
  methods: {
    async generateToken() {
      const { token } = await this.$axios.$post('/api_token/generate');
      this.apiToken = token;

      this.$store.dispatch('notification/push', {
        text: 'API Token を生成しました',
        type: 'success'
      });
    }
  }
};
</script>

<style scoped>
</style>
