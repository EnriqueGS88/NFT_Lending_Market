import React, {useEffect, useState }  from 'react';
import { Button, ToastMessage, Box, Flex, Field, Input, Text, Modal, Card, Heading } from 'rimble-ui';
import colors from '../config/colors';
import { AccountProps } from '../components/Tabs';
import { useTranslation } from "react-i18next";

declare const window: any;
function Loans(props: AccountProps) {
    const [collateralBalance, setCollateralBalance] = useState(0);
    const [ethToBorrow, setEthToBorrow] = useState(0);
    const [isModalOpen, setModalOpen] = useState(false);

    const translations = useTranslation("translations");

    
    useEffect(() => {
        setCollateralBalance(0);
    },[]);

    function borrow() {
        window.toastProvider.addMessage("Implementing...", {
            secondaryMessage: "This functionality will be available soon",
            colorTheme: "dark"
        });
        closeModal();
    }

    function calculateAvailableToBorrow() {
        return collateralBalance;
    }

    function closeModal(){
        setModalOpen(false);
    }
    
    function openModal(){
        setModalOpen(true);
    };

    return (
        <div>
            <h3>{translations.t("borrowETH")}</h3>
            {props.account !== '' &&
                <div>
                    <div>
                    <p>{props.account} !</p>
                    <p>{translations.t("collateralBalance", { collateralBalance: collateralBalance }) }</p>
                    </div>
                    <div>
                    <Box>
                        <Field label={"You have "+calculateAvailableToBorrow()+ " ETH available to borrow"}>
                        <Input
                            type="number"
                            min={0}
                            step={0.01}
                            onChange={(e:any) => {
                                setEthToBorrow(e.target.value);
                            }}
                            value={ethToBorrow}
                            required={true}
                        />
                        </Field>
                    </Box>
                    <Button size={'medium'} onClick={()=> openModal()}>{translations.t("borrow")}</Button>
                    </div>

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
                                <Heading.h3>{translations.t("confirmLoan")}</Heading.h3>
                            <Text>{translations.t("sureToBorrow", { quantity: ethToBorrow })}Are you sure you want to borrow {ethToBorrow} ETH?</Text>
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

                </div>
            }
            {props.account === '' &&
                <p>{translations.t("connectMetamask")}</p>
            }

        </div>
    )
  }

const styles = {
    box: {
        textAlign: 'center',
        backgroundColor: colors.bluePurple
    },
}
export default Loans;