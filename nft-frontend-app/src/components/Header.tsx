import { MetaMaskButton } from 'rimble-ui';
import colors from '../config/colors';
import LanguageSelectionConnected from '../LanguageSelection/LanguageSelection.connected';
import { useTranslation } from "react-i18next";

declare const window: any;
interface Props {
  account: string;
  setConnectionSuccess: Function;
  setConnectionFailed: Function;
} 

function Header(props: Props) {
    const translations = useTranslation("translations");

    async function connectWithMetamask() {
      const {setConnectionSuccess, setConnectionFailed} = props;
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setConnectionSuccess(true);
        } catch (error:any) {
          if (error.code === 4001) {
            // User rejected request
          }
          setConnectionFailed(true);
        }
      }
    }
  

    return (
      <div>
        <div style={styles.warningMessage}>
          <span role="img" aria-label="warning">
            💀
          </span>{' '}
          {translations.t("projectBeta")}
          
        </div>
        <div style={styles.header}>
          <div style={styles.headerItemCenter}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <a style={styles.link} href="/" target='_blank'>
                <h1 style={styles.title}>{translations.t("title")}</h1>
              </a>
            </div>
            <div>
              <LanguageSelectionConnected />
            </div>
            
          </div>
          
          <div style={styles.headerItem}>
            {
              !props.account ?
                window.ethereum ?
                  <MetaMaskButton size="medium" className="MetamaskButton"
                    onClick={() => connectWithMetamask()}>{translations.t("connectWithMetamask")}</MetaMaskButton>
                  : <div>{translations.t("installMetamask")}</div>
                : null
            }
              </div>
        </div>
      </div>
    )
  }

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    headerItem: {
        margin: '1.25rem',
        display: 'flex',
        minWidth: 0,
        alignItems: 'center',
    },
    headerItemCenter: {
        marginLeft: '5%',
    },
    link: {
        color: '#FFFFFF',
        textDecoration: 'none',
    },
    title: {
        fontSize: '3rem',
        fontWeight: 400,
        color: colors.bluePurple
    },
    warningMessage: {
      cursor: 'pointer',
      flex: 1 ,
      alignItems: 'center',
      padding: '0.5rem 1rem',
      paddingRight: '2rem',
      marginBottom: '1rem',
      border: '1px solid',
      borderColor: colors.bluePurple,
      backgroundColor: colors.bluePurple,
      fontSize: '0.75rem',
      lineHeight: '1rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: colors.white,
    }
}
export default Header;