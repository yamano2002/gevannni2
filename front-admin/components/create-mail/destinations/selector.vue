<template>
  <v-container 
    fluid 
    fill-height>
    <v-layout row>
      <v-flex 
        grow 
        class="same-flex-basis">
        <v-layout fill-height>
          <SubLeft class="grow"/>
        </v-layout>
      </v-flex>

      <v-flex shrink>
        <v-layout 
          column 
          fill-height 
          justify-center>
          <v-btn 
            :disabled="countSelectedGrps < 1" 
            color="primary" 
            @click="addListToTmpDests">
            <v-icon>fa-arrow-right</v-icon>
          </v-btn>
          <v-btn
            :disabled="!existSelected"
            color="primary" 
            @click="removeSelectedDests">
            <v-icon>fa-arrow-left</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>

      <v-flex 
        grow 
        class="same-flex-basis">
        <v-layout fill-height>
          <SubRight class="grow"/>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SubLeft from './selector-sub-left';
import SubRight from './selector-sub-right';

export default {
  name: 'DestinationSelectorComponent',
  components: { SubLeft, SubRight },
  computed: {
    ...mapGetters('createMail/destination/candidates', ['countSelectedGrps']),
    ...mapGetters('createMail/destination/tmpDests', ['existSelected'])
  },
  methods: {
    ...mapActions('createMail/destination/candidates', ['addListToTmpDests']),
    ...mapActions('createMail/destination/tmpDests', ['removeSelectedDests'])
  }
};
</script>

<style scoped>
.same-flex-basis {
  flex-basis: 100px;
}
</style>
