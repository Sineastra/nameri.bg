import { useState, useEffect, useContext, useRef } from 'react'
import Slide from "../Slide/Slide.jsx"
import styled from "styled-components"
import NavDot from "../NavDot/NavDot.jsx"
import HomePageContext from "../../../../Contexts/HomePageContext.jsx"
import useInterval from "../../../../../hooks/useInterval.jsx"


const StyledNavDot = styled(NavDot)`
  //display: inline-block;
  //margin-right: 20px;
`

const StyledLi = styled.li`
  list-style: none;
  display: inline-block;
  margin-right: 1vw;

  @media screen and (max-width: 863px) {
    margin-right: 3vw;
  }

  @media screen and (max-width: 320px) {
    margin-right: 5vw;
  }
`

const NavDotsContainer = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
`

const NavDotsInnerCont = styled.ul`
  display: inline-flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;

`

const SlidesWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 90%;
`

const Carousel = ({ className }) => {
	const [activeId, setActiveId] = useState(0)
	const [timeDelay, setTimeDelay] = useState(null)
	const [contextData] = useContext(HomePageContext)
	const carouselData = contextData.listings
	const isFirstSlide = useRef(true)

	const changeActiveIdIdle = () => {
		if (carouselData && carouselData.length > 0) {
			const index = carouselData.findIndex(x => x._id === activeId)
			const newIndex = carouselData[index + 1] ? index + 1 : 0

			if (isFirstSlide.current) {
				isFirstSlide.current = false
			}

			setActiveId(carouselData[newIndex]._id)
		}
	}

	useInterval(changeActiveIdIdle, timeDelay)

	const changeActiveIdClick = (newId) => {

		if (activeId !== newId) {
			setTimeDelay(null)
			setActiveId(newId)
		}

		if (isFirstSlide.current) {
			isFirstSlide.current = false
		}

	}

	useEffect(() => {
		if (carouselData && carouselData.length > 0) {
			setTimeDelay(4000)
			setActiveId(carouselData[0]._id)
		}
	}, [carouselData])

	useEffect(() => {
		if (timeDelay === null) {
			setTimeDelay(4000)
		}
	}, [timeDelay])

	return (
		<section className={ className }>
			<SlidesWrapper>
				{ carouselData.map((listing, index) =>
					<Slide
						listing={ listing }
						key={ listing._id }
						activeId={ activeId }
						isFirstSlide={ isFirstSlide }
						index={ index }
					/>) }
			</SlidesWrapper>
			<NavDotsContainer>
				<NavDotsInnerCont>
					{ carouselData.map((listing) => (<StyledLi key={ listing._id }>
						<StyledNavDot
							id={ listing._id }
							activeId={ activeId }
							changeId={ changeActiveIdClick }
						/>
					</StyledLi>)) }
				</NavDotsInnerCont>
			</NavDotsContainer>
		</section>
	)
}

export default Carousel