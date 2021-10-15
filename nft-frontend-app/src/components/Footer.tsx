import colors from '../config/colors';



function Footer() {
  
    return (
        <footer className="footer" style={{backgroundColor: colors.bluePurple, width: '100%', textAlign: 'right'}}>
        <div style={styles.warningMessage}>
        © 2021. Real Estate Asset Token + DeFi Banking. UPC Master Blockchain 2021 Team
        </div>
        </footer>
    )
  }

const styles = {
   
    warningMessage: {
        padding: '1rem',
        color: colors.white,
        marginRight: '5%',
    }
}
export default Footer;