<template>
  <v-layout justify-center>
    <form @submit.prevent="attemptLogin">
      <v-card>
        <v-toolbar 
          flat 
          card 
          dense>
          <v-toolbar-title>Sign in</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-text-field 
            v-model="username" 
            label="username" 
            prepend-icon="fas fa-user" 
            autofocus
            required/>
          <v-text-field 
            v-model="password" 
            label="password" 
            prepend-icon="fas fa-lock" 
            type="password" 
            required/>
        </v-card-text>

        <v-divider light/>

        <v-card-actions class="pa-2">
          <v-layout justify-center>
            <v-btn 
              color="primary" 
              flat 
              type="submit">Sign in</v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </form>
  </v-layout>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    attemptLogin() {
      const self = this;
      this.$store
        .dispatch('auth/requestAccessToken', {
          username: this.username,
          password: this.password
        })
        .then(function() {
          self.$store.dispatch('notification/push', {
            text: 'ログインしました',
            type: 'success'
          });
          self.$router.push('/');
        })
        .catch(function(e) {
          self.$store.dispatch('notification/push', {
            text: e.response.data.message,
            type: 'error'
          });
        });
    }
  }
};
</script>

<style scoped>
</style>
