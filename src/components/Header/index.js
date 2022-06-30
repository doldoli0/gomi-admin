import React, {useEffect} from "react"

import {Dropdown, Navbar, NavItem, NavLink} from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import Messages from "./Messages"
import UserMenu from "./UserMenu"
import GomiTools from "./GomiTools";
import {useDispatch, useSelector} from "react-redux";
import {removeMessage, requestGetMessages} from "../../store/modules/messages";
import {requestGetAdmins} from "../../store/modules/admins";
import {useRouter} from "next/router";
import apiController from "../../lib/ApiController";

export default function Header({ setSidebarShrink, sidebarShrink }) {
  const dispatch = useDispatch();
  const messages = useSelector((state)=>state.messages);

  useEffect(() => {
    dispatch(requestGetMessages());
    dispatch(requestGetAdmins());
  }, [])

  const route = useRouter();
  const onClickMessage = (index) => {
    const postData = {'id':messages.data[index].id};
    dispatch(removeMessage(postData));
    apiController.post('/update/user/message', postData);

    switch (messages.data[index].action) {
      case 'message':
        route.push('/user/messages');
        return;
      case 'company':
        route.push(`/companies/${messages.data[index].action_id}`);
        return;
      case 'schedule':
        route.push(`/`);
        return;
    }
  }

  return (
    <header className="header">
      <Navbar
        bg="white"
        expand="lg"
        variant={false}
        className="px-4 py-2 shadow"
      >
        <a
          className="sidebar-toggler text-gray-500 me-4 me-lg-5 lead"
          href="#"
          onClick={() => setSidebarShrink(!sidebarShrink)}
        >
          <FontAwesomeIcon icon={faAlignLeft} />
        </a>
        <Link href="/" passHref>
          <Navbar.Brand className="fw-bold text-uppercase text-base">
            <span className="d-none d-brand-partial">GomiPayments</span>{" "}
            <span className="d-none d-sm-inline">Admin</span>
          </Navbar.Brand>
        </Link>
        <div className="ms-auto d-flex align-items-center mb-0">
          <GomiTools/>
          {/*<Search />*/}
          {/*<Notifications />*/}
          <Messages messages={messages} onClickMessage={onClickMessage}/>
          <UserMenu />
        </div>
      </Navbar>
    </header>
  )
}
