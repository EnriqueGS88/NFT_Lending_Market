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
    loanContract: any,
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


    async function borrow() {
        const {loanID} = props.loan;
        const ok = await props.loanContract.acceptLoanRequest(loanID);
        console.log("-------");
        console.log(ok);
        closeModal();
    }

const {lender, borrower, smartContractAddressOfNFT, tokenIdNFT, loanAmount, interestAmount, endLoanTimeStamp, maximumPeriod} = props.loan;
return (
    <li style={styles.listItem}>
        <Card border={1} borderColor={colors.bluePurple}>
            <h4>Loan Amount: <br/>{Number(ethers.BigNumber.from(loanAmount).toString()) / Math.pow(10, 18)} ETH</h4> 
            <div>
                <p><b>Interest:</b> <br/>{Number(ethers.BigNumber.from(interestAmount).toString()) / Math.pow(10, 18)} ETH</p>
                <p><b>End Loan Time Stamp:</b> <br/>{Number(ethers.BigNumber.from(endLoanTimeStamp).toString())}</p>
                <p><b>Max Period:</b> <br/>{Number(ethers.BigNumber.from(maximumPeriod).toString())} months</p>
                <p><b>Borrower:</b> {borrower}</p> 
                <p><b> NFT Smart Contract Address:</b>  {smartContractAddressOfNFT}</p> 
                <p><b>NFT ID:</b> {tokenIdNFT}</p>
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
                    <Text>Sure to lend: {Number(ethers.BigNumber.from(loanAmount).toString()) / Math.pow(10, 18)} ETH ?</Text>
                </Box> 
         

                <Flex
                px={4}
                py={3}
                borderTop={1}
                borderColor={"#E8E8E8"}
                justifyContent={"flex-end"}
                >
                <Button.Outline onClick={closeModal}>{translations.t("cancel")}</Button.Outline>
                <Button ml={3} onClick={async ()=> await borrow()}>{translations.t("confirm")}</Button>
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