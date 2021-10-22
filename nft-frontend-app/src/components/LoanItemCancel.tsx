/* eslint-disable react/jsx-pascal-case */
import { useState, useEffect }  from 'react';
import { ethers } from 'ethers';
import { Card, Button, Modal, ToastMessage, Flex, Box, Heading, Text} from 'rimble-ui';
import colors from '../config/colors';
import { useTranslation } from "react-i18next";
import { Loans } from '../dtos/loans';
import { Protocol } from '../dtos/protocol';
import Loader from 'react-loader-spinner';


declare const window: any;

interface Props {
    loan: Loans;
    loanContract: any,
    ethUsdPrice: any,
    protocolVariables: Protocol,
} 

function LoanItemCancel(props: Props) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [nftEthPrice, setNftEthPrice] = useState(0);
    const [isLoadingCancel, setIsLoadingCancel] = useState(false);

    const translations = useTranslation("translations");

    function closeModal(){
        setModalOpen(false);
    }
    
    function openModal(){
        setModalOpen(true);
    };


    async function cancel() {
        const { loanID } = props.loan;
        const loanEther = Number(loanAmount.toString()) / Math.pow(10, 18);
        const interestEther = loanEther * props.protocolVariables.interestRate / 100;
        const amountToReturn = loanEther + interestEther;
        let overrides = {
            value: ethers.utils.parseEther(amountToReturn.toString())   
        };
        try {
            await props.loanContract.endLoanRequest(loanID, overrides);
        } catch (error) {
            setIsLoadingCancel(false);
            console.log("error", error)
        }
        
        closeModal();
    }

    useEffect(() => {
        console.log(props.ethUsdPrice);
        if (props.ethUsdPrice > 0) {
            setNftEthPrice(Number((nftPrice/props.ethUsdPrice).toFixed(4)));
        }
    }, [props.ethUsdPrice])


    if (props.loanContract) {
        props.loanContract.on("LoansUpdated", (event: any) => {
            setIsLoadingCancel(false);
        })
    }

    const {lender, borrower, nftPrice, smartContractAddressOfNFT, tokenIdNFT, loanAmount, interestAmount, endLoanTimeStamp, maximumPeriod} = props.loan;
    return (
        <li style={styles.listItem}>
            <Card border={1} borderColor={colors.bluePurple}>
                {console.log(props.ethUsdPrice)}
            <h3> Token ID <br /> {props.loan.tokenIdNFT}</h3>
            <h4> {translations.t("nftEstimatedPrice")}: <br /> {nftEthPrice > 0 ? `${nftEthPrice} ETH` : null} </h4>
            <h4>{translations.t("loanAmount")}: <br/>{Number(ethers.BigNumber.from(loanAmount).toString()) / Math.pow(10, 18)} ETH</h4> 
            <div>
                <p><b>{translations.t("interest")}:</b> <br/>{Number(ethers.BigNumber.from(interestAmount).toString()) / Math.pow(10, 18)} ETH</p>
                <p><b>{translations.t("endLoanTimestamp")}:</b> <br/>{Number(ethers.BigNumber.from(endLoanTimeStamp).toString())}</p>
                <p><b>{translations.t("maxPeriod")}:</b> <br/>{Number(ethers.BigNumber.from(maximumPeriod).toString())} months</p>
                <p><b>{translations.t("borrower")}:</b> {borrower}</p> 
                <p><b> {translations.t("nftSCaddress")}:</b>  {smartContractAddressOfNFT}</p> 
                    <p><b>{translations.t("nftID")}:</b> {tokenIdNFT}</p>
                     {!isLoadingCancel ?
                        <Button size={'medium'} onClick={() => openModal()}>{translations.t("endTheLoan")}</Button>
                            : <Loader type="Oval" color="#000" height={70} width={70} />}
                   
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
                        <Text> {translations.t("sureToEndLoan")} {Number(ethers.BigNumber.from(loanAmount).toString()) / Math.pow(10, 18) + Number(ethers.BigNumber.from(interestAmount).toString()) / Math.pow(10, 18)} ETH ?</Text>
                    </Box> 
            

                    <Flex
                    px={4}
                    py={3}
                    borderTop={1}
                    borderColor={"#E8E8E8"}
                    justifyContent={"flex-end"}
                    >
                    <Button.Outline onClick={closeModal}>{translations.t("cancel")}</Button.Outline>
                       
                            <Button ml={3} onClick={async () => {
                                setIsLoadingCancel(true);
                                await cancel();
                            }
                            }>{translations.t("confirm")}</Button>
                            
                    
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
export default LoanItemCancel;