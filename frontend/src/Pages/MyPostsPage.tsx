import { Stack } from "@mantine/core";
import { useState, useEffect } from "react";

import Header from "../Components/Clickables/Header";
import PostDisplay, { type PostData } from "../Components/Displays/PostDisplay";
import { get } from "../Util/http";
import { autoHttpResponseNotification } from "../Util/notifications";
import { typedates } from "../Util/autotype";

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
    setPosts(typedates(js.posts, ['CreatedAt', 'RemoveAt']));
  }

  const { t } = useTranslation('userpages');

  const [posts, setPosts] = useState<PostData[]>([]);

  /**
   * Locally remove a post from the UI, exposed to PostDisplay
   * @param _id Id of the post
   */
  function UIremovePost(_id: string) {
    setPosts(posts.filter((val) => val._id !== _id));
  }

  useEffect(() => {
    getUserPosts();
  }, [])

  return (
    <>
      <Stack className={classes.container}>
        <Header title={t('userposts.title')} view="user" />
        <Stack p={"md"}>
          {posts.map((p) => <PostDisplay data={p} view='edit' removeSelf={() => UIremovePost(p._id)} />)}
        </Stack>
      </Stack>
    </>
  );
}

export default MyPostsPage;
