import SearchBar from "../SearchBar/SearchBar.jsx"
import styles from "./CategoriesPagesHeader.module.css"


const CategoriesPagesHeader = ({ categoryName, className, onSubmitSearch }) => {

	return (
		<section className={ `${ styles.headingOuter } ${ className }` }>
			<div className={ styles.headingInner }>
				<h1>{ categoryName }</h1>
			</div>
			<div className={ `${ styles.headingInner } ${ styles.headingInnerSearch }` }>
				<div className={ styles.searchBarWrapper }>
					<SearchBar placeholder={ "Търси категория" } onSearchSubmit={ onSubmitSearch }/>
				</div>
			</div>
		</section>
	)
}

export default CategoriesPagesHeader