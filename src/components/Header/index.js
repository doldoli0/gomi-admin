import React from "react"

import {Dropdown, Navbar, NavItem, NavLink} from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import Notifications from "./Notifications"
import Messages from "./Messages"
import UserMenu from "./UserMenu"
import Search from "./Search"
import {faTwitter} from "@fortawesome/free-brands-svg-icons";
import Icon from "../Icon";
import GomiTools from "./GomiTools";

export default function Header({ setSidebarShrink, sidebarShrink }) {
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
          <Messages />
          <UserMenu />
        </div>
      </Navbar>
    </header>
  )
}
