import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  fetchMembersRequest,
  fetchMembersSuccess,
  fetchMembersFailure,
} from "../../slices/member-slice/MemberGetSlice";


/** Worker saga to fetch products**/
function* fetchMembers(action) {
  const { roleId } = action.payload;
  const API_URL = `http://88.222.245.236:3002/api/user/role-user?role_id=${roleId}`;
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
    yield put(fetchMembersSuccess(response.data));
    // console.log("Fetched Products:", response.data);
  } catch (error) {
    /** Dispatch failure action with the error message **/
    yield put(fetchMembersFailure(error.message));
  }
}

/** Watcher saga to trigger fetchProducts on fetchProductsRequest action **/
function* watchFetchMembers() {
  yield takeEvery(fetchMembersRequest.type, fetchMembers);
}

export default watchFetchMembers;
