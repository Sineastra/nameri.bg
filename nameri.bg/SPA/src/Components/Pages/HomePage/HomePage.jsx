import MainPageLayout from "../../Components/common/MainPageLayout/MainPageLayout.jsx"
import HeadPageBanner from "../../Components/HeadPageBanner/HeadPageBanner/HeadPageBanner.jsx"
import SiteAdvertBanner from "../../Components/SiteAdvertBanner/SiteAdvertBanner.jsx"
import PopularCategories from "../../Components/PopularCategories/PopularCategories/PopularCategories.jsx"
import CategoriesList from "../../Components/CategoriesList/CategoriesList/CategoriesList.jsx"


const HomePage = () => {

	return (
		<MainPageLayout>
			<HeadPageBanner/>

			<main>
				{/*START OF POPULAR CATEGORIES SECTION*/}
				<PopularCategories/>
				{/*END OF POPULAR CATEGORIES SECTION*/}

				{/* START OF SMALL CATEGORIES SECTION*/}
				<CategoriesList/>
				{/* END OF SMALL CATEGORIES SECTION*/}
			</main>

			{/*START OF SITE ADVERT BANNER SECTION*/}
			<SiteAdvertBanner/>
			{/*END OF SITE ADVERT BANNER SECTION*/}
		</MainPageLayout>
	)
}

export default HomePage