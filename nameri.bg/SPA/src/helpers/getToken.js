import Cookies from "js-cookie"

// Change this if storing the token on some storage, or anywhere else than a cookie.

const getToken = () => {
	return Cookies.get(process.env.REACT_APP_JWT_COOKIE_NAME)
}

export default getToken