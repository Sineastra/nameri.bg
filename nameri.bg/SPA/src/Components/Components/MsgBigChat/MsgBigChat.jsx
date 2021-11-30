import styles from "./MsgBigChat.module.css"
import { AiOutlineMail } from "react-icons/ai"
import { IconContext } from "react-icons"
import uid from "../../../helpers/uniqueIDGenerator.js"


const EmptyMsgs = ({ className = '' }) => {

	return (
		<div className={ `${ styles.mainWrapper } ${ className }` }>
			<div className={ `${ styles.innerWrapper } ${ styles.innerWrapperEmpty }` }>
				<div className={ styles.noPostWrapper }>
					<IconContext.Provider value={ { size: '2.5em', color: "darkred" } }>
						<AiOutlineMail/>
						<h2>
							Нямаш съобщения в кутията.
						</h2>
					</IconContext.Provider>
				</div>
			</div>
		</div>
	)
}

const NonEmptyMsgs = ({ data, className = '' }) => {
	const participants = data.participants.map(x => x.nameAndSurname).join(",")

	const defineMsgClassName = (userId, messageSenderId) => {

		return userId === messageSenderId ? styles.singleMsgOwn : styles.singleMsgNotOwn
	}

	return (
		<div className={ `${ styles.mainWrapper } ${ className }` }>
			<div className={ styles.innerWrapper }>
				<div className={ styles.userNameHeader }>
					{ participants }
				</div>
				<div className={ styles.messagesContainer }>
					{ data.messages.map(message => (
						<div className={ styles.singleMsgWrapper } key={ uid() }>
							<div
								className={ `${ styles.singleMsg } ${ defineMsgClassName(data.user._id, message.sender) }` }>
								{ message.text }
							</div>
						</div>))
					}
				</div>
			</div>
		</div>
	)
}

const MsgBigChat = ({ data, className = '' }) => {
	return data ? <NonEmptyMsgs { ...{ data, className } }/> : <EmptyMsgs { ...{ className } }/>

}

export default MsgBigChat