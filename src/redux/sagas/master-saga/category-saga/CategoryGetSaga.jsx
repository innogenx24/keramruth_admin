import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  fetchCategorysRequest,
  fetchCategorysSuccess,
  fetchCategorysFailure,
} from "../../../slices/master-slice/categort-slice/CategortGetSlice";

function* fetchCategorys() {
  const API_URL = `http://88.222.245.236:3002/category`;
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
    yield put(fetchCategorysSuccess(response.data));
    // console.log("Fetched Products:", response.data);
  } catch (error) {
    /** Dispatch failure action with the error message **/
    yield put(fetchCategorysFailure(error.message));
  }
}

/** Watcher saga to trigger fetchProducts on fetchProductsRequest action **/
function* watchFetchCategorys() {
  yield takeEvery(fetchCategorysRequest.type, fetchCategorys);
}

export default watchFetchCategorys;
