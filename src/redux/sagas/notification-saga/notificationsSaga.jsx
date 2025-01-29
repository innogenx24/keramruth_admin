// src/sagas/notificationsSaga.js

import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { 
  fetchNotificationsFailure, 
  fetchNotificationsStart, 
  fetchNotificationsSuccess 
} from '../../slices/notification-slice/notificationsSlice';

// API call function
const fetchNotificationsApi = (userRole) => {
  const token = localStorage.getItem('token'); // Retrieve the token from local storage
  if (!token) throw new Error('Token not found'); // Handle missing token

  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT; // Environment variable for API endpoint

  // Axios GET request with Authorization header
  return axios.get(`${API_END_POINT}/month_notifications/notifications/${userRole}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Set the Bearer token in Authorization header
    },
  });
};

// Worker Saga: Handles the API call and state updates
function* fetchNotificationsSaga(action) {
  try {
    const response = yield call(fetchNotificationsApi, action.payload); // Call API with userRole
    yield put(fetchNotificationsSuccess(response.data.notifications)); // Dispatch success with notifications
  } catch (error) {
    yield put(fetchNotificationsFailure(error.message)); // Dispatch failure with error message
  }
}

// Watcher Saga: Listens for fetchNotificationsStart actions
function* notificationsSaga() {
  yield takeLatest(fetchNotificationsStart.type, fetchNotificationsSaga); // Listen for fetchNotificationsStart action
}

export default notificationsSaga;
