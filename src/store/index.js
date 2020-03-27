import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";

Vue.use(Vuex);

//公用状态部分
const state = {
  isLoading: false,
  networkState: true,
  cityName: "",
  cityCode: "",
  cityRate: {}, //当前城市利率
  provinceCode: "",
  provinceName: ""
};
const mutations = {
  updateLoadingStatus(state, payload) {
    state.isLoading = payload.isLoading;
  },
  updateNetworkState(state, payload) {
    state.networkState = payload.networkState;
  },
  updateCityName(state, payload) {
    state.cityName = payload;
  },
  updateCityCode(state, payload) {
    state.cityCode = payload;
  },
  updateCityRate(state, payload) {
    state.cityRate = payload;
  },
  updateProvinceCode(state, payload) {
    state.provinceCode = payload;
  },
  updateProvinceName(state, payload) {
    state.provinceName = payload;
  },
  updatePName(state, payload) {
    state.pName = payload;
  },
  updatePCode(state, payload) {
    state.pCode = payload;
  }
};

const store = new Vuex.Store({
  state,
  mutations,
  getters
});

export default store;
