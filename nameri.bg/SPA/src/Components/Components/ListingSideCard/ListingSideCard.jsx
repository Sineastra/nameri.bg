import styles from "./ListingSideCard.module.css"
import UserRatingHeading from "../UserRatingHeading/UserRatingHeading.jsx"
import { useContext, useState } from "react"
import TextModal from "../TextModal/TextModal.jsx"
import Rating from "../Rating/Rating.jsx"
import userServices from "../../../services/userServices.js"
import StyledBtn from "../StyledBtn/StyledBtn.jsx"
import { Link } from "react-router-dom"
import UserContext from "../../Contexts/UserContext.jsx"
import UtilityContext from "../../Contexts/UtilityContext.jsx"


const ListingSideCard = ({ listing, setData }) => {
	const [user] = useContext(UserContext)
	const [rating, setRating] = useState(0)
	const [hoverRating, setHoverRating] = useState(0)
	const { processRequest } = useContext(UtilityContext)
	const [modalVisible, setModalVisible] = useState(false)

	const ratings = [1, 2, 3, 4, 5]
	const isOwnProfile = user && user._id !== listing.user._id
	const reviewsForDisplay = listing.user.reviews.sort((a, b) => a.rating - b.rating).slice(0, 3)

	//TODO: see to make the rating its own component. It has no place here.

	const addRating = (rating) => {
		setHoverRating(rating)
	}

	const pickRating = (rating) => {
		setRating(rating)
		setHoverRating(rating)
	}

	const onMouseLeave = () =>
		pickRating === 0 ? setHoverRating(0) : setHoverRating(rating)

	const closeModal = () => {
		setModalVisible(false)
		setRating(0)
		setHoverRating(0)
	}

	const sendReview = async (e) => {
		e.preventDefault()

		const formData = new FormData(e.target)
		const message = formData.get('message')

		const reviewData = {
			reviewText: message,
			reviewRating: rating,
		}

		const data = await processRequest(() => userServices.addReview(reviewData, listing.user._id, listing._id))

		if (data !== undefined) {
			setData(oldData => ({ ...oldData, listing: data }))
			closeModal()
		}
	}

	return (
		<div className={ styles.mainFlexContainer }>
			<TextModal
				onSubmit={ sendReview }
				closeModal={ closeModal }
				subHeader={ <Rating
					addRating={ addRating }
					pickRating={ pickRating }
					onMouseLeave={ onMouseLeave }
					hoverRating={ hoverRating }
					ratings={ ratings }
				/> }
				header="Оцени потребител"
				placeholder="Напиши твоето ревю (Не е задължително)..."
				backdropClassName={ styles.ratingModal }
				visibleState={ modalVisible }
				wrapperClassName={ styles.modalWrapper }
			/>

			<div className={ `${ styles.userInfo }` }>
				<div className={ styles.mainHeadingOuterWrapper }>
					<UserRatingHeading
						user={ listing.user }
						rating={ listing.user.rating }
						showVotes={ true }
						profileImgClassName={ styles.profileImgClass }
						headingClassName={ styles.userNames }
						ratingBoxWrapperClassName={ styles.ratingBoxWrapper }
						wrapperClassName={ styles.userWrapper }
					/>
				</div>
				<div className={ styles.userInfoBtnsWrapper }>
					{ isOwnProfile &&
						<StyledBtn
							className={ `${ styles.styledBtn } ${ styles.styledBtnReverted }` }
							onClick={ () => setModalVisible(true) }
							text="Оцени"
						/> }
					<Link to={ `/profile/${ listing.user._id }` } className={ styles.styledBtn }>
						<StyledBtn text="Профил на потребителя" className={ styles.styledBtnInner }/>
					</Link>
				</div>
			</div>

			<div className={ `${ styles.pricesInfoWrapper }` }>
				<h1 className={ styles.pricesWrapperHeading }>Колко ще ми струва: </h1>
				<div className={ styles.pricesInfoOuter }>
					<div className={ styles.pricesInfoInner }>
						<div
							className={ styles.priceItem }>{ listing.price > 0 ? `${ listing.price } лв.` : 'По договаряне' }
						</div>
					</div>
				</div>
			</div>

			{ reviewsForDisplay.length > 0
				? <div className={ `${ styles.ratingsInfo }` }>
					{ reviewsForDisplay.map(review => (
						<div className={ styles.reviewElem } key={ review._id }>
							<div className={ styles.reviewInnerFlexItem }>
								<UserRatingHeading
									user={ review.reviewCreator }
									rating={ review.rating }
									showVotes={ false }
									wrapperClassName={ styles.userHeadingWrapperReview }
									profileImgClassName={ styles.reviewProfileImg }
									ratingBoxWrapperClassName={ styles.ratingBoxWrapperClassName }
									headingClassName={ styles.userReviewHeadingClass }
								/>
							</div>
							<div
								className={ `${ styles.reviewInnerFlexItem } ${ styles.reviewInnerTextItem }` }><span
								className={ styles.overflowSpan }>{ review.text }</span></div>
						</div>
					)) }
				</div>
				: <div className={ styles.emptyReviews }>
					<h2 className={ styles.emptyReviewsHeader }>Този потребител все още няма ревюта</h2>
				</div>
			}
		</div>
	)
}

export default ListingSideCard