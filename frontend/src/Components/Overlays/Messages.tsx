import { Button, Modal, Stack, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { FiMessageCircle } from "react-icons/fi";
import { get } from "../../Util/http";
import MessageDisplay, {type MessageData} from "../Displays/MessageDisplay";

import { useTranslation } from "react-i18next";


/**
 * Button to show popup with messages
 */
function Messages() {
  const [modalDisc, modalDiscController] = useDisclosure(false);

  const [messages, setMessages] = useState<MessageData[]>([]);

  const { t } = useTranslation();

  async function getMessages() {
    let res = await get('/messages');
    if (res) {
      if (res.status === 200) setMessages((await res.json()).msgs);
    }
  }

  useEffect(() => {
    getMessages();
  }, [])

  return (
    <>
      <Button onClick={modalDiscController.open}><FiMessageCircle /></Button>
      <Modal opened={modalDisc} onClose={modalDiscController.close}>
        <Stack>
          {
            (messages.length > 0) ?
              messages.map((val) => <MessageDisplay key={val._id} data={val} />)
            :
              <Text>{t('messagedisplay.nomsg')}</Text>
          }
        </Stack>
      </Modal>
    </>
  );
}

export default Messages;
