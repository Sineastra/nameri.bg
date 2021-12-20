import MainPageLayout from "../../Components/common/MainPageLayout/MainPageLayout.jsx"
import styled from "styled-components"
import { useContext, useEffect, useRef, useState } from "react"
import userServices from "../../../services/userServices.js"
import UserContext from "../../Contexts/UserContext.jsx"
import styles from "./Messages.module.css"
import MsgBigChat from "../../Components/MsgBigChat/MsgBigChat.jsx"
import MsgConversations from "../../Components/MsgConversations/MsgConversations.jsx"
import useFetch from "../../../hooks/useFetch.jsx"
import Spinner from "../../Components/Spinner/Spinner.jsx"
import { useLocation } from "react-router-dom"


const PageSection = styled.section`
  width: 100%;
  margin-top: 5%;
  margin-bottom: 5%;
`

const Messages = (props) => {
	const location = useLocation()
	const [user, _] = useContext(UserContext)
	const { isLoadingData, data, setData } = useFetch(() => userServices.getAllUserMessages(user._id, user))
	const [index, setIndex] = useState(null)

	const changeMsg = _id => {
		const index = data.conversations.findIndex(x => x._id === _id)

		setIndex(index)
	}

	useEffect(() => {
		if (!isLoadingData && location.state.conversationId) {
			changeMsg(location.state.conversationId)
		}
	}, [isLoadingData])

	return (
		isLoadingData
			? <Spinner/>
			: <MainPageLayout>
				<PageSection>
					<div className={ styles.outerWrapper }>
						<div className={ styles.mainHeader }>
							<h1>Съобщения</h1>
						</div>
						<div className={ styles.mainWrapper }>
							<section className={ styles.bigCont }>
								<MsgBigChat
									data={ data }
									index={ index } setData={ setData }
								/>
							</section>
							<section className={ styles.smallCont }>
								<MsgConversations messages={ data.conversations } changeMsg={ changeMsg }/>
							</section>
						</div>
					</div>
				</PageSection>
			</MainPageLayout>

	)
}

export default Messages