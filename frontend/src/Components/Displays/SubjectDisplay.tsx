import { Paper, Text, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FaTrashAlt } from 'react-icons/fa';

import Popup from '../Overlays/Popup';
import { autoHttpResponseNotification } from '../../Util/notifications';
import { deletef } from '../../Util/http';

import { useTranslation } from 'react-i18next';

import classes from '../../styles/default.module.css'


/**
 * Subject data
 */
export interface SubjectData {
  /**
   * Id of the subject
   */
  _id: string;

  /**
   * Shorthand name for the subject
   */
  Subject: string;
};

/**
 * Props for the SubjectDisplay component
 */
export interface SubjectDisplayProps {
  /**
   * Data from db
   */
  data: SubjectData;

  /**
   * Function called when the post wants to remove itself from parent component
   */
  removeSelf: () => void;
};

function SubjectDisplay({data, removeSelf}: SubjectDisplayProps) {
  const { t } = useTranslation('components');
  const [deleteDisc, deleteDiscController] = useDisclosure(false);

  async function deleteSubject() {
    let res = await deletef('/subjects', {subjectid: data._id});
    if (res) {
      autoHttpResponseNotification(res);
      if (res.status === 200) {
        removeSelf();
      }
    }
  }

  return (
    <>
      <Paper p={"lg"} className={classes.outline}>
        <Group justify='space-between'>
          <Text>{data.Subject}</Text>
          <Button onClick={deleteDiscController.open} size='compact-md'><FaTrashAlt /></Button>
        </Group>
      </Paper>

      <Popup line={t('subjectdisplay.delete')} open={deleteDisc} onNo={deleteDiscController.close} onYes={deleteSubject} />
    </>
  );
}

export default SubjectDisplay;
