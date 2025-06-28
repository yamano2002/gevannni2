<template>
  <v-layout d-block>
    <v-flex 
      v-if="authFailed" 
      class="mb-4">
      <v-alert
        :value="true"
        type="error"
      >
        ユーザー名またはパスワードが違います。
      </v-alert>
    </v-flex>
    <v-flex 
      v-if="sessionExpired" 
      class="mb-4">
      <v-alert
        :value="true"
        type="error"
      >
        セッションの有効期限が切れました。お手数ですが再度認証してください。
      </v-alert>
    </v-flex>

    <v-flex 
      xs12 
      sm6 
      offset-sm3>
      <form @submit.prevent="attemptLogin">
        <v-card>

          <v-card-title primary-title>
            <div>
              <div class="headline">認証</div>
            </div>
          </v-card-title>

          <v-card-text>
            <v-flex class="mb-3">
              公式サイトに記載のユーザー名・パスワードを入力してください。
            </v-flex>

            <v-text-field
              v-model="username"
              label="ユーザー名"
              prepend-icon="fas fa-user"
              autofocus
              required/>
            <v-text-field
              v-model="password"
              label="パスワード"
              prepend-icon="fas fa-lock"
              type="password"
              required/>
          </v-card-text>

          <v-divider light/>

          <v-card-actions class="pa-2">
            <v-layout 
              d-flex 
              justify-center>
              <v-btn
                color="primary"
                flat
                type="submit">ログイン</v-btn>
            </v-layout>
          </v-card-actions>

        </v-card>
      </form>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  computed: {
    ...mapState('auth', ['authFailed', 'sessionExpired'])
  },
  methods: {
    ...mapMutations('auth', ['AUTH_FAILED']),
    attemptLogin() {
      const self = this;
      this.$store
        .dispatch('auth/requestAccessToken', {
          username: this.username,
          password: this.password
        })
        .then(function() {
          self.$router.push('/');
        })
        .catch(function(e) {
          self.AUTH_FAILED();
        });
    }
  }
};
</script>

<style scoped>
</style>
