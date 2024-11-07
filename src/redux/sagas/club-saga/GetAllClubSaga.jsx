// redux/sagas/club-saga/GetAllClubSaga.jsx

import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  fetchAllClubsRequest,
  fetchAllClubsSuccess,
  fetchAllClubsFailure,
} from "../../slices/club-slice/GetAllClubSlices";

/** Worker saga to fetch clubs **/
function* fetchAllClubs() {
  const API_URL = "http://88.222.245.236:3002/club";
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = yield call(axios.get, API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    yield put(fetchAllClubsSuccess(response.data));
  } catch (error) {
    yield put(fetchAllClubsFailure(error.message));
  }
}

/** Watcher saga to trigger fetchClubs on fetchAllClubsRequest action **/
function* watchFetchAllClubs() {
  yield takeEvery(fetchAllClubsRequest.type, fetchAllClubs);
}

export default watchFetchAllClubs;
