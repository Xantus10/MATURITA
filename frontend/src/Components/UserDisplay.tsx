import { Title as ManTitle, Text, Modal, Group, Stack, Paper, Code, Grid, Menu, Button, NumberInput, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Popup from "./Popup";
import PopupAsk from "./PopupAsk";
import { useTranslation } from "react-i18next";
import { post, deletef } from "../Util/http";
import { autoHttpResponseNotification } from "../Util/notifications";


export interface BanData {
  CreatedAt: Date;
  Until: Date;
  IssuedBy: string;
  Reason: string;
}

export interface UserData {
  _id: string;
  MicrosoftId: string;
  Name: {
    First: string;
    Last: string;
  };
  Role: 'user' | 'admin';
  LastLogin: Date;
  Bans: BanData[];
};

export interface UserDisplayProps {
  data: UserData;
};

function PostDisplay({data}: UserDisplayProps) {
  const {_id, MicrosoftId, Name, Role, LastLogin, Bans} = data;
  const [deleteDisc, deleteDiscController] = useDisclosure(false);

  const { t } = useTranslation();

  async function DeleteUser() {
      let res = await deletef(`/users/${_id}`);
      if (res) autoHttpResponseNotification(res, true);
  }

  return (
    <>
    <Paper>
      <Group gap='xl' justify="space-between" p={"md"} >
        <ManTitle order={2}>{Name.First} {Name.Last}</ManTitle>
        <Code>{Role}</Code>
        <Button onClick={deleteDiscController.open}>DELETE</Button>
      </Group>
    </Paper>

    
    <Popup line="Do you really want to delete" open={deleteDisc} onNo={deleteDiscController.close} onYes={DeleteUser} />
    </>
  );
}

export default PostDisplay;
