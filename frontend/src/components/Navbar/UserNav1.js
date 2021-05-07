import React from 'react'
import 'antd/dist/antd.css'
import './index.css'
import { Layout, Menu } from 'antd'
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'

import UserPassword1 from '../../pages/User/UserPassword1'

const { Content, Sider } = Layout

const UserNav1 = () => {
  return (
    <Layout>
      <Sider
        breakpoint='sm'
        collapsedWidth='0'
        onBreakpoint={(broken) => {
          console.log(broken)
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type)
        }}
      >
        <Menu theme='light' mode='inline' defaultSelectedKeys={['4']}>
          <Menu.Item key='1' icon={<UserOutlined />}>
            nav 1
          </Menu.Item>
          <Menu.Item key='2' icon={<VideoCameraOutlined />}>
            nav 2
          </Menu.Item>
          <Menu.Item key='3' icon={<UploadOutlined />}>
            nav 3
          </Menu.Item>
          <Menu.Item key='4' icon={<UserOutlined />}>
            nav 4
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            className='site-layout-background'
            style={{ padding: 24, paddingTop: 10, minHeight: 360 }}
          >
            <UserPassword1 />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default UserNav1
