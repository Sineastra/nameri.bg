import styles from "./MsgSmallCard.module.css"
import { useContext } from "react"
import UserContext from "../../Contexts/UserContext.jsx"


const MsgSmallCard = ({ messageData, changeMsg }) => {
	const [user] = useContext(UserContext)
	const lastMsg = messageData.messages[messageData.messages.length - 1].text

	const participants = messageData.participants
		.filter(x => x._id !== user._id)
		.map(x => x.nameAndSurname)
		.join(",")

	return (
		<div className={ styles.mainWrapper } onClick={ () => changeMsg(messageData._id) }>
			<div className={ styles.innerWrapper }>
				<div className={ styles.headingWrapper }>
					<h3 className={ styles.styledMsgHeader }>Разговор със: <span
						className={ styles.particSpan }>{ participants }</span></h3>
				</div>
				<div className={ styles.contentWrapper }>
					<div className={ styles.singleMsg }>{ lastMsg }</div>
				</div>
			</div>
		</div>
	)
}

export default MsgSmallCard