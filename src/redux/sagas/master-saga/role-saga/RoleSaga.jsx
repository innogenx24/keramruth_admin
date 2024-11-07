import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  fetchRolesRequest,
  fetchRolesSuccess,
  fetchRolesFailure,
} from "../../../slices/master-slice/role-slice/RoleGetSlice";

function* fetchRoles() {
  const API_URL = `http://88.222.245.236:3002/roles/role-list`;
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
    yield put(fetchRolesSuccess(response.data));
    // console.log("Fetched Products:", response.data);
  } catch (error) {
    /** Dispatch failure action with the error message **/
    yield put(fetchRolesFailure(error.message));
  }
}

/** Watcher saga to trigger fetchProducts on fetchProductsRequest action **/
function* watchFetchRoles() {
  yield takeEvery(fetchRolesRequest.type, fetchRoles);
}

export default watchFetchRoles;
