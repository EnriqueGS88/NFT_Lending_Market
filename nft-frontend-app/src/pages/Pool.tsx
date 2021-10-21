/* eslint-disable react/jsx-pascal-case */
import React, {useEffect, useState }  from 'react';
import { Button, ToastMessage, EthAddress, Box, Input, Field, Modal, Flex, Card, Heading, Text} from 'rimble-ui';
import { AccountProps } from '../components/Tabs';
import { useTranslation } from "react-i18next";

declare const window: any;
function Pool(props: AccountProps) {
    const [poolBalance, setPoolBalance] = useState(0);
    const [pntkMyBalance, setMyPntkBalance] = useState(0);
    const [ethToBorrow, setEthToBorrow] = useState(0);
    const [isModalOpen, setModalOpen] = useState(false);

    const translations = useTranslation("translations");

 
    useEffect(() => {
        setPoolBalance(0);
        setMyPntkBalance(0);
    },[]);

    function closeModal(){
        setModalOpen(false);
    }
    
    function openModal(){
        setModalOpen(true);
    };

    function depositETH() {
        window.toastProvider.addMessage("Implementing...", {
            secondaryMessage: "This functionality will be available soon",
            colorTheme: "dark"
        })
    }

    return (
        <div>
            <h3>{translations.t("pool")}</h3>
            {props.account !== '' &&
                <div>
                    <h6>{translations.t("poolBalance", {poolBalance: poolBalance})}</h6>
                    <EthAddress style={styles.input} address={' '} />
                    
                    <h6>{translations.t("pntkBalance", { pntkBalance: pntkMyBalance }) }</h6>
                <p>{translations.t("depositEthReceivePntk")}</p>
                    <Box>
                        <Field label={translations.t("ethAvailableDeposit", {eth: props.ethBalance})}>
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
                    <Button size={'medium'} onClick={()=> openModal()}>{translations.t("depositEth")}</Button>

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
                                <Text>{translations.t("sureToDeposit", {quantity: ethToBorrow})}</Text>
                            </Box>

                            <Flex
                            px={4}
                            py={3}
                            borderTop={1}
                            borderColor={"#E8E8E8"}
                            justifyContent={"flex-end"}
                            >
                            <Button.Outline onClick={closeModal}>{translations.t("cancel")}</Button.Outline>
                            <Button ml={3} onClick={()=> depositETH()}>{translations.t("confirm")}</Button>
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
    input: {
        width: '50%',
        marginLeft: '25%'
    },
}
export default Pool;