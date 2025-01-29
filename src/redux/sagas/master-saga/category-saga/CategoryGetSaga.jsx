import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  fetchCategorysRequest,
  fetchCategorysSuccess,
  fetchCategorysFailure,
} from "../../../slices/master-slice/categort-slice/CategortGetSlice";

function* fetchCategorys() {
  try {
    /** Retrieve API endpoint & token **/
    const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
    const API_URL = `${API_END_POINT}/category`;
    const token = localStorage.getItem("token");

    /** Ensure token is available **/
    if (!token) {
      throw new Error("Token not found");
    }

    /** Make API request with Authorization header **/
    const response = yield call(axios.get, API_URL, {
      headers: {
        "Content-Type": "application/json", // Ensure JSON compatibility
        Authorization: `Bearer ${token}`,
      },
    });

    /** Dispatch success action with the fetched data **/
    yield put(fetchCategorysSuccess(response.data));
  } catch (error) {
    /** Dispatch failure action with the error message **/
    yield put(fetchCategorysFailure(error.response?.data?.message || error.message));
  }
}

/** Watcher saga to trigger fetchCategorys on fetchCategorysRequest action **/
function* watchFetchCategorys() {
  yield takeEvery(fetchCategorysRequest.type, fetchCategorys);
}

export default watchFetchCategorys;
