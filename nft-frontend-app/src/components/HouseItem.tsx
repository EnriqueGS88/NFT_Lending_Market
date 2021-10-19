/* eslint-disable react/jsx-pascal-case */
import { useState }  from 'react';

import { Card, Button, Modal, ToastMessage, Flex, Box, Heading, Text} from 'rimble-ui';
import colors from '../config/colors';
import { House } from '../dtos/houses';
import { useTranslation } from "react-i18next";


declare const window: any;

interface Props {
    house: House;
} 

function HouseItem(props: Props) {
    const [isModalOpen, setModalOpen] = useState(false);

    const translations = useTranslation("translations");

    function closeModal(){
        setModalOpen(false);
    }
    
    function openModal(){
        setModalOpen(true);
    };


    function liquidate() {
        window.toastProvider.addMessage("Implementing...", {
            secondaryMessage: "This functionality will be available soon",
            colorTheme: "dark"
        })
    }

const {title, image, description, location, price, contact, url} = props.house;
return (
    <li style={styles.listItem}>
        <Card bg={colors.softGrey}>
            <h4>{title}</h4> 
            <table><tr>
                    <td>
                        <a href={url}>
                        <img src={image} alt="imageHouse" width="500" height="400" /></a>
                    </td>
                    <td>
                        <h6>{translations.t("location")}: {location}</h6> 
                        <h6>{translations.t("price")}: {price} . {translations.t("contact")}: {contact} </h6> 
                        <div style={styles.description}><p>{description}</p></div>
                        <Button size={'medium'} onClick={()=> openModal()}>{translations.t("liquidate")}</Button>
                    </td>
            </tr></table>
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
                    <Text>{translations.t("sureToLiquidate")}: {title}?</Text>
                </Box>

                <Flex
                px={4}
                py={3}
                borderTop={1}
                borderColor={"#E8E8E8"}
                justifyContent={"flex-end"}
                >
                <Button.Outline onClick={closeModal}>{translations.t("cancel")}</Button.Outline>
                <Button ml={3} onClick={()=> liquidate()}>{translations.t("confirm")}</Button>
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
export default HouseItem;