import { Stack, Group, Title } from "@mantine/core";
import { useState, useEffect } from "react";

import PostDisplay, { type PostData } from "../Components/PostDisplay";
import BackToHomeButton from "../Components/BackToHomeButton";
import LangSwitch from "../Components/LangSwitch";
import { get } from "../Util/http";

import classes from '../styles/mypostspage.module.css'


function MyPostsPage() {
  async function getUserPosts() {
    let res = await get('/posts/user');
    if (res?.status === 200) {
      setPosts((await res.json()));
    }
  }

  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    getUserPosts();
  }, [])

  return (
    <>
      <Stack className={classes.container}>
        <Group justify="space-between">
          <Title order={2}>My posts</Title>
          <LangSwitch />
          <BackToHomeButton />
        </Group>
        <Stack>
          {posts.map((p) => <PostDisplay data={p} view='edit' />)}
        </Stack>
      </Stack>
    </>
  );
}

export default MyPostsPage;
