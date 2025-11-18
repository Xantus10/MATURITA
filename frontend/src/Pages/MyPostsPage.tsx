import { Stack, Group, Title } from "@mantine/core";
import { useState, useEffect } from "react";

import PostDisplay, { type PostData } from "../Components/Displays/PostDisplay";
import BackToHomeButton from "../Components/Clickables/BackToHomeButton";
import LangSwitch from "../Components/Clickables/LangSwitch";
import { get } from "../Util/http";
import { autoHttpResponseNotification } from "../Util/notifications";

import classes from '../styles/default.module.css';

import { useTranslation } from 'react-i18next';

/**
 * Page with user's posts
 */
function MyPostsPage() {
  async function getUserPosts() {
    let res = await get('/posts/user');
    if (res) autoHttpResponseNotification(res);
    let js = await res?.json();
    setPosts(js.posts);
  }

  const { t } = useTranslation('userpages');

  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    getUserPosts();
  }, [])

  return (
    <>
      <Stack className={classes.container}>
        <Group justify="space-between" className={classes.header}>
          <Title order={2} className={classes.title1}>{t('userposts.title')}</Title>
          <LangSwitch />
          <BackToHomeButton />
        </Group>
        <Stack p={"md"}>
          {posts.map((p) => <PostDisplay data={p} view='edit' />)}
        </Stack>
      </Stack>
    </>
  );
}

export default MyPostsPage;
