<template>
  <div>
    {{ appName }}
  </div>
</template>

<script>
import appConfig from '../../../config/app';

export default {
  name: 'AppNameComponent',
  computed: {
    appName() {
      return appConfig.APP_NAME_ADMIN;
    }
  }
};
</script>

<style scoped>
</style>
