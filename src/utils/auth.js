import Cookies from "js-cookie";

const TokenKey = "senhe_token";
const RefreshToken = "senhe_refresh_token";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function getRefreshToken() {
  return Cookies.get(RefreshToken);
}

export function setToken(token, refreshToken) {
  Cookies.set(TokenKey, token);
  Cookies.set(RefreshToken, refreshToken);
}

export function refreshToken(token) {
  Cookies.remove(TokenKey);
  Cookies.set(TokenKey, token);
}

export function removeToken() {
  Cookies.remove(TokenKey);
}

export function logoutRemoveToken() {
  Cookies.remove(TokenKey);
  Cookies.remove(RefreshToken);
}
