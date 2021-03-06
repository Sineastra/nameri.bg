import styles from "./StyledBtn.module.css"


function StyledBtn ({ className = "", text, onClick, children }) {
	return (
		<button className={ `${ styles.styledBtn } ${ className }` } onClick={ onClick }>
			{ children }
			{ text }
		</button>
	)
}

export default StyledBtn