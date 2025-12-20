import { Table, TextInput, Text, Group, Center, Modal, Button } from "@mantine/core";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { post } from "../../Util/http";
import { autoHttpResponseNotification } from "../../Util/notifications";
import { SocialsKeys, type Socials } from "../../Util/cache";


export interface SocialsDisplayEditProps {
  /**
   * Data of the socials
   */
  data: {[K in keyof Socials]: string};
};


function SocialsDisplayEdit({ data }: SocialsDisplayEditProps) {

  const [tempEdit, setTempEdit] = useState<string>("");
  const [localData, setLocalData] = useState(data);
  const [discs, setDiscs] = useState<{[K in keyof Socials]: boolean}>(Object.fromEntries(SocialsKeys.map((val) => {return [val, false]})) as {[K in keyof Socials]: boolean});

  function setDisc(at: keyof Socials, val: boolean) {
    setDiscs(prevDiscs => ({...prevDiscs, [at]: val}))
    if (!val) {
      setTempEdit("");
    }
  }

  async function editSocial(which: keyof Socials) {
    let res = await post('/users/socials', { [which]: tempEdit });
    if (res) {
      autoHttpResponseNotification(res, true);
      if (res.status === 200) {
        setLocalData((prevLocalData) => ({...prevLocalData, [which]: tempEdit}))
      }
    }
  }

  return (<>
  <Table>
    {
      SocialsKeys.map((val) => {return (<>
        <Table.Tr>
          <Table.Td>
            <Text>
              {val}
            </Text>
          </Table.Td>
          <Table.Td>
            <Group>
              <Text>
                {(localData[val as keyof Socials]) ? localData[val as keyof Socials] : "-"}
              </Text>
              <Center onClick={() => setDisc(val as keyof Socials, true)} p="7px" w="fit-content" bdrs="10%" bg="blue" style={{aspectRatio: "1/1", cursor: 'pointer'}} ><FaEdit size="1rem" /></Center>
            </Group>
          </Table.Td>
        </Table.Tr>
        <Modal opened={discs[val as keyof Socials]} onClose={() => setDisc(val as keyof Socials, false)}>
          <TextInput label={val} value={tempEdit} onChange={(e) => {setTempEdit(e.currentTarget.value)}} />
          <Button onClick={() => editSocial(val as keyof Socials)} >OK</Button>
        </Modal>
      </>);})
    }
  </Table>
  </>);
}

export default SocialsDisplayEdit;