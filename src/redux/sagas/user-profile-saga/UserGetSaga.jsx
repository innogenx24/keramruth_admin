import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure
} from "../../slices/user-profile-slice/UserGetSlice";

function* fetchAdminUser() {
  const API_URL = "http://localhost:3002/api/admin/admin-details";
  try {
    /** Retrieve the token from localStorage **/
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    /** Make API request with the token in the Authorization header**/
    const response = yield call(axios.get, API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    /** Dispatch success action with the fetched data **/
    yield put(fetchUsersSuccess(response.data));
    // console.log("Fetched Products:", response.data);
  } catch (error) {
    /** Dispatch failure action with the error message **/
    yield put(fetchUsersFailure(error.message));
  }
}

/** Watcher saga to trigger fetchProducts on fetchProductsRequest action **/
function* watchFetchUser() {
  yield takeEvery(fetchUsersRequest.type, fetchAdminUser);
}

export default watchFetchUser;
