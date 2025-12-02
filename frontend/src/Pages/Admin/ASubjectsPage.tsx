import { Stack } from "@mantine/core";
import { useState, useEffect } from "react";

import Header from "../../Components/Clickables/Header";
import SubjectDisplay, { type SubjectData } from "../../Components/Displays/SubjectDisplay";
import AddSubject from "../../Components/Overlays/AddSubject";
import { get } from "../../Util/http";

import { useTranslation } from "react-i18next";

import classes from "../../styles/default.module.css"

/**
 * Admin subjects CR(U)D page
 */
function ASubjectsPage() {
  const { t } = useTranslation('homepage');
  const [subjects, setSubjects] = useState<SubjectData[]>([]);

  async function getSubjects() {
    let res = await get('/subjects');
    if (res) {
      setSubjects(((await res.json()).slist as SubjectData[]));
    }
  }

  useEffect(() => {
    getSubjects();
  }, []);

  return (
    <>
      <Stack className={classes.container}>
        <Header title={t('admin.subjects')} view="admin" />
        <Stack p={"md"}>
          {subjects.map((v) => <SubjectDisplay data={v} />)}
        </Stack>
        <AddSubject />
      </Stack>
    </>
  );
}

export default ASubjectsPage;