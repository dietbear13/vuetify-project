<template>
  <v-container>
    <v-divider class="my-4">
      <h1 class="text-center">Детали розыгрыша</h1>
    </v-divider>
    <div v-if="giveaway">
      <p>Здесь находится информация о розыгрыше {{ giveaway.title }}</p>
      <v-list lines="one">
        <v-list-item v-for="channel in giveaway.channels" :key="channel.id">
          <v-card class="w-100 clickable-card" @click="openChannel(channel.link)">
            <v-card-title>
              <v-row class="align-center w-100">
                <v-col cols="3">
                  <v-img :width="124" aspect-ratio="16/9" class="mr-1" :src="channel.avatar"></v-img>
                </v-col>
                <v-col cols="6">
                  <v-list-item-content>
                    <v-list-item-title class="channel-name">{{ channel.name }}</v-list-item-title>
                  </v-list-item-content>
                </v-col>
                <v-col cols="6" class="text-right">
                  <template v-if="!channel.subscribed">
                    <v-btn class="custom-btn mx-2" elevation="24" color="primary" @click.stop="checkSubscription(channel)">
                      Проверить
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-icon color="green" class="mx-2">mdi-check-circle</v-icon>
                  </template>
                </v-col>
              </v-row>
            </v-card-title>
          </v-card>
        </v-list-item>
      </v-list>
      <v-btn class="custom-btn mt-4" elevation="24" color="primary" @click="goBack">Назад</v-btn>
    </div>
    <v-snackbar v-model="snackbar" :timeout="4000" top right :color="snackbarColor">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');

const giveaways = ref([]);

const loadGiveaways = async () => {
  try {
    const response = await axios.get('https://7519-45-8-144-35.ngrok-free.app/api/giveaways');
    giveaways.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки данных', error);
  }
};

onMounted(() => {
  loadGiveaways();
});

const giveaway = computed(() => giveaways.value.find(g => g._id === route.params.id));

const openChannel = (link) => {
  window.open(link, '_blank');
};

const checkSubscription = async (channel) => {
  try {
    const response = await axios.post('http://localhost:5173/api/check-subscription', {
      userId: 'USER_ID', // Замените на текущий userId
      channelId: channel.id,
      giveawayId: giveaway.value._id // Передаем ID розыгрыша
    });
    if (response.data.isMember) {
      channel.subscribed = true;
      snackbarMessage.value = 'Вы успешно подписались на канал';
      snackbarColor.value = 'green';
    } else {
      snackbarMessage.value = 'Вы не подписаны на канал';
      snackbarColor.value = 'red';
    }
    snackbar.value = true;
  } catch (error) {
    console.error('Ошибка проверки подписки', error);
    snackbarMessage.value = 'Ошибка проверки подписки';
    snackbarColor.value = 'red';
    snackbar.value = true;
  }
};

const goBack = () => {
  router.push({ name: 'GiveawayList' });
};
</script>

<style scoped>
.clickable-card {
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.clickable-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.channel-name {
  font-weight: bold;
  color: #1976d2;
  transition: color 0.3s;
}

.clickable-card:hover .channel-name {
  color: #1565c0;
}

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
