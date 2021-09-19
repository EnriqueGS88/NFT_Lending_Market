import React, {useEffect, useState }  from 'react';
import { ethers } from 'ethers';
import { Button, ToastMessage, Box, Flex, Field, Input, Text, Modal, Card, Heading } from 'rimble-ui';
import colors from '../config/colors';

declare const window: any;
function Loans() {
    const [myAddress, setMyAddress] = useState('');
    const [collateralBalance, setCollateralBalance] = useState(0);
    const [ethToBorrow, setEthToBorrow] = useState(0);
    const [isModalOpen, setModalOpen] = useState(false);


    useEffect(() => {
        const getMyAccount = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setMyAddress(address);
        }
        getMyAccount();
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
            <h3>Borrow ETH</h3>
            {myAddress !== '' &&
                <div>
                    <div>
                    <p>Hi {myAddress} !</p>
                    <p>Your collateral balance: {collateralBalance} ETH</p>
                    </div>
                    <div>
                    <Box>
                        <Field label={"You have "+calculateAvailableToBorrow()+ "ETH available to borrow"}>
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
                    <Button size={'medium'} onClick={()=> openModal()}>Borrow</Button>
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
                                <Heading.h3>Confirm the loan</Heading.h3>
                                <Text>Are you sure you want to borrow {ethToBorrow} ETH?</Text>
                            </Box>

                            <Flex
                            px={4}
                            py={3}
                            borderTop={1}
                            borderColor={"#E8E8E8"}
                            justifyContent={"flex-end"}
                            >
                            <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                            <Button ml={3} onClick={()=> borrow()}>Confirm</Button>
                            </Flex>
                        </Card>
                    </Modal>
                    
                    <ToastMessage.Provider ref={(node: any) => (window.toastProvider = node)} />

                </div>
            }
            {myAddress === '' &&
                <p>Connect with your Metamask Wallet</p>
            }

        </div>
    )
  }

const styles = {
    box: {
        textAlign: 'center',
        backgroundColor: colors.wisteriaPurple
    },
}
export default Loans;