import React, {useEffect} from "react"

import {Dropdown, Navbar, NavItem, NavLink} from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import Messages from "./Messages"
import UserMenu from "./UserMenu"
import GomiTools from "./GomiTools";
import {useDispatch, useSelector} from "react-redux";
import {requestGetMessages} from "../../store/modules/messages";
import {requestGetAdmins} from "../../store/modules/admins";

export default function Header({ setSidebarShrink, sidebarShrink }) {
  const dispatch = useDispatch();
  const messages = useSelector((state)=>state.messages);

  useEffect(() => {
    dispatch(requestGetMessages());
    dispatch(requestGetAdmins());
  }, [])

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
          <Messages messages={messages}/>
          <UserMenu />
        </div>
      </Navbar>
    </header>
  )
}
