import React from 'react'
import '../Profile/Profile.css'
import ProfileHead from '../../components/profileHeader/ProfileHead'
import PostsView from '../../components/PostsView/PostsView'

const Profile = () => {
  return (
    <>
      <ProfileHead />
      <PostsView />
    </>
  )
}

export default Profile