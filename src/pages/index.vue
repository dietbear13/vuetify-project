<template>
  <v-container>
    <v-divider class="my-4">
      <h1 class="text-center">Розыгрыши</h1>
    </v-divider>
    <v-row>
      <v-col v-for="giveaway in giveaways" :key="giveaway._id" cols="12" md="6">
        <v-card @click="viewGiveaway(giveaway._id)" class="my-2">
          <v-card-title>
            <v-img :width="230" class="mr-3" :src="giveaway.image">
            </v-img>
            <div>
              <div>{{ giveaway.title }}</div>
              <div>{{ giveaway.description }}</div>
            </div>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const giveaways = ref([]);
const router = useRouter();

const loadGiveaways = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/giveaways');
    giveaways.value = response.data.filter(giveaway => giveaway.title); // фильтрация пустых элементов
  } catch (error) {
    console.error('Ошибка загрузки данных', error);
  }
};

onMounted(() => {
  loadGiveaways();
});

const viewGiveaway = (id) => {
  router.push({ name: 'GiveawayDetail', params: { id } });
};
</script>

<style scoped>
.custom-btn {
  width: 150px;
  background-color: #1976d2;
  color: white;
  transition: background-color 0.3s;
}

.custom-btn:hover {
  background-color: #1565c0;
}
</style>
