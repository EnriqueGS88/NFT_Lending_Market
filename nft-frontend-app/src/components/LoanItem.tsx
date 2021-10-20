/* eslint-disable react/jsx-pascal-case */
import { useState }  from 'react';
import { ethers } from 'ethers';
import { Card, Button, Modal, ToastMessage, Flex, Box, Heading, Text} from 'rimble-ui';
import colors from '../config/colors';
import { useTranslation } from "react-i18next";
import { Loans } from '../dtos/loans';


declare const window: any;

interface Props {
    loan: Loans;
} 

function LoanItem(props: Props) {
    const [isModalOpen, setModalOpen] = useState(false);

    const translations = useTranslation("translations");

    function closeModal(){
        setModalOpen(false);
    }
    
    function openModal(){
        setModalOpen(true);
    };


    function borrow() {
        window.toastProvider.addMessage("Implementing...", {
            secondaryMessage: "This functionality will be available soon",
            colorTheme: "dark"
        });
        closeModal();
    }

const {lender, borrower, smartContractAddressOfNFT, tokenIdNFT, loanAmount, interestAmount, endLoanTimeStamp, maximumPeriod} = props.loan;
return (
    <li style={styles.listItem}>
        <Card bg={colors.softGrey}>
            <h4>Loan Amount: {Number(ethers.BigNumber.from(loanAmount).toString()) / Math.pow(10, 18)}</h4> 
            <div>
                 <h6>Borrower: {borrower}</h6> 
                 <h6>SC Address: {smartContractAddressOfNFT} . NFT ID: {tokenIdNFT} </h6> 
                <div style={styles.description}><p>Interest: {Number(ethers.BigNumber.from(interestAmount).toString()) / Math.pow(10, 18)}</p></div>
                        <div style={styles.description}><p>End Loan Time Stamp{Number(ethers.BigNumber.from(endLoanTimeStamp).toString())}</p></div>
                        <div style={styles.description}><p>Max Period: {Number(ethers.BigNumber.from(maximumPeriod).toString())}</p></div>
                        <Button size={'medium'} onClick={()=> openModal()}>Lend</Button>
            </div>
        </Card>
        <Modal isOpen={isModalOpen}>
            <Card width={"420px"} p={0}>
                <Button.Text
                    icononly
                    icon={"Close"}
                    color={"moon-gray"}
                    position={"absolute"}
                    top={0}
                    right={0}
                    mt={3}
                    mr={3}
                    onClick={closeModal}
                />

                <Box p={4} mb={3}>
                    <Heading.h3>{translations.t("confirmLiquidation")}</Heading.h3>
                    <Text>Sure to lend: {loanAmount}?</Text>
                </Box>

                <Flex
                px={4}
                py={3}
                borderTop={1}
                borderColor={"#E8E8E8"}
                justifyContent={"flex-end"}
                >
                <Button.Outline onClick={closeModal}>{translations.t("cancel")}</Button.Outline>
                <Button ml={3} onClick={()=> borrow()}>{translations.t("confirm")}</Button>
                </Flex>
            </Card>
        </Modal>
                    
        <ToastMessage.Provider ref={(node: any) => (window.toastProvider = node)} />
    </li>
  )
}

const styles = {
  listItem: {
    marginRight: '3%',
    marginBottom: '5%'
  },
  description: {
    width: "80%",
    marginLeft: '10%'
  }
}
export default LoanItem;