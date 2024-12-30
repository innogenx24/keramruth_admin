// src/sagas/notificationsSaga.js

import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { fetchNotificationsFailure, fetchNotificationsStart, fetchNotificationsSuccess } from '../../slices/notification-slice/notificationsSlice';


// API call function
const fetchNotificationsApi = (userRole) => {
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  return axios.get(`${API_END_POINT}/month_notifications/notifications/${userRole}`);
};

// Worker Saga: Handles the API call and state updates
function* fetchNotificationsSaga(action) {
  try {
    const response = yield call(fetchNotificationsApi, action.payload); // Pass the userRole payload
    yield put(fetchNotificationsSuccess(response.data.notifications)); // Dispatch success with notifications
  } catch (error) {
    yield put(fetchNotificationsFailure(error.message)); // Dispatch failure with error message
  }
}

// Watcher Saga: Listens for fetchNotificationsStart actions
function* notificationsSaga() {
  yield takeLatest(fetchNotificationsStart.type, fetchNotificationsSaga); // Matches the action type
}

export default notificationsSaga;
