import styles from "./About.module.css"
import StyledBtn from "../../Components/StyledBtn/StyledBtn.jsx"
import MainPageLayout from "../../Components/common/MainPageLayout/MainPageLayout.jsx"


const About = () => {

	return (
		<MainPageLayout>
			<div style={ { minHeight: '80vh', marginBottom: '50px' } }>
				<div className={ styles.bannerWrapper }>
					<img src="/about-banner.jpeg" alt="" className={ styles.img }/>
				</div>
				<div className={ styles.textOuterWrapper }>
					<div className={ styles.textInnerWrapper }>
						<div className={ styles.textBox }>
							<h1 className={ styles.textHeader }>Какво е Намери БГ?</h1>
							<p className={ styles.textParagraph }>Онлайн платформата nameri.bg дава свят от възможности
								за
								намиране и предлагане на работа. По
								този начин свързваме хората, които предлагат услуги, с тези, които търсят.</p>
						</div>
						<div className={ styles.textBox }>
							<h1 className={ styles.textHeader }>Защо Намери БГ?</h1>
							<p className={ styles.textParagraph }>nameri.bg дава бързо и сигурно решение при наемането и
								намирането на работа. Лесната
								регистрация позволява на всеки да превърне хобито си в печеливша дейност още днес.</p>
						</div>
						<div className={ styles.textBox }>
							<h1 className={ styles.textHeader }>Мисия</h1>
							<p className={ styles.textParagraph }>Мисията на nameri.bg е да интегрира всеки в работния
								процес. По тозиначин ще създадем
								общество от работещи, знаещи и можещи хора.</p>
						</div>
					</div>
				</div>
				<div className={ styles.funnyWrapper }>
					<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
						<StyledBtn className={ styles.funnyBtn }>НАТИСНИ ТУК ЗА ПАРИ</StyledBtn>
					</a>
				</div>
			</div>
		</MainPageLayout>
	)
}

export default About