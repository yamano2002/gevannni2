<template>
  <transition-group 
    class="notification-area" 
    name="notification-item" 
    tag="div">
    <v-alert
      v-for="item in items"
      :key="item.key"
      :value="true"
      :type="item.type"
      class="notification-item"
    >
      <v-layout>
        <v-layout class="notification-item-content">{{ item.text }}</v-layout>
        <v-spacer/>
        <v-layout class="notification-item-close">
          <v-btn
            dark
            flat
            icon
            small
            @click="POP(item.key)"
          >
            <v-icon small>close</v-icon>
          </v-btn>
        </v-layout>
      </v-layout>
    </v-alert>
  </transition-group>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'NotificationsComponent',
  computed: {
    ...mapState('notification', ['items'])
  },
  methods: {
    ...mapMutations('notification', ['POP'])
  }
};
</script>

<style scoped>
.notification-area {
  position: fixed;
  left: 20px;
  bottom: 20px;
  width: 100%;
  z-index: 1000;
}

.notification-item {
  transition: all 0.5s;
  margin: 15px 0 0 0;
  width: 300px;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
}
.notification-item-enter,
.notification-item-leave-to {
  opacity: 0;
  transform: translateY(100px);
}
.notification-item-leave-active {
  position: absolute;
  bottom: 0;
}

.notification-item-content {
  align-self: center;
  max-width: 200px;
}
.notification-item-close {
  align-self: center;
}
</style>
