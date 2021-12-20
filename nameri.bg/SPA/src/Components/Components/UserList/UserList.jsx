import styles from "./UserList.module.css"
import { Link } from "react-router-dom"


const UserList = ({ user }) => {
	const profileImg = user.profileImg === "" ? "/profile.png" : user.profileImg

	return (
		<Link className={ styles.contentWrapper } to={ `/profile/${ user._id }` }>
			<div className={ styles.imgSection }>
				<img src={ profileImg } alt="" className={styles.img}/>
			</div>
			<div className={ styles.userInfoSection }>
				<div className={ styles.userLinkInnerDiv }>
					<h1 className={ styles.nameHeader }>{ user.nameAndSurname }</h1>
				</div>
				<div className={ `${ styles.userLinkInnerDiv } ${ styles.smallDivsWrapper }` }>
					<div className={ styles.smallInnerDiv }>Имейл: <span
						className={ styles.colorSpan }>{ user.email }</span></div>
					<div className={ styles.smallInnerDiv }>Рейтинг: <span
						className={ styles.colorSpan }>{ user.rating }</span></div>
				</div>
				<div className={ styles.aboutDiv }>За мен: <span
					className={ styles.colorSpan }>{ user.about }</span></div>
			</div>
		</Link>
	)
}

export default UserList