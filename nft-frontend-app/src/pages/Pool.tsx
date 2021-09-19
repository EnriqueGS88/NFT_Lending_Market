import React, {useEffect, useState }  from 'react';
import { ethers } from 'ethers';
import { Button, ToastMessage, EthAddress, Box, Input, Field, Modal, Flex, Card, Heading, Text} from 'rimble-ui';

declare const window: any;
function Pool() {
    const [myAddress, setMyAddress] = useState('');
    const [poolBalance, setPoolBalance] = useState(0);
    const [pntkMyBalance, setMyPntkBalance] = useState(0);
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
            <h3>Pool</h3>
            {myAddress !== '' &&
                <div>
                    <h6>Pool balance: {poolBalance} ETH - Pool Address:</h6>
                    <EthAddress style={styles.input} address={'0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2'} />
                    
                    <h6>Your PNTK balance: {pntkMyBalance} PNTK</h6>
                    <p>You can deposit ETH and you will receive the same amount in PNTK</p>
                    <Box>
                        <Field label={"ETH available to deposit"}>
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
                    <Button size={'medium'} onClick={()=> openModal()}>Deposit Eth</Button>

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
                                <Text>Are you sure you want to deposit {ethToBorrow} ETH in to the pool?</Text>
                            </Box>

                            <Flex
                            px={4}
                            py={3}
                            borderTop={1}
                            borderColor={"#E8E8E8"}
                            justifyContent={"flex-end"}
                            >
                            <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                            <Button ml={3} onClick={()=> depositETH()}>Confirm</Button>
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
    input: {
        width: '50%',
        marginLeft: '25%'
    },
}
export default Pool;