<template>
  <div class="container">
    <h2>{{ message('battlegrounds.title') }}</h2>
    <div class="container">
      <h3>{{ message('battlegrounds.territorial.title') }}</h3>
      <p>{{ message('battlegrounds.territorial.caption') }}</p>
      <section class="columns columns--reverse columns--middle">
        <TerritorialMap
          :lists="props.territorial.lists"
          :countings="props.territorial.countings" />
      </section>
    </div>
    <section class="container">
      <h3>{{ message('battlegrounds.national.title') }} </h3>
      <p>{{ message('battlegrounds.national.caption') }}</p>
      <NationalTable :results="props.national" />
      <Expander :toggler="message('battlegrounds.national.calculation')">
        {{ message('battlegrounds.national.description') }}
      </Expander>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI10n } from '/@/composables';
import { Expander } from '/@/components';
import TerritorialMap from './TerritorialMap.vue';
import NationalTable from './NationalTable.vue';
import type { TerritorialResults, NationalResults } from '/@/types';

const props = defineProps<{
  territorial: TerritorialResults;
  national: NationalResults;
}>();

const { message } = useI10n();
</script>
