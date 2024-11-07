////redux/sagas/memebr-saga/GetAllMemberSaga.jsx


import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  fetchAllMembersRequest,
  fetchAllMembersSuccess,
  fetchAllMembersFailure,
} from "../../slices/member-slice/GetAllmemberSlices";

/** Worker saga to fetch products**/
function* fetchAllMembers() {
  const API_URL = "http://88.222.245.236:3002/api/user/all";
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
    yield put(fetchAllMembersSuccess(response.data));
    // console.log("Fetched Products:", response.data);
  } catch (error) {
    /** Dispatch failure action with the error message **/
    yield put(fetchAllMembersFailure(error.message));
  }
}

/** Watcher saga to trigger fetchProducts on fetchProductsRequest action **/
function* watchFetchAllMembers() {
  yield takeEvery(fetchAllMembersRequest.type, fetchAllMembers);
}

export default watchFetchAllMembers;
