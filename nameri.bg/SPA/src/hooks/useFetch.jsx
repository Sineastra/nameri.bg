import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


const useFetch = (fetchData, deps = [], partialLoading = false, setPartialLoading = null) => {
	const navigate = useNavigate()
	const [isLoadingData, setIsLoadingData] = useState(true)
	const [data, setData] = useState({})

	useEffect(() => {
		partialLoading ? setPartialLoading(true) : setIsLoadingData(true)

		fetchData()
			.then(fetchedData => {
				setData(fetchedData)
				partialLoading ? setPartialLoading(false) : setIsLoadingData(false)
			})
			.catch(e => {
				console.log(e)
				navigate("/error", {
					state: {
						statusCode: e.statusCode, status: e.status, msg: e,
					},
				})

			})

	}, deps)

	return {
		isLoadingData,
		setIsLoadingData,
		data,
		setData,
	}
}

export default useFetch