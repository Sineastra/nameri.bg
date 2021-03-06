import styles from "./CategoriesList.module.css"
import SingleListCategory from "../SingleListCategory/SingleListCategory.jsx"
import { useContext } from "react"
import HomePageContext from "../../../Contexts/HomePageContext.jsx"
import { Link } from "react-router-dom"


const CategoriesList = (props) => {
	const [contextData] = useContext(HomePageContext)
	const subCategories = contextData.subCategories

	return (
		<section className={ styles.randomCategoriesCont }>
			<div className={ styles.randomCatsInnerCont }>
				{ subCategories.map(category => (
					<div className={ styles.randomCatsSingleCont } key={ category._id }>
						<Link to={ `/categories/${ category._id }` }
						      className={ styles.mainHeader }>{ category.name }</Link>
						<div className={ styles.innerRandom }>
							{ category.subcategories.map(subCat => (
								<SingleListCategory
									key={ subCat._id }
									_id={ subCat._id }
									name={ subCat.name }
									listings={ subCat.listings }
									className={ styles.singleCat }
								/>))
							}
						</div>
					</div>
				)) }
			</div>
		</section>
	)
}

export default CategoriesList