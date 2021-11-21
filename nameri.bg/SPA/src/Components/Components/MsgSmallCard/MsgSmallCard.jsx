import styles from "./MsgSmallCard.module.css"


const MsgSmallCard = ({ messageData, changeMsg }) => {
	const lastMsg = messageData.messages[messageData.messages.length - 1].text

	return (
		<div className={styles.mainWrapper} onClick={() => changeMsg(messageData.id)}>
			<div className={styles.innerWrapper}>
			<div className={styles.headingWrapper}>
				<h3>{messageData.sender.fullName}</h3>
			</div>
				<div className={styles.contentWrapper}>
					<div className={styles.singleMsg}>{lastMsg}</div>
				</div>
			</div>
		</div>
	)
}

export default MsgSmallCard