import { Stack, Group } from "@mantine/core";
import { useState, useEffect } from "react";

import PostDisplay, { type PostData } from "../Components/PostDisplay";
import BackToHomeButton from "../Components/BackToHomeButton";
import LangSwitch from "../Components/LangSwitch";
import { get } from "../Util/http";


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

    </>
  );
}

export default MyPostsPage;
